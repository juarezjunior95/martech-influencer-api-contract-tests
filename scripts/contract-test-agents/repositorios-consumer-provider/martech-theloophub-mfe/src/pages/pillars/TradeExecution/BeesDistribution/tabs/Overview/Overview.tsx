import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { BasicContainer, CountryFlag, Legend, Skeleton } from 'components';
import { featureToggles } from 'config/featureToggle';
import {
  useBffData,
  useCurrentPage,
  useFeatureToggle,
  usePageFilterApplied,
} from 'hooks';
import { AISummaryAlert } from 'pages/components/AISummary';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';

import { BeesDistributionKpiData } from '../../types';
import { ChartItem } from './../../components/ChartItem/ChartItem';
import { StyledOverviewContainer } from './Overview.styles';

interface Props {
  dataTestId?: string;
}

const formatTestId = (
  base: string | undefined,
  template: string,
): string | undefined => (base ? template.replace('{}', base) : undefined);

export const Overview: React.FC<Props> = ({ dataTestId }) => {
  const { formatMessage } = useIntl();
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);

  const beesDistributionData = useBffData({
    id: 'trade-execution_bees-distribution_overview',
    kpiGroup: 'bees-distribution',
    subFilters: {
      zone: applied.zone,
      country: applied.country,
      scope: applied.distribution_scopes,
    },
    skipMainFilters: true,
    skipRequest: !applied.distribution_scopes,
  });
  const [aiSummaryEnabled, isAiSummaryLoading] = useFeatureToggle(
    featureToggles.pillar.tradeExecution.submenus.beesDistribution.tab.overview
      .aiSummary,
  );

  const aiSummarySubfilters = useMemo(() => {
    return {
      scope: applied.distribution_scopes,
    };
  }, [applied.distribution_scopes]);

  const data = useMemo(() => {
    return Object.entries(beesDistributionData.data || {}) as [
      string,
      BeesDistributionKpiData,
    ][];
  }, [beesDistributionData.data]);

  const showAiSummary = aiSummaryEnabled && !isAiSummaryLoading;

  return (
    <div data-testid={formatTestId(dataTestId, 'tabpanel-overview-{}')}>
      <BasicContainer
        dataTestId={formatTestId(dataTestId, '{}-tabpanel-overview')}
        header={{
          title: formatMessage({ id: 'TradeExecution.BeesDistribution.title' }),
          tooltipBackgroundTransparent: true,
          titleSize: 'H2',
          rightContent: <CountryFlag />,
        }}
        layout={{
          border: 'small',
          shadow: 'small',
          headerPadding: 'medium',
          bodyPadding: false,
        }}
      >
        <div
          data-testid={formatTestId(dataTestId, '{}-tabpanel-overview-content')}
          style={{ padding: '0 24px 24px 24px', marginTop: '-16px' }}
        >
          {showAiSummary && (
            <div style={{ margin: '16px 0' }}>
              <AISummaryAlert
                pageName={currentPage}
                dataTestId={formatTestId(
                  dataTestId,
                  '{}-tabpanel-overview-ai-summary',
                )}
                kpiGroup="bees-distribution"
                summaryPageIdentifier={
                  AI_SUMMARY_PAGE_IDENTIFIERS.BEES_DISTRIBUTION_OVERVIEW
                }
                subFilters={aiSummarySubfilters}
              />
            </div>
          )}
          {beesDistributionData.loading ? (
            <StyledOverviewContainer
              data-testid={formatTestId(
                dataTestId,
                '{}-tabpanel-overview-content-skeleton',
              )}
            >
              <Skeleton
                dataTestId={formatTestId(
                  dataTestId,
                  '{}-tabpanel-overview-content-skeleton-item-1',
                )}
                width="148px"
                height="48px"
                length={2}
                borderRadius="none"
              />
              <Skeleton
                dataTestId={formatTestId(
                  dataTestId,
                  '{}-tabpanel-overview-content-skeleton-item-2',
                )}
                width="100%"
                height="444px"
                length={1}
                borderRadius="large"
              />
              <Skeleton
                dataTestId={formatTestId(
                  dataTestId,
                  '{}-tabpanel-overview-content-skeleton-item-3',
                )}
                width="100%"
                height="444px"
                length={1}
                borderRadius="large"
              />
              <Skeleton
                dataTestId={formatTestId(
                  dataTestId,
                  '{}-tabpanel-overview-content-skeleton-item-4',
                )}
                width="100%"
                height="444px"
                length={1}
                borderRadius="large"
              />
            </StyledOverviewContainer>
          ) : (
            <StyledOverviewContainer
              data-testid={formatTestId(
                dataTestId,
                '{}-tabpanel-overview-content-legend',
              )}
            >
              <div style={{ marginBottom: '-16px' }}>
                <Legend
                  dataTestId={formatTestId(
                    dataTestId,
                    '{}-tabpanel-overview-content-legend-legend',
                  )}
                  legendPosition="left"
                  caption={data?.[0]?.[1]?.legend || []}
                />
              </div>

              {data.map(([kpiKey, kpi]) => (
                <ChartItem
                  dataTestId={formatTestId(dataTestId, `{}-${kpiKey}`)}
                  key={kpiKey}
                  kpi={kpi}
                />
              ))}
            </StyledOverviewContainer>
          )}
        </div>
      </BasicContainer>
    </div>
  );
};
