import { SortState } from '../../types';
import { FlatRow } from '../getAllRows';

const SUFFIX_MULTIPLIERS: Record<string, string> = {
  K: '000',
  k: '000',
  M: '000000',
  m: '000000',
  B: '000000000',
  b: '000000000',
};

type ComparableValue = string | number | boolean;

const parseNumericValue = (value: ComparableValue): number | null => {
  if (typeof value === 'number') return value;

  const str = String(value).trim();

  const cleaned = str
    .replaceAll(',', '')
    .replaceAll(/\s/g, '')
    .replace(/[KkMmBb]$/, (match) => SUFFIX_MULTIPLIERS[match] || '')
    .replace(/%$/, '')
    .replace(/^\+/, '');

  const parsed = Number.parseFloat(cleaned);
  return Number.isNaN(parsed) ? null : parsed;
};

type CellPrimitive = ComparableValue | null | undefined;

const isPrimitiveCellValue = (value: unknown): value is CellPrimitive =>
  value === null ||
  value === undefined ||
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean';

const extractRawCellValue = (cell: unknown): CellPrimitive => {
  if (
    typeof cell === 'object' &&
    cell !== null &&
    !Array.isArray(cell) &&
    'value' in cell
  ) {
    const value = cell.value;
    return isPrimitiveCellValue(value) ? value : null;
  }
  return isPrimitiveCellValue(cell) ? cell : null;
};

const compareNonNullCellValues = (
  valueA: ComparableValue,
  valueB: ComparableValue,
): number => {
  const numA = parseNumericValue(valueA);
  const numB = parseNumericValue(valueB);

  if (numA !== null && numB !== null) {
    return numA - numB;
  }
  if (numA !== null && numB === null) {
    return -1;
  }
  if (numA === null && numB !== null) {
    return 1;
  }

  const strA = String(valueA).toLowerCase();
  const strB = String(valueB).toLowerCase();
  return strA.localeCompare(strB);
};

export const sortRows = (
  rowsToSort: FlatRow[],
  sortState?: SortState,
): FlatRow[] => {
  if (!sortState) return rowsToSort;

  const { columnId, direction } = sortState;

  return [...rowsToSort].sort((a, b) => {
    const rawA = extractRawCellValue(a.row[columnId]);
    const rawB = extractRawCellValue(b.row[columnId]);

    if (rawA === undefined || rawA === null) {
      return direction === 'asc' ? 1 : -1;
    }
    if (rawB === undefined || rawB === null) {
      return direction === 'asc' ? -1 : 1;
    }

    const comparison = compareNonNullCellValues(rawA, rawB);
    return direction === 'asc' ? comparison : -comparison;
  });
};
