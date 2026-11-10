import { useOverviewCharts } from './useOverviewCharts';
import { useOverviewRanking } from './useOverviewRanking';
import { useOverviewTable } from './useOverviewTable';

export function useKpiRequests(activeRankingSubfilter: string) {
  const chartsData = useOverviewCharts();
  const activeTableData = useOverviewTable(activeRankingSubfilter);
  const activeRankingData = useOverviewRanking(activeRankingSubfilter);

  return {
    charts: {
      mediaSpend: chartsData.mediaSpend,
      megaBrands: chartsData.megaBrands,
      campaigns: chartsData.campaigns,
      resourceAllocation: chartsData.resourceAllocation,
    },
    table: activeTableData,
    ranking: activeRankingData,
  };
}
