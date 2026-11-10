import { Artifact, Chart, ProgressUpdate } from 'models/InsightsCopilot';

import pollForResponseUseCase from '../PollForResponseUseCase/pollForResponseUseCase';
import addFollowUpMessageUseCase from './AddFollowUpMessageUseCase/addFollowUpMessageUseCase';
import startConversationUseCase from './StartConversationUseCase/startConversationUseCase';

export interface SendMessageInput {
  query: string;
  projectKey: string;
  conversationId?: string;
  onProgress?: (update: ProgressUpdate) => void;
  signal?: AbortSignal;
  isSmartflow?: boolean;
  smartflowFunctionName?: string;
  smartflowParameters?: Record<string, string[]>;
}

export interface SendMessageResult {
  conversationId: string;
  requestId: string;
  answer: string;
  charts: Chart[];
  artifacts: Artifact[];
}

export default async function sendMessageUseCase(
  input: SendMessageInput,
): Promise<SendMessageResult> {
  const smartflowFields = input.isSmartflow
    ? {
        isSmartflow: input.isSmartflow,
        smartflowFunctionName: input.smartflowFunctionName,
        smartflowParameters: input.smartflowParameters,
      }
    : {};

  const conversation = input.conversationId
    ? await addFollowUpMessageUseCase({
        conversationId: input.conversationId,
        query: input.query,
        projectKey: input.projectKey,
        signal: input.signal,
        ...smartflowFields,
      })
    : await startConversationUseCase({
        query: input.query,
        projectKey: input.projectKey,
        signal: input.signal,
        ...smartflowFields,
      });

  const mostRecentRequestId = conversation.requests[0]?.request_id;

  const pollResult = await pollForResponseUseCase({
    conversationId: conversation.conversation_id ?? '',
    requestId: mostRecentRequestId ?? '',
    projectKey: input.projectKey,
    onProgress: input.onProgress,
    signal: input.signal,
  });

  return {
    conversationId: conversation.conversation_id ?? '',
    requestId: mostRecentRequestId ?? '',
    answer: pollResult.answer,
    charts: pollResult.charts,
    artifacts: pollResult.artifacts,
  };
}
