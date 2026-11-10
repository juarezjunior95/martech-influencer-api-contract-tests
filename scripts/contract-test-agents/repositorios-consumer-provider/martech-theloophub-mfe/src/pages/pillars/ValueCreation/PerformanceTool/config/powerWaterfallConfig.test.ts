import { powerWaterfallConfig } from './powerWaterfallConfig';
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

describe('powerWaterfallConfig', () => {
  beforeEach(() => {
    mockGetZoneByCountry.mockReset();
  });

  it('exposes kpiName "power" with the expected view-by/grouping maps', () => {
    expect(powerWaterfallConfig.kpiName).toBe('power');
    expect(powerWaterfallConfig.viewByToGrouping).toEqual({
      portfolio: 'Portfolio',
      brand: 'All Brands',
      country: 'All Brands',
    });
    expect(powerWaterfallConfig.groupingToViewBy.country).toEqual({
      Portfolio: 'portfolio',
      'All Brands': 'brand',
    });
    expect(powerWaterfallConfig.groupingToViewBy.global).toEqual({
      Portfolio: 'portfolio',
      'All Brands': 'country',
    });
  });

  describe('isViewByDisabled', () => {
    it('disables the portfolio context regardless of other filters', () => {
      expect(
        powerWaterfallConfig.isViewByDisabled(
          'portfolio',
          {},
          {} as BarClickParams['applied'],
        ),
      ).toBe(true);
    });

    it('disables any context when a specific portfolio is selected inside ABI', () => {
      expect(
        powerWaterfallConfig.isViewByDisabled('global', {}, {
          portfolios: 'Premium',
          country: 'ABI',
        } as BarClickParams['applied']),
      ).toBe(true);
    });

    it('returns false when no base condition matches', () => {
      expect(
        powerWaterfallConfig.isViewByDisabled('country', {}, {
          portfolios: 'All',
          country: 'BR',
        } as BarClickParams['applied']),
      ).toBe(false);
    });
  });

  describe('getDisabledIndexes', () => {
    it('always includes the first and last positions', () => {
      const indexes = powerWaterfallConfig.getDisabledIndexes([
        'A',
        'B',
        'C',
        'D',
      ]);
      expect(indexes).toEqual(expect.arrayContaining([0, 3]));
    });

    it('marks "EUR", "Others" and "N/A" labels as disabled', () => {
      const indexes = powerWaterfallConfig
        .getDisabledIndexes(['Start', 'EUR', 'Others', 'N/A', 'End'])
        .sort();

      expect(indexes).toEqual([0, 1, 2, 3, 4]);
    });

    it('returns [0, -1] for an empty labels array', () => {
      expect(powerWaterfallConfig.getDisabledIndexes([])).toEqual([0, -1]);
    });
  });

  describe('handleBarClick', () => {
    it('country view: resolves zone via accessor and applies zone + country', () => {
      mockGetZoneByCountry.mockReturnValue({ value: 'NAZ' });
      const params = buildBarClickParams({
        labels: ['BR'],
        activeSubFilters: { waterfall_view_by: 'country' },
      });

      powerWaterfallConfig.handleBarClick(params);

      expect(mockGetZoneByCountry).toHaveBeenCalledWith({}, 'BR');
      expect(params.updateForm).toHaveBeenCalledWith('zone', 'NAZ');
      expect(params.updateForm).toHaveBeenCalledWith('country', 'BR');
      expect(params.apply).toHaveBeenCalledTimes(1);
    });

    it('country view: does nothing when the accessor cannot resolve the zone', () => {
      mockGetZoneByCountry.mockReturnValue(null);
      const params = buildBarClickParams({
        labels: ['ZZ'],
        activeSubFilters: { waterfall_view_by: 'country' },
      });

      powerWaterfallConfig.handleBarClick(params);

      expect(params.updateForm).not.toHaveBeenCalled();
      expect(params.apply).not.toHaveBeenCalled();
    });

    it('brand view: updates the brands filter with the clicked label and applies', () => {
      const params = buildBarClickParams({
        labels: ['Stella'],
        activeSubFilters: { waterfall_view_by: 'brand' },
      });

      powerWaterfallConfig.handleBarClick(params);

      expect(params.updateForm).toHaveBeenCalledWith('brands', 'Stella');
      expect(params.apply).toHaveBeenCalledTimes(1);
    });

    it('portfolio view: switches to Portfolio grouping, sets portfolios and resets brands to "All"', () => {
      const params = buildBarClickParams({
        labels: ['Premium'],
        activeSubFilters: { waterfall_view_by: 'portfolio' },
      });

      powerWaterfallConfig.handleBarClick(params);

      expect(params.updateForm).toHaveBeenCalledWith(
        'brand_filter_groupings',
        'Portfolio',
      );
      expect(params.updateForm).toHaveBeenCalledWith('portfolios', 'Premium');
      expect(params.updateForm).toHaveBeenCalledWith('brands', 'All');
      expect(params.apply).toHaveBeenCalledTimes(1);
    });

    it('does nothing when the clickedLabel is falsy (out-of-range index)', () => {
      const params = buildBarClickParams({ index: 5, labels: ['A'] });

      powerWaterfallConfig.handleBarClick(params);

      expect(params.updateForm).not.toHaveBeenCalled();
      expect(params.apply).not.toHaveBeenCalled();
    });
  });

  describe('shouldSyncSubFilters', () => {
    it('accepts only "country" and "global" contexts', () => {
      expect(powerWaterfallConfig.shouldSyncSubFilters?.('country')).toBe(true);
      expect(powerWaterfallConfig.shouldSyncSubFilters?.('global')).toBe(true);
      expect(powerWaterfallConfig.shouldSyncSubFilters?.('brand')).toBe(false);
      expect(powerWaterfallConfig.shouldSyncSubFilters?.('portfolio')).toBe(
        false,
      );
    });
  });

  describe('getViewByForForcedSync', () => {
    it('returns "country" when ABI has a specific portfolio applied', () => {
      expect(
        powerWaterfallConfig.getViewByForForcedSync?.({
          portfolios: 'Premium',
          country: 'ABI',
        } as BarClickParams['applied']),
      ).toBe('country');
    });

    it('returns null when portfolios is "All" or country is not ABI', () => {
      expect(
        powerWaterfallConfig.getViewByForForcedSync?.({
          portfolios: 'All',
          country: 'ABI',
        } as BarClickParams['applied']),
      ).toBeNull();

      expect(
        powerWaterfallConfig.getViewByForForcedSync?.({
          portfolios: 'Premium',
          country: 'BR',
        } as BarClickParams['applied']),
      ).toBeNull();
    });
  });

  describe('getContextKey', () => {
    it('returns "global" when applied is falsy', () => {
      expect(
        powerWaterfallConfig.getContextKey(
          null as unknown as BarClickParams['applied'],
          true,
        ),
      ).toBe('global');
    });

    it('returns "portfolio" when a specific portfolio is selected outside ABI', () => {
      expect(
        powerWaterfallConfig.getContextKey(
          {
            portfolios: 'Premium',
            country: 'BR',
          } as BarClickParams['applied'],
          false,
        ),
      ).toBe('portfolio');
    });

    it('returns "country" when not global zone and no portfolio override', () => {
      expect(
        powerWaterfallConfig.getContextKey(
          { country: 'BR' } as BarClickParams['applied'],
          false,
        ),
      ).toBe('country');
    });

    it('returns "global" when global zone and no portfolio override', () => {
      expect(
        powerWaterfallConfig.getContextKey(
          {} as BarClickParams['applied'],
          true,
        ),
      ).toBe('global');
    });
  });
});
