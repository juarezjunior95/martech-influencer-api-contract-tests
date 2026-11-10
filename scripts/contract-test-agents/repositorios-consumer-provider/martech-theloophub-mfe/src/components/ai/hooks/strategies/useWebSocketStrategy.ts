import { useCallback, useMemo, useRef } from 'react';

import {
  getSyncTimeoutMs,
  INITIAL_SYNC_TIMEOUT_MS,
  processStreamEvent,
} from 'components/ai/utils/processStreamEvent';
import { useWebPubSub } from 'hooks/useWebPubSub';
import {
  Message,
  PollingResponse,
  ProgressUpdate,
} from 'models/InsightsCopilot';
import { syncEventUseCase } from 'usecases/InsightsCopilotUseCase';

import type { SmartFlowFields } from '../../types';
import type { ChatAction } from '../chatReducer';

interface ActiveRequest {
  conversationId: string;
  requestId: string;
  isNewConversation: boolean;
}

interface UseWebSocketStrategyOptions {
  projectKey: string;
  dispatch: React.Dispatch<ChatAction>;
  setProgress: (progress: ProgressUpdate | null) => void;
  messagesCacheRef: React.MutableRefObject<Map<string, Message[]>>;
  currentConversationIdRef: React.MutableRefObject<string | null>;
  onNewConversationRef: React.MutableRefObject<(() => void) | undefined>;
}

export function useWebSocketStrategy({
  projectKey,
  dispatch,
  setProgress,
  messagesCacheRef,
  currentConversationIdRef,
  onNewConversationRef,
}: UseWebSocketStrategyOptions) {
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const activeRequestRef = useRef<ActiveRequest | null>(null);

  const { subscribe, isConnected, getLastEventId } = useWebPubSub({
    projectKey,
    enabled: true,
  });

  const resetSyncTimer = useCallback(
    (requestId: string, timeout: number) => {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(async () => {
        const req = activeRequestRef.current;
        if (req?.requestId !== requestId) return;

        try {
          const lastEventId = getLastEventId();
          const eventIdNum = lastEventId
            ? Number.parseInt(lastEventId, 10)
            : undefined;
          const syncResult = await syncEventUseCase({
            requestId,
            projectKey,
            body: eventIdNum ? { last_received_event: eventIdNum } : undefined,
          });

          if (!syncResult) return;

          const isComplete = handleWebSocketEvent(
            syncResult,
            req.conversationId,
            req.requestId,
            req.isNewConversation,
          );

          if (isComplete) {
            unsubscribeRef.current?.();
            unsubscribeRef.current = null;
          }
        } catch {
          resetSyncTimer(requestId, getSyncTimeoutMs());
        }
      }, timeout);
    },
    [getLastEventId, projectKey],
  );

  const handleWebSocketEvent = useCallback(
    (
      event: PollingResponse,
      conversationId: string,
      requestId: string,
      isNewConversation: boolean,
    ): boolean => {
      const result = processStreamEvent(event, requestId);

      if (result.status === 'in_progress') {
        dispatch({ type: 'STREAM_EVENT', event: result.step });
        resetSyncTimer(requestId, getSyncTimeoutMs(result.nextToolTimeout));
        return false;
      }

      clearTimeout(syncTimerRef.current);
      activeRequestRef.current = null;
      setProgress(null);

      if (
        currentConversationIdRef.current !== null &&
        currentConversationIdRef.current !== conversationId
      ) {
        if (result.status === 'complete') {
          const cached = messagesCacheRef.current.get(conversationId);
          if (cached) {
            messagesCacheRef.current.set(conversationId, [
              ...cached,
              result.assistantMessage,
            ]);
          }
        }
        return true;
      }

      if (result.status === 'complete') {
        dispatch({
          type: 'STREAM_COMPLETE',
          assistantMessage: result.assistantMessage,
          conversationId,
          executionTimeMs: result.executionTimeMs,
        });
        if (isNewConversation) {
          onNewConversationRef.current?.();
        }
      } else if (result.status === 'error') {
        dispatch({
          type: 'STREAM_ERROR',
          errorMessage: result.errorMessage,
          conversationId,
        });
      } else {
        dispatch({
          type: 'CHAT_ABANDONED',
          abandonedMessage: result.abandonedMessage,
          conversationId,
        });
      }

      return true;
    },
    [resetSyncTimer],
  );

  const execute = useCallback(
    async (
      query: string,
      conversationId: string | null,
      smartFlowFields: SmartFlowFields,
    ) => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      const { startConversationUseCase, addFollowUpMessageUseCase } =
        await import('usecases/InsightsCopilotUseCase');

      const conversation = conversationId
        ? await addFollowUpMessageUseCase({
            conversationId,
            query,
            projectKey,
            ...smartFlowFields,
          })
        : await startConversationUseCase({
            query,
            projectKey,
            ...smartFlowFields,
          });

      const newConversationId = conversation.conversation_id ?? '';
      const requestId = conversation.requests[0]?.request_id ?? '';
      const isNewConversation = !conversationId;

      activeRequestRef.current = {
        conversationId: newConversationId,
        requestId,
        isNewConversation,
      };

      unsubscribeRef.current = subscribe(
        newConversationId,
        (event: PollingResponse) => {
          if (event.request_id !== requestId) return;

          const isComplete = handleWebSocketEvent(
            event,
            newConversationId,
            requestId,
            isNewConversation,
          );

          if (isComplete) {
            unsubscribeRef.current?.();
            unsubscribeRef.current = null;
          }
        },
      );

      resetSyncTimer(requestId, INITIAL_SYNC_TIMEOUT_MS);
    },
    [handleWebSocketEvent, projectKey, resetSyncTimer, subscribe],
  );

  const cleanup = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    clearTimeout(syncTimerRef.current);
    activeRequestRef.current = null;
  }, []);

  return useMemo(
    () => ({
      execute,
      cleanup,
      isConnected,
      activeRequestRef,
    }),
    [execute, cleanup, isConnected],
  );
}
