import { CellClassParams } from 'ag-grid-community';

import { mergeCellClass } from './mergeCellClass';

describe('mergeCellClass', () => {
  const createMockNode = (rowIndex: number, data: any) => ({
    rowIndex,
    data,
  });

  const createMockParams = (
    field: string,
    rowIndex: number,
    data: any,
    nodes: any[],
    merge?: boolean,
  ): CellClassParams => {
    return {
      colDef: {
        field,
        headerComponentParams: merge ? { merge } : undefined,
      },
      data,
      node: { rowIndex, data } as any,
      api: {
        forEachNode: (callback: (node: any) => void) => {
          nodes.forEach(callback);
        },
      } as any,
      column: {} as any,
      value: undefined,
    } as CellClassParams;
  };

  it('should return empty array when merge is false and no config', () => {
    const nodes = [createMockNode(0, { testField: 'value1' })];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      false,
    );
    const result = mergeCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when merge is undefined and no config', () => {
    const nodes = [createMockNode(0, { testField: 'value1' })];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
    );
    const result = mergeCellClass(params);

    expect(result).toEqual([]);
  });

  it('should add ag-cell-first-merge when merge is true and there are nodes after with same value', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(1, { testField: 'value1' }),
      createMockNode(2, { testField: 'value1' }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
  });

  it('should add ag-cell-hide when there is a node before with same value', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(1, { testField: 'value1' }),
      createMockNode(2, { testField: 'value1' }),
    ];
    const params = createMockParams(
      'testField',
      1,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-hide');
  });

  it('should add ag-cell-hide for last cell when there are nodes before with same value', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(1, { testField: 'value1' }),
      createMockNode(2, { testField: 'value1' }),
    ];
    const params = createMockParams(
      'testField',
      2,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-hide');
  });

  it('should not add merge classes when values are different', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(1, { testField: 'value2' }),
      createMockNode(2, { testField: 'value3' }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).not.toContain('ag-cell-hide');
    expect(result).not.toContain('ag-cell-first-merge');
  });

  it('should handle multiple groups of same values', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(1, { testField: 'value1' }),
      createMockNode(2, { testField: 'value2' }),
      createMockNode(3, { testField: 'value2' }),
    ];
    const params = createMockParams(
      'testField',
      2,
      { testField: 'value2' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
    expect(result).not.toContain('ag-cell-hide');
  });

  it('should add rowType class when config has rowType', () => {
    const nodes = [
      createMockNode(0, {
        testField: 'value1',
        testField_config: { rowType: 'header' },
      }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1', testField_config: { rowType: 'header' } },
      nodes,
    );
    const result = mergeCellClass(params);

    expect(result).toEqual(['ag-row-cell-header']);
  });

  it('should add multiple rowType classes when config has rowType', () => {
    const nodes = [
      createMockNode(0, {
        testField: 'value1',
        testField_config: { rowType: 'total' },
      }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1', testField_config: { rowType: 'total' } },
      nodes,
    );
    const result = mergeCellClass(params);

    expect(result).toEqual(['ag-row-cell-total']);
  });

  it('should combine merge and rowType classes', () => {
    const nodes = [
      createMockNode(0, {
        testField: 'value1',
        testField_config: { rowType: 'header' },
      }),
      createMockNode(1, {
        testField: 'value1',
        testField_config: { rowType: 'header' },
      }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1', testField_config: { rowType: 'header' } },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
    expect(result).toContain('ag-row-cell-header');
  });

  it('should return empty array when data is undefined', () => {
    const nodes = [createMockNode(0, undefined)];
    const params = createMockParams('testField', 0, undefined, nodes, true);
    const result = mergeCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when data is null', () => {
    const nodes = [createMockNode(0, null)];
    const params = createMockParams('testField', 0, null, nodes, true);
    const result = mergeCellClass(params);

    expect(result).toEqual([]);
  });

  it('should handle single node (no merge needed)', () => {
    const nodes = [createMockNode(0, { testField: 'value1' })];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).not.toContain('ag-cell-hide');
    expect(result).not.toContain('ag-cell-first-merge');
  });

  it('should handle empty nodes array', () => {
    const nodes: any[] = [];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toEqual([]);
  });

  it('should handle field with special characters', () => {
    const nodes = [
      createMockNode(0, { 'field-name_123': 'value1' }),
      createMockNode(1, { 'field-name_123': 'value1' }),
    ];
    const params = createMockParams(
      'field-name_123',
      0,
      { 'field-name_123': 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
  });

  it('should handle numeric values in field', () => {
    const nodes = [
      createMockNode(0, { testField: 123 }),
      createMockNode(1, { testField: 123 }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 123 },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
  });

  it('should handle boolean values in field', () => {
    const nodes = [
      createMockNode(0, { testField: true }),
      createMockNode(1, { testField: true }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: true },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
  });

  it('should handle null values in field', () => {
    const nodes = [
      createMockNode(0, { testField: null }),
      createMockNode(1, { testField: null }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: null },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
  });

  it('should handle undefined values in field', () => {
    const nodes = [
      createMockNode(0, { testField: undefined }),
      createMockNode(1, { testField: undefined }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: undefined },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
  });

  it('should handle empty string in field', () => {
    const nodes = [
      createMockNode(0, { testField: '' }),
      createMockNode(1, { testField: '' }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: '' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
  });

  it('should handle 0 in field', () => {
    const nodes = [
      createMockNode(0, { testField: 0 }),
      createMockNode(1, { testField: 0 }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 0 },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
  });

  it('should not add ag-cell-first-merge if beforeSameValue is true', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(1, { testField: 'value1' }),
      createMockNode(2, { testField: 'value1' }),
      createMockNode(3, { testField: 'value1' }),
    ];
    const params = createMockParams(
      'testField',
      2,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-hide');
    expect(result).not.toContain('ag-cell-first-merge');
  });

  it('should handle rowType with special characters', () => {
    const nodes = [
      createMockNode(0, {
        testField: 'value1',
        testField_config: { rowType: 'custom-type_123' },
      }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1', testField_config: { rowType: 'custom-type_123' } },
      nodes,
    );
    const result = mergeCellClass(params);

    expect(result).toEqual(['ag-row-cell-custom-type_123']);
  });

  it('should return empty array when config is null', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1', testField_config: null }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1', testField_config: null },
      nodes,
    );
    const result = mergeCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when config is undefined', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1', testField_config: undefined }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1', testField_config: undefined },
      nodes,
    );
    const result = mergeCellClass(params);

    expect(result).toEqual([]);
  });

  it('should handle config with other properties', () => {
    const nodes = [
      createMockNode(0, {
        testField: 'value1',
        testField_config: { rowType: 'header', otherProp: 'ignored' },
      }),
    ];
    const params = createMockParams(
      'testField',
      0,
      {
        testField: 'value1',
        testField_config: { rowType: 'header', otherProp: 'ignored' },
      },
      nodes,
    );
    const result = mergeCellClass(params);

    expect(result).toEqual(['ag-row-cell-header']);
  });

  it('should handle colDef without field', () => {
    const nodes = [createMockNode(0, { undefined: 'value1' })];
    const params = {
      colDef: { headerComponentParams: { merge: true } },
      data: { undefined: 'value1' },
      node: { rowIndex: 0, data: { undefined: 'value1' } } as any,
      api: {
        forEachNode: (callback: (node: any) => void) => {
          nodes.forEach(callback);
        },
      } as any,
      column: {} as any,
      value: undefined,
    } as CellClassParams;

    const result = mergeCellClass(params);

    expect(result).toEqual([]);
  });

  it('should handle headerComponentParams as undefined', () => {
    const nodes = [createMockNode(0, { testField: 'value1' })];
    const params = {
      colDef: { field: 'testField' },
      data: { testField: 'value1' },
      node: { rowIndex: 0, data: { testField: 'value1' } } as any,
      api: {
        forEachNode: (callback: (node: any) => void) => {
          nodes.forEach(callback);
        },
      } as any,
      column: {} as any,
      value: undefined,
    } as CellClassParams;

    const result = mergeCellClass(params);

    expect(result).toEqual([]);
  });

  it('should be immutable - not modify input params', () => {
    const originalData = {
      testField: 'value1',
      testField_config: { rowType: 'header' },
    };
    const nodes = [createMockNode(0, originalData)];
    const params = createMockParams('testField', 0, originalData, nodes, true);

    mergeCellClass(params);

    expect(params.data.testField).toBe('value1');
    expect(params.data.testField_config.rowType).toBe('header');
  });

  it('should handle consecutive calls with same params', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(1, { testField: 'value1' }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      true,
    );

    const result1 = mergeCellClass(params);
    const result2 = mergeCellClass(params);

    expect(result1).toEqual(result2);
  });

  it('should return a new array instance each time', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(1, { testField: 'value1' }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      true,
    );

    const result1 = mergeCellClass(params);
    const result2 = mergeCellClass(params);

    expect(result1).toEqual(result2);
    expect(result1).not.toBe(result2);
  });

  it('should handle large number of nodes efficiently', () => {
    const nodes = Array.from({ length: 1000 }, (_, i) =>
      createMockNode(i, { testField: i % 10 === 0 ? 'value1' : `value${i}` }),
    );
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return unique classes (no duplicates)', () => {
    const nodes = [
      createMockNode(0, {
        testField: 'value1',
        testField_config: { rowType: 'header' },
      }),
      createMockNode(1, {
        testField: 'value1',
        testField_config: { rowType: 'header' },
      }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1', testField_config: { rowType: 'header' } },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    const uniqueClasses = [...new Set(result)];
    expect(result).toEqual(uniqueClasses);
  });

  it('should handle merge with only after nodes', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(1, { testField: 'value2' }),
      createMockNode(2, { testField: 'value1' }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
    expect(result).not.toContain('ag-cell-hide');
  });

  it('should handle non-sequential row indices', () => {
    const nodes = [
      createMockNode(0, { testField: 'value1' }),
      createMockNode(5, { testField: 'value1' }),
      createMockNode(10, { testField: 'value1' }),
    ];
    const params = createMockParams(
      'testField',
      0,
      { testField: 'value1' },
      nodes,
      true,
    );
    const result = mergeCellClass(params);

    expect(result).toContain('ag-cell-first-merge');
  });
});
