import { useMemo } from 'react';

import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const YearsQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const { handleClear } = useQuickFilter({
    fieldKey,
    pageName,
    gaCategory: 'Years Select',
    onValueChange,
    getCurrentValue,
  });
  const currentValue = getCurrentValue(fieldKey);
  const { defaults } = usePageFilterData(pageName);
  const showClearIcon = currentValue !== defaults?.years;

  const options: Option[] = useMemo(
    () =>
      (
        FilterDataAccessor.getInstance().getOptions(
          fieldKey,
          dataFilters,
          {},
        ) as Option[]
      ).map((op) => ({
        value: op.value,
        label: op.label,
      })),
    [fieldKey, dataFilters],
  );

  const handleValueChange = (op: Option) => {
    if (!op?.value) return;

    trackGA({
      event_category: 'Years Select',
      event_action: 'Select',
      event_label: op?.value as string,
    });
    onValueChange(fieldKey, op);
  };

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select-quick-filter`}
      value={getCurrentValue(fieldKey)}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      size="medium"
      shape="pill"
      placeholder="Select year"
      chips
      clearChips={showClearIcon}
      onClearSingle={handleClear}
      valueLabel="Time Frame"
      searchable={false}
    />
  );
};
