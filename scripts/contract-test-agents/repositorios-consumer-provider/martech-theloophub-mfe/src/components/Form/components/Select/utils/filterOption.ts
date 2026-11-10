import { Option } from 'models/Filters';

/**
 * Custom filter function for Select search
 */
export const filterSelectOption = (
  option: { label: string; value: string; data: Option },
  inputValue: string,
): boolean => {
  if (!inputValue) return true;

  const label = String(option.label).toLowerCase();
  const value = String(option.value).toLowerCase();
  const search = inputValue.toLowerCase();

  return label.includes(search) || value.includes(search);
};
