import { performanceConfig } from './performanceConfig';

jest.mock('components/Table/cellClass', () => ({
  cellClass: jest.fn(() => ['base-class']),
}));

jest.mock('../cellRenderer', () => ({
  ChartCellRenderer: jest.fn(() => <div>ChartCellRenderer</div>),
  DoubleValueRenderer: jest.fn(() => <div>DoubleValueRenderer</div>),
}));

describe('performanceConfig', () => {
  it('should return config object', () => {
    const config = performanceConfig(false);

    expect(config).toBeDefined();
  });

  describe('id column', () => {
    it('should have correct minWidth', () => {
      const config = performanceConfig(false);

      expect(config.id.minWidth).toBe(128);
    });

    it('should have correct maxWidth', () => {
      const config = performanceConfig(false);

      expect(config.id.maxWidth).toBe(128);
    });

    it('should have merge header param', () => {
      const config = performanceConfig(false);

      expect(config.id.headerComponentParams.merge).toBe(true);
    });

    it('should have cellClass function', () => {
      const config = performanceConfig(false);

      expect(typeof config.id.cellClass).toBe('function');
    });

    it('should add border-bottom class when borderBottom config is true', () => {
      const config = performanceConfig(false);
      const params = {
        data: { id_config: { borderBottom: true } },
      } as any;

      const classes = config.id.cellClass(params);

      expect(classes).toContain('border-bottom');
    });

    it('should not add border-bottom class when borderBottom config is false', () => {
      const config = performanceConfig(false);
      const params = {
        data: { id_config: { borderBottom: false } },
      } as any;

      const classes = config.id.cellClass(params);

      expect(classes).not.toContain('border-bottom');
    });

    it('should not add border-bottom class when no config', () => {
      const config = performanceConfig(false);
      const params = {
        data: {},
      } as any;

      const classes = config.id.cellClass(params);

      expect(classes).not.toContain('border-bottom');
    });
  });

  describe('ac column', () => {
    it('should have correct minWidth', () => {
      const config = performanceConfig(false);

      expect(config.ac.minWidth).toBe(300);
    });

    it('should have ag-column-separator headerClass', () => {
      const config = performanceConfig(false);

      expect(config.ac.headerClass).toContain('ag-column-separator');
    });

    it('should have cellRenderer function', () => {
      const config = performanceConfig(false);

      expect(typeof config.ac.cellRenderer).toBe('function');
    });

    it('should have cellClass function', () => {
      const config = performanceConfig(false);

      expect(typeof config.ac.cellClass).toBe('function');
    });
  });

  describe('ly column', () => {
    it('should have ag-column-separator headerClass', () => {
      const config = performanceConfig(false);

      expect(config.ly.headerClass).toContain('ag-column-separator');
    });

    it('should have cellRenderer as DoubleValueRenderer', () => {
      const config = performanceConfig(false);

      expect(config.ly.cellRenderer).toBeDefined();
    });

    it('should have cellClass function', () => {
      const config = performanceConfig(false);

      expect(typeof config.ly.cellClass).toBe('function');
    });
  });

  describe('someRowWasSelected parameter', () => {
    it('should accept true value', () => {
      const config = performanceConfig(true);

      expect(config).toBeDefined();
    });

    it('should accept false value', () => {
      const config = performanceConfig(false);

      expect(config).toBeDefined();
    });
  });
});
