import { ChartOptions, TooltipItem } from 'chart.js';

import {
  AXIS_BORDER_GRID_COLOR,
  CELL_VISIBILITY_THRESHOLD,
} from '../constants';
import { ResponsiveConfig, StackedAreaBarDataset } from '../types';
import { stackedAreaExternalTooltip } from './externalTooltip';

export const getStackedAreaOptions = (
  config: ResponsiveConfig,
): ChartOptions<'bar'> => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'x' as const,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  layout: {
    padding: config.padding,
  },
  scales: {
    x: {
      stacked: true,
      display: true,
      ticks: {
        font: {
          size: config.fontSize.label,
        },
      },
    },
    y: {
      stacked: true,
      display: true,
      beginAtZero: true,
      max: 100,
      grid: {
        display: true,
        drawOnChartArea: false,
        drawTicks: true,
        tickLength: 4,
        tickWidth: 3,
        tickColor: (ctx) =>
          ctx.tick.value === 0 ? 'transparent' : AXIS_BORDER_GRID_COLOR,
      },
      border: {
        display: true,
      },
      ticks: {
        callback: (value: number | string) => {
          const rounded = Math.round(Number(value));
          if (rounded === 0) return '';
          return rounded.toString();
        },
      },
    },
  },
  plugins: {
    customGrid: {
      display: false,
    },
    tooltip: {
      enabled: false,
      external: stackedAreaExternalTooltip,
      callbacks: {
        label: (context: TooltipItem<'bar'>) => {
          const dataset = context.dataset as StackedAreaBarDataset;
          const originalValue = dataset.originalValues?.[context.dataIndex];
          const value = originalValue ?? context.parsed.y;
          return `${context.dataset.label}: ${value}%`;
        },
      },
      filter: (context: TooltipItem<'bar'>) => {
        const meta = context.chart.getDatasetMeta(context.datasetIndex);
        const el = meta.data[context.dataIndex] as unknown as {
          base: number;
          y: number;
        };
        if (!el) return false;
        return Math.abs(el.base - el.y) < CELL_VISIBILITY_THRESHOLD;
      },
    },
    legend: {
      display: false,
    },
    datalabels: {
      display: (context) => {
        const value = context.dataset.data[context.dataIndex] as number;
        if (!value || value === 0) return false;
        const chartArea = context.chart.chartArea;
        if (!chartArea) return false;
        const expectedHeight = (value / 100) * chartArea.height;
        return expectedHeight >= CELL_VISIBILITY_THRESHOLD;
      },
      formatter: (_value: number, context: any) => {
        const original = context.dataset.originalValues?.[context.dataIndex];
        return original == null ? '' : `${original}%`;
      },
      anchor: 'center',
      align: 'center',
      color: '#141414',
      font: {
        size: config.fontSize.value,
        weight: 'normal',
      },
    },
  },
});
