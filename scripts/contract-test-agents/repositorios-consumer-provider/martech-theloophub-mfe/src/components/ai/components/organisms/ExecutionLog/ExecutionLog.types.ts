// Fields use snake_case to match the WebSocket API contract
export interface AgentStepEvent {
  node: string;
  question?: string;
  outcome?: string | Record<string, unknown> | unknown[];
  iteration?: number;
  decision?: string;
  execution_time_ms?: number;
  // Envelope fields from WebSocket/polling events
  event_id?: string;
  request_state?: string;
  task_code?: string;
}

export interface TimelineEntry {
  content: string;
  nodeType: string;
  showSkeleton: boolean;
}

export interface ExecutionLogProps {
  steps: AgentStepEvent[];
  status: 'streaming' | 'complete';
}
