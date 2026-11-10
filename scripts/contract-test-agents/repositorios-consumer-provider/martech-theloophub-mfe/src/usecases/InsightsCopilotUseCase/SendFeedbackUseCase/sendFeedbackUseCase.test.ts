import { sendFeedbackService } from 'services/InsightsCopilotService';

import sendFeedbackUseCase from './sendFeedbackUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  sendFeedbackService: jest.fn(),
}));

const mockService = sendFeedbackService as jest.MockedFunction<
  typeof sendFeedbackService
>;

const createMockResponse = () => ({
  feedback_id: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
  request_id: '1234567890',
  sentiment: 'positive' as const,
  scenario: 'response',
  selected_options: ['helpful', 'accurate'],
  user_email: 'your.name@example.com',
  created_at: '2024-03-06T12:15:22Z',
  updated_at: '2024-03-06T12:15:22Z',
});

const defaultInput = {
  requestId: '1234567890',
  sentiment: 'positive' as const,
  scenario: 'response',
  selectedOptions: ['helpful', 'accurate'],
};

describe('sendFeedbackUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call service with correct parameters', async () => {
    const mockResponse = createMockResponse();
    mockService.mockResolvedValue(mockResponse);

    const result = await sendFeedbackUseCase(defaultInput);

    expect(mockService).toHaveBeenCalledWith(defaultInput);
    expect(result).toEqual(mockResponse);
  });

  it('should call service with comments when provided', async () => {
    const mockResponse = createMockResponse();
    mockService.mockResolvedValue(mockResponse);

    const input = { ...defaultInput, comments: 'Great response!' };

    await sendFeedbackUseCase(input);

    expect(mockService).toHaveBeenCalledWith(input);
  });

  it('should allow positive feedback with empty selectedOptions', async () => {
    const mockResponse = createMockResponse();
    mockService.mockResolvedValue(mockResponse);

    const input = { ...defaultInput, selectedOptions: [] };

    await sendFeedbackUseCase(input);

    expect(mockService).toHaveBeenCalledWith(input);
  });

  it('should throw when requestId is empty', async () => {
    await expect(
      sendFeedbackUseCase({ ...defaultInput, requestId: '' }),
    ).rejects.toThrow('Missing required feedback fields');

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should throw when requestId has only spaces', async () => {
    await expect(
      sendFeedbackUseCase({ ...defaultInput, requestId: '   ' }),
    ).rejects.toThrow('Missing required feedback fields');

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should throw when sentiment is not provided', async () => {
    await expect(
      sendFeedbackUseCase({ ...defaultInput, sentiment: '' as any }),
    ).rejects.toThrow('Missing required feedback fields');

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should throw when scenario is empty', async () => {
    await expect(
      sendFeedbackUseCase({ ...defaultInput, scenario: '' }),
    ).rejects.toThrow('Missing required feedback fields');

    expect(mockService).not.toHaveBeenCalled();
  });

  it('should throw when scenario has only spaces', async () => {
    await expect(
      sendFeedbackUseCase({ ...defaultInput, scenario: '   ' }),
    ).rejects.toThrow('Missing required feedback fields');

    expect(mockService).not.toHaveBeenCalled();
  });

  describe('negative feedback', () => {
    it('should throw when selectedOptions is empty', async () => {
      await expect(
        sendFeedbackUseCase({
          ...defaultInput,
          sentiment: 'negative',
          selectedOptions: [],
        }),
      ).rejects.toThrow(
        'Negative feedback requires at least one selected option',
      );

      expect(mockService).not.toHaveBeenCalled();
    });

    it('should throw when selectedOptions is not provided', async () => {
      await expect(
        sendFeedbackUseCase({
          ...defaultInput,
          sentiment: 'negative',
          selectedOptions: undefined as any,
        }),
      ).rejects.toThrow(
        'Negative feedback requires at least one selected option',
      );

      expect(mockService).not.toHaveBeenCalled();
    });

    it('should call service with valid options', async () => {
      const mockResponse = {
        ...createMockResponse(),
        sentiment: 'negative' as const,
      };
      mockService.mockResolvedValue(mockResponse);

      const input = {
        ...defaultInput,
        sentiment: 'negative' as const,
        selectedOptions: ['inaccurate'],
      };

      const result = await sendFeedbackUseCase(input);

      expect(mockService).toHaveBeenCalledWith(input);
      expect(result.sentiment).toBe('negative');
    });
  });

  it('should handle neutral sentiment', async () => {
    const mockResponse = {
      ...createMockResponse(),
      sentiment: 'neutral' as const,
    };
    mockService.mockResolvedValue(mockResponse);

    const input = { ...defaultInput, sentiment: 'neutral' as const };

    const result = await sendFeedbackUseCase(input);

    expect(mockService).toHaveBeenCalledWith(input);
    expect(result.sentiment).toBe('neutral');
  });
});
