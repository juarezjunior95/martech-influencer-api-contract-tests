import { useMemo } from 'react';

import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const SegmentsQuickFilter = ({
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
    gaCategory: 'Segments Select',
    onValueChange,
    getCurrentValue,
  });
  const currentValue = getCurrentValue(fieldKey);
  const { defaults } = usePageFilterData(pageName);
  const showClearIcon = currentValue !== defaults?.segments;

  const options: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(
        fieldKey,
        dataFilters,
        {},
      ) as Option[],
    [fieldKey, dataFilters],
  );

  const handleValueChange = (op: Option) => {
    if (!op?.value) return;

    trackGA({
      event_category: 'Segments Select',
      event_action: 'Select',
      event_label: op?.value as string,
    });
    onValueChange(fieldKey, op);
  };

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
      placeholder="Select product type"
      chips
      clearChips={showClearIcon}
      onClearSingle={handleClear}
      valueLabel="Product Type"
      searchable={false}
    />
  );
};
