import { initialAxiosIC } from 'Api/ApiIC';
import { RenameConversationResponse } from 'models/InsightsCopilot';

interface RenameConversationServiceParams {
  conversationId: string;
  projectKey: string;
  name: string;
}

export default async function renameConversationService(
  params: RenameConversationServiceParams,
): Promise<RenameConversationResponse> {
  const url = `/v2/conversations/${params.conversationId}?project_key=${params.projectKey}`;

  const response = await initialAxiosIC.patch(url, {
    name: params.name,
  });

  return response.data;
}
