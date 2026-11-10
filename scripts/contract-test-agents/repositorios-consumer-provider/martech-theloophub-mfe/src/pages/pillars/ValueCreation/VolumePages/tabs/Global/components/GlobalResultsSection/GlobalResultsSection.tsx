import { memo, useMemo } from 'react';

import { Cover, TemplateSlide } from 'components';
import { TableDataType } from 'components/Table/types';
import { useBffData, useFeatureToggle, usePageFilterApplied } from 'hooks';
import { AISummaryVolumePages } from 'pages/components/AISummary';
import { SlideContent } from 'pages/components/ValueCreation/Slides/SlideContent';
import { TopBottomBarChartSlideContent } from 'pages/components/ValueCreation/Slides/TopBottomBarChartSlideContent';
import { TopBottomWaterfallSlideContent } from 'pages/components/ValueCreation/Slides/TopBottomWaterfallSlideContent';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import {
  useRegisterLoading,
  useVolumePagesKpi,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useKpiEndpoint } from 'pages/pillars/ValueCreation/VolumePages/hooks/useKpiEndpoint';
import { GlobalResultsSectionProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/GlobalResultsSection/types';
import { pageSections } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/constants/sections';
import {
  BigNumbersKpiData,
  LineChartKpiData,
} from 'pages/pillars/ValueCreation/VolumePages/types';
import {
  barChartWithLegend,
  volumePagePrefixedTestId,
  waterfallChartWithLegend,
} from 'pages/pillars/ValueCreation/VolumePages/utils';
import { getVolumePagesPageName } from 'pages/pillars/ValueCreation/VolumePages/VolumePages';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

export const GlobalResultsSection = memo(
  ({
    globalCoverLink,
    getPageByName,
    dataTestId,
    monthYear,
    period,
  }: GlobalResultsSectionProps) => {
    const { kpi, kpiName } = useVolumePagesKpi();
    const { applied } = usePageFilterApplied(getVolumePagesPageName(kpi));
    const kpiEndpoints = useKpiEndpoint(KPI_CONFIGS[kpi], applied);
    const globalData = useBffData({
      id: kpiEndpoints.global,
      kpiGroup: KPI_CONFIGS[kpi].kpiGroup,
      skipMainFilters: true,
      subFilters: {
        kpi,
      },
    });

    useRegisterLoading('global-results', globalData.loading);

    const aiSummarySubFilters = useMemo(() => {
      return {
        country: 'ABI',
        viewtype: 'global',
      };
    }, []);

    const [aiSummaryEnabled, aiSummaryLoading] = useFeatureToggle(
      KPI_CONFIGS[kpi].aiSummaryToggleId || '',
    );
    const isAiSummaryEnabled = useMemo(() => {
      return aiSummaryEnabled && !aiSummaryLoading;
    }, [aiSummaryEnabled, aiSummaryLoading]);

    const waterfallLegend = KPI_CONFIGS[kpi].legend.default;
    const isMarketShare = kpi === 'market_share';

    return (
      <>
        <StyledExportPageSection data-page-name={pageSections.mainCover}>
          <Cover
            dataTestId={volumePagePrefixedTestId(dataTestId, 'main-cover')}
            category="One Way Reports"
            name={`Global ${kpiName} Pages`}
            countries={[{ code: 'ABI', name: 'Global' }]}
            loading={false}
            period={monthYear.toUpperCase()}
            showLogo
            link={globalCoverLink}
          />
        </StyledExportPageSection>

        {isAiSummaryEnabled && (
          <StyledExportPageSection data-page-name={pageSections.aiSummary}>
            <TemplateSlide
              enablePngCopy
              title=""
              page={getPageByName(pageSections.aiSummary)?.index}
              headerDivider={false}
              dataTestId={
                dataTestId
                  ? `${dataTestId}-${pageSections.aiSummary}`
                  : undefined
              }
              borderPosition={['top']}
              showFootnotes={false}
            >
              <AISummaryVolumePages
                pageName={getVolumePagesPageName(kpi)}
                subFilters={aiSummarySubFilters}
                dataTestId={dataTestId ? `ai-summary-${dataTestId}` : undefined}
              />
            </TemplateSlide>
          </StyledExportPageSection>
        )}

        <StyledExportPageSection data-page-name={pageSections.secondaryCover}>
          <Cover
            category="One Way Reports"
            name="Global Results"
            centerText
            centerLogo
            showLogo
            dataTestId={volumePagePrefixedTestId(dataTestId, 'global-results')}
            showLink={false}
          />
        </StyledExportPageSection>

        <StyledExportPageSection data-page-name={pageSections.globalVolume}>
          <TemplateSlide
            enablePngCopy
            title={`Global ${kpiName}`}
            measure={KPI_CONFIGS[kpi].measure}
            period={period}
            footnotes={
              isMarketShare
                ? 'Global Results considering 35 countries, excluding Argentina.'
                : ''
            }
            page={getPageByName(pageSections.globalVolume)?.index}
            countryId="ABI"
            headerDivider={false}
            dataTestId={volumePagePrefixedTestId(
              dataTestId,
              pageSections.globalVolume,
            )}
          >
            <SlideContent
              dataTestId={volumePagePrefixedTestId(dataTestId, 'global-volume')}
              loading={globalData.loading}
              error={globalData.error}
              data={{
                bigNumbersKpiData: globalData.data?.[
                  'big-numbers-global'
                ] as BigNumbersKpiData[],
                lineChartKpiData: globalData.data?.[
                  'line-chart-global'
                ] as LineChartKpiData,
                portfolioTableKpiData: globalData.data?.[
                  'portfolio'
                ] as TableDataType,
                prioritiesTableKpiData: globalData.data?.[
                  'growth-levers-priorities'
                ] as TableDataType,
                marketsTableKpiData: globalData.data?.[
                  'must-win-markets'
                ] as TableDataType,
              }}
              tableOrder={['portfolio', 'priorities', 'markets']}
            />
          </TemplateSlide>
        </StyledExportPageSection>

        <StyledExportPageSection
          data-page-name={pageSections.globalVolumeCountriesBreakdown}
        >
          <TemplateSlide
            enablePngCopy
            title={`Global ${kpiName} Countries Breakdown`}
            measure={KPI_CONFIGS[kpi].measure}
            period={period}
            footnotes="Countries are ordered by Must win markets, Stable/Mature markets and High Growth markets, then ranked by volume budget FY."
            page={
              getPageByName(pageSections.globalVolumeCountriesBreakdown)?.index
            }
            countryId="ABI"
            headerDivider={false}
            dataTestId={volumePagePrefixedTestId(
              dataTestId,
              pageSections.globalVolumeCountriesBreakdown,
            )}
          >
            <TopBottomWaterfallSlideContent
              dataTestId={volumePagePrefixedTestId(
                dataTestId,
                'global-countries-breakdown-slide',
              )}
              data={{
                topKpiData: waterfallChartWithLegend(
                  globalData.data,
                  'country-YTD',
                  waterfallLegend,
                ),
                bottomKpiData: waterfallChartWithLegend(
                  globalData.data,
                  'country-MTD',
                  waterfallLegend,
                ),
              }}
              loading={globalData.loading}
              error={globalData.error}
              chartHeight="190px"
            />
          </TemplateSlide>
        </StyledExportPageSection>

        <StyledExportPageSection data-page-name={pageSections.topBrandsYtd}>
          <TemplateSlide
            enablePngCopy
            title={`YTD Top and Bottom 15 Brands by ${kpiName}`}
            measure={KPI_CONFIGS[kpi].measure}
            period={period}
            footnotes={
              isMarketShare
                ? 'Brands are ordered by: Mrkt. Share delta weighted by country NR contribution.'
                : 'Brands are ordered by: Global Brands shown first as consolidated, then ranked by OG vs LY'
            }
            page={getPageByName(pageSections.topBrandsYtd)?.index}
            countryId="ABI"
            headerDivider={false}
            dataTestId={volumePagePrefixedTestId(
              dataTestId,
              pageSections.topBrandsYtd,
            )}
          >
            {isMarketShare ? (
              <TopBottomBarChartSlideContent
                dataTestId={volumePagePrefixedTestId(
                  dataTestId,
                  'top-brands-ytd',
                )}
                loading={globalData.loading}
                error={globalData.error}
                data={{
                  topKpiData: barChartWithLegend(
                    globalData.data,
                    'brand-top-YTD',
                    waterfallLegend,
                  ),
                  bottomKpiData: barChartWithLegend(
                    globalData.data,
                    'brand-bottom-YTD',
                    waterfallLegend,
                  ),
                }}
                chartHeight="190px"
              />
            ) : (
              <TopBottomWaterfallSlideContent
                dataTestId={volumePagePrefixedTestId(dataTestId, 'top-brands')}
                data={{
                  bottomKpiData: waterfallChartWithLegend(
                    globalData.data,
                    'brand-bottom-YTD',
                    waterfallLegend,
                  ),
                  topKpiData: waterfallChartWithLegend(
                    globalData.data,
                    'brand-top-YTD',
                    waterfallLegend,
                  ),
                }}
                loading={globalData.loading}
                error={globalData.error}
                chartHeight="144px"
              />
            )}
          </TemplateSlide>
        </StyledExportPageSection>

        <StyledExportPageSection data-page-name={pageSections.topBrandsMtd}>
          <TemplateSlide
            enablePngCopy
            title={`MTD Top and Bottom 15 Brands by ${kpiName}`}
            measure={KPI_CONFIGS[kpi].measure}
            period={period}
            footnotes={
              isMarketShare
                ? 'Brands are ordered by: Mrkt. Share delta weighted by country NR contribution.'
                : 'Brands are ordered by: Global Brands shown first as consolidated, then ranked by OG vs LY'
            }
            page={getPageByName(pageSections.topBrandsMtd)?.index}
            countryId="ABI"
            headerDivider={false}
            dataTestId={volumePagePrefixedTestId(
              dataTestId,
              pageSections.topBrandsMtd,
            )}
          >
            {isMarketShare ? (
              <TopBottomBarChartSlideContent
                dataTestId={volumePagePrefixedTestId(
                  dataTestId,
                  'top-brands-mtd',
                )}
                loading={globalData.loading}
                error={globalData.error}
                data={{
                  topKpiData: barChartWithLegend(
                    globalData.data,
                    'brand-top-MTD',
                    waterfallLegend,
                  ),
                  bottomKpiData: barChartWithLegend(
                    globalData.data,
                    'brand-bottom-MTD',
                    waterfallLegend,
                  ),
                }}
                chartHeight="190px"
              />
            ) : (
              <TopBottomWaterfallSlideContent
                dataTestId={volumePagePrefixedTestId(dataTestId, 'top-brands')}
                data={{
                  bottomKpiData: waterfallChartWithLegend(
                    globalData.data,
                    'brand-bottom-MTD',
                    waterfallLegend,
                  ),
                  topKpiData: waterfallChartWithLegend(
                    globalData.data,
                    'brand-top-MTD',
                    waterfallLegend,
                  ),
                }}
                loading={globalData.loading}
                error={globalData.error}
                chartHeight="144px"
              />
            )}
          </TemplateSlide>
        </StyledExportPageSection>
      </>
    );
  },
);

GlobalResultsSection.displayName = 'GlobalResultsSection';
