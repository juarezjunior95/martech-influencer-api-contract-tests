import { renderHook } from '@testing-library/react-hooks';
import { featureToggles } from 'config/featureToggle';

import { useABTest } from './useABTest';

const mockUseMultiplesFeatureToggles = jest.fn();

jest.mock('../useMultipleFeatureToggles/useMultipleFeatureToggles', () => ({
  useMultiplesFeatureToggles: (...args: any[]) =>
    mockUseMultiplesFeatureToggles(...args),
}));

describe('useABTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Group A', () => {
    it('should return isGroupA as true when groupAViewer is enabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(true);
      expect(result.current.isGroupB).toBe(false);
      expect(result.current.isControl).toBe(false);
    });

    it('should return isReady as true when groupAViewer is enabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isReady).toBe(true);
    });

    it('should prioritize groupA when both toggles are enabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(true);
      expect(result.current.isGroupB).toBe(false);
      expect(result.current.isControl).toBe(false);
    });

    it('should return all correct values for group A', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current).toEqual({
        isGroupA: true,
        isGroupB: false,
        isControl: false,
        isReady: true,
      });
    });
  });

  describe('Group B', () => {
    it('should return isGroupB as true when groupBViewer is enabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(false);
      expect(result.current.isGroupB).toBe(true);
      expect(result.current.isControl).toBe(false);
    });

    it('should return isReady as true when groupBViewer is enabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isReady).toBe(true);
    });

    it('should return all correct values for group B', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current).toEqual({
        isGroupA: false,
        isGroupB: true,
        isControl: false,
        isReady: true,
      });
    });
  });

  describe('Control Group', () => {
    it('should return isControl as true when no toggles are enabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(false);
      expect(result.current.isGroupB).toBe(false);
      expect(result.current.isControl).toBe(true);
    });

    it('should return isReady as true when in control group', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isReady).toBe(true);
    });

    it('should return all correct values for control group', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current).toEqual({
        isGroupA: false,
        isGroupB: false,
        isControl: true,
        isReady: true,
      });
    });
  });

  describe('isReady State', () => {
    it('should return isReady as false when toggles are not ready', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: false,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isReady).toBe(false);
    });

    it('should maintain group assignment when toggles are not ready', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: false,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(true);
      expect(result.current.isReady).toBe(false);
    });

    it('should reflect togglesReady state changes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: false,
      });

      const { result, rerender } = renderHook(() => useABTest());

      expect(result.current.isReady).toBe(false);

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      rerender();

      expect(result.current.isReady).toBe(true);
    });
  });

  describe('useMultiplesFeatureToggles Integration', () => {
    it('should call useMultiplesFeatureToggles with correct toggles', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      renderHook(() => useABTest());

      expect(mockUseMultiplesFeatureToggles).toHaveBeenCalledWith([
        featureToggles.groupAViewer,
        featureToggles.groupBViewer,
      ]);
    });

    it('should call useMultiplesFeatureToggles only once', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      renderHook(() => useABTest());

      expect(mockUseMultiplesFeatureToggles).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined feature toggle values', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {},
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(false);
      expect(result.current.isGroupB).toBe(false);
      expect(result.current.isControl).toBe(true);
    });

    it('should treat falsy values as false for groupAViewer', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: undefined,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(false);
      expect(result.current.isControl).toBe(true);
    });

    it('should treat falsy values as false for groupBViewer', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: undefined,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupB).toBe(false);
      expect(result.current.isControl).toBe(true);
    });

    it('should handle null values in featuresListByToggleName', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: null,
          [featureToggles.groupBViewer]: null,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isControl).toBe(true);
    });
  });

  describe('Memoization', () => {
    it('should return same result object when dependencies do not change', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result, rerender } = renderHook(() => useABTest());

      const firstResult = result.current;

      rerender();

      expect(result.current).toBe(firstResult);
    });

    it('should return new result object when featuresListByToggleName changes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result, rerender } = renderHook(() => useABTest());

      const firstResult = result.current;

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      rerender();

      expect(result.current).not.toBe(firstResult);
      expect(result.current.isGroupA).toBe(false);
      expect(result.current.isGroupB).toBe(true);
    });

    it('should return new result object when togglesReady changes', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: false,
      });

      const { result, rerender } = renderHook(() => useABTest());

      const firstResult = result.current;

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      rerender();

      expect(result.current).not.toBe(firstResult);
      expect(result.current.isReady).toBe(true);
    });
  });

  describe('Group Priority Logic', () => {
    it('should prioritize group A over group B', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(true);
      expect(result.current.isGroupB).toBe(false);
    });

    it('should only use group B when group A is false', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(false);
      expect(result.current.isGroupB).toBe(true);
    });

    it('should use control when both are false', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current.isControl).toBe(true);
    });
  });

  describe('Return Value Structure', () => {
    it('should return object with all required properties', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(result.current).toHaveProperty('isGroupA');
      expect(result.current).toHaveProperty('isGroupB');
      expect(result.current).toHaveProperty('isControl');
      expect(result.current).toHaveProperty('isReady');
    });

    it('should return boolean values for all properties', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      expect(typeof result.current.isGroupA).toBe('boolean');
      expect(typeof result.current.isGroupB).toBe('boolean');
      expect(typeof result.current.isControl).toBe('boolean');
      expect(typeof result.current.isReady).toBe('boolean');
    });

    it('should ensure only one group flag is true at a time', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result } = renderHook(() => useABTest());

      const groupFlags = [
        result.current.isGroupA,
        result.current.isGroupB,
        result.current.isControl,
      ];

      const trueCount = groupFlags.filter(Boolean).length;

      expect(trueCount).toBe(1);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle transition from control to group A', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result, rerender } = renderHook(() => useABTest());

      expect(result.current.isControl).toBe(true);

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      rerender();

      expect(result.current.isGroupA).toBe(true);
      expect(result.current.isControl).toBe(false);
    });

    it('should handle transition from group A to group B', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: true,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      const { result, rerender } = renderHook(() => useABTest());

      expect(result.current.isGroupA).toBe(true);

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      rerender();

      expect(result.current.isGroupA).toBe(false);
      expect(result.current.isGroupB).toBe(true);
    });

    it('should handle transition from group B to control', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: true,
        },
        togglesReady: true,
      });

      const { result, rerender } = renderHook(() => useABTest());

      expect(result.current.isGroupB).toBe(true);

      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.groupAViewer]: false,
          [featureToggles.groupBViewer]: false,
        },
        togglesReady: true,
      });

      rerender();

      expect(result.current.isGroupB).toBe(false);
      expect(result.current.isControl).toBe(true);
    });
  });
});
