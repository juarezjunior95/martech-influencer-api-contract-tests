import { act, renderHook } from '@testing-library/react-hooks';

import { useChartInteraction } from './useChartInteraction';

describe('useChartInteraction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with null indices', () => {
      const { result } = renderHook(() => useChartInteraction({}));

      expect(result.current.hoveredIndex).toBeNull();
      expect(result.current.selectedIndex).toBeNull();
    });
  });

  describe('handleHover', () => {
    it('should update hoveredIndex on hover', () => {
      const { result } = renderHook(() => useChartInteraction({}));

      act(() => {
        result.current.handleHover(2);
      });

      expect(result.current.hoveredIndex).toBe(2);
    });

    it('should call onItemHover callback when hovering', () => {
      const onItemHover = jest.fn();
      const { result } = renderHook(() => useChartInteraction({ onItemHover }));

      act(() => {
        result.current.handleHover(1);
      });

      expect(onItemHover).toHaveBeenCalledWith(1);
    });

    it('should reset hoveredIndex to null on mouse leave', () => {
      const { result } = renderHook(() => useChartInteraction({}));

      act(() => {
        result.current.handleHover(2);
      });

      act(() => {
        result.current.handleHover(null);
      });

      expect(result.current.hoveredIndex).toBeNull();
    });
  });

  describe('handleClick', () => {
    it('should update selectedIndex on click', () => {
      const { result } = renderHook(() => useChartInteraction({}));

      act(() => {
        result.current.handleClick(3);
      });

      expect(result.current.selectedIndex).toBe(3);
    });

    it('should call onItemSelect callback when clicking', () => {
      const onItemSelect = jest.fn();
      const { result } = renderHook(() =>
        useChartInteraction({ onItemSelect }),
      );

      act(() => {
        result.current.handleClick(1);
      });

      expect(onItemSelect).toHaveBeenCalledWith(1);
    });

    it('should toggle selection when clicking the same index twice', () => {
      const onItemSelect = jest.fn();
      const { result } = renderHook(() =>
        useChartInteraction({ onItemSelect }),
      );

      act(() => {
        result.current.handleClick(1);
      });

      expect(result.current.selectedIndex).toBe(1);

      act(() => {
        result.current.handleClick(1);
      });

      expect(result.current.selectedIndex).toBeNull();
      expect(onItemSelect).toHaveBeenLastCalledWith(null);
    });
  });

  describe('getItemHoverState', () => {
    it('should return neutral when nothing is hovered or selected', () => {
      const { result } = renderHook(() => useChartInteraction({}));

      expect(result.current.getItemHoverState(0)).toBe('neutral');
      expect(result.current.getItemHoverState(1)).toBe('neutral');
    });

    it('should return hovered for the hovered index', () => {
      const { result } = renderHook(() => useChartInteraction({}));

      act(() => {
        result.current.handleHover(1);
      });

      expect(result.current.getItemHoverState(1)).toBe('hovered');
    });

    it('should return neutral for non-hovered indices by default (dimming disabled)', () => {
      const { result } = renderHook(() => useChartInteraction({}));

      act(() => {
        result.current.handleHover(1);
      });

      expect(result.current.getItemHoverState(0)).toBe('neutral');
      expect(result.current.getItemHoverState(2)).toBe('neutral');
    });

    it('should return dimmed for non-hovered indices when dimming is enabled', () => {
      const { result } = renderHook(() =>
        useChartInteraction({ disableLegendDimming: false }),
      );

      act(() => {
        result.current.handleHover(1);
      });

      expect(result.current.getItemHoverState(0)).toBe('dimmed');
      expect(result.current.getItemHoverState(2)).toBe('dimmed');
    });

    it('should return hovered for the selected index', () => {
      const { result } = renderHook(() => useChartInteraction({}));

      act(() => {
        result.current.handleClick(2);
      });

      expect(result.current.getItemHoverState(2)).toBe('hovered');
    });

    it('should return neutral for non-selected indices by default (dimming disabled)', () => {
      const { result } = renderHook(() => useChartInteraction({}));

      act(() => {
        result.current.handleClick(2);
      });

      expect(result.current.getItemHoverState(0)).toBe('neutral');
      expect(result.current.getItemHoverState(1)).toBe('neutral');
    });

    it('should return dimmed for non-selected indices when dimming is enabled', () => {
      const { result } = renderHook(() =>
        useChartInteraction({ disableLegendDimming: false }),
      );

      act(() => {
        result.current.handleClick(2);
      });

      expect(result.current.getItemHoverState(0)).toBe('dimmed');
      expect(result.current.getItemHoverState(1)).toBe('dimmed');
    });
  });
});
