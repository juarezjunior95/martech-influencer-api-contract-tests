import { useMemo } from 'react';

import { FilterValue } from 'models/Filters';

import {
  BFF_COMPONENT_IDS,
  BFF_VIEW_IDS,
} from './useBrandPowerRequests.constants';
import { KpiResponses } from './useBrandPowerRequests.types';
import { useBrandPowerUnifiedRequest } from './useBrandPowerUnifiedRequest';

interface UseBrandPowerImageryRequestsParams {
  detailsEnabled: boolean;
  shouldLoadImageryDetails: boolean;
  imagerySubFilters: Record<string, FilterValue> | null;
}

export const useBrandPowerImageryRequests = ({
  detailsEnabled,
  shouldLoadImageryDetails,
  imagerySubFilters,
}: UseBrandPowerImageryRequestsParams) => {
  const imageries = useBrandPowerUnifiedRequest({
    viewId: BFF_VIEW_IDS.imagery,
    componentId: BFF_COMPONENT_IDS.imagery,
    shouldLoad: shouldLoadImageryDetails,
    bffSubFilters: imagerySubFilters,
  });

  const bip = useBrandPowerUnifiedRequest({
    viewId: BFF_VIEW_IDS.bip,
    componentId: BFF_COMPONENT_IDS.bip,
    shouldLoad: detailsEnabled,
  });

  const responses = useMemo<Pick<KpiResponses, 'imageries' | 'bip'>>(
    () => ({
      imageries: { kpiData: imageries.data, loading: imageries.loading },
      bip: { kpiData: bip.data, loading: bip.loading },
    }),
    [imageries.data, imageries.loading, bip.data, bip.loading],
  );

  return {
    responses,
    loading: imageries.loading || bip.loading,
  };
};
