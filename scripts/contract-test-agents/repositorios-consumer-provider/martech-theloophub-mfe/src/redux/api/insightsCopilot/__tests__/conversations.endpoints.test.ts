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
  getConversationDetailsUseCase: jest.fn(),
  listConversationsUseCase: jest.fn(),
  deleteConversationUseCase: jest.fn(),
  renameConversationUseCase: jest.fn(),
  startConversationUseCase: jest.fn(),
  addFollowUpMessageUseCase: jest.fn(),
}));

import type { Message } from 'models/InsightsCopilot';
import * as useCases from 'usecases/InsightsCopilotUseCase';

import { insightsCopilotApi } from '../insightsCopilotApi';
import '../conversations.endpoints';

const mockUseCases = useCases as jest.Mocked<typeof useCases>;

interface MockEndpoint {
  queryFn: (...args: unknown[]) => Promise<unknown>;
}

const endpoints = insightsCopilotApi.endpoints as Record<string, MockEndpoint>;

const createMockConversation = (id: string, name: string) => ({
  conversation_id: id,
  name,
  project_key: 'project-abc',
  user_email: `user-${id}@email.com`,
  is_agentic: true,
  created_at: '2021-01-01',
  updated_at: '2021-01-01',
  expires_at: '2021-01-01',
});

const createMockMessage = (
  id: string,
  role: Message['role'],
  content: string,
): Message => ({
  id,
  role,
  content,
  timestamp: '2021-01-01T00:00:00Z',
});

describe('conversations endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('endpoint definitions', () => {
    it('should define all conversation endpoints', () => {
      expect(endpoints.getConversationDetails).toBeDefined();
      expect(endpoints.listConversations).toBeDefined();
      expect(endpoints.deleteConversation).toBeDefined();
      expect(endpoints.renameConversation).toBeDefined();
      expect(endpoints.startConversation).toBeDefined();
      expect(endpoints.addFollowUpMessage).toBeDefined();
    });
  });

  describe('getConversationDetails queryFn', () => {
    it('should call getConversationDetailsUseCase and return data', async () => {
      const mockResult = {
        conversationId: 'conv-1',
        messages: [createMockMessage('m1', 'user', 'Hello')],
      };
      mockUseCases.getConversationDetailsUseCase.mockResolvedValue(mockResult);

      const result = await endpoints.getConversationDetails.queryFn({
        conversationId: 'conv-1',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ data: mockResult });
      expect(mockUseCases.getConversationDetailsUseCase).toHaveBeenCalledWith({
        conversationId: 'conv-1',
        projectKey: 'test-key',
      });
    });

    it('should return error when getConversationDetailsUseCase fails', async () => {
      const error = new Error('Details error');
      mockUseCases.getConversationDetailsUseCase.mockRejectedValue(error);

      const result = await endpoints.getConversationDetails.queryFn({
        conversationId: 'conv-1',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });

  describe('listConversations queryFn', () => {
    it('should call listConversationsUseCase with params', async () => {
      const mockHistory = [createMockConversation('conv-1', 'Conversation 1')];
      mockUseCases.listConversationsUseCase.mockResolvedValue(mockHistory);

      const result = await endpoints.listConversations.queryFn({
        projectKey: 'test-key',
        page: 1,
        limit: 20,
      });

      expect(result).toEqual({ data: mockHistory });
    });

    it('should return error when listConversationsUseCase fails', async () => {
      const error = new Error('Error');
      mockUseCases.listConversationsUseCase.mockRejectedValue(error);

      const result = await endpoints.listConversations.queryFn({
        projectKey: 'test-key',
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });

  describe('deleteConversation queryFn', () => {
    it('should call deleteConversationUseCase', async () => {
      mockUseCases.deleteConversationUseCase.mockResolvedValue({
        message: 'Deleted',
      });

      const result = await endpoints.deleteConversation.queryFn({
        conversationId: 'conv-1',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ data: { message: 'Deleted' } });
    });

    it('should return error when delete fails', async () => {
      const error = new Error('Delete failed');
      mockUseCases.deleteConversationUseCase.mockRejectedValue(error);

      const result = await endpoints.deleteConversation.queryFn({
        conversationId: 'conv-1',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });

  describe('renameConversation queryFn', () => {
    it('should call renameConversationUseCase', async () => {
      const mockResponse = {
        conversation_id: 'conv-1',
        name: 'New Name',
        project_key: 'test-key',
        user_email: 'user@email.com',
        created_at: '2021-01-01',
        updated_at: '2021-01-01',
      };
      mockUseCases.renameConversationUseCase.mockResolvedValue(mockResponse);

      const result = await endpoints.renameConversation.queryFn({
        conversationId: 'conv-1',
        projectKey: 'test-key',
        name: 'New Name',
      });

      expect(result).toEqual({ data: mockResponse });
    });

    it('should return error when rename fails', async () => {
      const error = new Error('Rename failed');
      mockUseCases.renameConversationUseCase.mockRejectedValue(error);

      const result = await endpoints.renameConversation.queryFn({
        conversationId: 'conv-1',
        projectKey: 'test-key',
        name: 'New Name',
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });

  describe('startConversation queryFn', () => {
    it('should call startConversationUseCase and return data', async () => {
      const mockResponse = {
        conversation_id: 'conv-new',
        requests: [{ request_id: 'req-1', question: 'Hello' }],
      };
      mockUseCases.startConversationUseCase.mockResolvedValue(mockResponse);

      const result = await endpoints.startConversation.queryFn({
        query: 'Hello',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ data: mockResponse });
    });

    it('should return error when startConversationUseCase fails', async () => {
      const error = new Error('Start failed');
      mockUseCases.startConversationUseCase.mockRejectedValue(error);

      const result = await endpoints.startConversation.queryFn({
        query: 'Hello',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });

  describe('addFollowUpMessage queryFn', () => {
    it('should call addFollowUpMessageUseCase and return data', async () => {
      const mockResponse = {
        conversation_id: 'conv-1',
        requests: [{ request_id: 'req-2', question: 'Follow up' }],
      };
      mockUseCases.addFollowUpMessageUseCase.mockResolvedValue(mockResponse);

      const result = await endpoints.addFollowUpMessage.queryFn({
        conversationId: 'conv-1',
        query: 'Follow up',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ data: mockResponse });
    });

    it('should return error when addFollowUpMessageUseCase fails', async () => {
      const error = new Error('Follow up failed');
      mockUseCases.addFollowUpMessageUseCase.mockRejectedValue(error);

      const result = await endpoints.addFollowUpMessage.queryFn({
        conversationId: 'conv-1',
        query: 'Follow up',
        projectKey: 'test-key',
      });

      expect(result).toEqual({ error: { data: error } });
    });
  });
});
