import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useLastDataRefresh } from 'contexts';
import {
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterStatus,
} from 'hooks';
import type { Dispatch } from 'redux';
import { applyFilters, updateFormValue } from 'redux/slices/filters';

import { FILTER_CONFIGS, OVERVIEW_BASE_URL } from '../constants';

interface UseCategoryHealthFiltersReturn {
  applied: any;
  isGlobalZone: boolean;
  dataFilters: any;
  defaults: any;
  isLoaded: boolean;
  refreshDateLabel: string | undefined;
  handleClearAllAndNavigateOverview: () => void;
  dispatch: Dispatch;
}

export function useCategoryHealthFilters(): UseCategoryHealthFiltersReturn {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lastDataRefreshKpisFormated } = useLastDataRefresh();
  const { applied, isGlobalZone } = usePageFilterApplied(
    FILTER_CONFIGS.pageName,
  );
  const { dataFilters, defaults } = usePageFilterData(FILTER_CONFIGS.pageName);
  const { isLoaded } = usePageFilterStatus(FILTER_CONFIGS.pageName);

  const refreshDateLabel = useMemo(
    () => lastDataRefreshKpisFormated?.['category-health'],
    [lastDataRefreshKpisFormated],
  );

  const handleClearAllAndNavigateOverview = useCallback(() => {
    dispatch(updateFormValue({ key: 'zone', value: 'ABI' }));
    dispatch(updateFormValue({ key: 'country', value: 'ABI' }));
    dispatch(applyFilters());
    navigate(OVERVIEW_BASE_URL);
  }, [dispatch, navigate]);

  return {
    applied,
    isGlobalZone,
    dataFilters,
    defaults,
    isLoaded,
    refreshDateLabel,
    handleClearAllAndNavigateOverview,
    dispatch,
  };
}
