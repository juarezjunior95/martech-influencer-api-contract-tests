import type {
  TableCellType,
  TableDataType,
  TableRowType,
} from 'components/Table/types';

type DataRow = Record<string, TableCellType>;

const FIELDS = ['volume_growth_contr', 'volume_weight', 'sm_weight'] as const;

const isDataRow = (row: TableRowType): row is DataRow =>
  !('isEmpty' in row && (row as { isEmpty?: boolean }).isEmpty);

/**
 * Total row with 100% in these fields → `variationColor: 'neutral'` (same contract as the BFF).
 * Must run before `splitGenericTable` (each split drops the `portfolio` column from the row).
 */
export function applyTotalRowNeutralVariationColor(
  data: TableDataType,
): TableDataType {
  if (!data.rows?.length) return data;

  const rows = data.rows.map((group) =>
    group.map((row) => {
      if (!isDataRow(row)) return row;

      const portfolio = String(row.portfolio?.value ?? '').toLowerCase();
      if (portfolio !== 'total') return row;

      const next: DataRow = { ...row };
      for (const field of FIELDS) {
        const cell = row[field];
        if (!cell || typeof cell !== 'object') continue;
        if (Number(cell.value) !== 100) continue;
        next[field] = { ...cell, variationColor: 'neutral' };
      }
      return next;
    }),
  );

  return { ...data, rows };
}
