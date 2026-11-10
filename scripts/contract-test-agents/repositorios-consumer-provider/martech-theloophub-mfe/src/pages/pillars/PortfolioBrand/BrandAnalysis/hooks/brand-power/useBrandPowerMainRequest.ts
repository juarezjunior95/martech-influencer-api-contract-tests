import { useMemo } from 'react';

import { BrandPowerData } from '../../types';
import {
  BFF_COMPONENT_IDS,
  BFF_VIEW_IDS,
} from './useBrandPowerRequests.constants';
import { KpiResponses } from './useBrandPowerRequests.types';
import { useBrandPowerUnifiedRequest } from './useBrandPowerUnifiedRequest';

interface UseBrandPowerMainRequestParams {
  enabledPower: boolean;
  powerBffSubFilters: Record<string, string> | null;
}

export const useBrandPowerMainRequest = ({
  enabledPower,
  powerBffSubFilters,
}: UseBrandPowerMainRequestParams) => {
  const power = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.power,
    componentId: BFF_COMPONENT_IDS.power,
    shouldLoad: enabledPower,
    bffSubFilters: powerBffSubFilters,
  });

  const responses = useMemo<Pick<KpiResponses, 'power'>>(
    () => ({
      power: {
        kpiData: power.data,
        loading: power.loading,
      },
    }),
    [power.data, power.loading],
  );

  return {
    responses,
    loading: power.loading,
  };
};
