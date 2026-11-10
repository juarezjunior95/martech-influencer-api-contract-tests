import React, { useMemo } from 'react';

import { Paragraph } from '@hexa-ui/components';
import { CalendarClock } from '@hexa-ui/icons';
import { CountryFlag, Expandable, Legend, Skeleton, Tag } from 'components';
import { BasicContainer } from 'components/BasicContainer';
import { BubbleChart } from 'components/Chart/Bubble';
import { useLastDataRefresh } from 'contexts';
import { useSubFilters } from 'hooks';
import { StyledNoDataYet } from 'shared/Styles';

import noDataYetIcon from '../../../../../../assets/NoDataYet.svg';
import { BubbleHeader } from './components/BubbleChartHeader/BubbleChartHeader';
import { RA_BUBBLE_SUBFILTER } from './constants';
import { useKpiRequests } from './hooks/useKpiRequests';

export interface MediaDrilldoownProps {
  dataTestId?: string;
}

export const MediaDrilldoown: React.FC<MediaDrilldoownProps> = ({
  dataTestId,
}) => {
  const { lastDataRefreshKpisFormated } = useLastDataRefresh();
  const lastDataRefresh = lastDataRefreshKpisFormated?.media;
  const { activeSubFilters } = useSubFilters();

  const activeMediaDrilldoownSubfilter = useMemo(
    () => activeSubFilters?.[RA_BUBBLE_SUBFILTER] as string,
    [activeSubFilters],
  );

  const kpiRequests = useKpiRequests();

  const chartData = Object.assign(
    {},
    ...Object.values(kpiRequests.charts).map((chart) => chart.data),
  );
  const loadingCharts = Object.values(kpiRequests.charts).some(
    (chart) => chart.loading,
  );

  const dataSource = {
    charts: {
      data: chartData,
      loading: loadingCharts,
    },
  };

  const renderChartContent = (chartData, activeSubfilter) => {
    if (chartData?.empty) {
      return (
        <StyledNoDataYet
          data-testid={
            dataTestId ? `${dataTestId}-media-drilldown-no-data-yet` : undefined
          }
          style={{ height: '580px', width: '1280px' }}
        >
          <img
            data-testid={
              dataTestId
                ? `media-drilldown-no-data-yet-icon-${dataTestId}`
                : undefined
            }
            src={noDataYetIcon}
            alt="no data yet"
          />
          <Paragraph
            data-testid={
              dataTestId
                ? `media-drilldown-no-data-yet-text-${dataTestId}`
                : undefined
            }
          >
            {' '}
            Data not available
          </Paragraph>
        </StyledNoDataYet>
      );
    } else {
      return (
        <BubbleChart
          dataTestId={
            dataTestId
              ? `${dataTestId}-media-drilldown-bubble-chart`
              : undefined
          }
          data={chartData.Chart}
          key={activeSubfilter}
        />
      );
    }
  };

  return (
    <BasicContainer
      header={{
        title: 'Media Drilldown',
        titleSize: 'H2',
        bottomTag: lastDataRefresh ? (
          <Tag Icon={CalendarClock} text={`: ${lastDataRefresh}`} />
        ) : null,
        rightContent: <CountryFlag />,
      }}
      layout={{
        border: 'small',
        headerPadding: 'small',
        bodyPadding: true,
      }}
      data-testid={dataTestId ? `media-drilldown-${dataTestId}` : undefined}
    >
      <Expandable.Item
        dataTestId={
          dataTestId
            ? `${dataTestId}-media-drilldown-expandable-item`
            : undefined
        }
        id="media-drilldown"
        expand="none"
        expandedHeaderHeight="72px"
        headerCustomized={<BubbleHeader />}
        expandableChildren={
          <>
            {!dataSource.charts.loading &&
            dataSource.charts.data?.[activeSubFilters.kpis] ? (
              renderChartContent(
                dataSource.charts.data[activeSubFilters.kpis],
                activeMediaDrilldoownSubfilter,
              )
            ) : (
              <Skeleton
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-media-drilldown-skeleton`
                    : undefined
                }
                height="580px"
                width="1280px"
                length={1}
              />
            )}
          </>
        }
      />
      {!dataSource.charts.loading &&
      dataSource?.charts?.data?.[activeSubFilters.kpis]?.Legend ? (
        <Legend
          dataTestId={
            dataTestId ? `${dataTestId}-media-drilldown-legend` : undefined
          }
          legendPosition="left"
          caption={dataSource.charts.data[activeSubFilters.kpis].Legend}
        />
      ) : null}
    </BasicContainer>
  );
};
