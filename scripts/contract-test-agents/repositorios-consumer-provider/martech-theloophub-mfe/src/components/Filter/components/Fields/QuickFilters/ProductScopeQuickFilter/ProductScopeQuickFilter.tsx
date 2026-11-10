import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { Option } from 'models/Filters';

export const ProductScopeQuickFilter = ({
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
    gaCategory: 'Product Scope Select',
    filterContext: {},
    onValueChange,
    getCurrentValue,
  });

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
      valueLabel="Product Scope"
      searchable
    />
  );
};
