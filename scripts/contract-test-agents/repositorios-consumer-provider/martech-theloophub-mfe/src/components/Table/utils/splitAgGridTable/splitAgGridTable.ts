import { AgGridData } from '../../types';

export type AgGridDatas = { [id: string]: AgGridData };

const traverseColumns = (columns: any[], fields: string[]): void => {
  columns.forEach((column) => {
    if (column.field) fields.push(column.field);
    if (column.children) traverseColumns(column.children, fields);
  });
};

const getAllFields = (columnDefs: any[]): string[] => {
  const fields: string[] = [];
  traverseColumns(columnDefs, fields);
  return fields;
};

const filterRowByFields = (
  row: Record<string, any>,
  fields: string[],
): Record<string, any> => {
  const filteredRow: Record<string, any> = {};
  const rowKeys = Object.keys(row);

  fields.forEach((field) => {
    rowKeys.forEach((key) => {
      if (key.startsWith(field)) filteredRow[key] = row[key];
    });
  });

  return filteredRow;
};

/**
 * Splits AG Grid table data into multiple tables based on specified column groups.
 *
 * @param data - The AG Grid table data containing column definitions and row data
 * @param splits - An array of arrays containing column identifiers to group together
 * @returns An object mapping split identifiers to their corresponding AG Grid table data
 *
 * Example:
 * splitAgGridTableData(
 *   { columnDefs: [...], rowData: [...] },
 *   [['column1', 'column2'], ['column3', 'column4']]
 * )
 * // Returns:
 * {
 *   'column1': { columnDefs: [...], rowData: [...] },
 *   'column3': { columnDefs: [...], rowData: [...] }
 * }
 */
export const splitAgGridTable = (
  data: AgGridData,
  splits: string[][],
): AgGridDatas => {
  const columnsDefs = splits.map((split) =>
    data.columnDefs.filter(
      (column) =>
        split.includes(column.headerName) || split.includes(column.field),
    ),
  );

  const allFields = columnsDefs.map(getAllFields);

  const rowsData = allFields.map((fields) =>
    data.rowData.map((row) => filterRowByFields(row, fields)),
  );

  return columnsDefs.reduce<AgGridDatas>((result, column, index) => {
    result[splits[index][0]] = {
      columnDefs: column,
      rowData: rowsData[index],
    };
    return result;
  }, {});
};
