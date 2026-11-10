import { useMemo } from 'react';

import { usePageFilterData } from 'hooks';

import {
  INNOVATION_HUB_PAGE_NAME,
  INNOVATION_HUB_VISIBLE_FILTER_FIELDS,
} from '../../../../constants';
import {
  getNavigableOverviewCardIdsFromKpisPreset,
  getOrderedOverviewCardIdsFromKpisPreset,
} from '../../utils/innovationHubKpiFromPreset';

export interface InnovationHubKpiPresetCardIds {
  orderedCardIds: string[];
  navigableCardIds: string[];
}

export function useInnovationHubKpiPresetCardIds(): InnovationHubKpiPresetCardIds {
  const { appliedDataFilters } = usePageFilterData(INNOVATION_HUB_PAGE_NAME, [
    ...INNOVATION_HUB_VISIBLE_FILTER_FIELDS,
  ]);

  return useMemo(() => {
    const kpis = appliedDataFilters?.kpis;
    return {
      orderedCardIds: getOrderedOverviewCardIdsFromKpisPreset(kpis),
      navigableCardIds: getNavigableOverviewCardIdsFromKpisPreset(kpis),
    };
  }, [appliedDataFilters?.kpis]);
}
