import { useMemo } from 'react';

import { ChartData } from 'pages/components/ChartWithCaption/types';

import { BrandPowerData } from '../../types';
import {
  BFF_COMPONENT_IDS,
  BFF_VIEW_IDS,
} from './useBrandPowerRequests.constants';
import { KpiResponses } from './useBrandPowerRequests.types';
import { useBrandPowerUnifiedRequest } from './useBrandPowerUnifiedRequest';

interface UseBrandPowerAwarenessRequestsParams {
  detailsEnabled: boolean;
  shouldLoadBrandClarity: boolean;
  occasionBffSubFilters: Record<string, string>;
}

export const useBrandPowerAwarenessRequests = ({
  detailsEnabled,
  shouldLoadBrandClarity,
  occasionBffSubFilters,
}: UseBrandPowerAwarenessRequestsParams) => {
  const salience = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.salience,
    componentId: BFF_COMPONENT_IDS.salience,
    shouldLoad: detailsEnabled,
  });

  const unaidedAwareness = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.unaided_awareness,
    componentId: BFF_COMPONENT_IDS.unaided_awareness,
    shouldLoad: detailsEnabled,
  });

  const brandClarity = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.brand_clarity,
    componentId: BFF_COMPONENT_IDS.brand_clarity,
    shouldLoad: shouldLoadBrandClarity,
  });

  const occasion = useBrandPowerUnifiedRequest<ChartData>({
    viewId: BFF_VIEW_IDS.occasion,
    componentId: BFF_COMPONENT_IDS.occasion,
    shouldLoad: detailsEnabled,
    bffSubFilters: occasionBffSubFilters,
  });

  const responses = useMemo<
    Pick<
      KpiResponses,
      'salience' | 'unaided_awareness' | 'brand_clarity' | 'occasion'
    >
  >(
    () => ({
      salience: { kpiData: salience.data, loading: salience.loading },
      unaided_awareness: {
        kpiData: unaidedAwareness.data,
        loading: unaidedAwareness.loading,
      },
      brand_clarity: {
        kpiData: brandClarity.data,
        loading: brandClarity.loading,
      },
      occasion: { kpiData: occasion.data, loading: occasion.loading },
    }),
    [
      salience.data,
      salience.loading,
      unaidedAwareness.data,
      unaidedAwareness.loading,
      brandClarity.data,
      brandClarity.loading,
      occasion.data,
      occasion.loading,
    ],
  );

  const loading =
    salience.loading ||
    unaidedAwareness.loading ||
    brandClarity.loading ||
    occasion.loading;

  return {
    responses,
    loading,
  };
};
