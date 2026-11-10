import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Lightweight polyfill for React 18's useSyncExternalStore.
 * Subscribes to an external store and re-renders when the snapshot changes.
 */
export function useStore<T>(
  subscribe: (callback: () => void) => () => void,
  getSnapshot: () => T,
): T {
  const [state, setState] = useState(getSnapshot);
  const snapshotRef = useRef(getSnapshot);

  snapshotRef.current = getSnapshot;

  const sync = useCallback(() => {
    setState(snapshotRef.current());
  }, []);

  useEffect(() => {
    sync();
    return subscribe(sync);
  }, [subscribe, sync]);

  return state;
}
