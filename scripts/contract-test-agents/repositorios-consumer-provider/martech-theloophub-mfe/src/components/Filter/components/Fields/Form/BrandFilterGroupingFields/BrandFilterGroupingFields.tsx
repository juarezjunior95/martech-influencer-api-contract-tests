import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { ChipsSelect } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { usePageFilterData } from 'hooks';
import { useFilterRules } from 'hooks/useFilters/core/useFilterRules/useFilterRules';
import { Option } from 'models/Filters';

export const BrandFilterGroupingsField = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const { dataFilters, defaults } = usePageFilterData(pageName);
  const { isBrandClassAvailable } = useFilterRules();

  const options: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(
        fieldKey,
        dataFilters,
        {},
      ) as Option[],
    [fieldKey, dataFilters],
  );

  const filteredOptions = useMemo(() => {
    const state = {
      kpi: String(getCurrentValue('kpis') || ''),
      growthLever: String(getCurrentValue('growth_levers') || 'All'),
      zone: String(getCurrentValue('zone') || ''),
      country: String(getCurrentValue('country') || ''),
      brandClass: '',
      brand: '',
    };

    return options.filter((option) => {
      const brandClass = String(option.value || option.label);
      return isBrandClassAvailable(brandClass, state);
    });
  }, [options, getCurrentValue, isBrandClassAvailable]);

  const formValue = getCurrentValue(fieldKey);
  const defaultValue = defaults[fieldKey];
  const currentValue = formValue ?? defaultValue;

  const handleValueChange = (op: Option) => {
    if (!op?.value) return;
    onValueChange(fieldKey, op);
  };

  const chipValue = currentValue ? String(currentValue) : '';

  return (
    <ChipsSelect
      options={filteredOptions}
      value={chipValue}
      onChange={(option) => handleValueChange(option)}
    />
  );
};
