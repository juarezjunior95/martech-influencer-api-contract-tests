import { FilterOption, Option } from 'models/Filters';

export const SELECT_ALL_VALUE = '__select_all__';

export const createSelectAllOption = (selectAllLabel: string): Option => ({
  label: selectAllLabel,
  value: SELECT_ALL_VALUE,
});

const isFilterOptionArray = (
  opts: Array<Option> | Array<FilterOption>,
): opts is FilterOption[] => opts.length > 0 && 'group' in opts[0];

export const processOptions = (
  options: Array<Option> | Array<FilterOption>,
  multiple: boolean,
  showSelectAll: boolean,
  selectAllLabel: string,
) => {
  const isGrouped = isFilterOptionArray(options);

  const flatOptions: Option[] = isGrouped
    ? options.flatMap((group) => group.values)
    : options;

  const selectAllOption = createSelectAllOption(selectAllLabel);

  const optionsWithSelectAll =
    multiple && showSelectAll ? [selectAllOption, ...flatOptions] : flatOptions;

  const groupedOptions = isGrouped
    ? [
        ...(multiple && showSelectAll
          ? [{ label: '', options: [selectAllOption] }]
          : []),
        ...options.map((group) => ({
          label: group.group,
          options: group.values,
        })),
      ]
    : undefined;

  return {
    isGrouped,
    flatOptions,
    optionsWithSelectAll,
    groupedOptions,
  };
};

export const convertToOption = (
  val: string | string[] | Option | Option[] | number,
  optionsWithSelectAll: Option[],
): Option | Option[] | null => {
  if (!val) return null;

  if (Array.isArray(val)) {
    return val.map((v) =>
      typeof v === 'string'
        ? optionsWithSelectAll.find((opt) => opt.value === v) || {
            label: v,
            value: v,
          }
        : v,
    );
  }

  if (typeof val === 'string' || typeof val === 'number') {
    return (
      optionsWithSelectAll.find((opt) => opt.value === val) || {
        label: val,
        value: val,
      }
    );
  }

  return val;
};
