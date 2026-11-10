import {
  FAVORITES_STORAGE_KEY,
  readFavoriteIds,
  toggleFavoriteId,
  writeFavoriteIds,
} from './favoritesStorage';

describe('favoritesStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('readFavoriteIds', () => {
    it('should return an empty array when nothing is stored', () => {
      expect(readFavoriteIds()).toEqual([]);
    });

    it('should parse a valid JSON array of numbers', () => {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify([1, 2, 3]),
      );
      expect(readFavoriteIds()).toEqual([1, 2, 3]);
    });

    it('should filter out non-number entries', () => {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify([1, 'two', null, 3]),
      );
      expect(readFavoriteIds()).toEqual([1, 3]);
    });

    it('should return an empty array on invalid JSON', () => {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, 'not-json');
      expect(readFavoriteIds()).toEqual([]);
    });

    it('should return an empty array when stored value is not an array', () => {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify({ a: 1 }),
      );
      expect(readFavoriteIds()).toEqual([]);
    });
  });

  describe('writeFavoriteIds', () => {
    it('should persist a deduplicated list to localStorage', () => {
      writeFavoriteIds([1, 2, 2, 3, 1]);
      expect(
        JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY) ?? ''),
      ).toEqual([1, 2, 3]);
    });
  });

  describe('toggleFavoriteId', () => {
    it('should add the id when it is not currently a favorite', () => {
      expect(toggleFavoriteId([1, 2], 3, false)).toEqual([1, 2, 3]);
    });

    it('should not duplicate when adding an existing id', () => {
      expect(toggleFavoriteId([1, 2], 2, false)).toEqual([1, 2]);
    });

    it('should remove the id when it is currently a favorite', () => {
      expect(toggleFavoriteId([1, 2, 3], 2, true)).toEqual([1, 3]);
    });
  });
});
