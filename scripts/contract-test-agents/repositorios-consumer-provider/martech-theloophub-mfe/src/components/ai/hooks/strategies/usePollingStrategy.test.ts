import { act, renderHook } from '@testing-library/react-hooks';
import * as useCases from 'usecases/InsightsCopilotUseCase';

import { usePollingStrategy } from './usePollingStrategy';

jest.mock('hooks/useLatestAsync', () => ({
  useLatestAsync: () => ({
    execute: jest.fn((fn) => fn()),
    invalidate: jest.fn(),
  }),
}));

jest.mock('usecases/InsightsCopilotUseCase', () => ({
  pollForResponseUseCase: jest.fn(),
  sendMessageUseCase: jest.fn(),
}));

jest.mock('components/ai/utils', () => ({
  createAbandonedMessage: () => ({
    id: 'abandoned-msg',
    role: 'assistant',
    content: 'This conversation was interrupted.',
    isError: true,
    isAbandoned: true,
  }),
  createAssistantMessage: (content: string, requestId: string) => ({
    id: `msg-${requestId}`,
    role: 'assistant',
    content,
    requestId,
  }),
  createErrorMessage: () => ({
    id: 'error-msg',
    role: 'assistant',
    content: 'Sorry, something went wrong.',
    isError: true,
  }),
}));

const mockedUseCases = useCases as jest.Mocked<typeof useCases>;
const mockPollForResponse = mockedUseCases.pollForResponseUseCase;
const mockSendMessage = mockedUseCases.sendMessageUseCase;

const createDefaultOptions = () => ({
  projectKey: 'test-project',
  dispatch: jest.fn(),
  setProgress: jest.fn(),
  enableAsyncControl: false,
});

describe('usePollingStrategy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return execute, resumePolling, cleanup and invalidate', () => {
    const options = createDefaultOptions();
    const { result } = renderHook(() => usePollingStrategy(options));

    expect(result.current.execute).toBeDefined();
    expect(result.current.resumePolling).toBeDefined();
    expect(result.current.cleanup).toBeDefined();
    expect(result.current.invalidate).toBeDefined();
  });

  describe('execute', () => {
    it('should dispatch SEND_MESSAGE_SUCCESS on successful response', async () => {
      const options = createDefaultOptions();
      mockSendMessage.mockResolvedValue({
        conversationId: 'conv-1',
        requestId: 'req-1',
        answer: 'Response text',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.execute('Hello', null, {});
      });

      expect(options.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SEND_MESSAGE_SUCCESS' }),
      );
    });

    it('should dispatch SEND_MESSAGE_ERROR on ERROR response', async () => {
      const options = createDefaultOptions();
      mockSendMessage.mockResolvedValue({
        conversationId: 'conv-1',
        requestId: 'req-1',
        answer: 'ERROR: something failed',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.execute('Hello', null, {});
      });

      expect(options.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SEND_MESSAGE_ERROR' }),
      );
    });

    it('should dispatch SEND_MESSAGE_ERROR on TIMEOUT response', async () => {
      const options = createDefaultOptions();
      mockSendMessage.mockResolvedValue({
        conversationId: 'conv-1',
        requestId: 'req-1',
        answer: 'TIMEOUT',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.execute('Hello', null, {});
      });

      expect(options.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SEND_MESSAGE_ERROR' }),
      );
    });

    it('should dispatch CHAT_ABANDONED on ABANDONED response', async () => {
      const options = createDefaultOptions();
      mockSendMessage.mockResolvedValue({
        conversationId: 'conv-1',
        requestId: 'req-1',
        answer: 'ERROR: ABANDONED',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.execute('Hello', null, {});
      });

      expect(options.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'CHAT_ABANDONED' }),
      );
    });

    it('should pass conversationId for follow-up messages', async () => {
      const options = createDefaultOptions();
      mockSendMessage.mockResolvedValue({
        conversationId: 'conv-1',
        requestId: 'req-2',
        answer: 'Follow up response',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.execute('Follow up', 'conv-1', {});
      });

      expect(mockSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          conversationId: 'conv-1',
          query: 'Follow up',
        }),
      );
    });
  });

  describe('resumePolling', () => {
    it('should dispatch SEND_MESSAGE_SUCCESS on successful poll', async () => {
      const options = createDefaultOptions();
      mockPollForResponse.mockResolvedValue({
        answer: 'Polled answer',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.resumePolling('conv-1', 'req-1');
      });

      expect(options.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SEND_MESSAGE_SUCCESS' }),
      );
    });

    it('should dispatch SEND_MESSAGE_ERROR on ERROR poll result', async () => {
      const options = createDefaultOptions();
      mockPollForResponse.mockResolvedValue({
        answer: 'ERROR: something failed',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.resumePolling('conv-1', 'req-1');
      });

      expect(options.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SEND_MESSAGE_ERROR' }),
      );
    });

    it('should dispatch CHAT_ABANDONED on ABANDONED poll result', async () => {
      const options = createDefaultOptions();
      mockPollForResponse.mockResolvedValue({
        answer: 'ERROR: ABANDONED',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.resumePolling('conv-1', 'req-1');
      });

      expect(options.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'CHAT_ABANDONED' }),
      );
    });

    it('should dispatch SEND_MESSAGE_ERROR when poll throws', async () => {
      const options = createDefaultOptions();
      mockPollForResponse.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.resumePolling('conv-1', 'req-1');
      });

      expect(options.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'SEND_MESSAGE_ERROR' }),
      );
    });

    it('should call setProgress(null) after polling completes', async () => {
      const options = createDefaultOptions();
      mockPollForResponse.mockResolvedValue({
        answer: 'Response',
        charts: [],
        artifacts: [],
      });

      const { result } = renderHook(() => usePollingStrategy(options));

      await act(async () => {
        await result.current.resumePolling('conv-1', 'req-1');
      });

      expect(options.setProgress).toHaveBeenCalledWith(null);
    });
  });
});
