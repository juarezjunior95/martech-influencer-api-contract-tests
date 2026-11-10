import { useCallback, useMemo } from 'react';

import { commercialResultsBigNumbersMock } from '../../__mocks__/BigNumbers';
import { UseBigNumberData } from '../../types';

export const useBigNumberData = ({
  formatMessage,
  periodValues,
  appliedPeriods,
  onFilterChange,
}: {
  formatMessage: (descriptor: { id: string }) => string;
  periodValues: readonly string[];
  appliedPeriods: string;
  onFilterChange: (key: string, value: string) => void;
}): UseBigNumberData => {
  const title = useMemo(() => {
    return formatMessage({
      id: 'ValueCreation.CommercialResults.bigNumbers.title',
    });
  }, [formatMessage]);
  const selectedBigNumberIndex = useMemo(() => {
    const index = periodValues.indexOf(appliedPeriods);
    return Math.max(index, 0);
  }, [appliedPeriods, periodValues]);
  const handleBigNumbersSelect = useCallback(
    (index: number) => {
      if (commercialResultsBigNumbersMock?.[index]) {
        onFilterChange('periods', periodValues[index]);
      }
    },
    [onFilterChange, periodValues],
  );

  return {
    bigNumbersData: commercialResultsBigNumbersMock,
    loading: false,
    error: null,
    title,
    selectedBigNumberIndex,
    handleBigNumbersSelect,
  };
};
