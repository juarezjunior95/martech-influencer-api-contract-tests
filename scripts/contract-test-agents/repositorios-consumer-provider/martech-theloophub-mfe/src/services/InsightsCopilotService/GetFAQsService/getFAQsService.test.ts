import { initialAxiosIC } from 'Api/ApiIC';

import getFAQsService from './getFAQsService';

jest.mock('Api/ApiIC', () => ({
  initialAxiosIC: {
    get: jest.fn(),
  },
}));

const mockAxios = initialAxiosIC as jest.Mocked<typeof initialAxiosIC>;

const buildFAQsUrl = (projectKey: string, language = 'en') =>
  `/v2/faqs?project_key=${projectKey}&language=${language}`;

const createMockResponse = (data: any) => ({ data });

const defaultParams = {
  projectKey: 'project-abc',
  language: 'pt',
};

describe('getFAQsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should GET and return FAQs list', async () => {
    const mockData = [
      { id: '1', query: 'How to view sales?', answer: 'Answer 1' },
      { id: '2', query: 'Where are the reports?', answer: 'Answer 2' },
    ];

    mockAxios.get.mockResolvedValue(createMockResponse(mockData));

    const result = await getFAQsService(defaultParams);

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildFAQsUrl(defaultParams.projectKey, defaultParams.language),
    );
    expect(result).toEqual(mockData);
  });

  it('should use "en" as default language when not specified', async () => {
    mockAxios.get.mockResolvedValue(createMockResponse([]));

    await getFAQsService({
      projectKey: 'project-abc',
    });

    expect(mockAxios.get).toHaveBeenCalledWith(
      buildFAQsUrl('project-abc', 'en'),
    );
  });

  it('should return empty array when data is null', async () => {
    mockAxios.get.mockResolvedValue({ data: null });

    const result = await getFAQsService({
      projectKey: 'project-abc',
    });

    expect(result).toEqual([]);
  });

  it('should return empty array when data is undefined', async () => {
    mockAxios.get.mockResolvedValue({ data: undefined });

    const result = await getFAQsService({
      projectKey: 'project-abc',
    });

    expect(result).toEqual([]);
  });

  it('should build URL with custom language', async () => {
    mockAxios.get.mockResolvedValue(createMockResponse([]));

    await getFAQsService({
      projectKey: 'test-key',
      language: 'es',
    });

    expect(mockAxios.get).toHaveBeenCalledWith(buildFAQsUrl('test-key', 'es'));
  });
});
