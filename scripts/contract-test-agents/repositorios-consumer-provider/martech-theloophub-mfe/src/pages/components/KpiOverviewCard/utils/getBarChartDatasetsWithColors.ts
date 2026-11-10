import type { ChartDataset } from 'chart.js';

import type { KpiOverviewCardData } from '../types';

type BarChartData = KpiOverviewCardData['barChart'];

export function getBarChartDatasetsWithColors(
  barChart: BarChartData,
  chartColors: {
    striped: string;
    current: string;
    default: string;
  },
): ChartDataset<'bar'>[] {
  if (!barChart) return [];
  const labels = barChart.labels ?? [];
  const stripedIndexes = barChart.stripedIndexes ?? [];
  const highlightLabels = barChart.highlightLabels ?? [];
  const firstDataset = barChart.datasets?.[0];

  const backgroundColor = labels.map((label, index) => {
    if (stripedIndexes.includes(index)) return chartColors.striped;
    if (highlightLabels.includes(label)) return chartColors.current;
    return chartColors.default;
  });

  return firstDataset
    ? [{ ...firstDataset, backgroundColor }]
    : (barChart.datasets ?? []);
}
