import { useCallback } from 'react';

import {
  createAbandonedMessage,
  createAssistantMessage,
  createErrorMessage,
} from 'components/ai/utils';
import { useLatestAsync } from 'hooks/useLatestAsync';
import { ProgressUpdate } from 'models/InsightsCopilot';
import {
  pollForResponseUseCase,
  sendMessageUseCase,
} from 'usecases/InsightsCopilotUseCase';

import type { SmartFlowFields } from '../../types';
import type { ChatAction } from '../chatReducer';

interface UsePollingStrategyOptions {
  projectKey: string;
  dispatch: React.Dispatch<ChatAction>;
  setProgress: (progress: ProgressUpdate | null) => void;
  enableAsyncControl: boolean;
}

export function usePollingStrategy({
  projectKey,
  dispatch,
  setProgress,
  enableAsyncControl,
}: UsePollingStrategyOptions) {
  const messaging = useLatestAsync('cancel');

  const resumePolling = useCallback(
    async (conversationId: string, requestId: string) => {
      try {
        const doPoll = async (signal?: AbortSignal) =>
          pollForResponseUseCase({
            conversationId,
            requestId,
            projectKey,
            onProgress: setProgress,
            signal,
          });

        const pollResult = enableAsyncControl
          ? await messaging.execute((signal) => doPoll(signal))
          : await doPoll();

        if (!pollResult) return;

        if (pollResult.answer === 'ERROR: ABANDONED') {
          dispatch({
            type: 'CHAT_ABANDONED',
            abandonedMessage: createAbandonedMessage(),
            conversationId,
          });
          return;
        }

        if (
          pollResult.answer.startsWith('ERROR:') ||
          pollResult.answer === 'TIMEOUT'
        ) {
          dispatch({
            type: 'SEND_MESSAGE_ERROR',
            errorMessage: createErrorMessage(),
            conversationId,
          });
          return;
        }

        dispatch({
          type: 'SEND_MESSAGE_SUCCESS',
          assistantMessage: createAssistantMessage(
            pollResult.answer,
            requestId,
            {
              charts: pollResult.charts,
              artifacts: pollResult.artifacts,
            },
          ),
          conversationId,
        });
      } catch {
        dispatch({
          type: 'SEND_MESSAGE_ERROR',
          errorMessage: createErrorMessage(),
          conversationId,
        });
      } finally {
        setProgress(null);
      }
    },
    [enableAsyncControl, messaging, projectKey],
  );

  const execute = useCallback(
    async (
      query: string,
      conversationId: string | null,
      smartFlowFields: SmartFlowFields,
    ) => {
      const doSend = async (signal?: AbortSignal) =>
        sendMessageUseCase({
          query,
          projectKey,
          conversationId: conversationId ?? undefined,
          onProgress: setProgress,
          signal,
          ...smartFlowFields,
        });

      const result = enableAsyncControl
        ? await messaging.execute((signal) => doSend(signal))
        : await doSend();

      if (!result) return;

      if (result.answer === 'ERROR: ABANDONED') {
        dispatch({
          type: 'CHAT_ABANDONED',
          abandonedMessage: createAbandonedMessage(),
          conversationId: result.conversationId,
        });
        return;
      }

      if (result.answer.startsWith('ERROR:') || result.answer === 'TIMEOUT') {
        dispatch({
          type: 'SEND_MESSAGE_ERROR',
          errorMessage: createErrorMessage(),
          conversationId: result.conversationId,
        });
        return;
      }

      dispatch({
        type: 'SEND_MESSAGE_SUCCESS',
        assistantMessage: createAssistantMessage(
          result.answer,
          result.requestId,
          {
            charts: result.charts,
            artifacts: result.artifacts,
          },
        ),
        conversationId: result.conversationId,
      });
    },
    [enableAsyncControl, messaging, projectKey],
  );

  const cleanup = useCallback(() => {
    if (enableAsyncControl) {
      messaging.invalidate();
    }
  }, [enableAsyncControl, messaging]);

  return {
    execute,
    resumePolling,
    cleanup,
    invalidate: messaging.invalidate,
  };
}
