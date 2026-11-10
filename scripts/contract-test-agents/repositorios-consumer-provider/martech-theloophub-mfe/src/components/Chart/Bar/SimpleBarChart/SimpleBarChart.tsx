import { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';

import { ChartData, Chart as ChartJS, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ConnectorPlugin } from 'components/Chart/plugins';
import { registerChartModules } from 'components/Chart/register';
import { theme } from 'theme';

import { DataLabelContext } from '../Bar/types';
import { CHART_CONSTANTS, COLORS } from './constants/constants';
import {
  ExtendYAxisPlugin,
  MissingDataBarPlugin,
  ZeroLabelPlugin,
} from './plugins';
import { MissingDataBarPluginOptions } from './plugins/MissingDataBarPlugin/MissingDataBarPlugin';

registerChartModules();

interface Connector {
  from: string;
  to: string;
  value: string;
  backgroundColor?: string;
  textColor?: string;
  measure: string;
}

export interface SimpleBarChartData {
  values: ChartData<'bar'>['datasets'][number]['data'];
  labels: string[];
  backgroundColor?: ChartData<'bar'>['datasets'][number]['backgroundColor'];
  connector?: Connector;
}

export interface PluginsOptions {
  offsetFirstTick?: {
    display: boolean;
    fontWeight: string;
  };
  zeroLabel?: {
    display: boolean;
  };
  extendYAxis?: {
    display: boolean;
  };
  extendXAxis?: {
    display: boolean;
  };
  missingDataBar?: MissingDataBarPluginOptions;
}

interface SimpleBarChartProps {
  data: SimpleBarChartData;
  barTickness?: number;
  width?: string;
  showGrid?: boolean;
  axisType?: 'one' | 'none';
  suggestedMin?: number;
  suggestedMax?: number;
  pluginsOptions?: PluginsOptions;
  layoutPadding?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  yStepSize?: number;
  dataLabelsFormatter?: (
    value: number | null,
    context: DataLabelContext,
  ) => string | number;
  onInit?: (instance: ChartJS<'bar'>) => void;
  dataTestId?: string;
}

export const SimpleBarChart = ({
  data,
  barTickness = CHART_CONSTANTS.DEFAULT_BAR_THICKNESS,
  width = '100%',
  showGrid = true,
  axisType = 'one',
  suggestedMin = 0,
  suggestedMax,
  pluginsOptions,
  layoutPadding,
  yStepSize,
  dataLabelsFormatter,
  onInit,
  dataTestId,
}: SimpleBarChartProps) => {
  const { values, labels, backgroundColor, connector } = data;
  const chartRef = useRef<ChartJS<'bar'>>();

  useEffect(() => {
    if (onInit && chartRef.current) {
      onInit(chartRef.current);
    }
  }, [onInit]);

  const missingDataIndexes = pluginsOptions?.missingDataBar?.naIndexes;
  const hasMissingData = !!missingDataIndexes?.length;

  // Replace null values with a near-zero sentinel so Chart.js always reserves
  // the bar slot. MissingDataBarPlugin draws the visual placeholder on top.
  const chartValues = hasMissingData
    ? (values as (number | null)[]).map((v) => v ?? Number.EPSILON)
    : values;

  const chartData: ChartData<'bar'> = {
    labels,
    datasets: [
      {
        data: chartValues,
        backgroundColor,
        barThickness: barTickness,
        borderRadius: CHART_CONSTANTS.BORDER_RADIUS,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x',
    borderColor: COLORS.WHITE,

    layout: {
      padding: layoutPadding || {
        top: 80,
        left: axisType === 'none' ? 16 : 10,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      zeroLabel: {
        display: pluginsOptions?.zeroLabel?.display,
        suggestedMin,
      },
      extendYAxis: {
        display: pluginsOptions?.extendYAxis?.display ?? false,
      },
      extendXAxis: {
        display: pluginsOptions?.extendXAxis?.display ?? false,
      },
      tooltip: {
        enabled: false,
      },
      ...(hasMissingData && {
        missingDataBar: {
          naIndexes: missingDataIndexes,
          color: pluginsOptions?.missingDataBar?.color ?? COLORS.GRID_LIGHT,
        },
      }),
      datalabels: {
        clamp: true,
        display: true,

        font: {
          family: CHART_CONSTANTS.FONT_FAMILY,
          size: CHART_CONSTANTS.FONT_SIZE,
          weight: 'normal',
          lineHeight: 0.5,
        },
        color: COLORS.BLACK,
        offset: hasMissingData
          ? (context: DataLabelContext) =>
              missingDataIndexes.includes(context.dataIndex)
                ? CHART_CONSTANTS.DATA_LABEL_OFFSET_MISSING_DATA
                : CHART_CONSTANTS.DATA_LABEL_OFFSET_DEFAULT
          : CHART_CONSTANTS.DATA_LABEL_OFFSET_DEFAULT,
        align: 'end',
        anchor: 'end',
        ...(dataLabelsFormatter && { formatter: dataLabelsFormatter }),
      },
      connector,
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          drawOnChartArea: false,
          tickWidth: 0,
          color: COLORS.GRID_LIGHT,
        },
        offset: true,
        border: { color: theme.colors.charts.border.neutrals[40] },
        ticks: {
          autoSkip: false,
          callback: (_, index) => labels[index] ?? '',
          font: {
            weight: 'normal',
            size: CHART_CONSTANTS.FONT_SIZE,
            family: CHART_CONSTANTS.FONT_FAMILY,
          },
          color: COLORS.BLACK_OPACITY,
          maxTicksLimit: CHART_CONSTANTS.MAX_X_TICKS,
          padding: 12,
          align: 'center',
          display: true,
        },
      },
      y: {
        offset: false,
        display: axisType !== 'none',
        border: { color: theme.colors.charts.border.neutrals[40] },
        grid: {
          drawOnChartArea: showGrid,
          display: showGrid,
          color: theme.colors.charts.border.neutrals[20],
        },
        beginAtZero: true,
        min: suggestedMin,
        max: suggestedMax,
        ticks: {
          stepSize: yStepSize,
          font: {
            weight: 'normal',
            size: CHART_CONSTANTS.FONT_SIZE,
            family: CHART_CONSTANTS.FONT_FAMILY,
          },
          color: '#1414148F',
          callback: (value) => {
            if (pluginsOptions?.extendXAxis?.display && value === 0) return '';
            return value;
          },
        },
        afterFit: (axis) => {
          axis.width = axisType === 'none' ? 0 : 40;
        },
      },
    },
  };

  return (
    <div style={{ height: '100%', width }} data-testid={dataTestId}>
      <Bar
        ref={chartRef}
        data={chartData}
        options={options}
        plugins={[
          ConnectorPlugin,
          ChartDataLabels,
          ZeroLabelPlugin,
          ExtendYAxisPlugin,
          MissingDataBarPlugin,
        ]}
      />
    </div>
  );
};
