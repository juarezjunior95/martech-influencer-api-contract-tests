import { initialAxiosIC } from 'Api/ApiIC';

import deleteConversationService from './deleteConversationService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    delete: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const createMockResponse = (data: any) => ({ data });

const defaultParams = {
  conversationId: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
  projectKey: 'marketing_brand-guidance_ghq',
};

describe('deleteConversationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should DELETE conversation and return success message', async () => {
    const mockData = {
      message: 'Conversation deleted successfully',
    };

    mockAxios.delete.mockResolvedValue(createMockResponse(mockData));

    const result = await deleteConversationService(defaultParams);

    expect(mockAxios.delete).toHaveBeenCalledWith(
      `/v2/conversations/${defaultParams.conversationId}?project_key=${defaultParams.projectKey}`,
    );
    expect(result).toEqual(mockData);
  });

  it('should construct correct URL with conversation ID and project key', async () => {
    const mockData = {
      message: 'Conversation deleted successfully',
    };

    mockAxios.delete.mockResolvedValue(createMockResponse(mockData));

    await deleteConversationService({
      conversationId: 'test-conv-id',
      projectKey: 'test-project-key',
    });

    expect(mockAxios.delete).toHaveBeenCalledWith(
      '/v2/conversations/test-conv-id?project_key=test-project-key',
    );
  });

  it('should return message from response', async () => {
    const mockData = {
      message: 'Conversation deleted successfully',
    };

    mockAxios.delete.mockResolvedValue(createMockResponse(mockData));

    const result = await deleteConversationService(defaultParams);

    expect(result.message).toBe('Conversation deleted successfully');
  });
});
