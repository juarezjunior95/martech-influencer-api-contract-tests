import { initialAxiosIC } from 'Api/ApiIC';
import { SmartFlowConfig } from 'models/InsightsCopilot';

interface GetSmartFlowsServiceParams {
  projectKey: string;
}

export default async function getSmartFlowsService(
  params: GetSmartFlowsServiceParams,
): Promise<SmartFlowConfig[]> {
  const url = `/v2/smart-flows?project_key=${params.projectKey}`;

  const response = await initialAxiosIC.get(url);

  return response.data || [];
}
