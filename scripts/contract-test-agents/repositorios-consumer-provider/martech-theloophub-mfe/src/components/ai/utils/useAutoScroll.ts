import { useCallback, useEffect, useRef } from 'react';

const NEAR_BOTTOM_THRESHOLD = 80;

interface UseAutoScrollOptions {
  /** Dependencies that trigger a smooth scroll to bottom */
  deps: unknown[];
  /** Incrementing value that triggers instant scroll when near bottom */
  streamingDep?: number;
}

export function useAutoScroll({ deps, streamingDep }: UseAutoScrollOptions) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const isNearBottomRef = useRef(true);

  const scrollToBottom = useCallback((instant = false) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (instant) {
      el.scrollTop = el.scrollHeight;
    } else {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  // Find scroll container + attach scroll listener
  useEffect(() => {
    let current = anchorRef.current?.parentElement ?? null;
    while (current) {
      const { overflowY } = getComputedStyle(current);
      if (overflowY === 'auto' || overflowY === 'scroll') {
        scrollContainerRef.current = current;
        break;
      }
      current = current.parentElement;
    }

    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      isNearBottomRef.current =
        scrollHeight - scrollTop - clientHeight < NEAR_BOTTOM_THRESHOLD;
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll on deps change (new messages, loading state)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => scrollToBottom(), deps);

  // Instant scroll on streaming content growth (stay pinned)
  useEffect(() => {
    if (isNearBottomRef.current) {
      scrollToBottom(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamingDep]);

  return { anchorRef };
}
