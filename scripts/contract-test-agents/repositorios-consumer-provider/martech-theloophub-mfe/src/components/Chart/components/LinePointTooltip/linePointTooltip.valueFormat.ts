import { parseMetricNumberString } from './utils/format';

const formatCompact = (num: number) =>
  new Intl.NumberFormat('en', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(num);

export function formatCompactMetricValue(n: number): string {
  if (!Number.isFinite(n)) return '';
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  return `${sign}${formatCompact(abs).toLowerCase()}`;
}

export function formatLinePointTooltipItemValue(point: {
  raw?: unknown;
  formattedValue: string;
}): string {
  const { raw, formattedValue } = point;
  if (typeof raw === 'number' && !Number.isNaN(raw)) {
    return formatCompactMetricValue(raw);
  }
  const n = parseMetricNumberString(formattedValue);
  return n != null && Number.isFinite(n)
    ? formatCompactMetricValue(n)
    : formattedValue;
}
