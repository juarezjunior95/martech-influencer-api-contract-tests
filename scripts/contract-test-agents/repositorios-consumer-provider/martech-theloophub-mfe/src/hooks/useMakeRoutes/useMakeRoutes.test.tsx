import { renderHook } from '@testing-library/react-hooks';
import { useMultiplesFeatureToggles } from 'hooks/useMultipleFeatureToggles';

import { useMakeRoutes } from './useMakeRoutes';

jest.mock('hooks/useMultipleFeatureToggles', () => ({
  useMultiplesFeatureToggles: jest.fn(),
}));

jest.mock('./routes', () => ({
  allRoutes: [
    {
      id: 'portfolio-performance',
      path: '/',
      element: null,
    },
    {
      id: 'portfolio-performance',
      path: '/value-creation/portfolio-performance',
      element: null,
    },
    {
      id: 'volume-pages',
      path: '/value-creation/volume-pages',
      element: null,
    },
    {
      id: 'growth-league',
      path: '/value-creation/growth-league',
      element: null,
    },
    {
      id: 'commercial-results',
      path: '/value-creation/commercial-results',
      element: null,
    },
    {
      id: 'brand-analysis',
      path: '/portfolio-brand/brand-analysis',
      element: null,
    },
    {
      id: 'brand-power-book',
      path: '/portfolio-brand/brand-power-book',
      element: null,
    },
    {
      id: 'brand-power-book-export',
      path: '/portfolio-brand/brand-power-book-export',
      element: null,
    },
    {
      id: 'pos-book',
      path: '/category/pos',
      element: null,
    },
    {
      id: 'pos-pbi',
      path: '/category/pos-pbi',
      element: null,
    },
    {
      id: 'category-health',
      path: '/category/category-health',
      element: null,
    },
    {
      id: 'resource-allocation-media',
      path: '/connections-creativity/resource-allocation-media',
      element: null,
    },
    {
      id: 'audience-targeting',
      path: '/consumer/audience-targeting',
      element: null,
    },
    {
      id: 'development-viewer',
      path: '/development/components',
      element: null,
    },
  ],
}));

describe('useMakeRoutes', () => {
  const mockUseMultiplesFeatureToggles =
    useMultiplesFeatureToggles as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should return empty array when toggles are not ready', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {},
        togglesReady: false,
      });

      const { result } = renderHook(() => useMakeRoutes());

      expect(result.current).toEqual([]);
    });
  });

  describe('Route Filtering', () => {
    it('should return all routes when all feature toggles are enabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': true,
          'growth-league': true,
          'brand-analysis': true,
          'brand-power-book': true,
          'brand-power-book-export': true,
          'pos-book': true,
          'pos-pbi': true,
          'category-health': true,
          'resource-allocation-media': true,
          'audience-targeting': true,
          'development-viewer': true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      expect(result.current).toHaveLength(13);
      expect(result.current[0]).toHaveProperty('path');
      expect(result.current[0]).toHaveProperty('element');
      expect(result.current[0]).not.toHaveProperty('id');
    });

    it('should filter out routes when feature toggle is disabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': true,
          'brand-analysis': true,
          'brand-power-book': true,
          'brand-power-book-export': true,
          'pos-book': true,
          'pos-pbi': true,
          'category-health': true,
          'resource-allocation-media': true,
          'audience-targeting': true,
          'development-viewer': true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      expect(result.current).toHaveLength(12);
      expect(
        result.current.some((route) => route.path.includes('volume-pages')),
      ).toBe(false);
    });

    it('should return only enabled routes with multiple features disabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': true,
          'brand-analysis': false,
          'brand-power-book': true,
          'brand-power-book-export': true,
          'pos-book': true,
          'pos-pbi': true,
          'category-health': true,
          'resource-allocation-media': true,
          'audience-targeting': true,
          'development-viewer': true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      expect(result.current).toHaveLength(11);
    });

    it('should return empty array when all feature toggles are disabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': false,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      expect(result.current).toEqual([]);
    });

    it('should only return path and element properties', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      result.current.forEach((route) => {
        expect(Object.keys(route)).toEqual(['path', 'element']);
      });
    });
  });

  describe('Memoization', () => {
    it('should not recompute when featuresList does not change', () => {
      const featuresListByToggleName = {
        'portfolio-performance': true,
        'volume-pages': true,
        'growth-league': false,
        'brand-analysis': false,
        'brand-power-book': false,
        'brand-power-book-export': false,
        'pos-book': false,
        'pos-pbi': false,
        'category-health': false,
        'resource-allocation-media': false,
        'audience-targeting': false,
        'development-viewer': false,
      };

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName,
        togglesReady: true,
      });

      const { result, rerender } = renderHook(() => useMakeRoutes());
      const firstResult = result.current;

      rerender();

      expect(result.current).toBe(firstResult);
    });

    it('should recompute when featuresList changes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result, rerender } = renderHook(() => useMakeRoutes());
      const firstResult = result.current;

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': true,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      rerender();

      expect(result.current).not.toBe(firstResult);
      expect(result.current.length).toBeGreaterThan(firstResult.length);
    });
  });

  describe('State Transitions', () => {
    it('should transition from not ready to ready', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: false,
      });

      const { result, rerender } = renderHook(() => useMakeRoutes());

      expect(result.current).toEqual([]);

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      rerender();

      expect(result.current.length).toBeGreaterThan(0);
    });

    it('should return empty array when transitioning to not ready', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result, rerender } = renderHook(() => useMakeRoutes());

      expect(result.current.length).toBeGreaterThan(0);

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: false,
      });

      rerender();

      expect(result.current).toEqual([]);
    });
  });

  describe('Specific Feature Combinations', () => {
    it('should return only value creation routes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': true,
          'growth-league': true,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      result.current.forEach((route) => {
        expect(
          route.path.includes('/value-creation') || route.path === '/',
        ).toBe(true);
      });
    });

    it('should return only portfolio brand routes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': false,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': true,
          'brand-power-book': true,
          'brand-power-book-export': true,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      result.current.forEach((route) => {
        expect(route.path.includes('/portfolio-brand')).toBe(true);
      });
    });

    it('should return only category routes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': false,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': true,
          'pos-pbi': true,
          'category-health': true,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      result.current.forEach((route) => {
        expect(route.path.includes('/category')).toBe(true);
      });
    });

    it('should return only consumer routes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': false,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': true,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      result.current.forEach((route) => {
        expect(route.path.includes('/consumer')).toBe(true);
      });
    });

    it('should return only Connections & creativity routes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': false,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': true,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      result.current.forEach((route) => {
        expect(route.path.includes('/connections-creativity')).toBe(true);
      });
    });

    it('should return only development routes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': false,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      result.current.forEach((route) => {
        expect(route.path.includes('/development')).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty featuresListByToggleName', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {},
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      expect(result.current).toEqual([]);
    });

    it('should handle partial featuresListByToggleName', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      expect(result.current.length).toBeGreaterThan(0);
      expect(
        result.current.every(
          (route) =>
            route.path.includes('/value-creation') || route.path === '/',
        ),
      ).toBe(true);
    });

    it('should handle undefined values in featuresListByToggleName', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': undefined,
          'volume-pages': true,
          'growth-league': undefined,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useMakeRoutes());

      expect(
        result.current.every((route) => route.path.includes('volume-pages')),
      ).toBe(true);
    });
  });

  describe('Multiple Hook Instances', () => {
    it('should work correctly with multiple instances', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          'portfolio-performance': true,
          'volume-pages': false,
          'growth-league': false,
          'brand-analysis': false,
          'brand-power-book': false,
          'brand-power-book-export': false,
          'pos-book': false,
          'pos-pbi': false,
          'category-health': false,
          'resource-allocation-media': false,
          'audience-targeting': false,
          'development-viewer': false,
        },
        togglesReady: true,
      });

      const { result: result1 } = renderHook(() => useMakeRoutes());
      const { result: result2 } = renderHook(() => useMakeRoutes());

      expect(result1.current).toEqual(result2.current);
    });
  });
});
