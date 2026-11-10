import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { usePageFilterManagement } from 'hooks';
import { Option } from 'models/Filters';

export const AudienceTargetingBrandsCompQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const countryValue = getCurrentValue('country');
  const audienceTargetingBrandsValue = getCurrentValue(
    'audience_targeting_brands',
  );

  const { options, currentValue, handleValueChange, defaults } = useQuickFilter(
    {
      fieldKey,
      pageName,
      gaCategory: 'Brand Competitor Select',
      filterContext: {
        country: countryValue,
        audience_targeting_brands: audienceTargetingBrandsValue,
      },
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
      valueLabel="Competitor"
      searchable
    />
  );
};
