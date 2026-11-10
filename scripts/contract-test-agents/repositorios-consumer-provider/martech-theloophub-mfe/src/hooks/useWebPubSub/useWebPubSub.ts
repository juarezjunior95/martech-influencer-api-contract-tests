import { useCallback, useEffect, useRef, useState } from 'react';

import type { PollingResponse } from 'models/InsightsCopilot';
import { negotiateUseCase } from 'usecases/InsightsCopilotUseCase';

interface UseWebPubSubOptions {
  projectKey: string;
  enabled?: boolean;
}

interface UseWebPubSubReturn {
  subscribe: (
    conversationId: string,
    onEvent: (event: PollingResponse) => void,
  ) => () => void;
  isConnected: boolean;
  connectionError: Error | null;
  getLastEventId: () => string | null;
  clearDedup: () => void;
}

const TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000; // 4 min (token expires in 5)
const RECONNECT_BASE_DELAY = 1000;
const RECONNECT_MAX_DELAY = 30000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseJsonIfString(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function isSystemEvent(value: unknown): boolean {
  return isRecord(value) && value.type === 'system';
}

function extractMessagePayload(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if (value.type !== 'message' || !value.data) return value;

  return parseJsonIfString(value.data);
}

function parsePollingEvent(data: string): PollingResponse | null {
  // Handle double-encoded JSON (Azure Web PubSub may
  // deliver data as a JSON-encoded string)
  const raw = parseJsonIfString(JSON.parse(data));

  if (isSystemEvent(raw)) return null;

  const payload = parseJsonIfString(extractMessagePayload(raw));

  return payload as PollingResponse;
}

function getConversationId(event: PollingResponse): string | undefined {
  return (
    event.metadata?.conversation_id ?? event.task_response?.conversation_id
  );
}

export function useWebPubSub({
  projectKey,
  enabled = true,
}: UseWebPubSubOptions): UseWebPubSubReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const subscriptionsRef = useRef<
    Map<string, Set<(event: PollingResponse) => void>>
  >(new Map());
  const eventBufferRef = useRef<Map<string, PollingResponse[]>>(new Map());
  const seenKeysRef = useRef<Set<string>>(new Set());
  const lastSortKeyRef = useRef<string | null>(null);
  const lastEventIdRef = useRef<string | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(true);
  const connectRef = useRef<() => void>(() => undefined);

  const scheduleReconnect = useCallback(() => {
    clearTimeout(reconnectTimerRef.current);

    const attempt = reconnectAttemptRef.current;
    const delay = Math.min(
      RECONNECT_BASE_DELAY * Math.pow(2, attempt),
      RECONNECT_MAX_DELAY,
    );
    reconnectAttemptRef.current = attempt + 1;

    reconnectTimerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        connectRef.current();
      }
    }, delay);
  }, []);

  const handlePollingEvent = useCallback((pollingEvent: PollingResponse) => {
    if (pollingEvent.sort_key) {
      if (seenKeysRef.current.has(pollingEvent.sort_key)) return;
      seenKeysRef.current.add(pollingEvent.sort_key);
      lastSortKeyRef.current = pollingEvent.sort_key;
    }

    if (pollingEvent.event_id) {
      lastEventIdRef.current = pollingEvent.event_id;
    }

    const conversationId = getConversationId(pollingEvent);

    if (!conversationId) return;

    const handlers = subscriptionsRef.current.get(conversationId);

    if (handlers && handlers.size > 0) {
      handlers.forEach((handler) => handler(pollingEvent));
      return;
    }

    // Buffer events that arrive before subscribe() is called
    const buffer = eventBufferRef.current.get(conversationId) ?? [];
    buffer.push(pollingEvent);
    eventBufferRef.current.set(conversationId, buffer);
  }, []);

  const connect = useCallback(async () => {
    if (!enabled || !mountedRef.current) return;

    try {
      const negotiation = await negotiateUseCase({ projectKey });
      if (!mountedRef.current) return;

      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }

      const ws = new WebSocket(negotiation.url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptRef.current = 0;
      };

      ws.onmessage = (event) => {
        if (!mountedRef.current) return;

        try {
          const pollingEvent = parsePollingEvent(event.data);

          if (pollingEvent) handlePollingEvent(pollingEvent);
        } catch {
          // Failed to parse WebSocket message
        }
      };

      ws.onerror = () => {
        if (!mountedRef.current) return;
        setConnectionError(new Error('WebSocket connection error'));
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setIsConnected(false);
        scheduleReconnect();
      };

      // Schedule token refresh
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(() => {
        if (mountedRef.current) {
          void connect();
        }
      }, TOKEN_REFRESH_INTERVAL);
    } catch (err) {
      if (!mountedRef.current) return;
      setConnectionError(
        err instanceof Error ? err : new Error('Failed to negotiate'),
      );
      setIsConnected(false);
      scheduleReconnect();
    }
  }, [enabled, handlePollingEvent, projectKey, scheduleReconnect]);

  const subscribe = useCallback(
    (
      conversationId: string,
      onEvent: (event: PollingResponse) => void,
    ): (() => void) => {
      let handlers = subscriptionsRef.current.get(conversationId);

      if (!handlers) {
        handlers = new Set();
        subscriptionsRef.current.set(conversationId, handlers);
      }

      handlers.add(onEvent);

      // Replay any buffered events for this conversationId
      const buffered = eventBufferRef.current.get(conversationId);
      if (buffered && buffered.length > 0) {
        buffered.forEach((event) => onEvent(event));
        eventBufferRef.current.delete(conversationId);
      }

      return () => {
        const handlers = subscriptionsRef.current.get(conversationId);
        if (handlers) {
          handlers.delete(onEvent);
          if (handlers.size === 0) {
            subscriptionsRef.current.delete(conversationId);
          }
        }
      };
    },
    [],
  );

  const clearDedup = useCallback(() => {
    seenKeysRef.current.clear();
    lastSortKeyRef.current = null;
    lastEventIdRef.current = null;
  }, []);

  useEffect(() => {
    connectRef.current = () => {
      void connect();
    };
  }, [connect]);

  // Connect on mount (if enabled)
  useEffect(() => {
    mountedRef.current = true;
    const subscriptions = subscriptionsRef.current;
    const seenKeys = seenKeysRef.current;

    if (enabled) {
      void connect();
    }

    return () => {
      mountedRef.current = false;
      clearTimeout(reconnectTimerRef.current);
      clearTimeout(refreshTimerRef.current);

      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
        wsRef.current = null;
      }

      subscriptions.clear();
      seenKeys.clear();
    };
  }, [enabled, connect]);

  // Tab visibility: reconnect when tab becomes visible
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !isConnected) {
        void connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, isConnected, connect]);

  const getLastEventId = useCallback(() => lastEventIdRef.current, []);

  return {
    subscribe,
    isConnected,
    connectionError,
    getLastEventId,
    clearDedup,
  };
}
