import { deleteConversationService } from 'services/InsightsCopilotService';

import deleteConversationUseCase from './deleteConversationUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  deleteConversationService: jest.fn(),
}));

const mockService = deleteConversationService as jest.MockedFunction<
  typeof deleteConversationService
>;

const createMockResponse = () => ({
  message: 'Conversation deleted successfully',
});

const defaultInput = {
  conversationId: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
  projectKey: 'marketing_brand-guidance_ghq',
};

describe('deleteConversationUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call service with correct parameters', async () => {
    const mockResponse = createMockResponse();
    mockService.mockResolvedValue(mockResponse);

    const result = await deleteConversationUseCase(defaultInput);

    expect(mockService).toHaveBeenCalledWith(defaultInput);
    expect(result).toEqual(mockResponse);
  });

  it('should return error message when conversationId is empty', async () => {
    await expect(
      deleteConversationUseCase({
        ...defaultInput,
        conversationId: '',
      }),
    ).resolves.toEqual({
      message: 'Invalid input parameters',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should return error message when conversationId has only spaces', async () => {
    await expect(
      deleteConversationUseCase({
        ...defaultInput,
        conversationId: '   ',
      }),
    ).resolves.toEqual({
      message: 'Invalid input parameters',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should return error message when projectKey is empty', async () => {
    await expect(
      deleteConversationUseCase({
        ...defaultInput,
        projectKey: '',
      }),
    ).resolves.toEqual({
      message: 'Invalid input parameters',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should return error message when projectKey has only spaces', async () => {
    await expect(
      deleteConversationUseCase({
        ...defaultInput,
        projectKey: '   ',
      }),
    ).resolves.toEqual({
      message: 'Invalid input parameters',
    });

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should return success message from service', async () => {
    const mockResponse = createMockResponse();
    mockService.mockResolvedValue(mockResponse);

    const result = await deleteConversationUseCase(defaultInput);

    expect(result).toEqual(mockResponse);
  });

  it('should handle different conversation IDs', async () => {
    const mockResponse = createMockResponse();
    mockService.mockResolvedValue(mockResponse);

    const input = {
      conversationId: 'different-conv-id',
      projectKey: 'different-project-key',
    };

    const result = await deleteConversationUseCase(input);

    expect(mockService).toHaveBeenCalledWith(input);
    expect(result).toEqual(mockResponse);
  });
});
