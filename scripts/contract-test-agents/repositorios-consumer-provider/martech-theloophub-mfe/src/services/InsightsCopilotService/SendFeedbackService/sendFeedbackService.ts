import { initialAxiosIC } from 'Api/ApiIC';
import { SendFeedbackResponse } from 'models/InsightsCopilot';

interface SendFeedbackServiceParams {
  requestId: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  scenario: string;
  selectedOptions: string[];
  comments?: string;
}

export default async function sendFeedbackService(
  params: SendFeedbackServiceParams,
): Promise<SendFeedbackResponse> {
  const url = `/v2/feedback`;
  const payload = {
    request_id: params.requestId,
    sentiment: params.sentiment,
    scenario: params.scenario,
    selected_options: params.selectedOptions,
    ...(params.comments && { comments: params.comments }),
  };

  const response = await initialAxiosIC.post(url, payload);
  return response.data;
}
