import { ChartOptions, FontSpec } from 'chart.js';
import { theme } from 'theme';

import {
  BAR_CATEGORY_PERCENTAGE,
  CHART_CONFIG,
  CHART_LAYOUT_PADDING_Y,
} from '../constants';

export const generateChartOptions = (
  total_allocation: { value: (string | number)[]; unit?: string },
  emptyIndices?: Set<number>,
): ChartOptions<'bar'> => {
  const categoryAxis = {
    stacked: true,
    beginAtZero: true,
    reverse: true,
    grid: { display: false },
    border: { display: false },
    ticks: {
      color: theme.colors.txt.default,
      font: theme.fonts.body.small as unknown as FontSpec,
    },
  };

  const valueAxis = {
    display: false,
    stacked: true,
    beginAtZero: true,
    min: 0,
    max: 100,
    grid: { display: false },
  };

  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    clip: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        clamp: true,
      },
      totalAllocationDatalabel: {
        total_allocation,
      },
      emptyBarOverlay: {
        emptyIndices: emptyIndices ?? new Set(),
      },
    },
    layout: {
      padding: {
        right: CHART_CONFIG.horizontalTotalLabelReservedWidth,
        left: 0,
        top: CHART_LAYOUT_PADDING_Y,
        bottom: CHART_LAYOUT_PADDING_Y,
      },
    },
    datasets: {
      bar: {
        categoryPercentage: BAR_CATEGORY_PERCENTAGE,
        barPercentage: 1,
      },
    },
    scales: {
      x: valueAxis,
      y: categoryAxis,
    },
  };
};
