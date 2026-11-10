import { includesHeaderHeight, prPagesTableWidths, tableWidths } from './index';

describe('PortfolioPerformance constants', () => {
  it('should have tableWidths with 5 items', () => {
    expect(tableWidths).toHaveLength(5);
  });

  it('should have tableWidths with correct first value', () => {
    expect(tableWidths[0]).toBe('180px');
  });

  it('should have prPagesTableWidths with 5 items', () => {
    expect(prPagesTableWidths).toHaveLength(5);
  });

  it('should have prPagesTableWidths with correct first value', () => {
    expect(prPagesTableWidths[0]).toBe('180px');
  });

  it('should have includesHeaderHeight with 5 items', () => {
    expect(includesHeaderHeight).toHaveLength(5);
  });

  it('should have includesHeaderHeight with first item true', () => {
    expect(includesHeaderHeight[0]).toBe(true);
  });

  it('should have includesHeaderHeight with remaining items false', () => {
    expect(includesHeaderHeight[1]).toBe(false);
    expect(includesHeaderHeight[2]).toBe(false);
    expect(includesHeaderHeight[3]).toBe(false);
    expect(includesHeaderHeight[4]).toBe(false);
  });
});
