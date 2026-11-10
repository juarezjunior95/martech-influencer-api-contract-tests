import { useContext, useEffect, useRef, useState } from 'react';

import { MediaQueryContext } from 'contexts';

/**
 * Hook to track media queries using the matchMedia API.
 * When used inside MediaQueryProvider, shares a single listener per query string
 * across all components. Outside the provider, falls back to one listener per hook instance.
 *
 * @param query - Media query string (e.g., "(min-width: 1440px)")
 * @returns boolean indicating if the media query matches
 *
 * @example
 * const isLargeScreen = useMediaQuery('(min-width: 1440px)');
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
export const useMediaQuery = (query: string): boolean => {
  const context = useContext(MediaQueryContext);
  const contextRef = useRef(context);
  contextRef.current = context;

  const [standaloneMatches, setStandaloneMatches] = useState(() => {
    const mql = globalThis.window?.matchMedia?.(query);
    return mql?.matches ?? false;
  });

  useEffect(() => {
    const ctx = contextRef.current;
    if (ctx) {
      ctx.registerQuery(query);
      return () => ctx.unregisterQuery(query);
    }

    const mediaQueryList = globalThis.window?.matchMedia?.(query);
    if (!mediaQueryList) {
      return;
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setStandaloneMatches(event.matches);
    };

    setStandaloneMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener('change', handleChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  if (context) {
    if (
      globalThis.window !== undefined &&
      context.matches[query] === undefined
    ) {
      return globalThis.window.matchMedia(query).matches;
    }
    return context.matches[query] ?? false;
  }

  return standaloneMatches;
};
