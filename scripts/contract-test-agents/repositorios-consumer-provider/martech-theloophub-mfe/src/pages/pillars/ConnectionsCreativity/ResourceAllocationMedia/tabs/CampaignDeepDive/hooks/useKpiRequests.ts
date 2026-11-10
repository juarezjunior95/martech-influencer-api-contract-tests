import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';

import { BFF_VIEW_ID } from '../constants';

export interface CampaignsPerformanceData {
  campaigns_performance?: TableDataType;
}

export function useKpiRequests() {
  const bffResult = useBffData({
    id: BFF_VIEW_ID,
    kpiGroup: 'media',
  });

  const data = useMemo<CampaignsPerformanceData>(() => {
    const normalized = bffResult.data;
    return {
      campaigns_performance:
        normalized?.campaigns_performance?.campaigns_performance,
    };
  }, [bffResult.data]);

  return {
    data,
    loading: bffResult.loading,
    error: bffResult.error,
  };
}
