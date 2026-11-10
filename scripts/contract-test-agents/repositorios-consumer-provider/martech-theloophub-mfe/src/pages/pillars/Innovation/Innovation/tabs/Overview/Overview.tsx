import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { BasicContainer, CountryFlag } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useLastDataRefresh } from 'contexts';
import {
  useBffData,
  useCurrentPage,
  useFeatureToggle,
  usePageFilterApplied,
  usePageFilterStatus,
  useSubFilters,
} from 'hooks';
import { AISummaryAlert } from 'pages/components/AISummary';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';
import { StyledTooltip } from 'shared/Styles';
import { getViewtype } from 'utils/filter';

import { BigNumbers } from './components/BigNumbers/BigNumbers';
import { StrategicInnovation } from './components/StrategicInnovation/StrategicInnovation';
import {
  StyledOverviewContainer,
  StyledTotalInnovationSection,
  StyledTotalInnovationSubTitle,
} from './Overview.styles';
import { BigNumbersItem, StrategicInnovationData } from './types';

interface OverviewProps {
  dataTestId?: string;
}

export const Overview = ({ dataTestId }: OverviewProps = {}) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isPerformanceAndBreakdownEnabled] = useFeatureToggle(
    featureToggles.pillar.innovation.submenus.innovation.tab
      .performanceAndBreakdown.id,
  );
  const [isAiSummaryEnabled, isAiSummaryLoading] = useFeatureToggle(
    featureToggles.pillar.innovation.submenus.innovation.tab.overview.aiSummary,
  );
  const { currentPage } = useCurrentPage();
  const { applied: appliedFilters } = usePageFilterApplied(currentPage);
  const { isLoading: filtersLoading } = usePageFilterStatus(currentPage);
  const { setSubFilterValue } = useSubFilters();
  const { lastDataRefreshKpisDateMonthYear } = useLastDataRefresh();

  const handleDeepDive = (itemId: string) => {
    setSubFilterValue('kpis', itemId);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('kpi', itemId);
    navigate(
      `/innovation/innovation/performance-and-breakdown?${newParams.toString()}`,
    );
  };

  const portfolioHealthDtEnd = useMemo(() => {
    return lastDataRefreshKpisDateMonthYear?.['portfolio-health'];
  }, [lastDataRefreshKpisDateMonthYear]);

  const pillarRennovationDtEnd = useMemo(() => {
    return lastDataRefreshKpisDateMonthYear?.['pillar-rennovation'];
  }, [lastDataRefreshKpisDateMonthYear]);

  const viewtype = useMemo(
    () => getViewtype(appliedFilters.country),
    [appliedFilters.country],
  );

  const portfolioHealthFilters = useMemo(() => {
    return {
      'portfolio-health': {
        country: appliedFilters.country,
        zone: appliedFilters.zone,
        viewtype: viewtype,
        dt_end: portfolioHealthDtEnd,
      },
    };
  }, [
    appliedFilters.country,
    appliedFilters.zone,
    viewtype,
    portfolioHealthDtEnd,
  ]);

  const pillarRennovationFilters = useMemo(() => {
    return {
      'pillar-rennovation': {
        country: appliedFilters.country,
        viewtype: viewtype,
        dt_end: pillarRennovationDtEnd,
      },
    };
  }, [appliedFilters.country, viewtype, pillarRennovationDtEnd]);

  const overviewData = useBffData({
    id: 'innovation_innovation_overview',
    kpiGroup: 'innovation',
    subFilters: {
      ...portfolioHealthFilters,
      ...pillarRennovationFilters,
    },
    skipRequest: filtersLoading,
  });

  const aiSummarySubfilters = useMemo(() => {
    return {
      timeframe: null,
    };
  }, []);

  return (
    <StyledOverviewContainer data-testid={dataTestId}>
      <BasicContainer
        header={{
          title: formatMessage({
            id: 'Innovation.Innovation.Overview.TotalInnovation.title',
          }),
          tooltip: (
            <StyledTooltip size="small">
              {formatMessage({
                id: 'Innovation.Innovation.Overview.TotalInnovation.tooltip',
              })}
            </StyledTooltip>
          ),
          titleSize: 'H2',
          rightContent: <CountryFlag />,
        }}
        layout={{
          border: 'small',
          shadow: 'small',
          headerPadding: 'small',
          bodyPadding: true,
        }}
        dataTestId={dataTestId ? `${dataTestId}-container` : undefined}
      >
        <StyledTotalInnovationSection
          data-testid={
            dataTestId ? `${dataTestId}-total-innovation-section` : undefined
          }
        >
          <div
            data-testid={
              dataTestId ? `${dataTestId}-big-numbers-wrapper` : undefined
            }
          >
            <StyledTotalInnovationSubTitle
              size="H4"
              data-testid={
                dataTestId ? `${dataTestId}-big-numbers-heading` : undefined
              }
            >
              {formatMessage({
                id: 'Innovation.Innovation.Overview.PerformanceAndBreakdown.InnovationPerfomance.title',
              })}
            </StyledTotalInnovationSubTitle>
            <BigNumbers
              data={
                (overviewData.data?.['big-numbers'] || []) as BigNumbersItem[]
              }
              loading={overviewData.loading}
              onDeepDive={isPerformanceAndBreakdownEnabled && handleDeepDive}
              orientation={{ header: 'vertical', body: 'horizontal' }}
              showInfo={false}
              dataTestId={dataTestId ? `${dataTestId}-big-numbers` : undefined}
            />

            {isAiSummaryEnabled && !isAiSummaryLoading && (
              <div style={{ marginTop: '16px', marginBottom: '-2px' }}>
                <AISummaryAlert
                  pageName={currentPage}
                  dataTestId={dataTestId}
                  kpiGroup="innovation"
                  summaryPageIdentifier={
                    AI_SUMMARY_PAGE_IDENTIFIERS.INNOVATION_OVERVIEW
                  }
                  subFilters={aiSummarySubfilters}
                />
              </div>
            )}
          </div>
          <StrategicInnovation
            data={
              (overviewData.data?.['strategic-innovation-pillars'] ||
                []) as StrategicInnovationData[]
            }
            loading={overviewData.loading}
            dataTestId={
              dataTestId ? `${dataTestId}-strategic-innovation` : undefined
            }
          />
        </StyledTotalInnovationSection>
      </BasicContainer>
    </StyledOverviewContainer>
  );
};
