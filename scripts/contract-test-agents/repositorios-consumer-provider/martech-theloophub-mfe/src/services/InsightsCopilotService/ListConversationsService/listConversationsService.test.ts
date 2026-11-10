import { initialAxiosIC } from 'Api/ApiIC';

import listConversationsService from './listConversationsService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    get: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const buildListConversationsUrl = (projectKey: string, page = 1, limit = 20) =>
  `/v2/conversations?project_key=${projectKey}&page=${page}&limit=${limit}`;

const createMockResponse = (data: any, status = 200) => ({ data, status });

const defaultParams = {
  projectKey: 'project-abc',
  page: 1,
  limit: 20,
};

describe('listConversationsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should GET and return conversations list', async () => {
    const mockData = [
      { conversation_id: 'conv-1', name: 'Conversation 1' },
      { conversation_id: 'conv-2', name: 'Conversation 2' },
    ];

    mockAxios.get.mockResolvedValue(createMockResponse(mockData));

    const result = await listConversationsService(defaultParams);

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildListConversationsUrl(
        defaultParams.projectKey,
        defaultParams.page,
        defaultParams.limit,
      ),
    );
    expect(result).toEqual(mockData);
  });

  it('should use page=1 as default when not specified', async () => {
    mockAxios.get.mockResolvedValue(createMockResponse([]));

    await listConversationsService({
      projectKey: 'project-abc',
    });

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildListConversationsUrl('project-abc', 1, 20),
    );
  });

  it('should use limit=20 as default when not specified', async () => {
    mockAxios.get.mockResolvedValue(createMockResponse([]));

    await listConversationsService({
      projectKey: 'project-abc',
      page: 2,
    });

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildListConversationsUrl('project-abc', 2, 20),
    );
  });

  it('should return empty array when data is null', async () => {
    mockAxios.get.mockResolvedValue({ data: null, status: 200 });

    const result = await listConversationsService({
      projectKey: 'project-abc',
    });

    expect(result).toEqual([]);
  });

  it('should return empty array when data is undefined', async () => {
    mockAxios.get.mockResolvedValue({ data: undefined, status: 200 });

    const result = await listConversationsService({
      projectKey: 'project-abc',
    });

    expect(result).toEqual([]);
  });

  it('should throw when response status is not 200', async () => {
    mockAxios.get.mockResolvedValue({ data: [], status: 500 });

    await expect(
      listConversationsService({ projectKey: 'project-abc' }),
    ).rejects.toThrow('Failed to load conversations');
  });

  it('should throw when request fails', async () => {
    mockAxios.get.mockRejectedValue(new Error('Network error'));

    await expect(
      listConversationsService({ projectKey: 'project-abc' }),
    ).rejects.toThrow('Network error');
  });

  it('should use custom page and limit', async () => {
    mockAxios.get.mockResolvedValue(createMockResponse([]));

    await listConversationsService({
      projectKey: 'project-xyz',
      page: 5,
      limit: 50,
    });

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildListConversationsUrl('project-xyz', 5, 50),
    );
  });
});
