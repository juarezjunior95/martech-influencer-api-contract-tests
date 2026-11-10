import { renderHook } from '@testing-library/react-hooks';
import { DEFAULT_ENDPOINTS } from 'pages/pillars/ValueCreation/VolumePages/config/api';

import { useVolumePprVolumeSlidesData } from './useVolumePprVolumeSlidesData';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
}));

const idle = {
  data: undefined,
  loading: false,
  error: null,
};

describe('useVolumePprVolumeSlidesData', () => {
  beforeEach(() => {
    mockUseBffData.mockReturnValue(idle);
  });

  it('calls useBffData for country and global volume with correct skip flags when not global zone', () => {
    renderHook(() => useVolumePprVolumeSlidesData(false, 'BR'));

    expect(mockUseBffData).toHaveBeenCalledTimes(2);
    expect(mockUseBffData).toHaveBeenNthCalledWith(1, {
      id: DEFAULT_ENDPOINTS.country,
      kpiGroup: 'volume',
      subFilters: {
        country: 'BR',
        kpi: 'volume',
      },
      skipRequest: false,
    });
    expect(mockUseBffData).toHaveBeenNthCalledWith(2, {
      id: DEFAULT_ENDPOINTS.global,
      kpiGroup: 'volume',
      subFilters: {
        kpi: 'volume',
      },
      skipMainFilters: true,
      skipRequest: true,
    });
  });

  it('calls useBffData for country and global volume with correct skip flags when global zone', () => {
    renderHook(() => useVolumePprVolumeSlidesData(true, 'BR'));

    expect(mockUseBffData).toHaveBeenCalledTimes(2);
    expect(mockUseBffData).toHaveBeenNthCalledWith(1, {
      id: DEFAULT_ENDPOINTS.country,
      kpiGroup: 'volume',
      subFilters: {
        country: 'BR',
        kpi: 'volume',
      },
      skipRequest: true,
    });
    expect(mockUseBffData).toHaveBeenNthCalledWith(2, {
      id: DEFAULT_ENDPOINTS.global,
      kpiGroup: 'volume',
      subFilters: {
        kpi: 'volume',
      },
      skipMainFilters: true,
      skipRequest: false,
    });
  });

  it('reflects loading from the active country request when not global zone', () => {
    mockUseBffData
      .mockReturnValueOnce({ ...idle, loading: true })
      .mockReturnValue(idle);

    const { result } = renderHook(() =>
      useVolumePprVolumeSlidesData(false, 'BR'),
    );

    expect(result.current.sectionLoading).toBe(true);
  });

  it('maps the country payload (non-global) reading line-chart and waterfall keys', () => {
    const lineChart = {
      datasets: [{ data: [1, 2] }],
      formattedData: [['1', '2']],
      labels: ['a', 'b'],
    };
    const topWaterfall = {
      period: 'YTD-CUSTOM',
      values: [10, 20],
      labels: ['x', 'y'],
      brandsAvatar: { data: ['avatar'] },
      comparisonLine: { data: [1] },
      legend: [{ label: 'L', shape: 'square' }],
      formattedData: [['10']],
      empty: false,
    };
    mockUseBffData.mockReturnValueOnce({
      ...idle,
      data: {
        'big-numbers': [{ id: 'bn' }],
        'line-chart': lineChart,
        portfolio: { header: [{ id: 'h' }], rows: [['r']] },
        'growth-levers': { header: [], rows: [] },
        'brands-volume-YTD': topWaterfall,
        'brands-volume-MTD': { period: 'MTD', empty: true },
      },
    });

    const { result } = renderHook(() =>
      useVolumePprVolumeSlidesData(false, 'BR'),
    );

    expect(result.current.volumeSlideContentData.bigNumbersKpiData).toEqual([
      { id: 'bn' },
    ]);
    expect(result.current.volumeSlideContentData.lineChartKpiData).toEqual(
      lineChart,
    );
    expect(result.current.volumeSlideContentData.portfolioTableKpiData).toEqual(
      {
        header: [{ id: 'h' }],
        rows: [['r']],
      },
    );
    expect(result.current.volumeSlideContentData.topWaterfallKpiData).toEqual(
      topWaterfall,
    );
    expect(result.current.volumeSlideContentData.marketsTableKpiData).toEqual({
      header: [],
      rows: [],
    });
  });

  it('reads global keys (big-numbers-global, line-chart-global, must-win-markets) when isGlobalZone=true', () => {
    mockUseBffData.mockReturnValueOnce({ ...idle }).mockReturnValueOnce({
      ...idle,
      data: {
        'big-numbers-global': [{ id: 'g-bn' }],
        'line-chart-global': {
          datasets: [],
          formattedData: [],
          labels: ['g'],
        },
        portfolio: { header: [{ id: 'gh' }], rows: [] },
        'growth-levers-priorities': { header: [], rows: [] },
        'must-win-markets': { header: [{ id: 'mw' }], rows: [] },
      },
    });

    const { result } = renderHook(() =>
      useVolumePprVolumeSlidesData(true, 'BR'),
    );

    expect(result.current.volumeSlideContentData.bigNumbersKpiData).toEqual([
      { id: 'g-bn' },
    ]);
    expect(
      result.current.volumeSlideContentData.lineChartKpiData.labels,
    ).toEqual(['g']);
    expect(result.current.volumeSlideContentData.marketsTableKpiData).toEqual({
      header: [{ id: 'mw' }],
      rows: [],
    });
    expect(
      result.current.volumeSlideContentData.topWaterfallKpiData.empty,
    ).toBe(true);
    expect(
      result.current.volumeSlideContentData.topWaterfallKpiData.period,
    ).toBe('YTD');
  });

  it('falls back to empty shapes when payload fields fail the type guards', () => {
    mockUseBffData.mockReturnValueOnce({
      ...idle,
      data: {
        'big-numbers': 'not-an-array',
        'line-chart': { datasets: 'bad', formattedData: 'bad', labels: 'bad' },
        portfolio: { header: 'no', rows: 'no' },
        'brands-volume-YTD': 42,
      },
    });

    const { result } = renderHook(() =>
      useVolumePprVolumeSlidesData(false, 'BR'),
    );

    expect(result.current.volumeSlideContentData.bigNumbersKpiData).toEqual([]);
    expect(result.current.volumeSlideContentData.lineChartKpiData.empty).toBe(
      true,
    );
    expect(result.current.volumeSlideContentData.portfolioTableKpiData).toEqual(
      { header: [], rows: [] },
    );
    expect(
      result.current.volumeSlideContentData.topWaterfallKpiData.empty,
    ).toBe(true);
  });
});
