import { useMemo } from 'react';

import { useQuickFilter } from 'components/Filter/hooks/useQuickFilter';
import { FieldProps } from 'components/Filter/types';
import { Select } from 'components/Form';
import { usePageFilterManagement } from 'hooks';
import { Option } from 'models/Filters';

export const BrandPowerBookSubScopesQuickFilter = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const scopeValue = getCurrentValue('scopes');

  const { options, currentValue, handleValueChange, defaults } = useQuickFilter(
    {
      fieldKey,
      pageName,
      gaCategory: 'Sub Scope Select',
      filterContext: { scopes: scopeValue },
      onValueChange,
      getCurrentValue,
    },
  );

  const { updateForm, apply } = usePageFilterManagement(pageName);

  const handleClear = () => {
    const firstOption = options[0]?.value;
    updateForm(fieldKey, firstOption || defaults?.[fieldKey]);
    apply();
  };

  const firstOptionValue = options[0]?.value;
  const showClearIcon = currentValue !== firstOptionValue;

  const valueLabel = useMemo(() => {
    if (scopeValue === 'portfolio') return 'Portfolio';
    if (scopeValue === 'global_brands') return 'Global Brands';
    if (scopeValue === 'segment') return 'Segment';
    return 'Sub Scope';
  }, [scopeValue]);

  const placeholder = useMemo(() => {
    if (scopeValue === 'portfolio') return 'Select a Portfolio';
    if (scopeValue === 'global_brands') return 'Select a Global Brands';
    if (scopeValue === 'segment') return 'Select a Segment';
    return `Select ${fieldKey}`;
  }, [scopeValue, fieldKey]);

  return (
    <Select
      dataTestId={dataTestId ? `${dataTestId}-${fieldKey}` : undefined}
      id={`${fieldKey}-select-quick-filter`}
      value={currentValue}
      options={options}
      onValueChange={(option) => {
        const opt = Array.isArray(option) ? option[0] : option;
        handleValueChange(opt as Option);
      }}
      size="medium"
      shape="pill"
      placeholder={placeholder}
      chips
      clearChips={showClearIcon}
      onClearSingle={handleClear}
      valueLabel={valueLabel}
      searchable
      disabled={!scopeValue}
    />
  );
};
