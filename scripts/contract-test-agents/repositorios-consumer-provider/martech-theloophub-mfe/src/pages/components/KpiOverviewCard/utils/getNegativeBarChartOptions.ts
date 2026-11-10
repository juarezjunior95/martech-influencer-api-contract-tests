import type { ChartOptions } from 'chart.js';

import type { KpiOverviewCardData } from '../types';

type BarChartData = KpiOverviewCardData['barChart'];

const CHART_AREA_HEIGHT_PX = 190;
const DATALABEL_HEIGHT_PX = 28;
const MAX_BUFFERED_SPACING = 0.15;

export function getNegativeBarChartOptions(
  barChart: BarChartData,
): ChartOptions | undefined {
  if (!barChart?.datasets?.length) return undefined;

  const numericValues = barChart.datasets.flatMap((dataset) =>
    (dataset.data ?? []).filter((v): v is number => typeof v === 'number'),
  );

  const actualMin = Math.min(0, ...numericValues);
  if (actualMin >= 0) return undefined;

  const actualMax = Math.max(0, ...numericValues);
  const maxBuffered = actualMax * (1 + MAX_BUFFERED_SPACING);

  const dynamicMin =
    (CHART_AREA_HEIGHT_PX * actualMin - DATALABEL_HEIGHT_PX * maxBuffered) /
    (CHART_AREA_HEIGHT_PX - DATALABEL_HEIGHT_PX);

  return { scales: { y: { min: dynamicMin } } };
}
