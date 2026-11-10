import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const PortfoliosField = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters, defaults } = usePageFilterData(pageName);

  const zoneValue = getCurrentValue('zone');
  const countryValue = getCurrentValue('country');
  const brandFilterGroupingsValue = getCurrentValue('brand_filter_groupings');

  const formValue = getCurrentValue(fieldKey);
  const defaultValue = defaults[fieldKey];
  const currentValue = formValue ?? defaultValue;

  const options: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(fieldKey, dataFilters, {
        zone: zoneValue,
        country: countryValue,
        brand_filter_groupings: brandFilterGroupingsValue,
      }) as Option[],
    [fieldKey, dataFilters, zoneValue, countryValue, brandFilterGroupingsValue],
  );

  const handleValueChange = (option: Option) => {
    if (!option?.value) return;

    trackGA({
      event_category: 'Portfolios Select',
      event_action: 'Select',
      event_label: option?.value as string,
    });

    onValueChange(fieldKey, option);
  };

  return (
    <Select
      id={`${fieldKey}-select`}
      label="Portfolio"
      value={currentValue}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      placeholder="Select Portfolio"
    />
  );
};
