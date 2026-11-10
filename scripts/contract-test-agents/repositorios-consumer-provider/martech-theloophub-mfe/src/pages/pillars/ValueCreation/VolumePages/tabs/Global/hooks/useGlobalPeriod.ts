import { useMemo } from 'react';

import { useLastDataRefresh } from 'contexts';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import type { Kpi } from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { UseGlobalPeriodReturn } from 'pages/pillars/ValueCreation/VolumePages/tabs/Global/types';

export const useGlobalPeriod = (kpi: Kpi): UseGlobalPeriodReturn => {
  const { lastDataRefreshKpisDate, lastDataRefreshKpisDateMonthYear } =
    useLastDataRefresh();

  const refreshKpiGroup = useMemo(() => KPI_CONFIGS[kpi].kpiGroup, [kpi]);

  const dt_end = useMemo(
    () => lastDataRefreshKpisDateMonthYear?.[refreshKpiGroup],
    [lastDataRefreshKpisDateMonthYear, refreshKpiGroup],
  );

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

  return { dt_end, monthYear, period };
};
