import { renderHook } from '@testing-library/react-hooks';

import { useVolumePprSustainableGrowthOverviewExportData } from './useVolumePprSustainableGrowthOverviewExportData';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
}));

jest.mock('../../components', () => ({
  useSustainableGrowthOverviewSlideData: jest.requireActual<
    typeof import('../../components/Slides/SustainableGrowthOverviewSlide/hooks/useSustainableGrowthOverviewSlideData')
  >(
    '../../components/Slides/SustainableGrowthOverviewSlide/hooks/useSustainableGrowthOverviewSlideData',
  ).useSustainableGrowthOverviewSlideData,
}));

describe('useVolumePprSustainableGrowthOverviewExportData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue({
      loading: false,
      error: null,
      data: undefined,
    });
  });

  it('forces YTD period on filters passed to slide data hook', () => {
    const filters = {
      zone: 'z',
      country: 'c',
      growth_lever: 'All',
      period: 'QTD',
      viewtype: 'v',
    };
    const kpiDtEnd = {
      finance: 'f',
      pos: 'p',
      market_share: 'm',
      power: 'pw',
    };

    const { result } = renderHook(() =>
      useVolumePprSustainableGrowthOverviewExportData({
        filters,
        kpiDtEnd,
      }),
    );

    const mergedFilters = { ...filters, period: 'YTD' };
    expect(mockUseBffData).toHaveBeenCalledTimes(1);
    expect(mockUseBffData).toHaveBeenCalledWith({
      id: 'value-creation_home',
      kpiGroup: 'volume',
      subFilters: {
        ...mergedFilters,
        finance: { ...mergedFilters, dt_end: kpiDtEnd.finance },
        pos: { ...mergedFilters, dt_end: kpiDtEnd.pos },
        market_share: { ...mergedFilters, dt_end: kpiDtEnd.market_share },
        power: { ...mergedFilters, dt_end: kpiDtEnd.power },
      },
    });
    expect(result.current.loading).toBe(false);
  });
});
