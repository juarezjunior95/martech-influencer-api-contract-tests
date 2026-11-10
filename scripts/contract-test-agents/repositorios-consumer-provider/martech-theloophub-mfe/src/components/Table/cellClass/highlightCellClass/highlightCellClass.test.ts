import { CellClassParams } from 'ag-grid-community';

import { highlightCellClass } from './highlightCellClass';

describe('highlightCellClass', () => {
  const createMockParams = (
    field: string,
    context?: any,
    data?: any,
  ): CellClassParams => {
    return {
      colDef: { field },
      context,
      data,
      node: {} as any,
      api: {} as any,
      column: {} as any,
      value: undefined,
      rowIndex: 0,
    } as CellClassParams;
  };

  it('should return empty array when context is undefined', () => {
    const params = createMockParams('testField', undefined, {});
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when context is null', () => {
    const params = createMockParams('testField', null, {});
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when highlightedItems is undefined', () => {
    const params = createMockParams('testField', {}, {});
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when highlightedItems is null', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: null },
      {},
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when highlightedItems is empty array', () => {
    const params = createMockParams('testField', { highlightedItems: [] }, {});
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should add ag-item-highlighted class for label field', () => {
    const params = createMockParams(
      'label',
      { highlightedItems: ['item1'] },
      {},
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should add ag-item-highlighted class for label field regardless of data', () => {
    const params = createMockParams(
      'label',
      { highlightedItems: ['item1'] },
      { audience: 'not-highlighted' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should use default highlightItemProperty (audience) when not specified', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['audience1'] },
      { audience: 'audience1' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should not highlight when audience is not in highlightedItems', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['audience1'] },
      { audience: 'audience2' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should use custom highlightItemProperty when specified', () => {
    const params = createMockParams(
      'testField',
      {
        highlightedItems: ['custom1'],
        highlightItemProperty: 'customProperty',
      },
      { customProperty: 'custom1' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should not highlight when custom property is not in highlightedItems', () => {
    const params = createMockParams(
      'testField',
      {
        highlightedItems: ['custom1'],
        highlightItemProperty: 'customProperty',
      },
      { customProperty: 'custom2' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when data is undefined', () => {
    const params = createMockParams('testField', {
      highlightedItems: ['item1'],
    });
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when data is null', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['item1'] },
      null,
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when itemProperty is missing in data', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['item1'] },
      { otherProperty: 'value' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should handle highlightedItems with multiple values', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['audience1', 'audience2', 'audience3'] },
      { audience: 'audience2' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should not highlight when itemValue is falsy (empty string)', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: [''] },
      { audience: '' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should not highlight when itemValue is falsy (0)', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: [0] },
      { audience: 0 },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should not highlight when itemValue is falsy (false)', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: [false] },
      { audience: false },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should highlight when itemValue is truthy non-string (number)', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: [123] },
      { audience: 123 },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle case-sensitive matching', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['Audience1'] },
      { audience: 'audience1' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should handle exact string matching', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['test'] },
      { audience: 'test123' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should work with label field even when highlightItemProperty is custom', () => {
    const params = createMockParams(
      'label',
      {
        highlightedItems: ['item1'],
        highlightItemProperty: 'customProperty',
      },
      { customProperty: 'different' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle field names with special characters', () => {
    const params = createMockParams(
      'field-name_123',
      { highlightedItems: ['audience1'] },
      { audience: 'audience1' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle empty field name', () => {
    const params = createMockParams(
      '',
      { highlightedItems: ['audience1'] },
      { audience: 'audience1' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle data with multiple properties', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['target'] },
      {
        audience: 'target',
        otherProp: 'value1',
        anotherProp: 'value2',
      },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle highlightedItems with duplicate values', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['audience1', 'audience1', 'audience2'] },
      { audience: 'audience1' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle context with additional properties', () => {
    const params = createMockParams(
      'testField',
      {
        highlightedItems: ['audience1'],
        highlightItemProperty: 'audience',
        extraProperty: 'ignored',
        anotherProperty: 123,
      },
      { audience: 'audience1' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle colDef without field', () => {
    const params = {
      colDef: {},
      context: { highlightedItems: ['audience1'] },
      data: { audience: 'audience1' },
      node: {} as any,
      api: {} as any,
      column: {} as any,
      value: undefined,
      rowIndex: 0,
    } as CellClassParams;

    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should be immutable - not modify input params', () => {
    const originalContext = {
      highlightedItems: ['audience1'],
      highlightItemProperty: 'audience',
    };
    const originalData = { audience: 'audience1' };
    const params = createMockParams('testField', originalContext, originalData);

    highlightCellClass(params);

    expect(params.context.highlightedItems).toEqual(['audience1']);
    expect(params.context.highlightItemProperty).toBe('audience');
    expect(params.data.audience).toBe('audience1');
  });

  it('should handle consecutive calls with same params', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['audience1'] },
      { audience: 'audience1' },
    );

    const result1 = highlightCellClass(params);
    const result2 = highlightCellClass(params);

    expect(result1).toEqual(result2);
  });

  it('should return a new array instance each time', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: ['audience1'] },
      { audience: 'audience1' },
    );

    const result1 = highlightCellClass(params);
    const result2 = highlightCellClass(params);

    expect(result1).toEqual(result2);
    expect(result1).not.toBe(result2);
  });

  it('should handle label field with empty highlightedItems after early return check', () => {
    const params = createMockParams('label', { highlightedItems: [] }, {});
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should handle numeric field names', () => {
    const params = createMockParams(
      '123',
      { highlightedItems: ['audience1'] },
      { audience: 'audience1' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle itemValue as object (should not match)', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: [{ id: 1 }] },
      { audience: { id: 1 } },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should handle itemValue as array (should not match)', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: [['item1']] },
      { audience: ['item1'] },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual([]);
  });

  it('should prioritize label field over any other logic', () => {
    const params = createMockParams(
      'label',
      {
        highlightedItems: ['audience1'],
        highlightItemProperty: 'audience',
      },
      { audience: 'different-value' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle negative numbers in highlightedItems', () => {
    const params = createMockParams(
      'testField',
      { highlightedItems: [-1, -2, -3] },
      { audience: -2 },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should handle very long highlightedItems array', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => `item${i}`);
    const params = createMockParams(
      'testField',
      { highlightedItems: largeArray },
      { audience: 'item500' },
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });

  it('should maintain performance with large data objects', () => {
    const largeData: any = {};
    for (let i = 0; i < 1000; i++) {
      largeData[`property${i}`] = `value${i}`;
    }
    largeData.audience = 'target';

    const params = createMockParams(
      'testField',
      { highlightedItems: ['target'] },
      largeData,
    );
    const result = highlightCellClass(params);

    expect(result).toEqual(['ag-item-highlighted']);
  });
});
