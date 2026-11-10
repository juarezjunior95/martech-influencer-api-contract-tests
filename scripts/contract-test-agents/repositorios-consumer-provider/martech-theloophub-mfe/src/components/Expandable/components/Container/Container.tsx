import { ReactNode } from 'react';

import { ExpandableProvider } from 'contexts/Expandable/Expandable';

import { StyledContainer } from './Container.styles';

export const Container = ({
  children,
  gap = 8,
  dataTestId,
}: {
  children: ReactNode;
  gap?: 8 | 16;
  dataTestId?: string;
}) => {
  return (
    <ExpandableProvider>
      <StyledContainer gap={gap} data-testid={dataTestId}>
        {children}
      </StyledContainer>
    </ExpandableProvider>
  );
};
