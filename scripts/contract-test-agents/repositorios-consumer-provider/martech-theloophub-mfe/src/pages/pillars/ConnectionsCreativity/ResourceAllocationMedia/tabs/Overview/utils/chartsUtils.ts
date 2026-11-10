import { ResourceAllocationChart, ResourceAllocationData } from '../types';

const generateChartsBackgroundColors = (length: number, colors: string[]) => {
  if (length === 3) {
    return [colors[0], colors[1], colors[2]];
  } else if (length === 2) {
    return [colors[0], colors[2]];
  }
  return new Array(length).fill(colors[0]);
};
const applyPatternConfig = (content: ResourceAllocationChart) => {
  if (content.total_per_year_full) {
    if (content.total_per_year_full.labels.length === 3) {
      return {
        type: 'striped',
        flags: [1],
        params: {
          color: 'white',
          angle: 45,
          thickness: 3,
          spacing: 12,
        },
      };
    }
  }

  return null;
};

export const applyChartsConfigs = (content: ResourceAllocationChart) => {
  if (content?.total_per_year_full) {
    const colors = ['#F0D59E', '#EDCD20', '#D1A33C'];
    content.total_per_year_full.backgroundColor =
      generateChartsBackgroundColors(
        content.total_per_year_full.labels.length,
        colors,
      );
    content.total_per_year_full.datasets[0].pattern =
      applyPatternConfig(content);
  }
};

export const getChartLegends = (data: ResourceAllocationData) => {
  if (!data) return [];

  for (const item of Object.values(data)) {
    if (item?.total_per_year_full?.chart_legends) {
      return item.total_per_year_full.chart_legends;
    }
  }
  return [];
};
