import { useMemo } from 'react';

export interface VolumePprExportPageLoadingFlags {
  sustainableGrowthOverview: boolean;
  sustainableGrowthByGrowthLever: boolean;
  participation: boolean;
  volume: boolean;
  netRevenue: boolean;
  marketShare: boolean;
  portfolioPerformance: boolean;
  brandPower: boolean;
  pnl: boolean;
  resourceAllocation: boolean;
}

export const useVolumePprExportPageLoading = ({
  sustainableGrowthOverview,
  sustainableGrowthByGrowthLever,
  participation,
  volume,
  netRevenue,
  marketShare,
  portfolioPerformance,
  brandPower,
  pnl,
  resourceAllocation,
}: VolumePprExportPageLoadingFlags): boolean => {
  return useMemo(
    () =>
      sustainableGrowthOverview ||
      sustainableGrowthByGrowthLever ||
      participation ||
      volume ||
      netRevenue ||
      marketShare ||
      portfolioPerformance ||
      brandPower ||
      pnl ||
      resourceAllocation,
    [
      sustainableGrowthOverview,
      sustainableGrowthByGrowthLever,
      participation,
      volume,
      netRevenue,
      marketShare,
      portfolioPerformance,
      brandPower,
      pnl,
      resourceAllocation,
    ],
  );
};
