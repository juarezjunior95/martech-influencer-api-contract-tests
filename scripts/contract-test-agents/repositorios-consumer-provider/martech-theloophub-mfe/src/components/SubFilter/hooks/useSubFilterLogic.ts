import { useCallback, useEffect, useMemo, useRef } from 'react';

import { SegmentedControlOptions } from '@hexa-ui/components';
import {
  useCurrentPage,
  useGoogleAnalytics,
  usePageFilterApplied,
} from 'hooks';
import { useSubFilters } from 'hooks/useSubFilters/useSubFilters';
import { FilterOption, FilterValue, Option } from 'models/Filters';

type GroupBy = {
  filterKey: string;
};

export interface UseSubFilterLogicProps {
  name?: string;
  apiKey: string;
  stateKey: string;
  params?: Record<string, any>;
  groupBy?: GroupBy;
  iconsByValue?: Record<string, React.ReactNode>;
  allKey?: string;
  contextKey?: string;
  dataApiKey?: string;
  onValueChange?: (value: string) => void;
}

export const useSubFilterLogic = ({
  name,
  apiKey,
  stateKey,
  params,
  contextKey,
  groupBy,
  iconsByValue,
  allKey,
  onValueChange,
  dataApiKey,
}: UseSubFilterLogicProps) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const {
    activeSubFilters,
    subFiltersData,
    disabledFields,
    subFiltersInUse,
    subFiltersLoaded,
    loadSubFilterData,
    setSubFilterValue,
    hiddenSubFilters,
    ALL_VALUE,
  } = useSubFilters();
  const allKeyValue = allKey ?? ALL_VALUE;
  const trackGA = useGoogleAnalytics();

  const groupKey = groupBy?.filterKey;
  const groupValue = applied?.[groupKey];

  const useKey = dataApiKey || apiKey;
  const filterData = subFiltersData[useKey] || null;

  const options:
    Array<Option> | Array<FilterOption> | SegmentedControlOptions[] =
    useMemo(() => {
      if (contextKey) {
        const contextData = filterData?.values?.[contextKey];
        const contextValues = contextData?.values || contextData || [];
        return (
          (contextValues.map((opt) => ({
            value: opt.value,
            label: opt.label,
            icon: iconsByValue?.[opt.value],
          })) as Option[]) || []
        );
      }

      if (groupKey) {
        const groupValues = groupValue
          ? filterData?.values?.[groupValue]?.values ||
            filterData?.values?.[groupValue]?.brands ||
            []
          : [];

        return groupValues;
      }

      if (filterData?.values?.[0]?.group !== undefined) {
        return filterData.values;
      }

      return (
        (filterData?.values.map((opt) => ({
          value: opt.value,
          label: opt.label,
          icon: iconsByValue?.[opt.value],
        })) as Option[]) || []
      );
    }, [contextKey, groupKey, groupValue, filterData, iconsByValue]);

  const defaultOption = useMemo(() => {
    if (contextKey) {
      const contextData = filterData?.values?.[contextKey];
      return contextData?.default?.value || allKeyValue;
    }

    if (groupKey) {
      return groupValue
        ? filterData?.values?.[groupValue]?.default?.value || allKeyValue
        : allKeyValue;
    }

    return filterData?.default?.value || allKeyValue;
  }, [filterData, groupKey, groupValue, allKeyValue, contextKey]);

  const currentValue = useMemo<FilterValue>(() => {
    return activeSubFilters[stateKey] || defaultOption;
  }, [activeSubFilters, stateKey, defaultOption]);

  const isDisabled = useMemo(() => {
    return options?.length === 0 || disabledFields?.includes(stateKey);
  }, [disabledFields, options, stateKey]);

  const isInUse = useMemo(() => {
    return subFiltersInUse?.[stateKey] || false;
  }, [subFiltersInUse, stateKey]);

  const isHidden = useMemo(() => {
    return hiddenSubFilters?.[stateKey] || false;
  }, [hiddenSubFilters, stateKey]);

  const isLoaded = useMemo(() => {
    return subFiltersLoaded?.[stateKey] || false;
  }, [subFiltersLoaded, stateKey]);

  const handleGAEvent = useCallback(
    (event: string, action: string, label: string) => {
      if (!label) return;

      try {
        trackGA({
          event_category: event,
          event_action: action,
          event_label: label,
        });
      } catch (error) {
        console.error('Failed to track Google Analytics event:', error);
      }
    },
    [trackGA],
  );

  const handleOnChange = useCallback(
    (op: Option | string) => {
      const value = typeof op === 'string' ? op : op.value;
      if (
        name === 'groupBy' ||
        name === 'subBreakdown' ||
        name === 'performanceBreakdown' ||
        name === 'kpis'
      ) {
        handleGAEvent('Filter', 'Select', value as string);
      }
      setSubFilterValue(stateKey, value as string);
      if (onValueChange) {
        onValueChange(value as string);
      }
    },
    [setSubFilterValue, stateKey, onValueChange],
  );

  const prevContextKeyRef = useRef(contextKey);

  useEffect(() => {
    if (contextKey && prevContextKeyRef.current !== contextKey) {
      prevContextKeyRef.current = contextKey;
      if (options.length > 0) {
        setSubFilterValue(stateKey, defaultOption);
      }
    }
  }, [contextKey, options, defaultOption, stateKey, setSubFilterValue]);

  useEffect(() => {
    const valueIsOnOptions = options.some((filterOption) => {
      if (filterOption?.group) {
        return filterOption.values.some(
          (groupItem) => groupItem.value === currentValue,
        );
      }
      return filterOption.value === currentValue;
    });

    const hasNoActiveValue = !activeSubFilters[stateKey];

    if (options.length > 0 && (!valueIsOnOptions || hasNoActiveValue)) {
      setSubFilterValue(stateKey, defaultOption);
    }
  }, [options, setSubFilterValue, stateKey, defaultOption, currentValue]);

  const paramsString = useMemo(() => {
    if (!params) return '';
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }, [params]);

  useEffect(() => {
    loadSubFilterData(apiKey, params, stateKey);
  }, [apiKey, stateKey, loadSubFilterData, paramsString]);

  return {
    options,
    currentValue,
    isDisabled,
    isInUse,
    isHidden,
    isLoaded,
    stateKey,
    handleOnChange,
  };
};
