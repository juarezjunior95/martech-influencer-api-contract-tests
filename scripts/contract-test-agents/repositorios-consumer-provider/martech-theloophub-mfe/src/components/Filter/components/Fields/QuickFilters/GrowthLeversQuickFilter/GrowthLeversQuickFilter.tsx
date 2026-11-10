import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { Select } from 'components/Form';
import { Option } from 'models/Filters';

export const GrowthLeversQuickFilter = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}) => {
  const countryValue = getCurrentValue('country');
  const zoneValue = getCurrentValue('zone');

  const {
    options,
    currentValue,
    handleValueChange,
    handleClear,
    showClearIcon,
  } = useQuickFilter({
    fieldKey,
    pageName,
    gaCategory: 'Growth Levers Select',
    filterContext: { country: countryValue, zone: zoneValue },
    onValueChange,
    getCurrentValue,
  });

  return (
    <Select
      id={`${fieldKey}-select-quick-filter`}
      value={currentValue}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      size="medium"
      shape="pill"
      placeholder=""
      chips
      clearChips={showClearIcon}
      onClearSingle={handleClear}
      valueLabel="Growth Levers"
      searchable
    />
  );
};
