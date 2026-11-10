import { memo } from 'react';

import { TextButton } from '@hexa-ui/components';
import { Plus } from '@hexa-ui/icons';
import { useGoogleAnalytics } from 'hooks';

interface ClearAllButtonProps {
  onClearAll: () => void;
  dataTestId?: string;
}

const ClearAllButtonComponent = ({
  onClearAll,
  dataTestId,
}: ClearAllButtonProps) => {
  const trackGA = useGoogleAnalytics();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    trackGA({
      event_category: 'Filter',
      event_action: 'Click',
      event_label: 'Clear All',
    });

    onClearAll?.();
  };

  return (
    <TextButton
      data-testid={dataTestId ? `clear-all-button-${dataTestId}` : undefined}
      size="medium"
      style={{ color: '#0363c4', minWidth: 'fit-content' }}
      onClick={handleClick}
    >
      <Plus
        data-testid={
          dataTestId ? `clear-all-button-icon-${dataTestId}` : undefined
        }
        size="large"
        style={{
          transform: 'rotate(45deg)',
          marginRight: '5px',
          width: '20px',
        }}
      />
      Clear All
    </TextButton>
  );
};

ClearAllButtonComponent.displayName = 'ClearAllButton';

export const ClearAllButton = memo(ClearAllButtonComponent);
