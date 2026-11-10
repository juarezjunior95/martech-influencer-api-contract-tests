import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { Cover, StickyScrollWithFilters } from 'components';
import { useLastDataRefresh } from 'contexts';
import { FilterDataAccessor, FilterRegistry } from 'domain/Filter';
import {
  useExportPdf,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterStatus,
  usePageIndexes,
} from 'hooks';
import { PDF_DEFAULT_CONFIG } from 'pages/constants';
import { SharedKpis } from 'pages/enums';
import { StyledGridContainer, StyledGridItem } from 'shared/Styles';
import {
  StyledExportButton,
  StyledExportIcon,
  StyledExportPageContent,
  StyledExportPageHeader,
  StyledExportPageSection,
} from 'shared/Styles/exportPages.styles';
import { getViewtype } from 'utils/filter';
import { formatDateToQuarterYear } from 'utils/format';

import {
  VolumePprBrandPowerExportSections,
  VolumePprCountryFinancialExportSections,
  VolumePprParticipationExportSections,
  VolumePprPnlExportSections,
  VolumePprPortfolioPerformanceExportSection,
  VolumePprResourceAllocationExportSection,
  VolumePprSustainableGrowthByLeverExportList,
  VolumePprSustainableGrowthOverviewExportSection,
  VolumePprVolumeExportSections,
} from './components/VolumePprExportSections';
import { pageSections } from './constants';
import {
  useSustainableGrowthOverviewSlidesByGrowthLever,
  useVolumePprBrandPowerSlidesData,
  useVolumePprExportPageLoading,
  useVolumePprMarketShareSlidesData,
  useVolumePprNetRevenueSlidesData,
  useVolumePprParticipationSlidesData,
  useVolumePprPnlBrandsSlidesData,
  useVolumePprPortfolioPerformanceSlideData,
  useVolumePprResourceAllocationOverview,
  useVolumePprSustainableGrowthOverviewExportData,
  useVolumePprVolumeSlidesData,
} from './hooks';

export const VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME = 'value-creation_country-ppr';

const getInsightsAsArray = (
  insights: string | string[] | undefined,
): string[] => {
  if (!insights) return [];
  return Array.isArray(insights) ? insights : [insights];
};

const ExportIconRenderer = () => <StyledExportIcon />;

export const VolumePagesCountryPpr: React.FC = () => {
  const { formatMessage } = useIntl();
  const containerRef = useRef<HTMLDivElement>(null);
  const { getPageByName } = usePageIndexes(containerRef);
  const [isExporting, setIsExporting] = useState(false);
  const { applied, isGlobalZone } = usePageFilterApplied(
    VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME,
  );
  const { dataFilters } = usePageFilterData(VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME);
  const { isLoaded: isFiltersLoaded } = usePageFilterStatus(
    VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME,
  );
  const country = FilterDataAccessor.getInstance().getCountry(
    dataFilters,
    applied,
  );
  const zone = FilterDataAccessor.getInstance().getZone(dataFilters, applied);

  const { lastDataRefreshKpisDate, lastDataRefreshKpisDateMonthYear } =
    useLastDataRefresh();

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

  const kpiDtEnd = useMemo(
    () => ({
      finance: financeDtEnd,
      pos: posDtEnd,
      market_share: marketShareDtEnd,
      power: powerDtEnd,
    }),
    [financeDtEnd, posDtEnd, marketShareDtEnd, powerDtEnd],
  );

  const countryCode = String(country?.value) || '';

  const quarterYear = useMemo(
    () =>
      formatDateToQuarterYear(lastDataRefreshKpisDate.power, ' ', 0) + ' YTD',
    [lastDataRefreshKpisDate.power],
  );

  const posQuarterYear = useMemo(
    () => formatDateToQuarterYear(lastDataRefreshKpisDate.pos, ' ', 0) + ' YTD',
    [lastDataRefreshKpisDate.pos],
  );

  const participation = useVolumePprParticipationSlidesData(
    isGlobalZone,
    country?.value,
  );

  const volume = useVolumePprVolumeSlidesData(isGlobalZone, countryCode);

  const netRevenue = useVolumePprNetRevenueSlidesData(countryCode);

  const marketShare = useVolumePprMarketShareSlidesData(
    isGlobalZone,
    countryCode,
  );

  const brandPower = useVolumePprBrandPowerSlidesData();

  const portfolioPerformance = useVolumePprPortfolioPerformanceSlideData(
    String(zone?.value),
  );

  const pnl = useVolumePprPnlBrandsSlidesData();

  const sustainableGrowthOverviewSlideData =
    useVolumePprSustainableGrowthOverviewExportData({
      filters,
      kpiDtEnd,
    });

  const {
    slides: sustainableGrowthByGrowthLeverSlides,
    anyLoading: anyGrowthLeverSlideLoading,
  } = useSustainableGrowthOverviewSlidesByGrowthLever(filters, kpiDtEnd);

  const resourceAllocationOverview = useVolumePprResourceAllocationOverview();

  const insightsData =
    brandPower.countryData.data?.[SharedKpis.POWER_BOOK_INSIGHTS.id]?.insights;

  const evolutionAlertsForExport = useMemo(() => {
    const countryValue = String(country?.value);
    const noneInsights = insightsData?.evolution?.[countryValue]?.insights;
    const megabrandsInsights =
      insightsData?.evolution?.[countryValue]?.Megabrands?.insights;

    return [
      ...getInsightsAsArray(noneInsights),
      ...getInsightsAsArray(megabrandsInsights),
    ];
  }, [country?.value, insightsData]);

  const abiBrandInsightsForExport = useMemo(
    () =>
      getInsightsAsArray(insightsData?.brands?.[country?.value]?.ABI?.insights),
    [insightsData, country?.value],
  );

  const competitorBrandInsightsForExport = useMemo(
    () =>
      getInsightsAsArray(
        insightsData?.brands?.[country?.value]?.Competitor?.insights,
      ),
    [insightsData, country?.value],
  );

  const countryCoverLink = useMemo(() => {
    const countryCode = String(country?.value ?? '');
    if (!countryCode) return undefined;
    const zone = applied?.zone as string;
    return `/value-creation?${FilterRegistry.buildFilterQueryString({
      zone,
      country: countryCode,
    })}`;
  }, [country?.value, applied?.zone]);

  const formatPeriodTag = useCallback((rawQuarterYear: string) => {
    const [quarter, year] = rawQuarterYear.toUpperCase().split(' ');
    if (!quarter || !year) return '';
    return `${quarter}'${year.slice(-2)}`;
  }, []);

  const period = useMemo(
    () => formatPeriodTag(quarterYear),
    [formatPeriodTag, quarterYear],
  );

  const posPeriod = useMemo(
    () => formatPeriodTag(posQuarterYear),
    [formatPeriodTag, posQuarterYear],
  );

  const dataTestId = `volume-pages-country-ppr`;

  const { onExport } = useExportPdf(
    useMemo(
      () => ({
        ...PDF_DEFAULT_CONFIG,
        filename: `Value Creation - PPR Preread - ${quarterYear.toUpperCase()}`,
      }),
      [quarterYear],
    ),
  );

  const handlePDFExport = useCallback(async () => {
    setIsExporting(true);
    await onExport(
      Object.values(pageSections)
        .map((section) => document.querySelector(`[data-page-name=${section}]`))
        .filter(Boolean) as HTMLElement[],
    );
    setIsExporting(false);
  }, [onExport, setIsExporting]);

  const isDataLoading = useVolumePprExportPageLoading({
    sustainableGrowthOverview: sustainableGrowthOverviewSlideData.loading,
    sustainableGrowthByGrowthLever: anyGrowthLeverSlideLoading,
    participation: participation.sectionLoading,
    volume: volume.sectionLoading,
    netRevenue: netRevenue.sectionLoading,
    marketShare: marketShare.sectionLoading,
    portfolioPerformance: portfolioPerformance.sectionLoading,
    brandPower: brandPower.sectionLoading,
    pnl: pnl.sectionLoading,
    resourceAllocation:
      resourceAllocationOverview.overviewLoading ||
      resourceAllocationOverview.rankingLoading,
  });

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME,
          visibleFields: ['zone', 'country'],
          dataTestId: `${dataTestId}-filter`,
        }}
        breadcrumbs={{
          pageList: [
            {
              href: '/value-creation',
              pageName: formatMessage({ id: 'Pillars.pageName.valueCreation' }),
            },
            {
              href: '/value-creation/volume-pages-country-ppr',
              pageName: formatMessage({ id: 'Sidebar.volumePagesCountryPpr' }),
            },
          ],
          showIcon: true,
        }}
        isExportPage
      />

      <StyledGridContainer data-testid={dataTestId} isExportPage>
        <StyledGridItem
          data-testid={`${dataTestId}-grid-item`}
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{
            marginTop: 24,
            gap: 16,
          }}
        >
          <div ref={containerRef} style={{ paddingBottom: '24px' }}>
            <StyledExportPageContent
              data-testid={`${dataTestId}-content`}
              noMargin
            >
              <StyledExportPageHeader
                data-testid={
                  dataTestId
                    ? `tabpanel-country-export-page-header-${dataTestId}`
                    : undefined
                }
              >
                <StyledExportButton
                  data-testid={
                    dataTestId
                      ? `tabpanel-country-refresh-button-${dataTestId}`
                      : undefined
                  }
                  variant="primary"
                  size="medium"
                  onClick={handlePDFExport}
                  isLoading={isExporting || isDataLoading}
                  icon={ExportIconRenderer}
                  trailing
                >
                  Export File
                </StyledExportButton>
              </StyledExportPageHeader>
              <StyledExportPageSection data-page-name={pageSections.cover}>
                <Cover
                  dataTestId={`${dataTestId}-cover`}
                  category="One Way Reports"
                  name="Performance Review"
                  countries={[
                    {
                      code: String(country?.value) || '',
                      name: String(country?.label) || '',
                    },
                  ]}
                  loading={!isFiltersLoaded}
                  showLink
                  showLogo
                  period={quarterYear.toUpperCase()}
                  link={countryCoverLink}
                />
              </StyledExportPageSection>

              <VolumePprSustainableGrowthOverviewExportSection
                period={period}
                countryId={String(country?.value)}
                dataTestId={dataTestId}
                getPageByName={getPageByName}
                sustainableGrowthOverview={sustainableGrowthOverviewSlideData}
              />
              <VolumePprParticipationExportSections
                period={posPeriod}
                countryId={String(country?.value)}
                dataTestId={dataTestId}
                isGlobalZone={isGlobalZone}
                getPageByName={getPageByName}
                participation={participation}
              />

              <VolumePprBrandPowerExportSections
                period={period}
                countryId={String(country?.value)}
                dataTestId={dataTestId}
                getPageByName={getPageByName}
                brandPower={brandPower}
                evolutionAlerts={evolutionAlertsForExport}
                abiBrandInsights={abiBrandInsightsForExport}
                competitorBrandInsights={competitorBrandInsightsForExport}
              />
              <VolumePprVolumeExportSections
                period={period}
                countryId={String(country?.value)}
                countryLabel={String(country?.label)}
                dataTestId={dataTestId}
                isGlobalZone={isGlobalZone}
                getPageByName={getPageByName}
                volume={volume}
              />

              <VolumePprCountryFinancialExportSections
                period={period}
                countryId={String(country?.value) || ''}
                countryLabel={String(country?.label)}
                dataTestId={dataTestId}
                netRevenue={netRevenue}
                marketShare={marketShare}
              />

              <VolumePprPortfolioPerformanceExportSection
                period={period}
                countryId={String(country?.value)}
                dataTestId={dataTestId}
                getPageByName={getPageByName}
                portfolioPerformance={portfolioPerformance}
              />

              <VolumePprSustainableGrowthByLeverExportList
                period={period}
                countryId={String(country?.value)}
                dataTestId={dataTestId}
                getPageByName={getPageByName}
                slides={sustainableGrowthByGrowthLeverSlides}
              />

              <VolumePprPnlExportSections
                period={period}
                countryId={String(country?.value)}
                dataTestId={dataTestId}
                isGlobalZone={isGlobalZone}
                pageFilterPageName={VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME}
                getPageByName={getPageByName}
                pnl={pnl}
              />

              <VolumePprResourceAllocationExportSection
                period={period}
                countryId={String(country?.value)}
                dataTestId={dataTestId}
                isGlobalZone={isGlobalZone}
                formatMessage={formatMessage}
                getPageByName={getPageByName}
                resourceAllocation={resourceAllocationOverview}
              />
            </StyledExportPageContent>
          </div>
        </StyledGridItem>
      </StyledGridContainer>
    </>
  );
};
