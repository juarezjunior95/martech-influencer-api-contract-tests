import { renameConversationService } from 'services/InsightsCopilotService';

import renameConversationUseCase from './renameConversationUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  renameConversationService: jest.fn(),
}));

const mockService = renameConversationService as jest.MockedFunction<
  typeof renameConversationService
>;

const createMockResponse = () => ({
  conversation_id: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
  name: 'Mexico Analysis 2025',
  project_key: 'marketing_brand-guidance_ghq',
  user_email: 'your.name@example.com',
  created_at: '2026-01-09 04:35:49.791',
  updated_at: '2026-01-21 10:15:30.456',
});

const defaultInput = {
  conversationId: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
  projectKey: 'marketing_brand-guidance_ghq',
  name: 'Mexico Analysis 2025',
};

describe('renameConversationUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call service with correct parameters', async () => {
    const mockResponse = createMockResponse();
    mockService.mockResolvedValue(mockResponse);

    const result = await renameConversationUseCase(defaultInput);

    expect(mockService).toHaveBeenCalledWith(defaultInput);
    expect(result).toEqual(mockResponse);
  });

  it('should trim conversation name before calling service', async () => {
    const mockResponse = createMockResponse();
    mockService.mockResolvedValue(mockResponse);

    const input = {
      ...defaultInput,
      name: '  Mexico Analysis 2025  ',
    };

    await renameConversationUseCase(input);

    expect(mockService).toHaveBeenCalledWith({
      ...defaultInput,
      name: 'Mexico Analysis 2025',
    });
  });

  it('should return error message when conversationId is empty', async () => {
    await expect(
      renameConversationUseCase({
        ...defaultInput,
        conversationId: '',
      }),
    ).resolves.toEqual({
      conversation_id: '',
      name: '',
      project_key: '',
      user_email: '',
      created_at: '',
      updated_at: '',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should return error message when conversationId has only spaces', async () => {
    await expect(
      renameConversationUseCase({
        ...defaultInput,
        conversationId: '   ',
      }),
    ).resolves.toEqual({
      conversation_id: '',
      name: '',
      project_key: '',
      user_email: '',
      created_at: '',
      updated_at: '',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should return error message when projectKey is empty', async () => {
    await expect(
      renameConversationUseCase({
        ...defaultInput,
        projectKey: '',
      }),
    ).resolves.toEqual({
      conversation_id: '',
      name: '',
      project_key: '',
      user_email: '',
      created_at: '',
      updated_at: '',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should return error message when projectKey has only spaces', async () => {
    await expect(
      renameConversationUseCase({
        ...defaultInput,
        projectKey: '   ',
      }),
    ).resolves.toEqual({
      conversation_id: '',
      name: '',
      project_key: '',
      user_email: '',
      created_at: '',
      updated_at: '',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should return error message when name is empty', async () => {
    await expect(
      renameConversationUseCase({
        ...defaultInput,
        name: '',
      }),
    ).resolves.toEqual({
      conversation_id: '',
      name: '',
      project_key: '',
      user_email: '',
      created_at: '',
      updated_at: '',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should return error message when name has only spaces', async () => {
    await expect(
      renameConversationUseCase({
        ...defaultInput,
        name: '   ',
      }),
    ).resolves.toEqual({
      conversation_id: '',
      name: '',
      project_key: '',
      user_email: '',
      created_at: '',
      updated_at: '',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should handle different conversation names', async () => {
    const mockResponse = {
      ...createMockResponse(),
      name: 'New Conversation Name',
    };
    mockService.mockResolvedValue(mockResponse);

    const input = {
      ...defaultInput,
      name: 'New Conversation Name',
    };

    const result = await renameConversationUseCase(input);

    expect(mockService).toHaveBeenCalledWith(input);
    expect(result.name).toBe('New Conversation Name');
  });
});
