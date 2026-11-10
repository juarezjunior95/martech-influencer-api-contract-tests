import { createBaseWaterfallConfig } from './createBaseWaterfallConfig';
import type { BarClickParams } from './types';

const mockGetZoneByCountry = jest.fn();

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getZoneByCountry: (...args: unknown[]) => mockGetZoneByCountry(...args),
    }),
  },
}));

const buildBarClickParams = (
  overrides: Partial<BarClickParams> = {},
): BarClickParams => ({
  index: 0,
  labels: [],
  activeSubFilters: { waterfall_view_by: 'country' },
  dataFilters: {},
  applied: {} as BarClickParams['applied'],
  updateForm: jest.fn(),
  apply: jest.fn(),
  ...overrides,
});

describe('createBaseWaterfallConfig', () => {
  beforeEach(() => {
    mockGetZoneByCountry.mockReset();
  });

  it('exposes the kpiName provided to the factory and the default viewByToGrouping map', () => {
    const config = createBaseWaterfallConfig('volume');

    expect(config.kpiName).toBe('volume');
    expect(config.viewByToGrouping).toEqual({
      brand: 'All Brands',
      portfolio: 'Portfolio',
      beer_price_segment: 'Beer Price Segment',
      global: 'Global Brands',
    });
  });

  it('merges additionalGroupingToViewBy overrides into the base groupingToViewBy', () => {
    const config = createBaseWaterfallConfig('market_share', {
      additionalGroupingToViewBy: {
        eur_zone: { 'All Brands': 'brand' },
      },
    });

    expect(config.groupingToViewBy.eur_zone).toEqual({ 'All Brands': 'brand' });
    expect(config.groupingToViewBy.country).toEqual({
      Portfolio: 'portfolio',
      'All Brands': 'brand',
      'Beer Price Segment': 'beer_price_segment',
      'Global Brands': 'country',
    });
  });

  describe('isViewByDisabled', () => {
    it('disables when active sub-filter waterfall_view_by is "sub_brand"', () => {
      const config = createBaseWaterfallConfig('volume');

      expect(
        config.isViewByDisabled(
          'brand',
          { waterfall_view_by: 'sub_brand' },
          {} as BarClickParams['applied'],
        ),
      ).toBe(true);
    });

    it('disables when applied zone is EUR and brands is not "All"', () => {
      const config = createBaseWaterfallConfig('volume');

      expect(
        config.isViewByDisabled('country', {}, {
          zone: 'EUR',
          brands: 'Stella',
        } as BarClickParams['applied']),
      ).toBe(true);
    });

    it('disables when global_brands has a specific value (not "All")', () => {
      const config = createBaseWaterfallConfig('volume');

      expect(
        config.isViewByDisabled('global', {}, {
          global_brands: 'Corona',
        } as BarClickParams['applied']),
      ).toBe(true);
    });

    it('disables the portfolio context when a specific portfolios filter is set and country is not "ABI"', () => {
      const config = createBaseWaterfallConfig('volume');

      expect(
        config.isViewByDisabled('portfolio', {}, {
          portfolios: 'Premium',
          country: 'BR',
        } as BarClickParams['applied']),
      ).toBe(true);

      expect(
        config.isViewByDisabled('portfolio', {}, {
          portfolios: 'Premium',
          country: 'ABI',
        } as BarClickParams['applied']),
      ).toBeFalsy();
    });

    it('disables beer_price_segment / country contexts when a specific segment is set outside ABI', () => {
      const config = createBaseWaterfallConfig('volume');

      expect(
        config.isViewByDisabled('beer_price_segment', {}, {
          beer_price_segment: 'Premium',
          country: 'BR',
        } as BarClickParams['applied']),
      ).toBe(true);

      expect(
        config.isViewByDisabled('country', {}, {
          beer_price_segment: 'Premium',
          country: 'BR',
        } as BarClickParams['applied']),
      ).toBe(true);

      expect(
        config.isViewByDisabled('country', {}, {
          beer_price_segment: 'Premium',
          country: 'ABI',
        } as BarClickParams['applied']),
      ).toBeFalsy();
    });

    it('OR-merges base conditions with overrides.isViewByDisabled', () => {
      const config = createBaseWaterfallConfig('volume', {
        isViewByDisabled: () => true,
      });

      expect(
        config.isViewByDisabled('global', {}, {} as BarClickParams['applied']),
      ).toBe(true);
    });

    it('returns a falsy value when no base condition matches and no override is provided', () => {
      const config = createBaseWaterfallConfig('volume');

      expect(
        config.isViewByDisabled('global', { waterfall_view_by: 'brand' }, {
          zone: 'NAZ',
        } as BarClickParams['applied']),
      ).toBeFalsy();
    });
  });

  describe('getDisabledIndexes', () => {
    const config = createBaseWaterfallConfig('volume');

    it('always includes the first and last positions of the labels array', () => {
      const indexes = config.getDisabledIndexes(['A', 'B', 'C', 'D']);
      expect(indexes).toEqual(expect.arrayContaining([0, 3]));
    });

    it('marks "N/A", "NAB + Others" and "Others" labels as disabled', () => {
      const indexes = config.getDisabledIndexes([
        'Start',
        'N/A',
        'NAB + Others',
        'Others',
        'End',
      ]);
      expect(indexes.sort()).toEqual([0, 1, 2, 3, 4]);
    });

    it('disables the "Other" label only when the country is ABI, Global or CAN', () => {
      const labels = ['Start', 'Other', 'End'];
      const getDisabledIndexes = config.getDisabledIndexes as (
        labels?: string[],
        context?: { country?: string },
      ) => number[];

      expect(getDisabledIndexes(labels, { country: 'ABI' }).sort()).toEqual([
        0, 1, 2,
      ]);
      expect(getDisabledIndexes(labels, { country: 'BR' }).sort()).toEqual([
        0, 2,
      ]);
    });

    it('handles array-shaped labels by reading the first element for matching', () => {
      const indexes = config.getDisabledIndexes([
        ['Start'],
        ['Others'],
        ['End'],
      ] as unknown as string[]);

      expect(indexes.sort()).toEqual([0, 1, 2]);
    });

    it('returns [0, -1] for an empty labels array (first and last collapse)', () => {
      expect(config.getDisabledIndexes([])).toEqual([0, -1]);
    });
  });

  describe('handleBarClick', () => {
    const config = createBaseWaterfallConfig('volume');

    it('does nothing when clickedLabel is falsy (out-of-range index)', () => {
      const params = buildBarClickParams({ index: 5, labels: ['A'] });

      config.handleBarClick(params);

      expect(params.updateForm).not.toHaveBeenCalled();
      expect(params.apply).not.toHaveBeenCalled();
    });

    describe('country view', () => {
      it('clicking on EUR sets zone=EUR and promotes global_brands to brands', () => {
        const params = buildBarClickParams({
          labels: ['EUR'],
          activeSubFilters: { waterfall_view_by: 'country' },
          applied: { global_brands: 'Corona' } as BarClickParams['applied'],
        });

        config.handleBarClick(params);

        expect(params.updateForm).toHaveBeenCalledWith('zone', 'EUR');
        expect(params.updateForm).toHaveBeenCalledWith('global_brands', null);
        expect(params.updateForm).toHaveBeenCalledWith('brands', 'Corona');
        expect(params.apply).toHaveBeenCalledTimes(1);
      });

      it('clicking on a normal country resolves the zone via getZoneByCountry and applies it', () => {
        mockGetZoneByCountry.mockReturnValue({ value: 'NAZ' });
        const params = buildBarClickParams({
          labels: ['BR'],
          activeSubFilters: { waterfall_view_by: 'country' },
          applied: {} as BarClickParams['applied'],
        });

        config.handleBarClick(params);

        expect(mockGetZoneByCountry).toHaveBeenCalledWith({}, 'BR');
        expect(params.updateForm).toHaveBeenCalledWith('zone', 'NAZ');
        expect(params.updateForm).toHaveBeenCalledWith('country', 'BR');
        expect(params.apply).toHaveBeenCalledTimes(1);
      });

      it('preserves the Global Brands grouping when applied while changing country', () => {
        mockGetZoneByCountry.mockReturnValue({ value: 'NAZ' });
        const params = buildBarClickParams({
          labels: ['BR'],
          activeSubFilters: { waterfall_view_by: 'country' },
          applied: {
            brand_filter_groupings: 'Global Brands',
            global_brands: 'Stella',
          } as BarClickParams['applied'],
        });

        config.handleBarClick(params);

        expect(params.updateForm).toHaveBeenCalledWith(
          'brand_filter_groupings',
          'Global Brands',
        );
        expect(params.updateForm).toHaveBeenCalledWith(
          'global_brands',
          'Stella',
        );
      });

      it('does not call apply or updateForm when getZoneByCountry returns null and brands/grouping are empty', () => {
        mockGetZoneByCountry.mockReturnValue(null);
        const params = buildBarClickParams({
          labels: ['ZZ'],
          activeSubFilters: { waterfall_view_by: 'country' },
          applied: {} as BarClickParams['applied'],
        });

        config.handleBarClick(params);

        expect(params.updateForm).not.toHaveBeenCalled();
        expect(params.apply).toHaveBeenCalledTimes(1);
      });
    });

    describe('brand view', () => {
      it('clicking on a brand inside ABI promotes it to global_brands', () => {
        const params = buildBarClickParams({
          labels: [['Corona', 'ABI']] as unknown as string[],
          activeSubFilters: { waterfall_view_by: 'brand' },
          applied: {} as BarClickParams['applied'],
        });

        config.handleBarClick(params);

        expect(params.updateForm).toHaveBeenCalledWith(
          'brand_filter_groupings',
          'Global Brands',
        );
        expect(params.updateForm).toHaveBeenCalledWith(
          'global_brands',
          'Corona',
        );
        expect(params.apply).toHaveBeenCalledTimes(1);
      });

      it('preserves portfolios when a specific portfolio is applied', () => {
        mockGetZoneByCountry.mockReturnValue({ value: 'NAZ' });
        const params = buildBarClickParams({
          labels: [['Stella', 'BR']] as unknown as string[],
          activeSubFilters: { waterfall_view_by: 'brand' },
          applied: { portfolios: 'Premium' } as BarClickParams['applied'],
        });

        config.handleBarClick(params);

        expect(params.updateForm).toHaveBeenCalledWith(
          'brand_filter_groupings',
          'Portfolio',
        );
        expect(params.updateForm).toHaveBeenCalledWith('portfolios', 'Premium');
        expect(params.updateForm).toHaveBeenCalledWith('brands', 'Stella');
      });

      it('preserves beer_price_segment when a specific segment is applied', () => {
        mockGetZoneByCountry.mockReturnValue({ value: 'NAZ' });
        const params = buildBarClickParams({
          labels: [['Stella', 'BR']] as unknown as string[],
          activeSubFilters: { waterfall_view_by: 'brand' },
          applied: {
            beer_price_segment: 'Premium',
          } as BarClickParams['applied'],
        });

        config.handleBarClick(params);

        expect(params.updateForm).toHaveBeenCalledWith(
          'brand_filter_groupings',
          'Beer Price Segment',
        );
        expect(params.updateForm).toHaveBeenCalledWith(
          'beer_price_segment',
          'Premium',
        );
      });

      it('ignores portfolio/segment preservation when filters are "All"', () => {
        mockGetZoneByCountry.mockReturnValue({ value: 'NAZ' });
        const params = buildBarClickParams({
          labels: [['Stella', 'BR']] as unknown as string[],
          activeSubFilters: { waterfall_view_by: 'brand' },
          applied: {
            portfolios: 'All',
            beer_price_segment: 'All',
          } as BarClickParams['applied'],
        });

        config.handleBarClick(params);

        expect(params.updateForm).not.toHaveBeenCalledWith(
          'brand_filter_groupings',
          'Portfolio',
        );
        expect(params.updateForm).not.toHaveBeenCalledWith(
          'brand_filter_groupings',
          'Beer Price Segment',
        );
        expect(params.updateForm).toHaveBeenCalledWith('brands', 'Stella');
      });
    });

    it('portfolio view: switches grouping to Portfolio and sets the clicked label as portfolios', () => {
      const params = buildBarClickParams({
        labels: ['Premium'],
        activeSubFilters: { waterfall_view_by: 'portfolio' },
      });

      config.handleBarClick(params);

      expect(params.updateForm).toHaveBeenCalledWith(
        'brand_filter_groupings',
        'Portfolio',
      );
      expect(params.updateForm).toHaveBeenCalledWith('portfolios', 'Premium');
      expect(params.apply).toHaveBeenCalledTimes(1);
    });

    it('beer_price_segment view: switches grouping and resets brands to "All"', () => {
      const params = buildBarClickParams({
        labels: ['Premium'],
        activeSubFilters: { waterfall_view_by: 'beer_price_segment' },
      });

      config.handleBarClick(params);

      expect(params.updateForm).toHaveBeenCalledWith(
        'brand_filter_groupings',
        'Beer Price Segment',
      );
      expect(params.updateForm).toHaveBeenCalledWith(
        'beer_price_segment',
        'Premium',
      );
      expect(params.updateForm).toHaveBeenCalledWith('brands', 'All');
    });

    it('sub_brand view: updates the sub_brands filter with the clicked label', () => {
      const params = buildBarClickParams({
        labels: ['Stella Pure Malt'],
        activeSubFilters: { waterfall_view_by: 'sub_brand' },
      });

      config.handleBarClick(params);

      expect(params.updateForm).toHaveBeenCalledWith(
        'sub_brands',
        'Stella Pure Malt',
      );
      expect(params.apply).toHaveBeenCalledTimes(1);
    });

    it('does nothing when waterfall_view_by points to an unknown view', () => {
      const params = buildBarClickParams({
        labels: ['Foo'],
        activeSubFilters: { waterfall_view_by: 'unknown_view' },
      });

      config.handleBarClick(params);

      expect(params.updateForm).not.toHaveBeenCalled();
      expect(params.apply).not.toHaveBeenCalled();
    });
  });

  describe('getContextKey', () => {
    const config = createBaseWaterfallConfig('volume');

    it('returns "global" when applied is falsy', () => {
      expect(
        config.getContextKey(
          null as unknown as BarClickParams['applied'],
          true,
        ),
      ).toBe('global');
    });

    it('returns "brand" when a specific brand or global_brand is selected', () => {
      expect(
        config.getContextKey(
          { brands: 'Stella' } as BarClickParams['applied'],
          true,
        ),
      ).toBe('brand');
      expect(
        config.getContextKey(
          { global_brands: 'Corona' } as BarClickParams['applied'],
          true,
        ),
      ).toBe('brand');
    });

    it('returns "beer_price_segment" when grouping is Beer Price Segment with a specific value', () => {
      expect(
        config.getContextKey(
          {
            brand_filter_groupings: 'Beer Price Segment',
            beer_price_segment: 'Premium',
          } as BarClickParams['applied'],
          false,
        ),
      ).toBe('beer_price_segment');
    });

    it('returns "portfolio" when a specific portfolio is selected', () => {
      expect(
        config.getContextKey(
          { portfolios: 'Premium' } as BarClickParams['applied'],
          false,
        ),
      ).toBe('portfolio');
    });

    it('returns Beyond Beer global/country flavor based on isGlobalZone', () => {
      const applied = {
        growth_levers: 'Beyond Beer',
      } as BarClickParams['applied'];

      expect(config.getContextKey(applied, true)).toBe('beyond_beer_global');
      expect(config.getContextKey(applied, false)).toBe('beyond_beer_country');
    });

    it('falls back to "country" when not global zone and no specific filter applies', () => {
      expect(config.getContextKey({} as BarClickParams['applied'], false)).toBe(
        'country',
      );
    });

    it('falls back to "global" when global zone and no specific filter applies', () => {
      expect(config.getContextKey({} as BarClickParams['applied'], true)).toBe(
        'global',
      );
    });

    it('uses getContextKeyOverride first when it returns a non-null value', () => {
      const config2 = createBaseWaterfallConfig('volume', {
        getContextKeyOverride: () => 'eur_zone',
      });

      expect(
        config2.getContextKey({} as BarClickParams['applied'], false),
      ).toBe('eur_zone');
    });

    it('ignores getContextKeyOverride when it returns null and falls back to base logic', () => {
      const config2 = createBaseWaterfallConfig('volume', {
        getContextKeyOverride: () => null,
      });

      expect(
        config2.getContextKey(
          { brands: 'Stella' } as BarClickParams['applied'],
          false,
        ),
      ).toBe('brand');
    });
  });

  describe('getViewByForForcedSync', () => {
    const config = createBaseWaterfallConfig('volume');

    it('returns "country" when EUR + brand specific + country is ABI', () => {
      expect(
        config.getViewByForForcedSync?.({
          zone: 'EUR',
          brands: 'Stella',
          country: 'ABI',
        } as BarClickParams['applied']),
      ).toBe('country');
    });

    it('returns "sub_brand" when Global Brands grouping + specific global_brand outside ABI', () => {
      expect(
        config.getViewByForForcedSync?.({
          brand_filter_groupings: 'Global Brands',
          global_brands: 'Stella',
          country: 'BR',
        } as BarClickParams['applied']),
      ).toBe('sub_brand');
    });

    it('returns null when no forced-sync condition matches', () => {
      expect(
        config.getViewByForForcedSync?.({
          zone: 'NAZ',
          country: 'BR',
        } as BarClickParams['applied']),
      ).toBeNull();
    });
  });

  describe('shouldSyncSubFilters', () => {
    it('accepts the 7 base allowed contexts', () => {
      const config = createBaseWaterfallConfig('volume');

      [
        'brand',
        'beer_price_segment',
        'portfolio',
        'country',
        'global',
        'beyond_beer_global',
        'beyond_beer_country',
      ].forEach((ctx) => {
        expect(config.shouldSyncSubFilters?.(ctx)).toBe(true);
      });
    });

    it('rejects unknown contexts when no overrides are provided', () => {
      const config = createBaseWaterfallConfig('volume');

      expect(config.shouldSyncSubFilters?.('eur_zone')).toBe(false);
    });

    it('accepts additional contexts provided via overrides', () => {
      const config = createBaseWaterfallConfig('market_share', {
        additionalAllowedContexts: ['eur_zone'],
      });

      expect(config.shouldSyncSubFilters?.('eur_zone')).toBe(true);
    });
  });
});
