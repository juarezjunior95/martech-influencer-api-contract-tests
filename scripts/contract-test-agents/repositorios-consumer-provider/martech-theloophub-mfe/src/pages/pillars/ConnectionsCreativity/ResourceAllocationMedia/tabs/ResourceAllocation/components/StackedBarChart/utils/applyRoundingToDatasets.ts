import { ChartData } from 'chart.js';
import { roundNumbersTo } from 'utils/roundTo';

import { MIN_SEGMENT_PERCENT } from '../constants';

export const applyRoundingToDatasets = (
  data: ChartData<'bar'>,
  roundTo: number,
) => {
  data.datasets[0].data.forEach((_, index) => {
    const rawValues = data.datasets.map((dataset) => dataset.data[index]);

    // Skip empty-string rows (N/A state): normalising them produces NaN and corrupts yScale geometry.
    const allEmpty = rawValues.every(
      (v) => (v as unknown) === '' || v === null || v === undefined,
    );
    if (allEmpty) return;

    const roundedValues = roundNumbersTo(rawValues as number[]);

    const floored = roundedValues.map((v: number) => Math.max(v, 0));

    const allBelowMin = floored.every((v: number) => v < MIN_SEGMENT_PERCENT);

    if (allBelowMin) {
      const equalShare = roundTo / floored.length;
      floored.forEach((_: number, datasetIndex: number) => {
        data.datasets[datasetIndex].data[index] = equalShare;
      });
      return;
    }

    const clampedCount = floored.filter(
      (v: number) => v < MIN_SEGMENT_PERCENT,
    ).length;
    const minBudget = clampedCount * MIN_SEGMENT_PERCENT;
    const largeValues = floored.filter((v: number) => v >= MIN_SEGMENT_PERCENT);
    const largeTotal = largeValues.reduce(
      (sum: number, v: number) => sum + v,
      0,
    );
    const availableForLarge = roundTo - minBudget;
    const scale = availableForLarge / largeTotal;

    floored.forEach((value: number, datasetIndex: number) => {
      const normalized =
        value < MIN_SEGMENT_PERCENT ? MIN_SEGMENT_PERCENT : value * scale;
      data.datasets[datasetIndex].data[index] = normalized;
    });
  });
};
