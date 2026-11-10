import { IntlFormatters } from 'react-intl';

import { Heading } from '@hexa-ui/components';

interface CampaignsPerformanceHeaderProps {
  formatMessage: IntlFormatters['formatMessage'];
  dataTestId?: string;
}

export const CampaignsPerformanceHeader = ({
  formatMessage,
  dataTestId,
}: CampaignsPerformanceHeaderProps) => {
  return (
    <Heading
      size="H3"
      data-testid={
        dataTestId ? `campaigns-performance-header-${dataTestId}` : undefined
      }
    >
      {formatMessage({
        id: 'ConnectionsCreativity.ResourceAllocationMedia.CampaignDeepDiveTab.CampaignsPerformance.title',
      })}
    </Heading>
  );
};
