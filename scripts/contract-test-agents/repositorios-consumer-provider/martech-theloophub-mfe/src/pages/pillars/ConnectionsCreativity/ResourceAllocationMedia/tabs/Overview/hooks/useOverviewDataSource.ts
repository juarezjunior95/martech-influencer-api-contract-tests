import { useMemo } from 'react';

import { useABTest, useMultiplesFeatureToggles, useSubFilters } from 'hooks';

import { OVERVIEW_TOGGLES, RA_DEEP_DIVE_SUBFILTER } from '../constants';
import { applyChartsConfigs, applyRankingConfigs } from '../utils';
import { useKpiRequests } from './useKpiRequests';

export const useOverviewDataSource = () => {
  const { activeSubFilters } = useSubFilters();

  const activeDeepDiveSubfilter = useMemo<string | undefined>(() => {
    const value = activeSubFilters?.[RA_DEEP_DIVE_SUBFILTER];
    return typeof value === 'string' ? value : undefined;
  }, [activeSubFilters]);

  const { isGroupA, isControl, isReady: abTestReady } = useABTest();

  const { featuresListByToggleName, togglesReady } = useMultiplesFeatureToggles(
    [
      OVERVIEW_TOGGLES.BREAKDOWN_TABLE,
      OVERVIEW_TOGGLES.BREAKDOWN_CHARTS,
      OVERVIEW_TOGGLES.RANKING,
      OVERVIEW_TOGGLES.DEV_VIEWER,
    ],
  );

  const kpiRequests = useKpiRequests(activeDeepDiveSubfilter);

  const dataSource = useMemo(() => {
    const sectionFeatures = {
      hasCharts: featuresListByToggleName[OVERVIEW_TOGGLES.BREAKDOWN_CHARTS],
      hasTable: featuresListByToggleName[OVERVIEW_TOGGLES.BREAKDOWN_TABLE],
      hasRanking: featuresListByToggleName[OVERVIEW_TOGGLES.RANKING],
    };

    const chartData = Object.assign(
      {},
      ...Object.values(kpiRequests.charts).map((chart) => chart.data),
    );

    const loadingCharts = Object.values(kpiRequests.charts).some(
      (chart) => chart.loading,
    );

    if (chartData) {
      Object.values(chartData).forEach((content) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        applyChartsConfigs(content as any);
      });
    }

    const { data: tableData, loading: loadingTable } = kpiRequests.table;
    const { data: rankingData, loading: loadingRanking } = kpiRequests.ranking;

    if (rankingData) {
      Object.values(rankingData).forEach((content) => {
        applyRankingConfigs(content);
      });
    }

    return {
      charts: {
        data: chartData,
        loading: loadingCharts,
        available: sectionFeatures.hasCharts,
      },
      table: {
        data: tableData,
        rawData: tableData,
        loading: loadingTable,
        available: sectionFeatures.hasTable,
      },
      ranking: {
        data: rankingData,
        loading: loadingRanking,
        available: sectionFeatures.hasRanking,
      },
    };
  }, [kpiRequests, featuresListByToggleName]);

  const isReady = togglesReady && abTestReady;
  const isBreakdownViewer = isGroupA || isControl;

  return {
    dataSource,
    isReady,
    isBreakdownViewer,
    activeDeepDiveSubfilter,
  };
};
