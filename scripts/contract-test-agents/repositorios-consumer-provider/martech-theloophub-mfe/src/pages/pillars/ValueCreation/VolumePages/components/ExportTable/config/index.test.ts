import { CellClassParams } from 'ag-grid-community';

import { tableConfigs } from './index';

jest.mock('components/Table/cellClass', () => ({
  cellClass: jest.fn(() => ['base-class']),
}));

const getCellClass = (config: any) => {
  if (!(config as any).cellClass) throw new Error('cellClass is undefined');
  return (config as any).cellClass;
};

describe('ExportTable Config', () => {
  describe('tableConfigs', () => {
    it('should have portfolio configuration', () => {
      expect(tableConfigs.portfolio).toBeDefined();
      expect((tableConfigs.portfolio as any).minWidth).toBe(248);
      expect((tableConfigs.portfolio as any).cellClass).toBeDefined();
    });

    it('should have priorities configuration', () => {
      expect(tableConfigs.priorities).toBeDefined();
      expect((tableConfigs.priorities as any).minWidth).toBe(248);
      expect((tableConfigs.priorities as any).cellClass).toBeDefined();
    });

    it('should have growth_levers configuration', () => {
      expect(tableConfigs.growth_levers).toBeDefined();
      expect((tableConfigs.growth_levers as any).minWidth).toBe(248);
      expect((tableConfigs.growth_levers as any).cellClass).toBeDefined();
    });

    it('should have brands configuration', () => {
      expect(tableConfigs.brands).toBeDefined();
      expect((tableConfigs.brands as any).minWidth).toBe(248);
      expect((tableConfigs.brands as any).cellClass).toBeDefined();
    });

    it('should have mtd configuration', () => {
      expect(tableConfigs.mtd).toBeDefined();
      expect((tableConfigs.mtd as any).cellClass).toBeDefined();
    });

    it('should have l3m configuration', () => {
      expect(tableConfigs.l3m).toBeDefined();
      expect((tableConfigs.l3m as any).cellClass).toBeDefined();
    });

    it('should have ytd configuration', () => {
      expect(tableConfigs.ytd).toBeDefined();
      expect((tableConfigs.ytd as any).cellClass).toBeDefined();
    });
  });

  describe('cellClass function - portfolio', () => {
    it('should return base classes', () => {
      const params = {
        data: {},
      } as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).toContain('base-class');
    });

    it('should add total class when portfolio value is Total', () => {
      const params = {
        data: { portfolio: 'Total' },
      } as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).toContain('total');
    });

    it('should add total class when priorities value is Total', () => {
      const params = {
        data: { priorities: 'Total' },
      } as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).toContain('total');
    });

    it('should add aggregated class when priorities_config.aggregated is true', () => {
      const params = {
        data: {
          priorities_config: { aggregated: true },
        },
      } as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).toContain('aggregated');
    });

    it('should add aggregated class when growth_levers_config.aggregated is true', () => {
      const params = {
        data: {
          growth_levers_config: { aggregated: true },
        },
      } as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).toContain('aggregated');
    });

    it('should prioritize priorities_config over growth_levers_config', () => {
      const params = {
        data: {
          priorities_config: { aggregated: true },
          growth_levers_config: { aggregated: false },
        },
      } as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).toContain('aggregated');
    });

    it('should add both total and aggregated classes when applicable', () => {
      const params = {
        data: {
          portfolio: 'Total',
          priorities_config: { aggregated: true },
        },
      } as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).toContain('total');
      expect(result).toContain('aggregated');
    });

    it('should not add total class when portfolio is not Total', () => {
      const params = {
        data: { portfolio: 'Other Value' },
      } as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).not.toContain('total');
    });

    it('should not add aggregated class when config.aggregated is false', () => {
      const params = {
        data: {
          priorities_config: { aggregated: false },
        },
      } as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).not.toContain('aggregated');
    });

    it('should handle undefined data', () => {
      const params = {} as CellClassParams;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).toContain('base-class');
    });

    it('should handle null data values', () => {
      const params = {
        data: {
          portfolio: null,
          priorities: null,
          priorities_config: null,
        },
      } as any;

      const cellClass = (tableConfigs.portfolio as any).cellClass;
      if (!cellClass) throw new Error('cellClass is undefined');
      const result = cellClass(params);

      expect(result).not.toContain('total');
      expect(result).not.toContain('aggregated');
    });
  });

  describe('cellClass function - priorities', () => {
    it('should add total class when priorities value is Total', () => {
      const params = {
        data: { priorities: 'Total' },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.priorities)(params);

      expect(result).toContain('total');
    });
  });

  describe('cellClass function - growth_levers', () => {
    it('should add aggregated class when growth_levers_config.aggregated is true', () => {
      const params = {
        data: {
          growth_levers_config: { aggregated: true },
        },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.growth_levers)(params);

      expect(result).toContain('aggregated');
    });
  });

  describe('cellClass function - brands', () => {
    it('should return base classes for brands', () => {
      const params = {
        data: {},
      } as CellClassParams;

      const result = getCellClass(tableConfigs.brands)(params);

      expect(result).toContain('base-class');
    });
  });

  describe('cellClass function - mtd', () => {
    it('should not add text-align-left class for mtd', () => {
      const params = {
        data: {},
      } as CellClassParams;

      const result = getCellClass(tableConfigs.mtd)(params);

      expect(result).not.toContain('text-align-left');
    });

    it('should add total class when portfolio value is Total', () => {
      const params = {
        data: { portfolio: 'Total' },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.mtd)(params);

      expect(result).toContain('total');
    });

    it('should add aggregated class when config is present', () => {
      const params = {
        data: {
          priorities_config: { aggregated: true },
        },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.mtd)(params);

      expect(result).toContain('aggregated');
    });
  });

  describe('cellClass function - l3m', () => {
    it('should not add text-align-left class for l3m', () => {
      const params = {
        data: {},
      } as CellClassParams;

      const result = getCellClass(tableConfigs.l3m)(params);

      expect(result).not.toContain('text-align-left');
    });

    it('should add total class when priorities value is Total', () => {
      const params = {
        data: { priorities: 'Total' },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.l3m)(params);

      expect(result).toContain('total');
    });
  });

  describe('cellClass function - ytd', () => {
    it('should not add text-align-left class for ytd', () => {
      const params = {
        data: {},
      } as CellClassParams;

      const result = getCellClass(tableConfigs.ytd)(params);

      expect(result).not.toContain('text-align-left');
    });

    it('should add total and aggregated classes when both conditions are met', () => {
      const params = {
        data: {
          portfolio: 'Total',
          priorities_config: { aggregated: true },
        },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.ytd)(params);

      expect(result).toContain('total');
      expect(result).toContain('aggregated');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as portfolio value', () => {
      const params = {
        data: { portfolio: '' },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.portfolio)(params);

      expect(result).not.toContain('total');
    });

    it('should handle case-sensitive Total value', () => {
      const params = {
        data: { portfolio: 'total' },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.portfolio)(params);

      expect(result).not.toContain('total');
    });

    it('should handle aggregated as false explicitly', () => {
      const params = {
        data: {
          priorities_config: { aggregated: false },
        },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.portfolio)(params);

      expect(result).not.toContain('aggregated');
    });

    it('should handle aggregated as undefined', () => {
      const params = {
        data: {
          priorities_config: {},
        },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.portfolio)(params);

      expect(result).not.toContain('aggregated');
    });

    it('should handle both portfolio and priorities as Total', () => {
      const params = {
        data: {
          portfolio: 'Total',
          priorities: 'Total',
        },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.portfolio)(params);

      // Should only add 'total' once
      const totalCount = result.filter((cls: string) => cls === 'total').length;
      expect(totalCount).toBe(1);
    });

    it('should maintain class order with base, additional, and conditional classes', () => {
      const params = {
        data: {
          portfolio: 'Total',
          priorities_config: { aggregated: true },
        },
      } as CellClassParams;

      const result = getCellClass(tableConfigs.portfolio)(params);

      expect(result).toEqual(
        expect.arrayContaining(['base-class', 'total', 'aggregated']),
      );
    });
  });
});
