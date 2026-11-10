import { renderHook } from '@testing-library/react-hooks';

import { useVolumePprBrandPowerSlidesData } from './useVolumePprBrandPowerSlidesData';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
}));

const bffIdle = {
  data: null,
  loading: false,
  error: null as Error | null,
  refetch: jest.fn(),
};

describe('useVolumePprBrandPowerSlidesData', () => {
  beforeEach(() => {
    mockUseBffData.mockReturnValue(bffIdle);
  });

  it('combines loading from BFF hooks', () => {
    mockUseBffData.mockReturnValueOnce({ ...bffIdle, loading: true });

    const { result } = renderHook(() => useVolumePprBrandPowerSlidesData());

    expect(result.current.sectionLoading).toBe(true);
  });

  it('loads countryData from BFF overview endpoint', () => {
    renderHook(() => useVolumePprBrandPowerSlidesData());

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'portfolio-brand_brand-power-book_overview_power-book-overview',
        kpiGroup: 'power',
        subFilters: { page_filter: 'All' },
      }),
    );
    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'portfolio-brand_brand-power-book_overview_summary_summary-power',
        kpiGroup: 'power',
        subFilters: { page_filter: 'All' },
      }),
    );
    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'portfolio-brand_brand-power-book_overview_summary_summary-breakdown',
        kpiGroup: 'power',
        subFilters: {
          page_filter: 'All',
          breakdown_filter: 'TT ABI Portfolio',
        },
      }),
    );
    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'portfolio-brand_brand-power-book_overview_summary_summary-breakdown',
        kpiGroup: 'power',
        subFilters: {
          page_filter: 'All',
          breakdown_filter: 'TT ABI Segment',
        },
      }),
    );
  });

  it('maps breakdownSegmentsData to Brands legacy shape', () => {
    const abiOverview = {
      yearPowerVsAc: { labels: ['ABI'] },
      trendOverTime: { labels: ['ABI trend'] },
    };
    const megabrandsOverview = {
      yearPowerVsAc: { labels: ['Megabrands'] },
      trendOverTime: { labels: ['Megabrands trend'] },
    };
    const summaryForPower = {
      summaryPowerBySegmentPerformance: { rows: [[{ id: 'segment' }]] },
      summaryPowerByPortfolioPerformance: { rows: [[{ id: 'portfolio' }]] },
    };
    const portfolioBreakdown = {
      summaryPowerBreakdown: { rows: [[{ id: 'portfolio-brand' }]] },
      summaryPowerBreakdownComp: { rows: [[{ id: 'portfolio-brand-comp' }]] },
    };
    const segmentBreakdown = {
      summaryPowerBreakdown: { rows: [[{ id: 'segment-brand' }]] },
      summaryPowerBreakdownComp: { rows: [[{ id: 'segment-brand-comp' }]] },
    };

    mockUseBffData
      .mockReturnValueOnce({ ...bffIdle, data: abiOverview })
      .mockReturnValueOnce({ ...bffIdle, data: megabrandsOverview })
      .mockReturnValueOnce({ ...bffIdle, data: summaryForPower })
      .mockReturnValueOnce({
        ...bffIdle,
        data: portfolioBreakdown,
      });
    mockUseBffData.mockReturnValueOnce({ ...bffIdle, data: segmentBreakdown });

    const { result } = renderHook(() => useVolumePprBrandPowerSlidesData());

    expect(
      result.current.countryData.data?.Brands?.[
        'owr_brand-power-book_summary-power_by-brand-breakdown'
      ]?.table,
    ).toEqual(portfolioBreakdown.summaryPowerBreakdown);
    expect(
      result.current.breakdownSegmentsData.data?.Brands?.[
        'owr_brand-power-book_summary-power_by-brand-breakdown'
      ]?.table,
    ).toEqual(segmentBreakdown.summaryPowerBreakdown);
  });

  it('filters ABI breakdown rows keeping only rows with non-empty metric chartData', () => {
    const rowGood = {
      meaning_ac: { chartData: { data: [1] } },
      difference_ac: { chartData: { data: [2] } },
      salience_ac: { chartData: { data: [3] } },
      brand: 'good',
    };
    const rowMissing = {
      meaning_ac: { chartData: { data: [] } },
      difference_ac: { chartData: { data: [2] } },
      salience_ac: { chartData: { data: [3] } },
      brand: 'missing',
    };
    const portfolioBreakdown = {
      summaryPowerBreakdown: {
        header: [{ id: 'h' }],
        rows: [[rowGood, rowMissing]],
      },
      summaryPowerBreakdownComp: { header: [], rows: [] },
    };

    mockUseBffData
      .mockReturnValueOnce({ ...bffIdle })
      .mockReturnValueOnce({ ...bffIdle })
      .mockReturnValueOnce({ ...bffIdle })
      .mockReturnValueOnce({ ...bffIdle, data: portfolioBreakdown });

    const { result } = renderHook(() => useVolumePprBrandPowerSlidesData());

    const filtered =
      result.current.countryData.data?.Brands?.[
        'owr_brand-power-book_summary-power_by-brand-breakdown'
      ]?.table;
    expect(filtered.header).toEqual([{ id: 'h' }]);
    expect(filtered.rows).toHaveLength(1);
    expect(filtered.rows[0]).toHaveLength(1);
    expect(filtered.rows[0][0]).toBe(rowGood);
  });

  it('preserves the breakdown shape when summaryPowerBreakdown lacks header/rows arrays', () => {
    mockUseBffData
      .mockReturnValueOnce({ ...bffIdle })
      .mockReturnValueOnce({ ...bffIdle })
      .mockReturnValueOnce({ ...bffIdle })
      .mockReturnValueOnce({
        ...bffIdle,
        data: { summaryPowerBreakdown: 'not-a-table' },
      });

    const { result } = renderHook(() => useVolumePprBrandPowerSlidesData());

    expect(
      result.current.countryData.data?.Brands?.[
        'owr_brand-power-book_summary-power_by-brand-breakdown'
      ]?.table,
    ).toBe('not-a-table');
  });

  it('refetch dispatches all 4 underlying BFF refetches in parallel', async () => {
    const overviewAbi = { ...bffIdle, refetch: jest.fn().mockResolvedValue(1) };
    const overviewMega = {
      ...bffIdle,
      refetch: jest.fn().mockResolvedValue(2),
    };
    const summary = { ...bffIdle, refetch: jest.fn().mockResolvedValue(3) };
    const portfolioBreakdown = {
      ...bffIdle,
      refetch: jest.fn().mockResolvedValue(4),
    };
    mockUseBffData
      .mockReturnValueOnce(overviewAbi)
      .mockReturnValueOnce(overviewMega)
      .mockReturnValueOnce(summary)
      .mockReturnValueOnce(portfolioBreakdown);

    const { result } = renderHook(() => useVolumePprBrandPowerSlidesData());

    await result.current.countryData.refetch();

    expect(overviewAbi.refetch).toHaveBeenCalledTimes(1);
    expect(overviewMega.refetch).toHaveBeenCalledTimes(1);
    expect(summary.refetch).toHaveBeenCalledTimes(1);
    expect(portfolioBreakdown.refetch).toHaveBeenCalledTimes(1);
  });
});
