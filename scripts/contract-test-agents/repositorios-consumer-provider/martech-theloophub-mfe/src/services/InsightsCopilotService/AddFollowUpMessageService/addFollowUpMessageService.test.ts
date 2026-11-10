import { initialAxiosIC } from 'Api/ApiIC';

import addFollowUpMessageService from './addFollowUpMessageService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    post: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const buildFollowUpUrl = (conversationId: string, projectKey: string) =>
  `/v2/conversations/${conversationId}?project_key=${projectKey}`;

const createMockResponse = (data: any) => ({ data });

const defaultParams = {
  conversationId: 'conv-123',
  query: 'What is the sales trend?',
  projectKey: 'project-abc',
};

describe('addFollowUpMessageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should POST with query and return conversation', async () => {
    const mockData = {
      conversation_id: 'conv-123',
      requests: [{ request_id: 'req-456' }],
    };

    mockAxios.post.mockResolvedValue(createMockResponse(mockData));

    const result = await addFollowUpMessageService(defaultParams);

    expect(mockAxios.post).toHaveBeenCalledWith(
      buildFollowUpUrl(defaultParams.conversationId, defaultParams.projectKey),
      { query: defaultParams.query },
      { signal: undefined },
    );
    expect(result).toEqual(mockData);
  });

  it('should build URL correctly with parameters', async () => {
    mockAxios.post.mockResolvedValue(
      createMockResponse({ conversation_id: '', requests: [] }),
    );

    await addFollowUpMessageService({
      conversationId: 'test-conv',
      query: 'test query',
      projectKey: 'test-project',
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
      buildFollowUpUrl('test-conv', 'test-project'),
      { query: 'test query' },
      { signal: undefined },
    );
  });

  it('should return response data', async () => {
    const expectedData = {
      conversation_id: 'conv-789',
      requests: [{ request_id: 'req-1' }, { request_id: 'req-2' }],
    };

    mockAxios.post.mockResolvedValue(createMockResponse(expectedData));

    const result = await addFollowUpMessageService({
      conversationId: 'conv-789',
      query: 'New question',
      projectKey: 'project-xyz',
    });

    expect(result).toEqual(expectedData);
  });
});
