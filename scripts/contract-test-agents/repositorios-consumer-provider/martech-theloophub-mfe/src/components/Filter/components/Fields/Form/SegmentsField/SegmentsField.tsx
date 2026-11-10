import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { ChipsSelect } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const SegmentsField = ({
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
      event_category: 'Segments Select',
      event_action: 'Select',
      event_label: op?.value as string,
    });
    onValueChange(fieldKey, op);
  };

  return (
    <ChipsSelect
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      options={options}
      value={getCurrentValue(fieldKey)}
      onChange={handleValueChange}
    />
  );
};
