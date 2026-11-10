import { useMemo } from 'react';

import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { usePageFilterManagement } from 'hooks';
import { Option } from 'models/Filters';

export const YtdMonthQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const { options, currentValue, handleValueChange, showClearIcon, defaults } =
    useQuickFilter({
      fieldKey,
      pageName,
      gaCategory: 'Period Select',
      filterContext: {},
      onValueChange,
      getCurrentValue,
    });

  const validOptions = useMemo(() => {
    const valids = options
      .filter((op) => op?.value != null && op?.label != null)
      .map((op) => ({
        value: String(op?.value),
        label: `${op?.label}`,
        full: `${op?.full}`,
      }));

    return valids;
  }, [options]);

  const { updateForm, apply } = usePageFilterManagement(pageName);

  const handleClear = () => {
    updateForm(fieldKey, defaults?.[fieldKey]);
    apply();
  };

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select-quick-filter`}
      value={currentValue}
      options={validOptions}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      size="medium"
      shape="pill"
      placeholder={`Select ${fieldKey}`}
      chips
      clearChips={showClearIcon}
      onClearSingle={handleClear}
      valueLabel="Time Frame"
      searchable
      disabled={validOptions.length <= 1}
    />
  );
};
