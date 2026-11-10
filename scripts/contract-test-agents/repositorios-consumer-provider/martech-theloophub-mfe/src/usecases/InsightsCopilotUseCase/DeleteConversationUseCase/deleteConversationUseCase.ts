import { DeleteConversationResponse } from 'models/InsightsCopilot';
import { deleteConversationService } from 'services/InsightsCopilotService';

interface DeleteConversationInput {
  conversationId: string;
  projectKey: string;
}

export default async function deleteConversationUseCase(
  input: DeleteConversationInput,
): Promise<DeleteConversationResponse> {
  if (
    !input.conversationId ||
    input.conversationId.trim().length === 0 ||
    !input.projectKey ||
    input.projectKey.trim().length === 0
  ) {
    return {
      message: 'Invalid input parameters',
    };
  }

  return deleteConversationService({
    conversationId: input.conversationId,
    projectKey: input.projectKey,
  });
}
