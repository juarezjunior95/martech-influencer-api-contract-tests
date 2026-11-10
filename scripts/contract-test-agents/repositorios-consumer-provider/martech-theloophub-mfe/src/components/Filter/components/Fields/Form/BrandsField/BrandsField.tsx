import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { useFilterRules } from 'hooks/useFilters/core/useFilterRules';
import { Option } from 'models/Filters';

export const BrandsField = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters, defaults } = usePageFilterData(pageName);
  const { getFieldConfig } = useFilterRules();

  const kpiValue = getCurrentValue('kpis');
  const countryValue = getCurrentValue('country');
  const zoneValue = getCurrentValue('zone');
  const growthLeverValue = getCurrentValue('growth_levers');
  const brandClassValue = String(
    getCurrentValue('brand_filter_groupings') ??
      defaults['brand_filter_groupings'] ??
      '',
  );
  const formValue = getCurrentValue(fieldKey);
  const portfolioValue = getCurrentValue('portfolios');
  const beerPriceSegmentValue = getCurrentValue('beer_price_segment');
  const brandValue = getCurrentValue('brands');

  const fieldConfig = useMemo(
    () =>
      getFieldConfig('brands', {
        kpi: kpiValue,
        growthLever: growthLeverValue,
        country: countryValue,
        brand: brandValue,
        zone: zoneValue,
        brandClass: brandClassValue,
        portfolio: portfolioValue,
        beerPriceSegment: beerPriceSegmentValue,
      }),
    [
      getFieldConfig,
      kpiValue,
      growthLeverValue,
      countryValue,
      zoneValue,
      brandClassValue,
      portfolioValue,
      beerPriceSegmentValue,
      brandValue,
    ],
  );

  const displayValue = useMemo(() => {
    if (fieldConfig.disabled && fieldConfig.placeholder) return null;
    if (formValue) return formValue;
    if (fieldConfig.defaultValue) return fieldConfig.defaultValue;
    return null;
  }, [
    formValue,
    fieldConfig.defaultValue,
    fieldConfig.disabled,
    fieldConfig.placeholder,
  ]);

  const options: Option[] = useMemo(() => {
    const rawOptions = FilterDataAccessor.getInstance().getOptions(
      fieldKey,
      dataFilters,
      {
        country: countryValue,
      },
    ) as Option[];

    const hasAll = rawOptions.some((opt) => opt.value === 'All');
    if (!hasAll && rawOptions.length > 0) {
      return [{ value: 'All', label: 'All' }, ...rawOptions];
    }
    return rawOptions;
  }, [fieldKey, dataFilters, countryValue]);

  const handleValueChange = (option: Option) => {
    if (!option?.value) return;

    trackGA({
      event_category: 'Brand Select',
      event_action: 'Select',
      event_label: option?.value as string,
    });
    onValueChange(fieldKey, option);
    onValueChange('sub_brands', { value: null, label: '' });
  };

  if (fieldConfig.hidden) {
    return null;
  }

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select`}
      label={fieldConfig.label}
      value={displayValue}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      placeholder={fieldConfig.placeholder || 'Select a brand'}
      disabled={fieldConfig.disabled}
      searchable
    />
  );
};

export default BrandsField;
