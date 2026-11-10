import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedMap<K extends string, V>(
  callback: (key: K, value: V) => void,
  delay = 300,
): (key: K, value: V) => void {
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => {
        clearTimeout(timer);
      });
      timersRef.current = {};
    };
  }, []);

  return useCallback(
    (key: K, value: V) => {
      if (timersRef.current[key]) {
        clearTimeout(timersRef.current[key]);
      }

      timersRef.current[key] = setTimeout(() => {
        callbackRef.current(key, value);
        delete timersRef.current[key];
      }, delay);
    },
    [delay],
  );
}
