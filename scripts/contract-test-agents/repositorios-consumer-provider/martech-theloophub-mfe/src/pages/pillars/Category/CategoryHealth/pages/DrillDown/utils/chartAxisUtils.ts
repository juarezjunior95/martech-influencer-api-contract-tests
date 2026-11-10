import { Plugin } from 'chart.js';
import { theme } from 'theme';
import { formatNumberWithSuffix } from 'utils/format';

type TickCallback = (value: string | number, index: number) => string | number;

export function createSuffixTickCallback(): TickCallback {
  return function (value: string | number, index: number) {
    if (typeof value !== 'number') return value;
    if (index === 0) return '';
    return formatNumberWithSuffix(value, 0, 1).value;
  };
}

export function createIntegerTickCallback(): TickCallback {
  return function (value: string | number) {
    if (typeof value !== 'number') return value;
    if (!Number.isInteger(value)) return '';
    return value;
  };
}

export const TICK_LENGTH = 4;
export const TICK_WIDTH = 2;

export const createBaseGridConfig = () => ({
  display: true,
  drawTicks: true,
  tickLength: TICK_LENGTH,
  tickWidth: TICK_WIDTH,
  tickColor: (context: { index: number }) =>
    context.index === 0 ? 'transparent' : theme.colors.charts.bg.neutrals[40],
});

interface AxisLabelConfig {
  position: 'left' | 'right';
  formatLabel: (value: number) => string;
}

function drawAxisFirstTick(
  ctx: CanvasRenderingContext2D,
  axis: {
    ticks: Array<{ value: number }>;
    getPixelForValue: (v: number) => number;
    right: number;
    left: number;
  },
  config: AxisLabelConfig,
) {
  const firstTick = axis.ticks[0]?.value;
  if (firstTick === undefined) return;

  const y = axis.getPixelForValue(firstTick);
  const x = config.position === 'left' ? axis.right - 10 : axis.left + 10;

  if (typeof y !== 'number' || typeof x !== 'number') return;

  ctx.textAlign = config.position === 'left' ? 'right' : 'left';
  ctx.fillText(config.formatLabel(firstTick), x, y - 4);
}

function formatWithSuffix(value: number): string {
  return value === 0 ? '0' : String(formatNumberWithSuffix(value, 0, 1).value);
}

function formatInteger(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Math.round(value));
}

export function createFirstTickLabelPlugin(): Plugin<'line'> {
  return {
    id: 'firstTickLabelDualAxis',
    afterDraw(chart) {
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = '12px "Work Sans", sans-serif';
      ctx.fillStyle = '#5C5C5C';
      ctx.textBaseline = 'bottom';

      const yAxis = chart.scales.y;
      if (yAxis?.ticks?.length) {
        drawAxisFirstTick(ctx, yAxis, {
          position: 'left',
          formatLabel: formatWithSuffix,
        });
      }

      const y1Axis = chart.scales.y1;
      if (y1Axis?.ticks?.length) {
        drawAxisFirstTick(ctx, y1Axis, {
          position: 'right',
          formatLabel: formatInteger,
        });
      }

      ctx.restore();
    },
  };
}

export function createSingleAxisFirstTickPlugin(): Plugin<'line'> {
  return {
    id: 'firstTickLabelSingleAxis',
    afterDraw(chart) {
      const yAxis = chart.scales.y;
      if (!yAxis?.ticks?.length) return;

      const firstTick = yAxis.ticks[0]?.value;
      if (firstTick === undefined) return;

      const y = yAxis.getPixelForValue(firstTick);
      const x = yAxis.right - 10;

      if (typeof y !== 'number' || typeof x !== 'number') return;

      const ctx = chart.ctx;
      ctx.save();
      ctx.font = '12px "Work Sans", sans-serif';
      ctx.fillStyle = '#5C5C5C';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(formatWithSuffix(firstTick), x, y - 4);
      ctx.restore();
    },
  };
}
