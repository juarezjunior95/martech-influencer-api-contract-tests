import { getAxisBounds } from './getAxisBounds';

describe('getAxisBounds', () => {
  test('should return zero bounds when arrays are empty', () => {
    const result = getAxisBounds([], []);
    expect(result).toEqual({ populationMax: 0, iclMax: 0 });
  });

  test('should return zero bounds when arrays are undefined', () => {
    const result = getAxisBounds(undefined, undefined);
    expect(result).toEqual({ populationMax: 0, iclMax: 0 });
  });

  test('should return zero bounds when one series is missing', () => {
    expect(getAxisBounds([100, 200], undefined)).toEqual({
      populationMax: 0,
      iclMax: 0,
    });
    expect(getAxisBounds(undefined, [50, 80])).toEqual({
      populationMax: 0,
      iclMax: 0,
    });
  });

  test('should calculate bounds with headroom multiplier', () => {
    const populationValues = [100, 200, 150];
    const iclValues = [50, 80, 60];

    const result = getAxisBounds(populationValues, iclValues);

    expect(result.populationMax).toBe(200 * 1.5);
    expect(result.iclMax).toBe(80 * 1.5);
  });

  test('should handle single value arrays', () => {
    const result = getAxisBounds([100], [50]);

    expect(result.populationMax).toBe(150);
    expect(result.iclMax).toBe(75);
  });

  test('should handle negative values correctly', () => {
    const populationValues = [-50, 100, 50];
    const iclValues = [-20, 80, 40];

    const result = getAxisBounds(populationValues, iclValues);

    expect(result.populationMax).toBe(100 * 1.5);
    expect(result.iclMax).toBe(80 * 1.5);
  });
});
