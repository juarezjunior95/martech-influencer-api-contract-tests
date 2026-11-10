import { cellClass } from './cellClass';

jest.mock('components/Table/cellClass', () => ({
  cellClass: jest.fn(() => ['base-class']),
}));

describe('cellClass', () => {
  const createParams = (
    field: string,
    rowIndex: number,
    displayedRowCount: number,
    data?: Record<string, any>,
    value?: unknown,
  ) =>
    ({
      colDef: { field },
      rowIndex,
      data: data || {},
      value,
      api: {
        getDisplayedRowCount: () => displayedRowCount,
      },
    }) as any;

  it('should include base tableCellClass', () => {
    const params = createParams('test_field', 0, 5);

    const result = cellClass(params);

    expect(result).toContain('base-class');
  });

  it('should add ag-cell-total-hundred-metric when *_config has variationColor neutral', () => {
    const fields = [
      'volume_growth_contr',
      'volume_weight',
      'sm_weight',
    ] as const;

    for (const field of fields) {
      const params = createParams(field, 4, 5, {
        [`${field}_config`]: { variationColor: 'neutral' },
      });
      expect(cellClass(params)).toContain('ag-cell-total-hundred-metric');
    }
  });

  it('should not add ag-cell-total-hundred-metric without variationColor neutral', () => {
    const params = createParams('volume_growth_contr', 4, 5, {
      volume_growth_contr_config: { unitMeasure: '%' },
    });

    expect(cellClass(params)).not.toContain('ag-cell-total-hundred-metric');
  });

  it('should return ag-hidden-cell for brands_vol_og_vs_ly on last row', () => {
    const params = createParams('brands_vol_og_vs_ly', 4, 5);

    const result = cellClass(params);

    expect(result).toEqual(['ag-hidden-cell']);
  });

  it('should not return ag-hidden-cell for brands_vol_og_vs_ly on non-last row', () => {
    const params = createParams('brands_vol_og_vs_ly', 2, 5);

    const result = cellClass(params);

    expect(result).not.toEqual(['ag-hidden-cell']);
  });

  it('should add ag-cell-first-row for rowIndex 1', () => {
    const params = createParams('test_field', 1, 5);

    const result = cellClass(params);

    expect(result).toContain('ag-cell-first-row');
  });

  it('should add ag-cell-first-row when config has radiusTop', () => {
    const params = createParams('test_field', 0, 5, {
      test_field_config: { radiusTop: true },
    });

    const result = cellClass(params);

    expect(result).toContain('ag-cell-first-row');
  });

  it('should add ag-cell-first-row when config has radiusLeft', () => {
    const params = createParams('test_field', 0, 5, {
      test_field_config: { radiusLeft: true },
    });

    const result = cellClass(params);

    expect(result).toContain('ag-cell-first-row');
  });

  it('should add ag-cell-last-row when config has radiusRight', () => {
    const params = createParams('test_field', 0, 5, {
      test_field_config: { radiusRight: true },
    });

    const result = cellClass(params);

    expect(result).toContain('ag-cell-last-row');
  });

  it('should add ag-cell-last-row on last row without radiusRight or radiusLeft', () => {
    const params = createParams('test_field', 4, 5, {
      test_field_config: {},
    });

    const result = cellClass(params);

    expect(result).toContain('ag-cell-last-row');
  });

  it('should not add ag-cell-last-row on last row with radiusRight', () => {
    const params = createParams('test_field', 4, 5, {
      test_field_config: { radiusRight: true },
    });

    const result = cellClass(params);

    const lastRowCount = result.filter(
      (c: string) => c === 'ag-cell-last-row',
    ).length;
    expect(lastRowCount).toBe(1);
  });
});
