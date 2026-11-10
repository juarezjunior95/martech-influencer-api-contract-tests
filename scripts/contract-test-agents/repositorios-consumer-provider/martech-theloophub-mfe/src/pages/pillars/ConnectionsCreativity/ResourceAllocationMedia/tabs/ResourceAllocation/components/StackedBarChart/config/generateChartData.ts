import { BorderRadius, ChartData } from 'chart.js';

import { StackedChart } from '../../../types';
import { CHART_CONFIG } from '../constants';
import {
  calculateBorderRadius,
  formatDatalabelValue,
  getDatalabelBackground,
  getDatalabelBorderColor,
  getDatalabelColor,
  getDatalabelFont,
} from '../utils';

interface DatalabelContext {
  dataIndex: number;
  datasetIndex: number;
}

const resolveRowColors = (
  backgroundColor: string[] | string[][],
  dataIndex: number,
): string[] => {
  if (!Array.isArray(backgroundColor[0])) {
    return backgroundColor as string[];
  }
  const perRow = backgroundColor as string[][];
  return perRow[dataIndex === 0 ? 1 : 0] ?? perRow[0];
};

export const generateChartData = (
  chart: StackedChart,
  backgroundColor: string[] | string[][],
  borderRadius: BorderRadius[][] | BorderRadius[] | BorderRadius,
  minBarLength?: number,
): ChartData<'bar'> => {
  const { labels, datasets } = chart;

  return {
    labels,
    datasets: datasets.map((bar, datasetIndex: number) => {
      return {
        ...bar,
        minBarLength,
        borderWidth: (context: DatalabelContext) =>
          context.dataIndex === 0
            ? CHART_CONFIG.buBorderWidth
            : CHART_CONFIG.acBorderWidth,
        borderColor: (context: DatalabelContext) =>
          context.dataIndex === 0
            ? CHART_CONFIG.buBorderColor
            : CHART_CONFIG.acBorderColor,
        hoverBorderColor: (context: DatalabelContext) =>
          context.dataIndex === 0
            ? CHART_CONFIG.buHoverBorderColor
            : CHART_CONFIG.acHoverBorderColor,
        borderRadius: calculateBorderRadius(borderRadius, datasetIndex),
        borderSkipped: false,
        backgroundColor: Array.isArray(backgroundColor[0])
          ? (context: DatalabelContext) =>
              resolveRowColors(backgroundColor, context.dataIndex)[datasetIndex]
          : (backgroundColor as string[])[datasetIndex],
        datalabels: {
          color: (context: DatalabelContext) =>
            getDatalabelColor(datasets, context),
          font: (context: DatalabelContext) =>
            getDatalabelFont(datasets, context),
          backgroundColor: (context: DatalabelContext) =>
            getDatalabelBackground(
              datasets,
              context,
              resolveRowColors(backgroundColor, context.dataIndex),
            ),
          borderWidth: CHART_CONFIG.datalabelBorderWidth,
          borderColor: (context: DatalabelContext) =>
            getDatalabelBorderColor(datasets, context),
          borderRadius: CHART_CONFIG.datalabelBorderRadius,
          formatter: (value: number, context: DatalabelContext) =>
            formatDatalabelValue(datasets, value, context),
        },
      };
    }),
  };
};
