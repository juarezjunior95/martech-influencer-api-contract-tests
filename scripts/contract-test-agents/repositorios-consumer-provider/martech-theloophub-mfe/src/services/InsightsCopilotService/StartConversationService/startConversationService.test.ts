import { initialAxiosIC } from 'Api/ApiIC';

import startConversationService from './startConversationService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    post: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const buildConversationsUrl = (projectKey: string) =>
  `/v2/conversations?project_key=${projectKey}`;

const createMockResponse = (data: any) => ({ data });

const defaultParams = {
  query: 'What is the sales performance?',
  projectKey: 'project-abc',
};

describe('startConversationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should POST with query and return conversation', async () => {
    const mockData = {
      conversation_id: 'conv-123',
      requests: [{ request_id: 'req-456' }],
    };

    mockAxios.post.mockResolvedValue(createMockResponse(mockData));

    const result = await startConversationService(defaultParams);

    expect(mockAxios.post).toHaveBeenCalledWith(
      buildConversationsUrl('project-abc'),
      {
        query: defaultParams.query,
        is_cache: true,
      },
      { signal: undefined },
    );
    expect(result).toEqual(mockData);
  });

  it('should include is_cache: true in request body', async () => {
    mockAxios.post.mockResolvedValue(
      createMockResponse({ conversation_id: '', requests: [] }),
    );

    await startConversationService({
      query: 'test query',
      projectKey: 'test-project',
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        is_cache: true,
      }),
      { signal: undefined },
    );
  });

  it('should build URL correctly', async () => {
    mockAxios.post.mockResolvedValue(
      createMockResponse({ conversation_id: '', requests: [] }),
    );

    await startConversationService({
      query: 'new question',
      projectKey: 'proj-xyz',
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
      buildConversationsUrl('proj-xyz'),
      expect.any(Object),
      { signal: undefined },
    );
  });

  it('should return created conversation data', async () => {
    const expectedData = {
      conversation_id: 'conv-789',
      requests: [{ request_id: 'req-1', query: 'question' }],
    };

    mockAxios.post.mockResolvedValue(createMockResponse(expectedData));

    const result = await startConversationService({
      query: 'test',
      projectKey: 'project-123',
    });

    expect(result).toEqual(expectedData);
  });
});
