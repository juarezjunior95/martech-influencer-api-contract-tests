import { RowHeightParams } from 'ag-grid-community';

export const customRowHeight = (
  params: RowHeightParams,
  tableView: string,
  isExportPage = false,
  rowHeight?: number,
): number => {
  const isFirstRow = params.node.rowIndex === 0;

  if (isExportPage) {
    const exportRowHeight = rowHeight ?? 24;
    return isFirstRow ? 120 : exportRowHeight;
  }

  if (rowHeight) {
    return rowHeight;
  }

  return tableView === 'brands' && isFirstRow ? 140 : 36;
};
