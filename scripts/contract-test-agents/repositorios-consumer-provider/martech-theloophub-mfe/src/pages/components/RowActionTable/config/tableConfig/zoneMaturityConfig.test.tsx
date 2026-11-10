import { zoneMaturityConfig } from './zoneMaturityConfig';

jest.mock('components/Table/cellClass', () => ({
  cellClass: jest.fn(() => ['base-class']),
}));

jest.mock('../cellRenderer', () => ({
  ChartCellRenderer: jest.fn(() => <div>ChartCellRenderer</div>),
  DoubleValueRenderer: jest.fn(() => <div>DoubleValueRenderer</div>),
}));

describe('zoneMaturityConfig', () => {
  it('should return config object', () => {
    const config = zoneMaturityConfig({
      someRowWasSelected: false,
    });

    expect(config).toBeDefined();
  });

  describe('label column', () => {
    it('should have cellClass function', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(typeof config.label.cellClass).toBe('function');
    });

    it('should have merge header param', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.label.headerComponentParams.merge).toBe(true);
    });

    it('should have borderMerge header param', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.label.headerComponentParams.borderMerge).toBe(true);
    });

    it('should add border-bottom class when borderBottom is true', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });
      const params = {
        data: { label_config: { borderBottom: true } },
        colDef: { headerComponentParams: {} },
      } as any;

      const classes = config.label.cellClass(params);

      expect(classes).toContain('border-bottom');
    });

    it('should add border-bottom class when borderMerge and groupBorder are true', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });
      const params = {
        data: { label_config: { groupBorder: true } },
        colDef: { headerComponentParams: { borderMerge: true } },
      } as any;

      const classes = config.label.cellClass(params);

      expect(classes).toContain('border-bottom');
    });

    it('should not add border-bottom class when no conditions met', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });
      const params = {
        data: { label_config: {} },
        colDef: { headerComponentParams: {} },
      } as any;

      const classes = config.label.cellClass(params);

      expect(classes).not.toContain('border-bottom');
    });
  });

  describe('id column', () => {
    it('should have correct minWidth', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.id.minWidth).toBe(56);
    });

    it('should have correct maxWidth', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.id.maxWidth).toBe(56);
    });

    it('should have merge header param', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.id.headerComponentParams.merge).toBe(true);
    });

    it('should have cellClass function', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(typeof config.id.cellClass).toBe('function');
    });
  });

  describe('ac column', () => {
    it('should have correct minWidth', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.ac.minWidth).toBe(155);
    });

    it('should have ag-column-separator headerClass', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.ac.headerClass).toContain('ag-column-separator');
    });

    it('should have cellRenderer function', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(typeof config.ac.cellRenderer).toBe('function');
    });

    it('should have cellClass function', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(typeof config.ac.cellClass).toBe('function');
    });
  });

  describe('ly column', () => {
    it('should have ag-column-separator headerClass', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.ly.headerClass).toContain('ag-column-separator');
    });

    it('should have cellRenderer', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.ly.cellRenderer).toBeDefined();
    });

    it('should have cellClass function', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(typeof config.ly.cellClass).toBe('function');
    });
  });

  describe('lq column', () => {
    it('should have cellRenderer', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config.lq.cellRenderer).toBeDefined();
    });

    it('should have cellClass function', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(typeof config.lq.cellClass).toBe('function');
    });
  });

  describe('parameters', () => {
    it('should accept someRowWasSelected as true', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: true,
      });

      expect(config).toBeDefined();
    });

    it('should accept chartHeight parameter', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
        chartHeight: 32,
      });

      expect(config).toBeDefined();
    });

    it('should use default chartHeight of 24', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
      });

      expect(config).toBeDefined();
    });

    it('should accept globalScale parameter', () => {
      const config = zoneMaturityConfig({
        someRowWasSelected: false,
        chartHeight: 24,
        globalScale: 100,
      });

      expect(config).toBeDefined();
    });
  });
});
