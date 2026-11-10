import type { ChartOptions } from 'chart.js';
import { merge } from 'lodash';

import type {
  KpiOverviewBarChartLayoutPadding,
  KpiOverviewCardData,
} from '../types';
import { getNegativeBarChartOptions } from './getNegativeBarChartOptions';

type BarChartData = KpiOverviewCardData['barChart'];

const layoutPaddingToChartOptions = (
  layoutPadding: KpiOverviewBarChartLayoutPadding | undefined,
): Pick<ChartOptions, 'layout'> | undefined => {
  if (!layoutPadding) return undefined;

  const padding = Object.fromEntries(
    Object.entries(layoutPadding).filter(
      (entry): entry is [string, number] => typeof entry[1] === 'number',
    ),
  );

  return Object.keys(padding).length > 0 ? { layout: { padding } } : undefined;
};

/**
 * Merges optional bar `layoutPadding` (from card data) with negative-value
 * Y-axis scaling. Pass-through for callers of `KpiOverviewCard` `Bar` options.
 */
export function getKpiOverviewBarChartOptions(
  barChart: BarChartData,
): ChartOptions | undefined {
  if (!barChart?.datasets?.length) return undefined;

  const negativeOpts = getNegativeBarChartOptions(barChart);
  const layoutOpts = layoutPaddingToChartOptions(barChart.layoutPadding);

  if (!negativeOpts && !layoutOpts) return undefined;

  return merge({}, layoutOpts ?? {}, negativeOpts ?? {}) as ChartOptions;
}
