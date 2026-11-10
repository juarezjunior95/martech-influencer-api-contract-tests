import {
  brandBreakdownConfig,
  brandBreakdownConfigEmptyState,
  brandBreakdownExportConfig,
  COMPETITOR_HEADER,
} from './brandBreakdownConfig';

jest.mock('components/Table/cellClass', () => ({
  cellClass: jest.fn(() => ['base-class']),
}));

jest.mock('../cellRenderer', () => ({
  ChartCellRenderer: jest.fn(() => <div>ChartCellRenderer</div>),
  DoubleValueRenderer: jest.fn(() => <div>DoubleValueRenderer</div>),
}));

describe('brandBreakdownConfig', () => {
  describe('COMPETITOR_HEADER', () => {
    it('should be defined as Competitor Brands', () => {
      expect(COMPETITOR_HEADER).toBe('Competitor Brands');
    });
  });

  describe('brandBreakdownConfig', () => {
    it('should return config object', () => {
      const config = brandBreakdownConfig(false);

      expect(config).toBeDefined();
    });

    it('should have id column with correct minWidth and maxWidth', () => {
      const config = brandBreakdownConfig(false);

      expect(config.id.minWidth).toBe(168);
      expect(config.id.maxWidth).toBe(168);
    });

    it('should have id column with merge header param', () => {
      const config = brandBreakdownConfig(false);

      expect(config.id.headerComponentParams.merge).toBe(true);
    });

    it('should have brand_power_ac column with minWidth 180', () => {
      const config = brandBreakdownConfig(false);

      expect(config.brand_power_ac.minWidth).toBe(180);
    });

    it('should have brand_power_ly column with headerClass', () => {
      const config = brandBreakdownConfig(false);

      expect(config.brand_power_ly.headerClass).toContain(
        'ag-column-separator',
      );
    });

    it('should have meaning_ac column', () => {
      const config = brandBreakdownConfig(false);

      expect(config.meaning_ac).toBeDefined();
      expect(config.meaning_ac.field).toBe('meaning_ac');
    });

    it('should have difference_ac column', () => {
      const config = brandBreakdownConfig(false);

      expect(config.difference_ac).toBeDefined();
      expect(config.difference_ac.field).toBe('difference_ac');
    });

    it('should have salience_ac column', () => {
      const config = brandBreakdownConfig(false);

      expect(config.salience_ac).toBeDefined();
      expect(config.salience_ac.field).toBe('salience_ac');
    });

    it('should add ag-cell-competitor-header class for competitor header row', () => {
      const config = brandBreakdownConfig(false);
      const params = { data: { id: COMPETITOR_HEADER } } as any;

      const classes = config.id.cellClass(params);

      expect(classes).toContain('ag-cell-competitor-header');
    });

    it('should not add ag-cell-competitor-header class for regular row', () => {
      const config = brandBreakdownConfig(false);
      const params = { data: { id: 'regular-row' } } as any;

      const classes = config.id.cellClass(params);

      expect(classes).not.toContain('ag-cell-competitor-header');
    });
  });

  describe('brandBreakdownExportConfig', () => {
    it('should return config object', () => {
      const config = brandBreakdownExportConfig(false);

      expect(config).toBeDefined();
    });

    it('should have id column with correct minWidth and maxWidth', () => {
      const config = brandBreakdownExportConfig(false);

      expect(config.id.minWidth).toBe(188);
      expect(config.id.maxWidth).toBe(188);
    });

    it('should have id column with align-right class', () => {
      const config = brandBreakdownExportConfig(false);
      const params = { data: { id: 'test' } } as any;

      const classes = config.id.cellClass(params);

      expect(classes).toContain('align-right');
    });

    it('should have brand_power_ac column with minWidth 120', () => {
      const config = brandBreakdownExportConfig(false);

      expect(config.brand_power_ac.minWidth).toBe(120);
    });
  });

  describe('brandBreakdownConfigEmptyState', () => {
    it('should return config object', () => {
      const config = brandBreakdownConfigEmptyState();

      expect(config).toBeDefined();
    });

    it('should have brand_power column with correct dimensions', () => {
      const config = brandBreakdownConfigEmptyState();

      expect(config.brand_power.minWidth).toBe(250);
      expect(config.brand_power.maxWidth).toBe(250);
    });

    it('should have brand_power column with empty state headerClass', () => {
      const config = brandBreakdownConfigEmptyState();

      expect(config.brand_power.headerClass).toContain(
        'ag-brand-breakdown-empty-state',
      );
    });

    it('should have meaning column with correct dimensions', () => {
      const config = brandBreakdownConfigEmptyState();

      expect(config.meaning.minWidth).toBe(250);
      expect(config.meaning.maxWidth).toBe(250);
    });

    it('should have difference column with correct dimensions', () => {
      const config = brandBreakdownConfigEmptyState();

      expect(config.difference.minWidth).toBe(250);
      expect(config.difference.maxWidth).toBe(250);
    });

    it('should have salience column with correct dimensions', () => {
      const config = brandBreakdownConfigEmptyState();

      expect(config.salience.minWidth).toBe(250);
      expect(config.salience.maxWidth).toBe(250);
    });
  });
});
