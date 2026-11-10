import { CellContext, TableCellType, TableHeaderType } from '../types';

interface UseTableContextProps {
  header: TableHeaderType[];
  flatHeaders: TableHeaderType[];
}

export const useTableContext = ({
  header,
  flatHeaders,
}: UseTableContextProps) => {
  const findHeaderGroup = (
    columnId: string,
  ): { id?: string; title: string } | null => {
    for (const col of header) {
      if (col.children && col.children.length > 0) {
        const found = col.children.find((child) => child.id === columnId);
        if (found) {
          return { id: col.id, title: col.title };
        }
      }
    }
    return null;
  };

  const getRowLabelColumn = (): { id: string; title: string } => {
    const firstCol = flatHeaders[0];
    return {
      id: firstCol?.id || 'column-0',
      title: firstCol?.title || '',
    };
  };

  const extractCellValue = (
    cellData: TableCellType | string | number | boolean | undefined,
  ): string | number | null => {
    if (cellData === undefined || cellData === null) return null;
    if (typeof cellData === 'string' || typeof cellData === 'number') {
      return cellData;
    }
    if (typeof cellData === 'boolean') return null;
    if (typeof cellData === 'object' && 'value' in cellData) {
      return cellData.value ?? null;
    }
    return null;
  };

  const buildCellContext = (
    cell: TableCellType,
    columnId: string,
    columnTitle: string,
    rowData: Record<string, TableCellType>,
    rowIndex: number,
    groupIndex: number,
  ): CellContext => {
    const rowLabelColumn = getRowLabelColumn();
    const rowLabelCell = rowData[rowLabelColumn.id];
    const headerGroup = findHeaderGroup(columnId);

    const rowDataAny = rowData as Record<
      string,
      TableCellType | string | number | boolean
    >;
    const zoneRaw = rowDataAny['zone'];
    const countryRaw = rowDataAny['country'];

    const zone = extractCellValue(zoneRaw);
    const country = extractCellValue(countryRaw);

    return {
      cellId: cell.cellId,
      clickUrl: cell.clickUrl,
      rowLabel: rowLabelCell?.value ?? null,
      rowLabelColumnId: rowLabelColumn.id,
      rowLabelColumnTitle: rowLabelColumn.title,
      columnLabel: columnTitle,
      columnId,
      headerGroupLabel: headerGroup?.title,
      headerGroupId: headerGroup?.id,
      cellValue: cell.value ?? null,
      rowIndex,
      groupIndex,
      zone,
      country,
    };
  };

  return {
    findHeaderGroup,
    getRowLabelColumn,
    buildCellContext,
  };
};
