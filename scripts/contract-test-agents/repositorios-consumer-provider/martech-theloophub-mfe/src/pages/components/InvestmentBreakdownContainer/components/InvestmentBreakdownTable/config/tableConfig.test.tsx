import { CellClassParams } from 'ag-grid-community';

import { tableConfig } from './tableConfig';

jest.mock('components/Table/cellClass', () => ({
  cellClass: jest.fn(() => ['base-class']),
}));

const createMockCellClassParams = (
  overrides: Partial<CellClassParams> = {},
): CellClassParams => ({
  value: 'test',
  data: {},
  node: {} as any,
  colDef: {} as any,
  column: {} as any,
  api: {} as any,
  context: {},
  rowIndex: 1,
  ...overrides,
});

describe('tableConfig', () => {
  describe('Structure', () => {
    it('should export tableConfig object', () => {
      expect(tableConfig).toBeDefined();
      expect(typeof tableConfig).toBe('object');
    });

    it('should contain portfolio columns', () => {
      expect(tableConfig.portfolio).toBeDefined();
      expect(tableConfig.brands).toBeDefined();
    });

    it('should contain volume columns', () => {
      expect(tableConfig.volume_AC).toBeDefined();
      expect(tableConfig.volume_LY).toBeDefined();
    });

    it('should contain marketing columns', () => {
      expect(tableConfig.marketing_package_FY_BU).toBeDefined();
      expect(tableConfig.marketing_package_YTD_BU).toBeDefined();
      expect(tableConfig.marketing_package_YTD_AC).toBeDefined();
      expect(tableConfig.marketing_package_COM).toBeDefined();
    });

    it('should contain nwm columns', () => {
      expect(tableConfig.nwm_fy_bu).toBeDefined();
      expect(tableConfig.nwm_ytd_bu).toBeDefined();
      expect(tableConfig.nwm_ytd_ac_investment).toBeDefined();
      expect(tableConfig.nwm_ytd_ac).toBeDefined();
      expect(tableConfig.nwm_ytd_ac_2).toBeDefined();
    });

    it('should contain media columns', () => {
      expect(tableConfig.media_fy_bu_qwoa).toBeDefined();
      expect(tableConfig.media_ytd_bu_qwoa).toBeDefined();
      expect(tableConfig.media_ytd_ac).toBeDefined();
      expect(tableConfig.media_ytd_bu_investment).toBeDefined();
      expect(tableConfig.media_fy_bu_investment).toBeDefined();
      expect(tableConfig.media_ytd_ac_investment).toBeDefined();
      expect(tableConfig.media_ytd_ac_mkt).toBeDefined();
    });

    it('should contain sponsorship columns', () => {
      expect(tableConfig.sponsorship_fy_bu).toBeDefined();
      expect(tableConfig.sponsorship_ytd_bu).toBeDefined();
      expect(tableConfig.sponsorship_ytd_ac_investment).toBeDefined();
      expect(tableConfig.sponsorship_ytd_ac).toBeDefined();
    });
  });

  describe('Portfolio Column', () => {
    it('should have correct minWidth and maxWidth for portfolio', () => {
      expect(tableConfig.portfolio.minWidth).toBe(20);
      expect(tableConfig.portfolio.maxWidth).toBe(20);
    });

    it('should have portfolio-header class', () => {
      expect(tableConfig.portfolio.headerClass).toContain('portfolio-header');
    });

    it('should have headerComponentParams with merge true', () => {
      expect(tableConfig.portfolio.headerComponentParams).toEqual({
        merge: true,
      });
    });

    it('should have cellClass function', () => {
      expect(typeof tableConfig.portfolio.cellClass).toBe('function');
    });
  });

  describe('Brands Column', () => {
    it('should have correct minWidth for brands', () => {
      expect(tableConfig.brands.minWidth).toBe(100);
    });

    it('should have brands-header class', () => {
      expect(tableConfig.brands.headerClass).toContain('brands-header');
    });
  });

  describe('Volume Columns', () => {
    it('should have correct minWidth for volume_AC', () => {
      expect(tableConfig.volume_AC.minWidth).toBe(75);
    });

    it('should have intermediate-header class for volume_AC', () => {
      expect(tableConfig.volume_AC.headerClass).toContain(
        'intermediate-header',
      );
    });

    it('should have correct minWidth for volume_LY', () => {
      expect(tableConfig.volume_LY.minWidth).toBe(75);
    });

    it('should have final-header class for volume_LY', () => {
      expect(tableConfig.volume_LY.headerClass).toContain('final-header');
    });
  });

  describe('Marketing Columns', () => {
    it('should have intermediate-header for non-final columns', () => {
      expect(tableConfig.marketing_package_FY_BU.headerClass).toContain(
        'intermediate-header',
      );
      expect(tableConfig.marketing_package_YTD_BU.headerClass).toContain(
        'intermediate-header',
      );
      expect(tableConfig.marketing_package_YTD_AC.headerClass).toContain(
        'intermediate-header',
      );
    });

    it('should have final-header for COM column', () => {
      expect(tableConfig.marketing_package_COM.headerClass).toContain(
        'final-header',
      );
    });
  });

  describe('NWM Columns', () => {
    it('should have correct minWidth for nwm_ytd_ac', () => {
      expect(tableConfig.nwm_ytd_ac.minWidth).toBe(80);
    });

    it('should have correct minWidth for nwm_ytd_ac_2', () => {
      expect(tableConfig.nwm_ytd_ac_2.minWidth).toBe(120);
    });

    it('should have final-header for nwm_ytd_ac_2', () => {
      expect(tableConfig.nwm_ytd_ac_2.headerClass).toContain('final-header');
    });
  });

  describe('Media Columns', () => {
    it('should have intermediate-header for non-final columns', () => {
      expect(tableConfig.media_fy_bu_qwoa.headerClass).toContain(
        'intermediate-header',
      );
      expect(tableConfig.media_ytd_bu_qwoa.headerClass).toContain(
        'intermediate-header',
      );
    });

    it('should have final-header for media_ytd_ac_mkt', () => {
      expect(tableConfig.media_ytd_ac_mkt.headerClass).toContain(
        'final-header',
      );
    });
  });

  describe('Sponsorship Columns', () => {
    it('should have intermediate-header for intermediate columns', () => {
      expect(tableConfig.sponsorship_fy_bu.headerClass).toContain(
        'intermediate-header',
      );
      expect(tableConfig.sponsorship_ytd_bu.headerClass).toContain(
        'intermediate-header',
      );
    });

    it('should have correct minWidth for sponsorship_ytd_ac', () => {
      expect(tableConfig.sponsorship_ytd_ac.minWidth).toBe(85);
    });

    it('should have empty headerClass for sponsorship_ytd_ac', () => {
      expect(tableConfig.sponsorship_ytd_ac.headerClass).toEqual([]);
    });
  });

  describe('Cell Class Functions', () => {
    it('should add ag-cell-first-row class when rowIndex is 0', () => {
      const params = createMockCellClassParams({
        rowIndex: 0,
        data: { portfolio: 'megabrands' },
      });

      const result = tableConfig.portfolio.cellClass(params);

      expect(result).toContain('ag-cell-first-row');
    });

    it('should not add ag-cell-first-row class when rowIndex is not 0', () => {
      const params = createMockCellClassParams({
        rowIndex: 1,
        data: { portfolio: 'megabrands' },
      });

      const result = tableConfig.portfolio.cellClass(params);

      expect(result).not.toContain('ag-cell-first-row');
    });

    it('should add portfolio class based on data.portfolio', () => {
      const params = createMockCellClassParams({
        rowIndex: 1,
        data: { portfolio: 'Megabrands' },
      });

      const result = tableConfig.portfolio.cellClass(params);

      expect(result).toContain('ag-cell-megabrands');
    });

    it('should handle lowercase portfolio value', () => {
      const params = createMockCellClassParams({
        rowIndex: 1,
        data: { portfolio: 'expansion' },
      });

      const result = tableConfig.portfolio.cellClass(params);

      expect(result).toContain('ag-cell-expansion');
    });

    it('should not add portfolio class when portfolio is undefined', () => {
      const params = createMockCellClassParams({
        rowIndex: 1,
        data: {},
      });

      const result = tableConfig.portfolio.cellClass(params);

      expect(result).not.toContain('ag-cell-undefined');
    });

    it('should include base classes from cellClass', () => {
      const params = createMockCellClassParams({
        rowIndex: 1,
        data: {},
      });

      const result = tableConfig.portfolio.cellClass(params);

      expect(result).toContain('base-class');
    });

    it('should add ag-cell-final-header for final columns', () => {
      const params = createMockCellClassParams({
        rowIndex: 1,
        data: { portfolio: 'sustain' },
      });

      const result = tableConfig.volume_LY.cellClass(params);

      expect(result).toContain('ag-cell-final-header');
    });

    it('should not add ag-cell-final-header for intermediate columns', () => {
      const params = createMockCellClassParams({
        rowIndex: 1,
        data: { portfolio: 'sustain' },
      });

      const result = tableConfig.volume_AC.cellClass(params);

      expect(result).not.toContain('ag-cell-final-header');
    });

    it('should combine all classes correctly', () => {
      const params = createMockCellClassParams({
        rowIndex: 0,
        data: { portfolio: 'Tail' },
      });

      const result = tableConfig.portfolio.cellClass(params);

      expect(result).toContain('base-class');
      expect(result).toContain('ag-cell-first-row');
      expect(result).toContain('ag-cell-tail');
    });
  });

  describe('Column MinWidth Defaults', () => {
    it('should have default minWidth of 75 for intermediate columns', () => {
      expect(tableConfig.volume_AC.minWidth).toBe(75);
      expect(tableConfig.marketing_package_FY_BU.minWidth).toBe(75);
      expect(tableConfig.nwm_fy_bu.minWidth).toBe(75);
      expect(tableConfig.media_fy_bu_qwoa.minWidth).toBe(75);
      expect(tableConfig.sponsorship_fy_bu.minWidth).toBe(75);
    });

    it('should have default minWidth of 75 for final columns', () => {
      expect(tableConfig.volume_LY.minWidth).toBe(75);
      expect(tableConfig.marketing_package_COM.minWidth).toBe(75);
    });
  });

  describe('Column Configuration Completeness', () => {
    it('should have cellClass function for all columns', () => {
      Object.keys(tableConfig).forEach((key) => {
        expect(typeof tableConfig[key].cellClass).toBe('function');
      });
    });

    it('should have minWidth for all columns', () => {
      Object.keys(tableConfig).forEach((key) => {
        expect(typeof tableConfig[key].minWidth).toBe('number');
      });
    });

    it('should have headerClass array for all columns', () => {
      Object.keys(tableConfig).forEach((key) => {
        expect(Array.isArray(tableConfig[key].headerClass)).toBe(true);
      });
    });
  });
});
