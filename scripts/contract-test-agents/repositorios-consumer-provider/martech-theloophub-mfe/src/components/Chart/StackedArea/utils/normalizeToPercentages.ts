import type {
  AtLeastOne,
  StackedAreaColumn,
  StackedAreaSegment,
} from '../types';

export function normalizeColumnsToPercentages(
  columns: StackedAreaColumn[],
): StackedAreaColumn[] {
  return columns.map((column) => {
    const total = column.segments.reduce<number>((sum, seg) => {
      const val = Number(seg.value);
      return sum + (Number.isNaN(val) ? 0 : val);
    }, 0);

    if (total === 0) return column;

    const normalizedSegments = column.segments.map((segment) => {
      const val = Number(segment.value);
      return {
        ...segment,
        value: Number.isNaN(val) ? 0 : (val / total) * 100,
      };
    }) as AtLeastOne<StackedAreaSegment>;

    return {
      ...column,
      segments: normalizedSegments,
    };
  });
}
