import { Plugin } from 'chart.js';
import dataFoundations from 'theme/colors/dataFoundations';
import { fontFoundations } from 'theme/fonts/typography';

export interface ExtendYAxisProps {
  display: boolean;
}

export interface ExtendXAxisProps {
  display: boolean;
}

export const ExtendYAxisPlugin: Plugin<'bar'> = {
  id: 'extendYAxis',
  afterDraw(chart) {
    const DEFAULT_BORDER_COLOR = dataFoundations.charts.border.neutrals['40'];
    const LABEL_COLOR = dataFoundations.txt.secondary;
    const LABEL_FONT = fontFoundations.body.xsmall;

    const plugins = chart.config?.options?.plugins as
      Record<string, unknown> | undefined;
    const extendYAxisConfig = plugins?.extendYAxis as
      ExtendYAxisProps | undefined;
    const extendXAxisConfig = plugins?.extendXAxis as
      ExtendXAxisProps | undefined;

    const { ctx, chartArea, scales } = chart;
    const yScale = scales.y;

    if (!yScale?.options.display) return;

    const scaleOptions = yScale.options as { border?: { color?: unknown } };
    const borderColor =
      typeof scaleOptions.border?.color === 'string'
        ? scaleOptions.border.color
        : DEFAULT_BORDER_COLOR;

    ctx.save();

    if (extendYAxisConfig?.display) {
      const x = chartArea.left + 0.5;
      ctx.beginPath();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, 0);
      ctx.stroke();
    }

    if (extendXAxisConfig?.display) {
      const y = chartArea.bottom;
      ctx.beginPath();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.moveTo(0, y);
      ctx.lineTo(chartArea.left, y);
      ctx.stroke();

      const zeroY = yScale.getPixelForValue(0) - 2;
      const zeroX = yScale.right - 10;
      ctx.font = LABEL_FONT;
      ctx.fillStyle = LABEL_COLOR;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('0', zeroX, zeroY);
    }

    ctx.restore();
  },
};
