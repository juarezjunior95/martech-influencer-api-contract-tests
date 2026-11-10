import { initialAxiosIC } from 'Api/ApiIC';

import renameConversationService from './renameConversationService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    patch: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const createMockResponse = (data: any) => ({ data });

const defaultParams = {
  conversationId: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
  projectKey: 'marketing_brand-guidance_ghq',
  name: 'Volume Analysis 2024',
};

describe('renameConversationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should PATCH conversation name and return updated conversation', async () => {
    const mockData = {
      conversation_id: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
      name: 'Volume Analysis 2024',
      project_key: 'marketing_brand-guidance_ghq',
      user_email: 'your.name@example.com',
      created_at: '2026-01-09 04:35:49.791',
      updated_at: '2026-01-21 10:15:30.456',
    };

    mockAxios.patch.mockResolvedValue(createMockResponse(mockData));

    const result = await renameConversationService(defaultParams);

    expect(mockAxios.patch).toHaveBeenCalledWith(
      `/v2/conversations/${defaultParams.conversationId}?project_key=${defaultParams.projectKey}`,
      { name: defaultParams.name },
    );
    expect(result).toEqual(mockData);
  });

  it('should handle different conversation names', async () => {
    const mockData = {
      conversation_id: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
      name: 'New Conversation Name',
      project_key: 'marketing_brand-guidance_ghq',
      user_email: 'your.name@example.com',
      created_at: '2026-01-09 04:35:49.791',
      updated_at: '2026-01-21 10:15:30.456',
    };

    mockAxios.patch.mockResolvedValue(createMockResponse(mockData));

    const result = await renameConversationService({
      conversationId: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
      projectKey: 'marketing_brand-guidance_ghq',
      name: 'New Conversation Name',
    });

    expect(result.name).toBe('New Conversation Name');
  });

  it('should construct correct URL with conversation ID and project key', async () => {
    const mockData = {
      conversation_id: 'test-conv-id',
      name: 'Test Name',
      project_key: 'test-project-key',
      user_email: 'your.name@example.com',
      created_at: '2026-01-09 04:35:49.791',
      updated_at: '2026-01-21 10:15:30.456',
    };

    mockAxios.patch.mockResolvedValue(createMockResponse(mockData));

    await renameConversationService({
      conversationId: 'test-conv-id',
      projectKey: 'test-project-key',
      name: 'Test Name',
    });

    expect(mockAxios.patch).toHaveBeenCalledWith(
      '/v2/conversations/test-conv-id?project_key=test-project-key',
      { name: 'Test Name' },
    );
  });
});
