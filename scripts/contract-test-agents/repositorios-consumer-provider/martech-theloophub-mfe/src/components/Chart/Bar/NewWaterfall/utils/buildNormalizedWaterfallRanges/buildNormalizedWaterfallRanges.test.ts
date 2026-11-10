import { SPACING_PERCENTAGE } from '../../constants';
import type { SpecialIndexes } from '../../types';
import {
  buildNormalizedWaterfallRanges,
  buildWaterfallValues,
  fillLeadingPlaceholderBarRanges,
} from './buildNormalizedWaterfallRanges';

describe('buildWaterfallValues', () => {
  it('should zero first, last, and retained deltas and negate variation', () => {
    const numeric = [10, 5, 8, -2, 20];
    const indexes: SpecialIndexes = {
      first: 0,
      last: 4,
      retained: 2,
      variation: 3,
    };

    expect(buildWaterfallValues(numeric, indexes)).toEqual([0, 5, 0, 2, 0]);
  });

  it('should not negate when variation is undefined', () => {
    const numeric = [10, -3, 7];
    expect(buildWaterfallValues(numeric, { first: 0, last: 2 })).toEqual([
      0, -3, 0,
    ]);
  });
});

describe('fillLeadingPlaceholderBarRanges', () => {
  it('should no-op when first is 0', () => {
    const ranges: [number, number][] = [
      [1, 2],
      [3, 4],
    ];
    fillLeadingPlaceholderBarRanges(ranges, 0);
    expect(ranges).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should fill leading slots from the first bar span', () => {
    const ranges: [number, number][] = [
      [0, 0],
      [0, 0],
      [70, 100],
    ];
    fillLeadingPlaceholderBarRanges(ranges, 2);
    const expectedEnd = 100 - (100 - 70) * SPACING_PERCENTAGE;
    expect(ranges[0]).toEqual([70, expectedEnd]);
    expect(ranges[1]).toEqual([70, expectedEnd]);
    expect(ranges[2]).toEqual([70, 100]);
  });
});

describe('buildNormalizedWaterfallRanges', () => {
  it('should return empty structures for empty numeric values', () => {
    const indexes: SpecialIndexes = { first: 0, last: 0 };
    expect(buildNormalizedWaterfallRanges([], indexes)).toEqual({
      normalizedRanges: [],
      min: 0,
      max: 0,
      waterfallValues: [],
    });
  });

  it('should handle a single total column (first === last)', () => {
    const result = buildNormalizedWaterfallRanges([42], {
      first: 0,
      last: 0,
    });

    expect(result.waterfallValues).toEqual([0]);
    expect(result.normalizedRanges).toHaveLength(1);
    expect(result.normalizedRanges[0]).toEqual([
      42 - 42 * (1 - SPACING_PERCENTAGE),
      42,
    ]);
    expect(result.min).toBeLessThanOrEqual(42);
    expect(result.max).toBe(42);
  });

  it('should build floating bars between first and last totals', () => {
    const numeric = [100, 30, 130];
    const result = buildNormalizedWaterfallRanges(numeric, {
      first: 0,
      last: 2,
    });

    expect(result.waterfallValues).toEqual([0, 30, 0]);
    expect(result.normalizedRanges[1]).toEqual([100, 130]);
    expect(result.min).toBeLessThanOrEqual(70);
    expect(result.max).toBeGreaterThanOrEqual(130);
  });

  it('should use full bars from zero when first and last totals have opposite signs', () => {
    const numeric = [50, -20, -30];
    const result = buildNormalizedWaterfallRanges(numeric, {
      first: 0,
      last: 2,
    });

    expect(result.normalizedRanges[0]).toEqual([0, 50]);
    expect(result.normalizedRanges[2]).toEqual([-30, 0]);
  });

  it('should align a non-zero last total to zero when first total is ~zero', () => {
    const numeric = [0, 25, 80];
    const result = buildNormalizedWaterfallRanges(numeric, {
      first: 0,
      last: 2,
    });

    expect(result.normalizedRanges[2]).toEqual([0, 80]);
  });

  it('should align a non-zero first total to zero when last total is ~zero', () => {
    const numeric = [60, -10, 0];
    const result = buildNormalizedWaterfallRanges(numeric, {
      first: 0,
      last: 2,
    });

    expect(result.normalizedRanges[0]).toEqual([0, 60]);
  });

  it('should apply retained bar anchoring to the first total span', () => {
    const numeric = [100, 40, 200, 250];
    const result = buildNormalizedWaterfallRanges(numeric, {
      first: 0,
      last: 3,
      retained: 2,
    });

    const [fa, fb] = result.normalizedRanges[0];
    const firstLow = Math.min(fa, fb);
    const retainedPair = result.normalizedRanges[2];
    expect(retainedPair[0]).toBe(Math.min(firstLow, 200));
    expect(retainedPair[1]).toBe(Math.max(firstLow, 200));
  });

  it('should fill leading placeholder ranges when first > 0', () => {
    const numeric = [10, 20, 5, 35];
    const result = buildNormalizedWaterfallRanges(numeric, {
      first: 2,
      last: 3,
    });

    expect(result.normalizedRanges[0][0]).toBe(result.normalizedRanges[2][0]);
    expect(result.normalizedRanges[1][0]).toBe(result.normalizedRanges[2][0]);
  });

  it('should use full bar from zero for non-finite total values', () => {
    const result = buildNormalizedWaterfallRanges([Number.NaN, 1, 2], {
      first: 0,
      last: 2,
    });

    expect(result.normalizedRanges[0]).toEqual([Number.NaN, 0]);
  });

  it('should render a zero-height bar when total value is exactly zero', () => {
    const result = buildNormalizedWaterfallRanges([0], { first: 0, last: 0 });
    expect(result.normalizedRanges[0]).toEqual([0, 0]);
  });
});
