import { useCallback, useEffect, useState } from 'react';

import {
  FAVORITES_STORAGE_KEY,
  readFavoriteIds,
  toggleFavoriteId,
  writeFavoriteIds,
} from 'components/PillarResources/utils/favoritesStorage';

const FAVORITES_CHANGE_EVENT = 'theloophub:pillar-resources:favorites-change';

const notifyChange = () => {
  if (globalThis.window === undefined) return;
  globalThis.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
};

export const useFavoriteIds = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() =>
    readFavoriteIds(),
  );

  useEffect(() => {
    if (globalThis.window === undefined) return undefined;

    const syncFromStorage = () => setFavoriteIds(readFavoriteIds());

    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === FAVORITES_STORAGE_KEY) syncFromStorage();
    };

    globalThis.addEventListener(FAVORITES_CHANGE_EVENT, syncFromStorage);
    globalThis.addEventListener('storage', handleStorageEvent);

    return () => {
      globalThis.removeEventListener(FAVORITES_CHANGE_EVENT, syncFromStorage);
      globalThis.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  const toggle = useCallback(
    (resourceId: number, isCurrentlyFavorite: boolean) => {
      setFavoriteIds((previous) => {
        const next = toggleFavoriteId(
          previous,
          resourceId,
          isCurrentlyFavorite,
        );
        writeFavoriteIds(next);
        notifyChange();
        return next;
      });
    },
    [],
  );

  return { favoriteIds, toggle };
};
