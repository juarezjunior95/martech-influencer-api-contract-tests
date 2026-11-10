import { BreakdownTier } from '../types';
import { sortTiers } from './sortTiers';

jest.mock('../constants', () => ({
  TIER_ORDER: ['beer', 'core_co', 'brand', 'competitor'],
}));

const buildTier = (tier_level: string, tier_name: string): BreakdownTier => ({
  tier_level: tier_level as any,
  tier_name,
  audiences: null,
});

describe('sortTiers', () => {
  test('should sort tiers according to TIER_ORDER', () => {
    const tiers = [
      buildTier('competitor', 'Amstel'),
      buildTier('beer', 'Beer'),
      buildTier('brand', 'Brahma'),
      buildTier('core_co', 'Core Co'),
    ];

    const result = sortTiers(tiers);

    expect(result.map((t) => t.tier_level)).toEqual([
      'beer',
      'core_co',
      'brand',
      'competitor',
    ]);
  });

  test('should return empty array when input is empty', () => {
    expect(sortTiers([])).toEqual([]);
  });

  test('should place unknown tier levels at the end', () => {
    const tiers = [
      buildTier('unknown' as any, 'Unknown'),
      buildTier('beer', 'Beer'),
    ];

    const result = sortTiers(tiers);

    expect(result[0].tier_level).toBe('beer');
    expect(result[1].tier_level).toBe('unknown');
  });

  test('should keep known tier before unknown when known is in second position', () => {
    const tiers = [
      buildTier('beer', 'Beer'),
      buildTier('unknown' as any, 'Unknown'),
    ];

    const result = sortTiers(tiers);

    expect(result[0].tier_level).toBe('beer');
    expect(result[1].tier_level).toBe('unknown');
  });

  test('should place two unknown tiers at the end in stable relative order', () => {
    const tiers = [
      buildTier('unknown_a' as any, 'Unknown A'),
      buildTier('beer', 'Beer'),
      buildTier('unknown_b' as any, 'Unknown B'),
    ];

    const result = sortTiers(tiers);

    expect(result[0].tier_level).toBe('beer');
    expect(result.slice(1).map((t) => t.tier_level)).toEqual(
      expect.arrayContaining(['unknown_a', 'unknown_b']),
    );
  });

  test('should not mutate the original array', () => {
    const tiers = [buildTier('brand', 'Brahma'), buildTier('beer', 'Beer')];
    const original = [...tiers];

    sortTiers(tiers);

    expect(tiers).toEqual(original);
  });

  test('should handle a single tier', () => {
    const tiers = [buildTier('beer', 'Beer')];

    const result = sortTiers(tiers);

    expect(result).toEqual(tiers);
    expect(result).not.toBe(tiers);
  });

  test('should return a new array even if already sorted', () => {
    const tiers = [buildTier('beer', 'Beer'), buildTier('core_co', 'Core Co')];

    const result = sortTiers(tiers);

    expect(result).toEqual(tiers);
    expect(result).not.toBe(tiers);
  });
});
