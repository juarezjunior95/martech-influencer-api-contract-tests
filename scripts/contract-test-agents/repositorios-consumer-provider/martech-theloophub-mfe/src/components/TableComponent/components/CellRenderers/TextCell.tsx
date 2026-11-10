import React from 'react';

import { CellRendererProps } from '../../types';
import { StyledTextCell } from './CellRenderers.styles';

export const TextCell: React.FC<CellRendererProps> = ({
  cell,
  column,
  dataTestId,
}) => {
  const { subtitle } = cell;
  const value = cell.value ?? '-';

  return (
    <StyledTextCell data-testid={dataTestId} align={column.align || 'center'}>
      {value}
      {subtitle && (
        <span className="subtitle" data-cell-text>
          {subtitle}
        </span>
      )}
    </StyledTextCell>
  );
};
