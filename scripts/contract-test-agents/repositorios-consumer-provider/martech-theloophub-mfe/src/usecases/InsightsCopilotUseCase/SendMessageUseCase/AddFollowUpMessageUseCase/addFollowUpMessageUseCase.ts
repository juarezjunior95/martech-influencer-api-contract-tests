import { AddFollowUpMessageResponse } from 'models/InsightsCopilot';
import { addFollowUpMessageService } from 'services/InsightsCopilotService';

interface AddFollowUpMessageInput {
  conversationId: string;
  query: string;
  projectKey: string;
  signal?: AbortSignal;
  isSmartflow?: boolean;
  smartflowFunctionName?: string;
  smartflowParameters?: Record<string, string[]>;
}

export default async function addFollowUpMessageUseCase(
  input: AddFollowUpMessageInput,
): Promise<AddFollowUpMessageResponse> {
  if (
    !input.query ||
    input.query.trim().length === 0 ||
    input.query.length > 5000 ||
    input.conversationId.trim().length === 0 ||
    !input.conversationId
  ) {
    return {
      conversation_id: '',
      requests: [],
    };
  }

  return addFollowUpMessageService(input);
}
