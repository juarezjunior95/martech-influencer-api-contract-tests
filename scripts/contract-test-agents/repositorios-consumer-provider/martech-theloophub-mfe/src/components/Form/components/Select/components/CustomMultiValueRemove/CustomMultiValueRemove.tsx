import { components, MultiValueRemoveProps } from 'react-select';

import { Icon } from '@hexa-ui/components2';
import { Close } from '@hexa-ui/icons2';
import { Option } from 'models/Filters';

import { MultiValueRemove } from '../../Select.styles';

export const CustomMultiValueRemove = (props: MultiValueRemoveProps) => {
  const { selectProps, data } = props;
  const { dataTestId } = selectProps as { dataTestId?: string };
  const optionValue = (data as Option)?.value;

  return (
    <components.MultiValueRemove
      {...props}
      data-testid={
        dataTestId && optionValue
          ? `${dataTestId}-remove-${optionValue}`
          : undefined
      }
    >
      <MultiValueRemove>
        <Icon icon={Close} size="small" />
      </MultiValueRemove>
    </components.MultiValueRemove>
  );
};
