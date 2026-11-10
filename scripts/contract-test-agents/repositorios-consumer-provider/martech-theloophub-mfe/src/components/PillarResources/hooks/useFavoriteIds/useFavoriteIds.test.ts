import { act, renderHook } from '@testing-library/react-hooks';

import {
  FAVORITES_STORAGE_KEY,
  readFavoriteIds,
} from '../../utils/favoritesStorage';
import { useFavoriteIds } from './useFavoriteIds';

describe('useFavoriteIds', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should hydrate state from localStorage on mount', () => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify([10, 20]),
    );

    const { result } = renderHook(() => useFavoriteIds());

    expect(result.current.favoriteIds).toEqual([10, 20]);
  });

  it('should add an id when toggled as not-yet-favorite', () => {
    const { result } = renderHook(() => useFavoriteIds());

    act(() => {
      result.current.toggle(7, false);
    });

    expect(result.current.favoriteIds).toEqual([7]);
    expect(readFavoriteIds()).toEqual([7]);
  });

  it('should remove an id when toggled as already-favorite', () => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([1, 2]));

    const { result } = renderHook(() => useFavoriteIds());

    act(() => {
      result.current.toggle(1, true);
    });

    expect(result.current.favoriteIds).toEqual([2]);
  });

  it('should sync other instances through the custom change event', () => {
    const instanceA = renderHook(() => useFavoriteIds());
    const instanceB = renderHook(() => useFavoriteIds());

    act(() => {
      instanceA.result.current.toggle(99, false);
    });

    expect(instanceB.result.current.favoriteIds).toEqual([99]);
  });
});
