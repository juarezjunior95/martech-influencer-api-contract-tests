import { initialAxiosIC } from 'Api/ApiIC';
import { GetConversationDetailsResponse } from 'models/InsightsCopilot';

interface GetConversationDetailsServiceParams {
  conversationId: string;
  projectKey: string;
}

export default async function getConversationDetailsService(
  params: GetConversationDetailsServiceParams,
): Promise<GetConversationDetailsResponse> {
  const url = `/v2/conversations/${params.conversationId}?project_key=${params.projectKey}`;

  const response = await initialAxiosIC.get(url);

  return response.data;
}
