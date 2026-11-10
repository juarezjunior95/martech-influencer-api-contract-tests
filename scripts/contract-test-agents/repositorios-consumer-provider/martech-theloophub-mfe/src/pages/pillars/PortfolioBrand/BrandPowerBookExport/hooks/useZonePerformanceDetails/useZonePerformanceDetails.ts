import { useMemo } from 'react';

import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

import { useStableBffResponse } from '../../utils';

export const useZonePerformanceDetails = (
  pageFilter: string,
  enabled = true,
) => {
  const skipRequest = !enabled;

  const naz = useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.ZONE_PERFORMANCE_DETAILS,
      kpiGroup: 'power',
      subFilters: { page_filter: pageFilter, zone_maturity: 'NAZ' },
      skipRequest,
    }),
  );
  const saz = useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.ZONE_PERFORMANCE_DETAILS,
      kpiGroup: 'power',
      subFilters: { page_filter: pageFilter, zone_maturity: 'SAZ' },
      skipRequest,
    }),
  );
  const maz = useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.ZONE_PERFORMANCE_DETAILS,
      kpiGroup: 'power',
      subFilters: { page_filter: pageFilter, zone_maturity: 'MAZ' },
      skipRequest,
    }),
  );
  const apac = useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.ZONE_PERFORMANCE_DETAILS,
      kpiGroup: 'power',
      subFilters: { page_filter: pageFilter, zone_maturity: 'APAC' },
      skipRequest,
    }),
  );
  const afr = useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.ZONE_PERFORMANCE_DETAILS,
      kpiGroup: 'power',
      subFilters: { page_filter: pageFilter, zone_maturity: 'AFR' },
      skipRequest,
    }),
  );
  const eur = useStableBffResponse(
    useBffData({
      id: SharedKpis.GLOBAL.ZONE_PERFORMANCE_DETAILS,
      kpiGroup: 'power',
      subFilters: { page_filter: pageFilter, zone_maturity: 'EUR' },
      skipRequest,
    }),
  );

  const loading =
    naz.loading ||
    saz.loading ||
    maz.loading ||
    apac.loading ||
    afr.loading ||
    eur.loading;

  const error =
    naz.error || saz.error || maz.error || apac.error || afr.error || eur.error;

  return useMemo(
    () => ({
      NAZ: naz,
      SAZ: saz,
      MAZ: maz,
      APAC: apac,
      AFR: afr,
      EUR: eur,
      loading,
      error,
    }),
    [naz, saz, maz, apac, afr, eur, loading, error],
  );
};
