import { initialAxiosIC } from 'Api/ApiIC';
import { PollingResponse } from 'models/InsightsCopilot';

interface PollForResponseServiceParams {
  conversationId: string;
  requestId: string;
  projectKey: string;
  signal?: AbortSignal;
}

export default async function pollForResponseService(
  params: PollForResponseServiceParams,
): Promise<PollingResponse[]> {
  const url = `/v2/conversations/${params.conversationId}/request/${params.requestId}?project_key=${params.projectKey}`;

  const response = await initialAxiosIC.get(url, { signal: params.signal });

  return response.data;
}
