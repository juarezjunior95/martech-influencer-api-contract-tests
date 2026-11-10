import { TableDataType, TableHeaderType, TableRowType } from '../../types/data';

export type TableDatas = { [id: string]: TableDataType };

const traverseColumns = (
  columns: TableHeaderType[],
  fields: string[],
): void => {
  columns.forEach((column) => {
    if (column.id) fields.push(column.id);
    if (column.children) traverseColumns(column.children, fields);
  });
};

export const getAllIds = (headers: TableHeaderType[]): string[] => {
  const fields: string[] = [];
  traverseColumns(headers, fields);
  return fields;
};

const filterRowByIds = (row: TableRowType, ids: string[]): TableRowType => {
  const newRow: TableRowType = {};
  Object.entries(row).forEach(([key, value]) => {
    if (ids.includes(key)) newRow[key] = value;
  });
  return newRow;
};

const filterGroupByIds = (
  group: TableRowType[],
  ids: string[],
): TableRowType[] => {
  return group.map((row) => filterRowByIds(row, ids));
};

/**
 * Splits generic table data into multiple tables based on specified column groups.
 *
 * @param data - The generic table data containing header and row data
 * @param splits - An array of arrays containing column identifiers to group together
 * @returns An object mapping split identifiers to their corresponding generic table data
 *
 * Example:
 * splitGenericTable(
 *   { header: [...], rows: [...], empty: false },
 *   [['column1', 'column2'], ['column3', 'column4']]
 * )
 * // Returns:
 * {
 *   'column1': { header: [...], rows: [...], empty: false },
 *   'column3': { header: [...], rows: [...], empty: false }
 * }
 */
export const splitGenericTable = (
  data: TableDataType,
  splits: string[][],
): TableDatas => {
  if (
    !data ||
    !Array.isArray(data.header) ||
    !Array.isArray(data.rows) ||
    !Array.isArray(splits) ||
    splits.length === 0
  ) {
    return {};
  }

  const headers = splits.map((split) =>
    data.header.filter(
      (column) => split.includes(column.title) || split.includes(column.id),
    ),
  );

  const allIds = headers.map(getAllIds);

  const rows = allIds.map((ids) =>
    data.rows.map((group) => filterGroupByIds(group, ids)),
  );

  return allIds.reduce((result, ids, index) => {
    result[splits[index][0]] = {
      header: headers[index],
      rows: rows[index],
    };
    return result;
  }, {});
};
