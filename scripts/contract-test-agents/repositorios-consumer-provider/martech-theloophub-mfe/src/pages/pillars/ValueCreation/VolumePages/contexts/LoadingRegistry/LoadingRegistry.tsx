import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface LoadingActionsContextValue {
  register: (id: string, isLoading: boolean) => void;
  unregister: (id: string) => void;
}

/**
 * Stable context: only provides register/unregister actions.
 * Never changes after mount, so consumers do NOT re-render when loading states change.
 */
const LoadingActionsContext = createContext<LoadingActionsContextValue>({
  register: () => undefined,
  unregister: () => undefined,
});

/**
 * State context: provides the loadingMap.
 * Changes when any loading state changes — only consumed by the export button.
 */
const LoadingStateContext = createContext<Record<string, boolean>>({});

export const LoadingRegistryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const register = useCallback((id: string, isLoading: boolean) => {
    setLoadingMap((prev) => {
      if (prev[id] === isLoading) return prev;
      return { ...prev, [id]: isLoading };
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setLoadingMap((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const actions = useMemo(
    () => ({ register, unregister }),
    [register, unregister],
  );

  return (
    <LoadingActionsContext.Provider value={actions}>
      <LoadingStateContext.Provider value={loadingMap}>
        {children}
      </LoadingStateContext.Provider>
    </LoadingActionsContext.Provider>
  );
};

export const useRegisterLoading = (id: string, isLoading: boolean) => {
  const { register, unregister } = useContext(LoadingActionsContext);

  const idRef = useRef(id);

  useEffect(() => {
    register(idRef.current, isLoading);
  }, [isLoading, register]);

  useEffect(() => {
    const currentId = idRef.current;
    return () => {
      unregister(currentId);
    };
  }, [unregister]);
};

export const useIsAnyLoading = (): boolean => {
  const loadingMap = useContext(LoadingStateContext);
  return Object.values(loadingMap).some(Boolean);
};
