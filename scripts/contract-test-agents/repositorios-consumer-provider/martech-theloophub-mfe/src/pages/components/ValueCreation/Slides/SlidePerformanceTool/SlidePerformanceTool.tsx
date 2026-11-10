import { memo, useMemo } from 'react';

import {
  Bar,
  BigNumber,
  ChartHeader,
  ChartLegend,
  ChartLegendItem,
  ComparisonLine,
  DataStateHandler,
  Line,
} from 'components';
import { getBarChartOptionsFromDatasets } from 'pages/pillars/ValueCreation/PerformanceTool/utils/getBarChartOptions';
import { theme } from 'theme';

import {
  StyledSlidePerformanceToolBigNumberContainer,
  StyledSlidePerformanceToolBodyContainer,
  StyledSlidePerformanceToolChartContainer,
  StyledSlidePerformanceToolChartsWrapper,
  StyledSlidePerformanceToolLegendContainer,
  StyledSlidePerformanceToolLineBarChartsGrid,
  StyledSlidePerformanceToolLineChartContainer,
  StyledSlidePerformanceToolRoot,
} from './SlidePerformanceTool.styles';
import { SlidePerformanceToolProps } from './types';

const CHART_COLORS = {
  lastYear: '#eddab1',
  budget: '#f1d715',
  current: '#d1a33c',
};

const getColor = (label?: string): string => {
  if (label === 'Last Year') return CHART_COLORS.lastYear;
  if (label === 'Budget') return CHART_COLORS.budget;
  return CHART_COLORS.current;
};

const getBarColors = (labels: string[], stripedIndexes: number[]) => {
  return labels.map((_, index, array) => {
    if (stripedIndexes.includes(index)) {
      return CHART_COLORS.budget;
    }

    if (index === array.length - 1) {
      return CHART_COLORS.current;
    }

    return CHART_COLORS.lastYear;
  });
};

const SlidePerformanceToolComponent = ({
  bignumberHeaderConfig = { inline: 'horizontal', type: 'large' },
  bigNumberData,
  bigNumberRequest,
  lineBarChartsData,
  lineBarChartsRequest,
}: SlidePerformanceToolProps) => {
  const legendItems = useMemo<ChartLegendItem[]>(() => {
    if (!lineBarChartsData?.legend) return [];

    return lineBarChartsData.legend.map((item) => ({
      label: item.label,
      color: getColor(item.label),
      shape: 'rectangle',
      size: 'small',
      decoration: item.label === 'Budget' ? 'dash' : 'none',
    }));
  }, [lineBarChartsData?.legend]);
  const lineDatasets = useMemo(() => {
    if (!lineBarChartsData?.lineChart?.datasets) return [];
    return lineBarChartsData.lineChart.datasets.map((dataset) => ({
      ...dataset,
      borderColor: dataset.borderColor || getColor(dataset.label),
      pointBackgroundColor:
        dataset.pointBackgroundColor || getColor(dataset.label),
    }));
  }, [lineBarChartsData?.lineChart?.datasets]);

  const barDatasets = useMemo(() => {
    if (!lineBarChartsData?.barChart?.datasets) return [];

    const labels = lineBarChartsData.barChart.labels || [];
    const backgroundColors = getBarColors(
      labels,
      lineBarChartsData?.barChart?.stripedIndexes || [],
    );

    return lineBarChartsData.barChart.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: backgroundColors,
    }));
  }, [
    lineBarChartsData?.barChart?.datasets,
    lineBarChartsData?.barChart?.labels,
    lineBarChartsData?.barChart?.stripedIndexes,
  ]);

  const highlightedIndexes = useMemo(() => {
    return lineBarChartsData?.lineChart?.highlightedIndexes || [];
  }, [lineBarChartsData?.lineChart?.highlightedIndexes]);

  const optionsBar = useMemo(
    () => getBarChartOptionsFromDatasets(lineBarChartsData?.barChart?.datasets),
    [lineBarChartsData?.barChart?.datasets],
  );

  return (
    <StyledSlidePerformanceToolRoot>
      <DataStateHandler
        loading={bigNumberRequest.loading}
        error={bigNumberRequest.error}
        empty={!bigNumberData || bigNumberData.length === 0}
        skeletonProps={{
          height: '112px',
          width: '336px',
          length: 2,
          borderRadius: 'medium',
        }}
      >
        <StyledSlidePerformanceToolBigNumberContainer>
          {bigNumberData?.map((bigNumber, index) => (
            <BigNumber
              key={bigNumber.header.title}
              header={
                <ChartHeader
                  title={bigNumber.header.title}
                  measure={bigNumber.header.measure}
                  config={bignumberHeaderConfig}
                />
              }
              alignment="center"
              data={bigNumber.data}
              size="small"
              asCard
              spacing="loose"
              orientation={'vertical'}
              fullWidth
              enableTruncation
            />
          ))}
        </StyledSlidePerformanceToolBigNumberContainer>
      </DataStateHandler>

      <DataStateHandler
        loading={lineBarChartsRequest.loading}
        error={lineBarChartsRequest.error}
        empty={!lineBarChartsData || !!lineBarChartsData?.empty}
        skeletonProps={{
          height: '328px',
          width: '100%',
          length: 1,
          borderRadius: 'none',
        }}
      >
        <StyledSlidePerformanceToolBodyContainer>
          <StyledSlidePerformanceToolLegendContainer>
            <ChartLegend items={legendItems} />
          </StyledSlidePerformanceToolLegendContainer>
          <StyledSlidePerformanceToolChartsWrapper>
            <StyledSlidePerformanceToolLineChartContainer>
              <StyledSlidePerformanceToolLineBarChartsGrid>
                <StyledSlidePerformanceToolChartContainer>
                  <Line
                    datasets={lineDatasets}
                    labels={lineBarChartsData?.lineChart?.labels}
                    formattedData={lineBarChartsData?.lineChart?.formattedData}
                    labelColors={[
                      theme.colors.txt.secondary,
                      theme.colors.txt.default,
                    ]}
                    highlightedIndexes={highlightedIndexes}
                    options={{
                      layout: {
                        padding: {
                          top: 20,
                        },
                      },
                      scales: {
                        y: {
                          suggestedMin:
                            lineBarChartsData?.lineChart?.suggestedMin,
                          suggestedMax:
                            lineBarChartsData?.lineChart?.suggestedMax,
                          beginAtZero: false,
                          ticks: {
                            maxTicksLimit: 50,
                          },
                          afterFit: (axis) => {
                            axis.width = 45;
                          },
                        },
                      },
                    }}
                    showDivider
                  />
                  {lineBarChartsData?.lineChart?.comparisonLine && (
                    <ComparisonLine
                      data={lineBarChartsData.lineChart.comparisonLine.data}
                      gridColumnsLength={
                        lineBarChartsData.lineChart.labels?.length || 0
                      }
                      gridConfig={{ paddingLeft: 5, paddingRight: 0 }}
                      borderConfig={{ marginLeft: 40, marginRight: 8 }}
                    />
                  )}
                </StyledSlidePerformanceToolChartContainer>
                <StyledSlidePerformanceToolChartContainer>
                  <Bar
                    datasets={barDatasets}
                    labels={lineBarChartsData?.barChart?.labels}
                    formattedData={lineBarChartsData?.barChart?.formattedData}
                    stripedIndexes={
                      lineBarChartsData?.barChart?.stripedIndexes || []
                    }
                    size="large"
                    showGrid={false}
                    showDivider={false}
                    axisType="none"
                    options={optionsBar}
                  />
                  {lineBarChartsData?.barChart?.comparisonLine && (
                    <ComparisonLine
                      data={lineBarChartsData.barChart.comparisonLine.data}
                      gridColumnsLength={
                        lineBarChartsData.barChart.labels?.length || 0
                      }
                      gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
                      borderConfig={{ marginLeft: 16, marginRight: 16 }}
                    />
                  )}
                </StyledSlidePerformanceToolChartContainer>
              </StyledSlidePerformanceToolLineBarChartsGrid>
            </StyledSlidePerformanceToolLineChartContainer>
          </StyledSlidePerformanceToolChartsWrapper>
        </StyledSlidePerformanceToolBodyContainer>
      </DataStateHandler>
    </StyledSlidePerformanceToolRoot>
  );
};

export const SlidePerformanceTool = memo(SlidePerformanceToolComponent);
