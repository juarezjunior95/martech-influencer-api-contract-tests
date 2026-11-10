import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';

import { BFF_VIEW_ID } from '../constants';

export interface InvestmentBreakdownData {
  investment_breakdown?: TableDataType;
}

export function useKpiRequests() {
  const bffResult = useBffData({
    id: BFF_VIEW_ID,
    kpiGroup: 'media',
  });

  const data = useMemo<InvestmentBreakdownData>(() => {
    const normalized = bffResult.data;
    return {
      investment_breakdown:
        normalized?.investment_breakdown?.investment_breakdown,
    };
  }, [bffResult.data]);

  return {
    data,
    loading: bffResult.loading,
    error: bffResult.error,
  };
}
