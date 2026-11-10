import { marketShareWaterfallConfig } from './marketShareWaterfallConfig';
import type { BarClickParams } from './types';

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getZoneByCountry: jest.fn(),
    }),
  },
}));

describe('marketShareWaterfallConfig', () => {
  it('exposes kpiName "market_share"', () => {
    expect(marketShareWaterfallConfig.kpiName).toBe('market_share');
  });

  it('always disables view-by regardless of context (override returns true)', () => {
    expect(
      marketShareWaterfallConfig.isViewByDisabled(
        'global',
        {},
        {} as BarClickParams['applied'],
      ),
    ).toBe(true);

    expect(
      marketShareWaterfallConfig.isViewByDisabled(
        'country',
        { waterfall_view_by: 'brand' },
        { zone: 'NAZ', country: 'BR' } as BarClickParams['applied'],
      ),
    ).toBe(true);
  });

  it('maps the "eur_zone" additional grouping to brand view', () => {
    expect(marketShareWaterfallConfig.groupingToViewBy.eur_zone).toEqual({
      'All Brands': 'brand',
    });
  });

  it('overrides the global grouping to All Brands -> country', () => {
    expect(marketShareWaterfallConfig.groupingToViewBy.global).toEqual({
      'All Brands': 'country',
    });
  });

  it('returns "eur_zone" context when zone is EUR and country is ABI (override)', () => {
    expect(
      marketShareWaterfallConfig.getContextKey(
        { zone: 'EUR', country: 'ABI' } as BarClickParams['applied'],
        true,
      ),
    ).toBe('eur_zone');
  });

  it('delegates to base getContextKey when the override returns null', () => {
    expect(
      marketShareWaterfallConfig.getContextKey(
        { brands: 'Stella' } as BarClickParams['applied'],
        true,
      ),
    ).toBe('brand');

    expect(
      marketShareWaterfallConfig.getContextKey(
        { country: 'BR' } as BarClickParams['applied'],
        false,
      ),
    ).toBe('country');
  });

  it('accepts the additional allowed context "eur_zone" in shouldSyncSubFilters', () => {
    expect(marketShareWaterfallConfig.shouldSyncSubFilters?.('eur_zone')).toBe(
      true,
    );
    expect(marketShareWaterfallConfig.shouldSyncSubFilters?.('brand')).toBe(
      true,
    );
  });
});
