import { getSmartFlowsService } from 'services/InsightsCopilotService';

import getSmartFlowsUseCase from './getSmartFlowsUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  getSmartFlowsService: jest.fn(),
}));

const mockService = getSmartFlowsService as jest.MockedFunction<
  typeof getSmartFlowsService
>;

const createMockSmartFlow = (
  id: number,
  title: string,
  description = `Desc ${id}`,
) => ({
  id,
  title,
  description,
  engine_domain: `engine-domain-${id}`,
  function_name: `function-name-${id}`,
  query: `query-${id}`,
});

const defaultInput = {
  projectKey: 'project-abc',
};

describe('getSmartFlowsUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call service with correct parameters', async () => {
    const mockResponse = [
      createMockSmartFlow(1, 'Flow A', 'Desc A'),
      createMockSmartFlow(2, 'Flow B', 'Desc B'),
    ];

    mockService.mockResolvedValue(mockResponse);

    const result = await getSmartFlowsUseCase(defaultInput);

    expect(mockService).toHaveBeenCalledWith(defaultInput);
    expect(result).toHaveLength(2);
  });

  it('should return all smart flows from the service', async () => {
    const mockResponse = [
      createMockSmartFlow(1, 'Flow A'),
      createMockSmartFlow(2, 'Flow B'),
      createMockSmartFlow(3, 'Flow C'),
      createMockSmartFlow(4, 'Flow D'),
    ];

    mockService.mockResolvedValue(mockResponse);

    const result = await getSmartFlowsUseCase(defaultInput);

    expect(result).toHaveLength(4);
    expect(result).toEqual(mockResponse);
  });

  it('should return empty array when service returns empty', async () => {
    mockService.mockResolvedValue([]);

    const result = await getSmartFlowsUseCase(defaultInput);

    expect(result).toEqual([]);
  });

  it('should handle single SmartFlow', async () => {
    const mockResponse = [createMockSmartFlow(1, 'Single Flow', 'Desc')];

    mockService.mockResolvedValue(mockResponse);

    const result = await getSmartFlowsUseCase(defaultInput);

    expect(result).toHaveLength(1);
  });
});
