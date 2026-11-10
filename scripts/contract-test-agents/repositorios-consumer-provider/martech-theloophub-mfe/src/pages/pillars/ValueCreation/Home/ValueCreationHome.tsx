import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  BasicContainer,
  DataStateHandler,
  PageHeader,
  PillarResources,
  StickyScrollWithFilters,
} from 'components';
import { useKpiFeatureToggles } from 'components/Filter/hooks';
import { featureToggles } from 'config/featureToggle';
import { useLastDataRefresh } from 'contexts/LastDataRefresh/LastDataRefresh';
import { FilterRegistry } from 'domain/Filter';
import {
  useBffData,
  useFeatureToggle,
  useMediaQuery,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterManagement,
} from 'hooks';
import { AISummary } from 'pages/components/AISummary';
import {
  KpiOverviewCard,
  type KpiOverviewCardData,
} from 'pages/components/KpiOverviewCard';
import { getKpiOverviewCardSkeletonProps } from 'pages/components/KpiOverviewCard/utils';
import {
  GrowthLeverCard,
  StrategyDriverCard,
} from 'pages/components/ValueCreation';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';
import { StyledTooltip } from 'shared/Styles';
import {
  StyledGridContainer,
  StyledHomeContainer,
  StyledHomeHeaderContainer,
  StyledSectionContent,
} from 'shared/Styles/layout.styles';
import { getViewtype } from 'utils/filter';

import { IMAGES, KPIS, TOOLTIP_IDS } from './constants';
import {
  getGrowthLeverCardSkeletonProps,
  getStrategyDriverCardSkeletonProps,
  getSustainableGrowthOverviewTitle,
} from './utils';
import {
  StyledCardsGrid,
  StyledGrowthLeversGrid,
  StyledStrategyDriversGrid,
} from './ValueCreationHome.styles';

const richText = {
  b: (chunks: React.ReactNode) => <b>{chunks}</b>,
};

export const ValueCreationHome = () => {
  const pageName = 'value-creation_home';
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { applied } = usePageFilterApplied(pageName);
  const { dataFilters } = usePageFilterData(pageName);
  const { updateForm, apply } = usePageFilterManagement(pageName);
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const isDesktopXLarge = useMediaQuery('(min-width: 1920px)');
  const navigateToPerformanceTool = useCallback(
    (kpi: string) => {
      const qs = FilterRegistry.buildFilterQueryString(
        { periods: applied.periods },
        { kpis: kpi },
      );

      updateForm('kpis', kpi);
      apply();
      navigate(`/value-creation/performance-tool?${qs}`);
    },
    [applied.periods, navigate, updateForm, apply],
  );

  const [performanceToolToggleEnabled, performanceToolToggleLoading] =
    useFeatureToggle(
      featureToggles.pillar.valueCreation.submenus.performanceTool.id,
    );
  const isPerformanceToolToggleEnabled = useMemo(() => {
    return performanceToolToggleEnabled && !performanceToolToggleLoading;
  }, [performanceToolToggleEnabled, performanceToolToggleLoading]);

  const isEurView = useMemo(() => {
    return applied.zone === 'EUR' && applied.country === 'ABI';
  }, [applied.zone, applied.country]);

  const sustainableGrowthOverviewTitle = useMemo(
    () => getSustainableGrowthOverviewTitle(dataFilters, applied),
    [dataFilters, applied],
  );

  const isBrandPowerDisabled = useCallback(
    (kpi?: string): boolean => {
      if (kpi !== 'power') return false;
      if (isEurView) return true;
      return Boolean(applied.value_creation_growth_levers);
    },
    [isEurView, applied.value_creation_growth_levers],
  );

  const { lastDataRefreshKpisDateMonthYear } = useLastDataRefresh();

  const financeDtEnd = lastDataRefreshKpisDateMonthYear?.finance;
  const posDtEnd = lastDataRefreshKpisDateMonthYear?.pos;
  const marketShareDtEnd = lastDataRefreshKpisDateMonthYear?.market_share;
  const powerDtEnd = lastDataRefreshKpisDateMonthYear?.power;

  const viewtype = useMemo(
    () => getViewtype(applied?.country),
    [applied?.country],
  );

  const filters = useMemo(() => {
    return {
      zone: applied.zone,
      country: applied.country,
      growth_lever: applied.value_creation_growth_levers || 'All',
      period: applied.periods,
      viewtype,
    };
  }, [applied, viewtype]);

  const pageData = useBffData({
    id: 'value-creation_home',
    kpiGroup: 'volume',
    subFilters: {
      ...filters,
      finance: {
        ...filters,
        dt_end: financeDtEnd,
      },
      pos: {
        ...filters,
        dt_end: posDtEnd,
      },
      market_share: {
        ...filters,
        dt_end: marketShareDtEnd,
      },
      power: {
        ...filters,
        dt_end: powerDtEnd,
      },
    },
  });
  const [aiSummaryEnabled, aiSummaryLoading] = useFeatureToggle(
    featureToggles.pillar.valueCreation.home.aiSummary
      .sustainableGrowthOverview,
  );
  const isAiSummaryEnabled = useMemo(() => {
    return aiSummaryEnabled && !aiSummaryLoading;
  }, [aiSummaryEnabled, aiSummaryLoading]);

  const sustainableGrowthOverviewData: Record<string, KpiOverviewCardData> =
    useMemo(() => {
      if (pageData.loading || !pageData?.data?.['sustainable-growth-overview'])
        return {};
      return pageData?.data?.['sustainable-growth-overview'];
    }, [pageData]);

  const strategyDriversData = useMemo(() => {
    if (pageData.loading || !pageData?.data?.['strategy-drivers']) return [];
    return pageData?.data?.['strategy-drivers'];
  }, [pageData]);

  const growthLeverCardData = useMemo(() => {
    if (pageData.loading || !pageData?.data?.['strategy-drivers-growth-levers'])
      return [];
    return pageData?.data?.['strategy-drivers-growth-levers'];
  }, [pageData]);

  const [valueCreationHomeContentEnabled, valueCreationHomeContentLoading] =
    useFeatureToggle(
      featureToggles.pillar.valueCreation.value_creation_home_content,
    );

  const isValueCreationHomeContentEnabled = useMemo(() => {
    if (valueCreationHomeContentLoading) return true;
    return valueCreationHomeContentEnabled;
  }, [valueCreationHomeContentEnabled, valueCreationHomeContentLoading]);

  const { featureToggleMap } = useKpiFeatureToggles();

  const getTooltip = (title: string) => {
    const id = TOOLTIP_IDS[title];
    return id ? formatMessage({ id }, richText) : undefined;
  };

  const aiSummarySubfilters = useMemo(() => {
    return {
      period: applied?.periods,
      growth_lever: applied?.value_creation_growth_levers || 'All',
    };
  }, [applied]);

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: pageName,
          visibleFields: [
            'zone',
            'country',
            'value_creation_growth_levers',
            'periods',
          ],
          hidden: !isValueCreationHomeContentEnabled,
        }}
        breadcrumbs={{
          pageList: [
            {
              href: '/value-creation',
              pageName: formatMessage({
                id: 'ValueCreation.Home.breadcrumbPageName',
              }),
            },
          ],
          showIcon: true,
        }}
        isResponsivePage
      />
      <StyledGridContainer isResponsivePage>
        <StyledHomeContainer>
          <StyledHomeHeaderContainer>
            <PageHeader
              title={formatMessage({ id: 'Pillars.sidebar.valueCreation' })}
              subtitle={formatMessage({
                id: 'ValueCreation.Home.pageSubtitle',
              })}
            />
          </StyledHomeHeaderContainer>

          {isValueCreationHomeContentEnabled && (
            <>
              <BasicContainer
                header={{
                  title: sustainableGrowthOverviewTitle,
                  tooltip: (
                    <StyledTooltip>
                      {formatMessage(
                        {
                          id: 'ValueCreation.Home.globalSustainableGrowthOverview.tooltip',
                        },
                        richText,
                      )}
                    </StyledTooltip>
                  ),
                  titleSize: isDesktopLarge ? 'H2' : 'H3',
                }}
                layout={{
                  bodyPadding: false,
                  background: '#fafafa',
                  border: 'gray',
                }}
              >
                <StyledSectionContent>
                  <StyledCardsGrid>
                    <DataStateHandler
                      loading={pageData.loading}
                      empty={!Object.entries(KPIS).length}
                      skeletonProps={getKpiOverviewCardSkeletonProps(
                        isDesktopXLarge,
                        isDesktopLarge,
                      )}
                    >
                      {Object.entries(KPIS).map(([key, data]) => {
                        const canNavigateToPerformanceTool =
                          featureToggleMap[key] &&
                          !sustainableGrowthOverviewData[key]?.noticeMessage &&
                          isPerformanceToolToggleEnabled &&
                          !isBrandPowerDisabled(data.kpi);
                        return (
                          <KpiOverviewCard
                            key={key}
                            data={sustainableGrowthOverviewData[key]}
                            tooltip={getTooltip(key) as string}
                            onClick={
                              canNavigateToPerformanceTool
                                ? () => navigateToPerformanceTool(data.kpi)
                                : undefined
                            }
                          />
                        );
                      })}
                    </DataStateHandler>
                  </StyledCardsGrid>
                  {isAiSummaryEnabled && (
                    <AISummary
                      pageName={pageName}
                      summaryPageIdentifier={
                        AI_SUMMARY_PAGE_IDENTIFIERS.VALUE_CREATION_HOME
                      }
                      kpiGroup="volume"
                      dataTestId="ai-summary-value-creation-home"
                      hasExpandedAction={false}
                      subFilters={aiSummarySubfilters}
                    />
                  )}
                </StyledSectionContent>
              </BasicContainer>

              <BasicContainer
                header={{
                  title: formatMessage({
                    id: 'ValueCreation.Home.strategyDrivers.title',
                  }),
                  tooltip: (
                    <StyledTooltip>
                      {formatMessage(
                        {
                          id: 'ValueCreation.Home.strategyDrivers.tooltip',
                        },
                        richText,
                      )}
                    </StyledTooltip>
                  ),
                  titleSize: isDesktopLarge ? 'H2' : 'H3',
                }}
                layout={{
                  bodyPadding: false,
                  background: '#fafafa',
                  border: 'gray',
                }}
              >
                <StyledSectionContent>
                  <StyledStrategyDriversGrid>
                    <DataStateHandler
                      loading={pageData.loading}
                      empty={!strategyDriversData.length}
                      skeletonProps={getStrategyDriverCardSkeletonProps(
                        isDesktopXLarge,
                        isDesktopLarge,
                      )}
                    >
                      {strategyDriversData.map((data) => (
                        <StrategyDriverCard
                          key={data.chartHeader.title}
                          data={data}
                          tooltip={getTooltip(data.chartHeader.title) as string}
                        />
                      ))}
                    </DataStateHandler>
                  </StyledStrategyDriversGrid>
                  <StyledGrowthLeversGrid>
                    <DataStateHandler
                      loading={pageData.loading}
                      empty={!Object.entries(growthLeverCardData).length}
                      skeletonProps={getGrowthLeverCardSkeletonProps(
                        isDesktopXLarge,
                        isDesktopLarge,
                      )}
                    >
                      {Object.entries(growthLeverCardData).map(
                        ([key, data]) => (
                          <GrowthLeverCard
                            key={key}
                            image={IMAGES[key]}
                            tooltip={getTooltip(key) as string}
                            data={data}
                            active={String(
                              applied.value_creation_growth_levers,
                            )?.includes(data.title)}
                          />
                        ),
                      )}
                    </DataStateHandler>
                  </StyledGrowthLeversGrid>
                </StyledSectionContent>
              </BasicContainer>
            </>
          )}

          <PillarResources
            pillar={formatMessage({ id: 'Pillars.pageName.valueCreation' })}
          />
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
