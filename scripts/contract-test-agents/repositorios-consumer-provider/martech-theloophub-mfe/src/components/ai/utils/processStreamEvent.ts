import { toAgentStep } from 'components/ai/components/organisms/ExecutionLog';
import type { AgentStepEvent } from 'components/ai/components/organisms/ExecutionLog';
import type { Chart, Message, PollingResponse } from 'models/InsightsCopilot';
import { normalizeArtifacts } from 'usecases/InsightsCopilotUseCase/PollForResponseUseCase/pollForResponseUseCase';

import { extractLegacyCharts } from './legacyChartConverter';
import {
  createAbandonedMessage,
  createAssistantMessage,
  createErrorMessage,
} from './messageHelpers';

/** ms to wait before the first sync attempt (no events received yet) */
export const INITIAL_SYNC_TIMEOUT_MS = 30_000;

const SAFETY_MARGIN_MS = 3_000;
const DEFAULT_TOOL_TIMEOUT_S = 60;

/**
 * Converts the per-event `next_tool_timeout` (seconds) into the
 * milliseconds we should wait before calling /sync.
 *
 * Rule from IC spec: wait `next_tool_timeout + 3 s`.
 * Falls back to 60 s + 3 s when the field is absent.
 */
export function getSyncTimeoutMs(nextToolTimeoutS?: number): number {
  const seconds = nextToolTimeoutS ?? DEFAULT_TOOL_TIMEOUT_S;
  return seconds * 1_000 + SAFETY_MARGIN_MS;
}

export type StreamEventResult =
  | { status: 'complete'; assistantMessage: Message; executionTimeMs?: number }
  | { status: 'error'; errorMessage: Message }
  | { status: 'abandoned'; abandonedMessage: Message }
  | { status: 'in_progress'; step: AgentStepEvent; nextToolTimeout?: number };

export function processStreamEvent(
  event: PollingResponse,
  requestId: string,
): StreamEventResult {
  if (
    event.request_state === 'SUCCESS' &&
    event.task_code === 'final-answer-generator'
  ) {
    const taskResponse = event.task_response;
    const agenticCharts = (taskResponse?.charts as Chart[]) ?? [];
    const charts =
      agenticCharts.length > 0
        ? agenticCharts
        : extractLegacyCharts(taskResponse?.tool_execution_history);
    const artifacts = normalizeArtifacts(taskResponse?.artifacts ?? []);

    const executionTimeMs =
      typeof taskResponse?.execution_time_ms === 'number'
        ? taskResponse.execution_time_ms
        : undefined;

    return {
      status: 'complete',
      assistantMessage: createAssistantMessage(
        taskResponse?.final_answer || '',
        requestId,
        { charts, artifacts },
      ),
      executionTimeMs,
    };
  }

  if (event.request_state === 'FAILURE') {
    return { status: 'error', errorMessage: createErrorMessage() };
  }

  if (event.request_state === 'ABANDONED') {
    return { status: 'abandoned', abandonedMessage: createAbandonedMessage() };
  }

  const nextToolTimeout =
    typeof event.task_response?.next_tool_timeout === 'number'
      ? event.task_response.next_tool_timeout
      : undefined;

  return { status: 'in_progress', step: toAgentStep(event), nextToolTimeout };
}
