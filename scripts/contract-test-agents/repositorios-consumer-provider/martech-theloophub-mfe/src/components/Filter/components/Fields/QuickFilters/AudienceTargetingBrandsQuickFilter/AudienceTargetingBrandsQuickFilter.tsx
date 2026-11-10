import { BrandImg } from 'components/BrandImg';
import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import {
  getDynamicResetContext,
  getFiltersToReset,
  hasDynamicDefault,
} from 'components/Filter/utils/filterDependencies';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { usePageFilterData, usePageFilterManagement } from 'hooks';
import { Option } from 'models/Filters';

export const AudienceTargetingBrandsQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const { defaults } = usePageFilterData(pageName);
  const { updateForm, apply } = usePageFilterManagement(pageName);
  const countryValue = getCurrentValue('country');

  const { options, currentValue, handleValueChange, dataFilters } =
    useQuickFilter({
      fieldKey,
      pageName,
      gaCategory: 'Brand Select',
      filterContext: { country: countryValue },
      onValueChange,
      getCurrentValue,
    });
  const getChipPlaceholder = (options: Option | Option[]) => {
    const option = Array.isArray(options) ? options[0] : options;
    if (!option?.image_url) return null;

    return (
      <BrandImg
        src={option.image_url}
        alt={String(option.label || option.value || '')}
        dataTestId={dataTestId ? `${dataTestId}-brand-img` : undefined}
        width="16px"
        height="16px"
      />
    );
  };

  const handleClear = () => {
    const filtersToReset = getFiltersToReset(fieldKey);
    const currentCountry = getCurrentValue('country');
    const currentCountryOptions = FilterDataAccessor.getInstance().getOptions(
      fieldKey,
      dataFilters,
      { country: currentCountry },
    ) as Option[];
    const firstBrandFromCurrent = currentCountryOptions[0]?.value;
    const contextValues: Record<string, any> = {
      country: currentCountry,
      audience_targeting_brands: firstBrandFromCurrent,
    };

    filtersToReset.forEach((key) => {
      if (key === fieldKey) {
        updateForm(key, firstBrandFromCurrent || defaults?.[key]);
      } else if (hasDynamicDefault(key)) {
        const requiredContext = getDynamicResetContext(key);
        const filterContext = requiredContext.reduce(
          (acc, contextKey) => {
            acc[contextKey] = contextValues[contextKey];
            return acc;
          },
          {} as Record<string, any>,
        );

        const dependentOptions = FilterDataAccessor.getInstance().getOptions(
          key,
          dataFilters,
          filterContext,
        ) as Option[];

        const firstOption = dependentOptions[0]?.value;
        updateForm(key, firstOption || defaults?.[key]);
      } else {
        updateForm(key, defaults?.[key]);
      }
    });

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
      valueLabel="Brand ABI"
      getChipPlaceholder={getChipPlaceholder}
      searchable
    />
  );
};
