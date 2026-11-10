import { useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { Chart as ChartJS } from 'chart.js';
import { DataStateHandler, VariationCaption } from 'components';
import { Scale, SimpleBarChart, SimpleBarChartData } from 'components/Chart';
import { useCurrentPage, useIsInExportPage, usePageFilterApplied } from 'hooks';
import { Legend as LegendType } from 'pages/pillars/PortfolioBrand/BrandPowerBook/types';
import { PerformanceTrendChart } from 'pages/types';
import {
  StyledCardContainer,
  StyledLeftContainer,
  StyledRightContainer,
  StyledTooltip,
} from 'shared/Styles';
import { ContainerWithScroll } from 'utils/container';

import { ContentHeader } from '../ContentHeader';
import { PowerLegend } from '../PowerLegend';
import {
  StyledChartContainer,
  StyledSummaryForPowerPerformance,
  StyledTrendOverTimeVariation,
  StyledYearPowerAcVariation,
} from './PerformanceTrend.styles';

interface PerformanceTrendProps {
  title?: boolean;
  hasLegend?: boolean;
  subFilters?: Record<string, string>;
  loading: boolean;
  error: Error | null;
  trendOverTime: PerformanceTrendChart;
  yearPowerVsAc: PerformanceTrendChart;
  legend: LegendType[];
  showVariationCaption?: boolean;
  hideOverflow?: boolean;
  dataTestId?: string;
}

export const PerformanceTrend: React.FC<PerformanceTrendProps> = ({
  title = true,
  hasLegend = true,
  trendOverTime,
  yearPowerVsAc,
  legend,
  showVariationCaption = false,
  hideOverflow = false,
  loading,
  error,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const isExportPage = useIsInExportPage();
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const shouldShowTrendOverTimeVariationCaption = useMemo(
    () =>
      (applied?.scopes || showVariationCaption) &&
      !loading &&
      trendOverTime?.variationCaptions?.length > 0,
    [applied?.scopes, showVariationCaption, loading, trendOverTime],
  );

  const [chartInstance, setChartInstance] = useState<ChartJS<'bar'> | null>(
    null,
  );

  useEffect(() => {
    if (chartContainerRef.current) {
      chartContainerRef.current.scrollLeft =
        chartContainerRef.current.scrollWidth -
        chartContainerRef.current.clientWidth;
    }
  }, [trendOverTime, yearPowerVsAc, loading]);

  return (
    <div style={{ padding: title ? '0 24px' : 0 }} data-testid={dataTestId}>
      <StyledCardContainer>
        <StyledSummaryForPowerPerformance>
          <StyledLeftContainer>
            {title && (
              <ContentHeader
                title={formatMessage({
                  id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceTrend.YearPowerVsAc.title',
                })}
                subtitle={formatMessage({
                  id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceTrend.YearPowerVsAc.subtitle',
                })}
                tooltip={
                  <StyledTooltip>
                    {formatMessage({
                      id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceTrend.YearPowerVsAc.tooltip',
                    })}
                  </StyledTooltip>
                }
              />
            )}
            <StyledChartContainer
              isExportPage={isExportPage}
              data-testid={
                dataTestId ? `${dataTestId}-year-power-vs-ac` : undefined
              }
            >
              <DataStateHandler
                loading={loading}
                error={error}
                empty={yearPowerVsAc?.empty}
                skeletonProps={{
                  length: 1,
                  width: '463px',
                  height: '300px',
                  borderRadius: 'none',
                }}
              >
                <SimpleBarChart
                  data={yearPowerVsAc || ({} as SimpleBarChartData)}
                ></SimpleBarChart>
              </DataStateHandler>
            </StyledChartContainer>
            {(applied?.scopes || showVariationCaption) && !loading && (
              <StyledYearPowerAcVariation hideOverflow={hideOverflow}>
                <VariationCaption
                  variationCaptionData={yearPowerVsAc?.variationCaptions}
                  gridColumnsCount={
                    yearPowerVsAc?.variationCaptions?.[0]?.data?.length
                  }
                  paddingLeft={35}
                  paddingRight={0}
                  dividerPaddingRight={15}
                ></VariationCaption>
              </StyledYearPowerAcVariation>
            )}
          </StyledLeftContainer>
          <StyledRightContainer style={{ position: 'relative' }}>
            {title && (
              <ContentHeader
                title={formatMessage({
                  id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceTrend.TrendOverTime.title',
                })}
                subtitle={formatMessage({
                  id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceTrend.TrendOverTime.subtitle',
                })}
                tooltip={
                  <StyledTooltip>
                    {formatMessage({
                      id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceTrend.TrendOverTime.tooltip',
                    })}
                  </StyledTooltip>
                }
              />
            )}
            <ContainerWithScroll
              overflow={hideOverflow ? 'hidden' : 'autoX'}
              ref={chartContainerRef}
            >
              <StyledChartContainer
                className="performance-trend"
                data-testid={
                  dataTestId ? `${dataTestId}-trend-over-time` : undefined
                }
              >
                <DataStateHandler
                  loading={loading}
                  error={error}
                  empty={trendOverTime?.empty}
                  skeletonProps={{
                    length: 1,
                    width: isExportPage ? '1153px' : '756px',
                    height: '300px',
                    borderRadius: 'none',
                  }}
                >
                  <Scale
                    chart={chartInstance}
                    top={'73px'}
                    height={187}
                    left={'9px'}
                    hasVariation={shouldShowTrendOverTimeVariationCaption}
                  ></Scale>
                  <SimpleBarChart
                    data={trendOverTime || ({} as SimpleBarChartData)}
                    width={`max(${66 * trendOverTime?.labels?.length}px, 100%)`}
                    onInit={(chartInstance) => {
                      setChartInstance(chartInstance);
                    }}
                  ></SimpleBarChart>
                </DataStateHandler>
              </StyledChartContainer>
              {shouldShowTrendOverTimeVariationCaption && (
                <StyledTrendOverTimeVariation
                  hideOverflow={hideOverflow}
                  style={{ width: chartContainerRef.current?.scrollWidth }}
                >
                  <VariationCaption
                    variationCaptionData={trendOverTime?.variationCaptions}
                    gridColumnsCount={
                      trendOverTime?.variationCaptions?.[0]?.data?.length
                    }
                    paddingLeft={46}
                    paddingRight={0}
                    dividerPaddingRight={15}
                    headerMarginLeft={-14}
                  ></VariationCaption>
                </StyledTrendOverTimeVariation>
              )}
            </ContainerWithScroll>
          </StyledRightContainer>
        </StyledSummaryForPowerPerformance>
      </StyledCardContainer>

      {hasLegend && (
        <PowerLegend
          loading={loading}
          data={legend || []}
          data-testid={dataTestId ? `${dataTestId}-legend` : undefined}
        />
      )}
    </div>
  );
};
