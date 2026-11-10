import { useMemo } from 'react';

import { useBffData } from 'hooks';

import { BFF_VIEW_ID } from '../constants';
import { ResourceAllocationData } from '../types';

export interface UseKpiRequestsParams {
  kpiFilter: string;
  isGlobalZone: boolean;
}

export function useKpiRequests({
  kpiFilter,
  isGlobalZone,
}: UseKpiRequestsParams) {
  const subFilters = {
    kpi_filter: kpiFilter,
    view_type: isGlobalZone ? 'global' : 'country',
  };

  const bffResult = useBffData({
    id: BFF_VIEW_ID,
    kpiGroup: 'media',
    subFilters,
  });

  const data = useMemo(() => {
    return bffResult.data?.bar_charts_country as ResourceAllocationData;
  }, [bffResult.data]);

  return {
    data,
    loading: bffResult.loading,
    error: bffResult.error,
  };
}
