import { memo, useCallback } from 'react';

import { Cover, TemplateSlide } from 'components';
import { TableDataType } from 'components/Table/types';
import { FilterRegistry } from 'domain/Filter';
import { useBffData, UseBffDataResponse, usePageFilterApplied } from 'hooks';
import {
  SlideContent,
  TopBottomBarChartSlideContent,
  TopBottomWaterfallSlideContent,
} from 'pages/components/ValueCreation';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import {
  useRegisterLoading,
  useVolumePagesKpi,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useKpiEndpoint } from 'pages/pillars/ValueCreation/VolumePages/hooks/useKpiEndpoint';
import { GrowthLeverSectionProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/GrowthLeverSection/types';
import {
  BigNumbersKpiData,
  LegendItem,
  LineChartKpiData,
} from 'pages/pillars/ValueCreation/VolumePages/types';
import {
  barChartWithLegend,
  volumePagePrefixedTestId,
  waterfallChartWithLegend,
} from 'pages/pillars/ValueCreation/VolumePages/utils';
import { getVolumePagesPageName } from 'pages/pillars/ValueCreation/VolumePages/VolumePages';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

const MARKET_SHARE_FOOTNOTE =
  'Brands are ordered by: Mrkt. Share delta weighted by country NR contribution.';
const DEFAULT_BRANDS_FOOTNOTE = 'Brands are ordered by: OG vs LY';

interface TopBottomBrandsSectionProps {
  dataTestId?: string;
  pageName: string;
  pageIndex?: number;
  title: string;
  measure: string;
  period: string;
  brandId: string;
  isMarketShare: boolean;
  mainData: UseBffDataResponse;
  waterfallLegend: LegendItem[];
  slideTestIdSuffix: string;
  topDataKey: string;
  bottomDataKey: string;
  barChartLoading: boolean;
  barChartError: Error | null;
  barChartTestIdSuffix: string;
}

const TopBottomBrandsSection = ({
  dataTestId,
  pageName,
  pageIndex,
  title,
  measure,
  period,
  brandId,
  isMarketShare,
  mainData,
  waterfallLegend,
  slideTestIdSuffix,
  topDataKey,
  bottomDataKey,
  barChartLoading,
  barChartError,
  barChartTestIdSuffix,
}: TopBottomBrandsSectionProps) => {
  const footnotes = isMarketShare
    ? MARKET_SHARE_FOOTNOTE
    : DEFAULT_BRANDS_FOOTNOTE;

  const renderBarChart = () => (
    <TopBottomBarChartSlideContent
      dataTestId={volumePagePrefixedTestId(dataTestId, barChartTestIdSuffix)}
      loading={barChartLoading}
      error={barChartError}
      data={{
        topKpiData: barChartWithLegend(
          mainData.data,
          topDataKey,
          waterfallLegend,
        ),
        bottomKpiData: barChartWithLegend(
          mainData.data,
          bottomDataKey,
          waterfallLegend,
        ),
      }}
      chartHeight="190px"
    />
  );

  const renderWaterfall = () => (
    <TopBottomWaterfallSlideContent
      dataTestId={volumePagePrefixedTestId(dataTestId, slideTestIdSuffix)}
      data={{
        topKpiData: waterfallChartWithLegend(
          mainData.data,
          topDataKey,
          waterfallLegend,
        ),
        bottomKpiData: waterfallChartWithLegend(
          mainData.data,
          bottomDataKey,
          waterfallLegend,
        ),
      }}
      loading={mainData.loading}
      error={mainData.error}
      chartHeight="144px"
    />
  );

  return (
    <StyledExportPageSection
      data-page-name={pageName}
      data-testid={volumePagePrefixedTestId(dataTestId, pageName)}
    >
      <TemplateSlide
        enablePngCopy
        title={title}
        measure={measure}
        period={period}
        footnotes={footnotes}
        page={pageIndex}
        countryId="ABI"
        brandId={brandId}
        headerDivider={false}
        dataTestId={volumePagePrefixedTestId(dataTestId, pageName, pageName)}
      >
        {isMarketShare ? renderBarChart() : renderWaterfall()}
      </TemplateSlide>
    </StyledExportPageSection>
  );
};

const computeGrowthLeverLoading = (params: {
  prioritiesPageType?: string;
  prioritiesGrowthLever?: string;
  portfolioConfig?: GrowthLeverSectionProps['portfolioConfig'];
  hasPortfolioEndpoint: boolean;
  mainLoading: boolean;
  prioritiesLoading: boolean;
  portfolioLoading: boolean;
}): boolean => {
  const {
    prioritiesPageType,
    prioritiesGrowthLever,
    portfolioConfig,
    hasPortfolioEndpoint,
    mainLoading,
    prioritiesLoading,
    portfolioLoading,
  } = params;

  const hasPriorities = Boolean(prioritiesPageType || prioritiesGrowthLever);
  const hasPortfolio = Boolean(hasPortfolioEndpoint && portfolioConfig);

  return (
    mainLoading ||
    (hasPriorities && prioritiesLoading) ||
    (hasPortfolio && portfolioLoading)
  );
};

export const GrowthLeverSection = memo(
  ({
    leverKey,
    config,
    period,
    getPageByName,
    dataTestId,
    mainSubFilters,
    prioritiesPageType,
    prioritiesGrowthLever,
    portfolioConfig,
    tableOrder,
  }: GrowthLeverSectionProps) => {
    const sectionName = config.section;
    const { kpi, kpiName } = useVolumePagesKpi();
    const { applied } = usePageFilterApplied(getVolumePagesPageName(kpi));
    const kpiGroup = KPI_CONFIGS[kpi].kpiGroup;
    const kpiEndpoints = useKpiEndpoint(KPI_CONFIGS[kpi], applied);

    const mainData = useBffData({
      id: kpiEndpoints.segmentsGb,
      kpiGroup,
      subFilters: mainSubFilters,
      skipMainFilters: true,
    });

    const prioritiesData = useBffData({
      id: KPI_CONFIGS[kpi].growthLevers[leverKey].endpoints.priorities,
      kpiGroup,
      subFilters: {
        page_type: prioritiesPageType,
        growth_lever: prioritiesGrowthLever,
        kpi,
      },
      skipMainFilters: true,
      skipRequest: !prioritiesPageType && !prioritiesGrowthLever,
    });

    const portfolioData = useBffData({
      id:
        KPI_CONFIGS[kpi].growthLevers[leverKey].endpoints.portfolio ??
        kpiEndpoints.segmentsGbPortfolio,
      kpiGroup,
      subFilters: portfolioConfig
        ? { page_type: portfolioConfig.pageType, kpi }
        : undefined,
      skipMainFilters: true,
      skipRequest: !portfolioConfig,
    });

    useRegisterLoading(
      `growth-lever-${leverKey}`,
      computeGrowthLeverLoading({
        prioritiesPageType,
        prioritiesGrowthLever,
        portfolioConfig,
        hasPortfolioEndpoint: Boolean(kpiEndpoints.segmentsGbPortfolio),
        mainLoading: mainData.loading,
        prioritiesLoading: prioritiesData.loading,
        portfolioLoading: portfolioData.loading,
      }),
    );

    const portfolioTableData = portfolioConfig
      ? (portfolioData.data?.[portfolioConfig.dataKey] as TableDataType)
      : null;

    const buildCoverLink = useCallback(
      (growthLeverKey: string) =>
        `/value-creation?${FilterRegistry.buildFilterQueryString({
          value_creation_growth_levers: growthLeverKey,
          country: 'ABI',
          zone: 'ABI',
        })}`,
      [],
    );

    const waterfallLegend = KPI_CONFIGS[kpi].legend.default;
    const slideTestIdSuffix = `${sectionName}-slide`;
    const isMarketShare = kpi === 'market_share';
    const measure = KPI_CONFIGS[kpi].measure;
    const brandId = config.brand;
    const mainSlideFootnote = isMarketShare
      ? 'Global Results considering 35 countries, excluding Argentina.'
      : '';

    return (
      <>
        <StyledExportPageSection data-page-name={config.coverSection}>
          <Cover
            category="One Way Reports"
            name={config.title}
            centerText
            centerLogo
            showLogo
            showLink={false}
            link={buildCoverLink(config.growthLeverKey)}
            dataTestId={volumePagePrefixedTestId(dataTestId, 'global-results')}
          />
        </StyledExportPageSection>

        <StyledExportPageSection
          data-page-name={sectionName}
          data-testid={volumePagePrefixedTestId(dataTestId, sectionName)}
        >
          <TemplateSlide
            enablePngCopy
            title={`Global ${config.title} ${kpiName}`}
            measure={measure}
            period={period}
            footnotes={mainSlideFootnote}
            page={getPageByName(sectionName)?.index}
            countryId="ABI"
            brandId={brandId}
            headerDivider={false}
            dataTestId={volumePagePrefixedTestId(
              dataTestId,
              sectionName,
              sectionName,
            )}
          >
            <SlideContent
              dataTestId={volumePagePrefixedTestId(
                dataTestId,
                slideTestIdSuffix,
              )}
              loading={mainData.loading}
              error={mainData.error && prioritiesData.error}
              data={{
                bigNumbersKpiData: mainData.data?.[
                  'big-numbers'
                ] as BigNumbersKpiData[],
                lineChartKpiData: mainData.data?.[
                  'line-chart'
                ] as LineChartKpiData,
                portfolioTableKpiData: portfolioTableData,
                prioritiesTableKpiData: prioritiesData.data?.[
                  'segments-table'
                ] as TableDataType,
                marketsTableKpiData: mainData.data?.[
                  'must-win-markets'
                ] as TableDataType,
              }}
              tableOrder={tableOrder}
            />
          </TemplateSlide>
        </StyledExportPageSection>

        <StyledExportPageSection
          data-page-name={config.volumeCountriesBreakdown}
          data-testid={volumePagePrefixedTestId(dataTestId, sectionName)}
        >
          <TemplateSlide
            enablePngCopy
            title={`Global ${config.title} ${kpiName} Countries Breakdown`}
            measure={measure}
            period={period}
            footnotes="Countries are ordered by Must win markets, Stable/Mature markets and High Growth markets, then ranked by volume budget FY."
            page={getPageByName(config.volumeCountriesBreakdown)?.index}
            countryId="ABI"
            brandId={brandId}
            headerDivider={false}
            dataTestId={volumePagePrefixedTestId(
              dataTestId,
              config.volumeCountriesBreakdown,
              config.volumeCountriesBreakdown,
            )}
          >
            <TopBottomWaterfallSlideContent
              dataTestId={volumePagePrefixedTestId(
                dataTestId,
                slideTestIdSuffix,
              )}
              data={{
                topKpiData: waterfallChartWithLegend(
                  mainData.data,
                  'country-YTD',
                  waterfallLegend,
                ),
                bottomKpiData: waterfallChartWithLegend(
                  mainData.data,
                  'country-MTD',
                  waterfallLegend,
                ),
              }}
              loading={mainData.loading}
              error={mainData.error}
              chartHeight="190px"
            />
          </TemplateSlide>
        </StyledExportPageSection>

        <TopBottomBrandsSection
          dataTestId={dataTestId}
          pageName={config.topBrandsYtd}
          pageIndex={getPageByName(config.topBrandsYtd)?.index}
          title={`YTD Top and Bottom 15 ${config.title} Brands by ${kpiName}`}
          measure={measure}
          period={period}
          brandId={brandId}
          isMarketShare={isMarketShare}
          mainData={mainData}
          waterfallLegend={waterfallLegend}
          slideTestIdSuffix={slideTestIdSuffix}
          topDataKey="brand-top-YTD"
          bottomDataKey="brand-bottom-YTD"
          barChartLoading={mainData.loading}
          barChartError={mainData.error}
          barChartTestIdSuffix={`${slideTestIdSuffix}-ytd`}
        />

        <TopBottomBrandsSection
          dataTestId={dataTestId}
          pageName={config.topBrandsMtd}
          pageIndex={getPageByName(config.topBrandsMtd)?.index}
          title={`MTD Top and Bottom 15 ${config.title} Brands by ${kpiName}`}
          measure={measure}
          period={period}
          brandId={brandId}
          isMarketShare={isMarketShare}
          mainData={mainData}
          waterfallLegend={waterfallLegend}
          slideTestIdSuffix={slideTestIdSuffix}
          topDataKey="brand-top-MTD"
          bottomDataKey="brand-bottom-MTD"
          barChartLoading={false}
          barChartError={null}
          barChartTestIdSuffix={`${slideTestIdSuffix}-mtd`}
        />
      </>
    );
  },
);

GrowthLeverSection.displayName = 'GrowthLeverSection';
