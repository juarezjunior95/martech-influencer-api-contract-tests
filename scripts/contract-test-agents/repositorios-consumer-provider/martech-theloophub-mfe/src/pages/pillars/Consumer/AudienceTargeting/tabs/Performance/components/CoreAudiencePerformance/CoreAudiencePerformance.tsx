import { useIntl } from 'react-intl';

import NoDataAvailableIcon from 'assets/NoDataAvailable.svg';
import { Alert, ResponsiveBasicContainer } from 'components';
import { useCurrentPage, usePageFilterApplied } from 'hooks';

import { NoDataAvailable, TooltipContent } from '../../../../components';
import { useAudienceTargetingKpiQuarterTags } from '../../../../hooks';
import { useCompetitorLabel } from '../../hooks';
import { CARD_BACKGROUND_COLOR } from '../Breakdown/constants';
import { KpiSummaryCards } from '../KpiSummaryCards/KpiSummaryCards';
import { KpiSummaryCardData } from '../KpiSummaryCards/types';

interface CoreAudiencePerformanceProps {
  data?: KpiSummaryCardData[];
  dataTestId?: string;
  isLoading?: boolean;
  defaultSelected?: string;
  onSelectionChange?: (id: string) => void;
  error: Error | null;
  competitorWithoutData?: boolean;
}

export const CoreAudiencePerformance = ({
  data = [],
  dataTestId,
  isLoading,
  defaultSelected,
  onSelectionChange,
  error,
  competitorWithoutData = false,
}: CoreAudiencePerformanceProps) => {
  const { formatMessage } = useIntl();
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const competitorLabel = useCompetitorLabel();

  const isDataEmpty = !isLoading && !error && data?.length === 0;

  const kpiQuarterTags = useAudienceTargetingKpiQuarterTags();

  if (error) {
    return (
      <NoDataAvailable
        dataTestId={dataTestId}
        icon={<img src={NoDataAvailableIcon} alt="No data available" />}
        title={formatMessage({
          id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.errorMessage.title',
        })}
        description={formatMessage({
          id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.errorMessage.description',
        })}
      />
    );
  }

  if (isDataEmpty) {
    return (
      <NoDataAvailable
        dataTestId={dataTestId}
        icon={<img src={NoDataAvailableIcon} alt="No data available" />}
        title={formatMessage({
          id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.emptyMessage.title',
        })}
        description={formatMessage({
          id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.emptyMessage.description',
        })}
      />
    );
  }

  return (
    <ResponsiveBasicContainer
      dataTestId={dataTestId}
      header={{
        title: `${applied?.audience_targeting_brands ?? ''} ${formatMessage({
          id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.title',
        })}`,
        tags: kpiQuarterTags,
        titleSize: 'H2',
        tooltip: (
          <TooltipContent
            title={formatMessage({
              id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.tooltip.title',
            })}
            subtitle={formatMessage({
              id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.tooltip.subtitle',
            })}
            text={formatMessage({
              id: 'Consumer.AudienceTargeting.Performance.CoreAudiencePerformance.tooltip.description',
            })}
            paddingLeft={false}
          />
        ),
        tooltipSize: 'medium',
      }}
      layout={{
        border: 'small',
        headerPadding: 'large',
        bodyPadding: true,
        background: CARD_BACKGROUND_COLOR,
      }}
    >
      {competitorWithoutData && (
        <Alert
          type="warning"
          emphasis="low"
          message={formatMessage(
            { id: 'Consumer.AudienceTargeting.Empty.competitorWithoutData' },
            { competitor: competitorLabel },
          )}
          dataTestId={
            dataTestId ? `${dataTestId}-competitor-without-data` : undefined
          }
        />
      )}
      <KpiSummaryCards
        data={data}
        loading={isLoading}
        dataTestId={dataTestId}
        defaultSelected={defaultSelected}
        onSelectionChange={onSelectionChange}
      />
    </ResponsiveBasicContainer>
  );
};
