import { theme } from 'theme';

import { BreakdownVariant, BreakdownVariantConfig, TierLevel } from '../types';

export const BREAKDOWN_CONFIG: Record<
  BreakdownVariant,
  BreakdownVariantConfig
> = {
  p4w: {
    titleKey: 'Participation Breakdown',
    metricLabel: 'P4W %',
    i18nKey: 'participation',
  },
  occasions: {
    titleKey: 'Occasions Breakdown',
    metricLabel: 'P7D #',
    i18nKey: 'occasions',
  },
  power: {
    titleKey: 'Brand Power Breakdown',
    metricLabel: '%',
    i18nKey: 'brandPower',
  },
};

export const TIER_ORDER: TierLevel[] = [
  'beer',
  'core_co',
  'brand',
  'competitor',
];

export const TIER_BAR_COLORS: Record<TierLevel, string> = {
  beer: theme.colors.charts.bg.categories.primary.yellow,
  core_co: theme.colors.charts.bg.categories.secondary.blue,
  brand: theme.colors.charts.bg.categories.secondary.green,
  competitor: theme.colors.charts.bg.categories.secondary.purple,
};
