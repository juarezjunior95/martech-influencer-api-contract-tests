import { renderHook } from '@testing-library/react-hooks';

import { useVolumePprResourceAllocationOverview } from './useVolumePprResourceAllocationOverview';

const mockUseBffData = jest.fn();
const mockApplyChartsConfigs = jest.fn();
const mockApplyRankingConfigs = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
}));

jest.mock(
  'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/utils/chartsUtils',
  () => ({
    applyChartsConfigs: (...args: unknown[]) => mockApplyChartsConfigs(...args),
  }),
);

jest.mock(
  'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/utils/rankingUtils',
  () => ({
    applyRankingConfigs: (...args: unknown[]) =>
      mockApplyRankingConfigs(...args),
  }),
);

const BFF_IDS = {
  mediaSpend:
    'connections-and-creativity_resource-allocation-media_overview_media-spend',
  megaBrands:
    'connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa',
  campaigns:
    'connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa',
  resourceAllocation:
    'connections-and-creativity_resource-allocation-media_overview_non-working-money',
  ranking:
    'connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa-ranking',
} as const;

const idleBff = {
  data: null,
  loading: false,
  error: null as Error | null,
  refetch: jest.fn(),
};

/** Normalized BFF `data`: component key matches the view `id`. */
const bffViewData = (
  viewId: string,
  componentPayload: Record<string, unknown>,
) => ({
  data: { [viewId]: componentPayload },
  loading: false,
  error: null as Error | null,
  refetch: jest.fn(),
});

describe('useVolumePprResourceAllocationOverview', () => {
  beforeEach(() => {
    mockUseBffData.mockReturnValue(idleBff);
  });

  it('requests overview BFF views and ranking with expected ids and group', () => {
    renderHook(() => useVolumePprResourceAllocationOverview());

    const calls = mockUseBffData.mock.calls.map(
      (call) =>
        call[0] as { id: string; kpiGroup?: string; subFilters?: object },
    );

    expect(calls.map((c) => c.id)).toEqual([
      BFF_IDS.mediaSpend,
      BFF_IDS.megaBrands,
      BFF_IDS.campaigns,
      BFF_IDS.resourceAllocation,
      BFF_IDS.ranking,
    ]);

    expect(calls.every((c) => c.kpiGroup === 'media')).toBe(true);

    expect(calls[4].subFilters).toEqual({ kpi_name: 'megabrands' });
  });

  it('returns null overview when all chart BFF payloads are empty', () => {
    mockUseBffData.mockReturnValue({
      data: {},
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    const { result } = renderHook(() =>
      useVolumePprResourceAllocationOverview(),
    );

    expect(result.current.overviewData).toBeNull();
    expect(result.current.overviewLoading).toBe(false);
    expect(result.current.overviewError).toBeNull();
    expect(result.current.activeRankingSubfilter).toBe('megabrands');
  });

  it('sets overviewLoading when any overview chart request is loading', () => {
    mockUseBffData.mockImplementation((props: { id: string }) => {
      if (props.id === BFF_IDS.campaigns) {
        return { ...idleBff, loading: true };
      }
      return { ...idleBff, data: {} };
    });

    const { result } = renderHook(() =>
      useVolumePprResourceAllocationOverview(),
    );

    expect(result.current.overviewLoading).toBe(true);
  });

  it('surfaces the first overview chart error', () => {
    const err = new Error('bff failed');
    mockUseBffData.mockImplementation((props: { id: string }) => {
      if (props.id === BFF_IDS.megaBrands) {
        return { ...idleBff, data: {}, error: err };
      }
      return { ...idleBff, data: {} };
    });

    const { result } = renderHook(() =>
      useVolumePprResourceAllocationOverview(),
    );

    expect(result.current.overviewError).toBe(err);
  });

  it('merges BFF fields into overview keys and applies chart configs to non-empty sections', () => {
    const chartSection = { title: 'x' };
    mockUseBffData.mockImplementation((props: { id: string }) => {
      switch (props.id) {
        case BFF_IDS.mediaSpend:
          return bffViewData(BFF_IDS.mediaSpend, {
            media_spend_index: chartSection,
          });
        case BFF_IDS.megaBrands:
          return bffViewData(BFF_IDS.megaBrands, {
            megabrands_qwoa: { empty: true },
          });
        default:
          return { ...idleBff, data: {} };
      }
    });

    const { result } = renderHook(() =>
      useVolumePprResourceAllocationOverview(),
    );

    expect(result.current.overviewData).toEqual({
      media_spend: chartSection,
      mega_brands: { empty: true },
    });
    expect(mockApplyChartsConfigs).toHaveBeenCalledTimes(1);
    expect(mockApplyChartsConfigs).toHaveBeenCalledWith(chartSection);
  });

  it('unwraps nested BFF card payload so overview cards expose total_per_year_full at root', () => {
    const innerChart = {
      total_per_year_full: {
        datasets: [{ data: [1, 2] }],
        labels: ['a', 'b'],
      },
    };
    mockUseBffData.mockImplementation((props: { id: string }) => {
      if (props.id === BFF_IDS.mediaSpend) {
        return bffViewData(BFF_IDS.mediaSpend, {
          media_spend_index: { media_spend: innerChart },
        });
      }
      return { ...idleBff, data: {} };
    });

    const { result } = renderHook(() =>
      useVolumePprResourceAllocationOverview(),
    );

    expect(result.current.overviewData).toEqual({
      media_spend: innerChart,
    });
  });

  it('maps megabrands_qwoa_ranking for ranking and applies ranking configs', () => {
    const rankingSection = {
      datasets: [{ type: 'bar' as const, data: [1], label: 'Megabrands' }],
      labels: ['A'],
    };
    mockUseBffData.mockImplementation((props: { id: string }) => {
      if (props.id === BFF_IDS.ranking) {
        return bffViewData(BFF_IDS.ranking, {
          megabrands_qwoa_ranking: {
            megabrands: rankingSection,
          },
        });
      }
      return { ...idleBff, data: {} };
    });

    const { result } = renderHook(() =>
      useVolumePprResourceAllocationOverview(),
    );

    expect(result.current.rankingKpiData).toEqual({
      megabrands: rankingSection,
    });
    expect(mockApplyRankingConfigs).toHaveBeenCalledWith(rankingSection);
  });

  it('wraps a single ranking blob under the active subfilter when BFF omits the key', () => {
    const rankingSection = { title: 'only' };
    mockUseBffData.mockImplementation((props: { id: string }) => {
      if (props.id === BFF_IDS.ranking) {
        return bffViewData(BFF_IDS.ranking, {
          megabrands_qwoa_ranking: rankingSection,
        });
      }
      return { ...idleBff, data: {} };
    });

    const { result } = renderHook(() =>
      useVolumePprResourceAllocationOverview(),
    );

    expect(result.current.rankingKpiData).toEqual({
      megabrands: rankingSection,
    });
  });
});
