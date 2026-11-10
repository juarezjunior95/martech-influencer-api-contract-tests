import { Icon } from '@hexa-ui/components2';
import { Maximize2, Minimize1 } from '@hexa-ui/icons2';

import { StyledExpand } from './Expand.styles';

interface ExpandProps {
  onValueChange: (value: boolean) => void;
  value: boolean;
  disabled?: boolean;
  dataTestId?: string;
}

export const Expand = ({
  onValueChange,
  value,
  disabled = false,
  dataTestId,
}: ExpandProps) => {
  const toggleExpanded = () => {
    onValueChange(!value);
  };

  return (
    <StyledExpand
      data-testid={dataTestId}
      variant="secondary"
      aria-expanded={value}
      onClick={() => toggleExpanded()}
      disabledState={disabled}
      disabled={disabled}
    >
      {value ? (
        <Icon
          icon={Minimize1}
          data-testid={dataTestId ? `${dataTestId}-minimize` : undefined}
          size="large"
        />
      ) : (
        <Icon
          icon={Maximize2}
          data-testid={dataTestId ? `${dataTestId}-maximize` : undefined}
          size="large"
        />
      )}
    </StyledExpand>
  );
};
