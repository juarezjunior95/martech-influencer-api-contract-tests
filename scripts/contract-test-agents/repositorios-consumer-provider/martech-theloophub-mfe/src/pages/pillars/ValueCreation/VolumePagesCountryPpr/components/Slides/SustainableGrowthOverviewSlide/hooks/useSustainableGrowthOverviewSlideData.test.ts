import { renderHook } from '@testing-library/react-hooks';

import { useSustainableGrowthOverviewSlideData } from './useSustainableGrowthOverviewSlideData';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
}));

describe('useSustainableGrowthOverviewSlideData', () => {
  const filters = {
    zone: 'ABI',
    country: 'BR',
    growth_lever: 'All',
    period: 'YTD',
    viewtype: 'country',
  };

  const kpiDtEnd = {
    finance: '2024-01-01',
    pos: '2024-01-01',
    market_share: '2024-01-01',
    power: '2024-01-01',
  };

  it('calls useBffData with value-creation_home and YTD subFilters', () => {
    mockUseBffData.mockReturnValue({
      loading: true,
      error: null,
      data: undefined,
    });

    renderHook(() =>
      useSustainableGrowthOverviewSlideData({ filters, kpiDtEnd }),
    );

    expect(mockUseBffData).toHaveBeenCalledWith({
      id: 'value-creation_home',
      kpiGroup: 'volume',
      subFilters: {
        ...filters,
        period: 'YTD',
        finance: { ...filters, period: 'YTD', dt_end: '2024-01-01' },
        pos: { ...filters, period: 'YTD', dt_end: '2024-01-01' },
        market_share: { ...filters, period: 'YTD', dt_end: '2024-01-01' },
        power: { ...filters, period: 'YTD', dt_end: '2024-01-01' },
      },
    });
  });

  it('returns empty data shape while loading', () => {
    mockUseBffData.mockReturnValue({
      loading: true,
      error: null,
      data: {
        'sustainable-growth-overview': { volume: {} },
        'strategy-drivers': [
          { chartHeader: { title: 'A' }, bigNumberData: [] },
        ],
        'strategy-drivers-growth-levers': { k: { title: 'K', rows: [] } },
      },
    });

    const { result } = renderHook(() =>
      useSustainableGrowthOverviewSlideData({ filters, kpiDtEnd }),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data.sustainableGrowthOverview).toEqual({});
    expect(result.current.data.strategyDrivers).toEqual([]);
    expect(result.current.data.growthLevers).toEqual({});
  });

  it('maps BFF payload when not loading', () => {
    const overview = {
      vol: { chartHeader: { title: 'V' }, bigNumberData: [] },
    };
    const drivers = [
      { chartHeader: { title: 'ABI Lovers', period: 'Q1' }, bigNumberData: [] },
    ];
    const levers = { superiorCore: { title: 'Superior Core', rows: [] } };

    mockUseBffData.mockReturnValue({
      loading: false,
      error: null,
      data: {
        'sustainable-growth-overview': overview,
        'strategy-drivers': drivers,
        'strategy-drivers-growth-levers': levers,
      },
    });

    const { result } = renderHook(() =>
      useSustainableGrowthOverviewSlideData({ filters, kpiDtEnd }),
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data.sustainableGrowthOverview).toEqual(overview);
    expect(result.current.data.strategyDrivers).toEqual(drivers);
    expect(result.current.data.growthLevers).toEqual(levers);
  });

  it('returns empty growth levers when payload is an array', () => {
    mockUseBffData.mockReturnValue({
      loading: false,
      error: null,
      data: {
        'sustainable-growth-overview': {},
        'strategy-drivers': [],
        'strategy-drivers-growth-levers': [],
      },
    });

    const { result } = renderHook(() =>
      useSustainableGrowthOverviewSlideData({ filters, kpiDtEnd }),
    );

    expect(result.current.data.growthLevers).toEqual({});
  });
});
