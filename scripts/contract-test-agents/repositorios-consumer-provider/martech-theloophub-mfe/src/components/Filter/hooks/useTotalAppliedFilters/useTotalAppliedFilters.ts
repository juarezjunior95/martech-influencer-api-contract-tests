import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { usePageFilterData } from 'hooks';
import { selectPage } from 'redux/slices/filters/selectors';

const EXCLUDED_COUNTER_FILTERS = ['time_frame'];

interface UseTotalAppliedFiltersReturn {
  totalAppliedFilters: number;
  totalFixedAppliedFilters: number;
}

export const useTotalAppliedFilters = (
  pageName: string,
  excludeKeys: string[] = EXCLUDED_COUNTER_FILTERS,
): UseTotalAppliedFiltersReturn => {
  const pageData = useSelector(pageName ? selectPage(pageName) : () => null);
  const { defaults } = usePageFilterData(pageName);

  const filters = pageData?.form || pageData?.applied || {};
  const appliedFilters = pageData?.applied || {};

  const calculateTotal = useMemo(() => {
    return (filterData: Record<string, any>) => {
      if (!filterData || !defaults) {
        return 0;
      }

      return Object.entries(filterData).reduce((count, [key, value]) => {
        if (excludeKeys.includes(key)) {
          return count;
        }

        const defaultValue = defaults[key];
        const isDefault =
          value == null ||
          value === '' ||
          value === 'All' ||
          value === defaultValue;

        if (isDefault) {
          return count;
        }

        return count + 1;
      }, 0);
    };
  }, [defaults, excludeKeys]);

  const totalAppliedFilters = useMemo(() => {
    return calculateTotal(filters);
  }, [filters, calculateTotal]);

  const totalFixedAppliedFilters = useMemo(() => {
    return calculateTotal(appliedFilters);
  }, [appliedFilters, calculateTotal]);

  return { totalAppliedFilters, totalFixedAppliedFilters };
};
