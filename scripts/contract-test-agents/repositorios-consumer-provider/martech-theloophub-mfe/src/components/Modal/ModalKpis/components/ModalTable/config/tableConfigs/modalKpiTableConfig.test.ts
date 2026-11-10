import { ColDef } from 'ag-grid-community';

import { modalKpiTableConfig } from './modalKpiTableConfig';

describe('modalKpiTableConfig', () => {
  it('should have kpis column configuration', () => {
    expect(modalKpiTableConfig.kpis).toBeDefined();
  });

  it('should have kpis column with headerName "KPIs"', () => {
    expect(modalKpiTableConfig.kpis.headerName).toBe('KPIs');
  });

  it('should have kpis column with width 209', () => {
    expect((modalKpiTableConfig.kpis as ColDef).width).toBe(209);
  });

  it('should have update column configuration', () => {
    expect(modalKpiTableConfig.update).toBeDefined();
  });

  it('should have update column with headerName "Update Time"', () => {
    expect(modalKpiTableConfig.update.headerName).toBe('Update Time');
  });

  it('should have update column with width 209', () => {
    expect((modalKpiTableConfig.update as ColDef).width).toBe(209);
  });

  it('should have source column configuration', () => {
    expect(modalKpiTableConfig.source).toBeDefined();
  });

  it('should have source column with headerName "Source"', () => {
    expect(modalKpiTableConfig.source.headerName).toBe('Source');
  });

  it('should not have width defined for source column', () => {
    expect((modalKpiTableConfig.source as ColDef).width).toBeUndefined();
  });

  it('should have id column configuration', () => {
    expect(modalKpiTableConfig.id).toBeDefined();
  });

  it('should have id column hidden', () => {
    expect((modalKpiTableConfig.id as ColDef).hide).toBe(true);
  });

  it('should have exactly 4 column configurations', () => {
    expect(Object.keys(modalKpiTableConfig)).toHaveLength(4);
  });
});
