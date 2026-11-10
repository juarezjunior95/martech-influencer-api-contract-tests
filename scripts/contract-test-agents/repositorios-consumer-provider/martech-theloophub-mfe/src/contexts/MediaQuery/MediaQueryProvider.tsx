import React, { useCallback, useMemo, useRef, useState } from 'react';

export interface MediaQueryContextValue {
  matches: Record<string, boolean>;
  registerQuery: (query: string) => void;
  unregisterQuery: (query: string) => void;
}

export const MediaQueryContext =
  React.createContext<MediaQueryContextValue | null>(null);

interface QuerySubscription {
  mql: MediaQueryList;
  listener: (event: MediaQueryListEvent) => void;
  refCount: number;
}

export const MediaQueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [matches, setMatches] = useState<Record<string, boolean>>({});
  const subscriptionsRef = useRef<Map<string, QuerySubscription>>(new Map());

  const registerQuery = useCallback((query: string) => {
    const mql = globalThis.window?.matchMedia?.(query);
    if (!mql) return;

    const existing = subscriptionsRef.current.get(query);
    if (existing) {
      existing.refCount += 1;
      return;
    }

    const listener = (event: MediaQueryListEvent) => {
      setMatches((prev) => ({ ...prev, [query]: event.matches }));
    };

    mql.addEventListener('change', listener);

    setMatches((prev) => ({ ...prev, [query]: mql.matches }));

    subscriptionsRef.current.set(query, {
      mql,
      listener,
      refCount: 1,
    });
  }, []);

  const unregisterQuery = useCallback((query: string) => {
    const sub = subscriptionsRef.current.get(query);
    if (!sub) return;

    sub.refCount -= 1;
    if (sub.refCount <= 0) {
      sub.mql.removeEventListener('change', sub.listener);
      subscriptionsRef.current.delete(query);
      setMatches((prev) => {
        const next = { ...prev };
        delete next[query];
        return next;
      });
    }
  }, []);

  const value = useMemo<MediaQueryContextValue>(
    () => ({
      matches,
      registerQuery,
      unregisterQuery,
    }),
    [matches, registerQuery, unregisterQuery],
  );

  return (
    <MediaQueryContext.Provider value={value}>
      {children}
    </MediaQueryContext.Provider>
  );
};
