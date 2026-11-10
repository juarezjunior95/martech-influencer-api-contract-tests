import { Fragment, memo } from 'react';

import { Cover, TemplateSlide } from 'components';
import { TableDataType } from 'components/Table/types';
import { useBffData, usePageFilterApplied } from 'hooks';
import { TopBottomWaterfallSlideContent } from 'pages/components/ValueCreation/Slides/TopBottomWaterfallSlideContent';
import { BrandsSlide } from 'pages/pillars/ValueCreation/VolumePages/components';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import {
  useRegisterLoading,
  useVolumePagesKpi,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useKpiEndpoint } from 'pages/pillars/ValueCreation/VolumePages/hooks/useKpiEndpoint';
import { GlobalMovesSectionProps } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/components/GlobalMovesSection/types';
import {
  BarChartKpiData,
  BigNumbersKpiData,
  LineChartKpiData,
  WaterfallChartKpiData,
} from 'pages/pillars/ValueCreation/VolumePages/types';
import { getVolumePagesPageName } from 'pages/pillars/ValueCreation/VolumePages/VolumePages';
import { StyledExportPageSection } from 'shared/Styles/exportPages.styles';

export const GlobalMovesSection = memo(
  ({ period, dt_end, getPageByName, dataTestId }: GlobalMovesSectionProps) => {
    const { kpi, kpiName } = useVolumePagesKpi();
    const { applied } = usePageFilterApplied(getVolumePagesPageName(kpi));
    const isMarketShare = kpi === 'market_share';
    const kpiEndpoints = useKpiEndpoint(KPI_CONFIGS[kpi], applied);

    const globalMovesData = useBffData({
      id: kpiEndpoints.globalMoves,
      kpiGroup: KPI_CONFIGS[kpi].kpiGroup,
      subFilters: { dt_end, kpi },
      skipMainFilters: true,
    });

    useRegisterLoading('global-moves', globalMovesData.loading);

    return (
      <>
        {Object.entries(KPI_CONFIGS[kpi].globalMoves).map(([key, config]) => {
          const coverSectionName = config.coverSection;
          const sectionName = config.section;

          return (
            <Fragment key={key}>
              <StyledExportPageSection
                data-page-name={coverSectionName}
                data-testid={
                  dataTestId ? `${dataTestId}-${coverSectionName}` : undefined
                }
              >
                <Cover
                  dataTestId={
                    dataTestId
                      ? `${dataTestId}-${coverSectionName}-cover`
                      : undefined
                  }
                  category="One Way Reports"
                  name={config.title}
                  loading={false}
                  showLogo
                  centerLogo
                  centerText
                  showLink={false}
                />
              </StyledExportPageSection>

              <StyledExportPageSection
                data-page-name={sectionName}
                data-testid={
                  dataTestId ? `${dataTestId}-${sectionName}` : undefined
                }
              >
                <TemplateSlide
                  enablePngCopy
                  title={`Global ${config.title} ${kpiName}`}
                  measure={KPI_CONFIGS[kpi].measure}
                  period={period}
                  footnotes={
                    isMarketShare
                      ? 'Global Results considering 35 countries, excluding Argentina.'
                      : ''
                  }
                  page={getPageByName(sectionName)?.index}
                  countryId="ABI"
                  brandId={config.brand}
                  headerDivider={false}
                  dataTestId={
                    dataTestId ? `${dataTestId}-${sectionName}` : sectionName
                  }
                >
                  <BrandsSlide
                    dataTestId={
                      dataTestId
                        ? `${dataTestId}-${sectionName}-content`
                        : undefined
                    }
                    loading={globalMovesData.loading}
                    error={globalMovesData.error}
                    data={{
                      bigNumbersKpiData: globalMovesData.data?.[
                        `big-numbers-${config.key}`
                      ] as BigNumbersKpiData[],
                      barChartKpiData: globalMovesData.data?.[
                        `bar-chart-${config.key}`
                      ] as BarChartKpiData,
                      lineChartKpiData: globalMovesData.data?.[
                        `line-chart-${config.key}`
                      ] as LineChartKpiData,
                      marketsTableKpiData: globalMovesData.data?.[
                        `must-win-markets-${config.key}`
                      ] as TableDataType,
                    }}
                    lineChartHeight={344}
                  />
                </TemplateSlide>
              </StyledExportPageSection>

              <StyledExportPageSection
                data-page-name={config.volumeCountriesBreakdown}
                data-testid={
                  dataTestId
                    ? `${dataTestId}-${config.volumeCountriesBreakdown}`
                    : undefined
                }
              >
                <TemplateSlide
                  enablePngCopy
                  title={`Global ${config.title} ${kpiName} Countries Breakdown`}
                  measure={KPI_CONFIGS[kpi].measure}
                  period={period}
                  footnotes="Countries are ordered by: Must win markets, Stable/Mature markets and High Growth markets, then ranked by vol. size."
                  page={getPageByName(config.volumeCountriesBreakdown)?.index}
                  countryId="ABI"
                  brandId={config.brand}
                  headerDivider={false}
                  dataTestId={
                    dataTestId
                      ? `${dataTestId}-${config.volumeCountriesBreakdown}`
                      : config.volumeCountriesBreakdown
                  }
                >
                  <TopBottomWaterfallSlideContent
                    dataTestId={
                      dataTestId
                        ? `${dataTestId}-${config.volumeCountriesBreakdown}-content`
                        : undefined
                    }
                    loading={globalMovesData.loading}
                    error={globalMovesData.error}
                    data={{
                      topKpiData: globalMovesData.data?.[
                        `waterfall-${config.key}-YTD`
                      ]
                        ? {
                            ...(globalMovesData.data?.[
                              `waterfall-${config.key}-YTD`
                            ] as WaterfallChartKpiData),
                            legend: KPI_CONFIGS[kpi].legend.default,
                          }
                        : undefined,
                      bottomKpiData: globalMovesData.data?.[
                        `waterfall-${config.key}-MTD`
                      ]
                        ? {
                            ...(globalMovesData.data?.[
                              `waterfall-${config.key}-MTD`
                            ] as WaterfallChartKpiData),
                            legend: KPI_CONFIGS[kpi].legend.default,
                          }
                        : undefined,
                    }}
                  />
                </TemplateSlide>
              </StyledExportPageSection>
            </Fragment>
          );
        })}
      </>
    );
  },
);

GlobalMovesSection.displayName = 'GlobalMovesSection';
