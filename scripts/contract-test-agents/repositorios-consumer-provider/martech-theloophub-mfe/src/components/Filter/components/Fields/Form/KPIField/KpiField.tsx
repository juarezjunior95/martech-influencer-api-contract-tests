import { useMemo } from 'react';

import { useKpiFeatureToggles } from 'components/Filter/hooks';
import { FieldProps } from 'components/Filter/types';
import { ChipsSelect } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const KPIField = ({
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const { dataFilters } = usePageFilterData(pageName);
  const { filterOptionsByFeatureToggle } = useKpiFeatureToggles();

  const options: Option[] = useMemo(
    () =>
      FilterDataAccessor.getInstance().getOptions(
        fieldKey,
        dataFilters,
        {},
      ) as Option[],
    [fieldKey, dataFilters],
  );

  const filteredOptions = useMemo(
    () => filterOptionsByFeatureToggle(options),
    [options, filterOptionsByFeatureToggle],
  );

  const handleValueChange = (op: Option) => {
    if (!op?.value || op.value === getCurrentValue(fieldKey)) return;
    onValueChange(fieldKey, op);
  };

  return (
    <ChipsSelect
      options={filteredOptions}
      value={getCurrentValue(fieldKey)}
      onChange={(option) => handleValueChange(option)}
    />
  );
};
