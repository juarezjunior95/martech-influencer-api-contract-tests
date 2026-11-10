import { TableHeaderType } from '../../types';
import { getFlatHeaders } from './getFlatHeaders';

describe('getFlatHeaders', () => {
  it('should return flat headers when no children', () => {
    const headers: TableHeaderType[] = [
      { id: 'col1', title: 'Column 1' },
      { id: 'col2', title: 'Column 2' },
    ];

    const result = getFlatHeaders(headers);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('col1');
    expect(result[1].id).toBe('col2');
  });

  it('should flatten headers with children', () => {
    const headers: TableHeaderType[] = [
      { id: 'axis', title: 'Axis' },
      {
        id: 'group1',
        title: 'Group 1',
        children: [
          { id: 'sub1', title: 'Sub 1' },
          { id: 'sub2', title: 'Sub 2' },
        ],
      },
    ];

    const result = getFlatHeaders(headers);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('axis');
    expect(result[1].id).toBe('sub1');
    expect(result[2].id).toBe('sub2');
  });

  it('should handle empty array', () => {
    const result = getFlatHeaders([]);
    expect(result).toHaveLength(0);
  });
});
