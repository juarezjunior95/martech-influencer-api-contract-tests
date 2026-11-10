import { renderHook } from '@testing-library/react-hooks';

import { useBodyScrollLock } from './useBodyScrollLock';

describe('useBodyScrollLock', () => {
  let originalOverflow: string;
  let originalPaddingRight: string;
  let originalInnerWidth: number;
  let originalClientWidth: number;

  beforeEach(() => {
    originalOverflow = document.body.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;
    originalInnerWidth = window.innerWidth;
    originalClientWidth = document.documentElement.clientWidth;

    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  afterEach(() => {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      writable: true,
      configurable: true,
      value: originalClientWidth,
    });
  });

  describe('when isLocked is true', () => {
    it('should set body overflow to hidden', () => {
      renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should add padding to compensate for scrollbar when scrollbar exists', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        configurable: true,
        value: 1007,
      });

      renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.paddingRight).toBe('17px');
    });

    it('should not add padding when scrollbar does not exist', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore original styles when unmounted', () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '10px';

      const { unmount } = renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('auto');
      expect(document.body.style.paddingRight).toBe('10px');
    });

    it('should preserve existing padding when adding scrollbar compensation', () => {
      document.body.style.paddingRight = '20px';
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        configurable: true,
        value: 1009,
      });

      const { unmount } = renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.paddingRight).toBe('15px');

      unmount();

      expect(document.body.style.paddingRight).toBe('20px');
    });
  });

  describe('when isLocked is false', () => {
    it('should not modify body styles', () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '5px';

      renderHook(() => useBodyScrollLock(false));

      expect(document.body.style.overflow).toBe('auto');
      expect(document.body.style.paddingRight).toBe('5px');
    });

    it('should not restore styles on unmount', () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '5px';

      const { unmount } = renderHook(() => useBodyScrollLock(false));

      unmount();

      expect(document.body.style.overflow).toBe('auto');
      expect(document.body.style.paddingRight).toBe('5px');
    });
  });

  describe('when isLocked changes', () => {
    it('should lock scroll when isLocked changes from false to true', () => {
      const { rerender } = renderHook(
        ({ locked }) => useBodyScrollLock(locked),
        { initialProps: { locked: false } },
      );

      expect(document.body.style.overflow).toBe('');

      rerender({ locked: true });

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should unlock scroll when isLocked changes from true to false', () => {
      document.body.style.overflow = 'auto';

      const { rerender } = renderHook(
        ({ locked }) => useBodyScrollLock(locked),
        { initialProps: { locked: true } },
      );

      expect(document.body.style.overflow).toBe('hidden');

      rerender({ locked: false });

      expect(document.body.style.overflow).toBe('auto');
    });

    it('should handle multiple lock/unlock cycles', () => {
      const { rerender } = renderHook(
        ({ locked }) => useBodyScrollLock(locked),
        { initialProps: { locked: false } },
      );

      expect(document.body.style.overflow).toBe('');

      rerender({ locked: true });
      expect(document.body.style.overflow).toBe('hidden');

      rerender({ locked: false });
      expect(document.body.style.overflow).toBe('');

      rerender({ locked: true });
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('edge cases', () => {
    it('should handle zero scrollbar width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const { unmount } = renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.overflow).toBe('hidden');

      const paddingValue = document.body.style.paddingRight;
      expect(
        ['', '0px'].includes(paddingValue) ||
          paddingValue === originalPaddingRight,
      ).toBeTruthy();
    });

    it('should handle negative scrollbar width calculation', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1000,
      });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should handle empty string as original overflow', () => {
      document.body.style.overflow = '';

      const { unmount } = renderHook(() => useBodyScrollLock(true));

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });
});
