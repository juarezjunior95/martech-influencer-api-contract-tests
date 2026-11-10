import { pollForResponseService } from 'services/InsightsCopilotService';

import pollForResponseUseCase from './pollForResponseUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  pollForResponseService: jest.fn(),
}));

const mockService = pollForResponseService as jest.MockedFunction<
  typeof pollForResponseService
>;

const createMockEvent = (
  overrides: Partial<{
    event_id: string;
    request_id: string;
    module_name: string;
    sort_key: string;
    task_code: string;
    request_state: 'SUCCESS' | 'FAILURE' | 'RUNNING' | 'PENDING' | 'ABANDONED';
    task_response: Record<string, any>;
  }> = {},
) => ({
  event_id: 'event-id-1',
  request_id: 'req-456',
  module_name: 'planner',
  sort_key: '1',
  task_code: 'planner',
  request_state: 'RUNNING' as const,
  task_response: {},
  ...overrides,
});

const createSuccessEvent = (finalAnswer = 'Final answer') =>
  createMockEvent({
    task_code: 'final-answer-generator',
    module_name: 'final-answer-generator',
    request_state: 'SUCCESS',
    task_response: { final_answer: finalAnswer },
  });

const createFailureEvent = (errorMessage = 'Error processing request') =>
  createMockEvent({
    request_state: 'FAILURE',
    task_response: { error_message: errorMessage },
  });

const defaultUseCaseInput = {
  conversationId: 'conv-123',
  requestId: 'req-456',
  projectKey: 'project-abc',
};

describe('pollForResponseUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should return final answer when successful', async () => {
    const mockEvents = [createSuccessEvent('Copilot final answer')];

    mockService.mockResolvedValue(mockEvents);

    const result = await pollForResponseUseCase(defaultUseCaseInput);

    expect(result.answer).toBe('Copilot final answer');
    expect(result.charts).toEqual([]);
    expect(result.artifacts).toEqual([]);
    expect(mockService).toHaveBeenCalledWith(defaultUseCaseInput);
  });

  it('should return ERROR when event has FAILURE', async () => {
    const mockEvents = [createFailureEvent()];

    mockService.mockResolvedValue(mockEvents);

    const result = await pollForResponseUseCase(defaultUseCaseInput);

    expect(result.answer).toBe('ERROR: Error processing request');
    expect(result.charts).toEqual([]);
    expect(result.artifacts).toEqual([]);
  });

  it('should stringify object error messages when event has FAILURE', async () => {
    const mockEvents = [
      createMockEvent({
        request_state: 'FAILURE',
        task_response: {
          error_message: { code: 'INVALID_REQUEST', detail: 'Missing field' },
        },
      }),
    ];

    mockService.mockResolvedValue(mockEvents);

    const result = await pollForResponseUseCase(defaultUseCaseInput);

    expect(result.answer).toBe(
      'ERROR: {"code":"INVALID_REQUEST","detail":"Missing field"}',
    );
    expect(result.answer).not.toContain('[object Object]');
    expect(result.charts).toEqual([]);
    expect(result.artifacts).toEqual([]);
  });

  it('should return ERROR: ABANDONED when request is abandoned', async () => {
    const mockEvents = [
      createMockEvent({
        request_state: 'ABANDONED',
        task_code: 'ABANDONED',
      }),
    ];

    mockService.mockResolvedValue(mockEvents);

    const result = await pollForResponseUseCase(defaultUseCaseInput);

    expect(result.answer).toBe('ERROR: ABANDONED');
    expect(result.charts).toEqual([]);
    expect(result.artifacts).toEqual([]);
  });

  it('should call onProgress when provided', async () => {
    const mockEvents = [createMockEvent()];
    const mockEvents2 = [createSuccessEvent('Answer')];

    mockService
      .mockResolvedValueOnce(mockEvents)
      .mockResolvedValueOnce(mockEvents2);

    const onProgress = jest.fn();

    const promise = pollForResponseUseCase({
      ...defaultUseCaseInput,
      onProgress,
    });

    await jest.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(onProgress).toHaveBeenCalled();
    expect(result.answer).toBe('Answer');
  });

  it('should poll multiple times until getting response', async () => {
    const mockPendingEvents = [createMockEvent()];
    const mockSuccessEvents = [createSuccessEvent()];

    mockService
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockSuccessEvents);

    const promise = pollForResponseUseCase(defaultUseCaseInput);

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(mockService).toHaveBeenCalledTimes(3);
    expect(result.answer).toBe('Final answer');
  });

  it('should return TIMEOUT when exceeding MAX_WAIT_TIME', async () => {
    const originalDateNow = Date.now;
    let callCount = 0;

    // MAX_WAIT_TIME = 2.5 * 60 * 1000 = 150000ms
    jest.spyOn(global.Date, 'now').mockImplementation(() => {
      callCount++;
      return callCount === 1 ? 0 : 151000;
    });

    const mockEvents = [createMockEvent()];

    mockService.mockResolvedValue(mockEvents);

    const result = await pollForResponseUseCase(defaultUseCaseInput);

    expect(result.answer).toBe('TIMEOUT');

    global.Date.now = originalDateNow;
  }, 10000);

  it('should throw error when receiving authentication error', async () => {
    const authError = new Error('authentication');
    mockService.mockRejectedValue(authError);

    await expect(pollForResponseUseCase(defaultUseCaseInput)).rejects.toThrow();
  }, 10000);

  it('should continue polling after generic error', async () => {
    const mockEvents = [createSuccessEvent('Answer')];

    mockService
      .mockRejectedValueOnce(new Error('Temporary error'))
      .mockResolvedValueOnce(mockEvents);

    const promise = pollForResponseUseCase(defaultUseCaseInput);

    await jest.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(result.answer).toBe('Answer');
  });

  it('should throw error when receiving "Failed to fetch" error', async () => {
    const fetchError = new Error('Failed to fetch');
    mockService.mockRejectedValue(fetchError);

    await expect(pollForResponseUseCase(defaultUseCaseInput)).rejects.toThrow(
      'Failed to fetch',
    );
  });

  it('should throw error when receiving "AI found an error" error', async () => {
    const iaError = new Error('AI found an error');
    mockService.mockRejectedValue(iaError);

    await expect(pollForResponseUseCase(defaultUseCaseInput)).rejects.toThrow(
      'AI found an error',
    );
  }, 10000);

  it('should show "Preparando análise..." for PENDING state', async () => {
    const mockPendingEvents = [createMockEvent({ request_state: 'PENDING' })];
    const mockSuccessEvents = [createSuccessEvent()];

    mockService
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockSuccessEvents);

    const onProgress = jest.fn();

    const promise = pollForResponseUseCase({
      ...defaultUseCaseInput,
      onProgress,
    });

    await jest.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(onProgress).toHaveBeenCalledWith({
      stage: 'PENDING',
      message: 'Preparando análise...',
      taskCode: 'planner',
    });
    expect(result.answer).toBe('Final answer');
  });

  it('should return charts and artifacts from task response', async () => {
    const mockCharts = [
      {
        chart_id: 'c1',
        title: 'Sales',
        figure_json: '{}',
        timestamp: '2024-01-01',
      },
    ];
    const mockArtifacts = [{ question: 'Q1', url: 'https://example.com' }];
    const mockEvents = [
      createMockEvent({
        task_code: 'final-answer-generator',
        module_name: 'final-answer-generator',
        request_state: 'SUCCESS',
        task_response: {
          final_answer: 'Answer with rich data',
          charts: mockCharts,
          artifacts: mockArtifacts,
        },
      }),
    ];

    mockService.mockResolvedValue(mockEvents);

    const result = await pollForResponseUseCase(defaultUseCaseInput);

    expect(result.answer).toBe('Answer with rich data');
    expect(result.charts).toEqual(mockCharts);
    expect(result.artifacts).toEqual(mockArtifacts);
  });

  it('should show different progress messages for different task codes', async () => {
    const mockEvents1 = [
      createMockEvent({
        task_code: 'data-retriever',
        module_name: 'data-retriever',
      }),
    ];

    const mockEvents2 = [
      createMockEvent({
        task_code: 'chart-generator',
        module_name: 'chart-generator',
      }),
    ];

    const mockSuccessEvents = [createSuccessEvent('Answer')];

    mockService
      .mockResolvedValueOnce(mockEvents1)
      .mockResolvedValueOnce(mockEvents2)
      .mockResolvedValueOnce(mockSuccessEvents);

    const onProgress = jest.fn();

    const promise = pollForResponseUseCase({
      ...defaultUseCaseInput,
      onProgress,
    });

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(onProgress).toHaveBeenCalledWith({
      stage: 'RUNNING',
      message: 'Buscando dados relevantes...',
      taskCode: 'data-retriever',
    });

    expect(onProgress).toHaveBeenCalledWith({
      stage: 'RUNNING',
      message: 'Gerando visualizações...',
      taskCode: 'chart-generator',
    });

    expect(result.answer).toBe('Answer');
  });

  it('should show default message for unknown task code', async () => {
    const mockEvents = [
      createMockEvent({
        task_code: 'unknown-task',
        module_name: 'unknown-task',
      }),
    ];

    const mockSuccessEvents = [createSuccessEvent('Answer')];

    mockService
      .mockResolvedValueOnce(mockEvents)
      .mockResolvedValueOnce(mockSuccessEvents);

    const onProgress = jest.fn();

    const promise = pollForResponseUseCase({
      ...defaultUseCaseInput,
      onProgress,
    });

    await jest.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(onProgress).toHaveBeenCalledWith({
      stage: 'RUNNING',
      message: 'Processando sua pergunta...',
      taskCode: 'unknown-task',
    });
    expect(result.answer).toBe('Answer');
  });

  it('should not call onProgress repeatedly for same message', async () => {
    const mockEvents = [createMockEvent()];
    const mockSuccessEvents = [createSuccessEvent('Answer')];

    mockService
      .mockResolvedValueOnce(mockEvents)
      .mockResolvedValueOnce(mockEvents)
      .mockResolvedValueOnce(mockSuccessEvents);

    const onProgress = jest.fn();

    const promise = pollForResponseUseCase({
      ...defaultUseCaseInput,
      onProgress,
    });

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(100);

    const result = await promise;

    expect(onProgress).toHaveBeenCalledTimes(1);
    expect(result.answer).toBe('Answer');
  });

  it('should use different delays based on attempt count', async () => {
    const mockPendingEvents = [createMockEvent()];
    const mockSuccessEvents = [createSuccessEvent()];

    mockService
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockPendingEvents)
      .mockResolvedValueOnce(mockSuccessEvents);

    const promise = pollForResponseUseCase(defaultUseCaseInput);

    // First 10 attempts: INITIAL delay (100ms)
    for (let i = 0; i < 10; i++) {
      await jest.advanceTimersByTimeAsync(100);
    }

    // 11th attempt: MEDIUM delay (500ms)
    await jest.advanceTimersByTimeAsync(500);

    const result = await promise;

    expect(mockService).toHaveBeenCalledTimes(12);
    expect(result.answer).toBe('Final answer');
  });
});
