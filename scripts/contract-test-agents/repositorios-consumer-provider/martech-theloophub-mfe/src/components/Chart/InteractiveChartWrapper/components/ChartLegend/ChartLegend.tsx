import React from 'react';

import { BrandAvatarItem } from 'components/BrandAvatar/Components/BrandAvatarItem';

import {
  StyledLegendGrid,
  StyledLegendItem,
} from '../../InteractiveChartWrapper.styles';
import { HoverState, LegendItem } from '../../types';

interface ChartLegendProps {
  items: (LegendItem | null)[];
  gridStyle: React.CSSProperties;
  getItemHoverState: (index: number) => HoverState;
}

const slugTitle = (title: string): string =>
  title.trim().split(/\s+/).join('-');

const nullLegendSlotKey = (
  items: (LegendItem | null)[],
  index: number,
): string => {
  const previousItem = items
    .slice(0, index)
    .reverse()
    .find((entry): entry is LegendItem => entry !== null);
  const nullsBefore = items
    .slice(0, index)
    .filter((entry) => entry === null).length;

  const anchor = previousItem ? slugTitle(previousItem.title) : 'start';

  return `empty-after-${anchor}-nulls-${nullsBefore}`;
};

export const ChartLegend: React.FC<ChartLegendProps> = ({
  items,
  gridStyle,
  getItemHoverState,
}) => {
  if (!items.length) return null;

  return (
    <StyledLegendGrid style={gridStyle} data-testid="chart-legend-grid">
      {items.map((item, index) => {
        if (!item) {
          const emptyKey = nullLegendSlotKey(items, index);

          return (
            <StyledLegendItem
              key={emptyKey}
              data-testid={`chart-legend-item-${emptyKey}`}
            />
          );
        }

        const hoverState = getItemHoverState(index);

        return (
          <StyledLegendItem
            key={`${item.title}_${index}`}
            isHovered={hoverState === 'hovered'}
            isNeutral={hoverState === 'neutral'}
            data-testid={`chart-legend-item-${index}`}
          >
            <BrandAvatarItem {...item} />
          </StyledLegendItem>
        );
      })}
    </StyledLegendGrid>
  );
};
