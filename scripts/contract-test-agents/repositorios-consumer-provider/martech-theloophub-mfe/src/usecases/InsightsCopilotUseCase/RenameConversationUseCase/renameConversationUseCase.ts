import { RenameConversationResponse } from 'models/InsightsCopilot';
import { renameConversationService } from 'services/InsightsCopilotService';

interface RenameConversationInput {
  conversationId: string;
  projectKey: string;
  name: string;
}

export default async function renameConversationUseCase(
  input: RenameConversationInput,
): Promise<RenameConversationResponse> {
  if (
    !input.conversationId ||
    input.conversationId.trim().length === 0 ||
    !input.projectKey ||
    input.projectKey.trim().length === 0 ||
    !input.name ||
    input.name.trim().length === 0
  ) {
    return {
      conversation_id: '',
      name: '',
      project_key: '',
      user_email: '',
      created_at: '',
      updated_at: '',
    };
  }

  return renameConversationService({
    conversationId: input.conversationId,
    projectKey: input.projectKey,
    name: input.name.trim(),
  });
}
