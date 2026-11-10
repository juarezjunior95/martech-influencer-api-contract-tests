import { initialAxiosIC } from 'Api/ApiIC';

import getSmartFlowsService from './getSmartFlowsService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    get: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const buildSmartFlowsUrl = (projectKey: string) =>
  `/v2/smart-flows?project_key=${projectKey}`;

const createMockResponse = (data: any) => ({ data });

const defaultParams = {
  projectKey: 'project-abc',
};

describe('getSmartFlowsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should GET and return SmartFlows list', async () => {
    const mockData = [
      { id: '1', title: 'Sales Analysis', description: 'Desc 1' },
      { id: '2', title: 'Monthly Report', description: 'Desc 2' },
    ];

    mockAxios.get.mockResolvedValue(createMockResponse(mockData));

    const result = await getSmartFlowsService(defaultParams);

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildSmartFlowsUrl(defaultParams.projectKey),
    );
    expect(result).toEqual(mockData);
  });

  it('should build URL correctly with project_key', async () => {
    mockAxios.get.mockResolvedValue(createMockResponse([]));

    await getSmartFlowsService({
      projectKey: 'test-project-key',
    });

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildSmartFlowsUrl('test-project-key'),
    );
  });

  it('should return empty array when data is null', async () => {
    mockAxios.get.mockResolvedValue({ data: null });

    const result = await getSmartFlowsService(defaultParams);

    expect(result).toEqual([]);
  });

  it('should return empty array when data is undefined', async () => {
    mockAxios.get.mockResolvedValue({ data: undefined });

    const result = await getSmartFlowsService(defaultParams);

    expect(result).toEqual([]);
  });
});
