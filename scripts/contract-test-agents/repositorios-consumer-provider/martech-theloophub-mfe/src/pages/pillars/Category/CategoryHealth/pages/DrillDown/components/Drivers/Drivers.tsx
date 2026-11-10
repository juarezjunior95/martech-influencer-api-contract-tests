import React, { useMemo } from 'react';

import {
  BasicContainer,
  ChartHeader,
  ChartWrapper,
  ComparisonLine,
  Line,
  Skeleton,
} from 'components';
import { Legend } from 'components/Chart';
import { theme } from 'theme';

import {
  createBaseGridConfig,
  createFirstTickLabelPlugin,
  createIntegerTickCallback,
  createSuffixTickCallback,
} from '../../utils/chartAxisUtils';
import { getHighlightIndex } from '../../utils/getHighlightIndex';
import { NoDataAvailable } from '../NoDataAvailable/NoDataAvailable';
import {
  AXIS_CONFIG,
  CHART_COLORS,
  DATALABEL_OFFSET,
} from './drivers.constants';
import {
  ChartContainer,
  ChartContentWrapper,
  ContentContainer,
  HeaderWrapper,
  LegendContainer,
} from './Drivers.styles';
import { useDriversTooltip } from './hooks';
import { ChartContext, getAxisBounds, getDataLabelPosition } from './utils';

export interface DriversData {
  title: string;
  chartTitle: string;
  populationUnit: string;
  populationLabel: string;
  iclLabel: string;
  populationComparisonTitle: string;
  iclComparisonTitle: string;
  labels: string[];
  populationValues: number[];
  iclValues: number[];
  populationFormattedValues: string[];
  iclFormattedValues: string[];
  populationComparisonData: Array<{
    value: string;
    measure?: string;
    color?: string;
    trend?: 'positive' | 'negative';
  }>;
  iclComparisonData: Array<{
    value: string;
    measure?: string;
    color?: string;
    trend?: 'positive' | 'negative';
  }>;
}

interface DriversProps {
  data?: DriversData;
  dataTestId?: string;
  highlightLabel?: string;
  loading?: boolean;
}

export const Drivers: React.FC<DriversProps> = ({
  data,
  dataTestId,
  highlightLabel,
  loading,
}) => {
  const chartDataTestId = dataTestId
    ? `${dataTestId}-drivers-chart`
    : undefined;
  const legendDataTestId = dataTestId
    ? `${dataTestId}-drivers-legend`
    : undefined;
  const comparisonLineDataTestId = dataTestId
    ? `${dataTestId}-drivers-comparison-line`
    : undefined;

  const axisBounds = useMemo(
    () => getAxisBounds(data?.populationValues, data?.iclValues),
    [data?.populationValues, data?.iclValues],
  );

  const tooltipFn = useDriversTooltip({
    populationLabel: data?.populationLabel ?? '',
    iclLabel: data?.iclLabel ?? '',
    populationFormattedValues: data?.populationFormattedValues ?? [],
    iclFormattedValues: data?.iclFormattedValues ?? [],
    populationValues: data?.populationValues ?? [],
    iclValues: data?.iclValues ?? [],
  });

  const createLabelCallbacks = useMemo(
    () => (series: 'population' | 'icl') => {
      const cache = new Map<number, ReturnType<typeof getDataLabelPosition>>();

      const getPosition = (context: ChartContext) => {
        if (!cache.has(context.dataIndex)) {
          cache.set(
            context.dataIndex,
            getDataLabelPosition({
              context,
              populationValues: data?.populationValues ?? [],
              iclValues: data?.iclValues ?? [],
              series,
            }),
          );
        }
        return (
          cache.get(context.dataIndex) ?? { anchor: 'center', align: 'center' }
        );
      };

      return {
        anchor: (context: ChartContext) => getPosition(context).anchor,
        align: (context: ChartContext) => getPosition(context).align,
      };
    },
    [data?.populationValues, data?.iclValues],
  );

  if (loading) {
    return (
      <Skeleton
        width="100%"
        height="300px"
        length={1}
        dataTestId={dataTestId ? `skeleton-${dataTestId}-drivers` : undefined}
      />
    );
  }

  if (!data?.labels?.length || !data?.populationValues?.length) {
    return <NoDataAvailable dataTestId={dataTestId} />;
  }

  const finalHighlightIndex = getHighlightIndex(data.labels, highlightLabel);

  return (
    <BasicContainer
      dataTestId={dataTestId ? `${dataTestId}-drivers` : undefined}
      header={{
        title: data.title,
        titleSize: 'H2',
      }}
      layout={{ bodyPadding: false, background: '#F9F9F9' }}
    >
      <ContentContainer>
        <ChartWrapper
          dataTestId={
            dataTestId ? `${dataTestId}-drivers-chart-wrapper` : undefined
          }
          header={
            <HeaderWrapper>
              <ChartHeader
                title={data.chartTitle}
                measure={`  [ ${data.populationUnit} ]`}
                config={{
                  inline: 'horizontal',
                  type: 'large',
                  alignment: 'left',
                }}
              />
            </HeaderWrapper>
          }
        >
          <ChartContentWrapper>
            <ChartContainer>
              <Line
                dataTestId={chartDataTestId}
                labels={data.labels}
                axisType="two"
                plugins={[createFirstTickLabelPlugin()]}
                datasets={[
                  {
                    label: data.populationLabel,
                    data: data.populationValues,
                    borderColor: CHART_COLORS.population.border,
                    backgroundColor: CHART_COLORS.population.background,
                    pointBackgroundColor: CHART_COLORS.population.background,
                    borderWidth: 2,
                    yAxisID: 'y',
                    datalabels: {
                      ...createLabelCallbacks('population'),
                      offset: DATALABEL_OFFSET,
                      color: theme.colors.txt.default,
                      formatter: (_value, context) =>
                        data.populationFormattedValues[context.dataIndex] ?? '',
                    },
                  },
                  {
                    label: data.iclLabel,
                    data: data.iclValues,
                    borderColor: CHART_COLORS.icl.border,
                    backgroundColor: CHART_COLORS.icl.background,
                    pointBackgroundColor: CHART_COLORS.icl.background,
                    borderWidth: 2,
                    yAxisID: 'y1',
                    datalabels: {
                      ...createLabelCallbacks('icl'),
                      offset: DATALABEL_OFFSET,
                      color: theme.colors.txt.default,
                      formatter: (_value, context) =>
                        data.iclFormattedValues[context.dataIndex] ?? '',
                    },
                  },
                ]}
                formattedData={[
                  data.populationFormattedValues,
                  data.iclFormattedValues,
                ]}
                options={{
                  plugins: {
                    tooltip: {
                      enabled: false,
                      external: tooltipFn,
                      mode: 'index',
                      intersect: true,
                    },
                    lineChartHighlight: {
                      display: true,
                      highlightIndex: finalHighlightIndex,
                      highlightColor: '#FFF8DC',
                    },
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      suggestedMin: 0,
                      suggestedMax: data.labels.length - 1,
                    },
                    y: {
                      type: 'linear',
                      position: 'left',
                      suggestedMin: 0,
                      suggestedMax: axisBounds.populationMax,
                      grid: {
                        ...createBaseGridConfig(),
                        drawOnChartArea: true,
                      },
                      ticks: {
                        display: true,
                        callback: createSuffixTickCallback(),
                      },
                      afterFit: (axis: { width: number }) => {
                        axis.width = AXIS_CONFIG.y.width;
                      },
                    },
                    y1: {
                      type: 'linear',
                      position: 'right',
                      suggestedMin: 0,
                      suggestedMax: axisBounds.iclMax,
                      grid: {
                        ...createBaseGridConfig(),
                        drawOnChartArea: false,
                      },
                      ticks: {
                        display: true,
                        callback: createIntegerTickCallback(),
                      },
                      afterFit: (axis: { width: number }) => {
                        axis.width = AXIS_CONFIG.y1.width;
                      },
                    },
                  },
                }}
              />
            </ChartContainer>

            <LegendContainer>
              <Legend
                caption={[
                  {
                    label: data.populationLabel,
                    color: CHART_COLORS.population.background,
                    border: CHART_COLORS.population.border,
                    pointStyle: 'roundedRectangle',
                  },
                  {
                    label: data.iclLabel,
                    color: CHART_COLORS.icl.background,
                    border: CHART_COLORS.icl.border,
                    pointStyle: 'roundedRectangle',
                  },
                ]}
                legendPosition="right"
                fontSize="xsmall"
                dataTestId={legendDataTestId}
              />
            </LegendContainer>

            <ComparisonLine
              dataTestId={comparisonLineDataTestId}
              data={[
                {
                  title: data.populationComparisonTitle,
                  data: data.populationComparisonData,
                },
                {
                  title: data.iclComparisonTitle,
                  data: data.iclComparisonData,
                },
              ]}
              gridColumnsLength={data.labels.length}
              gridConfig={{ paddingLeft: 2, paddingRight: 2 }}
              borderConfig={{
                marginLeft: AXIS_CONFIG.y.width + 1,
                marginRight: AXIS_CONFIG.y1.width,
              }}
            />
          </ChartContentWrapper>
        </ChartWrapper>
      </ContentContainer>
    </BasicContainer>
  );
};
