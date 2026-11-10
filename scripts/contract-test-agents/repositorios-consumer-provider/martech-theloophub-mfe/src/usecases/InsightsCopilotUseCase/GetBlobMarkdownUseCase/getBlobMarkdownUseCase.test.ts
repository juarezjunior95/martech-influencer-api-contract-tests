import { getBlobMarkdownService } from 'services/InsightsCopilotService';

import getBlobMarkdownUseCase from './getBlobMarkdownUseCase';

jest.mock('services/InsightsCopilotService');

const mockGetBlobMarkdownService =
  getBlobMarkdownService as jest.MockedFunction<typeof getBlobMarkdownService>;

describe('getBlobMarkdownUseCase', () => {
  const mockProjectKey = 'test-project-key';
  const mockBlobPath =
    'https://example.blob.core.windows.net/container/file.md';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getBlobMarkdownService with correct parameters', async () => {
    const mockMarkdownContent = '# Test Markdown\n\nThis is a test.';
    mockGetBlobMarkdownService.mockResolvedValue(mockMarkdownContent);

    const result = await getBlobMarkdownUseCase({
      blobPath: mockBlobPath,
      projectKey: mockProjectKey,
    });

    expect(mockGetBlobMarkdownService).toHaveBeenCalledWith({
      blobPath: mockBlobPath,
      projectKey: mockProjectKey,
      attachment: undefined,
    });
    expect(result).toBe(mockMarkdownContent);
  });

  it('should pass attachment parameter when provided', async () => {
    const mockMarkdownContent = '# Test Markdown';
    mockGetBlobMarkdownService.mockResolvedValue(mockMarkdownContent);

    await getBlobMarkdownUseCase({
      blobPath: mockBlobPath,
      projectKey: mockProjectKey,
      attachment: true,
    });

    expect(mockGetBlobMarkdownService).toHaveBeenCalledWith({
      blobPath: mockBlobPath,
      projectKey: mockProjectKey,
      attachment: true,
    });
  });

  it('should throw error when service fails', async () => {
    const mockError = new Error('Service error');
    mockGetBlobMarkdownService.mockRejectedValue(mockError);

    await expect(
      getBlobMarkdownUseCase({
        blobPath: mockBlobPath,
        projectKey: mockProjectKey,
      }),
    ).rejects.toThrow('Service error');
  });
});
