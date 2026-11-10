import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const BrandsAbiField = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
  dataTestId,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const countryValue = getCurrentValue('country');
  const options: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(fieldKey, dataFilters, {
        country: countryValue,
      }) as Option[],
    [fieldKey, dataFilters, countryValue],
  );

  const handleValueChange = (option: Option) => {
    if (!option?.value) return;

    trackGA({
      event_category: 'Brand ABI Select',
      event_action: 'Select',
      event_label: option?.value as string,
    });

    onValueChange(fieldKey, option);
  };

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select`}
      label="Brand ABI"
      value={getCurrentValue(fieldKey)}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      placeholder="All"
      disabled={getCurrentValue('country') === 'ABI'}
      optional
    />
  );
};
