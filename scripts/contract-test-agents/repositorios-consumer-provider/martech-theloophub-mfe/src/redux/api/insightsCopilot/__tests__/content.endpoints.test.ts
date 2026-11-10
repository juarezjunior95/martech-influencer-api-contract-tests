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
  getExhaustiveValuesUseCase: jest.fn(),
  getBlobMarkdownUseCase: jest.fn(),
  getFAQsUseCase: jest.fn(),
  getSmartFlowsUseCase: jest.fn(),
}));

import * as useCases from 'usecases/InsightsCopilotUseCase';

import { insightsCopilotApi } from '../insightsCopilotApi';
import '../content.endpoints';

const mockUseCases = useCases as jest.Mocked<typeof useCases>;

interface MockEndpoint {
  queryFn: (...args: unknown[]) => Promise<unknown>;
}

const endpoints = insightsCopilotApi.endpoints as Record<string, MockEndpoint>;

const createMockFAQ = (id: string, query: string) => ({
  id,
  query,
  project_key: 'project-abc',
  language: 'pt',
  group_id: `group-${id}`,
  created_at: '2021-01-01',
  updated_at: '2021-01-01',
});

const createMockSmartFlow = (id: number, title: string) => ({
  id,
  title,
  description: `Desc ${id}`,
  engine_domain: `engine-domain-${id}`,
  function_name: `function-name-${id}`,
  query: `query-${id}`,
});

describe('content endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('endpoint definitions', () => {
    it('should define all content query endpoints', () => {
      expect(endpoints.getExhaustiveValues).toBeDefined();
      expect(endpoints.getBlobMarkdown).toBeDefined();
      expect(endpoints.getFAQs).toBeDefined();
      expect(endpoints.getSmartFlows).toBeDefined();
    });
  });

  describe('getExhaustiveValues queryFn', () => {
    it('should call getExhaustiveValuesUseCase and return data', async () => {
      const mockValues = [{ label: 'Brand A', value: 'brand_a' }];
      mockUseCases.getExhaustiveValuesUseCase.mockResolvedValue(mockValues);

      const result = await endpoints.getExhaustiveValues.queryFn({
        projectKey: 'test-key',
        sourceTables: [{ table: 'brands' }],
      });

      expect(result).toEqual({ data: mockValues });
      expect(mockUseCases.getExhaustiveValuesUseCase).toHaveBeenCalledWith({
        projectKey: 'test-key',
        sourceTables: [{ table: 'brands' }],
      });
    });

    it('should return error when getExhaustiveValuesUseCase fails', async () => {
      const error = new Error('Failed');
      mockUseCases.getExhaustiveValuesUseCase.mockRejectedValue(error);

      const result = await endpoints.getExhaustiveValues.queryFn({
        projectKey: 'test-key',
        sourceTables: [],
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });

  describe('getBlobMarkdown queryFn', () => {
    it('should call getBlobMarkdownUseCase and return data', async () => {
      mockUseCases.getBlobMarkdownUseCase.mockResolvedValue('# Hello');

      const result = await endpoints.getBlobMarkdown.queryFn({
        blobPath: '/path/to/blob',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ data: '# Hello' });
    });

    it('should return error when getBlobMarkdownUseCase fails', async () => {
      const error = new Error('Blob error');
      mockUseCases.getBlobMarkdownUseCase.mockRejectedValue(error);

      const result = await endpoints.getBlobMarkdown.queryFn({
        blobPath: '/path',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });

  describe('getFAQs queryFn', () => {
    it('should call getFAQsUseCase and return data', async () => {
      const mockFAQs = [createMockFAQ('1', 'Q1'), createMockFAQ('2', 'Q2')];
      mockUseCases.getFAQsUseCase.mockResolvedValue(mockFAQs);

      const result = await endpoints.getFAQs.queryFn({
        projectKey: 'test-key',
        language: 'pt',
      });

      expect(result).toEqual({ data: mockFAQs });
    });

    it('should return error when getFAQsUseCase fails', async () => {
      const error = new Error('Network error');
      mockUseCases.getFAQsUseCase.mockRejectedValue(error);

      const result = await endpoints.getFAQs.queryFn({
        projectKey: 'test-key',
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });

  describe('getSmartFlows queryFn', () => {
    it('should call getSmartFlowsUseCase and return data', async () => {
      const mockFlows = [createMockSmartFlow(1, 'Flow 1')];
      mockUseCases.getSmartFlowsUseCase.mockResolvedValue(mockFlows);

      const result = await endpoints.getSmartFlows.queryFn({
        projectKey: 'test-key',
      });

      expect(result).toEqual({ data: mockFlows });
    });

    it('should return error when getSmartFlowsUseCase fails', async () => {
      const error = new Error('Error');
      mockUseCases.getSmartFlowsUseCase.mockRejectedValue(error);

      const result = await endpoints.getSmartFlows.queryFn({
        projectKey: 'test-key',
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });
});
