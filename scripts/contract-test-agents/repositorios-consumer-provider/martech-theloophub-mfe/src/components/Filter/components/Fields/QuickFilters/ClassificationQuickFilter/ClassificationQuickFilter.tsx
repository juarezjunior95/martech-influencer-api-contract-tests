import { useMemo } from 'react';

import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { Select } from 'components/Form';
import { Option } from 'models/Filters';

export const ClassificationQuickFilter = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}) => {
  const countryValue = getCurrentValue('country');

  const {
    options,
    currentValue,
    handleValueChange,
    handleClear,
    showClearIcon,
  } = useQuickFilter({
    fieldKey,
    pageName,
    gaCategory: 'Classification Select',
    filterContext: { country: countryValue },
    onValueChange,
    getCurrentValue,
  });

  const filteredOptions = useMemo(() => {
    if (fieldKey === 'brand_filter_groupings') {
      return options.filter((opt) => opt.value === currentValue);
    }
    return options;
  }, [options, currentValue, fieldKey]);

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
      valueLabel="Classification"
      searchable
    />
  );
};
