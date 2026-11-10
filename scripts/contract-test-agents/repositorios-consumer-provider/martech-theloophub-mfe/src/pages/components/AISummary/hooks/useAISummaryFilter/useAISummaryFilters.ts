import { useMemo } from 'react';

import { usePageFilterApplied } from 'hooks';

import { AISummaryFiltersParams } from '../../types';

export const useAISummaryFilters = ({
  pageName,
  summaryPageIdentifier,
  subFilters,
}: AISummaryFiltersParams) => {
  const { applied } = usePageFilterApplied(pageName);
  const validSubFilters = Boolean(
    !subFilters || Object.keys(subFilters).length > 0,
  );

  const hasAppliedFilters = Boolean(applied && Object.keys(applied).length > 0);

  const mainFilters = useMemo(() => {
    if (!applied) return {};

    return {
      timeframe: applied.time_frame,
      timeperiod: applied.pos_periods,
      country: applied.country,
      period: applied?.['ytd-month'],
    };
  }, [applied]);

  const filters = useMemo(
    () => ({
      ...mainFilters,
      ...subFilters,
      page: summaryPageIdentifier,
      dt_end: null,
      dt_ini: null,
    }),
    [mainFilters, subFilters, summaryPageIdentifier],
  );

  return {
    filters,
    hasAppliedFilters,
    validSubFilters,
  };
};
