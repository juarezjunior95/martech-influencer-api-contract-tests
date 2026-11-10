jest.mock('@reduxjs/toolkit/query/react', () => ({
  createApi: jest.fn((config: Record<string, unknown>) => {
    const mockEndpoints: Record<string, Record<string, unknown>> = {};
    const mockBuilder = {
      query: (def: Record<string, unknown>) => ({ ...def, type: 'query' }),
      mutation: (def: Record<string, unknown>) => ({
        ...def,
        type: 'mutation',
      }),
    };

    if (typeof config.endpoints === 'function') {
      Object.assign(mockEndpoints, config.endpoints(mockBuilder));
    }

    return {
      reducerPath: config.reducerPath,
      reducer: jest.fn(),
      middleware: jest.fn(),
      endpoints: mockEndpoints,
      util: {
        resetApiState: jest.fn(),
        updateQueryData: jest.fn(() => ({ undo: jest.fn() })),
      },
      injectEndpoints(injectConfig: Record<string, unknown>) {
        if (typeof injectConfig.endpoints === 'function') {
          Object.assign(mockEndpoints, injectConfig.endpoints(mockBuilder));
        }
        return this;
      },
    };
  }),
}));

jest.mock('usecases/InsightsCopilotUseCase', () => ({
  sendFeedbackUseCase: jest.fn(),
}));

import * as useCases from 'usecases/InsightsCopilotUseCase';

import { insightsCopilotApi } from '../insightsCopilotApi';
import '../feedback.endpoints';

const mockUseCases = useCases as jest.Mocked<typeof useCases>;

interface MockEndpoint {
  queryFn: (...args: unknown[]) => Promise<unknown>;
}

const endpoints = insightsCopilotApi.endpoints as Record<string, MockEndpoint>;

describe('feedback endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('endpoint definitions', () => {
    it('should define sendFeedback mutation', () => {
      expect(endpoints.sendFeedback).toBeDefined();
    });
  });

  describe('sendFeedback queryFn', () => {
    it('should call sendFeedbackUseCase', async () => {
      const mockResponse = {
        feedback_id: 'fb-1',
        request_id: 'req-1',
        sentiment: 'positive' as const,
        scenario: 'general',
        selected_options: ['accurate'],
        user_email: 'user@email.com',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
      };
      mockUseCases.sendFeedbackUseCase.mockResolvedValue(mockResponse);

      const result = await endpoints.sendFeedback.queryFn({
        requestId: 'req-1',
        sentiment: 'positive',
        scenario: 'general',
        selectedOptions: ['accurate'],
        comments: 'Great!',
      });

      expect(result).toEqual({ data: mockResponse });
      expect(mockUseCases.sendFeedbackUseCase).toHaveBeenCalledWith({
        requestId: 'req-1',
        sentiment: 'positive',
        scenario: 'general',
        selectedOptions: ['accurate'],
        comments: 'Great!',
      });
    });

    it('should return error when feedback fails', async () => {
      const error = new Error('Feedback failed');
      mockUseCases.sendFeedbackUseCase.mockRejectedValue(error);

      const result = await endpoints.sendFeedback.queryFn({
        requestId: 'req-1',
        sentiment: 'positive',
        scenario: 'general',
        selectedOptions: ['accurate'],
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });
});
