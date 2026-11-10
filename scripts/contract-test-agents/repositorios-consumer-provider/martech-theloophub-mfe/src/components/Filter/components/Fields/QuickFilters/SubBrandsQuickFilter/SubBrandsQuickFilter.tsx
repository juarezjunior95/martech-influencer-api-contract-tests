import { BrandImg } from 'components/BrandImg/BrandImg';
import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { usePageFilterManagement } from 'hooks';
import { Option } from 'models/Filters';

export const SubBrandsQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const countryValue = getCurrentValue('country');
  const brandValue = getCurrentValue('brands');

  const { options, currentValue, handleValueChange, defaults } = useQuickFilter(
    {
      fieldKey,
      pageName,
      gaCategory: 'Sub Brand Select',
      filterContext: { country: countryValue, brands: brandValue },
      onValueChange,
      getCurrentValue,
    },
  );

  const { updateForm, apply } = usePageFilterManagement(pageName);

  const handleClear = () => {
    const firstOption = options[0]?.value;
    updateForm(fieldKey, firstOption || defaults?.[fieldKey]);
    apply();
  };

  const firstOptionValue = options[0]?.value;
  const showClearIcon = currentValue !== firstOptionValue;

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
      valueLabel="Sub-Brand"
      getChipPlaceholder={getChipPlaceholder}
      searchable
    />
  );
};
