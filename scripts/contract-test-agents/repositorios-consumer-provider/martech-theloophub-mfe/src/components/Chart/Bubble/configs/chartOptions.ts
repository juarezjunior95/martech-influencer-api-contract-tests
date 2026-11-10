import { ChartOptions } from 'chart.js';

import { COLUMN_WIDTH } from '../constants';
import { BubbleChartData } from '../types';
import { customExternalTooltip } from './externalTooltip';

export function getChartOptions(data: BubbleChartData): ChartOptions<'bubble'> {
  const columnsCount = data.datasets.length;

  return {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'nearest',
    },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: columnsCount * COLUMN_WIDTH,
        ticks: {
          stepSize: COLUMN_WIDTH,
          display: false,
        },
        grid: {
          drawTicks: false,
          drawOnChartArea: false,
        },
      },
      y: {
        beginAtZero: false,
        min: data.yAxis.min,
        max: data.yAxis.max,
        grid: {
          drawOnChartArea: false,
          tickLength: 4,
          tickColor: '#AAB4BE',
        },
        title: {
          display: false,
        },
        ticks: {
          callback: (v) =>
            v === data.yAxis.min || v === data.yAxis.max ? '' : v,
          padding: 10,
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: false,
        //usePointStyle: true,
        //boxWidth: 7,
        //boxHeight: 7,
        //padding: 5,
        external: customExternalTooltip,
        callbacks: {
          labelPointStyle: function (ctx) {
            return {
              pointStyle: 'circle',
              radius: 5,
              rotation: 0,
            };
          },
          label: function (ctx) {
            return (ctx.raw as any).tooltip;
          },
        },
      },
      legend: { display: false },
    },
    elements: {
      point: {
        radius: (ctx) => {
          const index = ctx.dataIndex;
          const point = ctx.dataset.data[index] as any;
          return point?.r || 5;
        },
        hoverRadius: (ctx) => {
          const index = ctx.dataIndex;
          const point = ctx.dataset.data[index] as any;
          return point?.r || 5;
        },
        hitRadius: 5,
        borderWidth: 2,
      },
    },
  };
}
