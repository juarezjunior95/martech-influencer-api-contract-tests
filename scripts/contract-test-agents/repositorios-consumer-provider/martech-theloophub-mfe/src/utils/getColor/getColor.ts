import { theme } from 'theme';

export const getVariationColor = (trend: string) => {
  if (trend === 'up' || trend === 'positive') return theme.colors.green.high;
  if (trend === 'down' || trend === 'negative') return theme.colors.red.high;
  if (trend === 'neutral') return theme.colors.txt.secondary;

  return trend;
};
