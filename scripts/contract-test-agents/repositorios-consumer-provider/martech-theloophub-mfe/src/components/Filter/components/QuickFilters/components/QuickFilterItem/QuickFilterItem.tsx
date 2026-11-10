import { memo } from 'react';

import { QUICK_FILTERS_COMPONENTS } from '../../rules';
import { QuickFilterItemProps } from '../../types';

const QuickFilterItemComponent = ({
  fieldKey,
  currentPage,
  debouncedOnValueChange,
  getCurrentValue,
  dataTestId,
}: QuickFilterItemProps) => {
  const Component = QUICK_FILTERS_COMPONENTS[fieldKey];

  return (
    <div
      data-testid={dataTestId ? `quick-filter-item-${dataTestId}` : undefined}
    >
      <Component
        dataTestId={dataTestId ? `${dataTestId}-component` : undefined}
        fieldKey={fieldKey}
        pageName={currentPage}
        onValueChange={(key, option) =>
          debouncedOnValueChange(key, option.value)
        }
        getCurrentValue={getCurrentValue}
      />
    </div>
  );
};

QuickFilterItemComponent.displayName = 'QuickFilterItem';

export const QuickFilterItem = memo(QuickFilterItemComponent);
