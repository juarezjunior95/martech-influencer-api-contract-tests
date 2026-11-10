import { useMemo } from 'react';

import GlobalIcon from 'assets/icons/global.svg';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const ZoneQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const options: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(
        fieldKey,
        dataFilters,
        {},
      ) as Option[],
    [fieldKey, dataFilters],
  );

  const handleValueChange = (op: Option) => {
    if (!op?.value) return;

    trackGA({
      event_category: 'Zone Select',
      event_action: 'Select',
      event_label: op?.value as string,
    });
    onValueChange(fieldKey, op);
  };

  const getChipPlaceholder = () => {
    return <img src={GlobalIcon} alt="Global" width={16} height={16} />;
  };

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select-quick-filter`}
      value={getCurrentValue(fieldKey)}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      size="medium"
      shape="pill"
      placeholder={`Select ${fieldKey}`}
      chips
      clearChips={false}
      valueLabel="Zone"
      getChipPlaceholder={getChipPlaceholder}
      searchable
    />
  );
};
