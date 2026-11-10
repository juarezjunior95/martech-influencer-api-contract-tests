import { SendFeedbackResponse } from 'models/InsightsCopilot';
import { sendFeedbackService } from 'services/InsightsCopilotService';

interface SendFeedbackInput {
  requestId: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  scenario: string;
  selectedOptions: string[];
  comments?: string;
}

export default async function sendFeedbackUseCase(
  input: SendFeedbackInput,
): Promise<SendFeedbackResponse> {
  if (!input.requestId?.trim() || !input.sentiment || !input.scenario?.trim()) {
    throw new Error('Missing required feedback fields');
  }

  if (input.sentiment === 'negative' && !input.selectedOptions?.length) {
    throw new Error('Negative feedback requires at least one selected option');
  }

  return sendFeedbackService({
    requestId: input.requestId,
    sentiment: input.sentiment,
    scenario: input.scenario,
    selectedOptions: input.selectedOptions,
    comments: input.comments,
  });
}
