import { useMemo } from 'react';

import { useBffData } from 'hooks';
import type { UseBffDataResponse } from 'hooks/useBffData/useBffData';
import {
  ResourceAllocationChart,
  ResourceAllocationData,
  ResourceAllocationOverview,
} from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/types';
import { applyChartsConfigs } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/utils/chartsUtils';
import { applyRankingConfigs } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/utils/rankingUtils';

const ACTIVE_RANKING_SUBFILTER = 'megabrands';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value != null && typeof value === 'object';

const hasTotalPerYearFull = (
  value: Record<string, unknown>,
): value is Record<string, unknown> & { total_per_year_full: unknown } =>
  'total_per_year_full' in value;

const isResourceAllocationData = (
  raw: unknown,
): raw is ResourceAllocationData =>
  isRecord(raw) &&
  (hasTotalPerYearFull(raw) ||
    'datasets' in raw ||
    'empty' in raw ||
    'labels' in raw ||
    'overview_graph' in raw ||
    'title' in raw ||
    'variation_caption' in raw);

const isResourceAllocationChartNode = (
  value: unknown,
): value is ResourceAllocationChart =>
  isRecord(value) && ('datasets' in value || 'total_per_year_full' in value);

const isNonEmptyResourceAllocationData = (
  content: ResourceAllocationData,
): boolean => !('empty' in content && content.empty);

const RA_OVERVIEW_BFF_VIEW = {
  mediaSpend:
    'connections-and-creativity_resource-allocation-media_overview_media-spend',
  megaBrands:
    'connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa',
  campaigns:
    'connections-and-creativity_resource-allocation-media_overview_campaigns-qwoa',
  resourceAllocation:
    'connections-and-creativity_resource-allocation-media_overview_non-working-money',
  ranking:
    'connections-and-creativity_resource-allocation-media_overview_megabrands-qwoa-ranking',
} as const;

type OverviewCardKey = keyof ResourceAllocationOverview;

export interface UseVolumePprResourceAllocationOverviewResult {
  overviewData: ResourceAllocationOverview | null;
  overviewLoading: boolean;
  overviewError: Error | null;
  rankingKpiData: ResourceAllocationChart | Record<string, unknown> | null;
  rankingLoading: boolean;
  rankingError: Error | null;
  activeRankingSubfilter: string;
}

export const useVolumePprResourceAllocationOverview =
  (): UseVolumePprResourceAllocationOverviewResult => {
    const mediaSpend = useBffData({
      id: RA_OVERVIEW_BFF_VIEW.mediaSpend,
      kpiGroup: 'media',
    });

    const megaBrands = useBffData({
      id: RA_OVERVIEW_BFF_VIEW.megaBrands,
      kpiGroup: 'media',
    });

    const campaigns = useBffData({
      id: RA_OVERVIEW_BFF_VIEW.campaigns,
      kpiGroup: 'media',
    });

    const resourceAllocation = useBffData({
      id: RA_OVERVIEW_BFF_VIEW.resourceAllocation,
      kpiGroup: 'media',
    });

    const ranking = useBffData({
      id: RA_OVERVIEW_BFF_VIEW.ranking,
      kpiGroup: 'media',
      subFilters: {
        kpi_name: ACTIVE_RANKING_SUBFILTER,
      },
    });

    const chartRequests = useMemo(
      () => ({
        mediaSpend,
        megaBrands,
        campaigns,
        resourceAllocation,
      }),
      [mediaSpend, megaBrands, campaigns, resourceAllocation],
    );

    const merged = useMemo(() => {
      const bffKpi = (
        data: UseBffDataResponse['data'],
        viewId: string,
        kpiKey: string,
      ) => {
        if (!isRecord(data)) return undefined;

        const viewPayload = data[viewId];

        return data[kpiKey] ?? (isRecord(viewPayload) && viewPayload[kpiKey]);
      };

      const cardContent = (raw: unknown): ResourceAllocationData | null => {
        if (!isRecord(raw)) return null;
        if (isResourceAllocationData(raw)) return raw;
        const nested = Object.values(raw).find(isResourceAllocationData);
        return nested ?? null;
      };

      const CARD_SPECS: [
        OverviewCardKey,
        UseBffDataResponse['data'],
        string,
        string,
      ][] = [
        [
          'media_spend',
          mediaSpend.data,
          RA_OVERVIEW_BFF_VIEW.mediaSpend,
          'media_spend_index',
        ],
        [
          'mega_brands',
          megaBrands.data,
          RA_OVERVIEW_BFF_VIEW.megaBrands,
          'megabrands_qwoa',
        ],
        [
          'campaigns',
          campaigns.data,
          RA_OVERVIEW_BFF_VIEW.campaigns,
          'campaigns_qwoa',
        ],
        [
          'non_working_money',
          resourceAllocation.data,
          RA_OVERVIEW_BFF_VIEW.resourceAllocation,
          'non_working_money',
        ],
      ];

      const chartData: ResourceAllocationOverview = {};
      for (const [key, data, viewId, kpiKey] of CARD_SPECS) {
        const content = cardContent(bffKpi(data, viewId, kpiKey));
        if (content) chartData[key] = content;
      }

      const hasAnyChartData = Object.keys(chartData).length > 0;
      const overviewLoading = Object.values(chartRequests).some(
        (c) => c.loading,
      );
      const overviewError =
        Object.values(chartRequests).find((c) => c.error)?.error ?? null;

      if (hasAnyChartData) {
        Object.values(chartData).forEach((content) => {
          if (isNonEmptyResourceAllocationData(content)) {
            applyChartsConfigs(content);
          }
        });
      }

      const rankingPayload = bffKpi(
        ranking.data,
        RA_OVERVIEW_BFF_VIEW.ranking,
        'megabrands_qwoa_ranking',
      );

      let rankingKpiData:
        ResourceAllocationChart | Record<string, unknown> | null = null;
      if (isRecord(rankingPayload)) {
        rankingKpiData =
          ACTIVE_RANKING_SUBFILTER in rankingPayload
            ? rankingPayload
            : { [ACTIVE_RANKING_SUBFILTER]: rankingPayload };
      }

      const applyRankingDeep = (node: unknown): void => {
        if (!isRecord(node)) return;
        if ('empty' in node && node.empty) return;
        if (isResourceAllocationChartNode(node)) {
          applyRankingConfigs(node);
          return;
        }
        Object.values(node).forEach(applyRankingDeep);
      };

      if (
        rankingKpiData &&
        typeof rankingKpiData === 'object' &&
        !('empty' in rankingKpiData && rankingKpiData.empty)
      ) {
        applyRankingDeep(rankingKpiData);
      }

      return {
        overviewData: hasAnyChartData ? chartData : null,
        overviewLoading,
        overviewError,
        rankingKpiData,
        rankingLoading: ranking.loading,
        rankingError: ranking.error,
      };
    }, [
      chartRequests,
      ranking,
      mediaSpend.data,
      megaBrands.data,
      campaigns.data,
      resourceAllocation.data,
    ]);

    return {
      ...merged,
      activeRankingSubfilter: ACTIVE_RANKING_SUBFILTER,
    };
  };
