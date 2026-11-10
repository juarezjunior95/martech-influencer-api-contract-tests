import { CELL_VISIBILITY_THRESHOLD } from '../constants';
import type {
  AtLeastOne,
  StackedAreaColumn,
  StackedAreaSegment,
} from '../types';

export function shouldShowCellNumber(cellHeightPx: number): boolean {
  return cellHeightPx >= CELL_VISIBILITY_THRESHOLD;
}

export function calculateCellHeight(
  value: number,
  totalValue: number,
  chartHeightPx: number,
): number {
  if (totalValue === 0) return 0;
  return (value / totalValue) * chartHeightPx;
}

function calculateColumnTotal(column: StackedAreaColumn): number {
  return column.segments.reduce((sum, seg) => {
    const val = Number(seg.value);
    return sum + (Number.isNaN(val) ? 0 : val);
  }, 0);
}

export function applyCellVisibility(
  columns: StackedAreaColumn[],
  chartHeightPx: number,
): StackedAreaColumn[] {
  return columns.map((column) => {
    const totalValue = calculateColumnTotal(column);

    const segmentsWithVisibility = column.segments.map((segment) => {
      const numericValue = Number(segment.value);
      const height = calculateCellHeight(
        Number.isNaN(numericValue) ? 0 : numericValue,
        totalValue,
        chartHeightPx,
      );
      const showNumber = shouldShowCellNumber(height);

      return {
        ...segment,
        height,
        showNumber,
      };
    }) as AtLeastOne<StackedAreaSegment>;

    return {
      ...column,
      segments: segmentsWithVisibility,
    };
  });
}

export function getCellVisibilityInfo(
  columnIndex: number,
  segmentIndex: number,
  columns: StackedAreaColumn[],
): { height: number; showNumber: boolean; value: number } | null {
  const column = columns[columnIndex];
  if (!column) return null;

  const segment = column.segments[segmentIndex];
  if (!segment) return null;

  const numericValue = Number(segment.value);
  return {
    height: segment.height ?? 0,
    showNumber: segment.showNumber ?? false,
    value: Number.isNaN(numericValue) ? 0 : numericValue,
  };
}
