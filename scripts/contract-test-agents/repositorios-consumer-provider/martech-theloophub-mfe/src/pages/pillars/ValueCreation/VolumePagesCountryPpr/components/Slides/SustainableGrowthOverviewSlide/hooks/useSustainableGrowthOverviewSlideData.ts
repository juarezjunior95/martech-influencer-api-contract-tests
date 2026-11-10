import { useMemo } from 'react';

import { useBffData } from 'hooks';
import type { KpiOverviewCardData } from 'pages/components/KpiOverviewCard';
import type {
  GrowthLeverCardData,
  StrategyDriverCardData,
} from 'pages/components/ValueCreation';

import type {
  SustainableGrowthOverviewSlideBffFilters,
  SustainableGrowthOverviewSlideData,
  SustainableGrowthOverviewSlideKpiDtEnd,
} from '../types';

export interface UseSustainableGrowthOverviewSlideDataParams {
  filters: SustainableGrowthOverviewSlideBffFilters;
  kpiDtEnd: SustainableGrowthOverviewSlideKpiDtEnd;
}

export interface UseSustainableGrowthOverviewSlideDataResult {
  loading: boolean;
  error: Error | null | undefined;
  data: SustainableGrowthOverviewSlideData;
}

export const useSustainableGrowthOverviewSlideData = ({
  filters,
  kpiDtEnd,
}: UseSustainableGrowthOverviewSlideDataParams): UseSustainableGrowthOverviewSlideDataResult => {
  const pageData = useBffData({
    id: 'value-creation_home',
    kpiGroup: 'volume',
    subFilters: {
      ...filters,
      finance: {
        ...filters,
        dt_end: kpiDtEnd.finance,
      },
      pos: {
        ...filters,
        dt_end: kpiDtEnd.pos,
      },
      market_share: {
        ...filters,
        dt_end: kpiDtEnd.market_share,
      },
      power: {
        ...filters,
        dt_end: kpiDtEnd.power,
      },
    },
  });

  const sustainableGrowthOverview = useMemo((): Record<
    string,
    KpiOverviewCardData | undefined
  > => {
    if (pageData.loading || !pageData?.data?.['sustainable-growth-overview'])
      return {};
    return pageData?.data?.['sustainable-growth-overview'];
  }, [pageData]);

  const strategyDrivers = useMemo((): StrategyDriverCardData[] => {
    if (pageData.loading || !pageData?.data?.['strategy-drivers']) return [];
    return pageData?.data?.['strategy-drivers'] as StrategyDriverCardData[];
  }, [pageData]);

  const growthLevers = useMemo((): Record<string, GrowthLeverCardData> => {
    const raw = pageData?.data?.['strategy-drivers-growth-levers'];
    if (pageData.loading || !raw || Array.isArray(raw)) return {};
    return raw as Record<string, GrowthLeverCardData>;
  }, [pageData]);

  const data = useMemo(
    (): SustainableGrowthOverviewSlideData => ({
      sustainableGrowthOverview,
      strategyDrivers,
      growthLevers,
    }),
    [sustainableGrowthOverview, strategyDrivers, growthLevers],
  );

  return {
    loading: pageData.loading,
    error: pageData.error,
    data,
  };
};
