import React from 'react';

import { CellRendererProps } from '../../types';
import {
  StyledAxisCell,
  StyledAxisSubtext,
  StyledAxisText,
} from './CellRenderers.styles';

export const AxisCell: React.FC<CellRendererProps> = ({
  cell,
  column,
  dataTestId,
}) => {
  const { subtitle } = cell;
  const value = cell.value ?? '-';

  return (
    <StyledAxisCell data-testid={dataTestId} align={column.align || 'center'}>
      <StyledAxisText
        data-testid={dataTestId ? `${dataTestId}-text` : undefined}
      >
        {value}
      </StyledAxisText>
      {subtitle && (
        <StyledAxisSubtext
          data-testid={dataTestId ? `${dataTestId}-subtitle` : undefined}
        >
          {subtitle}
        </StyledAxisSubtext>
      )}
    </StyledAxisCell>
  );
};
