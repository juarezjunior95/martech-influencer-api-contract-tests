import React from 'react';

import {
  BasicContainer,
  ChartHeader,
  ChartWrapper,
  ComparisonLine,
  Line,
  Skeleton,
} from 'components';

import {
  createBaseGridConfig,
  createSingleAxisFirstTickPlugin,
  createSuffixTickCallback,
} from '../../utils/chartAxisUtils';
import { getHighlightIndex } from '../../utils/getHighlightIndex';
import { NoDataAvailable } from '../NoDataAvailable/NoDataAvailable';
import {
  ChartContainer,
  ChartContentWrapper,
  ContentContainer,
  HeaderWrapper,
} from './LineChartPerformance.styles';

export interface ComparisonDataItem {
  value: string;
  measure: string;
  color: string;
}

export interface ChartMetadata {
  title: string;
  chartTitle: string;
  chartLabel: string;
  unit: string;
  comparisonTitle: string;
}

export interface YAxisConfig {
  suggestedMin?: number;
  suggestedMax?: number;
  stepSize?: number;
}

export interface LineChartPerformanceData extends ChartMetadata {
  labels: string[];
  values: number[];
  formattedValues: string[];
  comparisonData: ComparisonDataItem[];
}

export interface LineChartPerformanceProps {
  data?: LineChartPerformanceData;
  dataTestId?: string;
  highlightLabel?: string;
  yAxisConfig?: YAxisConfig;
  lineColor?: string;
  loading?: boolean;
}

const DEFAULT_LINE_COLOR = '#DEB333';

export const LineChartPerformance: React.FC<LineChartPerformanceProps> = ({
  data,
  dataTestId,
  highlightLabel,
  yAxisConfig,
  lineColor = DEFAULT_LINE_COLOR,
  loading,
}) => {
  if (loading) {
    return (
      <Skeleton
        width="100%"
        height="400px"
        length={1}
        dataTestId={dataTestId ? `skeleton-${dataTestId}` : undefined}
      />
    );
  }

  if (!data?.values?.length || !data?.labels?.length) {
    return <NoDataAvailable dataTestId={dataTestId} />;
  }

  const finalHighlightIndex = getHighlightIndex(data.labels, highlightLabel);

  return (
    <BasicContainer
      dataTestId={dataTestId}
      header={{
        title: data.title,
        titleSize: 'H2',
      }}
      layout={{ bodyPadding: false, background: '#F9F9F9' }}
    >
      <ContentContainer>
        <ChartWrapper
          dataTestId={dataTestId ? `${dataTestId}-chart-wrapper` : undefined}
          header={
            <HeaderWrapper>
              <ChartHeader
                title={data.chartTitle}
                measure={`  [ ${data.unit} ]`}
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
                dataTestId={dataTestId ? `${dataTestId}-chart` : undefined}
                labels={data.labels}
                plugins={[createSingleAxisFirstTickPlugin()]}
                datasets={[
                  {
                    label: `${data.chartLabel} ${data.unit}`,
                    data: data.values,
                    borderColor: lineColor,
                    pointBackgroundColor: lineColor,
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBorderWidth: 2,
                    pointBorderColor: '#FFFFFF',
                    yAxisID: 'y',
                  },
                ]}
                formattedData={[data.formattedValues]}
                options={{
                  plugins: {
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
                    y: {
                      type: 'linear',
                      position: 'left',
                      ...(yAxisConfig?.suggestedMin !== undefined && {
                        suggestedMin: yAxisConfig.suggestedMin,
                      }),
                      ...(yAxisConfig?.suggestedMax !== undefined && {
                        suggestedMax: yAxisConfig.suggestedMax,
                      }),
                      grid: {
                        ...createBaseGridConfig(),
                        drawOnChartArea: true,
                      },
                      ticks: {
                        ...(yAxisConfig?.stepSize !== undefined && {
                          stepSize: yAxisConfig.stepSize,
                        }),
                        callback: createSuffixTickCallback(),
                      },
                      afterFit: (axis: { width: number }) => {
                        axis.width = 55;
                      },
                    },
                  },
                }}
              />
            </ChartContainer>

            <ComparisonLine
              dataTestId={
                dataTestId ? `${dataTestId}-comparison-line` : undefined
              }
              data={[
                {
                  title: data.comparisonTitle,
                  data: data.comparisonData,
                },
              ]}
              gridColumnsLength={data.labels.length}
              gridConfig={{ paddingLeft: 2, paddingRight: 2 }}
              borderConfig={{ marginLeft: 56, marginRight: 8 }}
            />
          </ChartContentWrapper>
        </ChartWrapper>
      </ContentContainer>
    </BasicContainer>
  );
};
