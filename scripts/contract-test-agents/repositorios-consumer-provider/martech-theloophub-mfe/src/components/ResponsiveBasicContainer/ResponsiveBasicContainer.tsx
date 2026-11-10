import { ComponentProps } from 'react';

import { BasicContainer } from 'components/BasicContainer';

import { ResponsiveWrapper } from './ResponsiveBasicContainer.styles';

type ResponsiveBasicContainerProps = ComponentProps<typeof BasicContainer>;

export const ResponsiveBasicContainer = (
  props: ResponsiveBasicContainerProps,
) => (
  <ResponsiveWrapper
    data-testid={`responsive-basic-container-${props.dataTestId}`}
  >
    <BasicContainer {...props} fullWidth />
  </ResponsiveWrapper>
);
