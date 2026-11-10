import { useMemo } from 'react';

import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { Option } from 'models/Filters';

export const BrandPowerBookScopesQuickFilter = ({
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
    gaCategory: 'Scope Select',
    filterContext: {},
    onValueChange,
    getCurrentValue,
  });

  const filteredOptions = useMemo(() => {
    if (getCurrentValue('zone') !== 'ABI') {
      return options.filter((option) => option.value !== 'global_brands');
    }
    return options;
  }, [options, getCurrentValue]);

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select-quick-filter`}
      value={currentValue}
      options={filteredOptions}
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
      valueLabel="Scope"
      searchable
    />
  );
};
