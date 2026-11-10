import { FilterDataStructure, Option } from 'models/Filters';

export const defaultValidator = (filterKey, filterData, value) => {
  const filter = filterData[filterKey as keyof FilterDataStructure] as
    { values?: Option[] } | undefined;
  if (!filter?.values) return false;
  return filter?.values?.some((opt) => opt?.value === value);
};
