import { act, renderHook } from '@testing-library/react-hooks';

import { useStore } from './useStore';

function createStore<T>(initial: T) {
  let current = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => current,
    set: (value: T) => {
      current = value;
      listeners.forEach((fn) => fn());
    },
    subscribe: (fn: () => void) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

describe('useStore', () => {
  it('should return the initial snapshot', () => {
    const store = createStore('hello');
    const { result } = renderHook(() => useStore(store.subscribe, store.get));

    expect(result.current).toBe('hello');
  });

  it('should update when the store changes', () => {
    const store = createStore(0);
    const { result } = renderHook(() => useStore(store.subscribe, store.get));

    act(() => store.set(42));

    expect(result.current).toBe(42);
  });

  it('should unsubscribe on unmount', () => {
    const store = createStore('a');
    const { result, unmount } = renderHook(() =>
      useStore(store.subscribe, store.get),
    );

    unmount();
    store.set('b');

    expect(result.current).toBe('a');
  });

  it('should handle multiple rapid updates', () => {
    const store = createStore(0);
    const { result } = renderHook(() => useStore(store.subscribe, store.get));

    act(() => {
      store.set(1);
      store.set(2);
      store.set(3);
    });

    expect(result.current).toBe(3);
  });
});
