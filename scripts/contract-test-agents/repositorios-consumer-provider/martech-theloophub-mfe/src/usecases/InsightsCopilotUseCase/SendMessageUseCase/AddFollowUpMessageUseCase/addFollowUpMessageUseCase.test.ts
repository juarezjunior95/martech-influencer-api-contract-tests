import { addFollowUpMessageService } from 'services/InsightsCopilotService';

import addFollowUpMessageUseCase from './addFollowUpMessageUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  addFollowUpMessageService: jest.fn(),
}));

const mockService = addFollowUpMessageService as jest.MockedFunction<
  typeof addFollowUpMessageService
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
  conversationId: 'conv-123',
  query: 'What is the trend?',
  projectKey: 'project-abc',
};

describe('addFollowUpMessageUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call service with correct parameters', async () => {
    const mockResponse = createMockConversation();

    mockService.mockResolvedValue(mockResponse);

    const result = await addFollowUpMessageUseCase(defaultInput);

    expect(mockService).toHaveBeenCalledWith(defaultInput);
    expect(result).toEqual(mockResponse);
  });

  it('should return empty object when query is empty', async () => {
    const result = await addFollowUpMessageUseCase({
      ...defaultInput,
      query: '',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyConversation);
  });

  it('should return empty object when query has only spaces', async () => {
    const result = await addFollowUpMessageUseCase({
      ...defaultInput,
      query: '   ',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyConversation);
  });

  it('should return empty object when query exceeds 5000 characters', async () => {
    const longQuery = 'a'.repeat(5001);

    const result = await addFollowUpMessageUseCase({
      ...defaultInput,
      query: longQuery,
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyConversation);
  });

  it('should return empty object when conversationId is empty', async () => {
    const result = await addFollowUpMessageUseCase({
      ...defaultInput,
      conversationId: '',
      query: 'Valid question',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyConversation);
  });

  it('should return empty object when conversationId has only spaces', async () => {
    const result = await addFollowUpMessageUseCase({
      ...defaultInput,
      conversationId: '   ',
      query: 'Valid question',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyConversation);
  });

  it('should accept query with exactly 5000 characters', async () => {
    const maxQuery = 'a'.repeat(5000);
    const mockResponse = createMockConversation('conv-123', []);

    mockService.mockResolvedValue(mockResponse);

    const result = await addFollowUpMessageUseCase({
      ...defaultInput,
      query: maxQuery,
    });

    expect(mockService).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });
});
