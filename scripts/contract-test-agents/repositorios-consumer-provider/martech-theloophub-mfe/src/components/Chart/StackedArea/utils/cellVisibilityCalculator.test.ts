import { CELL_VISIBILITY_THRESHOLD } from '../constants';
import type { StackedAreaColumn } from '../types';
import {
  applyCellVisibility,
  calculateCellHeight,
  getCellVisibilityInfo,
  shouldShowCellNumber,
} from './cellVisibilityCalculator';

describe('cellVisibilityCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('shouldShowCellNumber', () => {
    it('returns true when height equals threshold', () => {
      expect(shouldShowCellNumber(CELL_VISIBILITY_THRESHOLD)).toBe(true);
    });

    it('returns true when height exceeds threshold', () => {
      expect(shouldShowCellNumber(CELL_VISIBILITY_THRESHOLD + 10)).toBe(true);
    });

    it('returns false when height is below threshold', () => {
      expect(shouldShowCellNumber(CELL_VISIBILITY_THRESHOLD - 1)).toBe(false);
    });

    it('returns false for zero height', () => {
      expect(shouldShowCellNumber(0)).toBe(false);
    });
  });

  describe('calculateCellHeight', () => {
    it('calculates proportional height correctly', () => {
      expect(calculateCellHeight(50, 100, 300)).toBe(150);
    });

    it('returns 0 when totalValue is 0', () => {
      expect(calculateCellHeight(50, 0, 300)).toBe(0);
    });

    it('returns full chart height when value equals total', () => {
      expect(calculateCellHeight(100, 100, 300)).toBe(300);
    });

    it('returns 0 when value is 0', () => {
      expect(calculateCellHeight(0, 100, 300)).toBe(0);
    });

    it('handles small proportions', () => {
      expect(calculateCellHeight(1, 100, 300)).toBeCloseTo(3);
    });
  });

  describe('applyCellVisibility', () => {
    it('adds height and showNumber to each segment', () => {
      const columns: StackedAreaColumn[] = [
        {
          label: 'Col1',
          segments: [{ value: 50 }, { value: 50 }],
        },
      ];

      const result = applyCellVisibility(columns, 300);

      expect(result[0].segments[0]).toHaveProperty('height');
      expect(result[0].segments[0]).toHaveProperty('showNumber');
      expect(result[0].segments[1]).toHaveProperty('height');
      expect(result[0].segments[1]).toHaveProperty('showNumber');
    });

    it('calculates correct height for equal segments', () => {
      const columns: StackedAreaColumn[] = [
        {
          label: 'Col1',
          segments: [{ value: 50 }, { value: 50 }],
        },
      ];

      const result = applyCellVisibility(columns, 300);

      expect(result[0].segments[0].height).toBeCloseTo(150);
      expect(result[0].segments[1].height).toBeCloseTo(150);
    });

    it('sets showNumber false for very small segments', () => {
      const columns: StackedAreaColumn[] = [
        {
          label: 'Col1',
          segments: [{ value: 99 }, { value: 1 }],
        },
      ];

      const result = applyCellVisibility(columns, 300);

      expect(result[0].segments[0].showNumber).toBe(true);
      expect(result[0].segments[1].showNumber).toBe(false);
    });

    it('preserves column label', () => {
      const columns: StackedAreaColumn[] = [
        {
          label: '2024',
          segments: [{ value: 50 }, { value: 50 }],
        },
      ];

      const result = applyCellVisibility(columns, 300);

      expect(result[0].label).toBe('2024');
    });

    it('handles multiple columns', () => {
      const columns: StackedAreaColumn[] = [
        { label: 'Col1', segments: [{ value: 50 }, { value: 50 }] },
        { label: 'Col2', segments: [{ value: 80 }, { value: 20 }] },
      ];

      const result = applyCellVisibility(columns, 300);

      expect(result).toHaveLength(2);
      expect(result[0].segments[0].height).toBeCloseTo(150);
      expect(result[1].segments[0].height).toBeCloseTo(240);
    });
  });

  describe('getCellVisibilityInfo', () => {
    const columns: StackedAreaColumn[] = [
      {
        label: 'Col1',
        segments: [
          { value: 50, height: 150, showNumber: true },
          { value: 50, height: 150, showNumber: true },
        ],
      },
    ];

    it('returns correct data for valid indices', () => {
      const result = getCellVisibilityInfo(0, 0, columns);

      expect(result).toEqual({
        height: 150,
        showNumber: true,
        value: 50,
      });
    });

    it('returns null for invalid column index', () => {
      expect(getCellVisibilityInfo(5, 0, columns)).toBeNull();
    });

    it('returns null for invalid segment index', () => {
      expect(getCellVisibilityInfo(0, 10, columns)).toBeNull();
    });

    it('returns null for negative column index', () => {
      expect(getCellVisibilityInfo(-1, 0, columns)).toBeNull();
    });

    it('defaults height to 0 when not present', () => {
      const cols: StackedAreaColumn[] = [
        { label: 'Col1', segments: [{ value: 42 }] },
      ];

      const result = getCellVisibilityInfo(0, 0, cols);

      expect(result).toEqual({
        height: 0,
        showNumber: false,
        value: 42,
      });
    });
  });
});
