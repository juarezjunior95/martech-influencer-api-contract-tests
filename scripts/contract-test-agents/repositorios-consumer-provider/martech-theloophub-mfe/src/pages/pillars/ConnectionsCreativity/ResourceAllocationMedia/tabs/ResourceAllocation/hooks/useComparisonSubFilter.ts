import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { usePageFilterApplied } from 'hooks';
import { FilterOption, FilterValue } from 'models/Filters';

import { RESOURCE_ALLOCATION_MEDIA_PAGE_NAME } from '../../../ResourceAllocationMedia';
import { ComparisonFilterItem } from '../types';

export interface UseComparisonSubFilterParams {
  filterData: ComparisonFilterItem[] | undefined;
}

export interface UseComparisonSubFilterResult {
  options: FilterOption[];
  selectedValues: string[];
  allValues: string[];
  handleChange: (values: string[]) => void;
  isInitialized: boolean;
  isUserSelection: boolean;
}

export const useComparisonSubFilter = ({
  filterData,
}: UseComparisonSubFilterParams): UseComparisonSubFilterResult => {
  const { applied } = usePageFilterApplied(RESOURCE_ALLOCATION_MEDIA_PAGE_NAME);
  const appliedCountry = applied?.country;

  const [userSelection, setUserSelection] = useState<string[] | null>(null);
  const prevCountryRef = useRef<FilterValue | undefined>(undefined);

  useEffect(() => {
    if (appliedCountry !== prevCountryRef.current) {
      prevCountryRef.current = appliedCountry;
      setUserSelection(null);
    }
  }, [appliedCountry]);

  const options = useMemo<FilterOption[]>(() => {
    if (!Array.isArray(filterData) || filterData.length === 0) return [];
    return [
      {
        group: '',
        values: filterData.map((item) => ({
          value: item.value,
          label: item.label,
        })),
      },
    ];
  }, [filterData]);

  const allValues = useMemo(
    () =>
      options.flatMap((group) => group.values.map((opt) => String(opt.value))),
    [options],
  );

  const selectedValues = userSelection ?? allValues;

  const handleChange = useCallback((values: string[]) => {
    setUserSelection(values);
  }, []);

  return {
    options,
    selectedValues,
    allValues,
    handleChange,
    isInitialized: allValues.length > 0,
    isUserSelection: userSelection !== null,
  };
};
