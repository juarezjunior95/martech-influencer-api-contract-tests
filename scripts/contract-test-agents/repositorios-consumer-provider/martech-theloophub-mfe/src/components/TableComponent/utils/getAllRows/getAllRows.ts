import { TableCellType, TableRowType } from '../../types';

export interface FlatRow {
  row: Record<string, TableCellType | string | number | boolean>;
  groupIndex: number;
  rowIndex: number;
}

export const getAllRows = (rows: TableRowType[][]): FlatRow[] => {
  const allRows: FlatRow[] = [];

  rows.forEach((group, groupIndex) => {
    if (Array.isArray(group)) {
      group.forEach((row, rowIndex) => {
        if ('isEmpty' in row && row.isEmpty) {
          return;
        }
        allRows.push({
          row,
          groupIndex,
          rowIndex,
        });
      });
    }
  });

  return allRows;
};
