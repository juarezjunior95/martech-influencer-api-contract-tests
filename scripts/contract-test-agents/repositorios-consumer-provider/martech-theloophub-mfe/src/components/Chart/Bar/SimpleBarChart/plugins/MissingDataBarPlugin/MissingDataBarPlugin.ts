import { Chart, Plugin } from 'chart.js';
import { theme } from 'theme';

const MISSING_BAR_WIDTH = 48;
const MISSING_BAR_HEIGHT = 6;
const MISSING_BAR_BORDER_RADIUS = 4;
const DEFAULT_MISSING_BAR_COLOR = theme.colors.charts.border.neutrals[20];

export interface MissingDataBarPluginOptions {
  naIndexes: number[];
  color?: string;
}

/**
 * Draws a small fixed-size placeholder bar (48x6, 4px radius) at each N/A
 * index, anchored to the zero baseline. Used to visually distinguish
 * missing data from a true zero value.
 *
 * Options are read from `chart.options.plugins.missingDataBar` on every
 * redraw (instead of via closure) so data/color changes always reflect
 * the latest props.
 */
export const MissingDataBarPlugin: Plugin<'bar'> = {
  id: 'missingDataBar',
  afterDatasetsDraw(chart: Chart<'bar'>) {
    const pluginOpts = chart.options?.plugins?.missingDataBar as
      MissingDataBarPluginOptions | undefined;

    if (!pluginOpts?.naIndexes?.length) return;

    const { naIndexes, color = DEFAULT_MISSING_BAR_COLOR } = pluginOpts;
    const { ctx, scales } = chart;
    const xScale = scales.x;
    const yScale = scales.y;

    if (!xScale || !yScale) return;

    const baselineY = yScale.getPixelForValue(0);

    ctx.save();
    ctx.fillStyle = color;

    naIndexes.forEach((index) => {
      const centerX = xScale.getPixelForValue(index);
      const left = centerX - MISSING_BAR_WIDTH / 2;
      const top = baselineY - MISSING_BAR_HEIGHT;

      ctx.beginPath();
      ctx.moveTo(left + MISSING_BAR_BORDER_RADIUS, top);
      ctx.lineTo(left + MISSING_BAR_WIDTH - MISSING_BAR_BORDER_RADIUS, top);
      ctx.quadraticCurveTo(
        left + MISSING_BAR_WIDTH,
        top,
        left + MISSING_BAR_WIDTH,
        top + MISSING_BAR_BORDER_RADIUS,
      );
      ctx.lineTo(left + MISSING_BAR_WIDTH, baselineY);
      ctx.lineTo(left, baselineY);
      ctx.lineTo(left, top + MISSING_BAR_BORDER_RADIUS);
      ctx.quadraticCurveTo(left, top, left + MISSING_BAR_BORDER_RADIUS, top);
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  },
};
