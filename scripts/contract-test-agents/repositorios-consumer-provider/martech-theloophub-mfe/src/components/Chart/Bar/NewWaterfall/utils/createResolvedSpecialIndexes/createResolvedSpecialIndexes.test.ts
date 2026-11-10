import type { SpecialIndexes } from '../../types';
import { createResolvedSpecialIndexes } from './createResolvedSpecialIndexes';

describe('createResolvedSpecialIndexes', () => {
  it('should default first to 0 and last to labelsLength - 1', () => {
    expect(createResolvedSpecialIndexes(undefined, 6)).toEqual({
      first: 0,
      last: 5,
      retained: undefined,
      variation: undefined,
    });
  });

  it('should preserve explicit special indexes', () => {
    const special: SpecialIndexes = {
      first: 1,
      last: 4,
      retained: 2,
      variation: 3,
    };

    expect(createResolvedSpecialIndexes(special, 10)).toEqual(special);
  });

  it('should allow partial overrides with defaults for missing keys', () => {
    expect(createResolvedSpecialIndexes({ first: 2 }, 5)).toEqual({
      first: 2,
      last: 4,
      retained: undefined,
      variation: undefined,
    });
  });

  it('should yield last -1 when labelsLength is 0', () => {
    expect(createResolvedSpecialIndexes(undefined, 0).last).toBe(-1);
  });
});
