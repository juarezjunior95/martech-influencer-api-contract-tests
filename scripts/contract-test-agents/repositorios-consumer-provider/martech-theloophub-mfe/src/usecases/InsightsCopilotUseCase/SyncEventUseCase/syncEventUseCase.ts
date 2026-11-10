import { PollingResponse, SyncRequestBody } from 'models/InsightsCopilot';
import { syncEventService } from 'services/InsightsCopilotService';

interface SyncEventInput {
  requestId: string;
  projectKey: string;
  body?: SyncRequestBody;
  signal?: AbortSignal;
}

export default async function syncEventUseCase(
  input: SyncEventInput,
): Promise<PollingResponse> {
  return syncEventService({
    requestId: input.requestId,
    projectKey: input.projectKey,
    body: input.body,
    signal: input.signal,
  });
}
