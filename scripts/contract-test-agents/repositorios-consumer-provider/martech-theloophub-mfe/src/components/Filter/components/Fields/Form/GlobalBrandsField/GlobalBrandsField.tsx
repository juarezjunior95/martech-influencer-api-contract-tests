// src/components/Filter/components/Fields/Form/GlobalBrandsField/GlobalBrandsField.tsx

import { useCallback, useEffect, useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { useFilterRules } from 'hooks/useFilters/core/useFilterRules';
import { Option } from 'models/Filters';

export const GlobalBrandsField = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const { getFieldConfig } = useFilterRules();

  const kpiValue = getCurrentValue('kpis');
  const countryValue = getCurrentValue('country');
  const zoneValue = getCurrentValue('zone');
  const growthLeverValue = getCurrentValue('growth_levers');
  const brandClassValue = getCurrentValue('brand_filter_groupings');
  const brandValue = getCurrentValue('brands');
  const formValue = getCurrentValue(fieldKey);

  const fieldConfig = useMemo(
    () =>
      getFieldConfig('global_brands', {
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

  const options: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(fieldKey, dataFilters, {
        country: countryValue,
      }) as Option[],
    [fieldKey, dataFilters, countryValue],
  );

  useEffect(() => {
    if (!fieldConfig.hidden && formValue == null && options.length > 0) {
      onValueChange(fieldKey, options[0]);
    }
  }, [fieldConfig.hidden, formValue, options, fieldKey, onValueChange]);

  const handleValueChange = useCallback(
    (option: Option) => {
      if (!option?.value) return;

      trackGA({
        event_category: 'Global Brand Select',
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

  const currentValue = formValue ?? options[0]?.value;
  return (
    <Select
      id={`${fieldKey}-select`}
      label={fieldConfig.label}
      value={currentValue}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      placeholder={`Select a ${fieldKey}`}
      disabled={fieldConfig.disabled}
    />
  );
};

export default GlobalBrandsField;
