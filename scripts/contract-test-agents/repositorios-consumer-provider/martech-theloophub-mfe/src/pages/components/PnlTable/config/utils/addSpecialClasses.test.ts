import { addSpecialClasses } from './addSpecialClasses';

jest.mock('components/Table/cellClass', () => ({
  cellClass: jest.fn(() => ['base-class']),
}));

describe('addSpecialClasses', () => {
  it('should include base cellClass', () => {
    const params = {
      rowIndex: 1,
      data: { kpi_mio_khl: 'test' },
      column: { getParent: () => null },
    } as any;

    const result = addSpecialClasses(params);

    expect(result).toContain('base-class');
  });

  it('should add ag-cell-first-row for rowIndex 0', () => {
    const params = {
      rowIndex: 0,
      data: { kpi_mio_khl: 'test' },
      column: { getParent: () => null },
    } as any;

    const result = addSpecialClasses(params);

    expect(result).toContain('ag-cell-first-row');
  });

  it('should not add ag-cell-first-row for rowIndex > 0', () => {
    const params = {
      rowIndex: 1,
      data: { kpi_mio_khl: 'test' },
      column: { getParent: () => null },
    } as any;

    const result = addSpecialClasses(params);

    expect(result).not.toContain('ag-cell-first-row');
  });

  it('should add ag-cell-without-border for rowIndex > 16', () => {
    const params = {
      rowIndex: 17,
      data: { kpi_mio_khl: 'test' },
      column: { getParent: () => null },
    } as any;

    const result = addSpecialClasses(params);

    expect(result).toContain('ag-cell-without-border');
  });

  it('should add ag-cell-subheader-pnl for subHeaders in kpi_mio_khl', () => {
    const params = {
      rowIndex: 1,
      data: { kpi_mio_khl: 'Total Volume' },
      column: { getParent: () => null },
    } as any;

    const result = addSpecialClasses(params);

    expect(result).toContain('ag-cell-subheader-pnl');
  });

  it('should add ag-cell-subheader-pnl for subHeaders in profit_loss', () => {
    const params = {
      rowIndex: 1,
      data: { profit_loss: 'NET REVENUE' },
      column: { getParent: () => null },
    } as any;

    const result = addSpecialClasses(params);

    expect(result).toContain('ag-cell-subheader-pnl');
  });

  it('should add ag-cell-header-pnl for headers in kpi_mio_khl', () => {
    const params = {
      rowIndex: 1,
      data: { kpi_mio_khl: "KPI's/hL" },
      column: { getParent: () => null },
    } as any;

    const result = addSpecialClasses(params);

    expect(result).toContain('ag-cell-header-pnl');
  });

  it('should add ag-cell-kpi-pnl for kpis in profit_loss', () => {
    const params = {
      rowIndex: 1,
      data: { profit_loss: 'Vol' },
      column: { getParent: () => null },
    } as any;

    const result = addSpecialClasses(params);

    expect(result).toContain('ag-cell-kpi-pnl');
  });

  it('should add ag-cell-kpi-with-refresh for kpisWithRefresh', () => {
    const params = {
      rowIndex: 1,
      data: { profit_loss: 'Market Share' },
      column: { getParent: () => null },
    } as any;

    const result = addSpecialClasses(params);

    expect(result).toContain('ag-cell-kpi-with-refresh');
  });
});
