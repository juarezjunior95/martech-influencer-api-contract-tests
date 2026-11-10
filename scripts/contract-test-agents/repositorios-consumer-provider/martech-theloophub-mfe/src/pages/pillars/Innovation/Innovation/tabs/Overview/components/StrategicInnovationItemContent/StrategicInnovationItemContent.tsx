import { NoResultsState } from 'components';
import NoDataYet from 'components/NoDataYet/NoDataYet';

import { NO_RESULTS_STATE_KPIS } from '../../constants';
import { StrategicInnovationData } from '../../types';
import { StrategicInnovationChartSection } from '../StrategicInnovationChartSection/StrategicInnovationChartSection';
import { StrategicInnovationPortfolio } from '../StrategicInnovationPortfolio/StrategicInnovationPortfolio';
import {
  StyledNoDataYet,
  StyledNoResultsStateContainer,
  StyledStrategicInnovationItemContent,
} from './StrategicInnovationItemContent.styles';

interface StrategicInnovationItemContentProps {
  item: StrategicInnovationData;
  dataTestId?: string;
}

const formatTestId = (
  base: string | undefined,
  template: string,
): string | undefined => (base ? template.replace('{}', base) : undefined);

const renderNoResultsState = (dataTestId?: string) => (
  <StyledNoResultsStateContainer
    data-testid={formatTestId(dataTestId, '{}-no-results-state')}
  >
    <NoResultsState
      type="strategicInnovationPillars"
      openModal={null}
      descriptionId="Innovation.Innovation.Overview.StrategicInnovationPillars.noDataAvailable"
      overrides={{
        container: { height: '100%' },
        image: { height: '128px', width: '128px' },
        paragraph: { fontSize: '12px' },
      }}
      dataTestId={formatTestId(dataTestId, '{}-no-results-state-content')}
    />
  </StyledNoResultsStateContainer>
);

export const StrategicInnovationItemContent = ({
  item,
  dataTestId,
}: StrategicInnovationItemContentProps) => {
  if (NO_RESULTS_STATE_KPIS.includes(item.id)) {
    return renderNoResultsState(dataTestId);
  }

  const isPortfolio = item.id === 'portfolio';
  const hasPortfolioHealth =
    isPortfolio && !!item?.health && Object.keys(item.health).length > 0;

  if (hasPortfolioHealth) {
    return (
      <StyledStrategicInnovationItemContent
        data-testid={formatTestId(dataTestId, '{}-content')}
      >
        <StrategicInnovationPortfolio
          data={item.health}
          dataTestId={formatTestId(dataTestId, '{}-portfolio')}
        />
        {renderNoResultsState(dataTestId)}
      </StyledStrategicInnovationItemContent>
    );
  }

  const hasChartSection =
    !!item.chartSection && Object.keys(item.chartSection).length > 0;

  if (!hasChartSection && item.noticeMessage) {
    return (
      <StyledNoDataYet
        data-testid={formatTestId(
          dataTestId,
          '{}-no-data-yet-for-this-country-container',
        )}
      >
        <NoDataYet
          dataTestId={formatTestId(
            dataTestId,
            '{}-no-data-yet-for-this-country',
          )}
          description={item.noticeMessage}
        />
      </StyledNoDataYet>
    );
  }

  if (!hasChartSection || item.empty) {
    return (
      <StyledNoDataYet
        data-testid={formatTestId(dataTestId, '{}-no-data-yet-container')}
      >
        <NoDataYet dataTestId={formatTestId(dataTestId, '{}-no-data-yet')} />
      </StyledNoDataYet>
    );
  }

  return (
    <StyledStrategicInnovationItemContent
      data-testid={formatTestId(dataTestId, '{}-content')}
    >
      <StrategicInnovationChartSection
        data={item.chartSection}
        id={item.id}
        dataTestId={formatTestId(dataTestId, '{}-chart-section')}
      />
    </StyledStrategicInnovationItemContent>
  );
};
