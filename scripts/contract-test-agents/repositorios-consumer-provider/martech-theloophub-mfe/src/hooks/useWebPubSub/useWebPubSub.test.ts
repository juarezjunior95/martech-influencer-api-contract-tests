import { act, cleanup, renderHook } from '@testing-library/react-hooks';
import type { PollingResponse } from 'models/InsightsCopilot';
import { negotiateUseCase } from 'usecases/InsightsCopilotUseCase';

import { useWebPubSub } from './useWebPubSub';

jest.mock('usecases/InsightsCopilotUseCase', () => ({
  negotiateUseCase: jest.fn(),
}));

const mockNegotiateUseCase = negotiateUseCase as jest.Mock;
const originalWebSocket = globalThis.WebSocket;

class MockWebSocket {
  static instances: MockWebSocket[] = [];

  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  close = jest.fn();

  constructor(public readonly url: string) {
    MockWebSocket.instances.push(this);
  }

  emitOpen() {
    this.onopen?.(new Event('open'));
  }

  emitMessage(data: string) {
    this.onmessage?.({ data } as MessageEvent);
  }
}

function createPollingEvent(
  overrides: Partial<PollingResponse> = {},
): PollingResponse {
  return {
    event_id: 'event-1',
    request_id: 'request-1',
    request_state: 'RUNNING',
    task_code: 'planner',
    module_name: 'agent',
    sort_key: 'sort-1',
    metadata: {
      conversation_id: 'conversation-1',
      project_key: 'project-1',
      user_email: 'test@example.com',
    },
    ...overrides,
  };
}

async function renderUseWebPubSub() {
  const hook = renderHook(() =>
    useWebPubSub({ projectKey: 'project-1', enabled: true }),
  );

  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

  return hook;
}

describe('useWebPubSub', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    MockWebSocket.instances = [];
    mockNegotiateUseCase.mockResolvedValue({
      baseUrl: 'https://pubsub.test',
      token: 'token',
      url: 'wss://pubsub.test/client',
    });
    globalThis.WebSocket = MockWebSocket as unknown as typeof WebSocket;
  });

  afterEach(async () => {
    await cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
    globalThis.WebSocket = originalWebSocket;
  });

  it('connects using the negotiated WebSocket URL', async () => {
    const { result } = await renderUseWebPubSub();

    expect(mockNegotiateUseCase).toHaveBeenCalledWith({
      projectKey: 'project-1',
    });
    expect(MockWebSocket.instances[0].url).toBe('wss://pubsub.test/client');

    act(() => {
      MockWebSocket.instances[0].emitOpen();
    });

    expect(result.current.isConnected).toBe(true);
  });

  it('delivers a direct polling event to the matching subscription', async () => {
    const { result } = await renderUseWebPubSub();
    const onEvent = jest.fn();
    const pollingEvent = createPollingEvent();

    act(() => {
      result.current.subscribe('conversation-1', onEvent);
      MockWebSocket.instances[0].emitMessage(JSON.stringify(pollingEvent));
    });

    expect(onEvent).toHaveBeenCalledWith(pollingEvent);
  });

  it('extracts polling events from Azure Web PubSub message envelopes', async () => {
    const { result } = await renderUseWebPubSub();
    const onEvent = jest.fn();
    const pollingEvent = createPollingEvent();

    act(() => {
      result.current.subscribe('conversation-1', onEvent);
      MockWebSocket.instances[0].emitMessage(
        JSON.stringify({ type: 'message', data: pollingEvent }),
      );
    });

    expect(onEvent).toHaveBeenCalledWith(pollingEvent);
  });

  it('handles stringified and double-encoded payloads', async () => {
    const { result } = await renderUseWebPubSub();
    const onEvent = jest.fn();
    const pollingEvent = createPollingEvent();

    act(() => {
      result.current.subscribe('conversation-1', onEvent);
      MockWebSocket.instances[0].emitMessage(
        JSON.stringify({
          type: 'message',
          data: JSON.stringify(JSON.stringify(pollingEvent)),
        }),
      );
    });

    expect(onEvent).toHaveBeenCalledWith(pollingEvent);
  });

  it('ignores Azure Web PubSub system events', async () => {
    const { result } = await renderUseWebPubSub();
    const onEvent = jest.fn();

    act(() => {
      result.current.subscribe('conversation-1', onEvent);
      MockWebSocket.instances[0].emitMessage(
        JSON.stringify({ type: 'system', event: 'connected' }),
      );
    });

    expect(onEvent).not.toHaveBeenCalled();
  });

  it('ignores invalid JSON messages without throwing', async () => {
    const { result } = await renderUseWebPubSub();
    const onEvent = jest.fn();

    expect(() => {
      act(() => {
        result.current.subscribe('conversation-1', onEvent);
        MockWebSocket.instances[0].emitMessage('not-json');
      });
    }).not.toThrow();
    expect(onEvent).not.toHaveBeenCalled();
  });

  it('deduplicates events with the same sort_key', async () => {
    const { result } = await renderUseWebPubSub();
    const onEvent = jest.fn();
    const firstEvent = createPollingEvent({ event_id: 'event-1' });
    const duplicateEvent = createPollingEvent({ event_id: 'event-2' });

    act(() => {
      result.current.subscribe('conversation-1', onEvent);
      MockWebSocket.instances[0].emitMessage(JSON.stringify(firstEvent));
      MockWebSocket.instances[0].emitMessage(JSON.stringify(duplicateEvent));
    });

    expect(onEvent).toHaveBeenCalledTimes(1);
    expect(onEvent).toHaveBeenCalledWith(firstEvent);
  });

  it('stores the last received event_id', async () => {
    const { result } = await renderUseWebPubSub();
    const onEvent = jest.fn();
    const pollingEvent = createPollingEvent({ event_id: 'event-42' });

    act(() => {
      result.current.subscribe('conversation-1', onEvent);
      MockWebSocket.instances[0].emitMessage(JSON.stringify(pollingEvent));
    });

    expect(result.current.getLastEventId()).toBe('event-42');
  });

  it('buffers events that arrive before subscribe is called', async () => {
    const { result } = await renderUseWebPubSub();
    const onEvent = jest.fn();
    const pollingEvent = createPollingEvent();

    act(() => {
      MockWebSocket.instances[0].emitMessage(JSON.stringify(pollingEvent));
    });

    expect(onEvent).not.toHaveBeenCalled();

    act(() => {
      result.current.subscribe('conversation-1', onEvent);
    });

    expect(onEvent).toHaveBeenCalledWith(pollingEvent);
  });

  it('removes handlers when unsubscribe is called', async () => {
    const { result } = await renderUseWebPubSub();
    const onEvent = jest.fn();
    const pollingEvent = createPollingEvent();
    let unsubscribe: () => void;

    act(() => {
      unsubscribe = result.current.subscribe('conversation-1', onEvent);
      unsubscribe();
      MockWebSocket.instances[0].emitMessage(JSON.stringify(pollingEvent));
    });

    expect(onEvent).not.toHaveBeenCalled();
  });
});
