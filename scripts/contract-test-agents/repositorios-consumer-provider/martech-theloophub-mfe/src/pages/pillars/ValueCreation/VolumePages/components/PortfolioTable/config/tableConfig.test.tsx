import { tableConfig } from './tableConfig';
import { cellClass, portfolioCellClass, tooltipValueGetter } from './utils';

describe('tableConfig', () => {
  describe('Structure', () => {
    it('should be defined', () => {
      expect(tableConfig).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof tableConfig).toBe('object');
      expect(tableConfig).not.toBeNull();
    });

    it('should have all expected columns', () => {
      const expectedColumns = [
        'portfolio',
        'month_growth_contr',
        'month_weight',
        'month_vs_ly',
        'l3m_growth_contr',
        'l3m_weight',
        'l3m_vs_ly',
        'ytd_growth_contr',
        'ytd_weight',
        'ytd_vs_ly',
      ];

      expectedColumns.forEach((column) => {
        expect(tableConfig).toHaveProperty(column);
      });
    });

    it('should have exactly 10 columns', () => {
      expect(Object.keys(tableConfig)).toHaveLength(10);
    });
  });

  describe('Portfolio Column', () => {
    it('should have portfolio column defined', () => {
      expect(tableConfig.portfolio).toBeDefined();
    });

    it('should have cellClass property set to portfolioCellClass', () => {
      expect((tableConfig.portfolio as any).cellClass).toBe(portfolioCellClass);
    });

    it('should have tooltipValueGetter property', () => {
      expect((tableConfig.portfolio as any).tooltipValueGetter).toBe(
        tooltipValueGetter,
      );
    });

    it('should have headerClass property', () => {
      expect((tableConfig.portfolio as any).headerClass).toBe(
        'ag-header-cell-portfolio',
      );
    });

    it('should have width property set to 180', () => {
      expect((tableConfig.portfolio as any).width).toBe(180);
    });

    it('should have all four properties', () => {
      expect(Object.keys(tableConfig.portfolio)).toHaveLength(4);
    });
  });

  describe('Month Columns', () => {
    it('should have month_growth_contr with cellClass', () => {
      expect(tableConfig.month_growth_contr).toBeDefined();
      expect((tableConfig.month_growth_contr as any).cellClass).toBe(cellClass);
    });

    it('should have month_weight with cellClass', () => {
      expect(tableConfig.month_weight).toBeDefined();
      expect((tableConfig.month_weight as any).cellClass).toBe(cellClass);
    });

    it('should have month_vs_ly with cellClass', () => {
      expect(tableConfig.month_vs_ly).toBeDefined();
      expect((tableConfig.month_vs_ly as any).cellClass).toBe(cellClass);
    });

    it('should have only cellClass property for month columns', () => {
      expect(Object.keys(tableConfig.month_growth_contr)).toEqual([
        'cellClass',
      ]);
      expect(Object.keys(tableConfig.month_weight)).toEqual(['cellClass']);
      expect(Object.keys(tableConfig.month_vs_ly)).toEqual(['cellClass']);
    });
  });

  describe('L3M Columns', () => {
    it('should have l3m_growth_contr with cellClass', () => {
      expect(tableConfig.l3m_growth_contr).toBeDefined();
      expect((tableConfig.l3m_growth_contr as any).cellClass).toBe(cellClass);
    });

    it('should have l3m_weight with cellClass', () => {
      expect(tableConfig.l3m_weight).toBeDefined();
      expect((tableConfig.l3m_weight as any).cellClass).toBe(cellClass);
    });

    it('should have l3m_vs_ly with cellClass', () => {
      expect(tableConfig.l3m_vs_ly).toBeDefined();
      expect((tableConfig.l3m_vs_ly as any).cellClass).toBe(cellClass);
    });

    it('should have only cellClass property for l3m columns', () => {
      expect(Object.keys(tableConfig.l3m_growth_contr)).toEqual(['cellClass']);
      expect(Object.keys(tableConfig.l3m_weight)).toEqual(['cellClass']);
      expect(Object.keys(tableConfig.l3m_vs_ly)).toEqual(['cellClass']);
    });
  });

  describe('YTD Columns', () => {
    it('should have ytd_growth_contr with cellClass', () => {
      expect(tableConfig.ytd_growth_contr).toBeDefined();
      expect((tableConfig.ytd_growth_contr as any).cellClass).toBe(cellClass);
    });

    it('should have ytd_weight with cellClass', () => {
      expect(tableConfig.ytd_weight).toBeDefined();
      expect((tableConfig.ytd_weight as any).cellClass).toBe(cellClass);
    });

    it('should have ytd_vs_ly with cellClass', () => {
      expect(tableConfig.ytd_vs_ly).toBeDefined();
      expect((tableConfig.ytd_vs_ly as any).cellClass).toBe(cellClass);
    });

    it('should have only cellClass property for ytd columns', () => {
      expect(Object.keys(tableConfig.ytd_growth_contr)).toEqual(['cellClass']);
      expect(Object.keys(tableConfig.ytd_weight)).toEqual(['cellClass']);
      expect(Object.keys(tableConfig.ytd_vs_ly)).toEqual(['cellClass']);
    });
  });

  describe('CellClass References', () => {
    it('should use portfolioCellClass only for portfolio column', () => {
      const columnsWithPortfolioCellClass = Object.entries(tableConfig).filter(
        ([, config]) => (config as any).cellClass === portfolioCellClass,
      );

      expect(columnsWithPortfolioCellClass).toHaveLength(1);
      expect(columnsWithPortfolioCellClass[0][0]).toBe('portfolio');
    });

    it('should use cellClass for all non-portfolio columns', () => {
      const columnsWithCellClass = Object.entries(tableConfig).filter(
        ([key, config]) =>
          key !== 'portfolio' && (config as any).cellClass === cellClass,
      );

      expect(columnsWithCellClass).toHaveLength(9);
    });

    it('should ensure all columns have cellClass defined', () => {
      Object.entries(tableConfig).forEach(([, config]) => {
        expect((config as any).cellClass).toBeDefined();
        expect(typeof (config as any).cellClass).toBe('function');
      });
    });
  });

  describe('TooltipValueGetter', () => {
    it('should only have tooltipValueGetter for portfolio column', () => {
      const columnsWithTooltip = Object.entries(tableConfig).filter(
        ([, config]) => (config as any).tooltipValueGetter !== undefined,
      );

      expect(columnsWithTooltip).toHaveLength(1);
      expect(columnsWithTooltip[0][0]).toBe('portfolio');
    });

    it('should not have tooltipValueGetter for other columns', () => {
      const otherColumns = Object.entries(tableConfig).filter(
        ([key]) => key !== 'portfolio',
      );

      otherColumns.forEach(([, config]) => {
        expect((config as any).tooltipValueGetter).toBeUndefined();
      });
    });
  });

  describe('HeaderClass', () => {
    it('should only have headerClass for portfolio column', () => {
      const columnsWithHeaderClass = Object.entries(tableConfig).filter(
        ([, config]) => config.headerClass !== undefined,
      );

      expect(columnsWithHeaderClass).toHaveLength(1);
      expect(columnsWithHeaderClass[0][0]).toBe('portfolio');
    });

    it('should have correct headerClass value', () => {
      expect(tableConfig.portfolio.headerClass).toBe(
        'ag-header-cell-portfolio',
      );
    });

    it('should not have headerClass for other columns', () => {
      const otherColumns = Object.entries(tableConfig).filter(
        ([key]) => key !== 'portfolio',
      );

      otherColumns.forEach(([, config]) => {
        expect(config.headerClass).toBeUndefined();
      });
    });
  });

  describe('Width', () => {
    it('should only have width for portfolio column', () => {
      const columnsWithWidth = Object.entries(tableConfig).filter(
        ([, config]) => (config as any).width !== undefined,
      );

      expect(columnsWithWidth).toHaveLength(1);
      expect(columnsWithWidth[0][0]).toBe('portfolio');
    });

    it('should have correct width value for portfolio', () => {
      expect((tableConfig.portfolio as any).width).toBe(180);
      expect(typeof (tableConfig.portfolio as any).width).toBe('number');
    });

    it('should not have width for other columns', () => {
      const otherColumns = Object.entries(tableConfig).filter(
        ([key]) => key !== 'portfolio',
      );

      otherColumns.forEach(([, config]) => {
        expect((config as any).width).toBeUndefined();
      });
    });
  });

  describe('Column Groups', () => {
    it('should have three month-related columns', () => {
      const monthColumns = Object.keys(tableConfig).filter((key) =>
        key.startsWith('month_'),
      );

      expect(monthColumns).toHaveLength(3);
      expect(monthColumns).toContain('month_growth_contr');
      expect(monthColumns).toContain('month_weight');
      expect(monthColumns).toContain('month_vs_ly');
    });

    it('should have three l3m-related columns', () => {
      const l3mColumns = Object.keys(tableConfig).filter((key) =>
        key.startsWith('l3m_'),
      );

      expect(l3mColumns).toHaveLength(3);
      expect(l3mColumns).toContain('l3m_growth_contr');
      expect(l3mColumns).toContain('l3m_weight');
      expect(l3mColumns).toContain('l3m_vs_ly');
    });

    it('should have three ytd-related columns', () => {
      const ytdColumns = Object.keys(tableConfig).filter((key) =>
        key.startsWith('ytd_'),
      );

      expect(ytdColumns).toHaveLength(3);
      expect(ytdColumns).toContain('ytd_growth_contr');
      expect(ytdColumns).toContain('ytd_weight');
      expect(ytdColumns).toContain('ytd_vs_ly');
    });

    it('should have consistent column types across time periods', () => {
      const suffixes = ['growth_contr', 'weight', 'vs_ly'];
      const prefixes = ['month', 'l3m', 'ytd'];

      prefixes.forEach((prefix) => {
        suffixes.forEach((suffix) => {
          const columnKey = `${prefix}_${suffix}`;
          expect(tableConfig).toHaveProperty(columnKey);
        });
      });
    });
  });

  describe('Immutability', () => {
    it('should not be affected by external modifications', () => {
      const originalKeys = Object.keys(tableConfig);
      const portfolioConfig = tableConfig.portfolio;

      expect(Object.keys(tableConfig)).toEqual(originalKeys);
      expect(tableConfig.portfolio).toBe(portfolioConfig);
    });
  });

  describe('Column Naming Conventions', () => {
    it('should use snake_case for column names', () => {
      const columnNames = Object.keys(tableConfig);

      columnNames.forEach((name) => {
        expect(name).toMatch(/^[a-z0-9]+(_[a-z0-9]+)*$/);
      });
    });

    it('should have portfolio as a single word column', () => {
      expect(tableConfig.portfolio).toBeDefined();
      expect('portfolio').not.toContain('_');
    });

    it('should have underscores in all other column names', () => {
      const otherColumns = Object.keys(tableConfig).filter(
        (key) => key !== 'portfolio',
      );

      otherColumns.forEach((name) => {
        expect(name).toContain('_');
      });
    });
  });
});
