import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const ScopesField = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const options = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(
        fieldKey,
        dataFilters,
        {},
      ) as Option[],
    [fieldKey, dataFilters],
  );

  const filteredOptions = useMemo(() => {
    if (getCurrentValue('zone') !== 'ABI') {
      return options.filter((option) => option.value !== 'global_brands');
    }

    return options;
  }, [options, getCurrentValue]);

  const handleValueChange = (option: Option) => {
    if (!option?.value) return;

    trackGA({
      event_category: 'Scope Select',
      event_action: 'Select',
      event_label: option?.value as string,
    });
    onValueChange(fieldKey, option);
  };

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select`}
      label="Scope"
      value={getCurrentValue(fieldKey)}
      options={filteredOptions}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      placeholder={`Select a scope`}
    />
  );
};
