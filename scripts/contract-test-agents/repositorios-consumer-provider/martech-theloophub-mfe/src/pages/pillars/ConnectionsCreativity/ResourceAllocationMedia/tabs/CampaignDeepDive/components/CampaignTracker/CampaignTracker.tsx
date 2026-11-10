import { IntlFormatters } from 'react-intl';

import { Heading } from '@hexa-ui/components';
import { ChartLegend, Table } from 'components';
import { TableDataType } from 'components/Table/types';

import { configs } from '../../config/tableConfig/tableConfig';
import { CAMPAIGN_TRACKER_LEGEND } from '../../constants';
import { getRowHeightCallback } from '../../utils/utils';
import {
  StyledCampaignTrackerContainer,
  StyledCampaignTrackerHeading,
  StyledCampaignTrackerLegend,
  StyledCampaignTrackerTable,
} from './CampaignTracker.styles';

interface CampaignTrackerProps {
  formatMessage: IntlFormatters['formatMessage'];
  table: TableDataType;
  dataTestId?: string;
}

export const CampaignTracker = ({
  table,
  formatMessage,
  dataTestId,
}: CampaignTrackerProps) => {
  return (
    <StyledCampaignTrackerContainer
      data-testid={dataTestId ? `campaign-tracker-${dataTestId}` : undefined}
    >
      <StyledCampaignTrackerHeading
        data-testid={
          dataTestId ? `campaign-tracker-heading-${dataTestId}` : undefined
        }
      >
        <Heading
          data-testid={
            dataTestId ? `campaign-tracker-heading-${dataTestId}` : undefined
          }
          size="H5"
        >
          {formatMessage({
            id: 'ConnectionsCreativity.ResourceAllocationMedia.CampaignDeepDiveTab.CampaignsPerformance.campaignTracker.title',
          })}
        </Heading>
      </StyledCampaignTrackerHeading>
      <Table
        data={table}
        headerHeight={56}
        columnDefsConfig={configs}
        style={StyledCampaignTrackerTable}
        getRowHeightCallback={getRowHeightCallback}
        dataTestId={dataTestId ? `${dataTestId}-campaign-tracker` : undefined}
      />
      <StyledCampaignTrackerLegend
        data-testid={
          dataTestId ? `campaign-tracker-legend-${dataTestId}` : undefined
        }
      >
        <ChartLegend
          dataTestId={dataTestId ? `${dataTestId}-campaign-tracker` : undefined}
          items={CAMPAIGN_TRACKER_LEGEND}
        />
      </StyledCampaignTrackerLegend>
    </StyledCampaignTrackerContainer>
  );
};
