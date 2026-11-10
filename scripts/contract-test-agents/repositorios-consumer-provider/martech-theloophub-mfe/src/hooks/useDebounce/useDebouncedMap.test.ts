import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useDebouncedMap } from './useDebouncedMap';

describe('useDebouncedMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Basic functionality', () => {
    it('should return a function', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedMap(callback));

      expect(typeof result.current).toBe('function');
    });

    it('should call callback after delay', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedMap(callback, 300));

      act(() => {
        result.current('key1', 'value1');
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('key1', 'value1');
    });
  });

  describe('Multiple keys', () => {
    it('should handle multiple keys independently', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedMap(callback, 300));

      act(() => {
        result.current('key1', 'value1');
        result.current('key2', 'value2');
      });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith('key1', 'value1');
      expect(callback).toHaveBeenCalledWith('key2', 'value2');
    });
  });

  describe('Timer cancellation', () => {
    it('should cancel previous timer when same key is called again', () => {
      const callback = jest.fn();
      const { result } = renderHook(() => useDebouncedMap(callback, 300));

      act(() => {
        result.current('key1', 'value1');
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      act(() => {
        result.current('key1', 'value2');
      });

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(callback).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith('key1', 'value2');
    });
  });

  describe('Cleanup', () => {
    it('should clear all timers on unmount', () => {
      const callback = jest.fn();
      const { result, unmount } = renderHook(() =>
        useDebouncedMap(callback, 300),
      );

      act(() => {
        result.current('key1', 'value1');
        result.current('key2', 'value2');
      });

      unmount();

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Callback updates', () => {
    it('should use updated callback when callback changes', () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      const { result, rerender } = renderHook(
        ({ callback }) => useDebouncedMap(callback, 300),
        { initialProps: { callback: callback1 } },
      );

      act(() => {
        result.current('key1', 'value1');
      });

      rerender({ callback: callback2 });

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledWith('key1', 'value1');
    });
  });
});
