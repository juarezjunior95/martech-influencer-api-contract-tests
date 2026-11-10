import { MultiValue, SingleValue } from 'react-select';

import { Option } from 'models/Filters';

import { SELECT_ALL_VALUE } from './option';

type Value = string | string[] | Option | Option[] | number | undefined;
type ValueChangeParams = string | string[] | Option | Option[];
export interface HandleChangeParams {
  newValue: SingleValue<Option> | MultiValue<Option>;
  multiple: boolean;
  value: Value;
  flatOptions: Option[];
  onValueChange?: (value: ValueChangeParams) => void;
}

/**
 * Handles select value change for both single and multiple modes
 */
export const handleSelectChange = ({
  newValue,
  multiple,
  value,
  flatOptions,
  onValueChange,
}: HandleChangeParams): void => {
  if (!onValueChange) return;

  if (multiple) {
    handleMultipleChange(
      newValue as MultiValue<Option>,
      value,
      flatOptions,
      onValueChange,
    );
  } else {
    handleSingleChange(newValue as SingleValue<Option>, onValueChange);
  }
};

/**
 * Handles multiple select change with Select All logic
 */
const handleMultipleChange = (
  multiValue: MultiValue<Option>,
  currentValue: Value,
  flatOptions: Option[],
  onValueChange: (value: ValueChangeParams) => void,
): void => {
  if (multiValue?.some((option) => option.value === SELECT_ALL_VALUE)) {
    handleSelectAll(currentValue, flatOptions, onValueChange);
  } else {
    onValueChange(multiValue.filter((option) => !option.isDisabled));
  }
};

/**
 * Handles Select All logic
 */
const handleSelectAll = (
  currentValue: Value,
  flatOptions: Option[],
  onValueChange: (value: ValueChangeParams) => void,
): void => {
  const currentValues = Array.isArray(currentValue) ? currentValue : [];
  const currentValueStrings = new Set(
    currentValues.map((v) => (typeof v === 'string' ? v : v.value)),
  );

  const enabledOptions = flatOptions.filter((opt) => !opt.isDisabled);
  const enabledFlatValues = enabledOptions.map((opt) => opt.value);
  const allSelected = enabledFlatValues.every((val) =>
    currentValueStrings.has(val),
  );

  if (allSelected) {
    onValueChange([]);
  } else {
    onValueChange(enabledOptions);
  }
};

/**
 * Handles single select change
 */
const handleSingleChange = (
  singleValue: SingleValue<Option>,
  onValueChange: (value: ValueChangeParams) => void,
): void => {
  onValueChange(singleValue || '');
};
