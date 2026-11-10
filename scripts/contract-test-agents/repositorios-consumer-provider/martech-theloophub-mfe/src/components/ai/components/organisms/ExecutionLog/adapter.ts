import { PollingResponse } from 'models/InsightsCopilot';

import { AgentStepEvent } from './ExecutionLog.types';

export function toAgentStep(event: PollingResponse): AgentStepEvent {
  const tr = event.task_response ?? {};
  const node = (tr.node as string) ?? event.task_code ?? 'unknown';

  const hasOutcomeField = 'outcome' in tr;
  const outcome = hasOutcomeField ? tr.outcome : tr;

  return {
    node,
    question: tr.question,
    outcome: outcome as AgentStepEvent['outcome'],
    iteration: tr.iteration as number | undefined,
    decision: tr.decision as string | undefined,
    execution_time_ms: tr.execution_time_ms,
    event_id: event.event_id,
    request_state: event.request_state,
    task_code: event.task_code,
  };
}
