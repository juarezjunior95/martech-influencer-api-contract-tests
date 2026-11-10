import { headers, kpis, kpisWithRefresh, subHeaders } from './index';

describe('PnlTable constants', () => {
  it('should have subHeaders array with correct values', () => {
    expect(subHeaders).toContain('Total Volume');
    expect(subHeaders).toContain('NET REVENUE');
    expect(subHeaders).toContain('MACO');
    expect(subHeaders).toHaveLength(7);
  });

  it('should have headers array with correct values', () => {
    expect(headers).toContain("KPI's/hL");
    expect(headers).toContain("Other KPI'S");
    expect(headers).toContain('Output');
    expect(headers).toHaveLength(3);
  });

  it('should have kpis array with correct values', () => {
    expect(kpis).toContain('Vol');
    expect(kpis).toContain('NR');
    expect(kpis).toContain('Market Share');
    expect(kpis).toHaveLength(11);
  });

  it('should have kpisWithRefresh array with correct values', () => {
    expect(kpisWithRefresh).toContain('Market Share');
    expect(kpisWithRefresh).toContain('Brand Power');
    expect(kpisWithRefresh).toContain('Beer Participation');
    expect(kpisWithRefresh).toHaveLength(3);
  });
});
