import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useLastDataRefresh } from 'contexts';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import type { KpiGroup } from 'domain/Kpi';
import {
  useCurrentPage,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterStatus,
} from 'hooks';
import { BffNormalizedData, BffResponse, BffService } from 'services';
import { createRequestKey } from 'utils/date';
import { getViewtype, normalizeFilters } from 'utils/filter';

export interface UseBffDataProps {
  id: string;
  subFilters?: Record<string, any> | null;
  kpiGroup?: KpiGroup;
  skipMainFilters?: boolean;
  skipRequest?: boolean;
}

export interface UseBffDataResponse {
  data: BffNormalizedData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export const useBffData = ({
  id,
  subFilters = null,
  kpiGroup,
  skipMainFilters = false,
  skipRequest = false,
}: UseBffDataProps): UseBffDataResponse => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const { isLoading: filtersLoading } = usePageFilterStatus(currentPage);
  const { dataFilters } = usePageFilterData(currentPage);
  const { lastDataRefreshKpisDateMonthYear } = useLastDataRefresh();

  const [data, setData] = useState<BffNormalizedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const prevRequestKey = useRef('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const dt_end = useMemo(
    () => (kpiGroup ? lastDataRefreshKpisDateMonthYear?.[kpiGroup] : null),
    [lastDataRefreshKpisDateMonthYear, kpiGroup],
  );

  const dt_ini = useMemo(
    () => FilterDataAccessor.getInstance().getTimeFrame(dataFilters, 'ini'),
    [dataFilters],
  );

  const activeFilters = useMemo(() => {
    return normalizeFilters(applied);
  }, [applied]);

  const viewtype = useMemo(
    () => getViewtype(activeFilters?.country),
    [activeFilters?.country],
  );

  const isFiltersReady = useMemo(() => {
    if (skipMainFilters) return true;
    if (!dataFilters) return false;

    if (
      activeFilters &&
      Object.values(activeFilters).some(
        (value) => value !== null && value !== undefined,
      )
    ) {
      return true;
    }

    return false;
  }, [dataFilters, activeFilters, skipMainFilters]);

  const shouldMakeRequest = useCallback(() => {
    if (skipRequest) return false;
    if (filtersLoading) return false;
    if (!isFiltersReady) return false;
    if (!id?.length) return false;

    if (!activeFilters || !Object.keys(activeFilters).length) {
      return false;
    }

    if (subFilters && Object.keys(subFilters).length === 0) return false;

    if (!dt_end) return false;

    const currentRequestKey = createRequestKey([id], {
      viewtype,
      dt_end,
      ...(skipMainFilters ? {} : activeFilters),
      ...subFilters,
    });

    if (currentRequestKey === prevRequestKey.current) return false;
    prevRequestKey.current = currentRequestKey;

    return true;
  }, [
    id,
    activeFilters,
    filtersLoading,
    subFilters,
    isFiltersReady,
    dt_end,
    viewtype,
    skipRequest,
    skipMainFilters,
  ]);

  const fetchData = useCallback(async () => {
    if (!shouldMakeRequest()) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError(null);

    const requestFilters = {
      ...(skipMainFilters ? {} : activeFilters),
      ...subFilters,
    };
    const requestParams = {
      viewtype,
      dt_ini,
      dt_end,
      ...requestFilters,
    };

    try {
      const response = await BffService.getInstance().getData({
        endpoint: `/views/${id}`,
        params: requestParams,
        signal: abortController.signal,
      });

      if (abortController.signal.aborted) return;

      if (!response || response.hasError) {
        setError(new Error(response?.message || 'Failed to load data'));
        setLoading(false);
        return;
      }

      setData(BffService.normalizeResponse(response.data as BffResponse));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err as Error);
      setLoading(false);
    }
  }, [
    activeFilters,
    subFilters,
    skipMainFilters,
    shouldMakeRequest,
    dt_end,
    dt_ini,
    viewtype,
    id,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading: loading || filtersLoading,
    error,
    refetch,
  };
};
