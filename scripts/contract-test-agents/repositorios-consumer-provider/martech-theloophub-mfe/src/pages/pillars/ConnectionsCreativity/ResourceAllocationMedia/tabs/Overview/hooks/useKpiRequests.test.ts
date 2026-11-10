import { renderHook } from '@testing-library/react-hooks';

import { useKpiRequests } from './useKpiRequests';

const mockChartsData = {
  mediaSpend: { data: null, loading: false, error: null },
  megaBrands: { data: null, loading: false, error: null },
  campaigns: { data: null, loading: false, error: null },
  resourceAllocation: { data: null, loading: false, error: null },
};

const mockTableData = { data: null, loading: false, error: null };
const mockRankingData = { data: null, loading: false, error: null };

const mockUseOverviewCharts = jest.fn(() => mockChartsData);
const mockUseOverviewTable = jest.fn((_subfilter: string) => mockTableData);
const mockUseOverviewRanking = jest.fn((_subfilter: string) => mockRankingData);

jest.mock('./useOverviewCharts', () => ({
  useOverviewCharts: () => mockUseOverviewCharts(),
}));

jest.mock('./useOverviewTable', () => ({
  useOverviewTable: (subfilter: string) => mockUseOverviewTable(subfilter),
}));

jest.mock('./useOverviewRanking', () => ({
  useOverviewRanking: (subfilter: string) => mockUseOverviewRanking(subfilter),
}));

describe('useKpiRequests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls all sub-hooks and returns correct structure', () => {
    const { result } = renderHook(() => useKpiRequests('media_spend'));

    expect(mockUseOverviewCharts).toHaveBeenCalledTimes(1);
    expect(mockUseOverviewTable).toHaveBeenCalledWith('media_spend');
    expect(mockUseOverviewRanking).toHaveBeenCalledWith('media_spend');

    expect(result.current).toEqual({
      charts: mockChartsData,
      table: mockTableData,
      ranking: mockRankingData,
    });
  });

  it('returns charts, table, and ranking with populated data', () => {
    mockUseOverviewCharts.mockReturnValue({
      mediaSpend: { data: 'ms', loading: false, error: null },
      megaBrands: { data: 'mb', loading: false, error: null },
      campaigns: { data: 'cm', loading: false, error: null },
      resourceAllocation: { data: 'ra', loading: false, error: null },
    });
    mockUseOverviewTable.mockReturnValue({
      data: 'tbl',
      loading: false,
      error: null,
    });
    mockUseOverviewRanking.mockReturnValue({
      data: 'rnk',
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKpiRequests('media_spend'));

    expect(result.current.charts.mediaSpend.data).toBe('ms');
    expect(result.current.table.data).toBe('tbl');
    expect(result.current.ranking.data).toBe('rnk');
  });

  it('passes subfilter to table and ranking hooks on rerender', () => {
    const { rerender } = renderHook(
      ({ subfilter }) => useKpiRequests(subfilter),
      { initialProps: { subfilter: 'media_spend' } },
    );

    expect(mockUseOverviewTable).toHaveBeenCalledWith('media_spend');
    expect(mockUseOverviewRanking).toHaveBeenCalledWith('media_spend');

    mockUseOverviewTable.mockClear();
    mockUseOverviewRanking.mockClear();
    rerender({ subfilter: 'megabrands' });

    expect(mockUseOverviewTable).toHaveBeenCalledWith('megabrands');
    expect(mockUseOverviewRanking).toHaveBeenCalledWith('megabrands');
  });
});
