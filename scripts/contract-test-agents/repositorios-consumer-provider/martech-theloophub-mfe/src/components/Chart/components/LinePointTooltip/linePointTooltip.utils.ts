import { ChartDataset } from 'chart.js';

export { LINE_POINT_TOOLTIP_HOST_ATTR } from './utils/tooltip';

export function getTooltipHostId(chartId: string | number): string {
  return `line-point-tooltip-${chartId}`;
}

export function resolveLineDatasetColor(dataset: ChartDataset<'line'>): string {
  const { borderColor } = dataset;
  if (typeof borderColor === 'string') {
    return borderColor;
  }
  if (Array.isArray(borderColor) && borderColor.length > 0) {
    const first = borderColor[0];
    return typeof first === 'string' ? first : '#FFFFFF';
  }
  return '#FFFFFF';
}

export function isLineDatasetDashed(dataset: ChartDataset<'line'>): boolean {
  const dash = dataset.borderDash;
  return Array.isArray(dash) && dash.some((n) => n > 0);
}

/**
 * Diagonal stripes inside the pill (matches dashed-line series in the design).
 */
export function buildDashedLineIndicatorBackground(lineColor: string): string {
  const stripeWidth = 5;
  const stripeGap = 1;
  const gap = 'rgb(255, 255, 255)';
  const end = stripeWidth + stripeGap;
  const angle = -30;

  return `repeating-linear-gradient(
    ${angle}deg,
    ${lineColor},
    ${lineColor} ${stripeWidth}px,
    ${gap} ${stripeWidth}px,
    ${gap} ${end}px
  )`;
}
