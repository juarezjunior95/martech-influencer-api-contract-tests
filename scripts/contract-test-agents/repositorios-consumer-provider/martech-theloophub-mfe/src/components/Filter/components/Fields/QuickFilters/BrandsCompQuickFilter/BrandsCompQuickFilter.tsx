import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { Option } from 'models/Filters';

export const BrandsCompQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const countryValue = getCurrentValue('country');

  const { options, handleValueChange, handleClear, showClearIcon } =
    useQuickFilter({
      fieldKey,
      pageName,
      gaCategory: 'Brand Competitor Select',
      filterContext: { country: countryValue },
      onValueChange,
      getCurrentValue,
    });

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
      placeholder={`Select ${fieldKey}`}
      chips
      clearChips={showClearIcon}
      onClearSingle={handleClear}
      valueLabel="Competitor"
      searchable
    />
  );
};
