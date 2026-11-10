import { Plugin } from 'chart.js';

import { COLUMN_WIDTH } from '../constants';

export function createDividerPlugin(columnsCount: number): Plugin<'bubble'> {
  return {
    id: 'columnDividers',
    beforeDraw(chart) {
      const {
        ctx,
        chartArea: { top, bottom },
        scales: { x },
      } = chart;

      ctx.save();
      ctx.strokeStyle = 'rgba(20, 20, 20, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      for (let i = 1; i < columnsCount; i++) {
        const xPos = i * COLUMN_WIDTH;
        const pixel = x.getPixelForValue(xPos);

        ctx.beginPath();
        ctx.moveTo(pixel, top);
        ctx.lineTo(pixel, bottom);
        ctx.stroke();
      }

      ctx.restore();
    },
  };
}
