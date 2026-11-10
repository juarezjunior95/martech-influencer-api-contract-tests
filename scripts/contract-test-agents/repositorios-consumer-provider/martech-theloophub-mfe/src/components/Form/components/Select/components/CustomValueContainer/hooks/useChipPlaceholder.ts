import React, { useMemo, useRef } from 'react';

import { Option } from 'models/Filters';

export type ChipPlaceholderOptionArg = Option | Option[];

export type ChipPlaceholderValue = ChipPlaceholderOptionArg | null;

type ChipPlaceholderCache = {
  previousPlaceholder: React.ReactNode | null;
  previousValueKey: string | null;
};

function computeChipPlaceholder(
  getChipPlaceholder: (options: ChipPlaceholderOptionArg) => React.ReactNode,
  valueKey: string | null,
  currentVal: ChipPlaceholderValue,
  cacheRef: React.MutableRefObject<ChipPlaceholderCache>,
): React.ReactNode {
  const { previousPlaceholder, previousValueKey } = cacheRef.current;

  if (valueKey === previousValueKey && previousPlaceholder !== null) {
    return previousPlaceholder;
  }

  if (!currentVal) {
    cacheRef.current = {
      previousPlaceholder: null,
      previousValueKey: null,
    };
    return null;
  }

  const newPlaceholder = getChipPlaceholder(currentVal);
  cacheRef.current = {
    previousPlaceholder: newPlaceholder,
    previousValueKey: valueKey,
  };
  return newPlaceholder;
}

export function useChipPlaceholder(
  getChipPlaceholder:
    ((options: ChipPlaceholderOptionArg) => React.ReactNode) | undefined,
  valueKey: string | null,
  currentValueRef: React.MutableRefObject<ChipPlaceholderValue>,
): React.ReactNode {
  const cacheRef = useRef<ChipPlaceholderCache>({
    previousPlaceholder: null,
    previousValueKey: null,
  });

  return useMemo(() => {
    if (!getChipPlaceholder) {
      cacheRef.current = {
        previousPlaceholder: null,
        previousValueKey: null,
      };
      return null;
    }

    return computeChipPlaceholder(
      getChipPlaceholder,
      valueKey,
      currentValueRef.current,
      cacheRef,
    );
  }, [getChipPlaceholder, valueKey, currentValueRef]);
}
