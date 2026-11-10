import { useMemo } from 'react';

import {
  platformResourcesStatic,
  toPlatformResourcesResponse,
} from 'components/PillarResources/config/platformResourcesData';
import { UsePlatformResourcesResult } from 'components/PillarResources/hooks/usePlatformResources/types';
import { PlatformResourcesResponse } from 'components/PillarResources/types';

export const usePlatformResources = (
  favoriteIds: number[],
): UsePlatformResourcesResult => {
  const data = useMemo<PlatformResourcesResponse>(() => {
    const baseResponse = toPlatformResourcesResponse(platformResourcesStatic);
    const favoriteSet = new Set(favoriteIds);
    return {
      ...baseResponse,
      platformResources: baseResponse.platformResources.map((resource) => ({
        ...resource,
        isUserFavorite: favoriteSet.has(resource.id),
      })),
    };
  }, [favoriteIds]);

  return { data, isLoading: false };
};
