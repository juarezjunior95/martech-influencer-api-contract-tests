import { theme } from 'theme';

export const getBarColors = (source: string[]) =>
  source
    ? source.map((s) =>
        s.toLowerCase() === 'comp'
          ? theme.colors.charts.bg.comparison.secondary.low
          : theme.colors.charts.bg.comparison.primary.low,
      )
    : [theme.colors.charts.bg.comparison.primary.low];
