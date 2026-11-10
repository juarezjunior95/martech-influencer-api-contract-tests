import { getAllFields } from './getAllFields';

describe('getAllFields', () => {
  it('should return empty array for empty defs', () => {
    const result = getAllFields([]);

    expect(result).toEqual([]);
  });

  it('should extract field from single column', () => {
    const defs = [{ field: 'name' }];
    const result = getAllFields(defs);

    expect(result).toEqual(['name']);
  });

  it('should extract fields from multiple columns', () => {
    const defs = [{ field: 'name' }, { field: 'age' }, { field: 'email' }];
    const result = getAllFields(defs);

    expect(result).toEqual(['name', 'age', 'email']);
  });

  it('should extract fields from nested children', () => {
    const defs = [
      { field: 'name' },
      {
        children: [{ field: 'age' }, { field: 'email' }],
      },
    ];
    const result = getAllFields(defs);

    expect(result).toEqual(['name', 'age', 'email']);
  });

  it('should handle deeply nested children', () => {
    const defs = [
      {
        children: [
          { field: 'level1' },
          {
            children: [{ field: 'level2' }, { field: 'level3' }],
          },
        ],
      },
    ];
    const result = getAllFields(defs);

    expect(result).toEqual(['level1', 'level2', 'level3']);
  });

  it('should skip columns without field', () => {
    const defs = [
      { field: 'name' },
      { headerName: 'No Field' },
      { field: 'age' },
    ];
    const result = getAllFields(defs);

    expect(result).toEqual(['name', 'age']);
  });
});
