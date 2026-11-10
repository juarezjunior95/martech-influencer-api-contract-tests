import { CellClassParams } from 'ag-grid-community';

import { cellGroupClass } from './cellGroupClass';

describe('cellGroupClass', () => {
  const createMockParams = (field: string, data?: any): CellClassParams => {
    return {
      colDef: { field },
      data,
      node: {} as any,
      api: {} as any,
      column: {} as any,
      value: undefined,
      rowIndex: 0,
    } as CellClassParams;
  };

  it('should return empty array when no config is provided', () => {
    const params = createMockParams('testField', {});
    const result = cellGroupClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when data is undefined', () => {
    const params = createMockParams('testField');
    const result = cellGroupClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when data is null', () => {
    const params = createMockParams('testField', null);
    const result = cellGroupClass(params);

    expect(result).toEqual([]);
  });

  it('should add ag-cell-first-of-group class when isFirstOfGroup is true', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toEqual(['ag-cell-first-of-group']);
  });

  it('should add ag-cell-last-of-group class when isLastOfGroup is true', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isLastOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toEqual(['ag-cell-last-of-group']);
  });

  it('should add both classes when isFirstOfGroup and isLastOfGroup are true', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: true,
        isLastOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toContain('ag-cell-first-of-group');
    expect(result).toContain('ag-cell-last-of-group');
    expect(result).toHaveLength(2);
  });

  it('should return empty array when both flags are false', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: false,
        isLastOfGroup: false,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toEqual([]);
  });

  it('should handle config with only isFirstOfGroup defined', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toEqual(['ag-cell-first-of-group']);
  });

  it('should handle config with only isLastOfGroup defined', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isLastOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toEqual(['ag-cell-last-of-group']);
  });

  it('should work with different field names', () => {
    const params = createMockParams('customField', {
      customField_config: {
        isFirstOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toEqual(['ag-cell-first-of-group']);
  });

  it('should handle field with special characters', () => {
    const params = createMockParams('field-name_123', {
      'field-name_123_config': {
        isFirstOfGroup: true,
        isLastOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toContain('ag-cell-first-of-group');
    expect(result).toContain('ag-cell-last-of-group');
  });

  it('should ignore other config properties', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: true,
        isLastOfGroup: true,
        otherProperty: 'ignored',
        anotherProperty: 123,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toHaveLength(2);
    expect(result).toContain('ag-cell-first-of-group');
    expect(result).toContain('ag-cell-last-of-group');
  });

  it('should return empty array when config is null', () => {
    const params = createMockParams('testField', {
      testField_config: null,
    });
    const result = cellGroupClass(params);

    expect(result).toEqual([]);
  });

  it('should return empty array when config is undefined', () => {
    const params = createMockParams('testField', {
      testField_config: undefined,
    });
    const result = cellGroupClass(params);

    expect(result).toEqual([]);
  });

  it('should handle isFirstOfGroup as falsy value (0)', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: 0,
        isLastOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toEqual(['ag-cell-last-of-group']);
  });

  it('should handle isLastOfGroup as falsy value (empty string)', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: true,
        isLastOfGroup: '',
      },
    });
    const result = cellGroupClass(params);

    expect(result).toEqual(['ag-cell-first-of-group']);
  });

  it('should handle truthy values for flags (non-boolean)', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: 'yes',
        isLastOfGroup: 1,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toContain('ag-cell-first-of-group');
    expect(result).toContain('ag-cell-last-of-group');
    expect(result).toHaveLength(2);
  });

  it('should return unique classes (no duplicates)', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: true,
        isLastOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    // Verifica que não há duplicatas
    const uniqueClasses = [...new Set(result)];
    expect(result).toEqual(uniqueClasses);
  });

  it('should handle empty field name', () => {
    const params = createMockParams('', {
      _config: {
        isFirstOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    expect(result).toEqual(['ag-cell-first-of-group']);
  });

  it('should handle colDef without field', () => {
    const params = {
      colDef: {},
      data: {
        undefined_config: {
          isFirstOfGroup: true,
        },
      },
      node: {} as any,
      api: {} as any,
      column: {} as any,
      value: undefined,
      rowIndex: 0,
    } as CellClassParams;

    const result = cellGroupClass(params);

    expect(result).toEqual(['ag-cell-first-of-group']);
  });

  it('should handle data with multiple config keys', () => {
    const params = createMockParams('field1', {
      field1_config: {
        isFirstOfGroup: true,
      },
      field2_config: {
        isLastOfGroup: true,
      },
    });
    const result = cellGroupClass(params);

    // Deve usar apenas field1_config
    expect(result).toEqual(['ag-cell-first-of-group']);
  });

  it('should maintain performance with large data objects', () => {
    const largeData: any = {};
    for (let i = 0; i < 1000; i++) {
      largeData[`field${i}_config`] = {
        isFirstOfGroup: false,
        isLastOfGroup: false,
      };
    }
    largeData.testField_config = {
      isFirstOfGroup: true,
      isLastOfGroup: true,
    };

    const params = createMockParams('testField', largeData);
    const result = cellGroupClass(params);

    expect(result).toContain('ag-cell-first-of-group');
    expect(result).toContain('ag-cell-last-of-group');
  });

  it('should be immutable - not modify input params', () => {
    const originalData = {
      testField_config: {
        isFirstOfGroup: true,
        isLastOfGroup: true,
      },
    };
    const params = createMockParams('testField', originalData);

    cellGroupClass(params);

    // Verifica que os dados originais não foram modificados
    expect(params.data.testField_config.isFirstOfGroup).toBe(true);
    expect(params.data.testField_config.isLastOfGroup).toBe(true);
  });

  it('should handle consecutive calls with same params', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: true,
        isLastOfGroup: true,
      },
    });

    const result1 = cellGroupClass(params);
    const result2 = cellGroupClass(params);

    expect(result1).toEqual(result2);
  });

  it('should return a new array instance each time', () => {
    const params = createMockParams('testField', {
      testField_config: {
        isFirstOfGroup: true,
      },
    });

    const result1 = cellGroupClass(params);
    const result2 = cellGroupClass(params);

    // Mesmos valores, mas instâncias diferentes
    expect(result1).toEqual(result2);
    expect(result1).not.toBe(result2);
  });
});
