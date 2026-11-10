import { getConversationDetailsService } from 'services/InsightsCopilotService';

import getConversationDetailsUseCase from './getConversationDetailsUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  getConversationDetailsService: jest.fn(),
}));

const mockService = getConversationDetailsService as jest.MockedFunction<
  typeof getConversationDetailsService
>;

const createMockConversationDetails = (overrides = {}) => ({
  conversation_id: 'conv-123',
  project_key: 'project-abc',
  name: 'Test Conversation',
  requests: [],
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  ...overrides,
});

const emptyResult = {
  conversationId: '',
  messages: [],
};

const defaultInput = {
  conversationId: 'conv-123',
  projectKey: 'project-abc',
};

const createEvent = (overrides = {}) => ({
  event_id: 'event-123',
  request_id: 'request-123',
  request_state: 'SUCCESS',
  task_code: 'final-answer-generator',
  module_name: 'final-answer-generator',
  sort_key: '1000-0',
  metadata: null,
  task_response: null,
  ...overrides,
});

describe('getConversationDetailsUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call service with correct parameters', async () => {
    const mockResponse = createMockConversationDetails();

    mockService.mockResolvedValue(mockResponse);

    const result = await getConversationDetailsUseCase(defaultInput);

    expect(mockService).toHaveBeenCalledWith(defaultInput);
    expect(result).toEqual({
      conversationId: mockResponse.conversation_id,
      messages: [],
      pendingRequest: undefined,
    });
  });

  it('should return empty object when conversationId is empty', async () => {
    const result = await getConversationDetailsUseCase({
      ...defaultInput,
      conversationId: '',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyResult);
  });

  it('should return empty object when conversationId has only spaces', async () => {
    const result = await getConversationDetailsUseCase({
      ...defaultInput,
      conversationId: '   ',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyResult);
  });

  it('should return empty object when projectKey is empty', async () => {
    const result = await getConversationDetailsUseCase({
      ...defaultInput,
      projectKey: '',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyResult);
  });

  it('should return empty object when projectKey has only spaces', async () => {
    const result = await getConversationDetailsUseCase({
      ...defaultInput,
      projectKey: '   ',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyResult);
  });

  it('should return empty object when both parameters are invalid', async () => {
    const result = await getConversationDetailsUseCase({
      conversationId: '',
      projectKey: '',
    });

    expect(mockService).not.toHaveBeenCalled();
    expect(result).toEqual(emptyResult);
  });

  it('should return an abandoned assistant message when history contains an abandoned event', async () => {
    const mockResponse = createMockConversationDetails({
      requests: [
        {
          request_id: 'request-123',
          question: 'Show me the country highlights of Brazil in Q1 in 2026.',
          events: [
            {
              event_id: 'event-123',
              request_id: 'request-123',
              request_state: 'ABANDONED',
              task_code: 'ABANDONED',
              module_name: 'agentic_planner',
              sort_key: '1779360223095-0',
              metadata: null,
              task_response: null,
            },
          ],
          feedback: null,
        },
      ],
    });

    mockService.mockResolvedValue(mockResponse);

    const result = await getConversationDetailsUseCase(defaultInput);

    expect(result.pendingRequest).toBeUndefined();
    expect(result.messages).toEqual([
      expect.objectContaining({
        id: 'request-123',
        role: 'user',
        content: 'Show me the country highlights of Brazil in Q1 in 2026.',
      }),
      expect.objectContaining({
        id: 'request-123-abandoned',
        role: 'assistant',
        content:
          "This conversation was interrupted and can't continue. Please start a new chat.",
        isError: true,
        isAbandoned: true,
        requestId: 'request-123',
      }),
    ]);
  });

  it('should sort requests by the earliest valid event sort key', async () => {
    const mockResponse = createMockConversationDetails({
      requests: [
        {
          request_id: 'request-latest',
          question: 'Latest question',
          events: [
            createEvent({
              event_id: 'latest-invalid',
              request_id: 'request-latest',
              sort_key: 'not-a-number',
            }),
            createEvent({
              event_id: 'latest-final',
              request_id: 'request-latest',
              sort_key: '3000-0',
              task_response: { final_answer: 'Latest answer' },
            }),
          ],
          feedback: null,
        },
        {
          request_id: 'request-earliest',
          question: 'Earliest question',
          events: [
            createEvent({
              event_id: 'earliest-final',
              request_id: 'request-earliest',
              sort_key: '1000-0',
              task_response: { final_answer: 'Earliest answer' },
            }),
          ],
          feedback: null,
        },
      ],
    });

    mockService.mockResolvedValue(mockResponse);

    const result = await getConversationDetailsUseCase(defaultInput);

    expect(result.messages.map((message) => message.id)).toEqual([
      'request-earliest',
      'request-earliest-response',
      'request-latest',
      'request-latest-response',
    ]);
  });

  it('should place requests without valid sort keys first', async () => {
    const mockResponse = createMockConversationDetails({
      requests: [
        {
          request_id: 'request-with-sort-key',
          question: 'Question with sort key',
          events: [
            createEvent({
              request_id: 'request-with-sort-key',
              sort_key: '2000-0',
              task_response: { final_answer: 'Answer with sort key' },
            }),
          ],
          feedback: null,
        },
        {
          request_id: 'request-without-sort-key',
          question: 'Question without sort key',
          events: [
            createEvent({
              request_id: 'request-without-sort-key',
              sort_key: '',
              task_response: { final_answer: 'Answer without sort key' },
            }),
          ],
          feedback: null,
        },
      ],
    });

    mockService.mockResolvedValue(mockResponse);

    const result = await getConversationDetailsUseCase(defaultInput);

    expect(result.messages[0]).toEqual(
      expect.objectContaining({
        id: 'request-without-sort-key',
        content: 'Question without sort key',
      }),
    );
  });

  it('should build a successful assistant message with charts artifacts feedback and sorted execution steps', async () => {
    const chart = {
      chart_id: 'chart-123',
      title: 'Sales chart',
      figure_json: '{}',
      timestamp: '2024-01-02',
    };

    const mockResponse = createMockConversationDetails({
      created_at: '2024-01-01',
      requests: [
        {
          request_id: 'request-123',
          question: 'Show sales',
          events: [
            createEvent({
              event_id: 'step-latest',
              request_state: 'RUNNING',
              task_code: 'data-retriever',
              module_name: 'data-retriever',
              sort_key: '3000-0',
              task_response: {
                node: 'retrieve-data',
                outcome: { rows: 10 },
              },
            }),
            createEvent({
              event_id: 'step-earliest',
              request_state: 'RUNNING',
              task_code: 'planner',
              module_name: 'planner',
              sort_key: '2000-0',
              task_response: {
                node: 'plan',
                question: 'Show sales',
                outcome: 'Plan ready',
              },
            }),
            createEvent({
              event_id: 'final-123',
              sort_key: '4000-0',
              created_at: '2024-01-02',
              task_response: {
                final_answer: 'Sales are growing.',
                charts: [chart],
                artifacts: [
                  {
                    name: 'Sales report',
                    link: 'https://example.com/report',
                    type: 'pdf',
                  },
                  {
                    name: 'Ignored artifact without url',
                  },
                ],
                execution_time_ms: 1234,
              },
            }),
          ],
          feedback: {
            feedback_id: 'feedback-123',
            request_id: 'request-123',
            sentiment: 'positive',
            selected_options: [],
            comments: '',
            created_at: '2024-01-02',
          },
        },
      ],
    });

    mockService.mockResolvedValue(mockResponse);

    const result = await getConversationDetailsUseCase(defaultInput);

    expect(result.messages[1]).toEqual(
      expect.objectContaining({
        id: 'request-123-response',
        role: 'assistant',
        content: 'Sales are growing.',
        timestamp: '2024-01-02',
        requestId: 'request-123',
        feedbackSentiment: 'positive',
        charts: [chart],
        artifacts: [
          {
            question: 'Sales report',
            url: 'https://example.com/report',
            type: 'pdf',
          },
        ],
      }),
    );
    expect(result.messages[1].executionSteps).toEqual([
      expect.objectContaining({
        node: 'plan',
        outcome: 'Plan ready',
        execution_time_ms: undefined,
      }),
      expect.objectContaining({
        node: 'retrieve-data',
        outcome: { rows: 10 },
        execution_time_ms: 1234,
      }),
    ]);
  });

  it('should build an error assistant message when the final answer event has no answer', async () => {
    const mockResponse = createMockConversationDetails({
      requests: [
        {
          request_id: 'request-123',
          question: 'Show sales',
          events: [
            createEvent({
              created_at: '',
              task_response: {
                error_message: 'Missing final answer',
              },
            }),
          ],
          feedback: {
            feedback_id: 'feedback-123',
            request_id: 'request-123',
            sentiment: 'neutral',
            selected_options: [],
            comments: '',
            created_at: '2024-01-02',
          },
        },
      ],
    });

    mockService.mockResolvedValue(mockResponse);

    const result = await getConversationDetailsUseCase(defaultInput);

    expect(result.messages[1]).toEqual(
      expect.objectContaining({
        id: 'request-123-response',
        role: 'assistant',
        content: 'Sorry, something went wrong.',
        timestamp: '2024-01-01',
        isError: true,
        requestId: 'request-123',
        feedbackSentiment: undefined,
      }),
    );
  });

  it('should not create an assistant message before a final answer event exists', async () => {
    const mockResponse = createMockConversationDetails({
      requests: [
        {
          request_id: 'request-123',
          question: 'Show sales',
          events: [
            createEvent({
              request_state: 'RUNNING',
              task_code: 'planner',
              task_response: { node: 'plan' },
            }),
          ],
          feedback: null,
        },
      ],
    });

    mockService.mockResolvedValue(mockResponse);

    const result = await getConversationDetailsUseCase(defaultInput);

    expect(result.messages).toEqual([
      expect.objectContaining({
        id: 'request-123',
        role: 'user',
        content: 'Show sales',
      }),
    ]);
    expect(result.pendingRequest).toEqual({
      requestId: 'request-123',
      question: 'Show sales',
    });
  });

  it('should detect a pending request when the last request has no events', async () => {
    const mockResponse = createMockConversationDetails({
      requests: [
        {
          request_id: 'request-123',
          question: 'Show sales',
          feedback: null,
        },
      ],
    });

    mockService.mockResolvedValue(mockResponse);

    const result = await getConversationDetailsUseCase(defaultInput);

    expect(result.pendingRequest).toEqual({
      requestId: 'request-123',
      question: 'Show sales',
    });
  });

  it('should not detect a pending request after a failure event', async () => {
    const mockResponse = createMockConversationDetails({
      requests: [
        {
          request_id: 'request-123',
          question: 'Show sales',
          events: [
            createEvent({
              request_state: 'FAILURE',
              task_code: 'data-retriever',
              task_response: { error_message: 'Failed' },
            }),
          ],
          feedback: null,
        },
      ],
    });

    mockService.mockResolvedValue(mockResponse);

    const result = await getConversationDetailsUseCase(defaultInput);

    expect(result.pendingRequest).toBeUndefined();
  });
});
