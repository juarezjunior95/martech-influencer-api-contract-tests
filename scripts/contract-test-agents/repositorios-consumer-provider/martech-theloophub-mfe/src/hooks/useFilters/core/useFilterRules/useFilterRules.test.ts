import { renderHook } from '@testing-library/react-hooks';
import { FilterState } from 'domain/Filter/FilterRules';

import { filterOptions, useFilterRules } from './useFilterRules';

const BASE_STATE: FilterState = {
  kpi: '',
  growthLever: 'All',
  country: '',
  zone: '',
  brandClass: 'All Brands',
  brand: '',
  portfolio: undefined,
  beerPriceSegment: undefined,
};

const buildState = (overrides: Partial<FilterState> = {}): FilterState => ({
  ...BASE_STATE,
  ...overrides,
});

describe('useFilterRules', () => {
  const getHook = () => {
    const { result } = renderHook(() => useFilterRules());
    return result.current;
  };

  describe('filterOptions', () => {
    const options = [
      { value: 'All', label: 'All' },
      { value: 'Premium', label: 'Premium' },
      { value: 'Core', label: 'Core' },
      { value: 'Value', label: 'Value' },
    ];

    it('should return all options when allowed is null', () => {
      expect(filterOptions(options, null)).toEqual(options);
    });

    it('should return all options when allowed is empty', () => {
      expect(filterOptions(options, [])).toEqual(options);
    });

    it('should keep "All" and allowed values only', () => {
      const result = filterOptions(options, ['Premium', 'Core']);
      expect(result).toEqual([
        { value: 'All', label: 'All' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Core', label: 'Core' },
      ]);
    });

    it('should filter out non-allowed values', () => {
      const result = filterOptions(options, ['Premium']);
      expect(result).not.toContainEqual({ value: 'Core', label: 'Core' });
      expect(result).not.toContainEqual({ value: 'Value', label: 'Value' });
    });

    it('should compare primitive values without stringifying objects', () => {
      const mixedOptions = [
        { value: 'All', label: 'All' },
        { value: 2024, label: '2024' },
        { value: { code: 'Premium' }, label: 'Premium object' },
      ];

      const result = filterOptions(mixedOptions, ['2024', '[object Object]']);

      expect(result).toEqual([
        { value: 'All', label: 'All' },
        { value: 2024, label: '2024' },
      ]);
    });
  });

  describe('isBrandClassAvailable', () => {
    it('should return true when no rules mark it as notAvailable', () => {
      const { isBrandClassAvailable } = getHook();
      const state = buildState({ kpi: 'volume', zone: '', country: '' });

      expect(isBrandClassAvailable('All Brands', state)).toBe(true);
    });

    it('should return false when kpiRule marks it as notAvailable', () => {
      const { isBrandClassAvailable } = getHook();
      const state = buildState({ kpi: 'volume', zone: 'MAZ' });

      expect(isBrandClassAvailable('Global Brands', state)).toBe(false);
    });

    it('should return false when growthLeverRule marks it as notAvailable', () => {
      const { isBrandClassAvailable } = getHook();
      const state = buildState({
        kpi: 'volume',
        growthLever: 'Lead Premium',
        zone: 'MAZ',
      });

      expect(isBrandClassAvailable('Global Brands', state)).toBe(false);
    });

    it('should return true for Portfolio at country level with volume', () => {
      const { isBrandClassAvailable } = getHook();
      const state = buildState({ kpi: 'volume', country: 'Brazil' });

      expect(isBrandClassAvailable('Portfolio', state)).toBe(true);
    });
  });

  describe('getFieldConfig - brands', () => {
    describe('Global Brands classification', () => {
      it('should hide brands field when brandClass is Global Brands', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Global Brands',
          country: 'Brazil',
        });

        const config = getFieldConfig('brands', state);
        expect(config.hidden).toBe(true);
        expect(config.label).toBe('Global Brand');
      });
    });

    describe('All Brands classification', () => {
      it('should return defaultValue "All" at global level', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'All Brands',
        });

        const config = getFieldConfig('brands', state);
        expect(config.defaultValue).toBe('All');
        expect(config.disabled).toBe(false);
        expect(config.label).toBe('Brand');
      });

      it('should return disabled false with defaultValue "All" at zone level (brandLocked + All Brands)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'All Brands',
          zone: 'MAZ',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(false);
        expect(config.defaultValue).toBe('All');
        expect(config.placeholder).toBeUndefined();
      });

      it('should return defaultValue "All" at country level', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'All Brands',
          country: 'Brazil',
        });

        const config = getFieldConfig('brands', state);
        expect(config.defaultValue).toBe('All');
        expect(config.disabled).toBe(false);
      });
    });

    describe('Portfolio classification', () => {
      it('should show placeholder when portfolio is not selected (volume + zone)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Portfolio',
          zone: 'MAZ',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(true);
        expect(config.placeholder).toBe('Select a Portfolio first');
        expect(config.defaultValue).toBeNull();
      });

      it('should show placeholder when portfolio is "All" (volume + zone)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Portfolio',
          zone: 'MAZ',
          portfolio: 'All',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(true);
        expect(config.placeholder).toBe('Select a Portfolio first');
      });

      it('should be enabled when portfolio has a specific value (volume + country)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Portfolio',
          country: 'Brazil',
          portfolio: 'Megabrands',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(false);
        expect(config.hidden).toBe(false);
      });

      it('should show placeholder when portfolio is empty (volume + country)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Portfolio',
          country: 'Brazil',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(true);
        expect(config.placeholder).toBe('Select a Portfolio first');
      });

      it('should hide brands when brandHidden rule applies (volume + global)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Portfolio',
        });

        const config = getFieldConfig('brands', state);
        expect(config.hidden).toBe(true);
      });
    });

    describe('Beer Price Segment classification', () => {
      it('should show placeholder when BPS is not selected (volume + zone)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Beer Price Segment',
          zone: 'MAZ',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(true);
        expect(config.placeholder).toBe('Select a Segment first');
      });

      it('should show placeholder when BPS is empty (volume + country)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Beer Price Segment',
          country: 'Brazil',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(true);
        expect(config.placeholder).toBe('Select a Segment first');
      });

      it('should be enabled when BPS has a specific value (volume + country)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Beer Price Segment',
          country: 'Brazil',
          beerPriceSegment: 'Premium',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(false);
      });

      it('should hide brands when brandHidden rule applies (volume + global)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          brandClass: 'Beer Price Segment',
        });

        const config = getFieldConfig('brands', state);
        expect(config.hidden).toBe(true);
      });
    });

    describe('Growth Lever rules (GL overrides KPI)', () => {
      it('should lock brand with "All" when GL rule has locked (Lead Premium + zone)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          growthLever: 'Lead Premium',
          brandClass: 'All Brands',
          zone: 'MAZ',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(true);
        expect(config.defaultValue).toBe('All');
      });

      it('should lock brand with "All" when GL rule has locked (Superior Core + global)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          growthLever: 'Superior Core',
          brandClass: 'All Brands',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(true);
        expect(config.defaultValue).toBe('All');
      });

      it('should show placeholder for Portfolio with brandLocked GL rule (Lead Premium + country)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'volume',
          growthLever: 'Lead Premium',
          brandClass: 'Portfolio',
          country: 'Brazil',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(true);
        expect(config.placeholder).toBe('Select a Portfolio first');
      });
    });

    describe('power KPI', () => {
      it('should not disable brands for All Brands at global level', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'power',
          brandClass: 'All Brands',
        });

        const config = getFieldConfig('brands', state);
        expect(config.defaultValue).toBe('All');
        expect(config.disabled).toBe(false);
      });

      it('should show placeholder for Portfolio at global level (brandLocked)', () => {
        const { getFieldConfig } = getHook();
        const state = buildState({
          kpi: 'power',
          brandClass: 'Portfolio',
        });

        const config = getFieldConfig('brands', state);
        expect(config.disabled).toBe(true);
        expect(config.placeholder).toBeNull();
      });
    });
  });

  describe('getFieldConfig - global_brands', () => {
    it('should be hidden when brandClass is not Global Brands', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'All Brands',
      });

      const config = getFieldConfig('global_brands', state);
      expect(config.hidden).toBe(true);
    });

    it('should be visible when brandClass is Global Brands at global level', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'Global Brands',
      });

      const config = getFieldConfig('global_brands', state);
      expect(config.hidden).toBe(false);
      expect(config.label).toBe('Global Brand');
    });

    it('should have no default when noAllOption rule applies', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'Global Brands',
      });

      const config = getFieldConfig('global_brands', state);
      expect(config.defaultValue).toBeNull();
    });

    it('should be disabled and hidden when notAvailable', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'Global Brands',
        zone: 'MAZ',
      });

      const config = getFieldConfig('global_brands', state);
      expect(config.disabled).toBe(true);
      expect(config.hidden).toBe(true);
    });
  });

  describe('getFieldConfig - sub_brands', () => {
    it('should be hidden when subBrandHidden rule applies (volume + global + All Brands)', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'All Brands',
      });

      const config = getFieldConfig('sub_brands', state);
      expect(config.hidden).toBe(true);
    });

    it('should be hidden for performance tool outside country', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'All Brands',
        zone: 'MAZ',
      });

      const config = getFieldConfig('sub_brands', state);
      expect(config.hidden).toBe(true);
    });

    it('should show placeholder for Portfolio at country level with empty portfolio (volume)', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'Portfolio',
        country: 'Brazil',
      });

      const config = getFieldConfig('sub_brands', state);
      expect(config.disabled).toBe(true);
      expect(config.placeholder).toBe('Select a Portfolio first');
    });

    it('should show placeholder for BPS at country level with empty BPS (volume)', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'Beer Price Segment',
        country: 'Brazil',
      });

      const config = getFieldConfig('sub_brands', state);
      expect(config.disabled).toBe(true);
      expect(config.placeholder).toBe('Select a Segment first');
    });

    it('should be enabled for All Brands at country level (volume)', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'All Brands',
        country: 'Brazil',
      });

      const config = getFieldConfig('sub_brands', state);
      expect(config.disabled).toBe(false);
      expect(config.hidden).toBe(false);
    });

    it('should be disabled when Global Brands on non-performance-tool pages', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'other',
        brandClass: 'Global Brands',
        country: 'Brazil',
      });

      const config = getFieldConfig('sub_brands', state);
      expect(config.disabled).toBe(true);
    });

    it('should be disabled when brand is "All" on non-performance-tool pages', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'other',
        brandClass: 'All Brands',
        brand: 'All',
        country: 'Brazil',
      });

      const config = getFieldConfig('sub_brands', state);
      expect(config.disabled).toBe(true);
    });

    it('should be hidden at global level on non-performance-tool pages', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'other',
        brandClass: 'All Brands',
        brand: 'Stella',
      });

      const config = getFieldConfig('sub_brands', state);
      expect(config.hidden).toBe(true);
    });

    it('should be enabled when brand is specific at country level (non-performance-tool)', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'other',
        brandClass: 'All Brands',
        brand: 'Stella',
        country: 'Brazil',
      });

      const config = getFieldConfig('sub_brands', state);
      expect(config.disabled).toBe(false);
      expect(config.hidden).toBe(false);
    });
  });

  describe('getFieldConfig - portfolios', () => {
    it('should be visible when brandClass is Portfolio', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'Portfolio',
        country: 'Brazil',
      });

      const config = getFieldConfig('portfolios', state);
      expect(config.hidden).toBe(false);
      expect(config.defaultValue).toBe('All');
      expect(config.label).toBe('Portfolio');
    });

    it('should be hidden when brandClass is not Portfolio', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'All Brands',
      });

      const config = getFieldConfig('portfolios', state);
      expect(config.hidden).toBe(true);
    });

    it('should have allowedValues from rule', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        growthLever: 'Lead Premium',
        brandClass: 'Portfolio',
        country: 'Brazil',
      });

      const config = getFieldConfig('portfolios', state);
      expect(config.allowedValues).toEqual([
        'Megabrands',
        'Expansion',
        'Sustain',
        'Tail',
      ]);
    });
  });

  describe('getFieldConfig - beer_price_segment', () => {
    it('should be visible when brandClass is Beer Price Segment', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'Beer Price Segment',
        country: 'Brazil',
      });

      const config = getFieldConfig('beer_price_segment', state);
      expect(config.hidden).toBe(false);
      expect(config.defaultValue).toBe('All');
      expect(config.label).toBe('Beer Price Segment');
    });

    it('should be hidden when brandClass is not Beer Price Segment', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'All Brands',
      });

      const config = getFieldConfig('beer_price_segment', state);
      expect(config.hidden).toBe(true);
    });

    it('should have allowedValues from rule (volume + global)', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        brandClass: 'Beer Price Segment',
      });

      const config = getFieldConfig('beer_price_segment', state);
      expect(config.allowedValues).toEqual([
        'Super Premium',
        'Premium',
        'Core+',
        'Core',
        'Value',
      ]);
    });

    it('should be disabled and hidden when notAvailable', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({
        kpi: 'volume',
        growthLever: 'Beyond Beer',
        brandClass: 'Beer Price Segment',
        country: 'Brazil',
      });

      const config = getFieldConfig('beer_price_segment', state);
      expect(config.disabled).toBe(true);
      expect(config.hidden).toBe(true);
    });
  });

  describe('getFieldConfig - brand_filter_groupings', () => {
    it('should always return default "All Brands"', () => {
      const { getFieldConfig } = getHook();
      const state = buildState();

      const config = getFieldConfig('brand_filter_groupings', state);
      expect(config.defaultValue).toBe('All Brands');
      expect(config.label).toBe('Brand Classification');
    });
  });

  describe('getFieldConfig - growth_levers', () => {
    it('should be visible when kpi is volume', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({ kpi: 'volume' });

      const config = getFieldConfig('growth_levers', state);
      expect(config.hidden).toBe(false);
      expect(config.defaultValue).toBe('All');
      expect(config.label).toBe('Growth Lever');
    });

    it('should be hidden when kpi is not volume', () => {
      const { getFieldConfig } = getHook();
      const state = buildState({ kpi: 'power' });

      const config = getFieldConfig('growth_levers', state);
      expect(config.hidden).toBe(true);
    });
  });

  describe('getFieldConfig - unknown field', () => {
    it('should return a basic config with fieldKey as label', () => {
      const { getFieldConfig } = getHook();
      const state = buildState();

      const config = getFieldConfig('some_unknown_field', state);
      expect(config.label).toBe('some_unknown_field');
      expect(config.disabled).toBe(false);
      expect(config.hidden).toBe(false);
    });
  });
});
