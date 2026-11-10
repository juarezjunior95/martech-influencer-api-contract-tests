import { FilterValue, Option } from 'models/Filters';

import { Chip, ChipsContainer } from './ChipsSelect.styles';

interface ChipsSelectProps {
  options: Option[];
  value: string | string[];
  onChange: (option: Option) => void;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  dataTestId?: string;
}

export const ChipsSelect: React.FC<ChipsSelectProps> = ({
  options,
  value,
  onChange,
  multiple = false,
  disabled = false,
  label,
  dataTestId,
}) => {
  const isSelected = (optionValue: FilterValue) => {
    if (Array.isArray(value)) {
      return value.includes(optionValue as string);
    }
    return value === optionValue;
  };

  return (
    <ChipsContainer data-testid={dataTestId}>
      {options.map((option) => (
        <Chip
          key={option.value}
          type="button"
          selected={isSelected(option.value)}
          onClick={() => {
            if (disabled || option.isDisabled) return;
            onChange(option);
          }}
          data-testid={
            dataTestId ? `${dataTestId}-option-${option.value}` : undefined
          }
          disabled={disabled || option.isDisabled}
        >
          {option.label}
        </Chip>
      ))}
    </ChipsContainer>
  );
};
