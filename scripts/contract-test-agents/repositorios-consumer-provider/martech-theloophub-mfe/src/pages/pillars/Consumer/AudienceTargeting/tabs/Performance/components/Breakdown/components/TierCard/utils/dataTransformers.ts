import { IntlShape } from 'react-intl';

import {
  ComparisonLineData,
  ComparisonValue,
} from 'components/ComparisonLine/ComparisonLine';
import { theme } from 'theme';
import { specificProperty } from 'theme/colors/specificProperty';

import {
  CHART_CONFIG,
  DEFAULT_SUGGESTED_MAX,
  EMPTY_DASH,
  NEAR_ZERO_EPSILON,
  NOT_APPLICABLE,
  PERFORMANCE_INDEX_LOWER_BOUND,
  PERFORMANCE_INDEX_UPPER_BOUND,
  TIER_BAR_COLORS,
  TIER_CHART_LABELS,
} from '../../../constants';
import {
  AudienceMetrics,
  TierAudiences,
  TierCardProps,
  TierChartResult,
  YoYDirection,
} from '../../../types';

export const formatYoY = (metrics: AudienceMetrics | null): string => {
  const yoyChange = metrics?.yoy_change ?? NOT_APPLICABLE;
  if (yoyChange === NOT_APPLICABLE) return NOT_APPLICABLE;
  return `${yoyChange}pp`;
};

export const getYoYTrend = (
  direction: YoYDirection | null,
): 'positive' | 'negative' | undefined => {
  if (direction === 'up') return 'positive';
  if (direction === 'down') return 'negative';
  return undefined;
};

export const getYoYColor = (direction: YoYDirection | null): string => {
  if (direction === 'up') return specificProperty.successText;
  if (direction === 'down') return specificProperty.errorText;
  return theme.colors.txt.secondary;
};

export const getIndexBadgeColor = (
  value: AudienceMetrics['comparison_index'] | undefined,
): 'positive' | 'neutral' | 'negative' => {
  const parsed = parseIndexMetric(value);
  if (parsed === null) return 'neutral';
  if (parsed < PERFORMANCE_INDEX_LOWER_BOUND) return 'negative';
  if (parsed > PERFORMANCE_INDEX_UPPER_BOUND) return 'positive';
  return 'neutral';
};

export const formatIndex = (
  value: AudienceMetrics['comparison_index'] | undefined,
): string => {
  const parsed = parseIndexMetric(value);
  if (parsed === null) return EMPTY_DASH;
  return parsed.toFixed(1);
};

export const buildYoYValues = (
  audiences: TierAudiences,
  showHalo: boolean,
): ComparisonValue[] => [
  {
    value: formatYoY(audiences.core),
    color: getYoYColor(audiences.core?.yoy_direction ?? null),
    trend: getYoYTrend(audiences.core?.yoy_direction ?? null),
  },
  ...(showHalo
    ? [
        audiences.halo
          ? {
              value: formatYoY(audiences.halo),
              color: getYoYColor(audiences.halo.yoy_direction),
              trend: getYoYTrend(audiences.halo.yoy_direction),
            }
          : { value: NOT_APPLICABLE, color: getYoYColor(null) },
      ]
    : []),
  {
    value: formatYoY(audiences.total),
    color: getYoYColor(audiences.total?.yoy_direction ?? null),
    trend: getYoYTrend(audiences.total?.yoy_direction ?? null),
  },
];

export const buildIndexValues = (
  audiences: TierAudiences,
  field: 'performance_index' | 'comparison_index',
  showHalo: boolean,
): ComparisonValue[] => [
  {
    value: formatIndex(audiences.core?.[field] ?? null),
    variant: 'badge',
    badgeColor: getIndexBadgeColor(audiences.core?.[field] ?? null),
  },
  ...(showHalo
    ? [
        audiences.halo
          ? {
              value: formatIndex(audiences.halo[field]),
              variant: 'badge' as const,
              badgeColor: getIndexBadgeColor(audiences.halo[field]),
            }
          : {
              value: EMPTY_DASH,
              variant: 'badge' as const,
              badgeColor: 'neutral' as const,
            },
      ]
    : []),
  {
    value: formatIndex(audiences.total?.[field] ?? null),
    variant: 'badge',
    badgeColor: getIndexBadgeColor(audiences.total?.[field] ?? null),
  },
];

export const buildYoYData = (
  audiences: TierAudiences,
  showHalo: boolean,
): ComparisonLineData[] => [
  {
    title: 'vs LY',
    data: buildYoYValues(audiences, showHalo),
  },
];

export const buildIndexData = (
  audiences: TierAudiences,
  showHalo: boolean,
  formatMessage: IntlShape['formatMessage'],
): ComparisonLineData[] => [
  {
    title: formatMessage({
      id: `Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.title`,
    }),
    tooltip: {
      title: formatMessage({
        id: `Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.title`,
      }),
      text: formatMessage({
        id: `Consumer.AudienceTargeting.BreakdownIndexes.comparisonIndex.tooltip.text`,
      }),
    },
    data: buildIndexValues(audiences, 'comparison_index', showHalo),
  },
];

const pushMetric = (
  acc: {
    values: (number | null)[];
    labels: string[];
    bgColors: string[];
    naIndexes: number[];
  },
  value: number | null,
  label: string,
  color: string,
) => {
  if (value === null) acc.naIndexes.push(acc.values.length);
  acc.values.push(value);
  acc.labels.push(label);
  acc.bgColors.push(color);
};

const parseChartMetric = (
  value: AudienceMetrics['value'] | undefined,
): number | null => {
  if (value == null || value === NOT_APPLICABLE) return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseIndexMetric = (
  value: AudienceMetrics['comparison_index'] | undefined,
): number | null => {
  if (value == null || value === NOT_APPLICABLE || value === EMPTY_DASH) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const buildChartData = (
  tier: TierCardProps['tier'],
  showHalo: boolean,
): TierChartResult => {
  const { audiences, tier_level } = tier;
  const color = TIER_BAR_COLORS[tier_level] ?? TIER_BAR_COLORS.brand;

  const acc = {
    values: [] as (number | null)[],
    labels: [] as string[],
    bgColors: [] as string[],
    naIndexes: [] as number[],
  };

  pushMetric(
    acc,
    parseChartMetric(audiences?.core?.value),
    TIER_CHART_LABELS.core,
    color,
  );
  if (showHalo) {
    pushMetric(
      acc,
      parseChartMetric(audiences?.halo?.value),
      TIER_CHART_LABELS.halo,
      color,
    );
  }
  pushMetric(
    acc,
    parseChartMetric(audiences?.total?.value),
    TIER_CHART_LABELS.total,
    color,
  );

  return {
    chartData: {
      values: acc.values,
      labels: acc.labels,
      backgroundColor: acc.bgColors,
    },
    naIndexes: acc.naIndexes,
    missingDataBarColor: color,
  };
};

export const getSuggestedMax = (values: (number | null)[]): number => {
  const numeric = values.filter((v): v is number => v !== null);
  if (numeric.length === 0) return DEFAULT_SUGGESTED_MAX;
  const max = Math.max(...numeric);
  if (Math.abs(max) < NEAR_ZERO_EPSILON) return DEFAULT_SUGGESTED_MAX;
  return Math.ceil(max / 10) * 10 + CHART_CONFIG.suggestedMaxPadding;
};
