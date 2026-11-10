import { useMemo } from 'react';

import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

import { useQuickFilterReset } from '../useQuickFilterReset';

interface UseQuickFilterConfig {
  fieldKey: string;
  pageName: string;
  gaCategory: string;
  filterContext?: Record<string, any>;
  onValueChange: (fieldKey: string, option: Option) => void;
  getCurrentValue: (key: string) => any;
}

export const useQuickFilter = ({
  fieldKey,
  pageName,
  gaCategory,
  filterContext = {},
  onValueChange,
  getCurrentValue,
}: UseQuickFilterConfig) => {
  const trackGA = useGoogleAnalytics();
  const { defaults, appliedDataFilters } = usePageFilterData(pageName);

  const options: Option[] = useMemo(() => {
    if (fieldKey === 'country') {
      return FilterDataAccessor.getInstance().getCountryOptions(
        appliedDataFilters,
      );
    }

    return FilterDataAccessor.getInstance().getOptions(
      fieldKey,
      appliedDataFilters,
      filterContext,
    ) as Option[];
  }, [fieldKey, appliedDataFilters, ...Object.values(filterContext)]);

  const handleValueChange = (op: Option) => {
    if (!op?.value) return;

    trackGA({
      event_category: gaCategory,
      event_action: 'Select',
      event_label: op?.value as string,
    });
    onValueChange(fieldKey, op);
  };

  const { handleClear } = useQuickFilterReset(pageName, fieldKey);
  const currentValue = getCurrentValue(fieldKey);
  const showClearIcon = currentValue !== defaults?.[fieldKey];

  return {
    options,
    currentValue,
    handleValueChange,
    handleClear,
    showClearIcon,
    dataFilters: appliedDataFilters,
    defaults,
  };
};
