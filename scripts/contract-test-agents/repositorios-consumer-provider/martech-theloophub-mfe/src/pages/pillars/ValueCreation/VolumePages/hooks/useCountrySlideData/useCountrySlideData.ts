import { useBffData, usePageFilterApplied } from 'hooks';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import type { Kpi } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useKpiEndpoint } from 'pages/pillars/ValueCreation/VolumePages/hooks/useKpiEndpoint';
import { getVolumePagesPageName } from 'pages/pillars/ValueCreation/VolumePages/VolumePages';

type SubFilterPrimitive = string | number | boolean;
type SubFilterValue = SubFilterPrimitive | Record<string, SubFilterPrimitive>;

export const useCountrySlideData = (
  kpi: Kpi,
  subFilters: Record<string, SubFilterValue>,
) => {
  const { applied } = usePageFilterApplied(getVolumePagesPageName(kpi));
  const kpiEndpoints = useKpiEndpoint(KPI_CONFIGS[kpi], applied);

  const data = useBffData({
    id: kpiEndpoints.country,
    kpiGroup: KPI_CONFIGS[kpi].kpiGroup,
    subFilters,
  });

  return data;
};
