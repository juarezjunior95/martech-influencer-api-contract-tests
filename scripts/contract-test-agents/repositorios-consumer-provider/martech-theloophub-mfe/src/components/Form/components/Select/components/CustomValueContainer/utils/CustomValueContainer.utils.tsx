import React from 'react';

import { StyledMoreCount } from '../CustomValueContainer.styles';

export const MAX_CHIPS_DISPLAY = 4;

export function buildRenderedChildren(
  displayChildren: React.ReactNode,
  isMulti: boolean,
  chips: boolean,
  totalValues: number,
  dataTestId?: string,
  maxChips: number = MAX_CHIPS_DISPLAY,
  allSelectedChip?: string,
): React.ReactNode {
  if (!Array.isArray(displayChildren)) {
    return displayChildren;
  }

  if (!isMulti || !chips) {
    return displayChildren;
  }

  if (allSelectedChip) {
    return [
      <StyledMoreCount
        key="all-selected"
        variant="allSelected"
        data-testid={dataTestId ? `${dataTestId}-all-selected` : undefined}
      >
        {allSelectedChip}
      </StyledMoreCount>,
      displayChildren[displayChildren.length - 1],
    ];
  }

  if (totalValues <= maxChips) {
    return displayChildren;
  }

  const filteredChildren = (displayChildren[0] as React.ReactNode[]).slice(
    0,
    maxChips,
  );

  return [
    ...filteredChildren,
    <StyledMoreCount
      key="more-count"
      data-testid={dataTestId ? `${dataTestId}-more-count` : undefined}
    >
      {`+${totalValues - maxChips}`}
    </StyledMoreCount>,
  ];
}
