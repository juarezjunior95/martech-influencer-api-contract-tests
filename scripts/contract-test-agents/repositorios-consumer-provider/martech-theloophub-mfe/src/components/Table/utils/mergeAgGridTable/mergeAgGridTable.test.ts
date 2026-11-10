import { mergeAgGridTables } from './mergeAgGridTable';

describe('mergeAgGridTables', () => {
  it('should merge columnDefs from multiple tables', () => {
    const tables = [
      {
        columnDefs: [{ field: 'name', headerName: 'Name' }],
        rowData: [],
      },
      {
        columnDefs: [{ field: 'age', headerName: 'Age' }],
        rowData: [],
      },
    ];

    const result = mergeAgGridTables(tables);

    expect(result.columnDefs).toHaveLength(2);
    expect(result.columnDefs[0].field).toBe('name');
    expect(result.columnDefs[1].field).toBe('age');
  });

  it('should remove duplicate columnDefs', () => {
    const tables = [
      {
        columnDefs: [{ field: 'name', headerName: 'Name' }],
        rowData: [],
      },
      {
        columnDefs: [{ field: 'name', headerName: 'Name' }],
        rowData: [],
      },
    ];

    const result = mergeAgGridTables(tables);

    expect(result.columnDefs).toHaveLength(1);
  });

  it('should merge rowData from multiple tables', () => {
    const tables = [
      {
        columnDefs: [{ field: 'name' }],
        rowData: [{ name: 'John' }],
      },
      {
        columnDefs: [{ field: 'age' }],
        rowData: [{ age: 30 }],
      },
    ];

    const result = mergeAgGridTables(tables);

    expect(result.rowData).toHaveLength(1);
    expect(result.rowData[0]).toEqual({ name: 'John', age: 30 });
  });

  it('should handle tables with different row counts', () => {
    const tables = [
      {
        columnDefs: [{ field: 'name' }],
        rowData: [{ name: 'John' }, { name: 'Jane' }],
      },
      {
        columnDefs: [{ field: 'age' }],
        rowData: [{ age: 30 }],
      },
    ];

    const result = mergeAgGridTables(tables);

    expect(result.rowData).toHaveLength(2);
    expect(result.rowData[0]).toEqual({ name: 'John', age: 30 });
    expect(result.rowData[1]).toEqual({ name: 'Jane' });
  });

  it('should handle empty tables', () => {
    const tables = [
      { columnDefs: [], rowData: [] },
      { columnDefs: [], rowData: [] },
    ];

    const result = mergeAgGridTables(tables);

    expect(result.columnDefs).toEqual([]);
    expect(result.rowData).toHaveLength(0);
  });

  it('should use headerName as key when field is not present', () => {
    const tables = [
      {
        columnDefs: [{ headerName: 'Name' }],
        rowData: [],
      },
      {
        columnDefs: [{ headerName: 'Name' }],
        rowData: [],
      },
    ];

    const result = mergeAgGridTables(tables);

    expect(result.columnDefs).toHaveLength(1);
  });
});
