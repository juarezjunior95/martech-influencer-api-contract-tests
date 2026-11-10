import { renderHook } from '@testing-library/react-hooks';

import { RESPONSIVE_CONFIGS } from '../configs/responsiveSizes';
import {
  MAX_COLUMN_WIDTH,
  MIN_COLUMN_SPACING,
  MIN_COLUMN_WIDTH,
} from '../constants';
import { useResponsiveConfig } from './useResponsiveConfig';

describe('useResponsiveConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns "small" config directly when size is "small"', () => {
    const { result } = renderHook(() => useResponsiveConfig('small', 500, 5));
    expect(result.current).toEqual(RESPONSIVE_CONFIGS.small);
  });

  it('returns "medium" config directly when size is "medium"', () => {
    const { result } = renderHook(() => useResponsiveConfig('medium', 500, 5));
    expect(result.current).toEqual(RESPONSIVE_CONFIGS.medium);
  });

  it('returns "large" config directly when size is "large"', () => {
    const { result } = renderHook(() => useResponsiveConfig('large', 500, 5));
    expect(result.current).toEqual(RESPONSIVE_CONFIGS.large);
  });

  it('ignores containerWidth and numColumns for fixed sizes', () => {
    const { result: r1 } = renderHook(() =>
      useResponsiveConfig('small', 100, 2),
    );
    const { result: r2 } = renderHook(() =>
      useResponsiveConfig('small', 1000, 20),
    );
    expect(r1.current).toEqual(r2.current);
  });

  describe('responsive size', () => {
    it('calculates columnWidth dynamically', () => {
      const { result } = renderHook(() =>
        useResponsiveConfig('responsive', 800, 5),
      );

      expect(result.current.columnWidth).toBeGreaterThanOrEqual(
        MIN_COLUMN_WIDTH,
      );
      expect(result.current.columnWidth).toBeLessThanOrEqual(MAX_COLUMN_WIDTH);
    });

    it('respects MIN_COLUMN_WIDTH', () => {
      const { result } = renderHook(() =>
        useResponsiveConfig('responsive', 200, 20),
      );

      expect(result.current.columnWidth).toBeGreaterThanOrEqual(
        MIN_COLUMN_WIDTH,
      );
    });

    it('respects MAX_COLUMN_WIDTH', () => {
      const { result } = renderHook(() =>
        useResponsiveConfig('responsive', 5000, 2),
      );

      expect(result.current.columnWidth).toBeLessThanOrEqual(MAX_COLUMN_WIDTH);
    });

    it('calculates columnSpacing as slotWidth minus columnWidth', () => {
      const containerWidth = 800;
      const numColumns = 5;
      const { result } = renderHook(() =>
        useResponsiveConfig('responsive', containerWidth, numColumns),
      );

      const baseConfig = RESPONSIVE_CONFIGS.responsive;
      const availableWidth =
        containerWidth - baseConfig.padding.left - baseConfig.padding.right;
      const slotWidth = availableWidth / numColumns;
      const expectedColumnWidth = Math.max(
        MIN_COLUMN_WIDTH,
        Math.min(MAX_COLUMN_WIDTH, slotWidth - MIN_COLUMN_SPACING),
      );
      const expectedSpacing = slotWidth - expectedColumnWidth;

      expect(result.current.columnSpacing).toBeCloseTo(expectedSpacing);
    });

    it('inherits base config properties (fontSize, padding, etc)', () => {
      const { result } = renderHook(() =>
        useResponsiveConfig('responsive', 800, 5),
      );

      expect(result.current.fontSize).toEqual(
        RESPONSIVE_CONFIGS.responsive.fontSize,
      );
      expect(result.current.padding).toEqual(
        RESPONSIVE_CONFIGS.responsive.padding,
      );
      expect(result.current.borderRadius).toBe(
        RESPONSIVE_CONFIGS.responsive.borderRadius,
      );
      expect(result.current.minCellHeight).toBe(
        RESPONSIVE_CONFIGS.responsive.minCellHeight,
      );
    });

    it('uses resolved base config for small containers', () => {
      const { result } = renderHook(() =>
        useResponsiveConfig('responsive', 150, 3),
      );

      expect(result.current.padding).toEqual(RESPONSIVE_CONFIGS.small.padding);
    });

    it('returns memoized result when inputs do not change', () => {
      const { result, rerender } = renderHook(
        ({ size, width, cols }) => useResponsiveConfig(size, width, cols),
        { initialProps: { size: 'responsive' as const, width: 800, cols: 5 } },
      );

      const firstResult = result.current;
      rerender({ size: 'responsive' as const, width: 800, cols: 5 });

      expect(result.current).toBe(firstResult);
    });
  });
});
