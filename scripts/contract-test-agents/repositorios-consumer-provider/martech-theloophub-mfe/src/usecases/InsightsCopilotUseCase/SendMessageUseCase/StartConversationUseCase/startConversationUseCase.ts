import { StartConversationResponse } from 'models/InsightsCopilot';
import { startConversationService } from 'services/InsightsCopilotService';

interface StartConversationInput {
  query: string;
  projectKey: string;
  signal?: AbortSignal;
  isSmartflow?: boolean;
  smartflowFunctionName?: string;
  smartflowParameters?: Record<string, string[]>;
}

export default async function startConversationUseCase(
  input: StartConversationInput,
): Promise<StartConversationResponse> {
  if (
    !input.query ||
    input.query.trim().length === 0 ||
    input.query.length > 5000
  ) {
    return {
      conversation_id: '',
      requests: [],
    };
  }

  return startConversationService(input);
}
