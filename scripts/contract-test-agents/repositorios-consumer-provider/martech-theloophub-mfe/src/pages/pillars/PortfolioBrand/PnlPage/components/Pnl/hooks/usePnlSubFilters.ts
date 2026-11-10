import { FilterDataAccessor } from 'domain/Filter';
import { usePageFilterApplied, usePageFilterData } from 'hooks';
import { PERFORMANCE_PAGE_NAME } from 'pages/pillars/PortfolioBrand/Performance/Performance';
import {
  getJanuaryFirstYmdFromDtEnd,
  getViewtype,
  normalizeFilters,
} from 'utils';

interface UsePnlSubFiltersParams {
  lastDataRefreshKpisDateMonthYear: { [key: string]: string | undefined };
  pageName?: string;
}

export function usePnlSubFilters({
  lastDataRefreshKpisDateMonthYear,
  pageName = PERFORMANCE_PAGE_NAME,
}: UsePnlSubFiltersParams) {
  const { applied } = usePageFilterApplied(pageName);
  const { dataFilters } = usePageFilterData(pageName);

  const dt_ini = FilterDataAccessor.getInstance().getTimeFrame(
    dataFilters,
    'ini',
  );
  const volume_dt_end = lastDataRefreshKpisDateMonthYear?.volume;
  const finance_dt_end = lastDataRefreshKpisDateMonthYear?.finance;
  const market_share_dt_end = lastDataRefreshKpisDateMonthYear?.market_share;
  const power_dt_end = lastDataRefreshKpisDateMonthYear?.power;
  const pos_dt_end = lastDataRefreshKpisDateMonthYear?.pos;
  const is_period_ytd_applied = applied?.['ytd-month'] === 'YTD';

  const normalized = normalizeFilters(applied);
  const { zone, country } = normalized;
  const viewtype = getViewtype(normalized?.country);

  if (
    !dt_ini ||
    !volume_dt_end ||
    !finance_dt_end ||
    !market_share_dt_end ||
    !power_dt_end ||
    !pos_dt_end ||
    zone == null ||
    country == null ||
    country === 'ABI'
  ) {
    return null;
  }

  const baseFilter = (filter_name: string, filter_dt_end: string) => ({
    [`viewtype_${filter_name}`]: viewtype,
    [`dt_ini_${filter_name}`]: is_period_ytd_applied
      ? getJanuaryFirstYmdFromDtEnd(filter_dt_end)
      : filter_dt_end,
    [`dt_end_${filter_name}`]: filter_dt_end,
    [`zone_${filter_name}`]: zone,
    [`country_${filter_name}`]: country,
    [`period_${filter_name}`]: applied?.['ytd-month'],
  });

  const financeFilter = baseFilter('finance', finance_dt_end);

  const marketShareFilter = baseFilter('market_share', market_share_dt_end);

  const powerFilter = baseFilter('power', power_dt_end);

  const posFilter = baseFilter('pos', pos_dt_end);

  return {
    dt_ini: is_period_ytd_applied ? dt_ini : volume_dt_end,
    output: {
      ...financeFilter,
      ...marketShareFilter,
      ...powerFilter,
      ...posFilter,
    },
  };
}
