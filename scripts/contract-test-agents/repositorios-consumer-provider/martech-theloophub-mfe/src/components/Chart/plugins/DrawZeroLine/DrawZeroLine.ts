import type { Chart, Plugin } from 'chart.js';

export interface DrawZeroLine {
  display?: boolean;
  color?: string;
}

export const paintChartZeroLine = (chart: Chart): void => {
  const { ctx, scales } = chart;
  const yScale = scales['y'];
  if (!yScale) return;

  const { display, color } = chart.config?.options?.plugins?.drawZeroLine || {};

  if (display === false) return;

  const yZero = yScale.getPixelForValue(0);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(chart.chartArea.left, yZero);
  ctx.lineTo(chart.chartArea.right, yZero);
  ctx.strokeStyle = color || '#AAB4BE';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
};

export const DrawZeroLine: Plugin = {
  id: 'drawZeroLine',
  /** Draw before datasets so the line stays under bars (e.g. waterfall). */
  beforeDatasetsDraw(chart) {
    paintChartZeroLine(chart);
  },
};
