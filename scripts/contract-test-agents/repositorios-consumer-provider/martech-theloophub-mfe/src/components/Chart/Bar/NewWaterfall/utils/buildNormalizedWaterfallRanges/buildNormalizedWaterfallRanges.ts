import { VALUE_EPS } from 'components/Chart/utils';

import { SPACING_PERCENTAGE } from '../../constants';
import { SpecialIndexes } from '../../types';

function appendFullTotalBar(ranges: [number, number][], value: number): void {
  ranges.push(value >= 0 ? [0, value] : [value, 0]);
}

function appendTrimmedTotalBar(
  ranges: [number, number][],
  value: number,
  variationSpan: number,
): void {
  const cut = SPACING_PERCENTAGE;
  if (value === 0) {
    ranges.push([0, 0]);
    return;
  }

  if (!Number.isFinite(value) || cut <= 0 || cut >= 1) {
    appendFullTotalBar(ranges, value);
    return;
  }

  const spanFromSpacing = Math.abs(value) * (1 - cut);
  const length =
    variationSpan > 0
      ? Math.min(spanFromSpacing, variationSpan)
      : spanFromSpacing;

  if (value > 0) {
    ranges.push([value - length, value]);
  } else {
    ranges.push([value, value + length]);
  }
}

type RangeLoopParams = {
  numericValues: number[];
  waterfallValues: number[];
  indexes: SpecialIndexes;
  variationSpan: number;
};

function appendNormalizedRangesForWaterfall(
  params: RangeLoopParams,
): [number, number][] {
  const { numericValues, waterfallValues, indexes, variationSpan } = params;
  const { first, last, retained } = indexes;
  const normalizedRanges: [number, number][] = [];
  let currentValue = 0;

  for (let index = 0; index < numericValues.length; index += 1) {
    if (index < first) {
      normalizedRanges.push([0, 0]);
      continue;
    }

    if (index === first && index === last) {
      appendTrimmedTotalBar(
        normalizedRanges,
        numericValues[first],
        variationSpan,
      );
      continue;
    }

    if (index === first) {
      const startVal = numericValues[first];
      appendTrimmedTotalBar(normalizedRanges, startVal, variationSpan);
      currentValue = startVal;
      continue;
    }

    if (index === last) {
      appendTrimmedTotalBar(
        normalizedRanges,
        numericValues[last],
        variationSpan,
      );
      continue;
    }

    if (retained !== undefined && index === retained) {
      const retainedVal = numericValues[retained];
      appendFullTotalBar(normalizedRanges, retainedVal);
      currentValue = retainedVal;
      continue;
    }

    const nextValue = currentValue + waterfallValues[index];
    normalizedRanges.push([currentValue, nextValue]);
    currentValue = nextValue;
  }

  return normalizedRanges;
}

/**
 * Builds floating-bar [start, end] pairs: first/last totals are trimmed from the zero side
 * using {@link SPACING_PERCENTAGE} and capped so displayed length ≤ middle variation span.
 * When first and last totals have opposite signs, both use full ranges from zero so they
 * align on the axis (no trim on that edge).
 * When both totals are negative, the shared edge is brought to 0 (bars touch the axis).
 * When one total is exactly zero and the other is not, the non-zero total uses a full bar
 * from 0 so it aligns with the zero-height first/last column.
 *
 * Derives stepping deltas internally via {@link buildWaterfallValues}; returns them for
 * bar coloring (positive/negative) in the chart layer.
 */
export const buildNormalizedWaterfallRanges = (
  numericValues: number[],
  indexes: SpecialIndexes,
): {
  normalizedRanges: [number, number][];
  min: number;
  max: number;
  waterfallValues: number[];
} => {
  const { first, last, retained } = indexes;

  if (numericValues.length === 0) {
    return { normalizedRanges: [], min: 0, max: 0, waterfallValues: [] };
  }

  const waterfallValues = buildWaterfallValues(numericValues, indexes);

  const variationSpan = getMiddleVariationSpan(
    numericValues,
    waterfallValues,
    indexes,
  );

  const normalizedRanges = appendNormalizedRangesForWaterfall({
    numericValues,
    waterfallValues,
    indexes,
    variationSpan,
  });

  const firstTotal = numericValues[first];
  const lastTotal = numericValues[last];

  alignFirstLastTotalNormalizedRanges(
    normalizedRanges,
    first,
    last,
    firstTotal,
    lastTotal,
  );

  if (retained !== undefined) {
    applyRetainedBarFirstAnchor(
      normalizedRanges,
      first,
      retained,
      numericValues[retained],
    );
  }

  fillLeadingPlaceholderBarRanges(normalizedRanges, first);

  let min = Infinity;
  let max = -Infinity;

  normalizedRanges.forEach((pair) => {
    const [a, b] = pair;
    min = Math.min(min, a, b);
    max = Math.max(max, a, b);
  });

  return { normalizedRanges, min, max, waterfallValues };
};

/**
 * Per-index deltas used to walk cumulative balances: first / last / retained are 0 so
 * totals use the original numeric series; {@link SpecialIndexes.variation} is negated.
 */
export function buildWaterfallValues(
  numericValues: number[],
  indexes: SpecialIndexes,
): number[] {
  const { first, last, retained, variation } = indexes;
  const values = [...numericValues];
  values[first] = 0;
  values[last] = 0;
  if (retained !== undefined) {
    values[retained] = 0;
  }
  if (variation !== undefined) {
    values[variation] *= -1;
  }
  return values;
}

/**
 * Spread (max − min) of cumulative balance between first and last columns
 * (variation segment only — same stepping as floating bars).
 */
const getMiddleVariationSpan = (
  numericValues: number[],
  waterfallValues: number[],
  indexes: SpecialIndexes,
): number => {
  const { first, last, retained } = indexes;
  if (last <= first) return 0;

  let current = numericValues[first];
  let vMin = current;
  let vMax = current;

  for (let index = first + 1; index < last; index += 1) {
    if (retained !== undefined && index === retained) {
      current = numericValues[retained];
    } else {
      current += waterfallValues[index];
    }
    vMin = Math.min(vMin, current);
    vMax = Math.max(vMax, current);
  }

  return Math.max(1, vMax - vMin);
};

/**
 * Retained column: anchor to the first total bar span instead of 0.
 * Positive retained → interval from first bar minimum to value; negative → from value to first bar maximum.
 * Must run after first/last alignment so {@link SpecialIndexes.first} range is final.
 */
function applyRetainedBarFirstAnchor(
  normalizedRanges: [number, number][],
  first: number,
  retained: number | undefined,
  retainedVal: number,
): void {
  if (
    retained === undefined ||
    !Number.isFinite(retainedVal) ||
    !normalizedRanges[first] ||
    !normalizedRanges[retained]
  ) {
    return;
  }

  const [fa, fb] = normalizedRanges[first];
  const firstLow = Math.min(fa, fb);
  const firstHigh = Math.max(fa, fb);

  if (retainedVal >= 0) {
    normalizedRanges[retained] = [
      Math.min(firstLow, retainedVal),
      Math.max(firstLow, retainedVal),
    ];
    return;
  }

  normalizedRanges[retained] = [
    Math.min(retainedVal, firstHigh),
    Math.max(retainedVal, firstHigh),
  ];
}

function totalsHaveOppositeSigns(a: number, b: number): boolean {
  return (a > 0 && b < 0) || (a < 0 && b > 0);
}

function setFullBarFromZeroIfSignificant(
  ranges: [number, number][],
  index: number,
  total: number,
): void {
  if (total > VALUE_EPS) {
    ranges[index] = [0, total];
  } else if (total < -VALUE_EPS) {
    ranges[index] = [total, 0];
  }
}

function alignOppositeSignTotals(
  ranges: [number, number][],
  first: number,
  last: number,
  firstTotal: number,
  lastTotal: number,
): void {
  ranges[first] = firstTotal > 0 ? [0, firstTotal] : [firstTotal, 0];
  ranges[last] = lastTotal > 0 ? [0, lastTotal] : [lastTotal, 0];
}

function alignPositiveSharedBaseline(
  ranges: [number, number][],
  first: number,
  last: number,
  a1: number,
  b1: number,
  a2: number,
  b2: number,
): void {
  if (!(b1 > 0 && b2 > 0)) {
    return;
  }
  const commonBaseline = Math.min(a1, a2);
  ranges[first] = [commonBaseline, b1];
  ranges[last] = [commonBaseline, b2];
}

function alignNegativeSharedBaseline(
  ranges: [number, number][],
  first: number,
  last: number,
  a1: number,
  b1: number,
  a2: number,
  b2: number,
): void {
  if (!(a1 < 0 && a2 < 0)) {
    return;
  }
  const commonBaseline = Math.max(b1, b2, 0);
  ranges[first] = [a1, commonBaseline];
  ranges[last] = [a2, commonBaseline];
}

function alignFirstLastTotalNormalizedRanges(
  normalizedRanges: [number, number][],
  first: number,
  last: number,
  firstTotal: number,
  lastTotal: number,
): void {
  if (first === last || !normalizedRanges[first] || !normalizedRanges[last]) {
    return;
  }

  if (totalsHaveOppositeSigns(firstTotal, lastTotal)) {
    alignOppositeSignTotals(
      normalizedRanges,
      first,
      last,
      firstTotal,
      lastTotal,
    );
    return;
  }

  const [a1, b1] = normalizedRanges[first];
  const [a2, b2] = normalizedRanges[last];
  const firstZero = Math.abs(firstTotal) < VALUE_EPS;
  const lastZero = Math.abs(lastTotal) < VALUE_EPS;

  if (firstZero && !lastZero) {
    setFullBarFromZeroIfSignificant(normalizedRanges, last, lastTotal);
    return;
  }

  if (!firstZero && lastZero) {
    setFullBarFromZeroIfSignificant(normalizedRanges, first, firstTotal);
    return;
  }

  alignPositiveSharedBaseline(normalizedRanges, first, last, a1, b1, a2, b2);
  alignNegativeSharedBaseline(normalizedRanges, first, last, a1, b1, a2, b2);
}

/**
 * Columns before the first total: stacked segments on the value axis whose combined
 * length equals the first bar span; each slice has length firstSpan / count so every
 * leading bar is proportional to the first total bar.
 */
export function fillLeadingPlaceholderBarRanges(
  normalizedRanges: [number, number][],
  first: number,
): void {
  if (first <= 0) return;

  const firstPair = normalizedRanges[first];
  if (!firstPair) return;

  const [f0, f1] = firstPair;
  const count = first;

  for (let i = 0; i < count; i += 1) {
    normalizedRanges[i] = [f0, f1 - (f1 - f0) * SPACING_PERCENTAGE];
  }
}
