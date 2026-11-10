import React, { useMemo } from 'react';
import { components, MultiValueGenericProps } from 'react-select';

import { Option } from 'models/Filters';

import { StyledChipsPlaceholder } from '../../Select.styles';

interface CustomMultiValueContainerProps extends MultiValueGenericProps {
  getChipPlaceholder?: (options: Option[] | Option) => React.ReactNode;
}

export const CustomMultiValueContainer = (
  props: CustomMultiValueContainerProps,
) => {
  const { children, data, getChipPlaceholder, selectProps, ...rest } = props;

  const { dataTestId } = selectProps as { dataTestId?: string };
  const optionValue = (data as Option)?.value;

  const placeholder = useMemo(() => {
    if (!getChipPlaceholder || !data) return null;
    return getChipPlaceholder(data as Option);
  }, [getChipPlaceholder, data]);

  return (
    <components.MultiValueContainer
      {...rest}
      data={data}
      selectProps={selectProps}
      data-testid={
        dataTestId && optionValue
          ? `${dataTestId}-multi-value-${optionValue}`
          : undefined
      }
    >
      {placeholder && (
        <StyledChipsPlaceholder>{placeholder}</StyledChipsPlaceholder>
      )}
      {children}
    </components.MultiValueContainer>
  );
};
