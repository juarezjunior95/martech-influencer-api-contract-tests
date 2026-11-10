import { initialAxiosIC } from 'Api/ApiIC';
import { GetFAQsResponse } from 'models/InsightsCopilot';

interface GetFAQsServiceParams {
  projectKey: string;
  language?: string;
}

export default async function getFAQsService(
  params: GetFAQsServiceParams,
): Promise<GetFAQsResponse[]> {
  const url = `/v2/faqs?project_key=${params.projectKey}&language=${params.language || 'en'}`;

  const response = await initialAxiosIC.get(url);

  return response.data || [];
}
