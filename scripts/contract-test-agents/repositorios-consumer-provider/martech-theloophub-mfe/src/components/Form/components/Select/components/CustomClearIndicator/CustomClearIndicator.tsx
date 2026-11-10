import { ClearIndicatorProps, components } from 'react-select';

import { Icon } from '@hexa-ui/components2';
import { Close } from '@hexa-ui/icons2';

import { StyledClearIndicator } from './CustomClearIndicator.styles';

export const CustomClearIndicator = (props: ClearIndicatorProps) => {
  const { dataTestId } = props.selectProps as { dataTestId?: string };

  return (
    <components.ClearIndicator {...props}>
      <StyledClearIndicator
        data-testid={dataTestId ? `${dataTestId}-clear-indicator` : undefined}
      >
        <Icon icon={Close} />
      </StyledClearIndicator>
    </components.ClearIndicator>
  );
};
