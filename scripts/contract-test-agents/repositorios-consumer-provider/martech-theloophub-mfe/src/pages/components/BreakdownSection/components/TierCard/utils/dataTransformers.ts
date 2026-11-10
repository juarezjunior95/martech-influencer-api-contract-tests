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
  NOT_APPLICABLE,
  TIER_BAR_COLORS,
} from '../../../constants';
import {
  AudienceMetrics,
  TierAudiences,
  TierCardProps,
  TierChartResult,
  YoYDirection,
} from '../../../types';

export const formatYoY = (metrics: AudienceMetrics | null): string => {
  if (metrics?.yoy_change == null) return NOT_APPLICABLE;
  return `${metrics.yoy_change}pp`;
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
  return theme.colors.txt.default;
};

export const getIndexBadgeColor = (
  value: number | null,
): 'positive' | 'neutral' | 'negative' => {
  if (value === null) return 'neutral';
  if (value < 95) return 'negative';
  if (value > 105) return 'positive';
  return 'neutral';
};

export const formatIndex = (value: number | null): string => {
  if (value === null) return NOT_APPLICABLE;
  return String(value);
};

export const buildYoYValues = (
  audiences: TierAudiences,
  showHalo: boolean,
): ComparisonValue[] => {
  const values: ComparisonValue[] = [];
  values.push({
    value: formatYoY(audiences.core),
    color: getYoYColor(audiences.core?.yoy_direction ?? null),
    trend: getYoYTrend(audiences.core?.yoy_direction ?? null),
  });
  if (showHalo) {
    if (audiences.halo) {
      values.push({
        value: formatYoY(audiences.halo),
        color: getYoYColor(audiences.halo.yoy_direction),
        trend: getYoYTrend(audiences.halo.yoy_direction),
      });
    } else {
      values.push({ value: NOT_APPLICABLE });
    }
  }
  values.push({
    value: formatYoY(audiences.total),
    color: getYoYColor(audiences.total?.yoy_direction ?? null),
    trend: getYoYTrend(audiences.total?.yoy_direction ?? null),
  });
  return values;
};

export const buildIndexValues = (
  audiences: TierAudiences,
  field: 'performance_index' | 'comparison_index',
  showHalo: boolean,
): ComparisonValue[] => {
  const values: ComparisonValue[] = [];
  values.push({
    value: formatIndex(audiences.core?.[field] ?? null),
    variant: 'badge',
    badgeColor: getIndexBadgeColor(audiences.core?.[field] ?? null),
  });
  if (showHalo) {
    if (audiences.halo) {
      values.push({
        value: formatIndex(audiences.halo[field]),
        variant: 'badge',
        badgeColor: getIndexBadgeColor(audiences.halo[field]),
      });
    } else {
      values.push({
        value: NOT_APPLICABLE,
        variant: 'badge',
        badgeColor: 'neutral',
      });
    }
  }
  values.push({
    value: formatIndex(audiences.total?.[field] ?? null),
    variant: 'badge',
    badgeColor: getIndexBadgeColor(audiences.total?.[field] ?? null),
  });
  return values;
};

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

export const buildChartData = (
  tier: TierCardProps['tier'],
  showHalo: boolean,
): TierChartResult => {
  const { audiences, tier_level } = tier;
  const colors = TIER_BAR_COLORS[tier_level] ?? TIER_BAR_COLORS.brand;
  if (!audiences) {
    return {
      chartData: { values: [], labels: [], backgroundColor: [] },
      naIndexes: [],
    };
  }
  const values: number[] = [];
  const labels: string[] = [];
  const bgColors: string[] = [];
  const naIndexes: number[] = [];
  if (audiences.core) {
    values.push(audiences.core.value ?? 0);
    labels.push('Core');
    bgColors.push(colors);
  }
  if (showHalo) {
    if (audiences.halo) {
      values.push(audiences.halo.value ?? 0);
    } else {
      naIndexes.push(values.length);
      values.push(0);
    }
    labels.push('Halo');
    bgColors.push(colors);
  }
  if (audiences.total) {
    values.push(audiences.total.value ?? 0);
    labels.push('Total');
    bgColors.push(colors);
  }
  return {
    chartData: { values, labels, backgroundColor: bgColors },
    naIndexes,
  };
};

export const getSuggestedMax = (values: number[]): number => {
  if (values.length === 0) return DEFAULT_SUGGESTED_MAX;
  const max = Math.max(...values);
  return Math.ceil(max / 10) * 10 + CHART_CONFIG.suggestedMaxPadding;
};
