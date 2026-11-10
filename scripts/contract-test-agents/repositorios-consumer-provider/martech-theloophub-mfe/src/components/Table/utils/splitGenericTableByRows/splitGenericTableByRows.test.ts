import { TableDataType } from 'components/Table/types';

import { splitGenericTableByRows } from './splitGenericTableByRows';

describe('splitGenericTableByRows', () => {
  it('should split rows into pages', () => {
    const rows: TableDataType['rows'] = [
      [{ name: { value: 'John' } }, { name: { value: 'Jane' } }],
    ];

    const result = splitGenericTableByRows(rows, 1);

    expect(result).toHaveLength(2);
  });

  it('should return empty array for empty rows', () => {
    const result = splitGenericTableByRows([], 5);

    expect(result).toEqual([]);
  });

  it('should return empty array when rowsPerPage is 0', () => {
    const rows: TableDataType['rows'] = [[{ name: { value: 'John' } }]];

    const result = splitGenericTableByRows(rows, 0);

    expect(result).toEqual([]);
  });

  it('should handle single row within limit', () => {
    const rows: TableDataType['rows'] = [[{ name: { value: 'John' } }]];

    const result = splitGenericTableByRows(rows, 5);

    expect(result).toHaveLength(1);
  });

  it('should split large groups across pages', () => {
    const rows: TableDataType['rows'] = [
      [
        { name: { value: '1' } },
        { name: { value: '2' } },
        { name: { value: '3' } },
      ],
    ];

    const result = splitGenericTableByRows(rows, 2);

    expect(result).toHaveLength(2);
  });
});
