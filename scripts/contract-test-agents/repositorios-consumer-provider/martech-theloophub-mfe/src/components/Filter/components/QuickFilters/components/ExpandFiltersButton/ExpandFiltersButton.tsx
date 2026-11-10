import { memo } from 'react';

import { ExpandButton } from '../../QuickFilters.styles';

interface ExpandFiltersButtonProps {
  isExpanded: boolean;
  hiddenFiltersCount: number;
  onToggle: () => void;
  dataTestId?: string;
}

const ExpandFiltersButtonComponent = ({
  isExpanded,
  hiddenFiltersCount,
  onToggle,
  dataTestId,
}: ExpandFiltersButtonProps) => {
  return (
    <ExpandButton
      data-testid={
        dataTestId ? `expand-filters-button-${dataTestId}` : undefined
      }
      onClick={onToggle}
    >
      {isExpanded ? 'Collapse' : `+${hiddenFiltersCount} Filters`}
    </ExpandButton>
  );
};

ExpandFiltersButtonComponent.displayName = 'ExpandFiltersButton';

export const ExpandFiltersButton = memo(ExpandFiltersButtonComponent);
