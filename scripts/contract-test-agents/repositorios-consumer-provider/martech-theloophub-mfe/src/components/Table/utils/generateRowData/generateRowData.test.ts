import { generateRowData } from './generateRowData';

describe('generateRowData', () => {
  it('should generate row data from groups', () => {
    const rows = [[{ name: { value: 'John' } }]];
    const result = generateRowData(rows);

    expect(result).toHaveLength(1);
    expect(result[0]['name']).toBe('John');
  });

  it('should add empty row at start when specified', () => {
    const rows = [[{ name: { value: 'John' } }]];
    const result = generateRowData(rows, undefined, true, false);

    expect(result[0]).toEqual({ isEmpty: true });
  });

  it('should add empty row at end when specified', () => {
    const rows = [[{ name: { value: 'John' } }]];
    const result = generateRowData(rows, undefined, false, true);

    expect(result[result.length - 1]).toEqual({ isEmpty: true });
  });

  it('should add empty rows between groups', () => {
    const rows = [[{ name: { value: 'John' } }], [{ name: { value: 'Jane' } }]];
    const result = generateRowData(rows);

    expect(result.some((row) => row.isEmpty)).toBe(true);
  });

  it('should add row config with rowType', () => {
    const rows = [[{ name: { value: 'John' } }]];
    const result = generateRowData(rows);

    expect(result[0]['name_config']).toBeDefined();
    expect(result[0]['name_config'].rowType).toBeDefined();
  });

  it('should handle empty rows array', () => {
    const result = generateRowData([]);

    expect(result).toEqual([]);
  });
});
