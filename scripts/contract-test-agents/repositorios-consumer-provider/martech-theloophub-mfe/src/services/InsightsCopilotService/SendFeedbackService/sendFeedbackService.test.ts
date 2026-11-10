import { initialAxiosIC } from 'Api/ApiIC';

import sendFeedbackService from './sendFeedbackService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    post: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const createMockResponse = (data: any) => ({ data });

const defaultParams = {
  requestId: '1234567890',
  sentiment: 'positive' as const,
  scenario: 'response',
  selectedOptions: ['helpful', 'accurate'],
};

describe('sendFeedbackService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should POST feedback and return feedback response', async () => {
    const mockData = {
      feedback_id: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
      request_id: '1234567890',
      sentiment: 'positive',
      scenario: 'response',
      selected_options: ['helpful', 'accurate'],
      user_email: 'your.name@example.com',
      created_at: '2024-03-06T12:15:22Z',
      updated_at: '2024-03-06T12:15:22Z',
    };

    mockAxios.post.mockResolvedValue(createMockResponse(mockData));

    const result = await sendFeedbackService(defaultParams);

    expect(mockAxios.post).toHaveBeenCalledWith('/v2/feedback', {
      request_id: defaultParams.requestId,
      sentiment: defaultParams.sentiment,
      scenario: defaultParams.scenario,
      selected_options: defaultParams.selectedOptions,
    });
    expect(result).toEqual(mockData);
  });

  it('should include comments when provided', async () => {
    const mockData = {
      feedback_id: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
      request_id: '1234567890',
      sentiment: 'positive',
      scenario: 'response',
      selected_options: ['helpful'],
      comments: 'Great response!',
      user_email: 'your.name@example.com',
      created_at: '2024-03-06T12:15:22Z',
      updated_at: '2024-03-06T12:15:22Z',
    };

    mockAxios.post.mockResolvedValue(createMockResponse(mockData));

    await sendFeedbackService({
      ...defaultParams,
      comments: 'Great response!',
    });

    expect(mockAxios.post).toHaveBeenCalledWith('/v2/feedback', {
      request_id: defaultParams.requestId,
      sentiment: defaultParams.sentiment,
      scenario: defaultParams.scenario,
      selected_options: defaultParams.selectedOptions,
      comments: 'Great response!',
    });
  });

  it('should handle negative sentiment', async () => {
    const mockData = {
      feedback_id: '123abc-456def-789ghi-jklmnop-qrstuvw-xyz',
      request_id: '1234567890',
      sentiment: 'negative',
      scenario: 'response',
      selected_options: ['inaccurate'],
      user_email: 'your.name@example.com',
      created_at: '2024-03-06T12:15:22Z',
      updated_at: '2024-03-06T12:15:22Z',
    };

    mockAxios.post.mockResolvedValue(createMockResponse(mockData));

    const result = await sendFeedbackService({
      requestId: '1234567890',
      sentiment: 'negative',
      scenario: 'response',
      selectedOptions: ['inaccurate'],
    });

    expect(result.sentiment).toBe('negative');
  });

  it('should handle neutral sentiment', async () => {
    const mockData = {
      feedback_id: '7e25b22b-aa16-4c71-a1bf-484ceb908912',
      request_id: '1234567890',
      sentiment: 'neutral',
      scenario: 'response',
      selected_options: ['ok'],
      user_email: 'your.name@example.com',
      created_at: '2024-03-06T12:15:22Z',
      updated_at: '2024-03-06T12:15:22Z',
    };

    mockAxios.post.mockResolvedValue(createMockResponse(mockData));

    const result = await sendFeedbackService({
      requestId: '1234567890',
      sentiment: 'neutral',
      scenario: 'response',
      selectedOptions: ['ok'],
    });

    expect(result.sentiment).toBe('neutral');
  });
});
