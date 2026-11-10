import { BigNumberData } from 'components/BigNumber/types';

import { KPI_SUMMARY_CARDS } from '../../../constants';
import { BigNumberItem, Variation } from '../types';

export const getVariationColor = (variation: Variation): string => {
  const colors: Record<Variation, string> = {
    up: KPI_SUMMARY_CARDS.bigNumber.variation.up,
    down: KPI_SUMMARY_CARDS.bigNumber.variation.down,
    neutral: '#3D3D3D',
  };
  return colors[variation];
};

export const getVariationTrend = (
  variation: Variation,
): 'positive' | 'negative' => {
  return variation === 'up' ? 'positive' : 'negative';
};

export const transformBigNumberData = (
  items: BigNumberItem[],
): BigNumberData[] => {
  return items.map((item) => ({
    bigNumber: {
      value: item.value,
      measure: item.measure,
      color: getVariationColor(item.variation),
      trend: getVariationTrend(item.variation),
    },
    comparison: {
      label: KPI_SUMMARY_CARDS.comparison[item.id].name,
      value: KPI_SUMMARY_CARDS.comparison.value,
    },
  }));
};

export const getKpiConfig = (kpiId: string) => {
  return KPI_SUMMARY_CARDS.kpis[kpiId as keyof typeof KPI_SUMMARY_CARDS.kpis];
};
