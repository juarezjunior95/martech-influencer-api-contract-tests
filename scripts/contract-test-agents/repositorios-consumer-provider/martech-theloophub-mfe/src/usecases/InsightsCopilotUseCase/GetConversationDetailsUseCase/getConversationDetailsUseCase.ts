import { toAgentStep } from 'components/ai/components/organisms/ExecutionLog';
import { createAbandonedMessage } from 'components/ai/utils';
import { extractLegacyCharts } from 'components/ai/utils/legacyChartConverter';
import {
  Chart,
  ConversationRequest,
  GetConversationDetailsResponse,
  Message,
  PollingResponse,
} from 'models/InsightsCopilot';
import { getConversationDetailsService } from 'services/InsightsCopilotService';

import { normalizeArtifacts } from '../PollForResponseUseCase/pollForResponseUseCase';

interface GetConversationDetailsInput {
  conversationId: string;
  projectKey: string;
}

export interface PendingRequest {
  requestId: string;
  question: string;
}

export interface GetConversationMessagesResult {
  conversationId: string;
  messages: Message[];
  pendingRequest?: PendingRequest;
}

function parseSortKey(sortKey: string): number {
  return Number.parseInt(sortKey.split('-')[0], 10);
}

function getEarliestSortKey(req: ConversationRequest): number {
  const timestamps = (req.events ?? [])
    .map((e) => e.sort_key)
    .filter(Boolean)
    .map(parseSortKey)
    .filter((n) => !Number.isNaN(n));

  return timestamps.length > 0 ? Math.min(...timestamps) : 0;
}

function buildAssistantMessage(
  req: ConversationRequest,
  defaultTimestamp: string,
): Message | null {
  const abandonedEvent = req.events?.find(
    (event) => event.request_state === 'ABANDONED',
  );

  if (abandonedEvent) {
    return {
      ...createAbandonedMessage(),
      id: `${req.request_id}-abandoned`,
      timestamp: abandonedEvent.created_at || defaultTimestamp,
      requestId: req.request_id,
    };
  }

  const finalAnswerEvent = req.events?.find(
    (event) => event.task_code === 'final-answer-generator',
  );

  if (!finalAnswerEvent) return null;

  const timestamp = finalAnswerEvent.created_at || defaultTimestamp;

  const rawSentiment = req.feedback?.sentiment;
  const feedbackSentiment =
    rawSentiment === 'positive' || rawSentiment === 'negative'
      ? rawSentiment
      : undefined;

  if (finalAnswerEvent.task_response?.final_answer) {
    const taskResponse = finalAnswerEvent.task_response;
    const agenticCharts = (taskResponse.charts as Chart[]) ?? [];
    const charts =
      agenticCharts.length > 0
        ? agenticCharts
        : extractLegacyCharts(taskResponse.tool_execution_history);
    const artifacts = normalizeArtifacts(taskResponse.artifacts ?? []);

    const isIntermediateStep = (e: PollingResponse) =>
      e.task_code !== 'final-answer-generator' && e.task_response?.node != null;

    const bySortKey = (a: PollingResponse, b: PollingResponse) =>
      parseSortKey(a.sort_key) - parseSortKey(b.sort_key);

    const stepEvents = req.events
      ?.filter(isIntermediateStep)
      .sort(bySortKey)
      .map(toAgentStep);

    const executionSteps =
      stepEvents && stepEvents.length > 0 ? stepEvents : undefined;

    const executionTimeMs = taskResponse.execution_time_ms;
    if (executionSteps?.length && typeof executionTimeMs === 'number') {
      executionSteps[executionSteps.length - 1].execution_time_ms =
        executionTimeMs;
    }

    return {
      id: `${req.request_id}-response`,
      role: 'assistant',
      content: taskResponse.final_answer,
      timestamp,
      requestId: req.request_id,
      feedbackSentiment,
      ...(charts.length > 0 && { charts }),
      ...(artifacts.length > 0 && { artifacts }),
      ...(executionSteps?.length && { executionSteps }),
    };
  }

  return {
    id: `${req.request_id}-response`,
    role: 'assistant',
    content: 'Sorry, something went wrong.',
    timestamp,
    isError: true,
    requestId: req.request_id,
    feedbackSentiment,
  };
}

function detectPendingRequest(
  requests: ConversationRequest[],
): PendingRequest | undefined {
  const lastRequest = requests[requests.length - 1];
  if (!lastRequest) return undefined;

  if (!lastRequest.events?.length) {
    return {
      requestId: lastRequest.request_id,
      question: lastRequest.question,
    };
  }

  const hasFinalAnswer = lastRequest.events.some(
    (e) =>
      e.task_code === 'final-answer-generator' && e.request_state === 'SUCCESS',
  );
  const hasFailure = lastRequest.events.some(
    (e) => e.request_state === 'FAILURE',
  );
  const hasAbandoned = lastRequest.events.some(
    (e) => e.request_state === 'ABANDONED',
  );

  if (hasFinalAnswer || hasFailure || hasAbandoned) return undefined;

  return {
    requestId: lastRequest.request_id,
    question: lastRequest.question,
  };
}

function parseConversationToMessages(
  details: GetConversationDetailsResponse,
): Message[] {
  const messages: Message[] = [];

  const sortedRequests = [...details.requests].sort(
    (a, b) => getEarliestSortKey(a) - getEarliestSortKey(b),
  );

  sortedRequests.forEach((req) => {
    messages.push({
      id: req.request_id,
      role: 'user',
      content: req.question,
      timestamp: details.created_at,
    });

    const assistantMessage = buildAssistantMessage(req, details.created_at);
    if (assistantMessage) {
      messages.push(assistantMessage);
    }
  });

  return messages;
}

export default async function getConversationDetailsUseCase(
  input: GetConversationDetailsInput,
): Promise<GetConversationMessagesResult> {
  if (
    !input.conversationId ||
    input.conversationId.trim().length === 0 ||
    !input.projectKey ||
    input.projectKey.trim().length === 0
  ) {
    return {
      conversationId: '',
      messages: [],
    };
  }

  const details = await getConversationDetailsService(input);
  const messages = parseConversationToMessages(details);
  const pendingRequest = detectPendingRequest(details.requests);

  return { conversationId: details.conversation_id, messages, pendingRequest };
}
