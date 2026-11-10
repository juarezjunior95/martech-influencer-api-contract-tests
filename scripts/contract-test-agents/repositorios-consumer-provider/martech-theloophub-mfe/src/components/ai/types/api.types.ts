// ============================================
// API Types - Insights Copilot
// ============================================

// ============ SMART FLOW (re-export from models) ============
export type {
  SmartFlowConfig,
  QueryParameter,
  SourceTable,
  LabelValuePair,
  SmartFlowSendParams,
} from 'models/InsightsCopilot';

export interface SmartFlowFields {
  isSmartflow?: boolean;
  smartflowFunctionName?: string;
  smartflowParameters?: Record<string, string[]>;
}

// ============ FAQ ============
export interface FAQ {
  id: string;
  project_key: string;
  query: string;
  language: string;
  group_id: string;
  created_at: string;
  updated_at: string;
}

export type GetFAQsResponse = FAQ[];

// ============ ARTIFACTS & CHARTS (re-export from models) ============
import type { Artifact, Chart } from 'models/InsightsCopilot';

export type { Artifact, Chart };

// ============ TASK RESPONSE ============

export interface TaskResponse {
  conversation_id: string;
  conversation_name: string;
  final_answer: string;
  status: 'success' | 'pending' | 'error';
  iteration_count: number;
  artifacts: Artifact[];
  charts: Chart[];
  evaluator_decision?: string;
  evaluator_reasoning?: string;
  execution_time_ms?: number;
  overall_plan?: string;
}

// ============ POLL EVENT ============
export interface PollEvent {
  event_id: string;
  module_name: string;
  request_id: string;
  request_state: 'SUCCESS' | 'PENDING' | 'ERROR';
  task_code: string;
  created_at: string;
  task_response: TaskResponse;
  'sort-key'?: string;
}

export type PollResponse = PollEvent[];

// ============ FEEDBACK ============
export interface Feedback {
  feedback_id: string;
  request_id: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  selected_options: string[];
  comments: string;
  created_at: string;
}

// ============ CONVERSATION REQUEST ============
export interface ConversationRequest {
  request_id: string;
  question: string;
  events?: PollEvent[];
  feedback?: Feedback;
}

// ============ CONVERSATION ============
export interface Conversation {
  conversation_id: string;
  created_at: string;
  name: string;
  project_key: string;
  updated_at: string;
  user_email: string;
  requests: ConversationRequest[];
}

// ============ API RESPONSES ============
export type StartConversationResponse = Conversation;
export type FollowUpMessageResponse = Conversation;

// ============ UI MESSAGE (re-export from models) ============
export type { Message } from 'models/InsightsCopilot';
