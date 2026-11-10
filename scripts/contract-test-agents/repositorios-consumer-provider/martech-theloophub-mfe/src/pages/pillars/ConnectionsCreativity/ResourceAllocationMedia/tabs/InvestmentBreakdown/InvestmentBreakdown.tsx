import React from 'react';
import { useIntl } from 'react-intl';

import { Alert, BasicContainer, CountryFlag } from 'components';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { usePageFilterApplied } from 'hooks';
import { InvestmentBreakdownContainer } from 'pages/components';
import { StyledTooltip } from 'shared/Styles';

import { RESOURCE_ALLOCATION_MEDIA_PAGE_NAME } from '../../ResourceAllocationMedia';
import { useKpiRequests } from './hooks/useKpiRequests';

export interface InvestmentBreakdownProps {
  dataTestId?: string;
}

export const InvestmentBreakdown: React.FC<InvestmentBreakdownProps> = ({
  dataTestId,
}) => {
  useDataRefreshForTab('Resource Allocation - Investment Breakdown');
  const { formatMessage } = useIntl();
  const { applied } = usePageFilterApplied(RESOURCE_ALLOCATION_MEDIA_PAGE_NAME);
  const { data, loading, error } = useKpiRequests();

  const countrySelected = applied?.country;

  return (
    <BasicContainer
      dataTestId={dataTestId ? `${dataTestId}-investment-breakdown` : undefined}
      header={{
        title: formatMessage({
          id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.title',
        }),
        titleSize: 'H2',
        tooltip: (
          <StyledTooltip
            data-testid={
              dataTestId
                ? `${dataTestId}-investment-breakdown-tooltip`
                : undefined
            }
            size="small"
          >
            {formatMessage({
              id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.tooltip',
            })}
          </StyledTooltip>
        ),
        rightContent: <CountryFlag />,
      }}
      layout={{
        border: 'small',
        headerPadding: 'small',
        bodyPadding: true,
      }}
    >
      {countrySelected === 'USA' && (
        <div style={{ marginBottom: '16px', marginTop: '-16px' }}>
          <Alert
            dataTestId={
              dataTestId
                ? `${dataTestId}-investment-breakdown-alert`
                : undefined
            }
            type="warning"
            title={formatMessage({
              id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.USA.alert.title',
            })}
            message={formatMessage({
              id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.USA.alert.message',
            })}
          />
        </div>
      )}

      <div className="target">
        {error ? (
          <Alert
            dataTestId={
              dataTestId
                ? `${dataTestId}-investment-breakdown-error`
                : undefined
            }
            type="error"
            title={formatMessage({
              id: 'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.error.title',
              defaultMessage: 'Error loading data',
            })}
            message={error.message}
          />
        ) : (
          <InvestmentBreakdownContainer
            dataTestId={
              dataTestId
                ? `${dataTestId}-investment-breakdown-container`
                : undefined
            }
            data={data?.investment_breakdown}
            loading={loading}
          />
        )}
      </div>
    </BasicContainer>
  );
};
