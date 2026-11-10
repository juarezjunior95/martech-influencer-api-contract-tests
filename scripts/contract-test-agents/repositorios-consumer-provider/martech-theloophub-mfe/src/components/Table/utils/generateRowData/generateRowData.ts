import { TableRowType } from '../../types';

const fillMissingKeys = (
  group: TableRowType[],
  allHeaderKeys: string[],
): void => {
  group.forEach((row) => {
    const rowEntries = Object.entries(row);
    if (rowEntries.length === allHeaderKeys.length) return;

    allHeaderKeys.forEach((key) => {
      const hasKey = rowEntries.some(([rowKey]) => rowKey === key);
      if (!hasKey) row[key] = {};
    });
  });
};

const buildCellConfig = (
  cell: any,
  chartType: string | undefined,
  rowType: 'even' | 'odd' | undefined,
  isFirstOfGroup: boolean,
  isLastOfGroup: boolean,
) => {
  let chartData = cell.chartData
    ? { ...cell.chartData, type: chartType }
    : undefined;

  if (typeof cell.value === 'object') {
    chartData = { ...cell.value, type: chartType };
  }

  return {
    ...cell,
    ...(chartData ? { chartData } : {}),
    ...(rowType ? { rowType } : {}),
    ...(isFirstOfGroup ? { isFirstOfGroup } : {}),
    ...(isLastOfGroup ? { isLastOfGroup } : {}),
  };
};

const processRow = (
  row: TableRowType,
  rowIndex: number,
  groupLength: number,
  rowType: 'even' | 'odd' | undefined,
  chartType: string | undefined,
): TableRowType => {
  const rowEntries = Object.entries(row);
  const displayRow: TableRowType = {};
  const isFirstOfGroup = rowIndex === 0;
  const isLastOfGroup = rowIndex === groupLength - 1;

  rowEntries.forEach(([key, cell]) => {
    if (cell === undefined) return;

    displayRow[key] = cell.value;
    displayRow[`${key}_config`] = buildCellConfig(
      cell,
      chartType,
      rowType,
      isFirstOfGroup,
      isLastOfGroup,
    );
  });

  return displayRow;
};
const getRowType = (rowCounter: number, shouldAddRowType: boolean) => {
  if (shouldAddRowType) {
    return rowCounter % 2 === 0 ? 'even' : 'odd';
  }
  return undefined;
};

export const generateRowData = (
  rows: TableRowType[][],
  chartType?: string,
  addEmptyRowAtStart = false,
  addEmptyRowAtEnd = false,
) => {
  const allRows: TableRowType[] = [];
  const allHeaderKeys = Array.from(
    rows.flat(Infinity).reduce((acc, cur) => {
      const keys = Object.keys(cur);
      keys.forEach((key) => acc.add(key));
      return acc;
    }, new Set<string>()),
  );

  if (addEmptyRowAtStart) {
    allRows.push({ isEmpty: true });
  }

  rows.forEach((group, groupIndex) => {
    let rowCounter = 0;
    const shouldAddRowType = group.length > 0;

    fillMissingKeys(group, allHeaderKeys);

    group.forEach((row, rowIndex) => {
      const rowType = getRowType(rowCounter, shouldAddRowType);

      const displayRow = processRow(
        row,
        rowIndex,
        group.length,
        rowType,
        chartType,
      );
      allRows.push(displayRow);

      if (rowType && !displayRow.isEmpty) rowCounter++;
    });

    if (groupIndex < rows.length - 1) {
      allRows.push({ isEmpty: true });
    }
  });

  if (addEmptyRowAtEnd) {
    allRows.push({ isEmpty: true });
  }

  return allRows;
};
