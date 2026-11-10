import {
  createAssistantMessage,
  createErrorMessage,
  createUserMessage,
} from './messageHelpers';

describe('messageHelpers', () => {
  describe('createUserMessage', () => {
    it('should create a message with role "user"', () => {
      const message = createUserMessage('Hello');
      expect(message.role).toBe('user');
    });

    it('should set the content correctly', () => {
      const message = createUserMessage('Hello');
      expect(message.content).toBe('Hello');
    });

    it('should generate an id', () => {
      const message = createUserMessage('Hello');
      expect(message.id).toBeDefined();
      expect(message.id.length).toBeGreaterThan(0);
    });

    it('should set a timestamp', () => {
      const message = createUserMessage('Hello');
      expect(message.timestamp).toBeDefined();
      expect(new Date(message.timestamp).getTime()).not.toBeNaN();
    });
  });

  describe('createAssistantMessage', () => {
    it('should create a message with role "assistant"', () => {
      const message = createAssistantMessage('Hi there');
      expect(message.role).toBe('assistant');
    });

    it('should set the content correctly', () => {
      const message = createAssistantMessage('Hi there');
      expect(message.content).toBe('Hi there');
    });

    it('should generate an id', () => {
      const message = createAssistantMessage('Hi');
      expect(message.id).toBeDefined();
      expect(message.id.length).toBeGreaterThan(0);
    });

    it('should include charts when provided in richData', () => {
      const charts = [
        {
          chart_id: 'c1',
          title: 'Sales',
          figure_json: '{}',
          timestamp: '2024-01-01',
        },
      ];
      const message = createAssistantMessage('Hi', 'req-1', { charts });
      expect(message.charts).toEqual(charts);
    });

    it('should include artifacts when provided in richData', () => {
      const artifacts = [{ question: 'Q1', url: 'https://example.com' }];
      const message = createAssistantMessage('Hi', 'req-1', { artifacts });
      expect(message.artifacts).toEqual(artifacts);
    });

    it('should not include charts/artifacts when richData is empty', () => {
      const message = createAssistantMessage('Hi', 'req-1', {
        charts: [],
        artifacts: [],
      });
      expect(message.charts).toBeUndefined();
      expect(message.artifacts).toBeUndefined();
    });

    it('should not include charts/artifacts when richData is undefined', () => {
      const message = createAssistantMessage('Hi', 'req-1');
      expect(message.charts).toBeUndefined();
      expect(message.artifacts).toBeUndefined();
    });
  });

  describe('createErrorMessage', () => {
    it('should create a message with role "assistant"', () => {
      const message = createErrorMessage();
      expect(message.role).toBe('assistant');
    });

    it('should have isError set to true', () => {
      const message = createErrorMessage();
      expect(message.isError).toBe(true);
    });

    it('should have a default error content', () => {
      const message = createErrorMessage();
      expect(message.content).toBe('Sorry, something went wrong.');
    });

    it('should generate an id', () => {
      const message = createErrorMessage();
      expect(message.id).toBeDefined();
      expect(message.id.length).toBeGreaterThan(0);
    });
  });
});
