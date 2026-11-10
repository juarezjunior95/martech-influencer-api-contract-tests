import { Chart, Color, Plugin, ScriptableScaleContext } from 'chart.js';
import { theme } from 'theme';

type ScriptableTickColor = (ctx: ScriptableScaleContext) => Color | undefined;

const patchedCharts = new WeakSet<Chart>();

export interface OffsetFirstTickProps {
  display: boolean;
  fontWeight: string;
}

export const OffsetFirstTick: Plugin<'bar', OffsetFirstTickProps> = {
  id: 'offsetFirstTick',
  defaults: {
    display: false,
    fontWeight: 'normal',
  },

  beforeUpdate(chart) {
    const options =
      chart.config.options.plugins.offsetFirstTick || this.defaults;
    if (!options.display) return;

    const indexAxis = chart.config.options.indexAxis || 'x';
    if (indexAxis !== 'x') return;

    const scales = chart.config.options.scales?.y;
    if (!scales || patchedCharts.has(chart)) return;

    const originalTicksColor = scales.ticks?.color as
      Color | ScriptableTickColor | undefined;
    const originalGridTickColor = scales.grid?.tickColor as
      Color | ScriptableTickColor | undefined;

    // Hide original first tick label to prevent duplicate zero
    scales.ticks = scales.ticks || {};
    scales.ticks.color = (ctx: ScriptableScaleContext): Color => {
      if (ctx?.index === 0) return 'transparent';
      if (typeof originalTicksColor === 'function') {
        return originalTicksColor(ctx) ?? theme.colors.txt.secondary;
      }
      return originalTicksColor ?? theme.colors.txt.secondary;
    };

    // Hide original first tick mark to prevent duplicate zero
    scales.grid = scales.grid || {};
    scales.grid.tickColor = (ctx: ScriptableScaleContext): Color => {
      if (ctx?.index === 0) return 'transparent';
      if (typeof originalGridTickColor === 'function') {
        return originalGridTickColor(ctx) ?? 'transparent';
      }
      return originalGridTickColor ?? 'transparent';
    };

    patchedCharts.add(chart);
  },

  afterDraw(chart) {
    const ctx = chart.ctx;
    const yAxis = chart.scales.y;
    const xAxis = chart.scales.x;
    const options =
      chart.config.options.plugins.offsetFirstTick || this.defaults;
    const firstTick = yAxis?.ticks[0];
    if (!yAxis || !xAxis || !options.display || !firstTick) return;

    const firstY = yAxis.getPixelForValue(firstTick.value);

    if (firstY >= yAxis.top && firstY <= yAxis.bottom) {
      ctx.save();
      ctx.font = `${options.fontWeight} 12px 'Work Sans', sans-serif`;
      ctx.fillStyle = theme.colors.txt.secondary;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const x = xAxis.left - 10;
      const y = firstY - 10;
      ctx.fillText(`${firstTick.label}`, x, y);
      ctx.restore();
    }
  },
};
