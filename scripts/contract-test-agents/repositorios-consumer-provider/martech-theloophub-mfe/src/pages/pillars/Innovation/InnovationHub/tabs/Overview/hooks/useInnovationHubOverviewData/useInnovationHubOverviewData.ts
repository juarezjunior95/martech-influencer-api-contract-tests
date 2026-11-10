import type { InnovationHubOverviewDataResult } from '../../types';
import { useInnovationHubOverviewMockData } from '../useInnovationHubOverviewMockData/useInnovationHubOverviewMockData';

/**
 * Overview KPI data hook. While mock-backed, filter-driven BFF requests should
 * pass KPI scope with `overviewCardIdToPresetKpiValue` from
 * `tabs/Overview/utils/innovationHubKpiFromPreset` when the API expects snake_case.
 */
export function useInnovationHubOverviewData(): InnovationHubOverviewDataResult {
  return useInnovationHubOverviewMockData();
}
