import { useMemo } from 'react';

import { useBffData } from 'hooks';
import { BffNormalizedData } from 'services';

import { BFF_RANKING } from '../constants';
import { ResourceAllocationChart } from '../types';

export function useOverviewRanking(activeRankingSubfilter: string) {
  const rankingBffViewId = BFF_RANKING?.[activeRankingSubfilter]?.viewId;

  const bffRankingComponentId =
    BFF_RANKING?.[activeRankingSubfilter]?.componentId;

  const bffResult = useBffData({
    id: rankingBffViewId ?? '',
    kpiGroup: 'media',
    subFilters: {
      kpi_name: activeRankingSubfilter,
    },
  });

  const data = useMemo((): ResourceAllocationChart | undefined => {
    const normalized: BffNormalizedData | undefined = bffResult.data;
    return normalized?.[bffRankingComponentId] as
      ResourceAllocationChart | undefined;
  }, [bffResult.data, bffRankingComponentId]);

  return {
    data,
    loading: bffResult.loading,
    error: bffResult.error,
  };
}
