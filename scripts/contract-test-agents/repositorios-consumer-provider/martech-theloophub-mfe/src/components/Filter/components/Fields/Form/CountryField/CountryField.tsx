import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const CountryField = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const zoneValue = getCurrentValue('zone');
  const currentValue = getCurrentValue(fieldKey);

  const rawOptions: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(fieldKey, dataFilters, {
        zone: zoneValue,
      }) as Option[],
    [fieldKey, dataFilters, zoneValue],
  );

  const options: Option[] = useMemo(
    () =>
      rawOptions.map((opt) =>
        opt.value === 'ABI' ? { ...opt, label: 'All' } : opt,
      ),
    [rawOptions],
  );

  const valueExistsInOptions = useMemo(
    () => options.some((opt) => opt.value === currentValue),
    [options, currentValue],
  );

  const displayValue = valueExistsInOptions
    ? currentValue
    : options[0]?.value || '';

  const handleValueChange = (option: Option) => {
    if (!option?.value) return;

    trackGA({
      event_category: 'Country Select',
      event_action: 'Select',
      event_label: option?.value as string,
    });

    onValueChange('zone', { value: option?.zone, label: option?.zone });
    onValueChange(fieldKey, option);
  };

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select`}
      label="Country"
      value={displayValue}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      placeholder={`Select ${fieldKey}`}
      searchable
    />
  );
};
