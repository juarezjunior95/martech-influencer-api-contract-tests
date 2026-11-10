import { OptionProps } from 'react-select';

import { Icon } from '@hexa-ui/components2';
import { Check } from '@hexa-ui/icons2';
import { Option } from 'models/Filters';

import { SelectSize } from '../../types';
import { getSizeStyles } from '../../utils';
import {
  StyledCheckInput,
  StyledCustomOption,
  StyledCustomReactSelectOption,
} from './CustomOption.styles';

interface CustomOptionProps extends OptionProps {
  multiple: boolean;
  size: SelectSize;
  allSelected: boolean;
  error?: boolean;
}

export const CustomOption = (props: CustomOptionProps) => {
  const {
    data,
    isSelected,
    isDisabled,
    multiple,
    size,
    allSelected,
    error,
    selectProps,
  } = props;
  const option = data as Option;
  const { dataTestId } = selectProps as { dataTestId?: string };

  const { getCheckSize } = getSizeStyles(size);

  const optionDisabled = isDisabled;
  const displayLabel = option.full || option.label;

  const getCheckboxState = () => {
    if (optionDisabled) return 'none';
    if ((allSelected && !optionDisabled) || isSelected) return 'selected';
    return 'none';
  };

  const getIconStyles = () => {
    return { color: 'black', width: '12px' };
  };

  return (
    <StyledCustomReactSelectOption
      {...props}
      isDisabled={optionDisabled}
      data-testid={
        dataTestId && option.value
          ? `${dataTestId}-option-${option.value}`
          : undefined
      }
    >
      <StyledCustomOption isDisabled={optionDisabled}>
        {option?.icon && <Icon icon={option?.icon} />}
        {displayLabel}
        {!multiple && isSelected ? (
          <Icon
            icon={Check}
            style={{
              color: '#0a0a0a',
              fontSize: getCheckSize(),
              marginLeft: 'auto',
              width: getCheckSize(),
              height: getCheckSize(),
            }}
          />
        ) : (
          ''
        )}
        {multiple && (
          <StyledCheckInput
            checked={getCheckboxState()}
            error={error}
            style={{
              width: getCheckSize(),
              height: getCheckSize(),
            }}
          >
            {((allSelected && !optionDisabled) || isSelected) && (
              <Icon icon={Check} style={getIconStyles()} />
            )}
          </StyledCheckInput>
        )}
      </StyledCustomOption>
    </StyledCustomReactSelectOption>
  );
};
