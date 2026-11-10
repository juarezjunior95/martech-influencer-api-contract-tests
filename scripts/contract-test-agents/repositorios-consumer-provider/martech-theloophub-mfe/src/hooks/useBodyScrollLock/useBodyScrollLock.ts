import { useEffect } from 'react';

/**
 * Hook to lock/unlock body scroll when a modal or overlay is open
 * Prevents layout shift by compensating for scrollbar width
 *
 * @param isLocked - Whether to lock the body scroll
 */
export const useBodyScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (!isLocked) return;

    // Get scrollbar width
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Save current styles
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Disable scroll and add padding to prevent layout shift
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Cleanup: restore original styles when unlocked
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
};
