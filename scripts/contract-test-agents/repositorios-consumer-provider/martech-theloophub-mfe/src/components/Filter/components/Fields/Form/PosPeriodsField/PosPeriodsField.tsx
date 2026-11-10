import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { ChipsSelect } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const PosPeriodsField = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
  dataTestId,
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

  const validOptions = options
    .filter((op) => op?.value != null && op?.label != null)
    .map((op) => ({
      value: String(op?.value),
      label: op?.full || op?.label,
    }));

  const currentValue = getCurrentValue(fieldKey);
  const validValue = currentValue
    ? String(currentValue)
    : validOptions[0]?.value || '';

  const handleValueChange = (option: Option) => {
    if (!option?.value) return;

    trackGA({
      event_category: 'Period Select',
      event_action: 'Select',
      event_label: option?.value as string,
    });
    onValueChange(fieldKey, option);
  };

  return (
    <ChipsSelect
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      options={validOptions}
      value={validOptions.length <= 1 ? null : validValue}
      onChange={(option: Option) => handleValueChange(option)}
      disabled={validOptions.length <= 1}
    />
  );
};
