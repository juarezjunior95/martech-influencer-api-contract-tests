import { IntlFormatters } from 'react-intl';

import { NoDataYet } from 'components';
import { Skeleton } from 'components/Skeleton/Skeleton';
import {
  MediaKpisCards,
  MediaRankingSection,
} from 'pages/components/ConnectionsCreativity';
import {
  ResourceAllocationChart,
  ResourceAllocationOverview,
} from 'pages/pillars/ConnectionsCreativity/ResourceAllocationMedia/tabs/Overview/types';

import { StyledResourceAllocationSlideRoot } from './ResourceAllocationMediaSlideContent.styles';

export interface ResourceAllocationMediaSlideContentProps {
  overviewData: ResourceAllocationOverview | null;
  overviewLoading: boolean;
  rankingKpiData: ResourceAllocationChart | Record<string, unknown> | null;
  rankingLoading: boolean;
  activeRankingSubfilter: string;
  isGlobalZone: boolean;
  formatMessage: IntlFormatters['formatMessage'];
  dataTestId?: string;
}

export const ResourceAllocationMediaSlideContent = ({
  overviewData,
  overviewLoading,
  rankingKpiData,
  rankingLoading,
  activeRankingSubfilter,
  isGlobalZone,
  formatMessage,
  dataTestId,
}: ResourceAllocationMediaSlideContentProps) => {
  return (
    <StyledResourceAllocationSlideRoot
      data-testid={dataTestId ? `${dataTestId}-root` : undefined}
    >
      {overviewLoading ? (
        <Skeleton
          length={1}
          width="100%"
          height="320px"
          dataTestId={
            dataTestId ? `${dataTestId}-overview-skeleton` : undefined
          }
        />
      ) : (
        overviewData && (
          <MediaKpisCards
            data={overviewData}
            formatMessage={formatMessage}
            dataTestId={dataTestId ? `${dataTestId}-kpis` : undefined}
            minWidth="400"
          />
        )
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          backgroundColor: 'white',
          border: '1px solid #1414141f',
          borderRadius: '16px',
          width: '100%',
        }}
      >
        {(rankingKpiData as any)?.megabrands?.[
          'owr_resource-allocation_overview_ranking-chart_megabrands'
        ]?.datasets?.length === 0 ? (
          <div>
            <NoDataYet />
          </div>
        ) : (
          <MediaRankingSection
            showLegend={false}
            chartHeight="286px"
            rankingKpiData={rankingKpiData}
            loadingRanking={rankingLoading}
            activeRankingSubfilter={activeRankingSubfilter}
            isGlobalZone={isGlobalZone}
            formatMessage={formatMessage}
            dataTestId={dataTestId ? `${dataTestId}-ranking` : undefined}
          />
        )}
      </div>
    </StyledResourceAllocationSlideRoot>
  );
};
