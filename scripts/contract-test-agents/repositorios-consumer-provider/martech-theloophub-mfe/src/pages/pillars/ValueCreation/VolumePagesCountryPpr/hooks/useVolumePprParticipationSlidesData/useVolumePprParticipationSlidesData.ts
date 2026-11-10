import { useMemo } from 'react';

import { useBffData } from 'hooks';

import {
  countryParticipationExportTableConfig,
  globalParticipationExportTableConfig,
} from '../../components/Slides/ParticipationBreakdownByCohortSlide/config';

export interface UseVolumePprParticipationSlidesDataResult {
  participationBreakdownByCohortSlideData: ReturnType<typeof useBffData>;
  participationBreakdownByCohortCountryManufatureSlideData: ReturnType<
    typeof useBffData
  >;
  participationBreakdownByCohortGlobalManufatureSlideData: ReturnType<
    typeof useBffData
  >;
  brandRankingParticipationSlideData: ReturnType<typeof useBffData>;
  participationBreakdownByCohortManufatureSlideData: unknown;
  manufactureParticipationExportTableConfig:
    | typeof countryParticipationExportTableConfig
    | typeof globalParticipationExportTableConfig;
  sectionLoading: boolean;
}

export const useVolumePprParticipationSlidesData = (
  isGlobalZone: boolean,
  countryValue: string | number | undefined,
): UseVolumePprParticipationSlidesDataResult => {
  const participationBreakdownByCohortSlideData = useBffData({
    id: 'category_pos-book_grow-the-category_cohort',
    kpiGroup: 'pos',
    subFilters: {
      cohort: 'All',
      pos_kpi: 'participation',
      timeperiod: 'QTD',
    },
  });

  const participationBreakdownByCohortCountryManufatureSlideData = useBffData({
    id: 'category_pos-book_lead-the-category_country_manufacture-participation',
    kpiGroup: 'pos',
    subFilters: {
      price_segment: 'all',
      timeperiod: 'QTD',
    },
  });

  const participationBreakdownByCohortGlobalManufatureSlideData = useBffData({
    id: 'category_pos-book_lead-the-category_global_manufacture-participation',
    kpiGroup: 'pos',
    subFilters: {
      price_segment: 'all',
      timeperiod: 'QTD',
    },
  });

  const brandRankingParticipationCountrySlideData = useBffData({
    id: 'category_pos-book_lead-the-category_country_participation-ranking',
    kpiGroup: 'pos',
    subFilters: {
      timeperiod: 'QTD',
      cohort: 'All',
    },
    skipRequest: isGlobalZone,
  });

  const brandRankingParticipationGlobalSlideData = useBffData({
    id: 'category_pos-book_lead-the-category_global_participation-ranking',
    kpiGroup: 'pos',
    subFilters: {
      timeperiod: 'QTD',
      cohort: 'All',
    },
    skipRequest: !isGlobalZone,
  });

  const brandRankingParticipationSlideData = useMemo(() => {
    return isGlobalZone
      ? brandRankingParticipationGlobalSlideData
      : brandRankingParticipationCountrySlideData;
  }, [
    isGlobalZone,
    brandRankingParticipationGlobalSlideData,
    brandRankingParticipationCountrySlideData,
  ]);

  const participationBreakdownByCohortManufatureSlideData = useMemo(() => {
    return String(countryValue) === 'ABI'
      ? participationBreakdownByCohortGlobalManufatureSlideData.data?.[
          'manufacture-participation'
        ]
      : participationBreakdownByCohortCountryManufatureSlideData.data?.[
          'manufacture-participation'
        ];
  }, [
    countryValue,
    participationBreakdownByCohortGlobalManufatureSlideData,
    participationBreakdownByCohortCountryManufatureSlideData,
  ]);

  const manufactureParticipationExportTableConfig = useMemo(() => {
    return String(countryValue) === 'ABI'
      ? globalParticipationExportTableConfig
      : countryParticipationExportTableConfig;
  }, [countryValue]);

  const sectionLoading = useMemo(
    () =>
      participationBreakdownByCohortSlideData.loading ||
      participationBreakdownByCohortCountryManufatureSlideData.loading ||
      participationBreakdownByCohortGlobalManufatureSlideData.loading ||
      brandRankingParticipationSlideData.loading,
    [
      participationBreakdownByCohortSlideData.loading,
      participationBreakdownByCohortCountryManufatureSlideData.loading,
      participationBreakdownByCohortGlobalManufatureSlideData.loading,
      brandRankingParticipationSlideData.loading,
    ],
  );

  return {
    participationBreakdownByCohortSlideData,
    participationBreakdownByCohortCountryManufatureSlideData,
    participationBreakdownByCohortGlobalManufatureSlideData,
    brandRankingParticipationSlideData,
    participationBreakdownByCohortManufatureSlideData,
    manufactureParticipationExportTableConfig,
    sectionLoading,
  };
};
