import { useMemo } from 'react';

import type { StackedAreaColumn } from '../types';
import { applyCellVisibility } from '../utils/cellVisibilityCalculator';

export function useCellVisibility(
  columns: StackedAreaColumn[],
  chartHeight: number,
): StackedAreaColumn[] {
  return useMemo(
    () => applyCellVisibility(columns, chartHeight),
    [columns, chartHeight],
  );
}
