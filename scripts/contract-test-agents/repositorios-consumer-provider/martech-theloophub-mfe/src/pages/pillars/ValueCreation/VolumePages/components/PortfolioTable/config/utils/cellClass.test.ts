import { CellClassParams } from 'ag-grid-community';

import { cellClass } from './cellClass';

const mockTableCellClass = jest.fn();

jest.mock('components/Table/cellClass', () => ({
  cellClass: (...args: any[]) => mockTableCellClass(...args),
}));

describe('cellClass utility', () => {
  const createMockParams = (
    overrides?: Partial<CellClassParams>,
  ): CellClassParams => {
    return {
      colDef: { field: 'test_field' },
      data: {},
      rowIndex: 0,
      api: {
        getDisplayedRowCount: jest.fn().mockReturnValue(10),
      } as any,
      ...overrides,
    } as CellClassParams;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockTableCellClass.mockReturnValue(['base-class']);
  });

  describe('Base Classes', () => {
    it('should include classes from tableCellClass', () => {
      mockTableCellClass.mockReturnValue(['base-class', 'another-class']);
      const params = createMockParams();

      const result = cellClass(params);

      expect(mockTableCellClass).toHaveBeenCalledWith(params);
      expect(result).toContain('base-class');
      expect(result).toContain('another-class');
    });

    it('should spread tableCellClass result into new array', () => {
      const params = createMockParams();

      const result = cellClass(params);

      expect(result).toContain('base-class');
    });
  });

  describe('Opacity Column Logic', () => {
    it('should add ag-cell-text-opacity for month column in total row without variationDirection', () => {
      const params = createMockParams({
        colDef: { field: 'month' },
        rowIndex: 9,
        data: { month_config: {} },
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-text-opacity');
    });

    it('should add ag-cell-text-opacity for l3m column in total row without variationDirection', () => {
      const params = createMockParams({
        colDef: { field: 'l3m' },
        rowIndex: 9,
        data: { l3m_config: {} },
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-text-opacity');
    });

    it('should add ag-cell-text-opacity for ytd column in total row without variationDirection', () => {
      const params = createMockParams({
        colDef: { field: 'ytd' },
        rowIndex: 9,
        data: { ytd_config: {} },
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-text-opacity');
    });

    it('should not add ag-cell-text-opacity when not total row', () => {
      const params = createMockParams({
        colDef: { field: 'month' },
        rowIndex: 5,
        data: { month_config: {} },
      });

      const result = cellClass(params);

      expect(result).not.toContain('ag-cell-text-opacity');
    });

    it('should not add ag-cell-text-opacity when not opacity column', () => {
      const params = createMockParams({
        colDef: { field: 'portfolio' },
        rowIndex: 9,
        data: { portfolio_config: {} },
      });

      const result = cellClass(params);

      expect(result).not.toContain('ag-cell-text-opacity');
    });

    it('should not add ag-cell-text-opacity when variationDirection exists', () => {
      const params = createMockParams({
        colDef: { field: 'month' },
        rowIndex: 9,
        data: { month_config: { variationDirection: 'up' } },
      });

      const result = cellClass(params);

      expect(result).not.toContain('ag-cell-text-opacity');
    });

    it('should handle field names containing month', () => {
      const params = createMockParams({
        colDef: { field: 'volume_month_data' },
        rowIndex: 9,
        data: { volume_month_data_config: {} },
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-text-opacity');
    });

    it('should handle field names containing l3m', () => {
      const params = createMockParams({
        colDef: { field: 'value_l3m_total' },
        rowIndex: 9,
        data: { value_l3m_total_config: {} },
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-text-opacity');
    });

    it('should handle field names containing ytd', () => {
      const params = createMockParams({
        colDef: { field: 'metric_ytd_summary' },
        rowIndex: 9,
        data: { metric_ytd_summary_config: {} },
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-text-opacity');
    });
  });

  describe('Hidden Cell for brands_vol_og_vs_ly', () => {
    it('should return only ag-hidden-cell for brands_vol_og_vs_ly in total row', () => {
      const params = createMockParams({
        colDef: { field: 'brands_vol_og_vs_ly' },
        rowIndex: 9,
      });

      const result = cellClass(params);

      expect(result).toEqual(['ag-hidden-cell']);
      expect(result).not.toContain('base-class');
    });

    it('should not return ag-hidden-cell for brands_vol_og_vs_ly in non-total row', () => {
      const params = createMockParams({
        colDef: { field: 'brands_vol_og_vs_ly' },
        rowIndex: 5,
      });

      const result = cellClass(params);

      expect(result).not.toEqual(['ag-hidden-cell']);
      expect(result).toContain('base-class');
    });

    it('should not return ag-hidden-cell for other fields in total row', () => {
      const params = createMockParams({
        colDef: { field: 'other_field' },
        rowIndex: 9,
      });

      const result = cellClass(params);

      expect(result).not.toEqual(['ag-hidden-cell']);
    });
  });

  describe('First Row Class', () => {
    it('should add ag-cell-first-row when rowIndex is 1', () => {
      const params = createMockParams({
        rowIndex: 1,
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-first-row');
    });

    it('should not add ag-cell-first-row when rowIndex is 0', () => {
      const params = createMockParams({
        rowIndex: 0,
      });

      const result = cellClass(params);

      expect(result).not.toContain('ag-cell-first-row');
    });

    it('should not add ag-cell-first-row when rowIndex is 2', () => {
      const params = createMockParams({
        rowIndex: 2,
      });

      const result = cellClass(params);

      expect(result).not.toContain('ag-cell-first-row');
    });

    it('should add ag-cell-first-row when config.radiusTop is true', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: { test_field_config: { radiusTop: true } },
        rowIndex: 5,
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-first-row');
    });

    it('should add ag-cell-first-row when config.radiusLeft is true', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: { test_field_config: { radiusLeft: true } },
        rowIndex: 5,
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-first-row');
    });

    it('should add ag-cell-first-row when both radiusTop and radiusLeft are true', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: { test_field_config: { radiusTop: true, radiusLeft: true } },
        rowIndex: 5,
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-first-row');
    });
  });

  describe('Last Row Class', () => {
    it('should add ag-cell-last-row when config.radiusRight is true', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: { test_field_config: { radiusRight: true } },
        rowIndex: 5,
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-last-row');
    });

    it('should add ag-cell-last-row when is last row and no radiusRight/radiusLeft', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: { test_field_config: {} },
        rowIndex: 9,
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-last-row');
    });

    it('should not add ag-cell-last-row when is last row but has radiusRight', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: { test_field_config: { radiusRight: true } },
        rowIndex: 9,
      });

      const result = cellClass(params);

      // Should only have one ag-cell-last-row from the radiusRight condition
      const count = result.filter((cls) => cls === 'ag-cell-last-row').length;
      expect(count).toBe(1);
    });

    it('should not add ag-cell-last-row when is last row but has radiusLeft', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: { test_field_config: { radiusLeft: true } },
        rowIndex: 9,
      });

      const result = cellClass(params);

      expect(result).not.toContain('ag-cell-last-row');
    });

    it('should not add ag-cell-last-row when not last row and no config', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: { test_field_config: {} },
        rowIndex: 5,
      });

      const result = cellClass(params);

      expect(result).not.toContain('ag-cell-last-row');
    });
  });

  describe('Config Handling', () => {
    it('should correctly build config field name from colDef.field', () => {
      const params = createMockParams({
        colDef: { field: 'portfolio' },
        data: { portfolio_config: { radiusTop: true } },
      });

      const result = cellClass(params);

      expect(result).toContain('ag-cell-first-row');
    });

    it('should handle missing config gracefully', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: {},
      });

      const result = cellClass(params);

      expect(result).toContain('base-class');
    });

    it('should handle undefined data', () => {
      const params = createMockParams({
        data: undefined,
      });

      const result = cellClass(params);

      expect(result).toContain('base-class');
    });

    it('should handle null config', () => {
      const params = createMockParams({
        colDef: { field: 'test_field' },
        data: { test_field_config: null },
      });

      const result = cellClass(params);

      expect(result).toContain('base-class');
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle multiple classes being added', () => {
      const params = createMockParams({
        colDef: { field: 'month' },
        rowIndex: 1,
        data: { month_config: { radiusTop: true, radiusRight: true } },
      });

      const result = cellClass(params);

      expect(result).toContain('base-class');
      expect(result).toContain('ag-cell-first-row');
      expect(result).toContain('ag-cell-last-row');
    });

    it('should handle total row with multiple conditions', () => {
      const params = createMockParams({
        colDef: { field: 'ytd' },
        rowIndex: 9,
        data: { ytd_config: {} },
      });

      const result = cellClass(params);

      expect(result).toContain('base-class');
      expect(result).toContain('ag-cell-text-opacity');
      expect(result).toContain('ag-cell-last-row');
    });

    it('should prioritize ag-hidden-cell over other classes', () => {
      const params = createMockParams({
        colDef: { field: 'brands_vol_og_vs_ly' },
        rowIndex: 9,
        data: { brands_vol_og_vs_ly_config: { radiusTop: true } },
      });

      const result = cellClass(params);

      expect(result).toEqual(['ag-hidden-cell']);
      expect(result).not.toContain('ag-cell-first-row');
    });

    it('should handle row with no special conditions', () => {
      const params = createMockParams({
        colDef: { field: 'portfolio' },
        rowIndex: 5,
        data: { portfolio_config: {} },
      });

      const result = cellClass(params);

      expect(result).toEqual(['base-class']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single row table', () => {
      const params = createMockParams({
        rowIndex: 0,
        api: {
          getDisplayedRowCount: jest.fn().mockReturnValue(1),
        } as any,
      });

      const result = cellClass(params);

      expect(result).toContain('base-class');
      expect(result).toContain('ag-cell-last-row');
    });

    it('should handle empty field name', () => {
      const params = createMockParams({
        colDef: { field: '' },
      });

      const result = cellClass(params);

      expect(result).toContain('base-class');
    });

    it('should handle undefined field name', () => {
      const params = createMockParams({
        colDef: { field: undefined as any },
      });

      const result = cellClass(params);

      expect(result).toContain('base-class');
    });

    it('should handle variationDirection as false', () => {
      const params = createMockParams({
        colDef: { field: 'month' },
        rowIndex: 9,
        data: { month_config: { variationDirection: false } },
      });

      const result = cellClass(params);

      // variationDirection is false, which is not undefined, so should not add opacity
      expect(result).not.toContain('ag-cell-text-opacity');
    });

    it('should handle variationDirection as null', () => {
      const params = createMockParams({
        colDef: { field: 'month' },
        rowIndex: 9,
        data: { month_config: { variationDirection: null } },
      });

      const result = cellClass(params);

      // variationDirection is null, which is not undefined, so should not add opacity
      expect(result).not.toContain('ag-cell-text-opacity');
    });

    it('should handle very large row count', () => {
      const params = createMockParams({
        rowIndex: 999,
        api: {
          getDisplayedRowCount: jest.fn().mockReturnValue(1000),
        } as any,
      });

      const result = cellClass(params);

      expect(result).toContain('base-class');
      expect(result).toContain('ag-cell-last-row');
    });
  });
});
