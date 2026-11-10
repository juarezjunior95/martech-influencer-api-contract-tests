import {
  countVisualZeroBarsBelow,
  isPreStartZero,
  isVisualZeroBar,
} from './zeroBarHelpers';

describe('zeroBarHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isVisualZeroBar', () => {
    it('returns false when value is not zero', () => {
      const dataset = { data: [5, 10, 3] };
      expect(isVisualZeroBar(dataset, 1)).toBe(false);
    });

    it('returns true when value is 0 and there are positive values before', () => {
      const dataset = { data: [5, 10, 0] };
      expect(isVisualZeroBar(dataset, 2)).toBe(true);
    });

    it('returns false when value is 0 but no positive data before', () => {
      const dataset = { data: [0, 0, 5] };
      expect(isVisualZeroBar(dataset, 0)).toBe(false);
      expect(isVisualZeroBar(dataset, 1)).toBe(false);
    });

    it('uses originalValues when available', () => {
      const dataset = { data: [1, 2, 3], originalValues: [5, 0, 0] };
      expect(isVisualZeroBar(dataset, 1)).toBe(true);
      expect(isVisualZeroBar(dataset, 2)).toBe(true);
    });

    it('returns false for first element that is zero', () => {
      const dataset = { data: [0, 5, 3] };
      expect(isVisualZeroBar(dataset, 0)).toBe(false);
    });
  });

  describe('isPreStartZero', () => {
    it('returns true when value is 0 before any positive value', () => {
      const dataset = { data: [0, 0, 5] };
      expect(isPreStartZero(dataset, 0)).toBe(true);
      expect(isPreStartZero(dataset, 1)).toBe(true);
    });

    it('returns false when value is 0 after a positive value', () => {
      const dataset = { data: [5, 0, 3] };
      expect(isPreStartZero(dataset, 1)).toBe(false);
    });

    it('returns false when value is not zero', () => {
      const dataset = { data: [5, 10, 3] };
      expect(isPreStartZero(dataset, 0)).toBe(false);
    });

    it('uses originalValues when available', () => {
      const dataset = { data: [1, 2, 3], originalValues: [0, 0, 5] };
      expect(isPreStartZero(dataset, 0)).toBe(true);
      expect(isPreStartZero(dataset, 1)).toBe(true);
    });

    it('returns true when all values are zero', () => {
      const dataset = { data: [0, 0, 0] };
      expect(isPreStartZero(dataset, 2)).toBe(true);
    });
  });

  describe('countVisualZeroBarsBelow', () => {
    it('counts consecutive visual zero bars below', () => {
      const datasets = [{ data: [5, 0] }, { data: [5, 0] }, { data: [5, 0] }];
      expect(countVisualZeroBarsBelow(datasets, 2, 1)).toBe(2);
    });

    it('stops counting when encountering a non-zero bar', () => {
      const datasets = [{ data: [5, 0] }, { data: [5, 10] }, { data: [5, 0] }];
      expect(countVisualZeroBarsBelow(datasets, 2, 1)).toBe(0);
    });

    it('returns 0 when there are no zero bars below', () => {
      const datasets = [{ data: [5, 10] }, { data: [5, 20] }];
      expect(countVisualZeroBarsBelow(datasets, 1, 1)).toBe(0);
    });

    it('returns 0 for the first dataset', () => {
      const datasets = [{ data: [5, 0] }];
      expect(countVisualZeroBarsBelow(datasets, 0, 1)).toBe(0);
    });

    it('counts only consecutive zeros from directly below', () => {
      const datasets = [
        { data: [5, 0] },
        { data: [5, 3] },
        { data: [5, 0] },
        { data: [5, 0] },
      ];
      expect(countVisualZeroBarsBelow(datasets, 3, 1)).toBe(1);
    });
  });
});
