import { gridOptions } from './columnDefs';

describe('columnDefs', () => {
  describe('gridOptions', () => {
    it('should have suppressRowTransform enabled', () => {
      expect(gridOptions.suppressRowTransform).toBe(true);
    });

    it('should have defaultColDef defined', () => {
      expect(gridOptions.defaultColDef).toBeDefined();
    });

    it('should have defaultColGroupDef defined', () => {
      expect(gridOptions.defaultColGroupDef).toBeDefined();
    });

    it('should have components registered', () => {
      expect(gridOptions.components).toBeDefined();
      expect(gridOptions.components?.customHeader).toBeDefined();
      expect(gridOptions.components?.customAgGridTooltip).toBeDefined();
    });

    it('should have autoSizeStrategy configured', () => {
      expect(gridOptions.autoSizeStrategy).toEqual({
        type: 'fitGridWidth',
      });
    });
  });

  describe('defaultColDef', () => {
    const { defaultColDef } = gridOptions;

    it('should have sortable disabled', () => {
      expect(defaultColDef?.sortable).toBe(false);
    });

    it('should have colSpan callback', () => {
      expect(defaultColDef?.colSpan).toBeDefined();
      expect(typeof defaultColDef?.colSpan).toBe('function');
    });

    it('should have cellRenderer callback', () => {
      expect(defaultColDef?.cellRenderer).toBeDefined();
    });

    it('should have cellClass callback', () => {
      expect(defaultColDef?.cellClass).toBeDefined();
    });

    it('should have rowSpan callback', () => {
      expect(defaultColDef?.rowSpan).toBeDefined();
      expect(typeof defaultColDef?.rowSpan).toBe('function');
    });

    it('should have cellStyle callback', () => {
      expect(defaultColDef?.cellStyle).toBeDefined();
      expect(typeof defaultColDef?.cellStyle).toBe('function');
    });

    it('should have tooltipValueGetter callback', () => {
      expect(defaultColDef?.tooltipValueGetter).toBeDefined();
      expect(typeof defaultColDef?.tooltipValueGetter).toBe('function');
    });

    it('should have headerComponent defined', () => {
      expect(defaultColDef?.headerComponent).toBe('customHeader');
    });

    it('should have tooltipComponent defined', () => {
      expect(defaultColDef?.tooltipComponent).toBe('customAgGridTooltip');
    });

    it('should have headerComponentParams configured', () => {
      expect(defaultColDef?.headerComponentParams).toEqual({
        chartBackground: '',
        merge: false,
        icon: '',
        subtitle: '',
        tooltip: false,
        tooltipHeaderStyle: 'light',
        tooltipCellStyle: 'light',
        imgName: '',
        shouldTruncate: false,
      });
    });
  });

  describe('defaultColGroupDef', () => {
    const { defaultColGroupDef } = gridOptions;

    it('should have headerGroupComponentParams defined', () => {
      expect(defaultColGroupDef?.headerGroupComponentParams).toBeDefined();
    });

    it('should have headerGroupComponent same as defaultColDef headerComponent', () => {
      expect(defaultColGroupDef?.headerGroupComponent).toBe('customHeader');
    });

    it('should inherit properties from defaultColDef', () => {
      expect(defaultColGroupDef?.headerGroupComponent).toBe('customHeader');
      expect(defaultColGroupDef?.headerGroupComponentParams).toBeDefined();
    });
  });
});
