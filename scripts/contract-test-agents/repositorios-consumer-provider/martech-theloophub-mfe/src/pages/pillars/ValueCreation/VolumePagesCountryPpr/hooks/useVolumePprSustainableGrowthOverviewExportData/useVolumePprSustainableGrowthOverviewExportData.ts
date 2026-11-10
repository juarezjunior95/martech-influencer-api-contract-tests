import {
  useSustainableGrowthOverviewSlideData,
  type UseSustainableGrowthOverviewSlideDataParams,
  type UseSustainableGrowthOverviewSlideDataResult,
} from '../../components';

export interface UseVolumePprSustainableGrowthOverviewExportDataParams {
  filters: UseSustainableGrowthOverviewSlideDataParams['filters'];
  kpiDtEnd: UseSustainableGrowthOverviewSlideDataParams['kpiDtEnd'];
}

export const useVolumePprSustainableGrowthOverviewExportData = ({
  filters,
  kpiDtEnd,
}: UseVolumePprSustainableGrowthOverviewExportDataParams): UseSustainableGrowthOverviewSlideDataResult => {
  return useSustainableGrowthOverviewSlideData({
    filters: { ...filters, period: 'YTD' },
    kpiDtEnd,
  });
};
