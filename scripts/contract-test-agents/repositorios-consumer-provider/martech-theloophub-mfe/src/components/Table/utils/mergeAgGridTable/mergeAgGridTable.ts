/**
 * Merge the column definitions and row data from multiple Ag-Grid tables into a single object.
 * @param items Array of objects, each containing columnDefs and rowData from Ag-Grid tables.
 * @returns Object containing merged columnDefs and rowData.
 */
export function mergeAgGridTables(
  items: { columnDefs: any[]; rowData: any[] }[],
): { columnDefs: any[]; rowData: any[] } {
  const allColumnDefs = items.flatMap((item) => item.columnDefs);
  const seen = new Set();
  const mergedColumnDefs = allColumnDefs.filter((col) => {
    const key = col.field || col.headerName;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Merge de rowData (por índice)
  const maxRows = Math.max(...items.map((item) => item.rowData.length));
  const mergedRowData = Array.from({ length: maxRows }, (_, idx) => {
    return items.reduce((acc, item) => ({ ...acc, ...item.rowData[idx] }), {});
  });

  return {
    columnDefs: mergedColumnDefs,
    rowData: mergedRowData,
  };
}
