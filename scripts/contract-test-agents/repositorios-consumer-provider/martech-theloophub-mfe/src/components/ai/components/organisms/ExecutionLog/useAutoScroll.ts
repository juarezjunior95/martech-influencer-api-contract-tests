import { useCallback, useEffect, useRef } from 'react';

interface UseAutoScrollOptions {
  isActive: boolean;
  dependency: unknown;
  behavior?: ScrollBehavior;
}

export function useAutoScroll<T extends HTMLElement>({
  isActive,
  dependency,
  behavior = 'smooth',
}: UseAutoScrollOptions) {
  const containerRef = useRef<T>(null);
  const isUserScrolledUpRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      isUserScrolledUpRef.current = distanceFromBottom > 50;
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isActive || isUserScrolledUpRef.current || !containerRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior,
      });
    });
  }, [dependency, isActive, behavior]);

  const scrollToBottom = useCallback(() => {
    isUserScrolledUpRef.current = false;
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  return { containerRef, scrollToBottom };
}
