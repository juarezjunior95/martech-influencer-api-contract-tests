import { useCallback, useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { PerformanceToolFilterDataTransformer } from 'domain/Filter/FilterDataTransformer';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { useFilterRules } from 'hooks/useFilters/core/useFilterRules';
import { Option } from 'models/Filters';

export const SubBrandsField = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters, rawData } = usePageFilterData(pageName);
  const { getFieldConfig } = useFilterRules();

  const kpiValue = getCurrentValue('kpis');
  const countryValue = getCurrentValue('country');
  const zoneValue = getCurrentValue('zone');
  const growthLeverValue = getCurrentValue('growth_levers');
  const brandClassValue = getCurrentValue('brand_filter_groupings');
  const brandValue = getCurrentValue('brands');
  const portfolioValue = getCurrentValue('portfolios');
  const beerPriceSegmentValue = getCurrentValue('beer_price_segment');

  const fieldConfig = useMemo(
    () =>
      getFieldConfig('sub_brands', {
        kpi: kpiValue,
        growthLever: growthLeverValue,
        country: countryValue,
        zone: zoneValue,
        brandClass: brandClassValue,
        brand: brandValue,
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
      brandValue,
      portfolioValue,
      beerPriceSegmentValue,
    ],
  );

  const options: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(fieldKey, dataFilters, {
        country: countryValue,
        brands: brandValue,
      }) as Option[],
    [fieldKey, dataFilters, countryValue, brandValue],
  );

  const subBrandToBrandMap = useMemo(
    () =>
      PerformanceToolFilterDataTransformer.buildSubBrandToBrandMap(
        rawData,
        kpiValue,
        {
          zone: zoneValue,
          country: countryValue,
          growth_levers: growthLeverValue,
        },
      ),
    [rawData, kpiValue, zoneValue, countryValue, growthLeverValue],
  );

  const handleValueChange = useCallback(
    (option: Option) => {
      if (!option?.value) return;

      trackGA({
        event_category: 'Sub Brand Select',
        event_action: 'Select',
        event_label: option?.value as string,
      });

      const selectedSubBrand = option.value as string;
      const correspondingBrand = subBrandToBrandMap[selectedSubBrand];

      // Auto-select parent brand when:
      // 1. Current brand is "All", OR
      // 2. Current brand doesn't match the selected sub-brand's parent
      if (
        correspondingBrand &&
        (brandValue === 'All' || brandValue !== correspondingBrand)
      ) {
        onValueChange('brands', {
          value: correspondingBrand,
          label: correspondingBrand,
        });
      }

      onValueChange(fieldKey, option);
    },
    [trackGA, fieldKey, onValueChange, subBrandToBrandMap, brandValue],
  );

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select`}
      label={fieldConfig.label}
      value={getCurrentValue(fieldKey)}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      placeholder={fieldConfig.placeholder || 'Select a sub-brand'}
      disabled={fieldConfig.disabled}
    />
  );
};

export default SubBrandsField;
