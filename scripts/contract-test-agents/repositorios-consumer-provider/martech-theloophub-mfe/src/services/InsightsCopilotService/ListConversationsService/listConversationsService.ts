import { initialAxiosIC } from 'Api/ApiIC';
import { ListConversationsResponse } from 'models/InsightsCopilot';

interface ListConversationsServiceParams {
  projectKey: string;
  page?: number;
  limit?: number;
}

export default async function listConversationsService(
  params: ListConversationsServiceParams,
): Promise<ListConversationsResponse[]> {
  const url = `/v2/conversations?project_key=${params.projectKey}&page=${params.page || 1}&limit=${params.limit || 20}`;
  const response = await initialAxiosIC.get(url);

  if (response.status !== 200) {
    throw new Error('Failed to load conversations');
  }

  return response.data || [];
}
