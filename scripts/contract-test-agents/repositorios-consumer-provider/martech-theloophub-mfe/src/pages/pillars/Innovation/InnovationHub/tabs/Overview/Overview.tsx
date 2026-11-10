import React from 'react';
import { useIntl } from 'react-intl';

import { BasicContainer } from 'components';
import { useMediaQuery } from 'hooks';

import { TotalInnovationPerformance } from './components';
import { INNOVATION_HUB_OVERVIEW_GLOBAL_TOTAL_PERFORMANCE_TITLE_I18N_ID } from './constants';
import { StyledOverviewBody } from './Overview.styles';

interface OverviewProps {
  dataTestId?: string;
}

export const Overview: React.FC<OverviewProps> = ({ dataTestId }) => {
  const { formatMessage } = useIntl();
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');

  const containerDataTestId = dataTestId
    ? `${dataTestId}-container`
    : 'innovation-hub-overview-container';

  return (
    <BasicContainer
      dataTestId={containerDataTestId}
      fullWidth
      header={{
        title: formatMessage({
          id: INNOVATION_HUB_OVERVIEW_GLOBAL_TOTAL_PERFORMANCE_TITLE_I18N_ID,
        }),
        titleSize: isDesktopLarge ? 'H2' : 'H3',
      }}
      layout={{
        background: '#fafafa',
        border: 'gray',
        bodyPadding: false,
      }}
    >
      <StyledOverviewBody>
        <TotalInnovationPerformance
          dataTestId={
            dataTestId
              ? `${dataTestId}-total-innovation-performance`
              : 'innovation-hub-overview-total-innovation-performance'
          }
        />
      </StyledOverviewBody>
    </BasicContainer>
  );
};
