import { FilterOption, FilterValue } from 'models/Filters';

export const revertValuesFilteredOnSelect = (
  valuesFiltered: FilterValue[],
  allOptions: FilterValue[],
) => {
  return allOptions?.filter(
    (option) => !valuesFiltered.includes(String(option)),
  );
};

export const getAllValuesForMultiSelect = (filterOptions: FilterOption[]) =>
  filterOptions?.flatMap((g) => g.values.map((option) => option.value));
