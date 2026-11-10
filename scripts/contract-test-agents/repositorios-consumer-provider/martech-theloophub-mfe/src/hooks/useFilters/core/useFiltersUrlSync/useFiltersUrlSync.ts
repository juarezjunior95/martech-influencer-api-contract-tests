import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { FilterRegistry } from 'domain/Filter';
import { useCurrentPage, usePageFilterData, usePageFilterStatus } from 'hooks';
import {
  applyFilters,
  setFilterVisibility,
  updateFormValue,
} from 'redux/slices/filters';
import { AppDispatch, RootState } from 'redux/types';

export const useFiltersUrlSync = (isHidden = false, pageName?: string) => {
  const { currentPage } = useCurrentPage();
  const { status } = usePageFilterStatus(currentPage);
  const { dataFilters, defaults } = usePageFilterData(currentPage);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const hasReadFromUrl = useRef(false);
  const lastSyncedUrl = useRef<string>('');
  const rawData = useSelector((state: RootState) =>
    currentPage ? state.filters.pages[currentPage]?.rawData : null,
  );

  /**
   * useEffect 1: Set filter visibility in Redux
   *
   * Responsible for informing Redux whether the current page's filters should be visible (isHidden).
   * This information is used by the middleware to decide whether to sync filters in the URL.
   *
   * Cleanup: When the component unmounts, resets isHidden to false.
   *
   * Dependencies: [currentPage, isHidden, dispatch]
   */
  useEffect(() => {
    if (status !== 'loaded') {
      return;
    }
    if (currentPage && currentPage === pageName) {
      dispatch(setFilterVisibility({ page: currentPage, isHidden }));
    }
    return () => {
      dispatch(setFilterVisibility({ page: currentPage, isHidden: false }));
    };
  }, [status, currentPage, pageName, isHidden, dispatch]);

  /**
   * useEffect 2: Read filters from URL and apply to Redux (URL → Redux)
   *
   * Responsible for reading filters from the URL when the page loads and applying them to Redux.
   *
   * Flow:
   * 1. Check guards (already read from URL, page loaded, filters available)
   * 2. If isHidden=true, just mark as read and return (don't read from URL)
   * 3. Extract filter_* parameters from URL
   * 4. Validate filters using FilterRegistry.validateUrlFilters
   * 5. Filter out null/undefined/empty values
   * 6. Apply valid filters to Redux via updateFormValue + applyFilters
   *
   * Note: Redux → URL synchronization is handled by the middleware, not this hook.
   *
   * Dependencies: [currentPage, status, dataFilters, defaults, isHidden, searchParams, dispatch]
   */
  useEffect(() => {
    // check if hasReadFromUrl is true
    if (hasReadFromUrl.current) {
      return;
    }
    // check if currentPage is loaded
    if (!currentPage || status !== 'loaded') {
      return;
    }
    // wait for the correct page to be set before reading URL
    if (pageName && currentPage !== pageName) {
      return;
    }
    // check if dataFilters is empty
    if (!dataFilters || Object.keys(dataFilters).length === 0) {
      return;
    }
    // check if filter is hidden
    if (isHidden) {
      hasReadFromUrl.current = true;
      return;
    }

    // Check if searchParams has any key starting with "filter_"
    const hasFilterParams = Array.from(searchParams.keys()).some((key) =>
      key.startsWith('filter_'),
    );

    if (hasFilterParams) {
      const urlFilterKeys = FilterRegistry.extractFiltersFromUrl(searchParams);
      const validatedFilters = FilterRegistry.validateUrlFilters(
        searchParams,
        dataFilters as Record<string, unknown>,
        defaults || {},
        rawData,
      );

      const filtersToApply = Object.entries(validatedFilters).reduce(
        (acc, [key, value]) => {
          if (key in urlFilterKeys && value != null && value !== '') {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      if (Object.keys(filtersToApply).length > 0) {
        const orderedKeys = FilterRegistry.getInstance().getOrderedKeys();
        orderedKeys.forEach((key) => {
          if (key in filtersToApply) {
            dispatch(updateFormValue({ key, value: filtersToApply[key] }));
          }
        });

        dispatch(applyFilters());
        lastSyncedUrl.current = searchParams.toString();
      }
    } else {
      dispatch(applyFilters());
    }

    hasReadFromUrl.current = true;
  }, [
    currentPage,
    status,
    dataFilters,
    defaults,
    isHidden,
    searchParams,
    dispatch,
    rawData,
    pageName,
  ]);
};
