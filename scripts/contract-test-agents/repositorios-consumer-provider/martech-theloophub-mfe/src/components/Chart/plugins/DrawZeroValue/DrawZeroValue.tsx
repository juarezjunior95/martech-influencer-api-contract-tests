import { Plugin } from 'chart.js';
import { theme } from 'theme';

export interface DrawZeroValueProps {
  display: boolean;
}

export const DrawZeroValue: Plugin<'bar', DrawZeroValueProps> = {
  id: 'zeroLabelPlugin',
  defaults: {
    display: false,
  },

  afterDraw(chart) {
    const ctx = chart.ctx;
    const yAxis = chart.scales.y;
    const options = chart.config.options.plugins.drawZeroValue || this.defaults;
    if (!yAxis || !options.display) return;

    const zeroY = yAxis.getPixelForValue(0);

    if (zeroY >= yAxis.top && zeroY <= yAxis.bottom) {
      ctx.save();
      ctx.font = "12px 'Work Sans', sans-serif";
      ctx.fillStyle = theme.colors.txt.secondary;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      const x = yAxis.left + 35;

      const y = zeroY - 10;

      ctx.fillText('0', x, y);

      ctx.restore();
    }
  },
};
