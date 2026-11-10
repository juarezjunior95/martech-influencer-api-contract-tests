import { getVariationColor } from 'utils/getColor';

import {
  ResourceAllocationChart,
  VariationData,
  VariationGroup,
} from '../types';

export const applyRankingConfigs = (content: ResourceAllocationChart) => {
  if (content.total_per_year_full) {
    const colors = {
      default: '#F0D59E',
      others: '#BADBF5',
    };
    const datasets = content.total_per_year_full.datasets;
    if (!datasets || datasets.length === 0) {
      content.total_per_year_full.backgroundColor = [colors.default];
      return;
    }

    content.total_per_year_full.backgroundColor =
      content.total_per_year_full.labels.map((_, index) => {
        const legend = datasets[0]?.legend?.[index];
        if (legend?.includes('Others')) {
          return colors.others;
        }
        return colors.default;
      });
  }
};

export const getRankingLegendColor = (legend: string): string => {
  if (legend.includes('AC YTD')) return '#F0D59E';
  if (legend.includes('BU YTD')) return '#EBC04E';
  if (legend.includes('AC/LE YTD')) return '#D1A33C';
  if (legend.includes('Others')) return '#BADBF5';
  return '#F0D59E';
};

export const variationsGroupToVariationValueData = (
  variationsGroup: VariationGroup[],
) => {
  return variationsGroup.map((group) => ({
    value: group.variation,
    unit_of_measure: group.unitMeasure ?? '',
    color: group.direction ? getVariationColor(group.direction) : '',
  }));
};

export const processVariationCaptionData = (value: VariationData[]) => {
  return (
    value?.map(({ variationsGroup }) => {
      if (Array.isArray(variationsGroup)) {
        return variationsGroupToVariationValueData(variationsGroup);
      }
      return [];
    }) || []
  );
};
