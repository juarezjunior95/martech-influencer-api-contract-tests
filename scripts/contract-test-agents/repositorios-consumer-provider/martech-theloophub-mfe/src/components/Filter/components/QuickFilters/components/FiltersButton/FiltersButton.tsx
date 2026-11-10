import { memo } from 'react';

import FiltersIcon from 'assets/icons/filters.svg';
import { useGoogleAnalytics } from 'hooks';

import {
  QuickFiltersBadge,
  QuickFiltersButton,
} from '../../QuickFilters.styles';

interface FiltersButtonProps {
  totalAppliedFilters: number;
  onOpenModal: () => void;
  dataTestId?: string;
}

const FiltersButtonComponent = ({
  totalAppliedFilters,
  onOpenModal,
  dataTestId,
}: FiltersButtonProps) => {
  const trackGA = useGoogleAnalytics();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    trackGA({
      event_category: 'Filter',
      event_action: 'Click',
      event_label: 'Filters',
    });

    onOpenModal?.();
  };

  return (
    <QuickFiltersButton
      data-testid={dataTestId ? `filters-button-${dataTestId}` : undefined}
      size="medium"
      variant="secondary"
      onClick={handleClick}
    >
      <div
        data-testid={
          dataTestId ? `filters-button-icon-${dataTestId}` : undefined
        }
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <img
          data-testid={
            dataTestId ? `filters-button-icon-img-${dataTestId}` : undefined
          }
          src={FiltersIcon}
          alt="Filters"
        />{' '}
        Filters{' '}
        {totalAppliedFilters > 0 && (
          <QuickFiltersBadge
            data-testid={
              dataTestId ? `filters-button-badge-${dataTestId}` : undefined
            }
          >
            {totalAppliedFilters}
          </QuickFiltersBadge>
        )}
      </div>
    </QuickFiltersButton>
  );
};

FiltersButtonComponent.displayName = 'FiltersButton';

export const FiltersButton = memo(FiltersButtonComponent);
