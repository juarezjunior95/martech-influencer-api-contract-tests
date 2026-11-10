import { getFAQsService } from 'services/InsightsCopilotService';

import getFAQsUseCase from './getFAQsUseCase';

jest.mock('services/InsightsCopilotService', () => ({
  getFAQsService: jest.fn(),
}));

const mockService = getFAQsService as jest.MockedFunction<
  typeof getFAQsService
>;

const createMockFAQ = (id: string, query: string, answer = 'Answer') => ({
  id,
  query,
  answer,
  project_key: 'project-abc',
  language: 'pt',
  group_id: `group-${id}`,
  created_at: '2021-01-01',
  updated_at: '2021-01-01',
});

const defaultInput = {
  projectKey: 'project-abc',
  language: 'pt',
};

describe('getFAQsUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call service with correct parameters', async () => {
    const mockResponse = [
      createMockFAQ('1', 'Question 1', 'Answer 1'),
      createMockFAQ('2', 'Question 2', 'Answer 2'),
    ];

    mockService.mockResolvedValue(mockResponse);

    const result = await getFAQsUseCase(defaultInput);

    expect(mockService).toHaveBeenCalledWith(defaultInput);
    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '2' }),
      ]),
    );
  });

  it('should use "en" as default language when not provided', async () => {
    mockService.mockResolvedValue([]);

    await getFAQsUseCase({
      projectKey: 'project-abc',
    });

    expect(mockService).toHaveBeenCalledWith({
      projectKey: 'project-abc',
      language: 'en',
    });
  });

  it('should filter FAQs with empty query', async () => {
    const mockResponse = [
      createMockFAQ('1', 'Valid question'),
      createMockFAQ('2', ''),
      createMockFAQ('3', 'Another valid question'),
    ];

    mockService.mockResolvedValue(mockResponse);

    const result = await getFAQsUseCase({
      projectKey: 'project-abc',
    });

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1' }),
        expect.objectContaining({ id: '3' }),
      ]),
    );
  });

  it('should filter FAQs with query having only spaces', async () => {
    const mockResponse = [
      createMockFAQ('1', 'Valid question'),
      createMockFAQ('2', '   '),
      createMockFAQ('3', 'Another valid'),
    ];

    mockService.mockResolvedValue(mockResponse);

    const result = await getFAQsUseCase({
      projectKey: 'project-abc',
    });

    expect(result).toHaveLength(2);
    expect(result).not.toContainEqual(expect.objectContaining({ id: '2' }));
  });

  it('should return empty array when all FAQs have invalid query', async () => {
    const mockResponse = [
      createMockFAQ('1', '', 'Answer 1'),
      createMockFAQ('2', '   ', 'Answer 2'),
    ];

    mockService.mockResolvedValue(mockResponse);

    const result = await getFAQsUseCase({
      projectKey: 'project-abc',
    });

    expect(result).toEqual([]);
  });

  it('should return empty array when service returns empty', async () => {
    mockService.mockResolvedValue([]);

    const result = await getFAQsUseCase({
      projectKey: 'project-abc',
    });

    expect(result).toEqual([]);
  });

  it('should accept FAQs with valid query after trim', async () => {
    const mockResponse = [
      createMockFAQ('1', '  Question with spaces  '),
      createMockFAQ('2', '   '),
    ];

    mockService.mockResolvedValue(mockResponse);

    const result = await getFAQsUseCase({
      projectKey: 'project-abc',
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockResponse[0]);
  });
});
