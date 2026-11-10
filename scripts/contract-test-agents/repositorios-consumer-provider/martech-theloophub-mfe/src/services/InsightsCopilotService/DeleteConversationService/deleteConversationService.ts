import { initialAxiosIC } from 'Api/ApiIC';
import { DeleteConversationResponse } from 'models/InsightsCopilot';

interface DeleteConversationServiceParams {
  conversationId: string;
  projectKey: string;
}

export default async function deleteConversationService(
  params: DeleteConversationServiceParams,
): Promise<DeleteConversationResponse> {
  const url = `/v2/conversations/${params.conversationId}?project_key=${params.projectKey}`;

  const response = await initialAxiosIC.delete(url);

  return response.data;
}
