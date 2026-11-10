import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

import { createUserMessage } from 'components/ai/utils';
import { useLatestAsync } from 'hooks/useLatestAsync';
import {
  Message,
  ProgressUpdate,
  SmartFlowSendParams,
} from 'models/InsightsCopilot';
import { getConversationDetailsUseCase } from 'usecases/InsightsCopilotUseCase';

import { DEFAULT_CLARA_PROJECT_KEY } from '../constants/projectKeys';
import type { SmartFlowFields } from '../types';
import {
  chatReducer,
  detectFailedQuery,
  initialChatState,
} from './chatReducer';
import { usePollingStrategy } from './strategies/usePollingStrategy';
import { useWebSocketStrategy } from './strategies/useWebSocketStrategy';

function extractSmartFlowFields(params?: SmartFlowSendParams): SmartFlowFields {
  if (!params?.is_smartflow) return {};
  return {
    isSmartflow: params.is_smartflow,
    smartflowFunctionName: params.smartflow_function_name,
    smartflowParameters: params.smartflow_parameters,
  };
}

export interface UseMessagingOptions {
  projectKey?: string;
  enableAsyncControl?: boolean;
  enableWebSocket?: boolean;
  enablePolling?: boolean;
  onNewConversation?: () => void;
}

export function useMessaging(options: UseMessagingOptions = {}) {
  const {
    projectKey = DEFAULT_CLARA_PROJECT_KEY,
    enableAsyncControl = false,
    enableWebSocket = true,
    enablePolling = false,
    onNewConversation,
  } = options;

  const [chatState, dispatch] = useReducer(chatReducer, initialChatState);
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);

  const navigation = useLatestAsync('discard');
  const messagesCacheRef = useRef<Map<string, Message[]>>(new Map());

  const currentConversationIdRef = useRef(chatState.conversationId);
  currentConversationIdRef.current = chatState.conversationId;

  const onNewConversationRef = useRef(onNewConversation);
  onNewConversationRef.current = onNewConversation;

  const wsStrategy = useWebSocketStrategy({
    projectKey,
    dispatch,
    setProgress,
    messagesCacheRef,
    currentConversationIdRef,
    onNewConversationRef,
  });

  const pollingStrategy = usePollingStrategy({
    projectKey,
    dispatch,
    setProgress,
    enableAsyncControl,
  });

  const activeStrategy = enableWebSocket ? wsStrategy : pollingStrategy;

  const loadConversation = useCallback(
    async (targetConversationId: string) => {
      try {
        if (chatState.conversationId && chatState.messages.length > 0) {
          messagesCacheRef.current.set(
            chatState.conversationId,
            chatState.messages,
          );
        }

        if (enableAsyncControl) {
          pollingStrategy.invalidate();
        }

        const doLoad = async () =>
          getConversationDetailsUseCase({
            conversationId: targetConversationId,
            projectKey,
          });

        const result = enableAsyncControl
          ? await navigation.execute(() => doLoad())
          : await doLoad();

        if (!result) return null;

        const cached = messagesCacheRef.current.get(result.conversationId);
        const apiMessages = result.messages;

        const hasActiveWsRequest =
          wsStrategy.activeRequestRef.current?.conversationId ===
          result.conversationId;

        const preferCache =
          cached != null &&
          (cached.length > apiMessages.length || hasActiveWsRequest);

        const hasPendingWork =
          result.pendingRequest && !preferCache && !hasActiveWsRequest;

        if (enablePolling && hasPendingWork) {
          dispatch({
            type: 'RESUME_POLLING',
            messages: apiMessages,
            conversationId: result.conversationId,
            query: result.pendingRequest.question,
          });

          pollingStrategy.resumePolling(
            result.conversationId,
            result.pendingRequest.requestId,
          );
        } else {
          const messages = preferCache ? cached : apiMessages;

          dispatch({
            type: 'LOAD_CONVERSATION',
            messages,
            conversationId: result.conversationId,
            lastFailedQuery: detectFailedQuery(messages),
            streaming: hasActiveWsRequest,
          });

          if (!preferCache) {
            messagesCacheRef.current.delete(result.conversationId);
          }
        }

        return result;
      } catch {
        return null;
      }
    },
    [
      enableAsyncControl,
      enablePolling,
      navigation,
      projectKey,
      pollingStrategy,
      wsStrategy.activeRequestRef,
      chatState.conversationId,
      chatState.messages,
    ],
  );

  const sendMessage = useCallback(
    async (query: string, smartFlowParams?: SmartFlowSendParams) => {
      if (!query.trim() || chatState.loading) return;

      const trimmedQuery = query.trim();
      const isNewConversation = !chatState.conversationId;

      dispatch({
        type: 'SEND_MESSAGE_START',
        userMessage: createUserMessage(trimmedQuery),
        query: trimmedQuery,
        streaming: enableWebSocket,
      });

      const smartFlowFields = extractSmartFlowFields(smartFlowParams);

      try {
        await activeStrategy.execute(
          trimmedQuery,
          chatState.conversationId,
          smartFlowFields,
        );

        if (!enableWebSocket && isNewConversation) {
          onNewConversationRef.current?.();
        }
      } catch {
        dispatch({ type: 'SEND_FAILURE' });
      } finally {
        setProgress(null);
      }
    },
    [
      chatState.conversationId,
      chatState.loading,
      enableWebSocket,
      activeStrategy,
    ],
  );

  const retryLastMessage = useCallback(async () => {
    if (!chatState.lastFailedQuery || chatState.loading) return;

    const isNewConversation = !chatState.conversationId;

    dispatch({ type: 'RETRY_START', streaming: enableWebSocket });

    try {
      await activeStrategy.execute(
        chatState.lastFailedQuery,
        chatState.conversationId,
        {},
      );

      if (!enableWebSocket && isNewConversation) {
        onNewConversationRef.current?.();
      }
    } catch {
      dispatch({ type: 'SEND_FAILURE' });
    } finally {
      setProgress(null);
    }
  }, [
    chatState.lastFailedQuery,
    chatState.loading,
    chatState.conversationId,
    enableWebSocket,
    activeStrategy,
  ]);

  const newChat = useCallback(() => {
    pollingStrategy.cleanup();
    wsStrategy.cleanup();
    if (enableAsyncControl) {
      navigation.invalidate();
    }
    dispatch({ type: 'NEW_CHAT' });
  }, [enableAsyncControl, navigation, pollingStrategy, wsStrategy]);

  useEffect(() => {
    return () => {
      wsStrategy.cleanup();
    };
  }, [wsStrategy]);

  return {
    sendMessage,
    retryLastMessage,
    newChat,
    loadConversation,

    messages: chatState.messages,
    conversationId: chatState.conversationId,
    loading: chatState.loading,
    lastFailedQuery: chatState.lastFailedQuery,
    progress,

    streamingSteps: chatState.streamingSteps,
    streamingStatus: chatState.streamingStatus,

    isAbandoned: chatState.isAbandoned,

    isWebSocketConnected: wsStrategy.isConnected,
  };
}
