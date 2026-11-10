import React from 'react';

import { getVariationColor } from 'utils/getColor';

import { CellRendererProps } from '../../types';
import { TrendingDownIcon, TrendingUpIcon } from '../Icons';
import {
  CELL_COLORS,
  StyledNumberArrow,
  StyledNumberCell,
  StyledNumberMeasure,
  StyledNumberValue,
  StyledSecondaryValue,
  StyledUnitMeasure,
  StyledValueSeparator,
} from './CellRenderers.styles';

export const NumberCell: React.FC<CellRendererProps> = ({
  cell,
  column,
  dataTestId,
}) => {
  const {
    unitMeasure = '',
    secondaryValue,
    secondaryUnitMeasure = '',
    secondaryOnly = false,
    layout = 'inline',
    variationMeasure,
    variationDirection,
    iconVariationDirection,
    prefix,
  } = cell;

  const value = cell.value ?? '-';
  const showArrow = cell.showArrow === true;
  const colorize = cell.colorize !== false;

  const getIconDirection = (): 'up' | 'down' | 'neutral' => {
    if (iconVariationDirection) return iconVariationDirection;
    if (variationDirection === 'up' || variationDirection === 'down') {
      return variationDirection;
    }
    return 'neutral';
  };

  const getColor = (): string => {
    if (!colorize) return CELL_COLORS.primary;

    if (variationDirection) {
      if (variationDirection === 'neutral') return CELL_COLORS.neutral;
      return getVariationColor(variationDirection);
    }

    return CELL_COLORS.primary;
  };

  const getIconType = (): 'up' | 'down' | null => {
    if (!showArrow || (!variationDirection && !iconVariationDirection)) {
      return null;
    }

    const direction = getIconDirection();
    return direction === 'neutral' ? null : direction;
  };

  const color = getColor();
  const iconType = getIconType();
  const hasVariation = !!variationDirection || !!iconVariationDirection;
  const hasSecondaryValue = secondaryValue !== undefined;
  const isStacked = layout === 'stacked';
  const align = column.align || 'center';
  const isRightAligned = align === 'right';

  const renderArrow = () => {
    if (!iconType) return null;

    const Icon = iconType === 'up' ? TrendingUpIcon : TrendingDownIcon;

    return (
      <StyledNumberArrow
        color={color}
        position={isRightAligned ? 'left' : 'right'}
        data-testid={dataTestId ? `${dataTestId}-icon` : undefined}
      >
        <Icon color={color} />
      </StyledNumberArrow>
    );
  };

  if (secondaryOnly) {
    return (
      <StyledNumberCell
        data-testid={dataTestId}
        align={align}
        isPrimary={false}
        isStacked={false}
      >
        <StyledSecondaryValue
          data-testid={dataTestId ? `${dataTestId}-secondary` : undefined}
        >
          {value}
          {unitMeasure}
        </StyledSecondaryValue>
      </StyledNumberCell>
    );
  }

  return (
    <StyledNumberCell
      data-testid={dataTestId}
      align={align}
      isPrimary={!hasVariation && !hasSecondaryValue}
      isStacked={isStacked && hasSecondaryValue}
    >
      {isRightAligned && renderArrow()}
      <StyledNumberValue
        color={color}
        hasVariation={!!hasVariation}
        data-testid={dataTestId ? `${dataTestId}-value` : undefined}
      >
        {prefix && <span data-cell-text>{prefix}</span>}
        {value}
        {unitMeasure && (
          <StyledUnitMeasure
            data-testid={dataTestId ? `${dataTestId}-unit` : undefined}
          >
            {unitMeasure}
          </StyledUnitMeasure>
        )}
      </StyledNumberValue>
      {!isRightAligned && renderArrow()}
      {hasSecondaryValue && !isStacked && (
        <StyledValueSeparator>/</StyledValueSeparator>
      )}
      {hasSecondaryValue && (
        <StyledSecondaryValue
          data-testid={dataTestId ? `${dataTestId}-secondary` : undefined}
        >
          {secondaryValue}
          {secondaryUnitMeasure}
        </StyledSecondaryValue>
      )}
      {variationMeasure && (
        <StyledNumberMeasure
          color={color}
          data-testid={dataTestId ? `${dataTestId}-measure` : undefined}
        >
          {variationMeasure}
        </StyledNumberMeasure>
      )}
    </StyledNumberCell>
  );
};
