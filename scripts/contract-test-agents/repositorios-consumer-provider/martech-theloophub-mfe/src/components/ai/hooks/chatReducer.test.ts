import { Message } from 'models/InsightsCopilot';

import { chatReducer, ChatState, initialChatState } from './chatReducer';

const mockUserMessage: Message = {
  id: 'user-1',
  role: 'user',
  content: 'Hello',
  timestamp: '2024-01-01T00:00:00.000Z',
};

const mockAssistantMessage: Message = {
  id: 'assistant-1',
  role: 'assistant',
  content: 'Hi there',
  timestamp: '2024-01-01T00:00:01.000Z',
};

const mockErrorMessage: Message = {
  id: 'error-1',
  role: 'assistant',
  content: 'Sorry, something went wrong.',
  timestamp: '2024-01-01T00:00:02.000Z',
  isError: true,
};

const mockAbandonedMessage: Message = {
  id: 'abandoned-1',
  role: 'assistant',
  content: 'This chat has been abandoned.',
  timestamp: '2024-01-01T00:00:03.000Z',
  isAbandoned: true,
};

describe('chatReducer', () => {
  describe('initialChatState', () => {
    it('should have empty messages', () => {
      expect(initialChatState.messages).toEqual([]);
    });

    it('should have null conversationId', () => {
      expect(initialChatState.conversationId).toBeNull();
    });

    it('should not be loading', () => {
      expect(initialChatState.loading).toBe(false);
    });

    it('should have null lastFailedQuery', () => {
      expect(initialChatState.lastFailedQuery).toBeNull();
    });

    it('should have empty streamingSteps', () => {
      expect(initialChatState.streamingSteps).toEqual([]);
    });

    it('should have idle streamingStatus', () => {
      expect(initialChatState.streamingStatus).toBe('idle');
    });

    it('should not be abandoned', () => {
      expect(initialChatState.isAbandoned).toBe(false);
    });
  });

  describe('SEND_MESSAGE_START', () => {
    it('should set loading to true', () => {
      const state = chatReducer(initialChatState, {
        type: 'SEND_MESSAGE_START',
        userMessage: mockUserMessage,
        query: 'Hello',
      });
      expect(state.loading).toBe(true);
    });

    it('should add user message to messages', () => {
      const state = chatReducer(initialChatState, {
        type: 'SEND_MESSAGE_START',
        userMessage: mockUserMessage,
        query: 'Hello',
      });
      expect(state.messages).toEqual([mockUserMessage]);
    });

    it('should store the query as lastFailedQuery', () => {
      const state = chatReducer(initialChatState, {
        type: 'SEND_MESSAGE_START',
        userMessage: mockUserMessage,
        query: 'Hello',
      });
      expect(state.lastFailedQuery).toBe('Hello');
    });

    it('should reset isAbandoned to false', () => {
      const abandonedState: ChatState = {
        ...initialChatState,
        isAbandoned: true,
      };
      const state = chatReducer(abandonedState, {
        type: 'SEND_MESSAGE_START',
        userMessage: mockUserMessage,
        query: 'Hello',
      });
      expect(state.isAbandoned).toBe(false);
    });

    it('should initialize streaming steps when streaming=true', () => {
      const state = chatReducer(initialChatState, {
        type: 'SEND_MESSAGE_START',
        userMessage: mockUserMessage,
        query: 'Hello',
        streaming: true,
      });
      expect(state.streamingSteps).toEqual([
        { node: 'initializing', request_state: 'PROCESSING' },
      ]);
      expect(state.streamingStatus).toBe('streaming');
    });

    it('should keep empty streaming steps when streaming=false', () => {
      const state = chatReducer(initialChatState, {
        type: 'SEND_MESSAGE_START',
        userMessage: mockUserMessage,
        query: 'Hello',
        streaming: false,
      });
      expect(state.streamingSteps).toEqual([]);
      expect(state.streamingStatus).toBe('idle');
    });
  });

  describe('SEND_MESSAGE_SUCCESS', () => {
    const stateWithMessage: ChatState = {
      ...initialChatState,
      messages: [mockUserMessage],
      loading: true,
      lastFailedQuery: 'Hello',
    };

    it('should set loading to false', () => {
      const state = chatReducer(stateWithMessage, {
        type: 'SEND_MESSAGE_SUCCESS',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.loading).toBe(false);
    });

    it('should add assistant message to messages', () => {
      const state = chatReducer(stateWithMessage, {
        type: 'SEND_MESSAGE_SUCCESS',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.messages).toEqual([mockUserMessage, mockAssistantMessage]);
    });

    it('should set conversationId', () => {
      const state = chatReducer(stateWithMessage, {
        type: 'SEND_MESSAGE_SUCCESS',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.conversationId).toBe('conv-1');
    });

    it('should clear lastFailedQuery', () => {
      const state = chatReducer(stateWithMessage, {
        type: 'SEND_MESSAGE_SUCCESS',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.lastFailedQuery).toBeNull();
    });

    it('should reset streaming state', () => {
      const streamingState: ChatState = {
        ...stateWithMessage,
        streamingSteps: [{ node: 'initializing', request_state: 'PROCESSING' }],
        streamingStatus: 'streaming',
      };
      const state = chatReducer(streamingState, {
        type: 'SEND_MESSAGE_SUCCESS',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.streamingSteps).toEqual([]);
      expect(state.streamingStatus).toBe('idle');
    });
  });

  describe('SEND_MESSAGE_ERROR', () => {
    const stateLoading: ChatState = {
      ...initialChatState,
      messages: [mockUserMessage],
      loading: true,
      lastFailedQuery: 'Hello',
    };

    it('should set loading to false', () => {
      const state = chatReducer(stateLoading, {
        type: 'SEND_MESSAGE_ERROR',
        errorMessage: mockErrorMessage,
      });
      expect(state.loading).toBe(false);
    });

    it('should add assistant error message to messages', () => {
      const state = chatReducer(stateLoading, {
        type: 'SEND_MESSAGE_ERROR',
        errorMessage: mockErrorMessage,
      });
      expect(state.messages).toEqual([mockUserMessage, mockErrorMessage]);
    });

    it('should keep lastFailedQuery for retry', () => {
      const state = chatReducer(stateLoading, {
        type: 'SEND_MESSAGE_ERROR',
        errorMessage: mockErrorMessage,
      });
      expect(state.lastFailedQuery).toBe('Hello');
    });

    it('should save conversationId when provided', () => {
      const state = chatReducer(stateLoading, {
        type: 'SEND_MESSAGE_ERROR',
        errorMessage: mockErrorMessage,
        conversationId: 'conv-1',
      });
      expect(state.conversationId).toBe('conv-1');
    });

    it('should keep existing conversationId when not provided', () => {
      const stateWithConversation: ChatState = {
        ...stateLoading,
        conversationId: 'existing-conv',
      };
      const state = chatReducer(stateWithConversation, {
        type: 'SEND_MESSAGE_ERROR',
        errorMessage: mockErrorMessage,
      });
      expect(state.conversationId).toBe('existing-conv');
    });
  });

  describe('SEND_FAILURE', () => {
    const stateLoading: ChatState = {
      ...initialChatState,
      messages: [mockUserMessage],
      loading: true,
      lastFailedQuery: 'Hello',
    };

    it('should set loading to false', () => {
      const state = chatReducer(stateLoading, { type: 'SEND_FAILURE' });
      expect(state.loading).toBe(false);
    });

    it('should mark user message as failed without assistant error', () => {
      const state = chatReducer(stateLoading, { type: 'SEND_FAILURE' });
      expect(state.messages).toEqual([{ ...mockUserMessage, isError: true }]);
    });

    it('should keep lastFailedQuery for retry', () => {
      const state = chatReducer(stateLoading, { type: 'SEND_FAILURE' });
      expect(state.lastFailedQuery).toBe('Hello');
    });
  });

  describe('RETRY_START', () => {
    it('should set loading to true', () => {
      const stateWithError: ChatState = {
        ...initialChatState,
        messages: [mockUserMessage, mockErrorMessage],
        loading: false,
        lastFailedQuery: 'Hello',
      };
      const state = chatReducer(stateWithError, { type: 'RETRY_START' });
      expect(state.loading).toBe(true);
    });

    it('should remove assistant error message', () => {
      const stateWithError: ChatState = {
        ...initialChatState,
        messages: [mockUserMessage, mockErrorMessage],
        loading: false,
        lastFailedQuery: 'Hello',
      };
      const state = chatReducer(stateWithError, { type: 'RETRY_START' });
      expect(state.messages).toEqual([mockUserMessage]);
    });

    it('should clear isError on user message for send failure', () => {
      const stateWithSendFailure: ChatState = {
        ...initialChatState,
        messages: [{ ...mockUserMessage, isError: true }],
        loading: false,
        lastFailedQuery: 'Hello',
      };
      const state = chatReducer(stateWithSendFailure, {
        type: 'RETRY_START',
      });
      expect(state.messages).toEqual([{ ...mockUserMessage, isError: false }]);
    });

    it('should initialize streaming steps when streaming=true', () => {
      const stateWithError: ChatState = {
        ...initialChatState,
        messages: [mockUserMessage, mockErrorMessage],
        lastFailedQuery: 'Hello',
      };
      const state = chatReducer(stateWithError, {
        type: 'RETRY_START',
        streaming: true,
      });
      expect(state.streamingSteps).toEqual([
        { node: 'initializing', request_state: 'PROCESSING' },
      ]);
      expect(state.streamingStatus).toBe('streaming');
    });
  });

  describe('NEW_CHAT', () => {
    const stateWithData: ChatState = {
      messages: [mockUserMessage, mockAssistantMessage],
      conversationId: 'conv-1',
      loading: false,
      lastFailedQuery: null,
      streamingSteps: [],
      streamingStatus: 'idle',
      isAbandoned: false,
    };

    it('should reset to initial state', () => {
      const state = chatReducer(stateWithData, { type: 'NEW_CHAT' });
      expect(state).toEqual(initialChatState);
    });
  });

  describe('LOAD_CONVERSATION', () => {
    it('should set messages from action', () => {
      const messages = [mockUserMessage, mockAssistantMessage];
      const state = chatReducer(initialChatState, {
        type: 'LOAD_CONVERSATION',
        messages,
        conversationId: 'conv-1',
      });
      expect(state.messages).toEqual(messages);
    });

    it('should set conversationId', () => {
      const state = chatReducer(initialChatState, {
        type: 'LOAD_CONVERSATION',
        messages: [],
        conversationId: 'conv-1',
      });
      expect(state.conversationId).toBe('conv-1');
    });

    it('should set loading to false', () => {
      const state = chatReducer(
        { ...initialChatState, loading: true },
        {
          type: 'LOAD_CONVERSATION',
          messages: [],
          conversationId: 'conv-1',
        },
      );
      expect(state.loading).toBe(false);
    });

    it('should set lastFailedQuery if provided', () => {
      const state = chatReducer(initialChatState, {
        type: 'LOAD_CONVERSATION',
        messages: [],
        conversationId: 'conv-1',
        lastFailedQuery: 'failed query',
      });
      expect(state.lastFailedQuery).toBe('failed query');
    });

    it('should set lastFailedQuery to null if not provided', () => {
      const state = chatReducer(initialChatState, {
        type: 'LOAD_CONVERSATION',
        messages: [],
        conversationId: 'conv-1',
      });
      expect(state.lastFailedQuery).toBeNull();
    });

    it('should set isAbandoned to true when loaded messages contain abandoned message', () => {
      const state = chatReducer(initialChatState, {
        type: 'LOAD_CONVERSATION',
        messages: [mockUserMessage, mockAbandonedMessage],
        conversationId: 'conv-1',
      });
      expect(state.isAbandoned).toBe(true);
    });

    it('should reset isAbandoned to false when loaded messages are not abandoned', () => {
      const state = chatReducer(
        { ...initialChatState, isAbandoned: true },
        {
          type: 'LOAD_CONVERSATION',
          messages: [mockUserMessage, mockAssistantMessage],
          conversationId: 'conv-1',
        },
      );
      expect(state.isAbandoned).toBe(false);
    });
  });

  describe('RESUME_POLLING', () => {
    it('should set loading to true', () => {
      const state = chatReducer(initialChatState, {
        type: 'RESUME_POLLING',
        messages: [mockUserMessage],
        conversationId: 'conv-1',
        query: 'Hello',
      });
      expect(state.loading).toBe(true);
    });

    it('should set messages from action', () => {
      const messages = [mockUserMessage];
      const state = chatReducer(initialChatState, {
        type: 'RESUME_POLLING',
        messages,
        conversationId: 'conv-1',
        query: 'Hello',
      });
      expect(state.messages).toEqual(messages);
    });

    it('should set conversationId', () => {
      const state = chatReducer(initialChatState, {
        type: 'RESUME_POLLING',
        messages: [],
        conversationId: 'conv-1',
        query: 'Hello',
      });
      expect(state.conversationId).toBe('conv-1');
    });

    it('should set lastFailedQuery', () => {
      const state = chatReducer(initialChatState, {
        type: 'RESUME_POLLING',
        messages: [],
        conversationId: 'conv-1',
        query: 'Hello',
      });
      expect(state.lastFailedQuery).toBe('Hello');
    });
  });

  describe('STREAM_EVENT', () => {
    it('should append event to streamingSteps', () => {
      const step = { node: 'planner', request_state: 'PROCESSING' };
      const state = chatReducer(initialChatState, {
        type: 'STREAM_EVENT',
        event: step,
      });
      expect(state.streamingSteps).toEqual([step]);
      expect(state.streamingStatus).toBe('streaming');
    });

    it('should accumulate streaming steps', () => {
      const step1 = { node: 'planner', request_state: 'PROCESSING' };
      const step2 = {
        node: 'data-retriever',
        request_state: 'PROCESSING',
      };
      let state = chatReducer(initialChatState, {
        type: 'STREAM_EVENT',
        event: step1,
      });
      state = chatReducer(state, {
        type: 'STREAM_EVENT',
        event: step2,
      });
      expect(state.streamingSteps).toEqual([step1, step2]);
    });
  });

  describe('STREAM_COMPLETE', () => {
    const streamingState: ChatState = {
      ...initialChatState,
      messages: [mockUserMessage],
      loading: true,
      lastFailedQuery: 'Hello',
      streamingSteps: [{ node: 'planner', request_state: 'SUCCESS' }],
      streamingStatus: 'streaming',
    };

    it('should set loading to false', () => {
      const state = chatReducer(streamingState, {
        type: 'STREAM_COMPLETE',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.loading).toBe(false);
    });

    it('should clear lastFailedQuery', () => {
      const state = chatReducer(streamingState, {
        type: 'STREAM_COMPLETE',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.lastFailedQuery).toBeNull();
    });

    it('should set conversationId', () => {
      const state = chatReducer(streamingState, {
        type: 'STREAM_COMPLETE',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.conversationId).toBe('conv-1');
    });

    it('should add assistant message with executionSteps', () => {
      const state = chatReducer(streamingState, {
        type: 'STREAM_COMPLETE',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.messages[1]).toEqual({
        ...mockAssistantMessage,
        executionSteps: streamingState.streamingSteps,
      });
    });

    it('should set streamingStatus to complete', () => {
      const state = chatReducer(streamingState, {
        type: 'STREAM_COMPLETE',
        assistantMessage: mockAssistantMessage,
        conversationId: 'conv-1',
      });
      expect(state.streamingStatus).toBe('complete');
    });
  });

  describe('STREAM_ERROR', () => {
    const streamingState: ChatState = {
      ...initialChatState,
      messages: [mockUserMessage],
      loading: true,
      streamingSteps: [{ node: 'planner', request_state: 'PROCESSING' }],
      streamingStatus: 'streaming',
    };

    it('should set loading to false', () => {
      const state = chatReducer(streamingState, {
        type: 'STREAM_ERROR',
        errorMessage: mockErrorMessage,
        conversationId: 'conv-1',
      });
      expect(state.loading).toBe(false);
    });

    it('should add error message', () => {
      const state = chatReducer(streamingState, {
        type: 'STREAM_ERROR',
        errorMessage: mockErrorMessage,
        conversationId: 'conv-1',
      });
      expect(state.messages).toEqual([mockUserMessage, mockErrorMessage]);
    });

    it('should reset streaming state', () => {
      const state = chatReducer(streamingState, {
        type: 'STREAM_ERROR',
        errorMessage: mockErrorMessage,
        conversationId: 'conv-1',
      });
      expect(state.streamingSteps).toEqual([]);
      expect(state.streamingStatus).toBe('idle');
    });
  });

  describe('CHAT_ABANDONED', () => {
    const loadingState: ChatState = {
      ...initialChatState,
      messages: [mockUserMessage],
      loading: true,
      streamingSteps: [{ node: 'planner', request_state: 'PROCESSING' }],
      streamingStatus: 'streaming',
    };

    it('should set loading to false', () => {
      const state = chatReducer(loadingState, {
        type: 'CHAT_ABANDONED',
        abandonedMessage: mockAbandonedMessage,
        conversationId: 'conv-1',
      });
      expect(state.loading).toBe(false);
    });

    it('should set isAbandoned to true', () => {
      const state = chatReducer(loadingState, {
        type: 'CHAT_ABANDONED',
        abandonedMessage: mockAbandonedMessage,
        conversationId: 'conv-1',
      });
      expect(state.isAbandoned).toBe(true);
    });

    it('should add abandoned message', () => {
      const state = chatReducer(loadingState, {
        type: 'CHAT_ABANDONED',
        abandonedMessage: mockAbandonedMessage,
        conversationId: 'conv-1',
      });
      expect(state.messages).toEqual([mockUserMessage, mockAbandonedMessage]);
    });

    it('should reset streaming state', () => {
      const state = chatReducer(loadingState, {
        type: 'CHAT_ABANDONED',
        abandonedMessage: mockAbandonedMessage,
        conversationId: 'conv-1',
      });
      expect(state.streamingSteps).toEqual([]);
      expect(state.streamingStatus).toBe('idle');
    });

    it('should keep existing conversationId when not provided', () => {
      const stateWithConv: ChatState = {
        ...loadingState,
        conversationId: 'existing-conv',
      };
      const state = chatReducer(stateWithConv, {
        type: 'CHAT_ABANDONED',
        abandonedMessage: mockAbandonedMessage,
      });
      expect(state.conversationId).toBe('existing-conv');
    });
  });

  describe('default', () => {
    it('should return current state for unknown action', () => {
      const state = chatReducer(initialChatState, {
        type: 'UNKNOWN',
      } as unknown as Parameters<typeof chatReducer>[1]);
      expect(state).toEqual(initialChatState);
    });
  });
});
