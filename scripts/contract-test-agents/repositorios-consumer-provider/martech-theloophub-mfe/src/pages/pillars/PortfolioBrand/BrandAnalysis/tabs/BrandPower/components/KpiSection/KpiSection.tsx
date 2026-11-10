import React from 'react';
import { useIntl } from 'react-intl';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components';
import { ChartData } from 'pages/components/ChartWithCaption/types';
import { KpiConfig } from 'pages/types';
import { StyledHeader, StyledTitle, StyledTooltip } from 'shared/Styles';

import { Chart } from '../Chart/Chart';

interface KpiSectionProps {
  kpi: KpiConfig;
  loading: boolean;
  data: ChartData[];
  subFilter?: React.ReactElement;
  dataTestId?: string;
}

export const KpiSection: React.FC<KpiSectionProps> = ({
  kpi,
  loading,
  data,
  subFilter,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <StyledHeader
        data-testid={dataTestId ? `${dataTestId}-header` : undefined}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <StyledTitle size="H4">
            {formatMessage({
              id: kpi.title,
              defaultMessage: '',
            })}
          </StyledTitle>
          <CustomTooltip
            content={
              <StyledTooltip size="small">
                {formatMessage({
                  id: kpi.tooltip.content,
                  defaultMessage: '',
                })}
              </StyledTooltip>
            }
          >
            <Icon size="small" icon={Info} />
          </CustomTooltip>
        </div>

        {subFilter}
      </StyledHeader>
      <Chart loading={loading} chartList={data} />
    </>
  );
};
