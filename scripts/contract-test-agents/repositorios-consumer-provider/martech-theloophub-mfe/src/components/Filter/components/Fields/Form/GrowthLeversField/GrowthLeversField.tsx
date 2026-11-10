import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { ChipsSelect } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { FilterOption, Option } from 'models/Filters';

export const GrowthLeversField = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);
  const zone = getCurrentValue('zone');
  const country = getCurrentValue('country');

  const options = useMemo(() => {
    const rawOptions: Array<Option | FilterOption> =
      FilterDataAccessor.getInstance().getOptions(fieldKey, dataFilters, {
        zone,
        country,
      });

    return rawOptions.filter((entry): entry is Option => 'value' in entry);
  }, [fieldKey, dataFilters, country, zone]).filter(
    (option) => option.value !== 'All',
  );

  const handleValueChange = (op: Option) => {
    if (!op?.value) return;

    trackGA({
      event_category: 'Growth Levers Select',
      event_action: 'Select',
      event_label: String(op.value),
    });
    if (op?.value === getCurrentValue(fieldKey)) {
      onValueChange(fieldKey, { value: 'All', label: 'All' });
      return;
    }
    onValueChange(fieldKey, op);
  };

  return (
    <ChipsSelect
      options={options}
      value={getCurrentValue(fieldKey)}
      onChange={(option) => {
        handleValueChange(option);
      }}
    />
  );
};
