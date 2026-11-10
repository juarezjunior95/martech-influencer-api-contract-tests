import { TableDataType } from 'components/Table/types';

import { splitGenericTable } from './splitGenericTable';

describe('splitGenericTable', () => {
  it('should split table by column groups', () => {
    const data: TableDataType = {
      header: [
        { title: 'Name', id: 'name' },
        { title: 'Age', id: 'age' },
      ],
      rows: [[{ name: { value: 'John' }, age: { value: 30 } }]],
    };

    const splits = [['Name'], ['Age']];
    const result = splitGenericTable(data, splits);

    expect(result['Name']).toBeDefined();
    expect(result['Age']).toBeDefined();
  });

  it('should filter headers by split groups', () => {
    const data: TableDataType = {
      header: [
        { title: 'Name', id: 'name' },
        { title: 'Age', id: 'age' },
      ],
      rows: [],
    };

    const splits = [['Name']];
    const result = splitGenericTable(data, splits);

    expect(result['Name'].header).toHaveLength(1);
    expect(result['Name'].header[0].title).toBe('Name');
  });

  it('should filter rows by split groups', () => {
    const data: TableDataType = {
      header: [
        { title: 'Name', id: 'name' },
        { title: 'Age', id: 'age' },
      ],
      rows: [[{ name: { value: 'John' }, age: { value: 30 } }]],
    };

    const splits = [['Name']];
    const result = splitGenericTable(data, splits);

    expect(result['Name'].rows[0][0]).toHaveProperty('name');
    expect(result['Name'].rows[0][0]).not.toHaveProperty('age');
  });

  it('should handle empty splits', () => {
    const data: TableDataType = {
      header: [{ title: 'Name', id: 'name' }],
      rows: [],
    };

    const result = splitGenericTable(data, []);

    expect(result).toEqual({});
  });

  it('should handle nested header children', () => {
    const data: TableDataType = {
      header: [
        {
          title: 'Group',
          id: 'group',
          children: [{ title: 'Name', id: 'name' }],
        },
      ],
      rows: [[{ name: { value: 'John' } }]],
    };

    const splits = [['Group']];
    const result = splitGenericTable(data, splits);

    expect(result['Group']).toBeDefined();
  });
});
