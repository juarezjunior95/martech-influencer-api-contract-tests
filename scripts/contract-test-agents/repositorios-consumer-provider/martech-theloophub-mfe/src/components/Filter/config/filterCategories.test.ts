import {
  FILTER_CATEGORIES,
  getCategoryByField,
  groupFieldsByCategory,
} from './filterCategories';

describe('filterCategories', () => {
  describe('FILTER_CATEGORIES constant', () => {
    it('should have correct number of categories', () => {
      expect(FILTER_CATEGORIES).toHaveLength(7);
    });

    it('should have all required categories', () => {
      const categoryIds = FILTER_CATEGORIES.map((cat) => cat.id);
      expect(categoryIds).toContain('kpis');
      expect(categoryIds).toContain('geographic');
      expect(categoryIds).toContain('products');
      expect(categoryIds).toContain('brands');
      expect(categoryIds).toContain('timeframe');
      expect(categoryIds).toContain('growth_levers');
      expect(categoryIds).toContain('scopes');
    });

    it('should have valid structure for each category', () => {
      FILTER_CATEGORIES.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('title');
        expect(category).toHaveProperty('fields');
        expect(typeof category.id).toBe('string');
        expect(typeof category.title).toBe('string');
        expect(Array.isArray(category.fields)).toBe(true);
        expect(category.fields.length).toBeGreaterThan(0);
      });
    });

    it('should have geographic category with correct fields', () => {
      const geographic = FILTER_CATEGORIES.find(
        (cat) => cat.id === 'geographic',
      );
      expect(geographic).toBeDefined();
      expect(geographic?.title).toBe('Geographic');
      expect(geographic?.fields).toEqual(['zone', 'country']);
      expect(geographic?.defaultOpen).toBe(true);
    });

    it('should have products category with correct fields', () => {
      const products = FILTER_CATEGORIES.find((cat) => cat.id === 'products');
      expect(products).toBeDefined();
      expect(products?.title).toBe('Product Type');
      expect(products?.fields).toEqual(['segments', 'product_scope']);
      expect(products?.defaultOpen).toBe(true);
    });

    it('should have brands category with correct fields', () => {
      const brands = FILTER_CATEGORIES.find((cat) => cat.id === 'brands');
      expect(brands).toBeDefined();
      expect(brands?.title).toBe('Brands');
      expect(brands?.fields).toEqual([
        'brand_filter_groupings',
        'portfolios',
        'beer_price_segment',
        'global_brands',
        'brands',
        'sub_brands',
        'brands_abi',
        'brands_comp',
        'audience_targeting_brands',
        'audience_targeting_brands_comp',
      ]);
      expect(brands?.defaultOpen).toBe(true);
    });

    it('should have timeframe category with correct fields', () => {
      const timeframe = FILTER_CATEGORIES.find((cat) => cat.id === 'timeframe');
      expect(timeframe).toBeDefined();
      expect(timeframe?.title).toBe('Time Frame');
      expect(timeframe?.fields).toEqual([
        'years',
        'ytd-month',
        'pos_periods',
        'periods',
      ]);
      expect(timeframe?.defaultOpen).toBe(true);
    });

    it('should have scopes category with correct fields', () => {
      const scopes = FILTER_CATEGORIES.find((cat) => cat.id === 'scopes');
      expect(scopes).toBeDefined();
      expect(scopes?.title).toBe('Scopes');
      expect(scopes?.fields).toEqual([
        'distribution_scopes',
        'scopes',
        'sub_scopes',
      ]);
      expect(scopes?.defaultOpen).toBe(true);
    });
  });

  describe('getCategoryByField', () => {
    it('should return correct category for geographic field "zone"', () => {
      const category = getCategoryByField('zone');
      expect(category).toBeDefined();
      expect(category?.id).toBe('geographic');
      expect(category?.title).toBe('Geographic');
    });

    it('should return correct category for geographic field "country"', () => {
      const category = getCategoryByField('country');
      expect(category).toBeDefined();
      expect(category?.id).toBe('geographic');
    });

    it('should return correct category for brands field "brands"', () => {
      const category = getCategoryByField('brands');
      expect(category).toBeDefined();
      expect(category?.id).toBe('brands');
      expect(category?.title).toBe('Brands');
    });

    it('should return correct category for brands field "sub_brands"', () => {
      const category = getCategoryByField('sub_brands');
      expect(category).toBeDefined();
      expect(category?.id).toBe('brands');
    });

    it('should return correct category for timeframe field "ytd-month"', () => {
      const category = getCategoryByField('ytd-month');
      expect(category).toBeDefined();
      expect(category?.id).toBe('timeframe');
      expect(category?.title).toBe('Time Frame');
    });

    it('should return correct category for scopes field "scopes"', () => {
      const category = getCategoryByField('scopes');
      expect(category).toBeDefined();
      expect(category?.id).toBe('scopes');
      expect(category?.title).toBe('Scopes');
    });

    it('should be case insensitive', () => {
      const categoryLower = getCategoryByField('zone');
      const categoryUpper = getCategoryByField('ZONE');
      const categoryMixed = getCategoryByField('ZoNe');

      expect(categoryLower).toEqual(categoryUpper);
      expect(categoryLower).toEqual(categoryMixed);
    });

    it('should return undefined for non-existent field', () => {
      const category = getCategoryByField('non_existent_field');
      expect(category).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const category = getCategoryByField('');
      expect(category).toBeUndefined();
    });

    it('should return correct category for products field "segments"', () => {
      const category = getCategoryByField('segments');
      expect(category).toBeDefined();
      expect(category?.id).toBe('products');
      expect(category?.title).toBe('Product Type');
    });

    it('should return correct category for products field "product_scope"', () => {
      const category = getCategoryByField('product_scope');
      expect(category).toBeDefined();
      expect(category?.id).toBe('products');
      expect(category?.title).toBe('Product Type');
    });
  });

  describe('groupFieldsByCategory', () => {
    it('should group fields correctly by category', () => {
      const fields = ['zone', 'country', 'segments', 'brands', 'ytd-month'];
      const grouped = groupFieldsByCategory(fields);

      expect(grouped['geographic']).toEqual(['zone', 'country']);
      expect(grouped['products']).toEqual(['segments']);
      expect(grouped['brands']).toEqual(['brands']);
      expect(grouped['timeframe']).toEqual(['ytd-month']);
    });

    it('should handle empty array', () => {
      const grouped = groupFieldsByCategory([]);
      expect(Object.keys(grouped)).toHaveLength(0);
    });

    it('should remove empty categories', () => {
      const fields = ['zone', 'segments', 'brands'];
      const grouped = groupFieldsByCategory(fields);

      expect(grouped['geographic']).toBeDefined();
      expect(grouped['products']).toBeDefined();
      expect(grouped['brands']).toBeDefined();
      expect(grouped['timeframe']).toBeUndefined();
      expect(grouped['scopes']).toBeUndefined();
    });

    it('should create uncategorized group for unknown fields', () => {
      const fields = ['zone', 'unknown_field', 'another_unknown'];
      const grouped = groupFieldsByCategory(fields);

      expect(grouped['geographic']).toEqual(['zone']);
      expect(grouped['uncategorized']).toEqual([
        'unknown_field',
        'another_unknown',
      ]);
    });

    it('should remove uncategorized group if empty', () => {
      const fields = ['zone', 'brands'];
      const grouped = groupFieldsByCategory(fields);

      expect(grouped['uncategorized']).toBeUndefined();
    });

    it('should handle all fields from all categories', () => {
      const fields = [
        'zone',
        'country',
        'segments',
        'brands',
        'sub_brands',
        'brands_abi',
        'ytd-month',
        'pos_periods',
        'scopes',
        'sub_scopes',
      ];
      const grouped = groupFieldsByCategory(fields);

      expect(grouped['geographic']).toHaveLength(2);
      expect(grouped['products']).toHaveLength(1);
      expect(grouped['brands']).toHaveLength(3);
      expect(grouped['timeframe']).toHaveLength(2);
      expect(grouped['scopes']).toHaveLength(2);
      expect(grouped['uncategorized']).toBeUndefined();
    });

    it('should maintain field order within categories', () => {
      const fields = ['country', 'zone', 'brands', 'sub_brands'];
      const grouped = groupFieldsByCategory(fields);

      expect(grouped['geographic']).toEqual(['country', 'zone']);
      expect(grouped['brands']).toEqual(['brands', 'sub_brands']);
    });

    it('should handle duplicate fields', () => {
      const fields = ['zone', 'zone', 'brands', 'brands'];
      const grouped = groupFieldsByCategory(fields);

      expect(grouped['geographic']).toEqual(['zone', 'zone']);
      expect(grouped['brands']).toEqual(['brands', 'brands']);
    });

    it('should be case insensitive for field matching', () => {
      const fields = ['ZONE', 'Country', 'BRANDS'];
      const grouped = groupFieldsByCategory(fields);

      expect(grouped['geographic']).toEqual(['ZONE', 'Country']);
      expect(grouped['brands']).toEqual(['BRANDS']);
    });

    it('should handle mixed known and unknown fields', () => {
      const fields = [
        'zone',
        'unknown1',
        'segments',
        'brands',
        'unknown2',
        'scopes',
      ];
      const grouped = groupFieldsByCategory(fields);

      expect(grouped['geographic']).toEqual(['zone']);
      expect(grouped['products']).toEqual(['segments']);
      expect(grouped['brands']).toEqual(['brands']);
      expect(grouped['scopes']).toEqual(['scopes']);
      expect(grouped['uncategorized']).toEqual(['unknown1', 'unknown2']);
    });
  });
});
