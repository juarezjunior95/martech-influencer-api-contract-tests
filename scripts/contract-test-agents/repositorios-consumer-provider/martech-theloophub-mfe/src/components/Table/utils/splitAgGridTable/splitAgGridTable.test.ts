import { splitAgGridTable } from './splitAgGridTable';

describe('splitAgGridTable', () => {
  it('should split table by column groups', () => {
    const data = {
      columnDefs: [
        { field: 'name', headerName: 'Name' },
        { field: 'age', headerName: 'Age' },
      ],
      rowData: [{ name: 'John', age: 30 }],
    };

    const splits = [['Name'], ['Age']];
    const result = splitAgGridTable(data, splits);

    expect(result['Name']).toBeDefined();
    expect(result['Age']).toBeDefined();
  });

  it('should filter columnDefs by split groups', () => {
    const data = {
      columnDefs: [
        { field: 'name', headerName: 'Name' },
        { field: 'age', headerName: 'Age' },
      ],
      rowData: [],
    };

    const splits = [['Name']];
    const result = splitAgGridTable(data, splits);

    expect(result['Name'].columnDefs).toHaveLength(1);
    expect(result['Name'].columnDefs[0].field).toBe('name');
  });

  it('should filter rowData by split groups', () => {
    const data = {
      columnDefs: [
        { field: 'name', headerName: 'Name' },
        { field: 'age', headerName: 'Age' },
      ],
      rowData: [{ name: 'John', name_config: {}, age: 30, age_config: {} }],
    };

    const splits = [['Name']];
    const result = splitAgGridTable(data, splits);

    expect(result['Name'].rowData[0]).toHaveProperty('name');
    expect(result['Name'].rowData[0]).toHaveProperty('name_config');
  });

  it('should handle empty splits', () => {
    const data = {
      columnDefs: [{ field: 'name', headerName: 'Name' }],
      rowData: [],
    };

    const result = splitAgGridTable(data, []);

    expect(result).toEqual({});
  });

  it('should handle nested column children', () => {
    const data = {
      columnDefs: [
        {
          headerName: 'Group',
          children: [{ field: 'name', headerName: 'Name' }],
        },
      ],
      rowData: [{ name: 'John' }],
    };

    const splits = [['Group']];
    const result = splitAgGridTable(data, splits);

    expect(result['Group']).toBeDefined();
  });
});
