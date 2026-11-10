import type { AgentStepEvent } from 'components/ai/components/organisms/ExecutionLog';
import { Message } from 'models/InsightsCopilot';

function isStaleAction(
  stateConversationId: string | null,
  actionConversationId?: string | null,
): boolean {
  return (
    stateConversationId !== null &&
    actionConversationId != null &&
    actionConversationId !== stateConversationId
  );
}

export function detectFailedQuery(messages: Message[]): string | null {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage?.isError) return null;
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === 'user') return messages[i].content;
  }
  return null;
}

export interface ChatState {
  messages: Message[];
  conversationId: string | null;
  loading: boolean;
  lastFailedQuery: string | null;
  streamingSteps: AgentStepEvent[];
  streamingStatus: 'idle' | 'streaming' | 'complete';
  isAbandoned: boolean;
}

export type ChatAction =
  | {
      type: 'SEND_MESSAGE_START';
      userMessage: Message;
      query: string;
      streaming?: boolean;
    }
  | {
      type: 'SEND_MESSAGE_SUCCESS';
      assistantMessage: Message;
      conversationId: string;
    }
  | {
      type: 'SEND_MESSAGE_ERROR';
      errorMessage: Message;
      conversationId?: string;
    }
  | { type: 'SEND_FAILURE' }
  | { type: 'RETRY_START'; streaming?: boolean }
  | { type: 'NEW_CHAT' }
  | {
      type: 'LOAD_CONVERSATION';
      messages: Message[];
      conversationId: string;
      lastFailedQuery?: string | null;
      streaming?: boolean;
    }
  | {
      type: 'RESUME_POLLING';
      messages: Message[];
      conversationId: string;
      query: string;
    }
  | { type: 'STREAM_EVENT'; event: AgentStepEvent }
  | {
      type: 'STREAM_COMPLETE';
      assistantMessage: Message;
      conversationId: string;
      executionTimeMs?: number;
    }
  | {
      type: 'STREAM_ERROR';
      errorMessage: Message;
      conversationId?: string;
    }
  | {
      type: 'CHAT_ABANDONED';
      abandonedMessage: Message;
      conversationId?: string;
    };

export const initialChatState: ChatState = {
  messages: [],
  conversationId: null,
  loading: false,
  lastFailedQuery: null,
  streamingSteps: [],
  streamingStatus: 'idle',
  isAbandoned: false,
};

type ActionByType<T extends ChatAction['type']> = Extract<
  ChatAction,
  { type: T }
>;

type ChatActionHandler<T extends ChatAction['type']> = (
  state: ChatState,
  action: ActionByType<T>,
) => ChatState;

const INITIAL_STREAMING_STEP: AgentStepEvent = {
  node: 'initializing',
  request_state: 'PROCESSING',
};

function buildStreamingFields(streaming?: boolean): {
  streamingSteps: AgentStepEvent[];
  streamingStatus: ChatState['streamingStatus'];
} {
  return {
    streamingSteps: streaming ? [INITIAL_STREAMING_STEP] : [],
    streamingStatus: streaming ? 'streaming' : 'idle',
  };
}

function applyErrorMessage(
  state: ChatState,
  action: { errorMessage: Message; conversationId?: string },
): ChatState {
  if (isStaleAction(state.conversationId, action.conversationId)) {
    return state;
  }
  return {
    ...state,
    loading: false,
    conversationId: action.conversationId ?? state.conversationId,
    messages: [...state.messages, action.errorMessage],
    streamingSteps: [],
    streamingStatus: 'idle',
  };
}

function buildStreamCompleteSteps(
  state: ChatState,
  executionTimeMs: number | undefined,
): AgentStepEvent[] {
  const steps = [...state.streamingSteps];
  if (executionTimeMs != null && steps.length > 0) {
    steps[steps.length - 1] = {
      ...steps[steps.length - 1],
      execution_time_ms: executionTimeMs,
    };
  }
  return steps;
}

function buildRetryMessages(messages: Message[]): Message[] {
  const lastMsg = messages[messages.length - 1];
  const isSendFailure = lastMsg?.role === 'user' && lastMsg?.isError;
  if (!isSendFailure) {
    return messages.slice(0, -1);
  }
  return messages.map((msg, i) =>
    i === messages.length - 1 ? { ...msg, isError: false } : msg,
  );
}

function hasAbandonedMessage(messages: Message[]): boolean {
  return messages.some((message) => message.isAbandoned);
}

const chatHandlers: {
  [K in ChatAction['type']]: ChatActionHandler<K>;
} = {
  SEND_MESSAGE_START: (state, action) => ({
    ...state,
    loading: true,
    lastFailedQuery: action.query,
    messages: [...state.messages, action.userMessage],
    ...buildStreamingFields(action.streaming),
    isAbandoned: false,
  }),

  SEND_MESSAGE_SUCCESS: (state, action) =>
    isStaleAction(state.conversationId, action.conversationId)
      ? state
      : {
          ...state,
          loading: false,
          lastFailedQuery: null,
          conversationId: action.conversationId,
          messages: [...state.messages, action.assistantMessage],
          streamingSteps: [],
          streamingStatus: 'idle',
        },

  SEND_MESSAGE_ERROR: applyErrorMessage,

  SEND_FAILURE: (state) => ({
    ...state,
    loading: false,
    messages: state.messages.map((msg, i) =>
      i === state.messages.length - 1 && msg.role === 'user'
        ? { ...msg, isError: true }
        : msg,
    ),
    streamingSteps: [],
    streamingStatus: 'idle',
  }),

  RETRY_START: (state, action) => ({
    ...state,
    loading: true,
    messages: buildRetryMessages(state.messages),
    ...buildStreamingFields(action.streaming),
  }),

  NEW_CHAT: () => ({ ...initialChatState }),

  LOAD_CONVERSATION: (state, action) => ({
    ...state,
    messages: action.messages,
    conversationId: action.conversationId,
    lastFailedQuery: action.lastFailedQuery ?? null,
    loading: !!action.streaming,
    isAbandoned: hasAbandonedMessage(action.messages),
    ...buildStreamingFields(action.streaming),
  }),

  RESUME_POLLING: (state, action) => ({
    ...state,
    messages: action.messages,
    conversationId: action.conversationId,
    loading: true,
    lastFailedQuery: action.query,
  }),

  STREAM_EVENT: (state, action) => ({
    ...state,
    streamingSteps: [...state.streamingSteps, action.event],
    streamingStatus: 'streaming',
  }),

  STREAM_COMPLETE: (state, action) => {
    if (isStaleAction(state.conversationId, action.conversationId)) {
      return state;
    }
    const steps = buildStreamCompleteSteps(state, action.executionTimeMs);
    return {
      ...state,
      loading: false,
      lastFailedQuery: null,
      conversationId: action.conversationId,
      messages: [
        ...state.messages,
        { ...action.assistantMessage, executionSteps: steps },
      ],
      streamingSteps: steps,
      streamingStatus: 'complete',
    };
  },

  STREAM_ERROR: applyErrorMessage,

  CHAT_ABANDONED: (state, action) => {
    if (isStaleAction(state.conversationId, action.conversationId)) {
      return state;
    }
    return {
      ...state,
      loading: false,
      isAbandoned: true,
      conversationId: action.conversationId ?? state.conversationId,
      messages: [...state.messages, action.abandonedMessage],
      streamingSteps: [],
      streamingStatus: 'idle',
    };
  },
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  const handler = chatHandlers[action.type] as
    ChatActionHandler<ChatAction['type']> | undefined;
  return handler ? handler(state, action) : state;
}
