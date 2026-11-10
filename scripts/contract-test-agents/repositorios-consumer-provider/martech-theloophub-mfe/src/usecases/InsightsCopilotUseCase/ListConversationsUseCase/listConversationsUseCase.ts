import { ListConversationsResponse } from 'models/InsightsCopilot';
import { listConversationsService } from 'services/InsightsCopilotService';

interface ListConversationsInput {
  projectKey: string;
  page?: number;
  limit?: number;
}

export default async function listConversationsUseCase(
  input: ListConversationsInput,
): Promise<ListConversationsResponse[]> {
  const page = input.page && input.page > 0 ? input.page : 1;
  const limit = input.limit && input.limit > 0 ? input.limit : 20;

  if (!input.projectKey || input.projectKey.trim().length === 0) {
    return [];
  }

  return listConversationsService({
    projectKey: input.projectKey,
    page,
    limit,
  });
}
