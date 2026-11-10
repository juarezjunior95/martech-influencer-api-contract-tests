export interface GetFAQsResponse {
  id: string;
  project_key: string;
  query: string;
  language: string;
  group_id: string;
  created_at: string;
  updated_at: string;
}

export interface LabelValuePair<T = string> {
  label: string;
  value: T;
}

export interface SourceTable {
  [tableName: string]: string;
}

export interface QueryParameter {
  input_type: 'search' | 'static';
  source_tables?: SourceTable[];
  static_options?: LabelValuePair[];
  placeholder_text: string;
  is_mandatory: boolean;
  allow_multiselect: boolean;
  default_options: LabelValuePair[];
}

export interface SmartFlowConfig {
  id: number;
  engine_domain: string;
  function_name: string;
  title: string;
  query: string;
  example_query?: string;
  query_parameters?: Record<string, QueryParameter>;
}

export interface SmartFlowSendParams {
  is_smartflow: boolean;
  smartflow_function_name: string;
  smartflow_parameters: Record<string, string[]>;
}

export interface ConversationRequest {
  request_id: string;
  question: string;
  events?: PollingResponse[];
  feedback?: ConversationFeedback;
}

export interface ConversationFeedback {
  feedback_id: string;
  request_id: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  selected_options: string[];
  comments: string;
  created_at: string;
}

export interface StartConversationResponse {
  conversation_id: string;
  requests: ConversationRequest[];
}

export interface AddFollowUpMessageResponse {
  conversation_id: string;
  requests: ConversationRequest[];
}

export interface ListConversationsResponse {
  conversation_id: string;
  project_key: string;
  user_email: string;
  name: string;
  is_agentic: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface GetConversationDetailsResponse {
  conversation_id: string;
  project_key: string;
  name: string;
  requests: ConversationRequest[];
  created_at: string;
  updated_at: string;
}

export interface EventMetadata {
  conversation_id: string;
  project_key: string;
  user_email: string;
}

export interface EventTaskResponse {
  conversation_id?: string;
  request_id?: string;
  project_key?: string;
  question?: string;
  final_answer?: string;
  overall_plan?: string;
  evaluator_decision?: string;
  evaluator_reasoning?: string;
  iteration_count?: number;
  execution_time_ms?: number;
  langfuse_trace_id?: string;
  charts?: unknown[];
  artifacts?: unknown[];
  conversation_name?: string;
  [key: string]: unknown;
}

export interface PollingResponse {
  event_id: string;
  request_id: string;
  request_state: RequestState;
  task_code: string;
  module_name: string;
  sort_key: string;
  created_at?: string;
  metadata?: EventMetadata;
  task_response?: EventTaskResponse;
}

export interface ProgressUpdate {
  stage: string;
  message: string;
  taskCode?: TaskCode | string;
}

export type RequestState =
  'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILURE' | 'ABANDONED';

export type TaskCode =
  | 'planner'
  | 'data-retriever'
  | 'chart-generator'
  | 'sql-generator'
  | 'final-answer-generator'
  | 'evaluator'
  | 'tool-executor'
  | 'ABANDONED';

export interface NegotiateResponse {
  baseUrl: string;
  token: string;
  url: string;
}

export interface SyncRequestBody {
  last_received_event?: number;
}

export interface SendFeedbackResponse {
  feedback_id: string;
  request_id: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  scenario: string;
  selected_options: string[];
  comments?: string;
  user_email: string;
  created_at: string;
  updated_at: string;
}

export interface RenameConversationResponse {
  conversation_id: string;
  name: string;
  project_key: string;
  user_email: string;
  created_at: string;
  updated_at: string;
}

export interface DeleteConversationResponse {
  message: string;
}

export type GetBlobMarkdownResponse = string;

// Rich response types
export interface Artifact {
  question: string;
  url: string;
  type?: string;
}

export interface Chart {
  chart_id: string;
  title: string;
  figure_json: string;
  timestamp: string;
}

// UI Message type for chat components
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isLoading?: boolean;
  isError?: boolean;
  isAbandoned?: boolean;
  requestId?: string;
  feedbackSentiment?: 'positive' | 'negative';
  artifacts?: Artifact[];
  charts?: Chart[];
  executionSteps?: Array<{
    node: string;
    question?: string;
    outcome?: string | Record<string, unknown> | unknown[];
    execution_time_ms?: number;
  }>;
}
