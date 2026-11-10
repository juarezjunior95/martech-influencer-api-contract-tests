import React from 'react';

import { SegmentedControl, SegmentedControlOptions } from '@hexa-ui/components';

import {
  useSubFilterLogic,
  UseSubFilterLogicProps,
} from '../../hooks/useSubFilterLogic';
import { FilterSkeleton } from '../FilterSkeleton/FilterSkeleton';

export interface SubFilterSegmentedControlProps extends UseSubFilterLogicProps {
  dataTestId?: string;
}

export const SubFilterSegmentedControl: React.FC<
  SubFilterSegmentedControlProps
> = ({ dataTestId, ...props }) => {
  const {
    options,
    currentValue,
    isDisabled,
    isInUse,
    isHidden,
    isLoaded,
    handleOnChange,
  } = useSubFilterLogic(props);

  if (isHidden) {
    return null;
  }

  if (!isLoaded) {
    return (
      <FilterSkeleton
        dataTestId={dataTestId ? `skeleton-${dataTestId}` : undefined}
      />
    );
  }

  if (!options.length) {
    return null;
  }

  return (
    <div data-testid={dataTestId}>
      <SegmentedControl
        value={currentValue as string}
        onValueChange={(value) => handleOnChange(value)}
        options={options as SegmentedControlOptions[]}
        disabled={isDisabled || isInUse}
        data-testid={dataTestId ? `${dataTestId}-control` : undefined}
      />
    </div>
  );
};
