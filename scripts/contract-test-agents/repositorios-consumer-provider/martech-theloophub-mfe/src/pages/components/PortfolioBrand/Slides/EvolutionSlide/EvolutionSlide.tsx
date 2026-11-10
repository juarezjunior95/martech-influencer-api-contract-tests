import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Alert, ComparisonLine, DataStateHandler } from 'components';
import { SimpleBarChart } from 'components/Chart/Bar/SimpleBarChart/SimpleBarChart';
import { AISummaryAlert } from 'pages/components/AISummary';
import {
  StyledBrandPowerBookExportContainer,
  StyledParagraph,
} from 'pages/components/PortfolioBrand/PortfolioBrand.styles';
import { SectionHeader } from 'pages/components/SectionHeader';
import { BRAND_POWER_BOOK_EXPORT_PAGE_NAME } from 'pages/pillars/PortfolioBrand/BrandPowerBookExport';
import { HeaderContainer } from 'pages/pillars/PortfolioBrand/BrandPowerBookExport/components/HeaderContainer';
import { LegendItem } from 'pages/pillars/ValueCreation/VolumePages/types';
import { getChartAxisLimits } from 'utils/chart';

import {
  EVOLUTION_ALERT_LAYOUT_PADDING_PX,
  EVOLUTION_CHART_HEIGHT_MULTI_SLIDE_PX,
  EVOLUTION_CHART_HEIGHT_SINGLE_SLIDE_PX,
} from './constants';
import {
  StyledChartContainer,
  StyledEvolutionSlideRoot,
  StyledFirstChartContainer,
  StyledSecondChartContainer,
  StyledSectionHeader,
} from './EvolutionSlide.styles';

interface EvolutionSlideInfo {
  firstChartData: any;
  secondChartData: any;
  firstChartTitle: string;
  secondChartTitle: string;
  evolutionSlideLoading?: boolean;
  evolutionSlideError?: any;
  evolutionSlideEmpty?: boolean;
  legend?: LegendItem[];
  legendPeriod?: string;
  portfolioType?: string;
  aiSummary?: {
    id: string;
    subFilters: Record<string, string>;
  };
}

interface EvolutionSlideProps {
  evolutionSlideInfos: EvolutionSlideInfo[];
  alerts: string[];
  dataTestId?: string;
  barColors?: {
    lastYear: string;
    currentYear: string;
  };
}

const DEFAULT_BAR_COLORS = {
  lastYear: '#EDDAB1',
  currentYear: '#D1A33C',
};

export const EvolutionSlide = ({
  evolutionSlideInfos,
  alerts,
  dataTestId,
  barColors = DEFAULT_BAR_COLORS,
}: EvolutionSlideProps) => {
  const hasAlerts = Boolean(alerts?.length);
  const alertRef = useRef<HTMLDivElement>(null);
  const [alertHeightPx, setAlertHeightPx] = useState(0);

  const alertsLayoutSignature = alerts.join('\u0000');

  useLayoutEffect(() => {
    if (!hasAlerts) {
      setAlertHeightPx(0);
      return;
    }
    setAlertHeightPx(alertRef.current?.clientHeight ?? 0);
  }, [alertsLayoutSignature, evolutionSlideInfos.length, hasAlerts]);

  const chartCount = evolutionSlideInfos.length * 2;

  const chartHeightPx = useMemo(() => {
    const perChartBase =
      evolutionSlideInfos.length === 1
        ? EVOLUTION_CHART_HEIGHT_SINGLE_SLIDE_PX
        : EVOLUTION_CHART_HEIGHT_MULTI_SLIDE_PX;
    const baseTotalHeightPx = perChartBase * chartCount;
    const padding = hasAlerts ? EVOLUTION_ALERT_LAYOUT_PADDING_PX : 0;
    const totalAfterAlerts = hasAlerts
      ? baseTotalHeightPx - alertHeightPx
      : baseTotalHeightPx;
    const available = Math.max(0, totalAfterAlerts - padding);

    return chartCount > 0 ? available / chartCount : perChartBase;
  }, [alertHeightPx, chartCount, evolutionSlideInfos.length, hasAlerts]);

  const chartHeightStyle = `${chartHeightPx}px`;

  const getSuggestedMinAndMax = useCallback(
    (index: number) => {
      const slideInfo = evolutionSlideInfos[index];

      const min = Math.max(
        Math.min(slideInfo.firstChartData?.min, slideInfo.secondChartData?.min),
        0,
      );
      const max = Math.max(
        Math.max(slideInfo.firstChartData?.max, slideInfo.secondChartData?.max),
        0,
      );

      const limits = getChartAxisLimits({ min, max });

      return {
        yMin: Math.max(0, limits.yMin),
        yMax: limits.yMax,
      };
    },
    [evolutionSlideInfos],
  );

  const aiSummary = ({
    id,
    subFilters,
  }: {
    id: string;
    subFilters: Record<string, string>;
  }) => {
    return (
      <div style={{ marginBottom: '24px' }}>
        <AISummaryAlert
          pageName={BRAND_POWER_BOOK_EXPORT_PAGE_NAME}
          summaryPageIdentifier={id}
          dataTestId={`ai-summary-${dataTestId}`}
          subFilters={subFilters}
          kpiGroup="power"
          hasExpandedAction={false}
        />
      </div>
    );
  };
  return (
    <StyledEvolutionSlideRoot data-testid={dataTestId}>
      {hasAlerts && (
        <div
          ref={alertRef}
          style={{
            paddingBottom: 15,
          }}
        >
          <Alert
            type="info"
            message={
              <>
                {alerts.map((alert, index) => (
                  <StyledParagraph key={`${alert}-${index}`}>
                    {alert}
                  </StyledParagraph>
                ))}
              </>
            }
          />
        </div>
      )}

      {evolutionSlideInfos.map((slideInfo, index) => {
        const limits = getSuggestedMinAndMax(index);
        return (
          <div
            key={`evolution-slide-${index}-${slideInfo.firstChartTitle}`}
            style={{
              ...(index === evolutionSlideInfos.length - 1 && {
                marginTop: '15px',
              }),
            }}
          >
            {slideInfo.aiSummary && <div>{aiSummary(slideInfo.aiSummary)}</div>}
            <StyledBrandPowerBookExportContainer
              style={{
                display: 'flex',
              }}
            >
              <DataStateHandler
                error={slideInfo.evolutionSlideError}
                loading={slideInfo.evolutionSlideLoading}
                empty={slideInfo.evolutionSlideEmpty}
                skeletonProps={{
                  height: chartHeightStyle,
                  width: '100%',
                  length: 1,
                }}
              >
                <HeaderContainer showDivider title={slideInfo.firstChartTitle}>
                  <StyledSectionHeader>
                    <SectionHeader
                      period={slideInfo.firstChartData?.legendPeriod ?? '-'}
                      legends={[
                        {
                          label: 'Prev. Years',
                          color: barColors.lastYear,
                          shape: 'square',
                        },
                        {
                          label: 'AC. Year',
                          color: barColors.currentYear,
                          shape: 'square',
                        },
                      ]}
                    />
                  </StyledSectionHeader>
                  <StyledFirstChartContainer
                    style={{
                      height: chartHeightStyle,
                    }}
                  >
                    <StyledChartContainer>
                      <SimpleBarChart
                        data={{
                          values:
                            typeof slideInfo.firstChartData?.values ===
                            'function'
                              ? Array.from(slideInfo.firstChartData.values())
                              : slideInfo.firstChartData?.values || [],
                          labels: Array.isArray(slideInfo.firstChartData)
                            ? []
                            : slideInfo.firstChartData?.labels || [],
                          backgroundColor: Array.from(
                            {
                              length:
                                slideInfo.firstChartData?.values?.length || 0,
                            },
                            (_, idx) =>
                              idx ===
                              slideInfo.firstChartData?.values?.length - 1
                                ? barColors.currentYear
                                : barColors.lastYear,
                          ),
                          connector:
                            !Array.isArray(slideInfo.firstChartData) &&
                            slideInfo.firstChartData?.connector
                              ? {
                                  ...slideInfo.firstChartData.connector,
                                  value: String(
                                    slideInfo.firstChartData.connector.value,
                                  ),
                                }
                              : undefined,
                        }}
                        pluginsOptions={{
                          zeroLabel: {
                            display: true,
                          },
                        }}
                        suggestedMin={limits.yMin}
                        suggestedMax={limits.yMax}
                        showGrid={false}
                        axisType="none"
                        width="100%"
                      />
                    </StyledChartContainer>
                    {slideInfo.portfolioType &&
                      slideInfo.firstChartData?.variationCaptions &&
                      slideInfo.firstChartData.variationCaptions.length > 0 && (
                        <ComparisonLine
                          data={slideInfo.firstChartData.variationCaptions}
                          gridColumnsLength={
                            slideInfo.firstChartData?.labels?.length
                          }
                          gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
                          borderConfig={{ marginLeft: 20, marginRight: 0 }}
                        />
                      )}
                  </StyledFirstChartContainer>
                </HeaderContainer>

                <HeaderContainer title={slideInfo.secondChartTitle}>
                  <StyledSectionHeader>
                    <SectionHeader
                      period={slideInfo.secondChartData?.legendPeriod ?? '-'}
                      legends={[
                        {
                          label: 'Prev. Quartes',
                          color: barColors.lastYear,
                          shape: 'square',
                        },
                        {
                          label: 'AC. Year',
                          color: barColors.currentYear,
                          shape: 'square',
                        },
                      ]}
                    />
                  </StyledSectionHeader>
                  <StyledSecondChartContainer
                    style={{
                      height: chartHeightStyle,
                    }}
                  >
                    <StyledChartContainer>
                      <SimpleBarChart
                        data={{
                          values:
                            typeof slideInfo.secondChartData?.values ===
                            'function'
                              ? Array.from(slideInfo.secondChartData.values())
                              : slideInfo.secondChartData?.values || [],
                          labels: Array.isArray(slideInfo.secondChartData)
                            ? []
                            : slideInfo.secondChartData?.labels || [],
                          backgroundColor: Array.from(
                            {
                              length:
                                slideInfo.secondChartData?.values?.length || 0,
                            },
                            (_, idx) =>
                              idx ===
                              slideInfo.secondChartData?.values?.length - 1
                                ? barColors.currentYear
                                : barColors.lastYear,
                          ),
                          connector:
                            !Array.isArray(slideInfo.secondChartData) &&
                            slideInfo.secondChartData?.connector
                              ? {
                                  ...slideInfo.secondChartData.connector,
                                  value: String(
                                    slideInfo.secondChartData.connector.value,
                                  ),
                                }
                              : undefined,
                        }}
                        pluginsOptions={{
                          zeroLabel: {
                            display: true,
                          },
                        }}
                        suggestedMin={limits.yMin}
                        suggestedMax={limits.yMax}
                        showGrid={false}
                        axisType="none"
                        width="100%"
                      />
                    </StyledChartContainer>
                    {slideInfo.portfolioType &&
                      slideInfo.secondChartData?.variationCaptions &&
                      slideInfo.secondChartData.variationCaptions.length >
                        0 && (
                        <ComparisonLine
                          data={slideInfo.secondChartData.variationCaptions}
                          gridColumnsLength={
                            slideInfo.secondChartData?.labels?.length
                          }
                          gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
                          borderConfig={{ marginLeft: 20, marginRight: 0 }}
                        />
                      )}
                  </StyledSecondChartContainer>
                </HeaderContainer>
              </DataStateHandler>
            </StyledBrandPowerBookExportContainer>
          </div>
        );
      })}
    </StyledEvolutionSlideRoot>
  );
};
