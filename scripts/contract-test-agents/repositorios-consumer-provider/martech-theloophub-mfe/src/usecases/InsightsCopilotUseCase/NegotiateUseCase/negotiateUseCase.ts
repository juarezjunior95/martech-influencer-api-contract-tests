import { NegotiateResponse } from 'models/InsightsCopilot';
import { negotiateService } from 'services/InsightsCopilotService';

interface NegotiateInput {
  projectKey: string;
  signal?: AbortSignal;
}

export default async function negotiateUseCase(
  input: NegotiateInput,
): Promise<NegotiateResponse> {
  return negotiateService({
    projectKey: input.projectKey,
    signal: input.signal,
  });
}
