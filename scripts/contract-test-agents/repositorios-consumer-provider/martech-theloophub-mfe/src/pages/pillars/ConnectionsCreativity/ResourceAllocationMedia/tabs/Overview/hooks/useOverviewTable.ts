import { useMemo } from 'react';

import { AgGridData } from 'components/Table/types';
import { useBffData } from 'hooks';

import { BFF_TABLE_VIEWS_IDS } from '../constants';

export function useOverviewTable(activeRankingSubfilter: string) {
  const tableBffViewId =
    activeRankingSubfilter == null
      ? undefined
      : BFF_TABLE_VIEWS_IDS?.[
          activeRankingSubfilter as keyof typeof BFF_TABLE_VIEWS_IDS
        ];

  const bffResult = useBffData({
    id: tableBffViewId ?? '',
    kpiGroup: 'media',
    subFilters: {
      kpi: activeRankingSubfilter,
    },
  });

  const data = useMemo(() => {
    return bffResult.data?.[activeRankingSubfilter] as AgGridData;
  }, [bffResult.data, activeRankingSubfilter]);

  return {
    data,
    loading: bffResult.loading,
    error: bffResult.error,
  };
}
