import React from 'react';
import { useIntl } from 'react-intl';

import { Expandable, NoResultsState } from 'components';
import { FILTER_MODAL_NAME } from 'components/Filter';
import NoDataYet from 'components/NoDataYet/NoDataYet';
import { TableDataType } from 'components/Table/types';
import { useScopedModal } from 'contexts';
import { usePageFilterApplied } from 'hooks';
import { composeTestId } from 'utils';

import { RESOURCE_ALLOCATION_MEDIA_PAGE_NAME } from '../../../../ResourceAllocationMedia';
import { CampaignsPerformanceHeader } from '../CampaignsPerformanceHeader/CampaignsPerformanceHeader';
import { CampaignsPerformanceSkeleton } from '../CampaignsPerformanceSkeleton/CampaignsPerformanceSkeleton';
import { CampaignTracker } from '../CampaignTracker/CampaignTracker';
import { StyledNoDataAvailable } from './CampaignsPerformance.styles';

interface CampaignsPerformanceProps {
  campaignsPerformance: {
    campaigns_performance: TableDataType;
    loading: boolean;
  };
  dataTestId?: string;
}

interface CampaignsPerformanceContentProps {
  data: TableDataType;
  loading: boolean;
  formatMessage: ReturnType<typeof useIntl>['formatMessage'];
  dataTestId?: string;
}

const CampaignsPerformanceContent = ({
  data,
  loading,
  formatMessage,
  dataTestId,
}: CampaignsPerformanceContentProps) => {
  if (loading) {
    return (
      <CampaignsPerformanceSkeleton
        dataTestId={composeTestId(dataTestId, 'campaigns-performance')}
      />
    );
  }

  if (data) {
    return (
      <CampaignTracker
        dataTestId={composeTestId(dataTestId, 'campaign-tracker')}
        table={data}
        formatMessage={formatMessage}
      />
    );
  }

  return (
    <StyledNoDataAvailable
      data-testid={
        dataTestId
          ? `campaigns-performance-no-data-available-${dataTestId}`
          : undefined
      }
    >
      <NoDataYet
        dataTestId={composeTestId(dataTestId, 'campaigns-performance')}
      />
    </StyledNoDataAvailable>
  );
};

export const CampaignsPerformance = React.memo(
  ({ campaignsPerformance, dataTestId }: CampaignsPerformanceProps) => {
    const data = campaignsPerformance.campaigns_performance;
    const { formatMessage } = useIntl();
    const { open } = useScopedModal(FILTER_MODAL_NAME);
    const { isGlobalZone } = usePageFilterApplied(
      RESOURCE_ALLOCATION_MEDIA_PAGE_NAME,
    );

    const headerComponent = React.useMemo(
      () => <CampaignsPerformanceHeader formatMessage={formatMessage} />,
      [formatMessage],
    );

    const noResultsState = React.useMemo(
      () => (
        <NoResultsState
          dataTestId={composeTestId(
            dataTestId,
            'campaigns-performance-no-results-state',
          )}
          type={'investmentBreakdown'}
          openModal={open}
          headerTitleId="ConnectionsCreativity.NoCountrySelected.noCountrySelectedTitle"
          descriptionId="ConnectionsCreativity.NoCountrySelected.noCountrySelectedDescription"
          buttonTextId="ConnectionsCreativity.NoCountrySelected.selectACountry"
        />
      ),
      [open, dataTestId],
    );

    return (
      <Expandable.Item
        id="overview-deep-dive"
        expand="none"
        expandedHeaderHeight="70px"
        borderBottom="hidden"
        headerCustomized={headerComponent}
        dataTestId={composeTestId(dataTestId, 'campaigns-performance')}
        expandableChildren={
          isGlobalZone ? (
            noResultsState
          ) : (
            <div>
              <CampaignsPerformanceContent
                data={data}
                loading={campaignsPerformance.loading}
                formatMessage={formatMessage}
                dataTestId={dataTestId}
              />
            </div>
          )
        }
      />
    );
  },
);

CampaignsPerformance.displayName = 'CampaignsPerformance';
