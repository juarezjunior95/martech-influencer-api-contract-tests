import {
  LEGEND_ITEM_AVG_WIDTH,
  LEGEND_LINE_HEIGHT,
  LEGEND_MAX_WIDTH,
} from '../constants';

export function estimateLegendLines(legendCount: number): number {
  if (legendCount <= 0) return 0;
  const itemsPerLine = Math.floor(LEGEND_MAX_WIDTH / LEGEND_ITEM_AVG_WIDTH);
  return Math.ceil(legendCount / itemsPerLine);
}

export function calculateLegendPaddingTop(
  basePadding: number,
  legendCount: number,
): number {
  const lines = estimateLegendLines(legendCount);
  if (lines <= 1) return basePadding;
  return basePadding + (lines - 1) * LEGEND_LINE_HEIGHT;
}
