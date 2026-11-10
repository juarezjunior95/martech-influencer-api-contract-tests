import { renderHook } from '@testing-library/react-hooks';

import { useAISummaryFilters } from './useAISummaryFilters';

const mockUsePageFilterApplied = jest.fn();

jest.mock('hooks', () => ({
  usePageFilterApplied: (...args: unknown[]) =>
    mockUsePageFilterApplied(...args),
}));

describe('useAISummaryFilters', () => {
  const defaultParams = {
    pageName: 'test-page',
    summaryPageIdentifier: 'pillar/page/tab',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        time_frame: 'YTD',
        pos_periods: 'Monthly',
        country: 'BR',
        'ytd-month': '2024-06',
        sub_scopes: 'sub-scope-value',
        scopes: 'scope-value',
      },
    });
  });

  it('should call usePageFilterApplied with pageName', () => {
    renderHook(() => useAISummaryFilters(defaultParams));
    expect(mockUsePageFilterApplied).toHaveBeenCalledWith('test-page');
  });

  it('should extract main filters from applied', () => {
    const { result } = renderHook(() => useAISummaryFilters(defaultParams));

    expect(result.current.filters).toEqual(
      expect.objectContaining({
        timeframe: 'YTD',
        timeperiod: 'Monthly',
        country: 'BR',
        period: '2024-06',
      }),
    );
  });

  it('should include page and dt_end in filters', () => {
    const { result } = renderHook(() => useAISummaryFilters(defaultParams));

    expect(result.current.filters.page).toBe('pillar/page/tab');
    expect(result.current.filters.dt_end).toBeNull();
  });

  it('should merge subFilters into filters', () => {
    const { result } = renderHook(() =>
      useAISummaryFilters({
        ...defaultParams,
        subFilters: {
          cohort: 'All',
          price_segment: 'Premium Co',
        },
      }),
    );

    expect(result.current.filters).toEqual(
      expect.objectContaining({
        cohort: 'All',
        price_segment: 'Premium Co',
        timeframe: 'YTD',
        country: 'BR',
      }),
    );
  });

  it('should return hasAppliedFilters as true when filters are applied', () => {
    const { result } = renderHook(() => useAISummaryFilters(defaultParams));
    expect(result.current.hasAppliedFilters).toBe(true);
  });

  it('should return hasAppliedFilters as false when applied is empty', () => {
    mockUsePageFilterApplied.mockReturnValue({ applied: {} });

    const { result } = renderHook(() => useAISummaryFilters(defaultParams));
    expect(result.current.hasAppliedFilters).toBe(false);
  });

  it('should return hasAppliedFilters as false when applied is null', () => {
    mockUsePageFilterApplied.mockReturnValue({ applied: null });

    const { result } = renderHook(() => useAISummaryFilters(defaultParams));
    expect(result.current.hasAppliedFilters).toBe(false);
  });

  it('should return empty main filters when applied is null', () => {
    mockUsePageFilterApplied.mockReturnValue({ applied: null });

    const { result } = renderHook(() => useAISummaryFilters(defaultParams));

    expect(result.current.filters).toEqual({
      scope: undefined,
      page: 'pillar/page/tab',
      dt_end: null,
      dt_ini: null,
    });
  });

  it('should allow subFilters to override main filter keys', () => {
    const { result } = renderHook(() =>
      useAISummaryFilters({
        ...defaultParams,
        subFilters: { media_spend: 'gross' },
      }),
    );

    expect(result.current.filters).toEqual(
      expect.objectContaining({
        media_spend: 'gross',
        timeframe: 'YTD',
      }),
    );
  });
});
