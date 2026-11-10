import { useMemo } from 'react';

import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';
import { PerformanceTrendChart } from 'pages/types';

import { Legend } from '../../../types';
import { PowerBigNumbers } from '../components/BigNumbers/BigNumbers';

type BigNumberData = PowerBigNumbers['powerVsLq'];

interface BigNumbersData {
  powerVsLq: BigNumberData;
  powerVsLy: BigNumberData;
}

interface PerformanceTrendData {
  trendOverTime?: PerformanceTrendChart;
  yearPowerVsAc?: PerformanceTrendChart;
  legend?: Legend[];
}

interface DataResponse<T> {
  loading: boolean;
  error: Error | null;
  data: T;
}

interface PowerBookDataReturn {
  bigNumbers: DataResponse<BigNumbersData>;
  performanceTrend: DataResponse<PerformanceTrendData>;
}

export const usePowerBookOverviewData = (
  subScopeFilter: string,
): PowerBookDataReturn => {
  const overviewData = useBffData({
    id: SharedKpis.BFF.OVERVIEW,
    kpiGroup: 'power',
    subFilters: {
      page_filter: subScopeFilter,
    },
  });

  const bigNumbers = useMemo<BigNumbersData>(
    () => ({
      powerVsLq: overviewData.data?.powerVsLq || {},
      powerVsLy: overviewData.data?.powerVsLy || {},
    }),
    [overviewData.data?.powerVsLq, overviewData.data?.powerVsLy],
  );

  const trendOverTime = overviewData.data?.trendOverTime as
    PerformanceTrendChart | undefined;
  const yearPowerVsAc = overviewData.data?.yearPowerVsAc as
    PerformanceTrendChart | undefined;
  const trendLegend = overviewData.data?.trendOverTime?.legend as
    Legend[] | undefined;

  const performanceTrend = useMemo<PerformanceTrendData>(
    () => ({ trendOverTime, yearPowerVsAc, legend: trendLegend }),
    [trendOverTime, yearPowerVsAc, trendLegend],
  );

  return useMemo<PowerBookDataReturn>(
    () => ({
      bigNumbers: {
        loading: overviewData.loading,
        error: overviewData.error,
        data: bigNumbers,
      },
      performanceTrend: {
        loading: overviewData.loading,
        error: overviewData.error,
        data: performanceTrend,
      },
    }),
    [overviewData.loading, overviewData.error, bigNumbers, performanceTrend],
  );
};
