import { Chart } from 'react-chartjs-2';

import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getBorderRadius } from 'components/Chart/Bar/Bar/utils';
import {
  BaseChartColors,
  ConnectorPlugin,
  createHorizontalDashedLinePlugin,
  DatalabelWithVariation,
  LabelIcon,
  OffsetFirstTick,
  RoudedArrowProps,
  StripedBackground,
  VerticalGuidelines,
  YAxisFormatter,
} from 'components/Chart/plugins';
import {
  getChartSuggestedMinMax,
  getConnectorData,
} from 'components/Chart/utils';
import { useCurrentPage, usePageFilterApplied } from 'hooks';
import { theme } from 'theme';
import { formatNumberWithSuffix } from 'utils/format';

interface HorizontalDashedLineProps {
  value: number;
  unitMeasure?: string;
  xEnd?: number;
}

interface BarProps {
  datasets: ChartDataset<'bar'>[];
  roundedArrow?: RoudedArrowProps;
  labels?: any;
  formattedData?: string[];
  variationData?: { variation: string; direction: number }[];
  indexAxis?: 'x' | 'y';
  paddingTop?: number;
  grid?: boolean;
  datalabelWithVariation?: boolean;
  horizontalDashedLine?: HorizontalDashedLineProps[];
  baseChartColors?: string[];
  icons?: string[];
  offsetFirstTick?: boolean;
  suggestedMax?: number;
  yAxisFormat?: 'number' | 'percentage';
  labelIconTooltip?: string;
  horizontalDashedLineTooltip?: string;
  dataTestId?: string;
}

export const Bar: React.FC<BarProps> = ({
  datasets,
  labels,
  formattedData = [],
  variationData = [],
  roundedArrow,
  indexAxis = 'x',
  paddingTop = 80,
  grid = true,
  datalabelWithVariation = false,
  horizontalDashedLine,
  baseChartColors,
  icons = [],
  offsetFirstTick = false,
  suggestedMax: suggestedMaxProp,
  yAxisFormat = 'number',
  labelIconTooltip,
  horizontalDashedLineTooltip,
  dataTestId,
}) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);

  const { min, max: dataMax } = getChartSuggestedMinMax({ datasets });
  const max =
    suggestedMaxProp !== undefined && suggestedMaxProp > dataMax
      ? suggestedMaxProp
      : dataMax;
  const borderColor = theme.colors.charts.border.neutrals[40];
  const data: ChartData<'bar'> = {
    labels,
    datasets: datasets.map((dataset) => ({
      borderColor: 'transparent',
      backgroundColor: dataset.backgroundColor || [],
      pointRadius: 4,
      borderRadius: (context: any) => {
        const value = context.dataset.data[context.dataIndex] as number;
        return getBorderRadius(value, indexAxis);
      },
      datalabels: {
        display: formattedData?.length > 0,
        color: theme.colors.txt.default,
        font: {
          size: 12,
          family: "'Work Sans', sans-serif",
        },
        formatter: (value, context) => {
          const label = formattedData[context.dataIndex];
          return label;
        },
      },
      pointBackgroundColor: dataset.borderColor,
      tension: 0,
      borderSkipped: false,
      order: 2,
      maxBarThickness: 100,
      variationData,
      baseChartColors: baseChartColors || [],
      icons: icons || [],
      yAxisFormat,
      labelIconTooltip: labelIconTooltip || '',
      ...dataset,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    indexAxis,
    layout: {
      padding: {
        top: paddingTop,
        left: 0,
        right: indexAxis === 'y' ? 60 : 0,
      },
    },
    plugins: {
      offsetFirstTick: { display: offsetFirstTick, fontWeight: 'normal' },
      legend: { display: false },
      datalabels: { display: false },
      datalabelWithVariation: {
        separator: { yAxis: datalabelWithVariation ? '|' : ' ', xAxis: '-' },
        label: {
          display: datalabelWithVariation,
          font: "normal 12px 'Work Sans'",
          fontBold: "bold 12px 'Work Sans'",
          textBaseline: 'bottom',
          position: 'top',
          color: {
            inside: theme.colors.txt.default,
            outside: theme.colors.txt.default,
            white: '#E2E7EA',
          },
        },
        variation: {
          font: "normal 12px 'Work Sans'",
          fontBold: "bold 12px 'Work Sans'",
          textBaseline: 'bottom',
          color: {
            up: theme.colors.charts.txt.status.increase,
            down: theme.colors.charts.txt.status.decrease,
          },
        },
        background: '#FFF',
      },
      tooltip: {
        enabled: false,
      },
      verticalGuidelines: { displayAxisX: true },
      connector: getConnectorData({
        labels,
        roundedArrow,
      }),
    },
    scales: {
      x: {
        stacked: false,
        grid: { display: grid, drawOnChartArea: false, tickWidth: 0 },
        border: { color: borderColor },
        beginAtZero: true,
        offset: indexAxis === 'x',
        ticks: {
          autoSkip: false,
          callback: (value, index) => {
            if (indexAxis === 'y') return index;
            const label = data.labels[index];
            if (Array.isArray(label)) return label;
            if (typeof label === 'string' || typeof label === 'number') {
              return String(label);
            }
            return '';
          },
          font: (context) => {
            const appliedTimeFrame = applied?.time_frame;
            const tickLabel = context.tick?.label;
            const isHighlighted =
              indexAxis === 'x' &&
              typeof appliedTimeFrame === 'string' &&
              typeof tickLabel === 'string' &&
              appliedTimeFrame.includes(tickLabel);

            return {
              weight: isHighlighted ? 'bold' : 'normal',
              size: 12,
              family: "'Work Sans', sans-serif",
            };
          },
          color: () => {
            return theme.colors.txt.secondary;
          },
          maxTicksLimit: 4,
          padding: indexAxis === 'x' ? 12 : 0,
          align: 'center',
          display: true,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        offset: indexAxis === 'y',
        grid: {
          drawOnChartArea: true,
          drawTicks: indexAxis === 'x',
          display: grid && indexAxis === 'x',
          tickColor: (context) => {
            return context.index === 0 ? 'transparent' : borderColor;
          },
          color: (context) => {
            const isAlignZeroY = false;

            if (isAlignZeroY && context.tick.value === 0) {
              return theme.colors.charts.bg.neutrals[40];
            }
            return theme.colors.charts.bg.neutrals[5];
          },
          tickWidth: indexAxis === 'y' ? 1 : 2,
          lineWidth: 1,
        },
        suggestedMin: min,
        suggestedMax: max,
        ticks: {
          color: (context) => {
            return context.tick.value === 0 && min >= 0
              ? 'transparent'
              : theme.colors.txt.secondary;
          },
          font: {
            size: 12,
            family: "'Work Sans', sans-serif",
            style: 'normal',
          },
          maxTicksLimit: indexAxis === 'x' ? 7 : labels.length,
          callback: (value) => {
            const valueToNumber = Number(value);

            if (indexAxis === 'x') {
              if (valueToNumber < min) return '';

              return Number.isInteger(valueToNumber)
                ? formatNumberWithSuffix(valueToNumber, 0, 1).value
                : formatNumberWithSuffix(valueToNumber, 1, 2).value;
            }
            return labels[value];
          },
        },
        border: { color: borderColor },
        beginAtZero: true,
        afterFit: function (axis) {
          axis.width = indexAxis === 'y' ? 90 : 45;
        },
      },
    },
  };

  const plugins = [
    YAxisFormatter,
    DatalabelWithVariation,
    VerticalGuidelines,
    ChartDataLabels,
    StripedBackground,
    BaseChartColors,
    LabelIcon,
    OffsetFirstTick,
    ConnectorPlugin,
    ...(horizontalDashedLine && horizontalDashedLine.length > 0
      ? [
          createHorizontalDashedLinePlugin(
            horizontalDashedLine,
            horizontalDashedLineTooltip,
          ),
        ]
      : []),
  ].filter(Boolean);

  return (
    <div data-testid={dataTestId} style={{ width: '100%', height: '100%' }}>
      <Chart type="bar" data={data} options={options} plugins={plugins} />
    </div>
  );
};
