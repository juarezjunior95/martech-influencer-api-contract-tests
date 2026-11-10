import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import * as useCases from 'usecases/InsightsCopilotUseCase';

import { useMessaging } from './useMessaging';

jest.mock('usecases/InsightsCopilotUseCase', () => ({
  getConversationDetailsUseCase: jest.fn(),
  sendMessageUseCase: jest.fn(),
  pollForResponseUseCase: jest.fn(),
  syncEventUseCase: jest.fn(),
  negotiateUseCase: jest.fn(),
  startConversationUseCase: jest.fn(),
  addFollowUpMessageUseCase: jest.fn(),
}));

jest.mock('hooks/useWebPubSub', () => ({
  useWebPubSub: () => ({
    subscribe: jest.fn(() => jest.fn()),
    isConnected: false,
    connectionError: null,
    getLastEventId: jest.fn(() => null),
    clearDedup: jest.fn(),
  }),
}));

const mockUseCases = useCases as jest.Mocked<typeof useCases>;
const TEST_PROJECT_KEY = 'test-project-key';

const defaultOptions = {
  projectKey: TEST_PROJECT_KEY,
  enableWebSocket: false,
  enablePolling: true,
};

describe('useMessaging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useMessaging(defaultOptions));

      expect(result.current.messages).toEqual([]);
      expect(result.current.conversationId).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.lastFailedQuery).toBeNull();
      expect(result.current.progress).toBeNull();
      expect(result.current.streamingSteps).toEqual([]);
      expect(result.current.streamingStatus).toBe('idle');
      expect(result.current.isAbandoned).toBe(false);
    });
  });

  describe('sendMessage', () => {
    it('should send message and update state on success', async () => {
      const mockResult = {
        conversationId: 'conv-123',
        requestId: 'req-456',
        answer: 'Bot response',
        charts: [],
        artifacts: [],
      };
      mockUseCases.sendMessageUseCase.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.sendMessage('Hello');
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[0].role).toBe('user');
        expect(result.current.messages[0].content).toBe('Hello');
        expect(result.current.messages[1].role).toBe('assistant');
        expect(result.current.messages[1].content).toBe('Bot response');
        expect(result.current.conversationId).toBe('conv-123');
        expect(result.current.loading).toBe(false);
      });
    });

    it('should not send empty messages', async () => {
      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.sendMessage('   ');
      });

      expect(mockUseCases.sendMessageUseCase).not.toHaveBeenCalled();
      expect(result.current.messages).toHaveLength(0);
    });

    it('should not send while already loading', async () => {
      mockUseCases.sendMessageUseCase.mockImplementation(
        () => new Promise(() => undefined), // never resolves
      );

      const { result } = renderHook(() => useMessaging(defaultOptions));

      // First send — will start loading
      act(() => {
        result.current.sendMessage('First');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      // Second send — should be ignored
      await act(async () => {
        await result.current.sendMessage('Second');
      });

      expect(mockUseCases.sendMessageUseCase).toHaveBeenCalledTimes(1);
    });

    it('should add error message when response is TIMEOUT', async () => {
      mockUseCases.sendMessageUseCase.mockResolvedValue({
        conversationId: 'conv-123',
        requestId: 'req-456',
        answer: 'TIMEOUT',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.sendMessage('Question');
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[1].isError).toBe(true);
        expect(result.current.messages[1].content).toBe(
          'Sorry, something went wrong.',
        );
      });
    });

    it('should add error message when response starts with ERROR:', async () => {
      mockUseCases.sendMessageUseCase.mockResolvedValue({
        conversationId: 'conv-123',
        requestId: 'req-456',
        answer: 'ERROR: Something went wrong',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.sendMessage('Question');
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[1].isError).toBe(true);
      });
    });

    it('should mark user message as failed when sendMessage throws', async () => {
      mockUseCases.sendMessageUseCase.mockRejectedValue(
        new Error('Network error'),
      );

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.sendMessage('Question');
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(1);
        expect(result.current.messages[0].role).toBe('user');
        expect(result.current.messages[0].isError).toBe(true);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should call onNewConversation after success for new conversation', async () => {
      const onNewConversation = jest.fn();
      mockUseCases.sendMessageUseCase.mockResolvedValue({
        conversationId: 'conv-new',
        requestId: 'req-1',
        answer: 'Response',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() =>
        useMessaging({
          ...defaultOptions,
          onNewConversation,
        }),
      );

      await act(async () => {
        await result.current.sendMessage('Hello');
      });

      await waitFor(() => {
        expect(onNewConversation).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call onNewConversation for follow-up messages', async () => {
      const onNewConversation = jest.fn();
      mockUseCases.sendMessageUseCase
        .mockResolvedValueOnce({
          conversationId: 'conv-1',
          requestId: 'req-1',
          answer: 'First',
          charts: [],
          artifacts: [],
        })
        .mockResolvedValueOnce({
          conversationId: 'conv-1',
          requestId: 'req-2',
          answer: 'Second',
          charts: [],
          artifacts: [],
        });

      const { result } = renderHook(() =>
        useMessaging({
          ...defaultOptions,
          onNewConversation,
        }),
      );

      await act(async () => {
        await result.current.sendMessage('First');
      });

      onNewConversation.mockClear();

      await act(async () => {
        await result.current.sendMessage('Second');
      });

      expect(onNewConversation).not.toHaveBeenCalled();
    });

    it('should trim the message before sending', async () => {
      mockUseCases.sendMessageUseCase.mockResolvedValue({
        conversationId: 'conv-1',
        requestId: 'req-1',
        answer: 'Response',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.sendMessage('  Hello  ');
      });

      await waitFor(() => {
        expect(result.current.messages[0].content).toBe('Hello');
      });
    });
  });

  describe('retryLastMessage', () => {
    it('should retry the last failed query', async () => {
      // First call fails
      mockUseCases.sendMessageUseCase.mockResolvedValueOnce({
        conversationId: 'conv-123',
        requestId: 'req-456',
        answer: 'TIMEOUT',
        charts: [],
        artifacts: [],
      });

      // Second call succeeds
      mockUseCases.sendMessageUseCase.mockResolvedValueOnce({
        conversationId: 'conv-123',
        requestId: 'req-789',
        answer: 'Correct response',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.sendMessage('Question');
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[1].isError).toBe(true);
        expect(result.current.lastFailedQuery).toBe('Question');
      });

      await act(async () => {
        await result.current.retryLastMessage();
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[1].isError).toBeUndefined();
        expect(result.current.messages[1].content).toBe('Correct response');
        expect(result.current.lastFailedQuery).toBeNull();
      });
    });

    it('should not retry when there is no failed query', async () => {
      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.retryLastMessage();
      });

      expect(mockUseCases.sendMessageUseCase).not.toHaveBeenCalled();
    });

    it('should not retry while loading', async () => {
      mockUseCases.sendMessageUseCase.mockResolvedValueOnce({
        conversationId: 'conv-1',
        requestId: 'req-1',
        answer: 'TIMEOUT',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => useMessaging(defaultOptions));

      // Send first message that fails
      await act(async () => {
        await result.current.sendMessage('Question');
      });

      await waitFor(() => {
        expect(result.current.lastFailedQuery).toBe('Question');
      });

      // Start a long operation to set loading
      mockUseCases.sendMessageUseCase.mockImplementation(
        () => new Promise(() => undefined),
      );

      act(() => {
        result.current.retryLastMessage();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      // Second retry should be ignored
      await act(async () => {
        await result.current.retryLastMessage();
      });

      // sendMessage was called twice total: original + first retry
      expect(mockUseCases.sendMessageUseCase).toHaveBeenCalledTimes(2);
    });
  });

  describe('newChat', () => {
    it('should reset chat state', async () => {
      mockUseCases.sendMessageUseCase.mockResolvedValue({
        conversationId: 'conv-123',
        requestId: 'req-456',
        answer: 'Response',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.sendMessage('Hello');
      });

      await waitFor(() => {
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.conversationId).toBe('conv-123');
      });

      act(() => {
        result.current.newChat();
      });

      expect(result.current.messages).toEqual([]);
      expect(result.current.conversationId).toBeNull();
      expect(result.current.lastFailedQuery).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  describe('loadConversation', () => {
    it('should load conversation messages successfully', async () => {
      const mockMessages = [
        {
          id: 'req-1',
          role: 'user' as const,
          content: 'Hello',
          timestamp: '2024-01-01',
        },
        {
          id: 'req-2',
          role: 'assistant' as const,
          content: 'Hi',
          timestamp: '2024-01-01',
        },
      ];

      mockUseCases.getConversationDetailsUseCase.mockResolvedValue({
        conversationId: 'conv-123',
        messages: mockMessages,
      });

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.loadConversation('conv-123');
      });

      await waitFor(() => {
        expect(result.current.messages).toEqual(mockMessages);
        expect(result.current.conversationId).toBe('conv-123');
      });

      expect(mockUseCases.getConversationDetailsUseCase).toHaveBeenCalledWith({
        conversationId: 'conv-123',
        projectKey: TEST_PROJECT_KEY,
      });
    });

    it('should return null when loading conversation fails', async () => {
      mockUseCases.getConversationDetailsUseCase.mockRejectedValue(
        new Error('Error fetching conversation'),
      );

      const { result } = renderHook(() => useMessaging(defaultOptions));

      let response;
      await act(async () => {
        response = await result.current.loadConversation('conv-123');
      });

      expect(response).toBeNull();
    });

    it('should detect lastFailedQuery from loaded conversation', async () => {
      const mockMessages = [
        {
          id: 'msg-1',
          role: 'user' as const,
          content: 'Question',
          timestamp: '2024-01-01',
        },
        {
          id: 'msg-2',
          role: 'assistant' as const,
          content: 'Error occurred',
          timestamp: '2024-01-01',
          isError: true,
        },
      ];

      mockUseCases.getConversationDetailsUseCase.mockResolvedValue({
        conversationId: 'conv-123',
        messages: mockMessages,
      });

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.loadConversation('conv-123');
      });

      await waitFor(() => {
        expect(result.current.lastFailedQuery).toBe('Question');
      });
    });

    it('should resume polling when conversation has pending request', async () => {
      const mockMessages = [
        {
          id: 'msg-1',
          role: 'user' as const,
          content: 'Question',
          timestamp: '2024-01-01',
        },
      ];

      mockUseCases.getConversationDetailsUseCase.mockResolvedValue({
        conversationId: 'conv-123',
        messages: mockMessages,
        pendingRequest: {
          requestId: 'req-pending',
          question: 'Question',
        },
      });

      mockUseCases.pollForResponseUseCase.mockResolvedValue({
        answer: 'Polled answer',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => useMessaging(defaultOptions));

      await act(async () => {
        await result.current.loadConversation('conv-123');
      });

      await waitFor(() => {
        expect(result.current.conversationId).toBe('conv-123');
        expect(mockUseCases.pollForResponseUseCase).toHaveBeenCalledWith(
          expect.objectContaining({
            conversationId: 'conv-123',
            requestId: 'req-pending',
          }),
        );
      });
    });
  });

  describe('cleanup', () => {
    it('should clean up on unmount', () => {
      const { unmount } = renderHook(() => useMessaging(defaultOptions));

      expect(() => unmount()).not.toThrow();
    });
  });
});
