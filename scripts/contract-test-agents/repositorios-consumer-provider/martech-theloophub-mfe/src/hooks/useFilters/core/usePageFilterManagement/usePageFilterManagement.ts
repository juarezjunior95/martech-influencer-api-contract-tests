import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { FilterRegistry } from 'domain/Filter/FilterRegistry';
import { FilterForm, FilterValue, LoadFiltersParams } from 'models/Filters';
import {
  applyFilters,
  loadFilters,
  resetAndApplyDefaults,
  setCurrentPage,
  updateFormValue,
} from 'redux/slices/filters';
import { AppDispatch } from 'redux/types';

export const usePageFilterManagement = (pageName: string | null) => {
  const dispatch = useDispatch<AppDispatch>();

  const setPage = useCallback(
    (name: string) => {
      dispatch(setCurrentPage(name));
    },
    [dispatch],
  );

  const loadPageFilters = useCallback(
    async (params: LoadFiltersParams) => {
      if (!pageName) return;
      return dispatch(loadFilters(params));
    },
    [dispatch, pageName],
  );

  const updateForm = useCallback(
    (key: string, value: FilterValue) => {
      if (!pageName) return;
      dispatch(updateFormValue({ key, value }));
    },
    [dispatch, pageName],
  );

  const updateAllForm = useCallback(
    (form: FilterForm) => {
      if (!pageName) return;
      dispatch(resetAndApplyDefaults({ form: form }));
    },
    [dispatch, pageName],
  );

  const apply = useCallback(() => {
    if (!pageName) return;
    dispatch(applyFilters());
  }, [dispatch, pageName]);

  const resetToDefaults = useCallback(
    (defaults: Record<string, FilterValue>) => {
      if (!pageName) return;

      for (const [key, value] of Object.entries(defaults)) {
        if (FilterRegistry.getInstance().isResettable(key))
          dispatch(updateFormValue({ key, value }));
      }
    },
    [dispatch, pageName],
  );

  const resetToApplied = useCallback(
    (applied: Record<string, FilterValue>) => {
      if (!pageName) return;
      for (const [key, value] of Object.entries(applied)) {
        dispatch(updateFormValue({ key, value }));
      }
    },
    [dispatch, pageName],
  );

  return useMemo(
    () => ({
      setPage,
      loadPageFilters,
      updateForm,
      updateAllForm,
      apply,
      resetToDefaults,
      resetToApplied,
    }),
    [
      setPage,
      loadPageFilters,
      updateForm,
      updateAllForm,
      apply,
      resetToDefaults,
      resetToApplied,
    ],
  );
};
