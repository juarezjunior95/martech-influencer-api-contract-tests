import { BrandImg } from 'components/BrandImg/BrandImg';
import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { Option } from 'models/Filters';

export const BrandsAbiQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
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
    gaCategory: 'Brand ABI Select',
    filterContext: { country: countryValue },
    onValueChange,
    getCurrentValue,
  });

  const getChipPlaceholder = (options: Option | Option[]) => {
    const option = Array.isArray(options) ? options[0] : options;
    return (
      <BrandImg
        src={option?.image_url || ''}
        alt={String(option?.label || option?.value || '')}
        dataTestId={dataTestId ? `${dataTestId}-brand-img` : undefined}
        width="16px"
        height="16px"
      />
    );
  };

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
      valueLabel="Brand ABI"
      getChipPlaceholder={getChipPlaceholder}
      searchable
    />
  );
};
