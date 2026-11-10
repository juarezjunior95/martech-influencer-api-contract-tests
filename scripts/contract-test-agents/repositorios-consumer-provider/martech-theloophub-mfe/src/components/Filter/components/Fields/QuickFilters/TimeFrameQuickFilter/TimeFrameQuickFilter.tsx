import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const TimeFrameQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const trackGA = useGoogleAnalytics();
  const { dataFilters } = usePageFilterData(pageName);

  const options: Option[] = FilterDataAccessor.getInstance().getOptions(
    fieldKey,
    dataFilters,
    {},
  ) as Option[];

  const handleValueChange = (op: Option) => {
    if (!op?.value) return;

    trackGA({
      event_category: 'Time Frame Select',
      event_action: 'Select',
      event_label: op?.value as string,
    });
    onValueChange(fieldKey, op);
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
      valueLabel="Period"
      searchable
      disabled
    />
  );
};
