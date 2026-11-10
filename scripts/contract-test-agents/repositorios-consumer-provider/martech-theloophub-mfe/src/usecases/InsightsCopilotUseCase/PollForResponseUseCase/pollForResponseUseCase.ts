import { extractLegacyCharts } from 'components/ai/utils/legacyChartConverter';
import {
  Artifact,
  Chart,
  PollingResponse,
  ProgressUpdate,
  RequestState,
} from 'models/InsightsCopilot';
import { pollForResponseService } from 'services/InsightsCopilotService';

export interface PollResult {
  answer: string;
  charts: Chart[];
  artifacts: Artifact[];
}

interface RawArtifact {
  question?: string;
  url?: string;
  link?: string;
  name?: string;
  type?: string;
}

export function normalizeArtifacts(raw: unknown[]): Artifact[] {
  return (raw as RawArtifact[])
    .map((item) => ({
      question: item.question || item.name || '',
      url: item.url || item.link || '',
      type: item.type,
    }))
    .filter((a) => a.url);
}

interface PollForResponseInput {
  conversationId: string;
  requestId: string;
  projectKey: string;
  onProgress?: (update: ProgressUpdate) => void;
  signal?: AbortSignal;
}

const MAX_WAIT_TIME = 2.5 * 60 * 1000;
const POLLING_DELAYS = {
  INITIAL: 100,
  MEDIUM: 500,
  INCREASED: 1000,
  MAXIMUM: 2000,
} as const;

const PROGRESS_MESSAGES: Record<string, string> = {
  planner: 'Planejando estratégia de resposta...',
  'data-retriever': 'Buscando dados relevantes...',
  'chart-generator': 'Gerando visualizações...',
  'sql-generator': 'Consultando base de dados...',
  'final-answer-generator': 'Preparando resposta final...',
  evaluator: 'Avaliando qualidade da resposta...',
};

const RETRY_BLOCKING_ERROR_MESSAGES = [
  'authentication',
  'Failed to fetch',
  'AI found an error',
];

function cancellableDelay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);

    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

function getDelayTime(attempt: number): number {
  if (attempt <= 10) return POLLING_DELAYS.INITIAL;
  if (attempt <= 20) return POLLING_DELAYS.MEDIUM;
  if (attempt <= 35) return POLLING_DELAYS.INCREASED;
  return POLLING_DELAYS.MAXIMUM;
}

function getProgressMessage(
  taskCode: string,
  requestState: RequestState,
): string {
  if (requestState === 'PENDING') {
    return 'Preparando análise...';
  }
  return PROGRESS_MESSAGES[taskCode] || 'Processando sua pergunta...';
}

function buildSuccessResult(finalEvent: PollingResponse): PollResult {
  const taskResponse = finalEvent.task_response;
  const agenticCharts = (taskResponse?.charts as Chart[]) ?? [];
  const charts =
    agenticCharts.length > 0
      ? agenticCharts
      : extractLegacyCharts(taskResponse?.tool_execution_history);

  return {
    answer: taskResponse?.final_answer || 'ERROR: empty response',
    charts,
    artifacts: normalizeArtifacts(taskResponse?.artifacts ?? []),
  };
}

function stringifyErrorMessage(errorMessage: unknown): string {
  if (typeof errorMessage === 'string') return errorMessage;
  if (errorMessage == null) return 'Unknown error';

  try {
    return JSON.stringify(errorMessage);
  } catch {
    return 'Unknown error';
  }
}

function buildFailureResult(errorEvent: PollingResponse): PollResult {
  return {
    answer: `ERROR: ${stringifyErrorMessage(
      errorEvent.task_response?.error_message,
    )}`,
    charts: [],
    artifacts: [],
  };
}

function getTerminalResult(events: PollingResponse[]): PollResult | undefined {
  const finalEvent = events.find(
    (event) =>
      event.task_code === 'final-answer-generator' &&
      event.request_state === 'SUCCESS',
  );

  if (finalEvent) return buildSuccessResult(finalEvent);

  const errorEvent = events.find((event) => event.request_state === 'FAILURE');
  if (errorEvent) return buildFailureResult(errorEvent);

  const abandonedEvent = events.find(
    (event) => event.request_state === 'ABANDONED',
  );
  if (!abandonedEvent) return undefined;

  return {
    answer: 'ERROR: ABANDONED',
    charts: [],
    artifacts: [],
  };
}

function notifyProgress(
  events: PollingResponse[],
  onProgress: PollForResponseInput['onProgress'],
  lastProgressMessage: string,
): string {
  if (!onProgress || events.length === 0) return lastProgressMessage;

  const lastEvent = events[events.length - 1];
  const progressMessage = getProgressMessage(
    lastEvent.task_code,
    lastEvent.request_state,
  );

  if (progressMessage === lastProgressMessage) return lastProgressMessage;

  const progressUpdate: ProgressUpdate = {
    stage: lastEvent.request_state,
    message: progressMessage,
    taskCode: lastEvent.task_code,
  };

  onProgress(progressUpdate);
  return progressMessage;
}

function shouldThrowPollingError(error: unknown): boolean {
  return (
    error instanceof Error &&
    RETRY_BLOCKING_ERROR_MESSAGES.some((message) =>
      error.message.includes(message),
    )
  );
}

function hasTimedOut(startTime: number): boolean {
  return Date.now() - startTime > MAX_WAIT_TIME;
}

export default async function pollForResponseUseCase(
  input: PollForResponseInput,
): Promise<PollResult> {
  let attempt = 0;
  const startTime = Date.now();
  let lastProgressMessage = '';

  while (true) {
    attempt++;

    if (hasTimedOut(startTime)) {
      return { answer: 'TIMEOUT', charts: [], artifacts: [] };
    }

    try {
      const events = await pollForResponseService({
        conversationId: input.conversationId,
        requestId: input.requestId,
        projectKey: input.projectKey,
        signal: input.signal,
      });

      const terminalResult = getTerminalResult(events);
      if (terminalResult) return terminalResult;

      lastProgressMessage = notifyProgress(
        events,
        input.onProgress,
        lastProgressMessage,
      );

      await cancellableDelay(getDelayTime(attempt), input.signal);
    } catch (error) {
      if (shouldThrowPollingError(error)) {
        throw error;
      }
      await cancellableDelay(getDelayTime(attempt), input.signal);
    }
  }
}
