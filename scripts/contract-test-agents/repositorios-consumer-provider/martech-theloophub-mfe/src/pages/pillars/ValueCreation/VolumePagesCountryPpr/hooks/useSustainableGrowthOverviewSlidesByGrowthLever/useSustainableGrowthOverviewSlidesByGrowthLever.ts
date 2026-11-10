import { useMemo } from 'react';

import { useSustainableGrowthOverviewSlideData } from 'pages/pillars/ValueCreation/VolumePagesCountryPpr/components/Slides/SustainableGrowthOverviewSlide/hooks/useSustainableGrowthOverviewSlideData';
import type {
  SustainableGrowthOverviewSlideBffFilters,
  SustainableGrowthOverviewSlideData,
  SustainableGrowthOverviewSlideKpiDtEnd,
} from 'pages/pillars/ValueCreation/VolumePagesCountryPpr/components/Slides/SustainableGrowthOverviewSlide/types';
import {
  pageSections,
  SUSTAINABLE_GROWTH_OVERVIEW_BY_GROWTH_LEVER_SLIDES,
} from 'pages/pillars/ValueCreation/VolumePagesCountryPpr/constants';

export interface SustainableGrowthOverviewByGrowthLeverSlideViewModel {
  id: string;
  title: string;
  pageSection: (typeof pageSections)[keyof typeof pageSections];
  loading: boolean;
  error: Error | null | undefined;
  data: SustainableGrowthOverviewSlideData;
}

export interface UseSustainableGrowthOverviewSlidesByGrowthLeverResult {
  slides: SustainableGrowthOverviewByGrowthLeverSlideViewModel[];
  anyLoading: boolean;
}

export const useSustainableGrowthOverviewSlidesByGrowthLever = (
  filters: SustainableGrowthOverviewSlideBffFilters,
  kpiDtEnd: SustainableGrowthOverviewSlideKpiDtEnd,
): UseSustainableGrowthOverviewSlidesByGrowthLeverResult => {
  const leadPremiumSlideData = useSustainableGrowthOverviewSlideData({
    filters: {
      ...filters,
      growth_lever:
        SUSTAINABLE_GROWTH_OVERVIEW_BY_GROWTH_LEVER_SLIDES.leadPremium
          .growthLever,
      period: 'YTD',
    },
    kpiDtEnd,
  });
  const superiorCoreSlideData = useSustainableGrowthOverviewSlideData({
    filters: {
      ...filters,
      growth_lever:
        SUSTAINABLE_GROWTH_OVERVIEW_BY_GROWTH_LEVER_SLIDES.superiorCore
          .growthLever,
      period: 'YTD',
    },
    kpiDtEnd,
  });
  const balancedChoicesSlideData = useSustainableGrowthOverviewSlideData({
    filters: {
      ...filters,
      growth_lever:
        SUSTAINABLE_GROWTH_OVERVIEW_BY_GROWTH_LEVER_SLIDES.balancedChoices
          .growthLever,
      period: 'YTD',
    },
    kpiDtEnd,
  });
  const beyondBeerSlideData = useSustainableGrowthOverviewSlideData({
    filters: {
      ...filters,
      growth_lever:
        SUSTAINABLE_GROWTH_OVERVIEW_BY_GROWTH_LEVER_SLIDES.beyondBeer
          .growthLever,
      period: 'YTD',
    },
    kpiDtEnd,
  });

  return useMemo(
    () => ({
      slides: Object.values(
        SUSTAINABLE_GROWTH_OVERVIEW_BY_GROWTH_LEVER_SLIDES,
      ).map((cfg, index) => {
        const state = [
          leadPremiumSlideData,
          superiorCoreSlideData,
          balancedChoicesSlideData,
          beyondBeerSlideData,
        ][index];
        return {
          id: cfg.id,
          title: cfg.title,
          pageSection: pageSections[cfg.pageSectionKey],
          loading: state.loading,
          error: state.error,
          data: state.data,
        };
      }),
      anyLoading:
        leadPremiumSlideData.loading ||
        superiorCoreSlideData.loading ||
        balancedChoicesSlideData.loading ||
        beyondBeerSlideData.loading,
    }),
    [
      leadPremiumSlideData,
      superiorCoreSlideData,
      balancedChoicesSlideData,
      beyondBeerSlideData,
    ],
  );
};
