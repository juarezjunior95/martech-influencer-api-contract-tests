import { useIntl } from 'react-intl';

import { Expandable } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useCurrentPage, useFeatureToggle } from 'hooks';
import { AISummaryAlert } from 'pages/components/AISummary';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';

import { ResourceAllocationOverview } from '../../types';
import { ChartsView } from '../ChartsView/ChartsView';
import { CustomSkeletonLoader } from '../CustomSkeletonLoader/CustomSkeletonLoader';
import { SummaryHeader } from '../SummaryHeader/SummaryHeader';
import { StyledSummaryViewContainer } from './SummaryView.styles';

interface SummaryViewProps {
  charts: {
    data: ResourceAllocationOverview;
    loading: boolean;
    available: boolean;
  };
  dataTestId?: string;
}

export const SummaryView = ({ charts, dataTestId }: SummaryViewProps) => {
  const { formatMessage } = useIntl();
  const { currentPage } = useCurrentPage();
  const [isAiSummaryEnabled, isAiSummaryLoading] = useFeatureToggle(
    featureToggles.pillar.connectionsAndCreativity.submenus
      .resourceAllocationMedia.tab.overview.aiSummary,
  );

  return (
    <Expandable.Item
      dataTestId={dataTestId ? `${dataTestId}-summary-view` : undefined}
      id="ra-overview-summary"
      expand="none"
      borderBottom="hidden"
      expandedHeaderHeight="70px"
      headerCustomized={
        <SummaryHeader
          formatMessage={formatMessage}
          dataTestId={
            dataTestId ? `${dataTestId}-summary-view-header` : undefined
          }
        />
      }
      expandableChildren={
        <StyledSummaryViewContainer
          data-testid={
            dataTestId ? `${dataTestId}-summary-view-container` : undefined
          }
        >
          <div>
            {charts.available &&
              (charts.loading ? (
                <CustomSkeletonLoader
                  type="charts"
                  dataTestId={
                    dataTestId
                      ? `${dataTestId}-summary-view-skeleton`
                      : undefined
                  }
                />
              ) : (
                <ChartsView
                  data={charts.data}
                  formatMessage={formatMessage}
                  dataTestId={
                    dataTestId ? `${dataTestId}-summary-view-charts` : undefined
                  }
                />
              ))}
            {isAiSummaryEnabled && !isAiSummaryLoading && (
              <div style={{ marginTop: '8px', marginBottom: '24px' }}>
                <AISummaryAlert
                  pageName={currentPage}
                  dataTestId={dataTestId}
                  kpiGroup="media"
                  summaryPageIdentifier={
                    AI_SUMMARY_PAGE_IDENTIFIERS.RESOURCE_ALLOCATION_OVERVIEW
                  }
                />
              </div>
            )}
          </div>
        </StyledSummaryViewContainer>
      }
    />
  );
};
