import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

interface SegmentData {
  summaryPowerBySegmentPerformance?: TableDataType;
}

interface PortfolioData {
  summaryPowerByPortfolioPerformance?: TableDataType;
}

interface DataResponse<T> {
  loading: boolean;
  error: Error | null;
  data: T;
}

interface SummaryForPowerPerformanceReturn {
  segment: DataResponse<SegmentData>;
  portfolio: DataResponse<PortfolioData>;
}

interface UseSummaryForPowerPerformanceProps {
  subScopeFilter: string;
}

export const useSummaryForPowerPerformance = ({
  subScopeFilter,
}: UseSummaryForPowerPerformanceProps): SummaryForPowerPerformanceReturn => {
  const summaryForPowerData = useBffData({
    id: SharedKpis.BFF.SUMMARY_FOR_POWER,
    kpiGroup: 'power',
    subFilters: {
      page_filter: subScopeFilter,
    },
  });

  const summaryPowerBySegmentPerformance = summaryForPowerData.data
    ?.summaryPowerBySegmentPerformance as TableDataType | undefined;
  const summaryPowerByPortfolioPerformance = summaryForPowerData.data
    ?.summaryPowerByPortfolioPerformance as TableDataType | undefined;

  const segmentTableData = useMemo<SegmentData>(
    () => ({ summaryPowerBySegmentPerformance }),
    [summaryPowerBySegmentPerformance],
  );

  const portfolioTableData = useMemo<PortfolioData>(
    () => ({ summaryPowerByPortfolioPerformance }),
    [summaryPowerByPortfolioPerformance],
  );

  return useMemo<SummaryForPowerPerformanceReturn>(
    () => ({
      segment: {
        loading: summaryForPowerData.loading,
        error: summaryForPowerData.error,
        data: segmentTableData,
      },
      portfolio: {
        loading: summaryForPowerData.loading,
        error: summaryForPowerData.error,
        data: portfolioTableData,
      },
    }),
    [
      summaryForPowerData.loading,
      summaryForPowerData.error,
      segmentTableData,
      portfolioTableData,
    ],
  );
};
