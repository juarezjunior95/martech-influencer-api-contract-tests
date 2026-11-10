import { TableDataType } from 'components/Table/types';

import { mergeGenericTables } from './mergeGenericTable';

jest.mock('lodash', () => ({
  merge: (target: any, source: any) => Object.assign(target, source),
}));

describe('mergeGenericTables', () => {
  it('should merge headers from multiple tables', () => {
    const tables = [
      { header: [{ title: 'Name', id: 'name' }], rows: [] },
      { header: [{ title: 'Age', id: 'age' }], rows: [] },
    ];

    const result = mergeGenericTables(tables);

    expect(result.header).toHaveLength(2);
    expect(result.header[0].title).toBe('Name');
    expect(result.header[1].title).toBe('Age');
  });

  it('should remove duplicate headers', () => {
    const tables = [
      { header: [{ title: 'Name', id: 'name' }], rows: [] },
      { header: [{ title: 'Name', id: 'name' }], rows: [] },
    ];

    const result = mergeGenericTables(tables);

    expect(result.header).toHaveLength(1);
  });

  it('should merge rows from multiple tables', () => {
    const tables: TableDataType[] = [
      {
        header: [{ title: 'Name', id: 'name' }],
        rows: [[{ name: { value: 'John' } }]],
      },
      {
        header: [{ title: 'Age', id: 'age' }],
        rows: [[{ age: { value: 30 } }]],
      },
    ];

    const result = mergeGenericTables(tables);

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0][0]).toHaveProperty('name', { value: 'John' });
    expect(result.rows[0][0]).toHaveProperty('age', { value: 30 });
  });

  it('should handle empty tables array', () => {
    const tables = [{ header: [], rows: [] }];

    const result = mergeGenericTables(tables);

    expect(result.header).toEqual([]);
    expect(result.rows).toHaveLength(0);
  });
});
