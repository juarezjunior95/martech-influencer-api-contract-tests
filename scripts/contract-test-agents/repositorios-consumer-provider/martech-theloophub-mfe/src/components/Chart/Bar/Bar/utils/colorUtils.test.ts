import { DataLabelContext } from '../types';
import { getBarBackgroundColor, getDataLabelColor } from './colorUtils';

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

describe('colorUtils', () => {
  describe('getDataLabelColor', () => {
    const colors = { internal: '#000', external: '#FFF' };

    it('returns external color for external position', () => {
      const ctx = createMockContext(50, 200, 150);

      expect(getDataLabelColor(ctx, 'external', colors)).toBe('#FFF');
    });

    it('returns internal color for internal position with large bar', () => {
      const ctx = createMockContext(50, 200, 100);

      expect(getDataLabelColor(ctx, 'internal', colors)).toBe('#000');
    });

    it('returns external color for internal position with small bar', () => {
      const ctx = createMockContext(5, 200, 195);

      expect(getDataLabelColor(ctx, 'internal', colors)).toBe('#FFF');
    });
  });

  describe('getBarBackgroundColor', () => {
    it('returns undefined when labelBackgroundColor is null', () => {
      expect(getBarBackgroundColor(null)).toBeUndefined();
    });

    it('returns string color when labelBackgroundColor is a string', () => {
      expect(getBarBackgroundColor('#abc')).toBe('#abc');
    });

    it('returns a function that maps context to color when input is a function', () => {
      const fn = getBarBackgroundColor(() => '#111');
      const ctx = createMockContext(1, 0, 0);

      expect(typeof fn).toBe('function');
      expect((fn as (c: DataLabelContext) => string | undefined)(ctx)).toBe(
        '#111',
      );
    });

    it('returns undefined from wrapper when callback returns null', () => {
      const fn = getBarBackgroundColor(() => null);
      const ctx = createMockContext(1, 0, 0);

      expect(
        (fn as (c: DataLabelContext) => string | undefined)(ctx),
      ).toBeUndefined();
    });
  });
});
