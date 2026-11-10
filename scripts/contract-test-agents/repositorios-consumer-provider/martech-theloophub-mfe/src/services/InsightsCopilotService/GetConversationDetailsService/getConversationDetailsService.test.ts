import { initialAxiosIC } from 'Api/ApiIC';

import getConversationDetailsService from './getConversationDetailsService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    get: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const buildConversationDetailsUrl = (
  conversationId: string,
  projectKey: string,
) => `/v2/conversations/${conversationId}?project_key=${projectKey}`;

const createMockResponse = (data: any) => ({ data });

const defaultParams = {
  conversationId: 'conv-123',
  projectKey: 'project-abc',
};

describe('getConversationDetailsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should GET and return conversation details', async () => {
    const mockData = {
      conversation_id: 'conv-123',
      project_key: 'project-abc',
      name: 'Test Conversation',
      requests: [],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    mockAxios.get.mockResolvedValue(createMockResponse(mockData));

    const result = await getConversationDetailsService(defaultParams);

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildConversationDetailsUrl(
        defaultParams.conversationId,
        defaultParams.projectKey,
      ),
    );
    expect(result).toEqual(mockData);
  });

  it('should build URL correctly', async () => {
    const mockData = {
      conversation_id: '',
      project_key: '',
      name: '',
      requests: [],
      created_at: '',
      updated_at: '',
    };
    mockAxios.get.mockResolvedValue(createMockResponse(mockData));

    await getConversationDetailsService({
      conversationId: 'test-id',
      projectKey: 'test-key',
    });

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildConversationDetailsUrl('test-id', 'test-key'),
    );
  });

  it('should return complete conversation data', async () => {
    const expectedData = {
      conversation_id: 'conv-456',
      project_key: 'proj-789',
      name: 'Performance Analysis',
      requests: [
        { request_id: 'req-1', query: 'Question 1' },
        { request_id: 'req-2', query: 'Question 2' },
      ],
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T12:00:00Z',
    };

    mockAxios.get.mockResolvedValue(createMockResponse(expectedData));

    const result = await getConversationDetailsService({
      conversationId: 'conv-456',
      projectKey: 'proj-789',
    });

    expect(result).toEqual(expectedData);
  });
});
