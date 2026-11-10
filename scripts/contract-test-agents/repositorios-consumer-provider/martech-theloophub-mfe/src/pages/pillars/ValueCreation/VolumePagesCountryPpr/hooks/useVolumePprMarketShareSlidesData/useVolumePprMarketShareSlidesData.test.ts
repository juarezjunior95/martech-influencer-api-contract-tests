import { renderHook } from '@testing-library/react-hooks';

import { useVolumePprMarketShareSlidesData } from './useVolumePprMarketShareSlidesData';

const mockUseBffData = jest.fn();
const mockUsePerformanceToolData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
  usePageFilterApplied: jest.fn(() => ({
    isGlobalZone: false,
  })),
}));

jest.mock('../../../PerformanceTool/hooks', () => ({
  usePerformanceToolData: (...args: unknown[]) =>
    mockUsePerformanceToolData(...args),
}));

const idle = {
  data: undefined,
  loading: false,
  error: null,
};

describe('useVolumePprMarketShareSlidesData', () => {
  beforeEach(() => {
    mockUseBffData.mockReturnValue(idle);
    mockUsePerformanceToolData.mockReturnValue({});
  });

  it('sectionLoading is true when any BFF hook is loading', () => {
    mockUseBffData.mockReturnValue({ ...idle, loading: true });

    const { result } = renderHook(() =>
      useVolumePprMarketShareSlidesData(false, 'BR'),
    );

    expect(result.current.sectionLoading).toBe(true);
  });

  it('sectionLoading is false when all BFF hooks are idle', () => {
    const { result } = renderHook(() =>
      useVolumePprMarketShareSlidesData(false, 'BR'),
    );

    expect(result.current.sectionLoading).toBe(false);
  });

  it('requests the 4 market share BFF ids and toggles waterfall_filter by isGlobalZone', () => {
    renderHook(() => useVolumePprMarketShareSlidesData(true, 'AR'));

    const calls = mockUseBffData.mock.calls.map(
      (c) =>
        c[0] as {
          id: string;
          subFilters: Record<string, unknown>;
        },
    );

    expect(calls.map((c) => c.id)).toEqual([
      'value-creation_performance-tool_drill-down_non-finance_market-share_overtime-performance',
      'value-creation_performance-tool_drill-down_non-finance_market-share_overtime-trends',
      'value-creation_performance-tool_drill-down_non-finance_market-share_contribution',
      'value-creation_performance-tool_drill-down_non-finance_market-share_contribution',
    ]);
    expect(calls[2].subFilters.waterfall_filter).toBe('');
    expect(calls[3].subFilters.waterfall_filter).toBe('');
    expect(calls[2].subFilters.timeframe).toBe('YTD');
    expect(calls[3].subFilters.timeframe).toBe('MTD');

    mockUseBffData.mockClear();

    renderHook(() => useVolumePprMarketShareSlidesData(false, 'AR'));
    const callsCountry = mockUseBffData.mock.calls.map(
      (c) => c[0] as { subFilters: Record<string, unknown> },
    );
    expect(callsCountry[2].subFilters.waterfall_filter).toBe('brand');
    expect(callsCountry[3].subFilters.waterfall_filter).toBe('brand');
  });
});
