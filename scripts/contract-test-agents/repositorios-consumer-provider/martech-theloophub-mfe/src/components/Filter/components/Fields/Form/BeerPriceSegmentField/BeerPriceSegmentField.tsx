import { useCallback, useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { hasBpsOptionsRestrictions } from 'domain/Filter/FilterRules/constants/kpiRules';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { useFilterRules } from 'hooks/useFilters/core/useFilterRules';
import { Option } from 'models/Filters';

export const BeerPriceSegmentField = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const { getFieldConfig, filterOptions } = useFilterRules();

  const kpiValue = getCurrentValue('kpis');
  const countryValue = getCurrentValue('country');
  const zoneValue = getCurrentValue('zone');
  const growthLeverValue = getCurrentValue('growth_levers');
  const brandClassValue = getCurrentValue('brand_filter_groupings');
  const brandValue = getCurrentValue('brands');

  const fieldConfig = useMemo(
    () =>
      getFieldConfig('beer_price_segment', {
        kpi: kpiValue,
        growthLever: growthLeverValue,
        country: countryValue,
        zone: zoneValue,
        brandClass: brandClassValue,
        brand: brandValue,
      }),
    [
      getFieldConfig,
      kpiValue,
      growthLeverValue,
      countryValue,
      zoneValue,
      brandClassValue,
      brandValue,
    ],
  );

  const rawOptions: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(fieldKey, dataFilters, {
        country: countryValue,
      }) as Option[],
    [fieldKey, dataFilters, countryValue],
  );

  const options = useMemo(() => {
    const allOption: Option = { value: 'All', label: 'All' };
    let filteredOptions = filterOptions(rawOptions, fieldConfig.allowedValues);

    if (hasBpsOptionsRestrictions(kpiValue, countryValue)) {
      filteredOptions = filteredOptions.filter((opt) => opt.value !== 'Other');
    }

    const hasAll = filteredOptions.some((opt) => opt.value === 'All');
    return hasAll ? filteredOptions : [allOption, ...filteredOptions];
  }, [
    rawOptions,
    fieldConfig.allowedValues,
    filterOptions,
    kpiValue,
    countryValue,
  ]);

  const handleValueChange = useCallback(
    (option: Option) => {
      if (!option?.value) return;

      trackGA({
        event_category: 'Beer Price Segment Select',
        event_action: 'Select',
        event_label: option?.value as string,
      });

      onValueChange(fieldKey, option);
    },
    [trackGA, fieldKey, onValueChange],
  );

  if (fieldConfig.hidden) {
    return null;
  }

  return (
    <Select
      id={`${fieldKey}-select`}
      label={fieldConfig.label}
      value={getCurrentValue(fieldKey) || fieldConfig.defaultValue}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      placeholder={`Select ${fieldConfig.label}`}
      disabled={fieldConfig.disabled}
    />
  );
};

export default BeerPriceSegmentField;
