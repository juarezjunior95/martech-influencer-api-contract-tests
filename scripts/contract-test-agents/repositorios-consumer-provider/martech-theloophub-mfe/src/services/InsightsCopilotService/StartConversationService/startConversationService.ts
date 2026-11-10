import { initialAxiosIC } from 'Api/ApiIC';
import { StartConversationResponse } from 'models/InsightsCopilot';

interface StartConversationServiceParams {
  query: string;
  projectKey: string;
  signal?: AbortSignal;
  isSmartflow?: boolean;
  smartflowFunctionName?: string;
  smartflowParameters?: Record<string, string[]>;
}

export default async function startConversationService(
  params: StartConversationServiceParams,
): Promise<StartConversationResponse> {
  const url = `/v2/conversations?project_key=${params.projectKey}`;

  const body: Record<string, unknown> = {
    query: params.query,
    is_cache: true,
  };

  if (params.isSmartflow) {
    body.is_smartflow = true;
    body.smartflow_function_name = params.smartflowFunctionName;
    body.smartflow_parameters = params.smartflowParameters;
  }

  const response = await initialAxiosIC.post(url, body, {
    signal: params.signal,
  });

  return response.data;
}
