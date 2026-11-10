import { GetBlobMarkdownResponse } from 'models/InsightsCopilot';
import { getBlobMarkdownService } from 'services/InsightsCopilotService';

interface GetBlobMarkdownInput {
  blobPath: string;
  projectKey: string;
  attachment?: boolean;
}

export default async function getBlobMarkdownUseCase(
  input: GetBlobMarkdownInput,
): Promise<GetBlobMarkdownResponse> {
  const markdownContent = await getBlobMarkdownService({
    blobPath: input.blobPath,
    projectKey: input.projectKey,
    attachment: input.attachment,
  });

  return markdownContent;
}
