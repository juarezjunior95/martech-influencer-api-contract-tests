import SortIcon from 'assets/icons/sort-descending-3.svg';

import { StyledButton } from './Expand.styles';

interface ExpandBtnProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  dataTestId?: string;
}

export const Expand = ({
  value,
  onValueChange,
  dataTestId,
}: ExpandBtnProps) => (
  <StyledButton
    size="medium"
    variant="secondary"
    onClick={() => onValueChange(!value)}
    isExpanded={value}
    data-testid={dataTestId}
  >
    <img src={SortIcon} alt="sort" />
  </StyledButton>
);
