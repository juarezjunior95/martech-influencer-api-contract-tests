import {
  getRegionIdentifier,
  months,
  normalizeFilters,
  parseFilters,
  quarters,
} from './filter';

describe('filter', () => {
  describe('months constant', () => {
    it('should have 12 months', () => {
      expect(months).toHaveLength(12);
    });

    it('should start with Jan', () => {
      expect(months[0]).toBe('Jan');
    });

    it('should end with Dec', () => {
      expect(months[11]).toBe('Dec');
    });
  });

  describe('quarters constant', () => {
    it('should have 4 quarters', () => {
      expect(quarters).toHaveLength(4);
    });

    it('should have correct Q1 definition', () => {
      expect(quarters[0]).toEqual({ name: 'Q1', startMonth: 0, endMonth: 2 });
    });

    it('should have correct Q2 definition', () => {
      expect(quarters[1]).toEqual({ name: 'Q2', startMonth: 3, endMonth: 5 });
    });

    it('should have correct Q3 definition', () => {
      expect(quarters[2]).toEqual({ name: 'Q3', startMonth: 6, endMonth: 8 });
    });

    it('should have correct Q4 definition', () => {
      expect(quarters[3]).toEqual({ name: 'Q4', startMonth: 9, endMonth: 11 });
    });
  });

  describe('getRegionIdentifier', () => {
    it('should return ABI when zone is ABI', () => {
      expect(getRegionIdentifier('ABI', null)).toBe('ABI');
    });

    it('should return ABI when zone is ABI regardless of country', () => {
      expect(getRegionIdentifier('ABI', 'BR')).toBe('ABI');
    });

    it('should return country when zone is not ABI', () => {
      expect(getRegionIdentifier('NAZ', 'US')).toBe('US');
    });

    it('should return empty string when zone is not ABI and country is null', () => {
      expect(getRegionIdentifier('NAZ', null)).toBe('');
    });

    it('should return empty string when zone is not ABI and country is undefined', () => {
      expect(getRegionIdentifier('EUR', undefined)).toBe('');
    });

    it('should return country for different zones', () => {
      expect(getRegionIdentifier('EUR', 'DE')).toBe('DE');
      expect(getRegionIdentifier('APAC', 'JP')).toBe('JP');
    });
  });

  describe('parseFilters', () => {
    it('should return empty object for null input', () => {
      expect(parseFilters(null)).toEqual({});
    });

    it('should return empty object for undefined input', () => {
      expect(parseFilters(undefined)).toEqual({});
    });

    it('should parse filters with correct key format', () => {
      const filters = { zone: 'NAZ', country: 'US' };
      const result = parseFilters(filters);

      expect(result).toEqual({
        'filters[zone]': 'NAZ',
        'filters[country]': 'US',
      });
    });

    it('should map brands_abi to sub_brand', () => {
      const filters = { brands_abi: 'Brand1' };
      const result = parseFilters(filters);

      expect(result).toEqual({
        'filters[sub_brand]': 'Brand1',
      });
    });

    it('should map brands_comp to sub_brand_comp', () => {
      const filters = { brands_comp: 'CompBrand' };
      const result = parseFilters(filters);

      expect(result).toEqual({
        'filters[sub_brand_comp]': 'CompBrand',
      });
    });

    it('should exclude null values', () => {
      const filters = { zone: 'NAZ', country: null };
      const result = parseFilters(filters);

      expect(result).toEqual({
        'filters[zone]': 'NAZ',
      });
    });

    it('should handle mixed mapped and regular keys', () => {
      const filters = {
        zone: 'EUR',
        brands_abi: 'TestBrand',
        country: 'DE',
      };
      const result = parseFilters(filters);

      expect(result).toEqual({
        'filters[zone]': 'EUR',
        'filters[sub_brand]': 'TestBrand',
        'filters[country]': 'DE',
      });
    });
  });

  describe('normalizeFilters', () => {
    it('should normalize all filter fields', () => {
      const applied = {
        time_frame: '2023',
        pos_periods: 'QTD',
        zone: 'NAZ',
        country: 'US',
        brands: 'BrandA',
        sub_brands: 'SubBrandA',
        brands_abi: 'ABIBrand',
        brands_comp: 'CompBrand',
        'ytd-month': 'Jan',
        scopes: 'scope1',
        sub_scopes: 'subScope1',
      };

      const result = normalizeFilters(applied as any);

      expect(result).toEqual({
        timeframe: '2023',
        timeperiod: 'QTD',
        zone: 'NAZ',
        country: 'US',
        brand: 'BrandA',
        sub_brand: 'SubBrandA',
        sub_brand_comp: 'CompBrand',
        period: 'Jan',
        scope: 'scope1',
        sub_scope: 'subScope1',
      });
    });

    it('should use brands_abi when sub_brands is undefined', () => {
      const applied = {
        brands_abi: 'ABIBrand',
      };

      const result = normalizeFilters(applied as any);

      expect(result.sub_brand).toBe('ABIBrand');
    });

    it('should prefer sub_brands over brands_abi', () => {
      const applied = {
        sub_brands: 'SubBrand',
        brands_abi: 'ABIBrand',
      };

      const result = normalizeFilters(applied as any);

      expect(result.sub_brand).toBe('SubBrand');
    });

    it('should handle undefined values', () => {
      const applied = {};

      const result = normalizeFilters(applied as any);

      expect(result.timeframe).toBeUndefined();
      expect(result.zone).toBeUndefined();
    });
  });
});
