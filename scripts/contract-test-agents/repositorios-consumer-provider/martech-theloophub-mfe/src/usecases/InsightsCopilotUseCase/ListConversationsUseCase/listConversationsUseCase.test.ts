import { listConversationsService } from 'services/InsightsCopilotService';

import listConversationsUseCase from './listConversationsUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  listConversationsService: jest.fn(),
}));

const mockService = listConversationsService as jest.MockedFunction<
  typeof listConversationsService
>;

const createMockConversation = (id: string, name: string) => ({
  conversation_id: id,
  name,
  project_key: 'project-abc',
  user_email: `user-${id}@email.com`,
  is_agentic: true,
  created_at: '2021-01-01',
  updated_at: '2021-01-01',
  expires_at: '2021-01-01',
});

const defaultInput = {
  projectKey: 'project-abc',
  page: 1,
  limit: 20,
};

describe('listConversationsUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call service with correct parameters', async () => {
    const mockConversations = [
      createMockConversation('conv-1', 'Conversation 1'),
      createMockConversation('conv-2', 'Conversation 2'),
    ];

    mockService.mockResolvedValue(mockConversations);

    const result = await listConversationsUseCase({
      projectKey: 'project-abc',
      page: 2,
      limit: 30,
    });

    expect(mockService).toHaveBeenCalledWith({
      projectKey: 'project-abc',
      page: 2,
      limit: 30,
    });
    expect(result).toEqual(mockConversations);
  });

  it('should use page=1 as default when not provided', async () => {
    mockService.mockResolvedValue([]);

    await listConversationsUseCase({
      projectKey: 'project-abc',
    });

    expect(mockService).toHaveBeenCalledWith(defaultInput);
  });

  it('should use limit=20 as default when not provided', async () => {
    mockService.mockResolvedValue([]);

    await listConversationsUseCase({
      projectKey: 'project-abc',
      page: 3,
    });

    expect(mockService).toHaveBeenCalledWith({
      ...defaultInput,
      page: 3,
    });
  });

  it('should use page=1 when page is 0', async () => {
    mockService.mockResolvedValue([]);

    await listConversationsUseCase({
      projectKey: 'project-abc',
      page: 0,
    });

    expect(mockService).toHaveBeenCalledWith(defaultInput);
  });

  it('should use page=1 when page is negative', async () => {
    mockService.mockResolvedValue([]);

    await listConversationsUseCase({
      projectKey: 'project-abc',
      page: -5,
    });

    expect(mockService).toHaveBeenCalledWith(defaultInput);
  });

  it('should use limit=20 when limit is 0', async () => {
    mockService.mockResolvedValue([]);

    await listConversationsUseCase({
      projectKey: 'project-abc',
      limit: 0,
    });

    expect(mockService).toHaveBeenCalledWith(defaultInput);
  });

  it('should use limit=20 when limit is negative', async () => {
    mockService.mockResolvedValue([]);

    await listConversationsUseCase({
      projectKey: 'project-abc',
      limit: -10,
    });

    expect(mockService).toHaveBeenCalledWith(defaultInput);
  });

  it('should return empty array when projectKey is empty', async () => {
    const result = await listConversationsUseCase({
      projectKey: '',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should return empty array when projectKey has only spaces', async () => {
    const result = await listConversationsUseCase({
      projectKey: '   ',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
