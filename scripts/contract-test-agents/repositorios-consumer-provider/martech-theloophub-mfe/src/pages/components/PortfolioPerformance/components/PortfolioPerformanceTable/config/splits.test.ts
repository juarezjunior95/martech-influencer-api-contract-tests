import { tableSplits } from './splits';

describe('tableSplits', () => {
  it('should have 5 split groups', () => {
    expect(tableSplits).toHaveLength(5);
  });

  it('should have Portfolio as first split', () => {
    expect(tableSplits[0]).toEqual(['Portfolio']);
  });

  it('should have Volume as second split', () => {
    expect(tableSplits[1]).toEqual(['Volume']);
  });

  it('should have Net Revenue, CORES, Market Share, Brand Power as third split', () => {
    expect(tableSplits[2]).toEqual([
      'Net Revenue',
      'CORES',
      'Market Share',
      'Brand Power',
    ]);
  });

  it('should have S&M as fourth split', () => {
    expect(tableSplits[3]).toEqual(['S&M']);
  });

  it('should have Brands as fifth split', () => {
    expect(tableSplits[4]).toEqual(['Brands']);
  });
});
