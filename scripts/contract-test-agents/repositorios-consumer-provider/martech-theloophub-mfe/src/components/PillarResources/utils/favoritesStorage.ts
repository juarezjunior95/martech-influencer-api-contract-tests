const FAVORITES_STORAGE_KEY = 'theloophub:pillar-resources:favorites';

const isBrowser = (): boolean =>
  globalThis.window !== undefined && globalThis.localStorage !== undefined;

const readFavoriteIds = (): number[] => {
  if (!isBrowser()) return [];

  try {
    const raw = globalThis.localStorage.getItem(FAVORITES_STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value): value is number => typeof value === 'number');
  } catch {
    return [];
  }
};

const writeFavoriteIds = (ids: number[]): void => {
  if (!isBrowser()) return;

  try {
    const deduped = Array.from(new Set(ids));
    globalThis.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(deduped),
    );
  } catch {
    // Silently ignore quota or serialization errors; favorites are non-critical.
  }
};

const toggleFavoriteId = (
  ids: number[],
  resourceId: number,
  isCurrentlyFavorite: boolean,
): number[] => {
  if (isCurrentlyFavorite) return ids.filter((id) => id !== resourceId);
  if (ids.includes(resourceId)) return ids;

  return [...ids, resourceId];
};

export {
  FAVORITES_STORAGE_KEY,
  readFavoriteIds,
  toggleFavoriteId,
  writeFavoriteIds,
};
