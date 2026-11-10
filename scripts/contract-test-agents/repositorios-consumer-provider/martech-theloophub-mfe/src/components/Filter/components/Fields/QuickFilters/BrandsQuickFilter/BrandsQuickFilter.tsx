import { useCallback } from 'react';

import { BrandImg } from 'components/BrandImg/BrandImg';
import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { Option } from 'models/Filters';
import { getBrandImagePlaceholderUrl } from 'utils';

const isPerformanceToolPage = (pageName: string) =>
  pageName?.includes('value-creation/performance-tool');

export const BrandsQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const countryValue = getCurrentValue('country');
  const brandValue = getCurrentValue('brands');
  const subBrandsValue = getCurrentValue('sub_brands');
  const showSubBrand =
    isPerformanceToolPage(pageName) &&
    !!subBrandsValue &&
    subBrandsValue !== 'All';

  const brandsFilter = useQuickFilter({
    fieldKey,
    pageName,
    gaCategory: 'Brand Select',
    filterContext: { country: countryValue },
    onValueChange,
    getCurrentValue,
  });

  const subBrandsFilter = useQuickFilter({
    fieldKey: 'sub_brands',
    pageName,
    gaCategory: 'Sub Brand Select',
    filterContext: { country: countryValue, brands: brandValue },
    onValueChange,
    getCurrentValue,
  });

  const activeFilter = showSubBrand ? subBrandsFilter : brandsFilter;
  const displayValue = showSubBrand
    ? subBrandsValue
    : brandsFilter.currentValue;
  const canClear = showSubBrand || brandsFilter.showClearIcon;

  const getChipPlaceholder = useCallback(
    (options: Option | Option[]) => {
      const option = Array.isArray(options) ? options[0] : options;
      return (
        <BrandImg
          src={option?.image_url || getBrandImagePlaceholderUrl()}
          alt={String(option?.label || option?.value || '')}
          dataTestId={dataTestId ? `${dataTestId}-brand-img` : undefined}
          width="16px"
          height="16px"
        />
      );
    },
    [dataTestId],
  );

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select-quick-filter`}
      value={displayValue}
      options={activeFilter.options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        activeFilter.handleValueChange(opt as Option);
      }}
      size="medium"
      shape="pill"
      placeholder={`Select ${fieldKey}`}
      chips
      clearChips={canClear}
      onClearSingle={activeFilter.handleClear}
      valueLabel="Brand"
      getChipPlaceholder={getChipPlaceholder}
      searchable
    />
  );
};
