import React from 'react';

import { CellRendererProps } from '../../types';
import {
  INDEX_TAG_COLORS,
  StyledIndexTag,
  StyledIndexTagCell,
} from './CellRenderers.styles';

export interface IndexThresholds {
  upMin?: number;
  downMax?: number;
}

const DEFAULT_UP_MIN = 105;
const DEFAULT_DOWN_MAX = 95;

const DEFAULT_THRESHOLDS: IndexThresholds = {
  upMin: DEFAULT_UP_MIN,
  downMax: DEFAULT_DOWN_MAX,
};

const getTagColors = (
  value: number | string | undefined,
  thresholds: IndexThresholds = DEFAULT_THRESHOLDS,
): { backgroundColor: string; textColor: string } => {
  const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;

  if (numValue === undefined || Number.isNaN(numValue)) {
    return {
      backgroundColor: INDEX_TAG_COLORS.neutral.background,
      textColor: INDEX_TAG_COLORS.neutral.text,
    };
  }

  const upMin = thresholds.upMin ?? DEFAULT_UP_MIN;
  const downMax = thresholds.downMax ?? DEFAULT_DOWN_MAX;

  if (numValue > upMin) {
    return {
      backgroundColor: INDEX_TAG_COLORS.up.background,
      textColor: INDEX_TAG_COLORS.up.text,
    };
  }

  if (numValue < downMax) {
    return {
      backgroundColor: INDEX_TAG_COLORS.down.background,
      textColor: INDEX_TAG_COLORS.down.text,
    };
  }

  return {
    backgroundColor: INDEX_TAG_COLORS.neutral.background,
    textColor: INDEX_TAG_COLORS.neutral.text,
  };
};

export interface IndexTagCellProps extends CellRendererProps {
  thresholds?: IndexThresholds;
}

export const IndexTagCell: React.FC<IndexTagCellProps> = ({
  cell,
  column,
  dataTestId,
  thresholds,
}) => {
  const value = cell.value;
  const align = column.align || 'center';

  if (value === undefined || value === null || value === '-' || value === '') {
    return (
      <StyledIndexTagCell align={align} data-testid={dataTestId}>
        -
      </StyledIndexTagCell>
    );
  }

  const cellThresholds = cell.tagThresholds || thresholds;
  const { backgroundColor, textColor } = getTagColors(value, cellThresholds);

  return (
    <StyledIndexTagCell align={align} data-testid={dataTestId}>
      <StyledIndexTag
        backgroundColor={backgroundColor}
        textColor={textColor}
        data-testid={dataTestId ? `${dataTestId}-tag` : undefined}
      >
        {value}
      </StyledIndexTag>
    </StyledIndexTagCell>
  );
};
