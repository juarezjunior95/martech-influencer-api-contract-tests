import { initialAxiosIC } from 'Api/ApiIC';
import { NegotiateResponse } from 'models/InsightsCopilot';

interface NegotiateServiceParams {
  projectKey: string;
  signal?: AbortSignal;
}

export default async function negotiateService(
  params: NegotiateServiceParams,
): Promise<NegotiateResponse> {
  const url = `/v2/conversations/pubsub/negotiate?project_key=${params.projectKey}`;

  const response = await initialAxiosIC.get(url, {
    signal: params.signal,
  });

  return response.data;
}
