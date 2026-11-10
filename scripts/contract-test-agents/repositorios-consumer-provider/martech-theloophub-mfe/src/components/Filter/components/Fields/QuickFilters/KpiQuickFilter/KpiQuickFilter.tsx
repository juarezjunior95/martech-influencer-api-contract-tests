import { useMemo } from 'react';

import { useKpiFeatureToggles } from 'components/Filter/hooks';
import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { Option } from 'models/Filters';

export const KPIQuickFilter = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const { filterOptionsByFeatureToggle } = useKpiFeatureToggles();

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

  const filteredOptions = useMemo(
    () => filterOptionsByFeatureToggle(options),
    [options, filterOptionsByFeatureToggle],
  );

  return (
    <Select
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
      valueLabel="KPI"
      searchable
    />
  );
};
