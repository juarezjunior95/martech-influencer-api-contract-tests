import { useMemo } from 'react';

import { BrandPowerData } from '../../types';
import {
  BFF_COMPONENT_IDS,
  BFF_VIEW_IDS,
} from './useBrandPowerRequests.constants';
import { KpiResponses } from './useBrandPowerRequests.types';
import { useBrandPowerUnifiedRequest } from './useBrandPowerUnifiedRequest';

interface UseBrandPowerDetailRequestsParams {
  detailsEnabled: boolean;
}

export const useBrandPowerDetailRequests = ({
  detailsEnabled,
}: UseBrandPowerDetailRequestsParams) => {
  const meaning = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.meaning,
    componentId: BFF_COMPONENT_IDS.meaning,
    shouldLoad: detailsEnabled,
  });

  const affinity = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.affinity,
    componentId: BFF_COMPONENT_IDS.affinity,
    shouldLoad: detailsEnabled,
  });

  const meetNeeds = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.meet_needs,
    componentId: BFF_COMPONENT_IDS.meet_needs,
    shouldLoad: detailsEnabled,
  });

  const difference = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.difference,
    componentId: BFF_COMPONENT_IDS.difference,
    shouldLoad: detailsEnabled,
  });

  const dynamic = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.dynamic,
    componentId: BFF_COMPONENT_IDS.dynamic,
    shouldLoad: detailsEnabled,
  });

  const unique = useBrandPowerUnifiedRequest<BrandPowerData>({
    viewId: BFF_VIEW_IDS.unique,
    componentId: BFF_COMPONENT_IDS.unique,
    shouldLoad: detailsEnabled,
  });

  const responses = useMemo<
    Pick<
      KpiResponses,
      'meaning' | 'affinity' | 'meetNeeds' | 'difference' | 'dynamic' | 'unique'
    >
  >(
    () => ({
      meaning: { kpiData: meaning.data, loading: meaning.loading },
      affinity: { kpiData: affinity.data, loading: affinity.loading },
      meetNeeds: { kpiData: meetNeeds.data, loading: meetNeeds.loading },
      difference: { kpiData: difference.data, loading: difference.loading },
      dynamic: { kpiData: dynamic.data, loading: dynamic.loading },
      unique: { kpiData: unique.data, loading: unique.loading },
    }),
    [
      meaning.data,
      meaning.loading,
      affinity.data,
      affinity.loading,
      meetNeeds.data,
      meetNeeds.loading,
      difference.data,
      difference.loading,
      dynamic.data,
      dynamic.loading,
      unique.data,
      unique.loading,
    ],
  );

  const loading =
    meaning.loading ||
    affinity.loading ||
    meetNeeds.loading ||
    difference.loading ||
    dynamic.loading ||
    unique.loading;

  return {
    responses,
    loading,
  };
};
