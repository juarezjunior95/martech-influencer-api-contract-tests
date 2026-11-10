import { SpecialIndexes } from '../../types';

export const createResolvedSpecialIndexes = (
  specialIndexes: Partial<SpecialIndexes> | undefined,
  labelsLength: number,
): SpecialIndexes => ({
  first: specialIndexes?.first ?? 0,
  last: specialIndexes?.last ?? labelsLength - 1,
  retained: specialIndexes?.retained,
  variation: specialIndexes?.variation,
});
