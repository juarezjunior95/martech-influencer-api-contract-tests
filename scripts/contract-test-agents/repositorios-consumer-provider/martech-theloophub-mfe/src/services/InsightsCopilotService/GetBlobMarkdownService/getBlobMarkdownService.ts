import { initialAxiosIC } from 'Api/ApiIC';
import { GetBlobMarkdownResponse } from 'models/InsightsCopilot';

interface GetBlobMarkdownServiceParams {
  blobPath: string;
  projectKey: string;
  attachment?: boolean;
}

export default async function getBlobMarkdownService(
  params: GetBlobMarkdownServiceParams,
): Promise<GetBlobMarkdownResponse> {
  const url = `/v2/artifacts/stream/${params.blobPath}?project_key=${params.projectKey}`;

  const response = await initialAxiosIC.get(url);

  return response.data;
}
