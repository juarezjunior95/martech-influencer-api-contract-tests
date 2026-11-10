import { TableDataType, TableRowType } from '../../types';

/**
 * Splits a generic table data into groups of rows based on the specified number of rows per page.
 * Each page will contain at most `rowsPerPage` rows, maintaining original groups but dividing
 * them across pages when necessary to respect the row limit.
 *
 * Example:
 * Input: [[1,2,3,4,5],[6,7],[8,9,10,11]], rowsPerPage=3
 * Output: [[[1,2,3]], [[4,5],[6]], [[7],[8,9,10]], [[11]]]
 *
 * @param {TableDataType['rows']} rows - The rows of the table to be split (array of groups).
 * @param {number} rowsPerPage - The maximum number of rows allowed per page.
 * @returns {TableDataType['rows'][]} - An array of pages, each containing an array of row groups.
 */

export const splitGenericTableByRows = (
  rows: TableDataType['rows'],
  rowsPerPage: number,
): TableDataType['rows'][] => {
  if (!rows || rows.length === 0 || rowsPerPage <= 0) {
    return [];
  }

  const result: TableDataType['rows'][] = [];
  let currentPage: TableRowType[][] = [];
  let currentRowCount = 0;

  rows.forEach((group) => {
    let remainingRows = [...group];

    while (remainingRows.length > 0) {
      const availableSpace = rowsPerPage - currentRowCount;

      if (availableSpace <= 0) {
        if (currentPage.length > 0) {
          result.push(currentPage);
        }
        currentPage = [];
        currentRowCount = 0;
        continue;
      }

      const rowsToAdd = remainingRows.slice(0, availableSpace);
      const leftoverRows = remainingRows.slice(availableSpace);

      if (rowsToAdd.length > 0) {
        currentPage.push(rowsToAdd);
        currentRowCount += rowsToAdd.length;
      }

      remainingRows = leftoverRows;

      if (currentRowCount >= rowsPerPage) {
        result.push(currentPage);
        currentPage = [];
        currentRowCount = 0;
      }
    }
  });

  if (currentPage.length > 0) {
    result.push(currentPage);
  }

  return result;
};
