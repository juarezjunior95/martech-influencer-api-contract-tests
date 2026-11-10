import { useMemo } from 'react';

import { useBffData } from 'hooks';

import {
  usePerformanceToolData,
  type UsePerformanceToolDataResult,
} from '../../../PerformanceTool/hooks';

export interface UseVolumePprNetRevenueSlidesDataResult {
  bigNumbersNetRevenueBffData: ReturnType<typeof useBffData>;
  overtimeNetRevenueBffData: ReturnType<typeof useBffData>;
  waterfallNetRevenueYTDBffData: ReturnType<typeof useBffData>;
  waterfallNetRevenueMTDBffData: ReturnType<typeof useBffData>;
  bigNumbersNetRevenueData: UsePerformanceToolDataResult<
    ['overtime-performance']
  >;
  overtimeNetRevenueData: UsePerformanceToolDataResult<['overtime-trends']>;
  waterfallYTDData: UsePerformanceToolDataResult<['contribution']>;
  waterfallMTDData: UsePerformanceToolDataResult<['contribution']>;
  sectionLoading: boolean;
}

export const useVolumePprNetRevenueSlidesData = (
  countryCode: string,
): UseVolumePprNetRevenueSlidesDataResult => {
  const bigNumbersNetRevenueBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_net-revenue_overtime-performance',
    kpiGroup: 'finance',
    subFilters: {
      timeframe: 'YTD',
      page_filter: 'All',
      brand: 'All',
      sub_brand: 'All',
      growth_lever: 'All',
      kpi: 'nr',
      waterfall_filter: 'brand',
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const overtimeNetRevenueBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_net-revenue_overtime-trends',
    kpiGroup: 'finance',
    subFilters: {
      timeframe: 'YTD',
      period_type: 'YTD',
      page_filter: 'All',
      brand: 'All',
      sub_brand: 'All',
      growth_lever: 'All',
      kpi: 'nr',
      waterfall_filter: 'brand',
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const waterfallNetRevenueYTDBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_net-revenue_contribution',
    kpiGroup: 'finance',
    subFilters: {
      country: countryCode,
      timeframe: 'YTD',
      brand: 'All',
      page_filter: 'All',
      sub_brand: 'All',
      growth_lever: 'All',
      waterfall_filter: 'brand',
      period_type: 'YTD',
      kpi: 'nr',
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const waterfallNetRevenueMTDBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_net-revenue_contribution',
    kpiGroup: 'finance',
    subFilters: {
      country: countryCode,
      timeframe: 'MTD',
      brand: 'All',
      page_filter: 'All',
      sub_brand: 'All',
      growth_lever: 'All',
      waterfall_filter: 'brand',
      period_type: 'MTD',
      kpi: 'nr',
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const bigNumbersNetRevenueData = usePerformanceToolData(
    ['overtime-performance'],
    bigNumbersNetRevenueBffData,
  );

  const overtimeNetRevenueData = usePerformanceToolData(
    ['overtime-trends'],
    overtimeNetRevenueBffData,
  );

  const waterfallYTDData = usePerformanceToolData(
    ['contribution'],
    waterfallNetRevenueYTDBffData,
  );

  const waterfallMTDData = usePerformanceToolData(
    ['contribution'],
    waterfallNetRevenueMTDBffData,
  );

  const sectionLoading = useMemo(
    () =>
      bigNumbersNetRevenueBffData.loading ||
      overtimeNetRevenueBffData.loading ||
      waterfallNetRevenueYTDBffData.loading ||
      waterfallNetRevenueMTDBffData.loading,
    [
      bigNumbersNetRevenueBffData.loading,
      overtimeNetRevenueBffData.loading,
      waterfallNetRevenueYTDBffData.loading,
      waterfallNetRevenueMTDBffData.loading,
    ],
  );

  return {
    bigNumbersNetRevenueBffData,
    overtimeNetRevenueBffData,
    waterfallNetRevenueYTDBffData,
    waterfallNetRevenueMTDBffData,
    bigNumbersNetRevenueData,
    overtimeNetRevenueData,
    waterfallYTDData,
    waterfallMTDData,
    sectionLoading,
  };
};
