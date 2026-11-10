import { Button } from '@hexa-ui/components';
import { useGoogleAnalytics } from 'hooks';

import { StyledFilterActions } from './FilterActions.styles';

interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
  hasFormFields: boolean;
  onClose: () => void;
  onCancel?: () => void;
  dataTestId?: string;
}

export const FilterActions = ({
  dataTestId,
  onReset,
  onApply,
  hasFormFields,
  onClose,
  onCancel,
}: FilterActionsProps) => {
  const trackGA = useGoogleAnalytics();

  const handleCloseModal = (e: React.MouseEvent) => {
    e.preventDefault();
    trackGA({
      event_category: 'Filter',
      event_action: 'Click',
      event_label: 'Close',
    });

    onCancel?.();
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();

    trackGA({
      event_category: 'Filter',
      event_action: 'Click',
      event_label: 'Clear All',
    });

    onReset?.();
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();

    trackGA({
      event_category: 'Filter',
      event_action: 'Click',
      event_label: 'Set Filter',
    });

    onApply?.();
    onClose?.();
  };

  const getClearFiltersStyles = () => {
    return {
      color: '#006EDB',
      backgroundColor: '#f6f6f6',
    };
  };

  return (
    <StyledFilterActions
      data-testid={dataTestId ? `filter-actions-${dataTestId}` : undefined}
    >
      <Button
        data-testid={
          dataTestId
            ? `filter-actions-clear-filters-button-${dataTestId}`
            : undefined
        }
        size="medium"
        type="button"
        style={getClearFiltersStyles()}
        onClick={handleClearAll}
      >
        Clear Filters
      </Button>

      <div style={{ marginLeft: 'auto' }}>
        <Button
          data-testid={
            dataTestId
              ? `filter-actions-cancel-button-${dataTestId}`
              : undefined
          }
          size="medium"
          variant="secondary"
          type="button"
          onClick={handleCloseModal}
        >
          Cancel
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          gap: '8px',
        }}
      >
        <Button
          data-testid={
            dataTestId ? `filter-actions-apply-button-${dataTestId}` : undefined
          }
          size="medium"
          variant="primary"
          type="submit"
          onClick={handleSubmit}
          disabled={!hasFormFields}
        >
          Apply
        </Button>
      </div>
    </StyledFilterActions>
  );
};
