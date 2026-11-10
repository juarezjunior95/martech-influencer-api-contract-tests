import { useCallback, useRef } from 'react';

export type StaleStrategy = 'cancel' | 'discard';

interface UseLatestAsyncReturn {
  execute: <T>(fn: (signal: AbortSignal) => Promise<T>) => Promise<T | null>;
  invalidate: () => void;
}

export function useLatestAsync(
  strategy: StaleStrategy = 'discard',
): UseLatestAsyncReturn {
  const requestCounter = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async <T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T | null> => {
      const myRequest = ++requestCounter.current;

      if (strategy === 'cancel' && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const result = await fn(controller.signal);

        if (myRequest !== requestCounter.current) return null;

        return result;
      } catch (err) {
        const errorName = (err as Error).name;
        if (errorName === 'AbortError' || errorName === 'CanceledError')
          return null;
        if (myRequest !== requestCounter.current) return null;
        throw err;
      }
    },
    [strategy],
  );

  const invalidate = useCallback(() => {
    requestCounter.current++;

    if (strategy === 'cancel' && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, [strategy]);

  return { execute, invalidate };
}
