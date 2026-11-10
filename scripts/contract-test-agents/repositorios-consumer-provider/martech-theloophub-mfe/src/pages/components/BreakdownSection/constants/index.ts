import { PluginsOptions } from 'components/Chart/Bar/SimpleBarChart';
import { theme } from 'theme';

import { BreakdownVariant, BreakdownVariantConfig, TierLevel } from '../types';

export const BREAKDOWN_CONFIG: Record<
  BreakdownVariant,
  BreakdownVariantConfig
> = {
  participation: {
    titleKey: 'Participation Breakdown',
    metricLabel: 'P4W %',
  },
  occasions: {
    titleKey: 'Occasions Breakdown',
    metricLabel: 'P7W #',
  },
  brandPower: {
    titleKey: 'Brand Power Breakdown',
    metricLabel: '%',
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

export const DEFAULT_SUGGESTED_MAX = 50;
export const DATA_NOT_AVAILABLE = 'DATA NOT AVAILABLE';
export const NOT_APPLICABLE = 'N/A';

export const CHART_CONFIG = {
  barThicknessHaloOn: 32,
  barThicknessHaloOff: 48,
  suggestedMaxPadding: 10,
  chartHeight: '200px',
  yStepSize: 10,
  padding: {
    top: 25,
    left: 0,
    bottom: 0,
  },
};

export const CHART_CONFIG_PLUGINS: PluginsOptions = {
  extendYAxis: { display: true },
  extendXAxis: { display: true },
};

export const COMPARISON_BORDER_CONFIG = { marginLeft: 0, marginRight: 0 };
export const COMPARISON_ROW_CONFIG = {
  height: 50,
  alignItems: 'center' as const,
};
export const COMPARISON_INNER_BORDER_CONFIG = {
  marginLeft: 7,
  marginRight: -8,
};
