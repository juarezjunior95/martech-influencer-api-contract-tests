import { renderHook } from '@testing-library/react-hooks';

import { useAISummaryData } from './useAISummaryData';

const mockUseBffData = jest.fn();
const mockUseAISummaryFilters = jest.fn();
const mockFormatMessage = jest.fn(
  (msg: { id: string }) => `translated:${msg.id}`,
);

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: mockFormatMessage }),
}));

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
}));

jest.mock('../useAISummaryFilter/useAISummaryFilters', () => ({
  useAISummaryFilters: (...args: unknown[]) => mockUseAISummaryFilters(...args),
}));

describe('useAISummaryData', () => {
  const defaultParams = {
    pageName: 'test-page',
    kpiGroup: 'volume' as const,
    summaryPageIdentifier: 'pillar/page/tab',
  };

  const defaultFilters = {
    timeframe: 'YTD',
    country: 'BR',
    page: 'pillar/page/tab',
    dt_end: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAISummaryFilters.mockReturnValue({
      filters: defaultFilters,
      hasAppliedFilters: true,
      validSubFilters: true,
    });
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('should pass filter params to useAISummaryFilters', () => {
    renderHook(() => useAISummaryData(defaultParams));

    expect(mockUseAISummaryFilters).toHaveBeenCalledWith({
      pageName: 'test-page',
      summaryPageIdentifier: 'pillar/page/tab',
      subFilters: null,
    });
  });

  it('should pass subFilters to useAISummaryFilters', () => {
    renderHook(() =>
      useAISummaryData({
        ...defaultParams,
        subFilters: { cohort: 'All' },
      }),
    );

    expect(mockUseAISummaryFilters).toHaveBeenCalledWith(
      expect.objectContaining({ subFilters: { cohort: 'All' } }),
    );
  });

  it('should call useBffData with correct params', () => {
    renderHook(() => useAISummaryData(defaultParams));

    expect(mockUseBffData).toHaveBeenCalledWith({
      id: 'ai-summary_ai-summary',
      kpiGroup: 'volume',
      skipMainFilters: true,
      subFilters: defaultFilters,
      skipRequest: false,
    });
  });

  it('should skip request when hasAppliedFilters is false', () => {
    mockUseAISummaryFilters.mockReturnValue({
      filters: {},
      hasAppliedFilters: false,
    });

    renderHook(() => useAISummaryData(defaultParams));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({ skipRequest: true }),
    );
  });

  it('should skip request when summaryPageIdentifier is empty', () => {
    renderHook(() =>
      useAISummaryData({ ...defaultParams, summaryPageIdentifier: '' }),
    );

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({ skipRequest: true }),
    );
  });

  it('should return loading state from useBffData', () => {
    mockUseBffData.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const { result } = renderHook(() => useAISummaryData(defaultParams));

    expect(result.current.loading).toBe(true);
  });

  it('should return summary data when response has resume', () => {
    mockUseBffData.mockReturnValue({
      data: {
        'ai-summary': {
          resume: 'AI insights here',
          seeMore: 'More details',
          trend: 'positive',
        },
      },
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useAISummaryData(defaultParams));

    expect(result.current.summary).toEqual({
      resume: 'AI insights here',
      seeMore: 'More details',
      trend: 'positive',
    });
  });

  it('should return summary data when response has only seeMore', () => {
    mockUseBffData.mockReturnValue({
      data: {
        'ai-summary': {
          seeMore: 'Detailed content',
          trend: 'negative',
        },
      },
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useAISummaryData(defaultParams));

    expect(result.current.summary).toEqual({
      seeMore: 'Detailed content',
      trend: 'negative',
    });
  });

  it('should return empty summary when data is null', () => {
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useAISummaryData(defaultParams));

    expect(result.current.summary).toEqual({
      resume: 'translated:AISummary.MainPages.empty',
      empty: true,
    });
  });

  it('should return empty summary when response has no resume or seeMore', () => {
    mockUseBffData.mockReturnValue({
      data: { 'ai-summary': { trend: 'positive' } },
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useAISummaryData(defaultParams));

    expect(result.current.summary).toEqual({
      resume: 'translated:AISummary.MainPages.empty',
      empty: true,
    });
  });

  it('should return alertType "AI" when summary is not empty', () => {
    mockUseBffData.mockReturnValue({
      data: {
        'ai-summary': { resume: 'Summary', trend: 'positive' },
      },
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useAISummaryData(defaultParams));

    expect(result.current.alertType).toBe('AI');
  });

  it('should return alertType "neutral" when summary is empty', () => {
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useAISummaryData(defaultParams));

    expect(result.current.alertType).toBe('neutral');
  });
});
