import { initialAxiosIC } from 'Api/ApiIC';

import pollForResponseService from './pollForResponseService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    get: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const buildPollUrl = (
  conversationId: string,
  requestId: string,
  projectKey: string,
) =>
  `/v2/conversations/${conversationId}/request/${requestId}?project_key=${projectKey}`;

const createMockResponse = (data: any) => ({ data });

const defaultParams = {
  conversationId: 'conv-123',
  requestId: 'req-456',
  projectKey: 'project-abc',
};

describe('pollForResponseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should GET and return events list', async () => {
    const mockData = [
      { task_code: 'planner', request_state: 'RUNNING' },
      { task_code: 'final-answer-generator', request_state: 'SUCCESS' },
    ];

    mockAxios.get.mockResolvedValue(createMockResponse(mockData));

    const result = await pollForResponseService(defaultParams);

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildPollUrl(
        defaultParams.conversationId,
        defaultParams.requestId,
        defaultParams.projectKey,
      ),
      { signal: undefined },
    );
    expect(result).toEqual(mockData);
  });

  it('should build URL correctly with all parameters', async () => {
    mockAxios.get.mockResolvedValue(createMockResponse([]));

    await pollForResponseService({
      conversationId: 'test-conv-id',
      requestId: 'test-req-id',
      projectKey: 'test-project-key',
    });

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildPollUrl('test-conv-id', 'test-req-id', 'test-project-key'),
      { signal: undefined },
    );
  });

  it('should return API data', async () => {
    const expectedData = [
      {
        task_code: 'data-retriever',
        request_state: 'SUCCESS',
        task_response: { data: 'result' },
      },
    ];

    mockAxios.get.mockResolvedValue(createMockResponse(expectedData));

    const result = await pollForResponseService({
      conversationId: 'conv-789',
      requestId: 'req-999',
      projectKey: 'proj-abc',
    });

    expect(result).toEqual(expectedData);
  });
});
