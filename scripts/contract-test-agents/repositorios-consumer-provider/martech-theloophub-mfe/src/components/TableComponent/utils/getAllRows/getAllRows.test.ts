import { getAllRows } from './getAllRows';

describe('getAllRows', () => {
  it('should flatten grouped rows', () => {
    const rows = [
      [{ col1: { value: 'A' } }, { col1: { value: 'B' } }],
      [{ col1: { value: 'C' } }],
    ];

    const result = getAllRows(rows);

    expect(result).toHaveLength(3);
    expect(result[0].groupIndex).toBe(0);
    expect(result[0].rowIndex).toBe(0);
    expect(result[1].groupIndex).toBe(0);
    expect(result[1].rowIndex).toBe(1);
    expect(result[2].groupIndex).toBe(1);
    expect(result[2].rowIndex).toBe(0);
  });

  it('should handle empty rows', () => {
    const result = getAllRows([]);
    expect(result).toHaveLength(0);
  });
});
