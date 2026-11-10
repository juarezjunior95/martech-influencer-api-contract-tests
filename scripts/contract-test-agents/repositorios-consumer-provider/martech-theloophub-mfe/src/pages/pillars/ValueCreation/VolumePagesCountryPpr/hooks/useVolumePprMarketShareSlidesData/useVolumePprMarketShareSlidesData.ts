import { useMemo } from 'react';

import { useBffData } from 'hooks';

import {
  usePerformanceToolData,
  type UsePerformanceToolDataResult,
} from '../../../PerformanceTool/hooks';

export interface UseVolumePprMarketShareSlidesDataResult {
  bigNumbersMarketShareBffData: ReturnType<typeof useBffData>;
  overtimeMarketShareBffData: ReturnType<typeof useBffData>;
  waterfallMarketShareYTDBffData: ReturnType<typeof useBffData>;
  waterfallMarketShareMTDBffData: ReturnType<typeof useBffData>;
  bigNumbersMarketShareData: UsePerformanceToolDataResult<
    ['overtime-performance']
  >;
  overtimeMarketShareData: UsePerformanceToolDataResult<['overtime-trends']>;
  waterfallMarketShareYTDData: UsePerformanceToolDataResult<['contribution']>;
  waterfallMarketShareMTDData: UsePerformanceToolDataResult<['contribution']>;
  sectionLoading: boolean;
}

export const useVolumePprMarketShareSlidesData = (
  isGlobalZone: boolean,
  countryCode: string,
): UseVolumePprMarketShareSlidesDataResult => {
  const bigNumbersMarketShareBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_non-finance_market-share_overtime-performance',
    kpiGroup: 'market_share',
    subFilters: {
      timeframe: 'YTD',
      page_filter: 'All',
      brand: 'All',
      sub_brand: 'All',
      growth_lever: 'All',
      kpi: 'market_share',
      waterfall_filter: 'country',
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const overtimeMarketShareBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_non-finance_market-share_overtime-trends',
    kpiGroup: 'market_share',
    subFilters: {
      timeframe: 'YTD',
      period_type: 'YTD',
      page_filter: 'All',
      brand: 'All',
      sub_brand: 'All',
      growth_lever: 'All',
      kpi: 'market_share',
      waterfall_filter: 'country',
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const waterfallMarketShareYTDBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_non-finance_market-share_contribution',
    kpiGroup: 'market_share',
    subFilters: {
      country: countryCode,
      timeframe: 'YTD',
      brand: 'All',
      page_filter: 'All',
      sub_brand: 'All',
      growth_lever: 'All',
      waterfall_filter: isGlobalZone ? '' : 'brand',
      period_type: 'YTD',
      kpi: 'nr',
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const waterfallMarketShareMTDBffData = useBffData({
    id: 'value-creation_performance-tool_drill-down_non-finance_market-share_contribution',
    kpiGroup: 'market_share',
    subFilters: {
      country: countryCode,
      timeframe: 'MTD',
      brand: 'All',
      page_filter: 'All',
      sub_brand: 'All',
      growth_lever: 'All',
      waterfall_filter: isGlobalZone ? '' : 'brand',
      period_type: 'MTD',
      kpi: 'nr',
    },
    skipMainFilters: false,
    skipRequest: false,
  });

  const bigNumbersMarketShareData = usePerformanceToolData(
    ['overtime-performance'],
    bigNumbersMarketShareBffData,
  );

  const overtimeMarketShareData = usePerformanceToolData(
    ['overtime-trends'],
    overtimeMarketShareBffData,
  );

  const waterfallMarketShareYTDData = usePerformanceToolData(
    ['contribution'],
    waterfallMarketShareYTDBffData,
  );

  const waterfallMarketShareMTDData = usePerformanceToolData(
    ['contribution'],
    waterfallMarketShareMTDBffData,
  );

  const sectionLoading = useMemo(
    () =>
      bigNumbersMarketShareBffData.loading ||
      overtimeMarketShareBffData.loading ||
      waterfallMarketShareYTDBffData.loading ||
      waterfallMarketShareMTDBffData.loading,
    [
      bigNumbersMarketShareBffData.loading,
      overtimeMarketShareBffData.loading,
      waterfallMarketShareYTDBffData.loading,
      waterfallMarketShareMTDBffData.loading,
    ],
  );

  return {
    bigNumbersMarketShareBffData,
    overtimeMarketShareBffData,
    waterfallMarketShareYTDBffData,
    waterfallMarketShareMTDBffData,
    bigNumbersMarketShareData,
    overtimeMarketShareData,
    waterfallMarketShareYTDData,
    waterfallMarketShareMTDData,
    sectionLoading,
  };
};
