import { useMemo } from 'react';

import { FieldProps } from 'components/Filter/types';
import { ChipsSelect } from 'components/Form';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { usePageFilterData } from 'hooks';
import { Option } from 'models/Filters';

export const ProductScopeField = ({
  dataTestId,
  fieldKey,
  pageName,
  onValueChange,
  getCurrentValue,
}: FieldProps) => {
  const { dataFilters } = usePageFilterData(pageName);
  const options = useMemo(() => {
    return FilterDataAccessor.getInstance().getOptions(
      fieldKey,
      dataFilters,
      {},
    ) as Option[];
  }, [fieldKey, dataFilters]);

  const handleValueChange = (option: Option) => {
    if (!option?.value) return;
    onValueChange(fieldKey, option);
  };

  return (
    <ChipsSelect
      dataTestId={dataTestId}
      options={options}
      value={getCurrentValue(fieldKey)}
      onChange={handleValueChange}
    />
  );
};
