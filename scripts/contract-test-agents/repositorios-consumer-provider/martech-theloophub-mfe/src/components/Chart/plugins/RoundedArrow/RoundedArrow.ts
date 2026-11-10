/**
 * This plugin overlaps with ConnectorPlugin but is not a drop-in replacement.
 * Key differences that prevent direct migration today:
 *  - Derives tag colors automatically from `direction` ('up' | 'down').
 *  - Selects the last dataset when the chart is stacked.
 *  - Handles negative / waterfall bars via Math.min(y, base).
 *  - Uses a larger arc radius (25) than ConnectorPlugin (10).
 * Consolidation can be revisited once ConnectorPlugin covers these cases.
 */

import { CartesianScaleOptions, ChartArea, ChartOptions } from 'chart.js';
import { theme } from 'theme';
import { formatNumber } from 'utils/format';

import { drawRoundedRect } from '../ConnectorPlugin/utils/drawRoundedRect';

type ChartContext = CanvasRenderingContext2D;

type BarPosition = {
  readonly x: number;
  readonly y: number;
  readonly base: number;
};

interface DrawArrowOptions {
  ctx: ChartContext;
  firstBar: BarPosition;
  lastBar: BarPosition;
  midY: number;
  arcRadius: number;
  offset: number;
}

const drawArrow = ({
  ctx,
  firstBar,
  lastBar,
  midY,
  arcRadius,
  offset,
}: DrawArrowOptions) => {
  ctx.setLineDash([6, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = theme.colors.charts.border.neutrals[30];

  // Visual top of bar: min(y, base) works for positive, negative, and waterfall bars
  const firstBarTop = Math.min(firstBar.y, firstBar.base);
  const lastBarTop = Math.min(lastBar.y, lastBar.base);

  ctx.beginPath();
  const moveFromY = firstBarTop - 30;
  ctx.moveTo(firstBar.x, moveFromY);
  if (firstBarTop - midY > 50) {
    ctx.lineTo(firstBar.x, midY);
  }

  ctx.arc(
    firstBar.x + arcRadius,
    midY - offset,
    arcRadius,
    Math.PI,
    1.5 * Math.PI,
  );
  ctx.lineTo(lastBar.x - arcRadius, midY - offset - arcRadius);
  ctx.arc(lastBar.x - arcRadius, midY - offset, arcRadius, 1.5 * Math.PI, 0);

  const centerY = midY - offset;
  const radius = arcRadius;
  const angleEnd = 0;

  const finalY = centerY + Math.sin(angleEnd) * radius;

  const lineToY = lastBarTop - 50;
  if (finalY < lastBarTop - 50) {
    ctx.lineTo(lastBar.x, lineToY);
  }
  ctx.stroke();
  const base = lastBarTop - 40;
  const yBase = base < finalY ? finalY + 10 : base;
  ctx.beginPath();
  ctx.moveTo(lastBar.x, yBase);
  ctx.lineTo(lastBar.x - 6, yBase - 10);
  ctx.lineTo(lastBar.x + 6, yBase - 10);
  ctx.closePath();
  ctx.fillStyle = theme.colors.charts.border.neutrals[30];
  ctx.fill();
};

export function getTagColors(comparison_direction: 'up' | 'down') {
  if (comparison_direction === 'up') {
    return {
      background: theme.colors.specificProperty.successBackground,
      color: theme.colors.specificProperty.successText,
    };
  }

  return {
    background: theme.colors.specificProperty.errorBackground,
    color: theme.colors.specificProperty.errorText,
  };
}

export const RoundedArrow = {
  id: 'roundedArrow',
  afterDatasetsDraw(chart) {
    try {
      const {
        ctx,
        chartArea,
        config: { options },
      }: {
        ctx: ChartContext;
        chartArea: ChartArea;
        config: { options: ChartOptions };
      } = chart;

      const isStacked =
        (options?.scales?.x as Partial<CartesianScaleOptions> | undefined)
          ?.stacked ||
        (options?.scales?.y as Partial<CartesianScaleOptions> | undefined)
          ?.stacked;
      const selectedDataset = isStacked
        ? chart.getDatasetMeta(chart.data.datasets.length - 1)
        : chart.getDatasetMeta(0);

      const data = selectedDataset.data;
      if (!data.length) return;

      const { top } = chartArea;
      const roundedArrowPluginData = options?.plugins?.roundedArrow;

      if (!roundedArrowPluginData) return;
      if (typeof roundedArrowPluginData.comparison !== 'number') return;
      const firstBar = data[
        roundedArrowPluginData.startBarIndex || 0
      ] as unknown as BarPosition;
      const lastBar = data[data.length - 1] as unknown as BarPosition;
      const midX = (lastBar.x + firstBar.x) / 2;
      const midY = top;
      const offset = 30;
      const arcRadius = 25;

      ctx.save();
      drawArrow({
        ctx,
        firstBar,
        lastBar,
        midY,
        arcRadius,
        offset,
      });

      const label =
        formatNumber(+roundedArrowPluginData.comparison) +
        roundedArrowPluginData.unit_of_measure;

      const hasPrefix = Boolean(roundedArrowPluginData.prefix);
      const boxWidth = hasPrefix ? 100 : 69;
      const boxHeight = 24;
      const colors = getTagColors(roundedArrowPluginData.direction);

      drawRoundedRect({
        ctx,
        x: midX - boxWidth / 2,
        y: midY - 65,
        width: boxWidth,
        height: boxHeight,
        radius: 4,
        prefix: roundedArrowPluginData.prefix,
        label,
        textColor: colors.color,
        backgroundColor: colors.background,
      });

      ctx.restore();
    } catch (error) {
      console.error('Error in roundedArrowPlugin:', error, {
        chart,
        roundedArrowPluginData: chart.config.options?.plugins?.roundedArrow,
      });
    }
  },
};
