import { useMemo } from 'react';

import { useLastDataRefresh } from 'contexts';
import { FilterDataAccessor, FilterRegistry } from 'domain/Filter';
import { useBffData, usePageFilterApplied, usePageFilterData } from 'hooks';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import type { Kpi } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { useKpiEndpoint } from 'pages/pillars/ValueCreation/VolumePages/hooks/useKpiEndpoint';
import { getVolumePagesPageName } from 'pages/pillars/ValueCreation/VolumePages/VolumePages';

export const useCountryPageData = (kpi: Kpi) => {
  const { applied } = usePageFilterApplied(getVolumePagesPageName(kpi));
  const { dataFilters } = usePageFilterData(getVolumePagesPageName(kpi));
  const { lastDataRefreshKpisDate } = useLastDataRefresh();
  const country = FilterDataAccessor.getInstance().getCountry(
    dataFilters,
    applied,
  );

  const refreshKpiGroup = useMemo(() => KPI_CONFIGS[kpi].kpiGroup, [kpi]);
  const kpiEndpoints = useKpiEndpoint(KPI_CONFIGS[kpi], applied);

  const data = useBffData({
    id: kpiEndpoints.country,
    kpiGroup: refreshKpiGroup,
    subFilters: { country: String(country?.value) || '', kpi },
  });

  const monthYear = useMemo(() => {
    const date = lastDataRefreshKpisDate[refreshKpiGroup];
    if (!date) return '';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  }, [lastDataRefreshKpisDate, refreshKpiGroup]);

  const period = useMemo(() => {
    const [month, year] = monthYear.toUpperCase().split(' ');

    if (!month || !year) return '';

    return `${month}'${year.slice(-2)}`;
  }, [monthYear]);

  const countryCoverLink = useMemo(() => {
    const countryCode = String(country?.value ?? '');

    if (!countryCode) return undefined;

    const zone = applied?.zone as string;

    return `/value-creation?${FilterRegistry.buildFilterQueryString({
      country: countryCode,
      zone,
    })}`;
  }, [country?.value, applied?.zone]);

  return {
    data,
    period,
    country,
    monthYear,
    countryCoverLink,
  };
};
