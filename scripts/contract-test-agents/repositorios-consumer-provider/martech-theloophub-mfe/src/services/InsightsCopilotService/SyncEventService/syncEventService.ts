import { initialAxiosIC } from 'Api/ApiIC';
import { PollingResponse, SyncRequestBody } from 'models/InsightsCopilot';

interface SyncEventServiceParams {
  requestId: string;
  projectKey: string;
  body?: SyncRequestBody;
  signal?: AbortSignal;
}

export default async function syncEventService(
  params: SyncEventServiceParams,
): Promise<PollingResponse> {
  const url = `/v2/conversations/request/${params.requestId}/sync?project_key=${params.projectKey}`;

  const response = await initialAxiosIC.post(url, params.body ?? {}, {
    signal: params.signal,
  });

  return response.data;
}
