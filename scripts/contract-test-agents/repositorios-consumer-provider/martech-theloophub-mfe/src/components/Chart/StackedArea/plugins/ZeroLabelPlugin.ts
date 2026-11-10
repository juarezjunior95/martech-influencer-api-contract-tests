import { Chart, Plugin } from 'chart.js';

export const ZeroLabelPlugin: Plugin<'bar'> = {
  id: 'zeroLabel',

  afterDraw(chart: Chart) {
    const yAxis = chart.scales.y;
    if (!yAxis) return;

    const ctx = chart.ctx;
    const y = yAxis.getPixelForValue(0) - 4;
    const x = yAxis.right - 10;

    ctx.save();
    ctx.font = '12px "Work Sans", sans-serif';
    ctx.fillStyle = '#5C5C5C';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('0', x, y);
    ctx.restore();
  },
};
