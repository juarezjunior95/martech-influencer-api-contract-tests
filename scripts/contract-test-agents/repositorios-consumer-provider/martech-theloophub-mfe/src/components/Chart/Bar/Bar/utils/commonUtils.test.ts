import { DataLabelContext } from '../types';
import {
  getBarPixelSize,
  getDataLabelAnchor,
  getValue,
  isSmallBar,
} from './commonUtils';

jest.mock('../constants', () => ({
  SMALL_BAR_THRESHOLD: 24,
}));

const createMockContext = (
  value: number,
  pixelFor0: number,
  pixelForValue: number,
): DataLabelContext =>
  ({
    dataIndex: 0,
    datasetIndex: 0,
    dataset: { data: [value] },
    chart: {
      scales: {
        y: {
          getPixelForValue: (v: number) =>
            v === 0 ? pixelFor0 : pixelForValue,
        },
      },
    },
  }) as DataLabelContext;

describe('commonUtils', () => {
  describe('getBarPixelSize', () => {
    it('returns absolute pixel difference between 0 and value', () => {
      const ctx = createMockContext(50, 200, 150);

      expect(getBarPixelSize(ctx)).toBe(50);
    });

    it('handles negative values', () => {
      const ctx = createMockContext(-50, 200, 250);

      expect(getBarPixelSize(ctx)).toBe(50);
    });
  });

  describe('isSmallBar', () => {
    it('returns true when bar is smaller than threshold', () => {
      const ctx = createMockContext(5, 200, 190);

      expect(isSmallBar(ctx)).toBe(true);
    });

    it('returns false when bar is larger than threshold', () => {
      const ctx = createMockContext(50, 200, 100);

      expect(isSmallBar(ctx)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('returns the value from dataset at dataIndex', () => {
      const ctx = createMockContext(42, 200, 150);

      expect(getValue(ctx)).toBe(42);
    });
  });

  describe('getDataLabelAnchor', () => {
    it('returns end for positive value with external position', () => {
      const ctx = createMockContext(50, 200, 100);

      expect(getDataLabelAnchor(ctx, 'external')).toBe('end');
    });

    it('returns start for negative value with external position', () => {
      const ctx = createMockContext(-50, 200, 300);

      expect(getDataLabelAnchor(ctx, 'external')).toBe('start');
    });

    it('returns center for large bar with internal position', () => {
      const ctx = createMockContext(50, 200, 100);

      expect(getDataLabelAnchor(ctx, 'internal')).toBe('center');
    });

    it('returns end for small bar with internal position and positive value', () => {
      const ctx = createMockContext(5, 200, 195);

      expect(getDataLabelAnchor(ctx, 'internal')).toBe('end');
    });
  });
});
