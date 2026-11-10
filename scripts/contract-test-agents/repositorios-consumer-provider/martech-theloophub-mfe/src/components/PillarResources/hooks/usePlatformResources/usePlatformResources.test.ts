import { renderHook } from '@testing-library/react-hooks';

import { usePlatformResources } from './usePlatformResources';

describe('usePlatformResources', () => {
  it('should return the static payload without isLoading', () => {
    const { result } = renderHook(() => usePlatformResources([]));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data.platformPillars.length).toBeGreaterThan(0);
    expect(result.current.data.platformResources.length).toBeGreaterThan(0);
    expect(result.current.data.platformResourceTypes.length).toBeGreaterThan(0);
  });

  it('should strip the reportVisibilityToggleKey extension from resources', () => {
    const { result } = renderHook(() => usePlatformResources([]));

    for (const resource of result.current.data.platformResources) {
      expect(resource).not.toHaveProperty('reportVisibilityToggleKey');
    }
  });

  it('should mark resources as favorite based on favoriteIds', () => {
    const { result } = renderHook(() => usePlatformResources([1, 6]));

    const byId = new Map(
      result.current.data.platformResources.map((r) => [r.id, r]),
    );
    expect(byId.get(1)?.isUserFavorite).toBe(true);
    expect(byId.get(6)?.isUserFavorite).toBe(true);
    expect(byId.get(11)?.isUserFavorite).toBe(false);
  });

  it('should update isUserFavorite when favoriteIds changes', () => {
    let favoriteIds: number[] = [];

    const { result, rerender } = renderHook(() =>
      usePlatformResources(favoriteIds),
    );

    expect(
      result.current.data.platformResources.find((r) => r.id === 1)
        ?.isUserFavorite,
    ).toBe(false);

    favoriteIds = [1];
    rerender();

    expect(
      result.current.data.platformResources.find((r) => r.id === 1)
        ?.isUserFavorite,
    ).toBe(true);
  });
});
