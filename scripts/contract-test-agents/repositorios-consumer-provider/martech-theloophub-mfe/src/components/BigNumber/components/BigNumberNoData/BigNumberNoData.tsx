import React from 'react';

import noDataYetIcon from 'assets/NoDataYet.svg';
import {
  BigNumberOrientation,
  EmptyStateConfig,
} from 'components/BigNumber/types';

import {
  StyledNoDataContainer,
  StyledNoDataText,
} from './BigNumberNoData.styles';

interface BigNumberNoDataProps {
  orientation?: BigNumberOrientation;
  text?: string;
  emptyStateIcon?: React.ReactNode;
  emptyStateConfig?: EmptyStateConfig;
  dataTestId?: string;
}

export const BigNumberNoData = ({
  orientation,
  text = 'Data not available',
  emptyStateIcon,
  emptyStateConfig,
  dataTestId,
}: BigNumberNoDataProps) => {
  return (
    <StyledNoDataContainer
      style={{ justifyContent: emptyStateConfig?.justifyContent }}
      orientation={orientation}
      inline={emptyStateConfig?.inline || undefined}
      data-testid={dataTestId}
    >
      {emptyStateIcon || (
        <img
          src={noDataYetIcon}
          style={{
            width: emptyStateConfig?.imageSize?.width || '56px',
            height: emptyStateConfig?.imageSize?.height || '56px',
          }}
          alt="no data yet"
          data-testid={
            dataTestId ? `${dataTestId}-icon-no-data-yet` : undefined
          }
        />
      )}
      <StyledNoDataText style={{ color: emptyStateConfig?.color }}>
        {text}
      </StyledNoDataText>
    </StyledNoDataContainer>
  );
};
