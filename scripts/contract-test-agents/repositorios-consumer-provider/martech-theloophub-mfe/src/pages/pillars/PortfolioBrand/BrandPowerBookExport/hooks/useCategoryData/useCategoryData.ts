import { useMemo } from 'react';

import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

import { useStableBffResponse } from '../../utils';
import { useZonePerformanceDetails } from '../useZonePerformanceDetails/useZonePerformanceDetails';

export const useCategoryData = (pageFilter: string, enabled = true) => {
  const skipRequest = !enabled;

  const zonePerformanceDetails = useZonePerformanceDetails(pageFilter, enabled);

  const zonePerformance = useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.ZONE_PERFORMANCE,
      kpiGroup: 'power',
      subFilters: { page_filter: pageFilter },
      skipRequest,
    }),
  );
  const bigNumbers = useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.BIG_NUMBERS,
      kpiGroup: 'power',
      subFilters: { page_filter: pageFilter },
      skipRequest,
    }),
  );
  const maturityPerformance = useStableBffResponse(
    useBffData({
      id: SharedKpis.BFF.ZONE_MATURITY,
      kpiGroup: 'power',
      subFilters: { page_filter: pageFilter },
      skipRequest,
    }),
  );

  const loading =
    maturityPerformance.loading ||
    zonePerformanceDetails.loading ||
    zonePerformance.loading ||
    bigNumbers.loading;

  const error =
    maturityPerformance.error ||
    zonePerformanceDetails.error ||
    zonePerformance.error ||
    bigNumbers.error;

  const data = useMemo(
    () => ({
      maturityPerformance: maturityPerformance.data,
      zonePerformanceDetails: zonePerformanceDetails,
      zonePerformance: zonePerformance.data,
      bigNumbers: bigNumbers,
    }),
    [maturityPerformance, zonePerformanceDetails, zonePerformance, bigNumbers],
  );

  return useMemo(
    () => ({
      data,
      loading,
      error,
    }),
    [data, loading, error],
  );
};
