import { useIntl } from 'react-intl';

import { CalendarClock } from '@hexa-ui/icons';
import { BasicContainer, CountryFlag, Tag } from 'components';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { StyledTooltip } from 'shared/Styles';

import { DeepDiveView, SummaryView } from './components';
import { useOverviewDataSource } from './hooks/useOverviewDataSource';
import { StyledOverviewContainer } from './Overview.styles';

export interface OverviewProps {
  dataTestId?: string;
}

export const Overview = ({ dataTestId }: OverviewProps) => {
  useDataRefreshForTab('Resource Allocation - Overview');
  const { formatMessage } = useIntl();
  const { lastDataRefreshKpisFormated } = useLastDataRefresh();
  const lastDataRefresh = lastDataRefreshKpisFormated?.media;

  const { dataSource, isReady, isBreakdownViewer, activeDeepDiveSubfilter } =
    useOverviewDataSource();

  if (!isReady) {
    return null;
  }

  return (
    <BasicContainer
      dataTestId={dataTestId}
      header={{
        title: formatMessage({
          id: 'ConnectionsCreativity.ResourceAllocationMedia.Overview.title',
        }),
        tooltip: (
          <StyledTooltip
            size="small"
            data-testid={dataTestId ? `${dataTestId}-tooltip` : undefined}
          >
            {formatMessage({
              id: 'ConnectionsCreativity.ResourceAllocationMedia.Overview.tooltip',
            })}
          </StyledTooltip>
        ),
        titleSize: 'H2',
        rightContent: <CountryFlag dataTestId={dataTestId} />,
        bottomTag: lastDataRefresh ? (
          <Tag
            Icon={CalendarClock}
            text={`: ${lastDataRefresh}`}
            dataTestId={
              dataTestId ? `${dataTestId}-last-data-refresh-tag` : undefined
            }
          />
        ) : null,
      }}
      layout={{
        border: 'small',
        shadow: 'small',
        headerPadding: 'small',
        bodyPadding: true,
      }}
    >
      <StyledOverviewContainer
        data-testid={dataTestId ? `${dataTestId}-container` : undefined}
      >
        <SummaryView charts={dataSource.charts} dataTestId={dataTestId} />
        <DeepDiveView
          dataSource={dataSource}
          activeDeepDiveSubfilter={activeDeepDiveSubfilter}
          isBreakdownViewer={isBreakdownViewer}
          data-testid="deep-dive-view"
          dataTestId={dataTestId}
        />
      </StyledOverviewContainer>
    </BasicContainer>
  );
};
