import { components, DropdownIndicatorProps } from 'react-select';

import { Icon } from '@hexa-ui/components2';
import { ChevronDown, ChevronUp } from '@hexa-ui/icons2';

export const CustomDropdownIndicator = (props: DropdownIndicatorProps) => {
  const { selectProps } = props;
  const { dataTestId } = selectProps as { dataTestId?: string };

  return (
    <components.DropdownIndicator
      {...props}
      data-testid={dataTestId ? `${dataTestId}-dropdown-indicator` : undefined}
    >
      <Icon
        icon={ChevronDown}
        style={{ display: selectProps.menuIsOpen ? 'none' : 'flex' }}
        data-testid={dataTestId ? `${dataTestId}-caret-down` : undefined}
      />
      <Icon
        icon={ChevronUp}
        style={{ display: selectProps.menuIsOpen ? 'flex' : 'none' }}
        data-testid={dataTestId ? `${dataTestId}-caret-up` : undefined}
      />
    </components.DropdownIndicator>
  );
};
