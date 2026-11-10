import { BigNumberComparison, BigNumberData } from 'components/BigNumber/types';

export const BIG_NUMBER_LABELS = ['innovationPhi', 'maturePhi'] as const;

export const BORDER_COLORS = ['#D3E3EE', '#EDDAB1'] as const;

export const PORTFOLIO_HEALTH_HEADER_COLOR = '#FFF4E6';

export const TREND_COLORS = {
  positive: '#007800',
  negative: '#B91C1C',
} as const;

export const getTrendColor = (
  trend?: 'positive' | 'negative',
): string | undefined => {
  if (!trend) return undefined;
  return TREND_COLORS[trend];
};

export const applyColorFromTrend = <
  T extends { color?: string; trend?: 'positive' | 'negative' },
>(
  obj?: T,
): T | undefined => {
  if (!obj) return undefined;
  return {
    ...obj,
    color: obj.color || getTrendColor(obj.trend),
  };
};

export const isInvalidValue = (value?: string): boolean => {
  return value === '-';
};

export const processComparisonNumber = (number?: {
  value?: string;
  trend?: 'positive' | 'negative';
  color?: string;
}) => {
  if (!number || isInvalidValue(number.value)) {
    return undefined;
  }
  return applyColorFromTrend(number);
};

export const processComparison = (
  comparison?: BigNumberComparison,
): BigNumberComparison | undefined => {
  if (!comparison || isInvalidValue(comparison?.number?.value)) {
    return undefined;
  }
  return {
    ...comparison,
    number: processComparisonNumber(comparison.number),
  };
};

export const enrichDataItemWithLabelAndColor = (
  dataItem: BigNumberData,
  label: string,
): BigNumberData => ({
  ...dataItem,
  bigNumber: applyColorFromTrend(dataItem.bigNumber),
  comparison: processComparison(dataItem.comparison),
  secondaryInfo: {
    ...dataItem.secondaryInfo,
    label,
  },
});
