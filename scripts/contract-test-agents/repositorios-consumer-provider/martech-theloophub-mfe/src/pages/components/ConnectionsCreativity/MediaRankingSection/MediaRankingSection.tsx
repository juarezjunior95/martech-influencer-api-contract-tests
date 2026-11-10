import { IntlFormatters } from 'react-intl';

import { Legend } from 'components';
import { Skeleton } from 'components/Skeleton/Skeleton';
import { FilterValue } from 'models/Filters';
import { LEGEND_CONFIG } from 'pages/constants';
import {
  RA_DEEP_DIVE_SUBFILTER,
  VIEW_TYPES,
} from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/constants';
import {
  ResourceAllocationChart,
  ResourceAllocationData,
} from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/types';
import { getDeepDiveHeaderMessage } from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/utils/deepDiveHeaderUtils';

import { DeepDiveChartHeader } from '../DeepDiveChartHeader/DeepDiveChartHeader';
import { RankingChart } from '../RankingChart/RankingChart';

interface MediaRankingSectionProps {
  rankingKpiData: ResourceAllocationChart | Record<string, unknown> | null;
  loadingRanking: boolean;
  activeRankingSubfilter: string;
  isGlobalZone: boolean;
  showLegend?: boolean;
  chartHeight?: string;
  formatMessage: IntlFormatters['formatMessage'];
  dataTestId?: string;
}

const buildActiveSubFilters = (
  activeRankingSubfilter: string,
): Record<string, FilterValue> => ({
  [RA_DEEP_DIVE_SUBFILTER]: activeRankingSubfilter,
});

export const MediaRankingSection = ({
  rankingKpiData,
  loadingRanking,
  activeRankingSubfilter,
  isGlobalZone,
  showLegend = true,
  chartHeight = '350px',
  formatMessage,
  dataTestId,
}: MediaRankingSectionProps) => {
  const activeSubFilters = buildActiveSubFilters(activeRankingSubfilter);

  const bySubfilter = rankingKpiData as
    Record<string, ResourceAllocationData> | null | undefined;
  const rankingData = bySubfilter?.[activeRankingSubfilter];

  const extractedChartData: ResourceAllocationData | undefined =
    rankingData && typeof rankingData === 'object' && !rankingData.datasets
      ? (Object.values(rankingData)[0] as ResourceAllocationData)
      : rankingData;

  const rankingHeaderMessage = getDeepDiveHeaderMessage({
    activeSubFilters,
    isGlobalZone,
    data: rankingData,
    formatMessage,
    selectedView: VIEW_TYPES.RANKING,
  });

  if (loadingRanking) {
    return (
      <Skeleton
        length={1}
        width="100%"
        height="450px"
        dataTestId={dataTestId ? `skeleton-${dataTestId}` : undefined}
      />
    );
  }

  return (
    <div
      style={{
        marginBottom: extractedChartData?.datasets?.[0]?.baseChartColor
          ? '8px'
          : '24px',
        width: '100%',
      }}
      data-testid={dataTestId ? `${dataTestId}-ranking-wrapper` : undefined}
    >
      <DeepDiveChartHeader
        title={rankingHeaderMessage.title}
        measure={rankingHeaderMessage.measure}
        tooltip={rankingHeaderMessage.tooltip}
        dataTestId={
          dataTestId ? `${dataTestId}-ranking-view-header` : undefined
        }
      />

      <RankingChart
        data={rankingData}
        labelIconTooltip={rankingHeaderMessage.labelIconTooltip}
        horizontalDashedLineTooltip={
          rankingHeaderMessage.horizontalDashedLineTooltip
        }
        chartHeight={chartHeight}
        dataTestId={dataTestId}
      />

      {showLegend && extractedChartData?.datasets?.[0]?.baseChartColor && (
        <div
          style={{ display: 'flex', marginLeft: '24px' }}
          data-testid={
            dataTestId ? `${dataTestId}-ranking-legend-wrapper` : undefined
          }
        >
          <Legend
            legendPosition="left"
            caption={LEGEND_CONFIG.map((item) => ({
              ...item,
              pointStyle: 'roundedRectangle',
            }))}
            dataTestId={dataTestId ? `${dataTestId}-ranking-legend` : undefined}
          />
        </div>
      )}
    </div>
  );
};
