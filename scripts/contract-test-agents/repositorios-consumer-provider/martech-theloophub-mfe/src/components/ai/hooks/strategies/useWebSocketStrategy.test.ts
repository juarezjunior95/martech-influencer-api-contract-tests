import { act, renderHook } from '@testing-library/react-hooks';
import * as processStreamEventModule from 'components/ai/utils/processStreamEvent';
import * as useCases from 'usecases/InsightsCopilotUseCase';

import { useWebSocketStrategy } from './useWebSocketStrategy';

const mockSubscribe = jest.fn() as jest.Mock;
const mockGetLastEventId = jest.fn(() => null);

jest.mock('hooks/useWebPubSub', () => ({
  useWebPubSub: () => ({
    subscribe: mockSubscribe,
    isConnected: true,
    connectionError: null,
    getLastEventId: mockGetLastEventId,
    clearDedup: jest.fn(),
  }),
}));

jest.mock('components/ai/utils/processStreamEvent', () => ({
  processStreamEvent: jest.fn(),
  getSyncTimeoutMs: jest.fn(() => 30000),
  INITIAL_SYNC_TIMEOUT_MS: 30000,
}));

jest.mock('usecases/InsightsCopilotUseCase', () => ({
  syncEventUseCase: jest.fn(),
  startConversationUseCase: jest.fn(),
  addFollowUpMessageUseCase: jest.fn(),
}));

const mockProcessStreamEvent =
  processStreamEventModule.processStreamEvent as jest.Mock;
const mockedUseCases = useCases as jest.Mocked<typeof useCases>;
const mockSyncEventUseCase = mockedUseCases.syncEventUseCase;
const mockStartConversation = mockedUseCases.startConversationUseCase;
const mockAddFollowUp = mockedUseCases.addFollowUpMessageUseCase;

const createDefaultOptions = () => ({
  projectKey: 'test-project',
  dispatch: jest.fn(),
  setProgress: jest.fn(),
  messagesCacheRef: { current: new Map() },
  currentConversationIdRef: { current: null },
  onNewConversationRef: { current: jest.fn() },
});

describe('useWebSocketStrategy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockSubscribe.mockReturnValue(jest.fn());
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return execute, cleanup, isConnected and activeRequestRef', () => {
    const options = createDefaultOptions();
    const { result } = renderHook(() => useWebSocketStrategy(options));

    expect(result.current.execute).toBeDefined();
    expect(result.current.cleanup).toBeDefined();
    expect(result.current.isConnected).toBe(true);
    expect(result.current.activeRequestRef).toBeDefined();
  });

  it('execute should call startConversationUseCase for new conversation', async () => {
    const options = createDefaultOptions();
    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Hello', null, {});
    });

    expect(mockStartConversation).toHaveBeenCalledWith(
      expect.objectContaining({
        query: 'Hello',
        projectKey: 'test-project',
      }),
    );
    expect(mockSubscribe).toHaveBeenCalledWith('conv-1', expect.any(Function));
  });

  it('execute should call addFollowUpMessageUseCase for existing conversation', async () => {
    const options = createDefaultOptions();
    mockAddFollowUp.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-2', question: 'Follow up' }],
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Follow up', 'conv-1', {});
    });

    expect(mockAddFollowUp).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationId: 'conv-1',
        query: 'Follow up',
        projectKey: 'test-project',
      }),
    );
  });

  it('execute should set activeRequestRef', async () => {
    const options = createDefaultOptions();
    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Hello', null, {});
    });

    expect(result.current.activeRequestRef.current).toEqual({
      conversationId: 'conv-1',
      requestId: 'req-1',
      isNewConversation: true,
    });
  });

  it('execute should unsubscribe previous subscription before new one', async () => {
    const mockUnsubscribe = jest.fn();
    mockSubscribe.mockReturnValue(mockUnsubscribe);
    const options = createDefaultOptions();
    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('First', null, {});
    });

    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-2',
      requests: [{ request_id: 'req-2', question: 'Follow up' }],
    });

    await act(async () => {
      await result.current.execute('Second', null, {});
    });

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('cleanup should clear activeRequestRef and unsubscribe', async () => {
    const mockUnsubscribe = jest.fn();
    mockSubscribe.mockReturnValue(mockUnsubscribe);
    const options = createDefaultOptions();
    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Hello', null, {});
    });

    act(() => {
      result.current.cleanup();
    });

    expect(mockUnsubscribe).toHaveBeenCalled();
    expect(result.current.activeRequestRef.current).toBeNull();
  });

  it('should dispatch STREAM_COMPLETE on complete event via WS callback', async () => {
    const options = createDefaultOptions();
    options.currentConversationIdRef.current = null;

    let wsCallback: (event: any) => void;
    mockSubscribe.mockImplementation((_convId: string, cb: any) => {
      wsCallback = cb;
      return jest.fn();
    });

    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    mockProcessStreamEvent.mockReturnValue({
      status: 'complete',
      assistantMessage: { id: 'msg-1', content: 'Response' },
      executionTimeMs: 1000,
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Hello', null, {});
    });

    act(() => {
      wsCallback({ request_id: 'req-1' });
    });

    expect(options.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'STREAM_COMPLETE' }),
    );
  });

  it('should dispatch CHAT_ABANDONED on abandoned event', async () => {
    const options = createDefaultOptions();
    options.currentConversationIdRef.current = null;

    let wsCallback: (event: any) => void;
    mockSubscribe.mockImplementation((_convId: string, cb: any) => {
      wsCallback = cb;
      return jest.fn();
    });

    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    mockProcessStreamEvent.mockReturnValue({
      status: 'abandoned',
      abandonedMessage: { id: 'msg-1', content: 'Interrupted' },
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Hello', null, {});
    });

    act(() => {
      wsCallback({ request_id: 'req-1' });
    });

    expect(options.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'CHAT_ABANDONED' }),
    );
  });

  it('should dispatch STREAM_EVENT on in_progress and reset sync timer', async () => {
    const options = createDefaultOptions();

    let wsCallback: (event: any) => void;
    mockSubscribe.mockImplementation((_convId: string, cb: any) => {
      wsCallback = cb;
      return jest.fn();
    });

    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    mockProcessStreamEvent.mockReturnValue({
      status: 'in_progress',
      step: { node: 'planner' },
      nextToolTimeout: 60,
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Hello', null, {});
    });

    act(() => {
      wsCallback({ request_id: 'req-1' });
    });

    expect(options.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'STREAM_EVENT' }),
    );
  });

  it('should call onNewConversation when complete and isNewConversation', async () => {
    const options = createDefaultOptions();
    options.currentConversationIdRef.current = null;

    let wsCallback: (event: any) => void;
    mockSubscribe.mockImplementation((_convId: string, cb: any) => {
      wsCallback = cb;
      return jest.fn();
    });

    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    mockProcessStreamEvent.mockReturnValue({
      status: 'complete',
      assistantMessage: { id: 'msg-1', content: 'Response' },
      executionTimeMs: 1000,
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Hello', null, {});
    });

    act(() => {
      wsCallback({ request_id: 'req-1' });
    });

    expect(options.onNewConversationRef.current).toHaveBeenCalled();
  });

  it('should ignore WS events with non-matching request_id', async () => {
    const options = createDefaultOptions();

    let wsCallback: (event: any) => void;
    mockSubscribe.mockImplementation((_convId: string, cb: any) => {
      wsCallback = cb;
      return jest.fn();
    });

    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Hello', null, {});
    });

    act(() => {
      wsCallback({ request_id: 'different-req' });
    });

    expect(mockProcessStreamEvent).not.toHaveBeenCalled();
  });

  it('should use getLastEventId for sync timer', async () => {
    mockGetLastEventId.mockReturnValue('12345');
    const options = createDefaultOptions();

    mockStartConversation.mockResolvedValue({
      conversation_id: 'conv-1',
      requests: [{ request_id: 'req-1', question: 'Hello' }],
    });

    mockSyncEventUseCase.mockResolvedValue(null);

    const { result } = renderHook(() => useWebSocketStrategy(options));

    await act(async () => {
      await result.current.execute('Hello', null, {});
    });

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockSyncEventUseCase).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { last_received_event: 12345 },
      }),
    );
  });
});
