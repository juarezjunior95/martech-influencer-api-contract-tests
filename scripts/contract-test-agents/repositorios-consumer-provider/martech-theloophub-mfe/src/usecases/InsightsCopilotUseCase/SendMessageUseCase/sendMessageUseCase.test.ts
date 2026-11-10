import pollForResponseUseCase from '../PollForResponseUseCase/pollForResponseUseCase';
import addFollowUpMessageUseCase from './AddFollowUpMessageUseCase/addFollowUpMessageUseCase';
import sendMessageUseCase from './sendMessageUseCase';
import startConversationUseCase from './StartConversationUseCase/startConversationUseCase';

jest.mock('./StartConversationUseCase/startConversationUseCase');
jest.mock('./AddFollowUpMessageUseCase/addFollowUpMessageUseCase');
jest.mock('../PollForResponseUseCase/pollForResponseUseCase');

const mockStartConversation = startConversationUseCase as jest.MockedFunction<
  typeof startConversationUseCase
>;
const mockAddFollowUp = addFollowUpMessageUseCase as jest.MockedFunction<
  typeof addFollowUpMessageUseCase
>;
const mockPollForResponse = pollForResponseUseCase as jest.MockedFunction<
  typeof pollForResponseUseCase
>;

const mockConversation = {
  conversation_id: 'conv-123',
  requests: [{ request_id: 'req-456', question: 'test' }],
};

describe('sendMessageUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('new conversation', () => {
    it('should call startConversationUseCase when no conversationId', async () => {
      mockStartConversation.mockResolvedValue(mockConversation);
      mockPollForResponse.mockResolvedValue({
        answer: 'answer',
        charts: [],
        artifacts: [],
      });

      await sendMessageUseCase({
        query: 'Hello',
        projectKey: 'project-abc',
      });

      expect(mockStartConversation).toHaveBeenCalledWith({
        query: 'Hello',
        projectKey: 'project-abc',
        signal: undefined,
      });
      expect(mockAddFollowUp).not.toHaveBeenCalled();
    });
  });

  describe('follow-up message', () => {
    it('should call addFollowUpMessageUseCase when conversationId is provided', async () => {
      mockAddFollowUp.mockResolvedValue(mockConversation);
      mockPollForResponse.mockResolvedValue({
        answer: 'answer',
        charts: [],
        artifacts: [],
      });

      await sendMessageUseCase({
        query: 'Follow up',
        projectKey: 'project-abc',
        conversationId: 'conv-123',
      });

      expect(mockAddFollowUp).toHaveBeenCalledWith({
        conversationId: 'conv-123',
        query: 'Follow up',
        projectKey: 'project-abc',
        signal: undefined,
      });
      expect(mockStartConversation).not.toHaveBeenCalled();
    });
  });

  describe('polling', () => {
    it('should poll for response after creating conversation', async () => {
      mockStartConversation.mockResolvedValue(mockConversation);
      mockPollForResponse.mockResolvedValue({
        answer: 'The answer is 42',
        charts: [],
        artifacts: [],
      });

      const result = await sendMessageUseCase({
        query: 'Hello',
        projectKey: 'project-abc',
      });

      expect(mockPollForResponse).toHaveBeenCalledWith({
        conversationId: 'conv-123',
        requestId: 'req-456',
        projectKey: 'project-abc',
        onProgress: undefined,
        signal: undefined,
      });
      expect(result).toEqual({
        conversationId: 'conv-123',
        requestId: 'req-456',
        answer: 'The answer is 42',
        charts: [],
        artifacts: [],
      });
    });

    it('should pass onProgress callback to pollForResponse', async () => {
      mockStartConversation.mockResolvedValue(mockConversation);
      mockPollForResponse.mockResolvedValue({
        answer: 'answer',
        charts: [],
        artifacts: [],
      });

      const onProgress = jest.fn();

      await sendMessageUseCase({
        query: 'Hello',
        projectKey: 'project-abc',
        onProgress,
      });

      expect(mockPollForResponse).toHaveBeenCalledWith(
        expect.objectContaining({ onProgress }),
      );
    });
  });

  describe('invalid response', () => {
    it('should poll with empty conversationId when conversation_id is empty', async () => {
      mockStartConversation.mockResolvedValue({
        conversation_id: '',
        requests: [{ request_id: 'req-456', question: 'test' }],
      });
      mockPollForResponse.mockResolvedValue({
        answer: 'answer',
        charts: [],
        artifacts: [],
      });

      const result = await sendMessageUseCase({
        query: 'Hello',
        projectKey: 'project-abc',
      });

      expect(result).toEqual({
        conversationId: '',
        requestId: 'req-456',
        answer: 'answer',
        charts: [],
        artifacts: [],
      });
      expect(mockPollForResponse).toHaveBeenCalledWith(
        expect.objectContaining({ conversationId: '', requestId: 'req-456' }),
      );
    });

    it('should poll with empty requestId when requests array is empty', async () => {
      mockStartConversation.mockResolvedValue({
        conversation_id: 'conv-123',
        requests: [],
      });
      mockPollForResponse.mockResolvedValue({
        answer: 'answer',
        charts: [],
        artifacts: [],
      });

      const result = await sendMessageUseCase({
        query: 'Hello',
        projectKey: 'project-abc',
      });

      expect(result).toEqual({
        conversationId: 'conv-123',
        requestId: '',
        answer: 'answer',
        charts: [],
        artifacts: [],
      });
      expect(mockPollForResponse).toHaveBeenCalledWith(
        expect.objectContaining({ conversationId: 'conv-123', requestId: '' }),
      );
    });
  });
});
