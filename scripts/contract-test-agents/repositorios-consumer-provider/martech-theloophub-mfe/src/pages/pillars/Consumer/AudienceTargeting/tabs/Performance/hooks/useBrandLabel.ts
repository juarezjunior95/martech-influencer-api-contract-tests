import { useMemo } from 'react';

import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { usePageFilterApplied, usePageFilterData } from 'hooks';

import { FILTER_CONFIG_PERFORMANCE } from '../../../constants';

export const useBrandLabel = (): string => {
  const { applied } = usePageFilterApplied(FILTER_CONFIG_PERFORMANCE.pageName);
  const { dataFilters } = usePageFilterData(FILTER_CONFIG_PERFORMANCE.pageName);

  return useMemo(() => {
    if (!dataFilters || !applied) return '';
    const options = FilterDataAccessor.getInstance().getOptions(
      'audience_targeting_brands',
      dataFilters,
      applied,
    ) as { value: string | null; label: string | null }[];
    const match = options.find(
      (opt) => opt.value === applied.audience_targeting_brands,
    );
    return String(match?.label ?? applied?.audience_targeting_brands ?? '');
  }, [dataFilters, applied]);
};
