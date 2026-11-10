import { useMemo } from 'react';

import { useLastDataRefresh } from 'contexts/LastDataRefresh/LastDataRefresh';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useBffData, usePageFilterApplied, usePageFilterData } from 'hooks';
import {
  getJanuaryFirstYmdFromDtEnd,
  getViewtype,
  normalizeFilters,
} from 'utils';

import { VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME } from '../../VolumePagesCountryPpr';

export interface UseVolumePprPortfolioPerformanceSlideDataResult {
  portfolioPerformanceSlideData: ReturnType<typeof useBffData>;
  sectionLoading: boolean;
}

export const useVolumePprPortfolioPerformanceSlideData = (
  zoneValue: string | undefined,
): UseVolumePprPortfolioPerformanceSlideDataResult => {
  const { applied } = usePageFilterApplied(VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME);
  const { lastDataRefreshKpisDateMonthYear } = useLastDataRefresh();
  const { dataFilters } = usePageFilterData(VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME);
  const overviewSubFilters = useMemo(() => {
    const dt_ini = FilterDataAccessor.getInstance().getTimeFrame(
      dataFilters,
      'ini',
    );
    const volume_dt_end = lastDataRefreshKpisDateMonthYear?.volume;
    const finance_dt_end = lastDataRefreshKpisDateMonthYear?.finance;
    const market_share_dt_end = lastDataRefreshKpisDateMonthYear?.market_share;
    const power_dt_end = lastDataRefreshKpisDateMonthYear?.power;
    const pos_dt_end = lastDataRefreshKpisDateMonthYear?.pos;

    const normalized = normalizeFilters(applied);
    const { zone, country } = normalized;
    const viewtype = getViewtype(normalized?.country);

    if (!dt_ini || !volume_dt_end || zone == null || country == null) {
      return null;
    }

    const baseFilter = {
      viewtype,
      dt_ini: getJanuaryFirstYmdFromDtEnd(finance_dt_end),
      dt_end: finance_dt_end,
      zone,
      country,
      period: 'YTD',
    };

    const marketShareFilter = {
      ...baseFilter,
      dt_ini: getJanuaryFirstYmdFromDtEnd(market_share_dt_end),
      dt_end: market_share_dt_end,
    };

    const powerFilter = {
      ...baseFilter,
      dt_ini: getJanuaryFirstYmdFromDtEnd(power_dt_end),
      dt_end: power_dt_end,
    };

    const posFilter = {
      ...baseFilter,
      dt_ini: getJanuaryFirstYmdFromDtEnd(pos_dt_end),
      dt_end: pos_dt_end,
    };

    return {
      dt_ini,
      finance: baseFilter,
      market_share: marketShareFilter,
      power: powerFilter,
      pos: posFilter,
    };
  }, [applied, dataFilters, lastDataRefreshKpisDateMonthYear]);

  const portfolioPerformanceSlideData = useBffData({
    id: 'value-creation_portfolio-performance_overview_overview',
    kpiGroup: 'volume',
    subFilters: {
      ...overviewSubFilters,
    },
  });

  return {
    portfolioPerformanceSlideData,
    sectionLoading: portfolioPerformanceSlideData.loading,
  };
};
