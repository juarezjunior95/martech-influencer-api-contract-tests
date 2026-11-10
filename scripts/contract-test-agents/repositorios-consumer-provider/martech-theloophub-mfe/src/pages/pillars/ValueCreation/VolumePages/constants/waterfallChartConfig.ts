export const WATERFALL_CHART_COLORS: Record<
  'first' | 'last' | 'retained' | 'negative' | 'positive' | 'neutral',
  string
> = {
  first: '#D8D7D4',
  last: '#67665F',
  retained: '#D1A33C',
  negative: '#D62222',
  positive: '#3CA91E',
  neutral: '#67665F',
};

export const WATERFALL_TREND_COLORS: Record<
  'positive' | 'negative' | 'neutral',
  string
> = {
  positive: WATERFALL_CHART_COLORS.positive,
  negative: WATERFALL_CHART_COLORS.negative,
  neutral: WATERFALL_CHART_COLORS.neutral,
};
