import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData, usePageFilterApplied, useSubFilters } from 'hooks';
import { RankedContainerData } from 'pages/components/BrandRanking/types';

import { POS_BOOK_PAGE_NAME } from '../../../../POSBook';
import {
  PRICE_SEGMENTS_ALL_BRAND,
  PRICE_SEGMENTS_KEY_BRAND,
  VIEW_TYPES,
} from '../../constants';
import {
  buildBffBrandParticipationSubFilters,
  getBffBrandParticipationKpiId,
} from '../../utils';

export interface UseBrandParticipationDataReturn {
  data: {
    tableData: TableDataType | null;
    ranking: RankedContainerData | null;
  } | null;
  loading: boolean;
  error: Error | null;
}

export const useBrandParticipationData = (
  selectedView: string,
): UseBrandParticipationDataReturn => {
  const { isGlobalZone } = usePageFilterApplied(POS_BOOK_PAGE_NAME);
  const { activeSubFilters } = useSubFilters();

  const priceSegment = useMemo(
    () =>
      (activeSubFilters?.[PRICE_SEGMENTS_KEY_BRAND] as string) ||
      PRICE_SEGMENTS_ALL_BRAND,
    [activeSubFilters],
  );

  const filterCohort = useMemo(
    () => (activeSubFilters?.cohorts as string) || '',
    [activeSubFilters],
  );

  const hasPriceSegmentFilter = useMemo(
    () => selectedView === VIEW_TYPES.RANKINGS && !isGlobalZone,
    [selectedView, isGlobalZone],
  );

  const bffSubFilters = useMemo(
    () =>
      buildBffBrandParticipationSubFilters({
        cohort: filterCohort || null,
        price_segment: hasPriceSegmentFilter ? priceSegment || null : null,
      }),
    [filterCohort, priceSegment, hasPriceSegmentFilter],
  );

  const bffKpiId = useMemo(
    () => getBffBrandParticipationKpiId(selectedView, isGlobalZone),
    [selectedView, isGlobalZone],
  );

  const bffData = useBffData({
    id: bffKpiId,
    kpiGroup: 'pos',
    subFilters: bffSubFilters,
  });

  const data = useMemo(() => {
    if (bffData.loading || !bffData.data) return null;
    const components = bffData.data;
    const first = Object.values(components ?? {})[0];

    if (first == null) {
      return { tableData: null, ranking: null };
    }

    const ranking = first?.datasets && (first as RankedContainerData);
    if (ranking) {
      return { tableData: null, ranking };
    }

    const withJsonata = first as { jsonataData?: TableDataType };
    if (Array.isArray(withJsonata.jsonataData)) {
      return { tableData: withJsonata.jsonataData, ranking: null };
    }

    return {
      tableData: first as TableDataType,
      ranking: null,
    };
  }, [bffData.data, bffData.loading]);

  return {
    data,
    loading: bffData.loading,
    error: bffData.error,
  };
};
