import { startConversationService } from 'services/InsightsCopilotService';

import startConversationUseCase from './startConversationUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  startConversationService: jest.fn(),
}));

const mockService = startConversationService as jest.MockedFunction<
  typeof startConversationService
>;

const createMockConversation = (
  conversationId = 'conv-123',
  requests = [{ request_id: 'req-456', question: 'What is the trend?' }],
) => ({
  conversation_id: conversationId,
  requests,
});

const emptyConversation = {
  conversation_id: '',
  requests: [],
};

const defaultInput = {
  query: 'How are sales?',
  projectKey: 'project-abc',
};

describe('startConversationUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call service with correct parameters', async () => {
    const mockResponse = createMockConversation();

    mockService.mockResolvedValue(mockResponse);

    const result = await startConversationUseCase(defaultInput);

    expect(mockService).toHaveBeenCalledWith(defaultInput);
    expect(result).toEqual(mockResponse);
  });

  it('should return empty object when query is empty', async () => {
    const result = await startConversationUseCase({
      query: '',
      projectKey: 'project-abc',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyConversation);
  });

  it('should return empty object when query has only spaces', async () => {
    const result = await startConversationUseCase({
      query: '   ',
      projectKey: 'project-abc',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyConversation);
  });

  it('should return empty object when query exceeds 5000 characters', async () => {
    const longQuery = 'a'.repeat(5001);

    const result = await startConversationUseCase({
      query: longQuery,
      projectKey: 'project-abc',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyConversation);
  });

  it('should accept query with exactly 5000 characters', async () => {
    const maxQuery = 'a'.repeat(5000);
    const mockResponse = createMockConversation('conv-123', []);

    mockService.mockResolvedValue(mockResponse);

    const result = await startConversationUseCase({
      query: maxQuery,
      projectKey: 'project-abc',
    });

    expect(mockService).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('should accept valid query with 1 character', async () => {
    const mockResponse = createMockConversation('conv-123', []);

    mockService.mockResolvedValue(mockResponse);

    const result = await startConversationUseCase({
      query: 'a',
      projectKey: 'project-abc',
    });

    expect(mockService).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });
});
