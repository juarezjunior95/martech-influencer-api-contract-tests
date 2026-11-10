import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { FilterStatus } from 'models/Filters';
import {
  selectIsPageError,
  selectIsPageLoaded,
  selectIsPageLoading,
  selectPageStatus,
} from 'redux/slices/filters/selectors';

export const usePageFilterStatus = (pageName: string | null) => {
  const status: FilterStatus = useSelector(
    pageName ? selectPageStatus(pageName) : () => 'idle',
  ) as FilterStatus;
  const isLoading = useSelector(
    pageName ? selectIsPageLoading(pageName) : () => false,
  ) as boolean;
  const isLoaded = useSelector(
    pageName ? selectIsPageLoaded(pageName) : () => false,
  ) as boolean;
  const isError = useSelector(
    pageName ? selectIsPageError(pageName) : () => false,
  ) as boolean;

  return useMemo(
    () => ({
      status,
      isLoading,
      isLoaded,
      isError,
    }),
    [status, isLoading, isLoaded, isError],
  );
};
