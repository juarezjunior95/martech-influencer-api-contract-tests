import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  hideSubFilters,
  setDefaultValues,
  setSubFiltersData,
  setSubFiltersLoaded,
  setSubFilterValue as setSubFilterValueStore,
  toggleDisabledField as toggleDisabledFieldStore,
  toggleSubFiltersInUse,
} from 'redux/slices/subFilters';
import { RootState } from 'redux/types';
import { BffService } from 'services';

const ALL_VALUE = 'All';

export const useSubFilters = () => {
  const dispatch = useDispatch();
  const {
    activeSubFilters,
    subFiltersData,
    disabledFields,
    subFiltersInUse,
    subFiltersLoaded,
    hiddenSubFilters,
  } = useSelector((state: RootState) => state.subFilters);

  const loadSubFilterData = useCallback(
    (subFilterKey: string, params = {}, stateKey = '') => {
      const stateKeyToUse = stateKey || subFilterKey;
      dispatch(setSubFiltersLoaded({ keys: [stateKeyToUse], state: false }));

      BffService.getInstance()
        .getData({
          endpoint: `/presets/sub-filters_${subFilterKey}`,
          params,
        })
        .then((res) => {
          const data = res?.data?.data;
          if (!data) return;
          dispatch(setSubFiltersData(data));
          dispatch(setDefaultValues(data));
          dispatch(setSubFiltersLoaded({ keys: [stateKeyToUse], state: true }));
        })
        .catch(() => {
          dispatch(setSubFiltersData(null));
          dispatch(setDefaultValues(null));
          dispatch(setSubFiltersLoaded({ keys: [stateKeyToUse], state: true }));
        });
    },
    [dispatch],
  );

  const setSubFilterValue = useCallback(
    (subFilterKey: string, value: string) => {
      dispatch(setSubFilterValueStore({ key: subFilterKey, value }));
    },
    [dispatch],
  );

  const setSubFilterInUse = useCallback(
    (subFilterKey: string, inUse: boolean) => {
      dispatch(toggleSubFiltersInUse({ keys: [subFilterKey], state: inUse }));
    },
    [dispatch],
  );

  const toggleDisabledField = useCallback(
    (fieldKey: string) => {
      dispatch(toggleDisabledFieldStore(fieldKey));
    },
    [dispatch],
  );

  const hideFields = useCallback(
    (fieldKey: string, hidden: boolean) => {
      dispatch(hideSubFilters({ keys: [fieldKey], state: hidden }));
    },
    [dispatch],
  );

  return {
    activeSubFilters,
    subFiltersData,
    disabledFields,
    subFiltersInUse,
    subFiltersLoaded,
    loadSubFilterData,
    setSubFilterValue,
    setSubFilterInUse,
    hideSubFilters,
    toggleDisabledField,
    hideFields,
    hiddenSubFilters,
    ALL_VALUE,
    setSubFiltersData: (data: any) => {
      dispatch(setSubFiltersData(data));
    },
    setSubFiltersLoaded: (keys: string[], state: boolean) => {
      dispatch(setSubFiltersLoaded({ keys, state }));
    },
  };
};
