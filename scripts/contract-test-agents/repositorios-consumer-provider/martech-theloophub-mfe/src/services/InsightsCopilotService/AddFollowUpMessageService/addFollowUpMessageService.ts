import { initialAxiosIC } from 'Api/ApiIC';
import { AddFollowUpMessageResponse } from 'models/InsightsCopilot';

interface AddFollowUpMessageServiceParams {
  conversationId: string;
  query: string;
  projectKey: string;
  signal?: AbortSignal;
  isSmartflow?: boolean;
  smartflowFunctionName?: string;
  smartflowParameters?: Record<string, string[]>;
}

export default async function addFollowUpMessageService(
  params: AddFollowUpMessageServiceParams,
): Promise<AddFollowUpMessageResponse> {
  const url = `/v2/conversations/${params.conversationId}?project_key=${params.projectKey}`;

  const body: Record<string, unknown> = { query: params.query };

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
