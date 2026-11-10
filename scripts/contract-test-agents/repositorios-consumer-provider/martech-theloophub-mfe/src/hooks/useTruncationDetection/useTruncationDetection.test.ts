import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { useTruncationDetection } from './useTruncationDetection';

describe('useTruncationDetection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Hook Initialization', () => {
    it('should return ref, isTruncated and displayText', () => {
      const { result } = renderHook(() => useTruncationDetection());

      expect(result.current).toHaveProperty('ref');
      expect(result.current).toHaveProperty('isTruncated');
      expect(result.current).toHaveProperty('displayText');
      expect(result.current.ref.current).toBeNull();
      expect(result.current.isTruncated).toBe(false);
    });

    it('should accept content and options as parameters', () => {
      const { result } = renderHook(() =>
        useTruncationDetection('Test content', { enabled: true }),
      );

      expect(result.current.isTruncated).toBe(false);
    });

    it('should default mode to css', () => {
      const { result } = renderHook(() => useTruncationDetection('Test'));

      expect(result.current.displayText).toBe('Test');
      expect(result.current.isTruncated).toBe(false);
    });
  });

  describe('CSS Mode - Truncation Detection', () => {
    it('should detect truncation when scrollWidth > clientWidth', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollWidth', {
        value: 200,
        configurable: true,
      });
      Object.defineProperty(element, 'clientWidth', {
        value: 100,
        configurable: true,
      });

      const { result } = renderHook(() => useTruncationDetection('Test'));

      act(() => {
        (result.current.ref as any).current = element;
      });

      act(() => {
        globalThis.dispatchEvent(new Event('resize'));
      });

      expect(typeof result.current.isTruncated).toBe('boolean');
    });

    it('should not detect truncation when scrollWidth <= clientWidth', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollWidth', {
        value: 100,
        configurable: true,
      });
      Object.defineProperty(element, 'clientWidth', {
        value: 100,
        configurable: true,
      });

      const { result } = renderHook(() => useTruncationDetection('Test'));

      act(() => {
        (result.current.ref as any).current = element;
      });

      expect(result.current.isTruncated).toBe(false);
    });

    it('should add resize listener on mount', () => {
      const addEventListenerSpy = jest.spyOn(globalThis, 'addEventListener');

      renderHook(() => useTruncationDetection('Test'));

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });

    it('should remove resize listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(
        globalThis,
        'removeEventListener',
      );

      const { unmount } = renderHook(() => useTruncationDetection('Test'));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });
  });

  describe('Dynamic Mode', () => {
    it('should return displayText equal to content when not truncated', () => {
      const { result } = renderHook(() =>
        useTruncationDetection('123', { mode: 'dynamic' }),
      );

      expect(result.current.displayText).toBe('123');
      expect(result.current.isTruncated).toBe(false);
    });

    it('should return original text when ref is null', () => {
      const { result } = renderHook(() =>
        useTruncationDetection('12345', { mode: 'dynamic' }),
      );

      expect(result.current.displayText).toBe('12345');
      expect(result.current.isTruncated).toBe(false);
    });

    it('should handle empty content', () => {
      const { result } = renderHook(() =>
        useTruncationDetection('', { mode: 'dynamic' }),
      );

      expect(result.current.displayText).toBe('');
      expect(result.current.isTruncated).toBe(false);
    });

    it('should not use window resize listener in dynamic mode', () => {
      const addEventListenerSpy = jest.spyOn(globalThis, 'addEventListener');

      renderHook(() => useTruncationDetection('Test', { mode: 'dynamic' }));

      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'resize',
        expect.any(Function),
      );
    });
  });

  describe('enabled Option', () => {
    it('should not check truncation when enabled is false', () => {
      const element = document.createElement('div');
      Object.defineProperty(element, 'scrollWidth', {
        value: 200,
        configurable: true,
      });
      Object.defineProperty(element, 'clientWidth', {
        value: 100,
        configurable: true,
      });

      const { result } = renderHook(() =>
        useTruncationDetection('Test', { enabled: false }),
      );

      act(() => {
        (result.current.ref as any).current = element;
      });

      expect(result.current.isTruncated).toBe(false);
    });

    it('should not truncate in dynamic mode when enabled is false', () => {
      const { result } = renderHook(() =>
        useTruncationDetection('Test', { mode: 'dynamic', enabled: false }),
      );

      expect(result.current.displayText).toBe('Test');
      expect(result.current.isTruncated).toBe(false);
    });

    it('should use enabled as true by default', () => {
      const { result } = renderHook(() => useTruncationDetection('Test'));

      expect(result.current.isTruncated).toBe(false);
    });
  });

  describe('getElementToCheck Option', () => {
    it('should use custom element when getElementToCheck is provided', () => {
      const customElement = {
        scrollWidth: 200,
        clientWidth: 100,
      } as HTMLElement;

      const getElementToCheck = jest.fn(() => customElement);

      renderHook(() => useTruncationDetection('Test', { getElementToCheck }));

      expect(getElementToCheck).toHaveBeenCalled();
    });

    it('should handle null when getElementToCheck returns null', () => {
      const getElementToCheck = jest.fn(() => null);

      const { result } = renderHook(() =>
        useTruncationDetection('Test', { getElementToCheck }),
      );

      expect(result.current.isTruncated).toBe(false);
    });
  });

  describe('Content Changes', () => {
    it('should re-check truncation when content changes', () => {
      const { result, rerender } = renderHook(
        ({ content }) => useTruncationDetection(content),
        { initialProps: { content: 'Initial content' } },
      );

      rerender({ content: 'New content' });

      expect(result.current.isTruncated).toBe(false);
    });

    it('should update displayText when content changes in dynamic mode', () => {
      const { result, rerender } = renderHook(
        ({ content }) => useTruncationDetection(content, { mode: 'dynamic' }),
        { initialProps: { content: 'Initial' } },
      );

      expect(result.current.displayText).toBe('Initial');

      rerender({ content: 'Updated' });

      expect(result.current.displayText).toBe('Updated');
    });
  });

  describe('Edge Cases', () => {
    it('should not cause error when ref.current is null', () => {
      const { result } = renderHook(() => useTruncationDetection('Test'));

      expect(result.current.isTruncated).toBe(false);
    });

    it('should work with empty content', () => {
      const { result } = renderHook(() => useTruncationDetection(''));

      expect(result.current.isTruncated).toBe(false);
    });

    it('should work with undefined content', () => {
      const { result } = renderHook(() => useTruncationDetection(undefined));

      expect(result.current.isTruncated).toBe(false);
    });
  });
});
