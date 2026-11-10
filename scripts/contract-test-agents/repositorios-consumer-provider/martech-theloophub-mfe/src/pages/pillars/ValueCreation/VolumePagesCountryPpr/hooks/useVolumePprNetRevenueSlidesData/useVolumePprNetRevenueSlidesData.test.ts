import { renderHook } from '@testing-library/react-hooks';

import { useVolumePprNetRevenueSlidesData } from './useVolumePprNetRevenueSlidesData';

const mockUseBffData = jest.fn();
const mockUsePerformanceToolData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
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

describe('useVolumePprNetRevenueSlidesData', () => {
  beforeEach(() => {
    mockUseBffData.mockReturnValue(idle);
    mockUsePerformanceToolData.mockReturnValue({});
  });

  it('sectionLoading is true when any BFF hook is loading', () => {
    mockUseBffData
      .mockReturnValueOnce(idle)
      .mockReturnValueOnce({ ...idle, loading: true })
      .mockReturnValue(idle);

    const { result } = renderHook(() => useVolumePprNetRevenueSlidesData('BR'));

    expect(result.current.sectionLoading).toBe(true);
  });

  it('sectionLoading is false when all BFF hooks are idle', () => {
    const { result } = renderHook(() => useVolumePprNetRevenueSlidesData('BR'));

    expect(result.current.sectionLoading).toBe(false);
  });

  it('requests the 4 net revenue BFF ids in order and passes country in waterfall calls', () => {
    renderHook(() => useVolumePprNetRevenueSlidesData('AR'));

    const calls = mockUseBffData.mock.calls.map(
      (c) =>
        c[0] as {
          id: string;
          subFilters: Record<string, unknown>;
        },
    );

    expect(calls.map((c) => c.id)).toEqual([
      'value-creation_performance-tool_drill-down_net-revenue_overtime-performance',
      'value-creation_performance-tool_drill-down_net-revenue_overtime-trends',
      'value-creation_performance-tool_drill-down_net-revenue_contribution',
      'value-creation_performance-tool_drill-down_net-revenue_contribution',
    ]);
    expect(calls[2].subFilters.country).toBe('AR');
    expect(calls[2].subFilters.timeframe).toBe('YTD');
    expect(calls[3].subFilters.country).toBe('AR');
    expect(calls[3].subFilters.timeframe).toBe('MTD');
  });
});
