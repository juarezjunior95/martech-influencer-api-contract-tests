import { renderHook } from '@testing-library/react-hooks';
import type { SustainableGrowthOverviewSlideData } from 'pages/pillars/ValueCreation/VolumePagesCountryPpr/components/Slides/SustainableGrowthOverviewSlide/types';

import { useSustainableGrowthOverviewSlidesByGrowthLever } from './useSustainableGrowthOverviewSlidesByGrowthLever';

const mockUseSustainableGrowthOverviewSlideData = jest.fn();

jest.mock(
  'pages/pillars/ValueCreation/VolumePagesCountryPpr/components/Slides/SustainableGrowthOverviewSlide/hooks/useSustainableGrowthOverviewSlideData',
  () => ({
    useSustainableGrowthOverviewSlideData: (props: unknown) =>
      mockUseSustainableGrowthOverviewSlideData(props),
  }),
);

const emptySlideData: SustainableGrowthOverviewSlideData = {
  sustainableGrowthOverview: {},
  strategyDrivers: [],
  growthLevers: {},
};

const baseFilters = {
  zone: 'NAZ',
  country: 'USA',
  growth_lever: 'All',
  period: 'QTD',
  viewtype: 'country',
};

const kpiDtEnd = {
  finance: '2024-01',
  pos: '2024-01',
};

describe('useSustainableGrowthOverviewSlidesByGrowthLever', () => {
  beforeEach(() => {
    mockUseSustainableGrowthOverviewSlideData.mockImplementation(() => ({
      loading: false,
      error: null,
      data: emptySlideData,
    }));
  });

  it('returns four slides with ids, titles and page sections from constants', () => {
    const { result } = renderHook(() =>
      useSustainableGrowthOverviewSlidesByGrowthLever(baseFilters, kpiDtEnd),
    );

    expect(result.current.slides).toHaveLength(4);
    expect(result.current.slides.map((s) => s.id)).toEqual([
      'lead-premium',
      'superior-core',
      'balanced-choices',
      'beyond-beer',
    ]);
    expect(result.current.slides.map((s) => s.pageSection)).toEqual([
      'sustainable-growth-overview-lead-premium',
      'sustainable-growth-overview-superior-core',
      'sustainable-growth-overview-balanced-choices',
      'sustainable-growth-overview-beyond-beer',
    ]);
    expect(result.current.anyLoading).toBe(false);
  });

  it('calls slide data hook once per growth lever with YTD and spread filters', () => {
    renderHook(() =>
      useSustainableGrowthOverviewSlidesByGrowthLever(baseFilters, kpiDtEnd),
    );

    expect(mockUseSustainableGrowthOverviewSlideData).toHaveBeenCalledTimes(4);
    expect(mockUseSustainableGrowthOverviewSlideData).toHaveBeenCalledWith({
      filters: {
        ...baseFilters,
        growth_lever: 'Lead Premium',
        period: 'YTD',
      },
      kpiDtEnd,
    });
    expect(mockUseSustainableGrowthOverviewSlideData).toHaveBeenCalledWith({
      filters: {
        ...baseFilters,
        growth_lever: 'Beyond Beer',
        period: 'YTD',
      },
      kpiDtEnd,
    });
  });

  it('maps loading from each slide hook and sets anyLoading when any is loading', () => {
    mockUseSustainableGrowthOverviewSlideData.mockImplementation(
      ({ filters }: { filters: { growth_lever: string } }) => ({
        loading: filters.growth_lever === 'Balanced Choices',
        error: null,
        data: emptySlideData,
      }),
    );

    const { result } = renderHook(() =>
      useSustainableGrowthOverviewSlidesByGrowthLever(baseFilters, kpiDtEnd),
    );

    const balanced = result.current.slides.find(
      (s) => s.id === 'balanced-choices',
    );
    expect(balanced?.loading).toBe(true);
    expect(
      result.current.slides.find((s) => s.id === 'lead-premium')?.loading,
    ).toBe(false);
    expect(result.current.anyLoading).toBe(true);
  });
});
