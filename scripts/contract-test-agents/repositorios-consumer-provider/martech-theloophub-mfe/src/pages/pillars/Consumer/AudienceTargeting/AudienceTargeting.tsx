import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import EmptyData from 'assets/empty_data.svg';
import PermissionRequired from 'assets/permission_required.svg';
import SearchEmpty from 'assets/Search-Empty.svg';
import { RouteTabs, StickyScrollWithFilters, TabInfo } from 'components';
import { FILTER_MODAL_NAME } from 'components/Filter';
import { TableDataType } from 'components/TableComponent';
import {
  StyledContainer,
  StyledContent,
  StyledPageDescription,
  StyledPageTitleContainer,
  StyledPageTitleContent,
  StyledPageTitleRow,
} from 'components/TabsWithFilters/TabsWithFilters.styles';
import { featureToggles } from 'config/featureToggle';
import { useScopedModal } from 'contexts';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import {
  useBffData,
  useFeatureToggle,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterStatus,
} from 'hooks';
import {
  StyledGridContainer,
  StyledHomeContainer,
  StyledTitle,
} from 'shared/Styles';
import { createTab } from 'utils/tab';

import { NoDataAvailable } from './components';
import {
  AudienceTargetingError,
  FILTER_CONFIG_DEFINITION,
  FILTER_CONFIG_PERFORMANCE,
} from './constants';
import { Definition, Performance } from './tabs';
import { BrandAudiencesTargetingCardModel } from './tabs/Definition/components/BrandAudience/types';
import { BreakdownTier } from './tabs/Performance/components/Breakdown/types';
import { KpiSummaryCardData } from './tabs/Performance/components/KpiSummaryCards/types';

export const AUDIENCE_TARGETING_PAGE_NAME = 'consumer_audience-targeting';

type GlobalEmptyStateKind =
  | 'dataRefreshFail'
  | 'permissionRequired'
  | 'permissionRequiredNoOtherAccess'
  | 'noCountryData';

const HIDE_TABS_EMPTY_STATES = new Set<GlobalEmptyStateKind>([
  'noCountryData',
  'permissionRequired',
  'permissionRequiredNoOtherAccess',
]);

const isEmptyResult = (data: unknown): boolean => {
  if (data == null) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object') {
    const values = Object.values(data);
    return values.every(isEmptyResult);
  }
  return false;
};

const hasErrorOfKind = (
  error: Error | null | undefined,
  kind: AudienceTargetingError,
): boolean => !!error && error.message === kind;

export const AudienceTargeting: React.FC = () => {
  const { tab } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { open: openFilterModal } = useScopedModal(FILTER_MODAL_NAME);
  const [isPerformanceTabEnabled] = useFeatureToggle(
    featureToggles.pillar.consumer.submenus.audienceTargeting.tabs.performance,
  );
  const [isDefinitionTabEnabled] = useFeatureToggle(
    featureToggles.pillar.consumer.submenus.audienceTargeting.tabs.definition,
  );

  const filterConfig =
    tab === 'performance'
      ? FILTER_CONFIG_PERFORMANCE
      : FILTER_CONFIG_DEFINITION;

  const { applied: appliedDefinition } = usePageFilterApplied(
    FILTER_CONFIG_DEFINITION.pageName,
  );
  const { applied: appliedPerformance } = usePageFilterApplied(
    FILTER_CONFIG_PERFORMANCE.pageName,
  );
  const { dataFilters } = usePageFilterData(FILTER_CONFIG_DEFINITION.pageName);
  const { isLoaded: isDefinitionFiltersLoaded } = usePageFilterStatus(
    FILTER_CONFIG_DEFINITION.pageName,
  );

  const skipDefinitionRequest =
    !appliedDefinition?.country ||
    !appliedDefinition?.audience_targeting_brands ||
    !appliedDefinition?.audience_targeting_brands_comp;

  const definitionBffData = useBffData({
    id: 'consumer_audience-targeting_definition_brand-audience',
    kpiGroup: 'pos',
    subFilters: {
      country: appliedDefinition?.country,
      brand: appliedDefinition?.audience_targeting_brands,
      competitor: appliedDefinition?.audience_targeting_brands_comp,
    },
    skipMainFilters: false,
    skipRequest: skipDefinitionRequest,
  });

  const definitionAudienceData = useMemo(
    () =>
      (definitionBffData?.data?.[
        'audience-cards'
      ] as BrandAudiencesTargetingCardModel[]) ?? [],
    [definitionBffData?.data],
  );
  const definitionBreakdownData = definitionBffData?.data?.[
    'participation-breakdown'
  ] as TableDataType;

  const skipPerformanceRequest =
    !appliedPerformance?.country ||
    !appliedPerformance?.audience_targeting_brands ||
    !appliedPerformance?.audience_targeting_brands_comp ||
    !appliedPerformance?.kpis;

  const performanceAudienceBffData = useBffData({
    id: 'consumer_audience-targeting_performance_audience-performance',
    kpiGroup: 'pos',
    subFilters: {
      country: appliedPerformance?.country,
      brand: appliedPerformance?.audience_targeting_brands,
      competitor: appliedPerformance?.audience_targeting_brands_comp,
    },
    skipMainFilters: false,
    skipRequest: skipPerformanceRequest,
  });

  const performanceAudienceData = performanceAudienceBffData?.data?.[
    'core-audience-performance'
  ] as KpiSummaryCardData[];

  const performanceBreakdownBffData = useBffData({
    id: 'consumer_audience-targeting_performance_breakdown',
    kpiGroup: 'pos',
    subFilters: {
      country: appliedPerformance?.country,
      brand: appliedPerformance?.audience_targeting_brands,
      competitor: appliedPerformance?.audience_targeting_brands_comp,
      kpi_name: appliedPerformance?.kpis,
    },
    skipMainFilters: false,
    skipRequest: skipPerformanceRequest,
  });

  const performanceBreakdownData = performanceBreakdownBffData?.data?.[
    'breakdown'
  ] as BreakdownTier[];

  const countryLabel = useMemo(() => {
    if (!dataFilters || !appliedDefinition) return '';
    const country = FilterDataAccessor.getInstance().getCountry(
      dataFilters,
      appliedDefinition,
    );
    return String(country?.label ?? appliedDefinition?.country ?? '');
  }, [dataFilters, appliedDefinition]);

  const hasOtherCountryAccess = useMemo(() => {
    if (!dataFilters || !appliedDefinition?.country) return false;
    return FilterDataAccessor.getInstance()
      .getCountryOptions(dataFilters)
      .some((country) => country.value !== appliedDefinition.country);
  }, [dataFilters, appliedDefinition?.country]);

  const isAppliedCountryWithoutBrands = useMemo(() => {
    if (!dataFilters) return false;
    const country =
      appliedDefinition?.country ?? appliedPerformance?.country ?? null;
    if (!country) return false;

    const brandFilter = (
      dataFilters as Record<string, { values?: Record<string, unknown[]> }>
    )?.audience_targeting_brands;

    if (!brandFilter?.values) return false;

    const brandsForCountry = brandFilter.values[String(country)];
    return !Array.isArray(brandsForCountry) || brandsForCountry.length === 0;
  }, [dataFilters, appliedDefinition?.country, appliedPerformance?.country]);

  const globalEmptyStateKind = useMemo<GlobalEmptyStateKind | null>(() => {
    if (isDefinitionFiltersLoaded) {
      const hasNoApplicableCountry =
        !appliedDefinition?.country && !appliedPerformance?.country;
      if (hasNoApplicableCountry || isAppliedCountryWithoutBrands) {
        return 'noCountryData';
      }
    }

    const definitionView = {
      error: definitionBffData.error,
      loading: definitionBffData.loading,
      data: definitionBffData.data,
      skipped: skipDefinitionRequest,
    };

    const performanceViews = [
      {
        error: performanceAudienceBffData.error,
        loading: performanceAudienceBffData.loading,
        data: performanceAudienceBffData.data,
        skipped: skipPerformanceRequest,
      },
      {
        error: performanceBreakdownBffData.error,
        loading: performanceBreakdownBffData.loading,
        data: performanceBreakdownBffData.data,
        skipped: skipPerformanceRequest,
      },
    ];

    const activePerformanceViews = performanceViews.filter((v) => !v.skipped);
    const allViews = [definitionView, ...activePerformanceViews];

    // Only wait on loading for views that are actually making a request.
    // Skipped views keep `loading: true` forever (useBffData never resets it),
    // so checking their loading state would prevent empty state detection.
    const activeViews = allViews.filter((v) => !v.skipped);
    if (activeViews.some((v) => v.loading)) return null;

    const allDataRefreshFail =
      activeViews.length > 0 &&
      activeViews.every((v) =>
        hasErrorOfKind(v.error, AudienceTargetingError.DataRefreshFail),
      );
    if (allDataRefreshFail) return 'dataRefreshFail';

    const allPermissionRequired =
      activeViews.length > 0 &&
      activeViews.every(
        (v) =>
          hasErrorOfKind(v.error, AudienceTargetingError.PermissionRequired) ||
          hasErrorOfKind(
            v.error,
            AudienceTargetingError.PermissionRequiredNoOtherAccess,
          ),
      );
    if (allPermissionRequired) {
      return hasOtherCountryAccess
        ? 'permissionRequired'
        : 'permissionRequiredNoOtherAccess';
    }

    // noCountryData: detected when any active (non-skipped) view returned empty
    // with no error and a country is selected. Using `some` ensures the page
    // hides tabs as soon as any view confirms no data, preventing inner
    // components from rendering their own empty states.
    const hasCountrySelected =
      !!appliedDefinition?.country || !!appliedPerformance?.country;
    const anyViewEmptyNoError = activeViews.some(
      (v) => !v.loading && !v.error && isEmptyResult(v.data),
    );
    if (anyViewEmptyNoError && hasCountrySelected) return 'noCountryData';

    return null;
  }, [
    definitionBffData.error,
    definitionBffData.loading,
    definitionBffData.data,
    performanceAudienceBffData.error,
    performanceAudienceBffData.loading,
    performanceAudienceBffData.data,
    performanceBreakdownBffData.error,
    performanceBreakdownBffData.loading,
    performanceBreakdownBffData.data,
    skipDefinitionRequest,
    skipPerformanceRequest,
    appliedDefinition?.country,
    appliedPerformance?.country,
    hasOtherCountryAccess,
    isAppliedCountryWithoutBrands,
    isDefinitionFiltersLoaded,
  ]);

  const renderEmptyState = useCallback(
    (kind: GlobalEmptyStateKind) => {
      if (kind === 'dataRefreshFail') {
        return (
          <NoDataAvailable
            dataTestId="audience-targeting-data-refresh-fail"
            icon={
              <img
                src={EmptyData}
                alt="Empty data icon indicating a data refresh failure"
              />
            }
            title={formatMessage({
              id: 'Consumer.AudienceTargeting.Empty.dataRefreshFailedTitle',
            })}
            description={formatMessage({
              id: 'Consumer.AudienceTargeting.Empty.dataRefreshFailedDescription',
            })}
            actions={[
              {
                id: 'return-to-home',
                label: formatMessage({
                  id: 'Consumer.AudienceTargeting.Empty.returnToHome',
                }),
                onClick: () => navigate('/consumer'),
              },
              {
                id: 'refresh-page',
                label: formatMessage({
                  id: 'Consumer.AudienceTargeting.Empty.refreshPage',
                }),
                onClick: () => globalThis.location.reload(),
                variant: 'primary',
              },
            ]}
          />
        );
      }

      if (
        kind === 'permissionRequired' ||
        kind === 'permissionRequiredNoOtherAccess'
      ) {
        const isNoOtherAccess = kind === 'permissionRequiredNoOtherAccess';
        return (
          <NoDataAvailable
            dataTestId="audience-targeting-permission-required"
            icon={
              <img
                src={PermissionRequired}
                alt="Construction barrier icon representing no content available"
              />
            }
            title={formatMessage({
              id: 'Consumer.AudienceTargeting.Empty.permissionRequiredTitle',
            })}
            description={formatMessage(
              {
                id: 'Consumer.AudienceTargeting.Empty.permissionRequiredDescription',
              },
              { country: countryLabel },
            )}
            actions={
              isNoOtherAccess
                ? [
                    {
                      id: 'return-to-home',
                      label: formatMessage({
                        id: 'Consumer.AudienceTargeting.Empty.returnToHome',
                      }),
                      onClick: () => navigate('/consumer'),
                    },
                  ]
                : [
                    {
                      id: 'return-to-home',
                      label: formatMessage({
                        id: 'Consumer.AudienceTargeting.Empty.returnToHome',
                      }),
                      onClick: () => navigate('/consumer'),
                    },
                    {
                      id: 'reset-filters',
                      label: formatMessage({
                        id: 'Consumer.AudienceTargeting.Empty.resetFilters',
                      }),
                      onClick: () => openFilterModal(),
                    },
                  ]
            }
          />
        );
      }

      return (
        <NoDataAvailable
          dataTestId="audience-targeting-no-country-data"
          icon={
            <img
              src={SearchEmpty}
              alt="Magnifying glass over a box indicating no results found"
            />
          }
          title={formatMessage({
            id: 'Consumer.AudienceTargeting.Empty.noCountryDataTitle',
          })}
          description={formatMessage(
            { id: 'Consumer.AudienceTargeting.Empty.noCountryDataDescription' },
            { country: countryLabel },
          )}
          actions={[
            {
              id: 'reset-filters',
              label: formatMessage({
                id: 'Consumer.AudienceTargeting.Empty.resetFilters',
              }),
              onClick: () => openFilterModal(),
            },
            {
              id: 'return-to-home',
              label: formatMessage({
                id: 'Consumer.AudienceTargeting.Empty.returnToHome',
              }),
              onClick: () => navigate('/consumer'),
            },
          ]}
        />
      );
    },
    [countryLabel, formatMessage, navigate, openFilterModal],
  );

  const tabs = useMemo<TabInfo[]>(() => {
    const globalEmptyState = globalEmptyStateKind
      ? renderEmptyState(globalEmptyStateKind)
      : null;

    const tabInfos = [];
    if (isDefinitionTabEnabled) {
      tabInfos.push(
        createTab(
          'definition',
          'Definition',
          globalEmptyState ?? (
            <Definition
              dataTestId="tabpanel-definition"
              audienceData={definitionAudienceData}
              breakdownData={definitionBreakdownData}
              isLoading={definitionBffData.loading}
              error={definitionBffData.error}
            />
          ),
        ),
      );
    }
    if (isPerformanceTabEnabled) {
      tabInfos.push(
        createTab(
          'performance',
          'Performance',
          globalEmptyState ?? (
            <Performance
              dataTestId="tabpanel-performance"
              audiencePerformanceData={performanceAudienceData}
              participationBreakdownData={performanceBreakdownData}
              audiencePerformanceError={performanceAudienceBffData.error}
              isAudienceLoading={performanceAudienceBffData.loading}
              isBreakdownLoading={performanceBreakdownBffData.loading}
              breakdownError={performanceBreakdownBffData.error}
            />
          ),
        ),
      );
    }
    return tabInfos;
  }, [
    definitionAudienceData,
    definitionBreakdownData,
    definitionBffData.loading,
    definitionBffData.error,
    globalEmptyStateKind,
    isDefinitionTabEnabled,
    isPerformanceTabEnabled,
    performanceAudienceData,
    performanceBreakdownData,
    performanceAudienceBffData.loading,
    performanceAudienceBffData.error,
    performanceBreakdownBffData.loading,
    performanceBreakdownBffData.error,
    renderEmptyState,
  ]);

  const shouldHideTabs =
    !!globalEmptyStateKind && HIDE_TABS_EMPTY_STATES.has(globalEmptyStateKind);

  if (shouldHideTabs) {
    return (
      <>
        <StickyScrollWithFilters
          filter={filterConfig}
          breadcrumbs={{
            pageList: [
              {
                href: '/consumer',
                pageName: formatMessage({ id: 'Pillars.pageName.consumer' }),
              },
              {
                href: '/consumer/audience-targeting',
                pageName: formatMessage({ id: 'Sidebar.audienceTargeting' }),
              },
            ],
            showIcon: true,
          }}
          isResponsivePage
        />
        <StyledGridContainer css={{ paddingBottom: 0 }} isResponsivePage>
          <StyledHomeContainer>
            <StyledPageTitleContainer data-testid="audience-targeting">
              <StyledPageTitleRow>
                <StyledPageTitleContent>
                  <StyledTitle
                    size="H1"
                    data-testid="page-title-audience-targeting"
                  >
                    {formatMessage({ id: 'Consumer.AudienceTargeting.title' })}
                  </StyledTitle>
                </StyledPageTitleContent>
              </StyledPageTitleRow>
              <StyledPageDescription data-testid="page-title-description-audience-targeting">
                {formatMessage({
                  id: 'Consumer.AudienceTargeting.description',
                })}
              </StyledPageDescription>
            </StyledPageTitleContainer>
          </StyledHomeContainer>
        </StyledGridContainer>
        <StyledGridContainer isResponsivePage>
          <StyledHomeContainer>
            {renderEmptyState(globalEmptyStateKind)}
          </StyledHomeContainer>
        </StyledGridContainer>
      </>
    );
  }

  return (
    <>
      <StickyScrollWithFilters
        filter={filterConfig}
        breadcrumbs={{
          pageList: [
            {
              href: '/consumer',
              pageName: formatMessage({ id: 'Pillars.pageName.consumer' }),
            },
            {
              href: '/consumer/audience-targeting',
              pageName: formatMessage({ id: 'Sidebar.audienceTargeting' }),
            },
          ],
          showIcon: true,
        }}
        isResponsivePage
      />

      <StyledGridContainer css={{ paddingBottom: 0 }} isResponsivePage>
        <StyledHomeContainer>
          <StyledPageTitleContainer data-testid="audience-targeting-title">
            <StyledPageTitleRow>
              <StyledPageTitleContent>
                <StyledTitle
                  size="H1"
                  data-testid="page-title-audience-targeting"
                >
                  {formatMessage({ id: 'Consumer.AudienceTargeting.title' })}
                </StyledTitle>
              </StyledPageTitleContent>
            </StyledPageTitleRow>
            <StyledPageDescription data-testid="page-title-description-audience-targeting">
              {formatMessage({
                id: 'Consumer.AudienceTargeting.description',
              })}
            </StyledPageDescription>
          </StyledPageTitleContainer>
        </StyledHomeContainer>
      </StyledGridContainer>

      <StyledGridContainer isResponsivePage>
        <StyledHomeContainer>
          <StyledContainer data-testid="audience-targeting">
            <StyledContent data-testid="audience-targeting-content">
              <RouteTabs
                baseRoute="/consumer/audience-targeting"
                tabsInfos={tabs.map((tab) => ({
                  ...tab,
                  filterConfig: {
                    ...tab.filterConfig,
                    pageName: filterConfig.pageName,
                  },
                }))}
              />
            </StyledContent>
          </StyledContainer>
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
