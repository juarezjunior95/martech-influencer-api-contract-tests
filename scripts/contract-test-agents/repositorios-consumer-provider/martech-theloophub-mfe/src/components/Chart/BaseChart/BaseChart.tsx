import { Chart } from 'react-chartjs-2';

import { ChartData, ChartOptions, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  ClickabilityConfig,
  InteractionContext,
  InteractiveChartWrapper,
} from 'components/Chart/InteractiveChartWrapper';
import { ChartOptionsForWrapper } from 'components/Chart/InteractiveChartWrapper/types';
import {
  BaseChartColors,
  CustomGrid,
  DrawZeroLine,
  StripedBackground,
  VerticalGuidelines,
} from 'components/Chart/plugins';
import { BaseChartComponentProps } from 'components/Chart/types';
import { getChartSuggestedMinMax } from 'components/Chart/utils';
import { merge } from 'lodash';
import { theme } from 'theme';
import { formatNumberWithSuffix } from 'utils/format';

type GlobalWithChartHoveredDebug = typeof globalThis & {
  __chartHoveredIndex?: number | null;
};

export interface InteractiveChartConfig {
  onBarHover?: (index: number | null) => void;
  onBarSelect?: (index: number | null) => void;
  renderLegend?: (context: InteractionContext) => React.ReactNode;
  fillHeight?: boolean;
  clickability?: ClickabilityConfig;
  showTooltip?: boolean;
}

interface BaseChartProps extends BaseChartComponentProps {
  type?: ChartType;
  fractionDigits?: { xAxis?: number; yAxis?: number; y1Axis?: number };
  interactiveConfig?: InteractiveChartConfig;
  dataTestId?: string;
}

export const BaseChart = ({
  type = 'bar',
  datasets,
  labels,
  highlightLabels = [],
  options,
  plugins = [],
  showDivider = false,
  showGrid = true,
  showCustomGrid: showCustomGridProp = false,
  showLabels = true,
  drawZeroLine = false,
  axisType = 'one',
  indexAxis = 'x',
  baseChartColors = [],
  spacing = 0.15,
  fractionDigits = { xAxis: 1, yAxis: 1, y1Axis: 1 },
  interactiveConfig,
  borderColor = theme.colors.charts.border.neutrals[30],
  dataTestId,
}: BaseChartProps) => {
  const yAxisWidth = 40;

  const data: ChartData = {
    labels,
    datasets: datasets.map((dataset) => ({
      yAxisID: 'y',
      baseChartColors,
      ...dataset,
    })),
  };
  const { min, max } = getChartSuggestedMinMax(data, spacing);

  const showCustomGrid =
    showCustomGridProp || (!showDivider && axisType !== 'two');

  const getFont = (context) => {
    const hoveredIndex = (globalThis as GlobalWithChartHoveredDebug)
      .__chartHoveredIndex;
    const isHovered = hoveredIndex !== null && context.index === hoveredIndex;
    const isHighlighted = highlightLabels.includes(String(context.tick?.label));

    return {
      size: 12,
      family: "'Work Sans', sans-serif",
      style: 'normal',
      weight: isHovered || isHighlighted ? '500' : 'normal',
    };
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    indexAxis,
    layout: {
      padding: {
        top: 40,
        right: showCustomGrid && 16,
        left: axisType === 'none' && 16,
        bottom: !showLabels && 4,
      },
    },
    beginAtZero: true,
    scales: {
      x: {
        display: showLabels && (indexAxis === 'x' || axisType !== 'none'),
        grid: {
          display: false,
        },
        offset: indexAxis === 'x',
        border: { color: borderColor },
        ticks: {
          color: () => {
            return '#5C5C5C';
          },
          autoSkip: false,
          callback: (value, index) => {
            if (indexAxis === 'y')
              return index === 0
                ? ''
                : formatNumberWithSuffix(+value, 1, 2).value;
            return labels?.[index] ?? '';
          },
          font: getFont,
          padding: 8,
          display: true,
          maxRotation: 0,
          minRotation: 0,
        },
        suggestedMin: min,
        suggestedMax: max,
        beginAtZero: true,
      },
      y: {
        display: showLabels && (axisType !== 'none' || indexAxis === 'y'),
        grid: {
          display: showGrid && !showCustomGrid,
        },
        ticks: {
          color: () => '#5C5C5C',
          font: getFont,
          maxTicksLimit: indexAxis === 'x' ? 7 : labels.length,
          callback: (value, index) => {
            if (indexAxis === 'x') {
              return index === 0
                ? ''
                : formatNumberWithSuffix(+value, fractionDigits.yAxis ?? 1, 2)
                    .value;
            }
            return labels[value];
          },
        },
        position: 'left',
        suggestedMin: min,
        suggestedMax: max,
        afterFit: (axis) => {
          if (indexAxis === 'y') {
            axis.width = yAxisWidth * 2;
          } else {
            axis.width = axisType !== 'none' && yAxisWidth;
          }
        },
      },
      y1: {
        display: showLabels && axisType === 'two',
        grid: {
          display: false,
        },
        ticks: {
          color: '#5C5C5C',
          font: getFont,
          maxTicksLimit: indexAxis === 'x' ? 7 : labels.length,
          callback: (value, index) => {
            if (indexAxis === 'x') {
              return index === 0
                ? ''
                : formatNumberWithSuffix(+value, fractionDigits.y1Axis ?? 1, 2)
                    .value;
            }
            return labels[value];
          },
        },
        position: 'right',
        suggestedMin: min,
        suggestedMax: max,
        afterFit: (axis) => {
          if (axisType === 'two') {
            axis.width = yAxisWidth;
          }
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      verticalGuidelines: {
        display: true,
        displayLeftY: axisType !== 'none',
        displayRightY: showDivider || axisType === 'two',
        displayAxisX: true,
        color: borderColor,
      },
      customGrid: {
        display: showGrid && showCustomGrid,
      },
      drawZeroLine: {
        display: drawZeroLine,
        color: '#AAB4BE',
      },
    },
  } as ChartOptions;

  const mergedOptions = merge(
    {},
    defaultOptions,
    options,
  ) as ChartOptionsForWrapper;

  const chartContent = (
    <div style={{ width: '100%', height: '100%' }} data-testid={dataTestId}>
      <Chart
        type={type}
        data={data}
        options={mergedOptions}
        plugins={[
          VerticalGuidelines,
          StripedBackground,
          CustomGrid,
          ChartDataLabels,
          DrawZeroLine,
          BaseChartColors,
          ...plugins,
        ]}
      />
    </div>
  );

  if (interactiveConfig) {
    return (
      <InteractiveChartWrapper
        labels={labels || []}
        chartOptions={mergedOptions}
        indexAxis={indexAxis}
        onItemHover={interactiveConfig.onBarHover}
        onItemSelect={interactiveConfig.onBarSelect}
        renderLegend={interactiveConfig.renderLegend}
        fillHeight={interactiveConfig.fillHeight}
        clickability={interactiveConfig.clickability}
        showTooltip={interactiveConfig.showTooltip}
        dataTestId={
          dataTestId ? `${dataTestId}-interactive-wrapper` : undefined
        }
      >
        {chartContent}
      </InteractiveChartWrapper>
    );
  }

  return chartContent;
};
