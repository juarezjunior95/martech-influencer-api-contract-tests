import React from 'react';

import { Select } from 'components/Form';
import { SelectProps } from 'components/Form/components/Select/types';

import {
  useSubFilterLogic,
  UseSubFilterLogicProps,
} from '../../hooks/useSubFilterLogic';
import { FilterSkeleton } from '../FilterSkeleton/FilterSkeleton';

export interface SubFilterSelectProps
  extends
    UseSubFilterLogicProps,
    Omit<SelectProps, 'id' | 'options' | 'onValueChange'> {
  dataTestId?: string;
  dataApiKey?: string;
}

export const SubFilterSelect: React.FC<SubFilterSelectProps> = ({
  // UseSubFilterLogicProps
  name,
  apiKey,
  stateKey,
  params,
  groupBy,
  iconsByValue,
  allKey,
  contextKey,
  onValueChange,
  dataTestId,
  dataApiKey,
  // Select
  ...selectProps
}) => {
  const {
    options,
    currentValue,
    isDisabled,
    isInUse,
    isHidden,
    isLoaded,
    handleOnChange,
  } = useSubFilterLogic({
    name,
    apiKey,
    stateKey,
    params,
    groupBy,
    iconsByValue,
    allKey,
    contextKey,
    onValueChange,
    dataApiKey,
  });

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

  return (
    <div style={{ minWidth: '120px' }} data-testid={dataTestId}>
      <Select
        id={stateKey}
        value={currentValue}
        onValueChange={handleOnChange}
        disabled={isDisabled || isInUse || selectProps.disabled}
        options={options}
        shape="pill"
        size="medium"
        aria-label={stateKey}
        data-testid={dataTestId ? `${dataTestId}-select` : undefined}
        {...selectProps}
      />
    </div>
  );
};
