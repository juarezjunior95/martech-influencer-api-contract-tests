import { DEFAULT_COLORS } from '../constants';
import { Colors, SpecialIndexes } from '../types';

export const calculateMinMaxValues = (values: number[]) => {
  let cumulativeValue = 0;
  let min = 0;
  let max = 0;

  values.forEach((value, index) => {
    cumulativeValue += value;
    if (cumulativeValue > max) max = cumulativeValue;
    if (cumulativeValue < min) min = cumulativeValue;
  });

  return { min, max };
};

export const calculateNormalizedRanges = (
  values: number[],
  initialValue = 0,
) => {
  const ranges: [number, number][] = [];
  let currentValue = initialValue;

  values.forEach((value, index) => {
    const nextValue = currentValue + value;
    ranges.push([currentValue, nextValue]);
    currentValue = nextValue;
  });

  return ranges;
};

export const createResolvedSpecialIndexes = (
  specialIndexes: SpecialIndexes | undefined,
  labelsLength: number,
): SpecialIndexes => ({
  first: specialIndexes?.first ?? 0,
  last: specialIndexes?.last ?? labelsLength - 1,
  retained: specialIndexes?.retained,
  variation: specialIndexes?.variation,
});

export const createColorsWithDefaults = (colors?: Colors): Colors => ({
  ...DEFAULT_COLORS,
  ...colors,
});
