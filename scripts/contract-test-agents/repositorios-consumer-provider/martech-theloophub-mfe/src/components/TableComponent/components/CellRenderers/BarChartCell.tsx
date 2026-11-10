import React from 'react';

import { useIsSmallViewport } from '../../hooks/useIsSmallViewport';
import { CellRendererProps } from '../../types';
import {
  StyledBarChartCell,
  StyledBarContainer,
  StyledBarFill,
  StyledBarInternalLabel,
  StyledBarLabel,
} from './CellRenderers.styles';

export type BarChartLabelPosition = 'adjacent' | 'end';

export interface BarChartCellProps extends CellRendererProps {
  barColor?: string;
  labelPosition?: BarChartLabelPosition;
}

const INTERNAL_LABEL_THRESHOLD = 40;

export const BarChartCell: React.FC<BarChartCellProps> = ({
  cell,
  column,
  dataTestId,
  barColor,
  labelPosition = 'adjacent',
}) => {
  const value = cell.value;
  const align = column.align || 'left';
  const isSmallViewport = useIsSmallViewport();

  if (value === undefined || value === null || value === '-' || value === '') {
    return (
      <StyledBarChartCell align={align} data-testid={dataTestId}>
        -
      </StyledBarChartCell>
    );
  }

  const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
  const hasNumericPercentage =
    typeof numValue === 'number' && !Number.isNaN(numValue);
  const percentage = hasNumericPercentage ? numValue : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  let displayValue: string;
  if (
    typeof value === 'string' &&
    value.includes('%') &&
    hasNumericPercentage &&
    percentage === clampedPercentage
  ) {
    displayValue = value;
  } else if (hasNumericPercentage) {
    displayValue = `${clampedPercentage.toFixed(1)}%`;
  } else if (typeof value === 'string' && value.includes('%')) {
    displayValue = value;
  } else {
    displayValue = `${clampedPercentage.toFixed(1)}%`;
  }
  const isLabelInternal =
    isSmallViewport && clampedPercentage >= INTERNAL_LABEL_THRESHOLD;

  const externalLabel = !isLabelInternal && (
    <StyledBarLabel
      labelPosition={labelPosition}
      data-testid={dataTestId ? `${dataTestId}-label` : undefined}
    >
      {displayValue}
    </StyledBarLabel>
  );

  return (
    <StyledBarChartCell align={align} data-testid={dataTestId}>
      <StyledBarContainer labelPosition={labelPosition}>
        <StyledBarFill
          percentage={clampedPercentage}
          barColor={barColor}
          data-testid={dataTestId ? `${dataTestId}-bar` : undefined}
        >
          {isLabelInternal && (
            <StyledBarInternalLabel
              data-testid={dataTestId ? `${dataTestId}-label` : undefined}
            >
              {displayValue}
            </StyledBarInternalLabel>
          )}
        </StyledBarFill>
        {labelPosition === 'adjacent' && externalLabel}
      </StyledBarContainer>
      {labelPosition === 'end' && externalLabel}
    </StyledBarChartCell>
  );
};
