import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

interface BrandBreakdownData {
  summaryPowerBreakdown?: TableDataType;
  summaryPowerBreakdownComp?: TableDataType;
}

interface DataResponse<T> {
  loading: boolean;
  error: Error | null;
  data: T;
}

interface UseBrandBreakdownDataProps {
  subScopeFilter: string;
  selectedPerformance: string;
}

export const useBrandBreakdownData = ({
  subScopeFilter,
  selectedPerformance,
}: UseBrandBreakdownDataProps): DataResponse<BrandBreakdownData> => {
  const bffData = useBffData({
    id: SharedKpis.BFF.SUMMARY_FOR_POWER_BREAKDOWN,
    kpiGroup: 'power',
    subFilters: {
      page_filter: subScopeFilter,
      breakdown_filter: selectedPerformance,
    },
  });

  const summaryPowerBreakdown = bffData.data?.summaryPowerBreakdown as
    TableDataType | undefined;
  const summaryPowerBreakdownComp = bffData.data?.summaryPowerBreakdownComp as
    TableDataType | undefined;

  const data = useMemo<BrandBreakdownData>(
    () => ({ summaryPowerBreakdown, summaryPowerBreakdownComp }),
    [summaryPowerBreakdown, summaryPowerBreakdownComp],
  );

  return useMemo<DataResponse<BrandBreakdownData>>(
    () => ({
      loading: bffData.loading,
      error: bffData.error,
      data,
    }),
    [bffData.loading, bffData.error, data],
  );
};
