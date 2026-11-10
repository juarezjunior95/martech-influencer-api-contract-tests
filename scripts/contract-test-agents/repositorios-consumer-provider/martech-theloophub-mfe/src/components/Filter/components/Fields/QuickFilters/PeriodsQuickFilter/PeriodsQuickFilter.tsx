import { useMemo } from 'react';

import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { Option } from 'models/Filters';

export const PeriodsQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const {
    options,
    currentValue,
    handleValueChange,
    handleClear,
    showClearIcon,
  } = useQuickFilter({
    fieldKey,
    pageName,
    gaCategory: 'KPI Select',
    filterContext: {},
    onValueChange,
    getCurrentValue,
  });
  const isDisabled = useMemo(() => options.length === 1, [options]);

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select-quick-filter`}
      value={currentValue}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      size="medium"
      shape="pill"
      placeholder={`Select ${fieldKey}`}
      chips
      clearChips={showClearIcon}
      onClearSingle={handleClear}
      valueLabel="Time Frame"
      searchable
      disabled={isDisabled}
    />
  );
};
