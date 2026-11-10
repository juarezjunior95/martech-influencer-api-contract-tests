import { PluginsOptions } from 'components/Chart/Bar/SimpleBarChart';

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

export const DEFAULT_SUGGESTED_MAX = 50;
export const NOT_APPLICABLE = 'N/A';
export const EMPTY_DASH = '-';

// Threshold to treat float results as effectively zero (IEEE-754 rounding).
export const NEAR_ZERO_EPSILON = 1e-10;

// Null metric shape reused whenever a tier/audience has no data.
export const NULL_AUDIENCE_METRICS = {
  value: null,
  yoy_change: null,
  yoy_direction: null,
  performance_index: null,
  comparison_index: null,
} as const;

export const NULL_TIER_AUDIENCES = {
  core: NULL_AUDIENCE_METRICS,
  halo: null,
  total: NULL_AUDIENCE_METRICS,
} as const;

export const TIER_CHART_LABELS = {
  core: 'Core',
  halo: 'Halo',
  total: 'Total',
} as const;

export const CARD_BACKGROUND_COLOR = '#F9F9F9';

export const PERFORMANCE_INDEX_LOWER_BOUND = 95;
export const PERFORMANCE_INDEX_UPPER_BOUND = 105;

export const TIER_CARD_YOY_GAP = 22;
export const TIER_CARD_INDEXES_GAP = 24;

export const TIER_CARD_TOOLTIP_ICON_SIZE = 22;
