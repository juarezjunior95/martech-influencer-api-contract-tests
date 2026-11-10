import { useIntl } from 'react-intl';

import { CalendarClock } from '@hexa-ui/icons2';
import { BasicContainer, CountryFlag, Tag } from 'components';
import { useLastDataRefresh } from 'contexts';

import { StyledCampaignDeepDiveContainer } from './CampaignDeepDive.styles';
import { CampaignsPerformance } from './components';
import { useKpiRequests } from './hooks/useKpiRequests';

export interface CampaignDeepDiveProps {
  dataTestId?: string;
}

export const CampaignDeepDive = ({ dataTestId }: CampaignDeepDiveProps) => {
  const { formatMessage } = useIntl();
  const { lastDataRefreshKpisFormated } = useLastDataRefresh();
  const lastDataRefresh = lastDataRefreshKpisFormated?.media;

  const campaignsPerformance = useKpiRequests();

  return (
    <BasicContainer
      dataTestId={dataTestId ? `${dataTestId}-campaign-deep-dive` : undefined}
      header={{
        title: formatMessage({
          id: 'ConnectionsCreativity.ResourceAllocationMedia.CampaignDeepDiveTab.title',
        }),

        titleSize: 'H2',
        rightContent: <CountryFlag />,
        bottomTag: lastDataRefresh ? (
          <Tag Icon={CalendarClock} text={`: ${lastDataRefresh}`} />
        ) : null,
      }}
      layout={{
        border: 'small',
        shadow: 'small',
        headerPadding: 'small',
        bodyPadding: true,
      }}
    >
      <StyledCampaignDeepDiveContainer
        data-testid={
          dataTestId ? `campaign-deep-dive-container-${dataTestId}` : undefined
        }
      >
        <CampaignsPerformance
          dataTestId={
            dataTestId ? `${dataTestId}-campaigns-performance` : undefined
          }
          campaignsPerformance={{
            campaigns_performance:
              campaignsPerformance.data?.campaigns_performance,
            loading: campaignsPerformance.loading,
          }}
        />
      </StyledCampaignDeepDiveContainer>
    </BasicContainer>
  );
};
