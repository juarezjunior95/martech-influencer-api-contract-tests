import React from 'react';

import { CellRendererProps } from '../../types';
import {
  StyledGridIconWrapper,
  StyledGridMainText,
  StyledGridSecondaryText,
  StyledGridSubText,
  StyledHeaderGridCell,
  StyledHeaderRow,
} from './CellRenderers.styles';

export const HeaderGridCell: React.FC<CellRendererProps> = ({
  cell,
  column,
  dataTestId,
}) => {
  const { subtext = '', subtitle = '', icon } = cell;

  const value = cell.value ?? '-';

  return (
    <StyledHeaderGridCell
      data-testid={dataTestId}
      align={column.align || 'center'}
    >
      <StyledHeaderRow>
        <StyledGridMainText
          data-testid={dataTestId ? `${dataTestId}-main` : undefined}
        >
          {value}
        </StyledGridMainText>
        {subtext && (
          <StyledGridSubText
            data-testid={dataTestId ? `${dataTestId}-subtext` : undefined}
          >
            {subtext}
          </StyledGridSubText>
        )}
      </StyledHeaderRow>
      {(subtitle || icon) && (
        <StyledHeaderRow>
          {subtitle && (
            <StyledGridSecondaryText
              data-testid={dataTestId ? `${dataTestId}-secondary` : undefined}
            >
              {subtitle}
            </StyledGridSecondaryText>
          )}
          {icon && (
            <StyledGridIconWrapper
              data-testid={dataTestId ? `${dataTestId}-icon` : undefined}
            >
              <span>{icon}</span>
            </StyledGridIconWrapper>
          )}
        </StyledHeaderRow>
      )}
    </StyledHeaderGridCell>
  );
};
