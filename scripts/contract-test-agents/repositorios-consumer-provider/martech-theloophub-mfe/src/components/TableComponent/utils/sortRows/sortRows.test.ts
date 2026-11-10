import { FlatRow } from '../getAllRows';
import { sortRows } from './sortRows';

const getCellValue = (
  cell: FlatRow['row'][string],
): string | number | boolean | null | undefined => {
  if (typeof cell === 'object' && cell !== null && 'value' in cell) {
    return cell.value as string | number | boolean | null | undefined;
  }
  return cell as string | number | boolean | null | undefined;
};

describe('sortRows', () => {
  const createRows = (): FlatRow[] => [
    {
      row: { name: { value: 'Charlie' }, age: { value: 30 } },
      groupIndex: 0,
      rowIndex: 0,
    },
    {
      row: { name: { value: 'Alice' }, age: { value: 25 } },
      groupIndex: 0,
      rowIndex: 1,
    },
    {
      row: { name: { value: 'Bob' }, age: { value: 35 } },
      groupIndex: 0,
      rowIndex: 2,
    },
  ];

  it('should return original rows when no sortState', () => {
    const rows = createRows();
    const result = sortRows(rows);

    expect(result).toEqual(rows);
  });

  it('should sort strings ascending', () => {
    const rows = createRows();
    const result = sortRows(rows, { columnId: 'name', direction: 'asc' });

    expect(getCellValue(result[0].row.name)).toBe('Alice');
    expect(getCellValue(result[1].row.name)).toBe('Bob');
    expect(getCellValue(result[2].row.name)).toBe('Charlie');
  });

  it('should sort strings descending', () => {
    const rows = createRows();
    const result = sortRows(rows, { columnId: 'name', direction: 'desc' });

    expect(getCellValue(result[0].row.name)).toBe('Charlie');
    expect(getCellValue(result[1].row.name)).toBe('Bob');
    expect(getCellValue(result[2].row.name)).toBe('Alice');
  });

  it('should sort numbers ascending', () => {
    const rows = createRows();
    const result = sortRows(rows, { columnId: 'age', direction: 'asc' });

    expect(getCellValue(result[0].row.age)).toBe(25);
    expect(getCellValue(result[1].row.age)).toBe(30);
    expect(getCellValue(result[2].row.age)).toBe(35);
  });

  it('should sort numbers descending', () => {
    const rows = createRows();
    const result = sortRows(rows, { columnId: 'age', direction: 'desc' });

    expect(getCellValue(result[0].row.age)).toBe(35);
    expect(getCellValue(result[1].row.age)).toBe(30);
    expect(getCellValue(result[2].row.age)).toBe(25);
  });

  it('should handle null values - move to end on asc', () => {
    const rows: FlatRow[] = [
      { row: { name: { value: 'Bob' } }, groupIndex: 0, rowIndex: 0 },
      { row: { name: { value: null } }, groupIndex: 0, rowIndex: 1 },
      { row: { name: { value: 'Alice' } }, groupIndex: 0, rowIndex: 2 },
    ];

    const result = sortRows(rows, { columnId: 'name', direction: 'asc' });

    expect(getCellValue(result[0].row.name)).toBe('Alice');
    expect(getCellValue(result[1].row.name)).toBe('Bob');
    expect(getCellValue(result[2].row.name)).toBe(null);
  });

  it('should not mutate original array', () => {
    const rows = createRows();
    const originalFirst = rows[0];

    sortRows(rows, { columnId: 'name', direction: 'asc' });

    expect(rows[0]).toBe(originalFirst);
  });

  describe('formatted numeric strings', () => {
    it('should sort values with K suffix correctly', () => {
      const rows: FlatRow[] = [
        { row: { sales: { value: '85K' } }, groupIndex: 0, rowIndex: 0 },
        { row: { sales: { value: '120K' } }, groupIndex: 0, rowIndex: 1 },
        { row: { sales: { value: '95K' } }, groupIndex: 0, rowIndex: 2 },
      ];

      const result = sortRows(rows, { columnId: 'sales', direction: 'asc' });

      expect(getCellValue(result[0].row.sales)).toBe('85K');
      expect(getCellValue(result[1].row.sales)).toBe('95K');
      expect(getCellValue(result[2].row.sales)).toBe('120K');
    });

    it('should sort percentage values correctly', () => {
      const rows: FlatRow[] = [
        { row: { growth: { value: '+15%' } }, groupIndex: 0, rowIndex: 0 },
        { row: { growth: { value: '-3%' } }, groupIndex: 0, rowIndex: 1 },
        { row: { growth: { value: '+22%' } }, groupIndex: 0, rowIndex: 2 },
        { row: { growth: { value: '+8%' } }, groupIndex: 0, rowIndex: 3 },
      ];

      const result = sortRows(rows, { columnId: 'growth', direction: 'asc' });

      expect(getCellValue(result[0].row.growth)).toBe('-3%');
      expect(getCellValue(result[1].row.growth)).toBe('+8%');
      expect(getCellValue(result[2].row.growth)).toBe('+15%');
      expect(getCellValue(result[3].row.growth)).toBe('+22%');
    });

    it('should sort percentage values descending', () => {
      const rows: FlatRow[] = [
        { row: { growth: { value: '+15%' } }, groupIndex: 0, rowIndex: 0 },
        { row: { growth: { value: '-3%' } }, groupIndex: 0, rowIndex: 1 },
        { row: { growth: { value: '+22%' } }, groupIndex: 0, rowIndex: 2 },
      ];

      const result = sortRows(rows, { columnId: 'growth', direction: 'desc' });

      expect(getCellValue(result[0].row.growth)).toBe('+22%');
      expect(getCellValue(result[1].row.growth)).toBe('+15%');
      expect(getCellValue(result[2].row.growth)).toBe('-3%');
    });

    it('should sort values with commas as thousand separators', () => {
      const rows: FlatRow[] = [
        { row: { amount: { value: '1,500' } }, groupIndex: 0, rowIndex: 0 },
        { row: { amount: { value: '850' } }, groupIndex: 0, rowIndex: 1 },
        { row: { amount: { value: '12,000' } }, groupIndex: 0, rowIndex: 2 },
      ];

      const result = sortRows(rows, { columnId: 'amount', direction: 'asc' });

      expect(getCellValue(result[0].row.amount)).toBe('850');
      expect(getCellValue(result[1].row.amount)).toBe('1,500');
      expect(getCellValue(result[2].row.amount)).toBe('12,000');
    });

    it('should handle mixed numeric and text values', () => {
      const rows: FlatRow[] = [
        { row: { value: { value: 'N/A' } }, groupIndex: 0, rowIndex: 0 },
        { row: { value: { value: '100' } }, groupIndex: 0, rowIndex: 1 },
        { row: { value: { value: '50' } }, groupIndex: 0, rowIndex: 2 },
      ];

      const result = sortRows(rows, { columnId: 'value', direction: 'asc' });

      expect(getCellValue(result[0].row.value)).toBe('50');
      expect(getCellValue(result[1].row.value)).toBe('100');
      expect(getCellValue(result[2].row.value)).toBe('N/A');
    });
  });
});
