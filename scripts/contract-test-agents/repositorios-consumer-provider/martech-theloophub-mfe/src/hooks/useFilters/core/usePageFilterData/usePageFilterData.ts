import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FilterDataStructure, FilterForm, FilterPage } from 'models/Filters';
import {
  selectPage,
  selectPageDataFilters,
  selectPageDataFiltersFromApplied,
  selectPageDefaults,
  selectPageRawData,
  selectPageVisibleFields,
} from 'redux/slices/filters/selectors';

export const usePageFilterData = (
  pageName: string | null,
  visibleFields?: string[],
) => {
  const pageData: FilterPage = useSelector(
    pageName ? selectPage(pageName) : () => null,
  );
  const dataFilters: FilterDataStructure = useSelector(
    pageName ? selectPageDataFilters(pageName) : () => ({}),
  ) as FilterDataStructure;
  const defaults: FilterForm = useSelector(
    pageName ? selectPageDefaults(pageName) : () => ({}),
  ) as FilterForm;
  const availableFields: string[] = useSelector(
    pageName ? selectPageVisibleFields(pageName, visibleFields) : () => [],
  );
  const appliedDataFilters = useSelector(
    selectPageDataFiltersFromApplied(pageName),
  );
  const rawData = useSelector(
    pageName ? selectPageRawData(pageName) : () => ({}),
  );
  return useMemo(
    () => ({
      pageData,
      dataFilters,
      defaults,
      availableFields,
      appliedDataFilters,
      rawData,
    }),
    [
      pageData,
      dataFilters,
      defaults,
      availableFields,
      appliedDataFilters,
      rawData,
    ],
  );
};
