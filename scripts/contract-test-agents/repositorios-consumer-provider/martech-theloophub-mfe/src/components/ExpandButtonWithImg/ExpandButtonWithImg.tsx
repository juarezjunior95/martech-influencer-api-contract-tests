import { ButtonProps } from '@hexa-ui/components2';
import SortIcon from 'assets/icons/sort-descending-3.svg';

import { StyledButton } from './ExpandButtonWithImg.styles';

const iconSize: Record<ButtonProps['size'], string> = {
  small: '16px',
  medium: '24px',
  large: '32px',
};

interface ExpandBtnProps extends Omit<ButtonProps, 'value' | 'size'> {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: ButtonProps['disabled'];
  size?: ButtonProps['size'];
  dataTestId?: string;
}

export const ExpandButtonWithImg = ({
  value,
  onValueChange,
  size = 'medium',
  disabled,
  dataTestId,
}: ExpandBtnProps) => (
  <StyledButton
    onClick={() => onValueChange(!value)}
    disabled={disabled}
    isExpanded={value}
    variant="secondary"
    size={size}
    data-testid={dataTestId ? `button-${dataTestId}` : undefined}
  >
    <img src={SortIcon} alt="sort" style={{ width: iconSize[size] }} />
  </StyledButton>
);
