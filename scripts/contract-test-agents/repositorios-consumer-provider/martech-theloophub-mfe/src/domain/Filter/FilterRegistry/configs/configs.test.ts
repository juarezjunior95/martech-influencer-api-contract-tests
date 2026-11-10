import FilterRegistry from '../FilterRegistry';
import { brandsFilterConfig } from './brandsFilter';
import { countryFilterConfig } from './countryFilter';
import { periodsFilterConfig } from './periodsFilter';
import { productScopeFilterConfig } from './productScopeFilter';
import { subBrandsFilterConfig } from './subBrandsFilter';
import { timeFrameFilterConfig } from './timeFrameFilter';
import { yearsFilterConfig } from './yearsFilter';
import { ytdMonthFilterConfig } from './ytdMonthFilter';
import { zonesFilterConfig } from './zonesFilter';

describe('Filter Configs', () => {
  let registry: FilterRegistry;

  beforeEach(() => {
    registry = FilterRegistry.getInstance();
    (registry as any).filters.clear();
    (registry as any).orderIndex.clear();
  });

  describe('zonesFilterConfig', () => {
    it('should have correct configuration', () => {
      expect(zonesFilterConfig.key).toBe('zone');
      expect(zonesFilterConfig.order).toBe(30);
      expect(zonesFilterConfig.isCommon).toBe(true);
      expect(zonesFilterConfig.calculator).toBeDefined();
      expect(zonesFilterConfig.validator).toBeDefined();
      expect(zonesFilterConfig.dependencies).toContain('country');
    });

    it('should calculate default correctly', () => {
      const mockFilterData = {
        zones: {
          default: { value: 'LATAM' },
          values: [{ value: 'LATAM', label: 'LATAM' }],
        },
        country: {
          values: {
            LATAM: [{ value: 'BR', label: 'Brazil' }],
          },
        },
      };

      const result = zonesFilterConfig.calculator(mockFilterData as any, {});
      expect(result).toBe('LATAM');
    });

    it('should validate zones correctly', () => {
      const mockFilterData = {
        zones: {
          values: [
            { value: 'LATAM', label: 'LATAM' },
            { value: 'NAZ', label: 'NAZ' },
          ],
        },
      };

      expect(
        zonesFilterConfig.validator?.(mockFilterData as any, 'LATAM'),
      ).toBe(true);
      expect(
        zonesFilterConfig.validator?.(mockFilterData as any, 'INVALID'),
      ).toBe(false);
    });
  });

  describe('countryFilterConfig', () => {
    it('should have correct configuration', () => {
      expect(countryFilterConfig.key).toBe('country');
      expect(countryFilterConfig.order).toBe(40);
      expect(countryFilterConfig.isCommon).toBe(true);
      expect(countryFilterConfig.calculator).toBeDefined();
      expect(
        countryFilterConfig.dependentDefaultCascadingCalculator,
      ).toBeDefined();
    });

    it('should return valid configured country default', () => {
      const mockFilterData = {
        country: {
          default: { value: 'BR' },
          values: {
            LATAM: [{ value: 'BR', label: 'Brazil' }],
          },
        },
      };

      const result = countryFilterConfig.calculator(mockFilterData as any, {
        zone: 'LATAM',
      });
      expect(result).toBe('BR');
    });

    it('should fallback to first country in zone when configured default is invalid', () => {
      const mockFilterData = {
        country: {
          default: { value: 'AR' },
          values: {
            LATAM: [
              { value: 'BR', label: 'Brazil' },
              { value: 'MX', label: 'Mexico' },
            ],
          },
        },
      };

      const result = countryFilterConfig.calculator(mockFilterData as any, {
        zone: 'LATAM',
      });
      expect(result).toBe('BR');
    });

    it('should fallback to first country in zone when default is missing', () => {
      const mockFilterData = {
        country: {
          values: {
            LATAM: [
              { value: 'BR', label: 'Brazil' },
              { value: 'MX', label: 'Mexico' },
            ],
          },
        },
      };

      const result = countryFilterConfig.calculator(mockFilterData as any, {
        zone: 'LATAM',
      });
      expect(result).toBe('BR');
    });

    it('should fallback to first available country when selected zone has no countries', () => {
      const mockFilterData = {
        country: {
          values: {
            LATAM: [],
            NAZ: [{ value: 'US', label: 'United States' }],
          },
        },
      };

      const result = countryFilterConfig.calculator(mockFilterData as any, {
        zone: 'LATAM',
      });
      expect(result).toBe('US');
    });

    it('should return null when country values are missing', () => {
      const mockFilterData = {
        country: {
          default: { value: 'BR' },
        },
      };

      const result = countryFilterConfig.calculator(mockFilterData as any, {
        zone: 'LATAM',
      });
      expect(result).toBeNull();
    });

    it('should calculate dependent default correctly', () => {
      const mockFilterData = {
        country: {
          values: {
            LATAM: [{ value: 'BR', label: 'Brazil' }],
          },
        },
      };

      const result = countryFilterConfig.dependentDefaultCascadingCalculator?.(
        mockFilterData as any,
        { zone: 'LATAM' },
      );
      expect(result).toBe('BR');
    });

    describe('fallbackCollisionResolver', () => {
      const resolver = countryFilterConfig.fallbackCollisionResolver!;

      it('should be defined', () => {
        expect(resolver).toBeDefined();
      });

      it('should keep currentDefault when it is valid', () => {
        const result = resolver('VN', 'BR', {} as any, {});
        expect(result).toBe('BR');
      });

      it('should pick first available country across zones when default is null', () => {
        const dataFilters = {
          country: {
            values: {
              LATAM: [{ value: 'BR', label: 'Brazil' }],
              APAC: [{ value: 'CN', label: 'China' }],
            },
          },
        };

        const result = resolver('VN', null, dataFilters as any, {});
        expect(result).toBe('BR');
      });

      it('should skip empty zones and return first valid country', () => {
        const dataFilters = {
          country: {
            values: {
              EMPTY: [],
              APAC: [{ value: 'CN', label: 'China' }],
            },
          },
        };

        const result = resolver('VN', null, dataFilters as any, {});
        expect(result).toBe('CN');
      });

      it('should return null when no country data exists in scope', () => {
        const result = resolver('VN', null, { country: {} } as any, {});
        expect(result).toBeNull();
      });
    });
  });

  describe('brandsFilterConfig', () => {
    it('should have correct configuration', () => {
      expect(brandsFilterConfig.key).toBe('brands');
      expect(brandsFilterConfig.order).toBe(50);
      expect(brandsFilterConfig.isCommon).toBe(true);
      expect(brandsFilterConfig.dependencies).toContain('sub_brands');
    });

    it('should calculate default correctly', () => {
      const mockFilterData = {
        brands: {
          values: {
            BR: {
              brands: [
                {
                  value: 'BRAHMA',
                  label: 'Brahma',
                  sub_brands: [
                    { value: 'BRAHMA_DUPLO_MALTE', label: 'Duplo Malte' },
                  ],
                },
              ],
            },
          },
        },
      };

      const result = brandsFilterConfig.calculator(mockFilterData as any, {
        country: 'BR',
        sub_brands: null,
      });
      expect(result).toBe('BRAHMA');
    });
  });

  describe('subBrandsFilterConfig', () => {
    it('should have correct configuration', () => {
      expect(subBrandsFilterConfig.key).toBe('sub_brands');
      expect(subBrandsFilterConfig.order).toBe(51);
      expect(subBrandsFilterConfig.isCommon).toBe(true);
    });

    it('should calculate default based on parent brand', () => {
      const mockFilterData = {
        brands: {
          values: {
            BR: {
              brands: [
                {
                  value: 'BRAHMA',
                  label: 'Brahma',
                  sub_brands: [
                    { value: 'BRAHMA_DUPLO_MALTE', label: 'Duplo Malte' },
                  ],
                },
              ],
            },
          },
        },
      };

      const result = subBrandsFilterConfig.calculator(mockFilterData as any, {
        country: 'BR',
        brands: 'BRAHMA',
      });
      expect(result).toBe('BRAHMA_DUPLO_MALTE');
    });

    it('should validate contextual correctly', () => {
      const result = subBrandsFilterConfig.contextualValidator(
        {},
        'null',
        'All',
      );
      expect(result).toBeFalsy();
    });
  });

  describe('timeFrameFilterConfig', () => {
    it('should have correct configuration', () => {
      expect(timeFrameFilterConfig.key).toBe('time_frame');
      expect(timeFrameFilterConfig.order).toBe(10);
      expect(timeFrameFilterConfig.isCommon).toBe(true);
    });

    it('should calculate default correctly', () => {
      const mockFilterData = {
        time_frame: {
          default: { end: '2024-12-31' },
        },
      };

      const result = timeFrameFilterConfig.calculator(
        mockFilterData as any,
        {},
      );
      expect(result).toBe(2024);
    });
  });

  describe('ytdMonthFilterConfig', () => {
    it('should have correct configuration', () => {
      expect(ytdMonthFilterConfig.key).toBe('ytd-month');
      expect(ytdMonthFilterConfig.order).toBe(20);
      expect(ytdMonthFilterConfig.isCommon).toBe(true);
    });

    it('should calculate default correctly', () => {
      const mockFilterData = {
        'ytd-month': {
          default: { value: 'January' },
        },
      };

      const result = ytdMonthFilterConfig.calculator(mockFilterData as any, {});
      expect(result).toBe('January');
    });
  });

  describe('periodsFilterConfig', () => {
    it('should have correct configuration', () => {
      expect(periodsFilterConfig.key).toBe('periods');
      expect(periodsFilterConfig.order).toBe(20);
      expect(periodsFilterConfig.isCommon).toBe(true);
      expect(periodsFilterConfig.fallbackCollisionResolver).toBeDefined();
    });

    it('should calculate default correctly', () => {
      const mockFilterData = {
        periods: {
          default: { value: 'YTD' },
          values: [{ value: 'YTD', label: 'YTD' }],
        },
      };

      const result = periodsFilterConfig.calculator(mockFilterData as any, {});
      expect(result).toBe('YTD');
    });

    it('should validate periods correctly', () => {
      const mockFilterData = {
        periods: {
          values: [
            { value: 'YTD', label: 'YTD' },
            { value: 'QTD', label: 'QTD' },
          ],
        },
      };

      expect(
        periodsFilterConfig.validator?.(mockFilterData as any, 'YTD'),
      ).toBe(true);
      expect(
        periodsFilterConfig.validator?.(mockFilterData as any, 'L3M'),
      ).toBe(false);
    });

    describe('fallbackCollisionResolver', () => {
      const resolver = periodsFilterConfig.fallbackCollisionResolver!;

      const mockDataFiltersWithQTD = {
        periods: {
          values: [
            { value: 'YTD', label: 'YTD' },
            { value: 'QTD', label: 'QTD' },
          ],
        },
      } as any;

      const mockDataFiltersWithoutQTD = {
        periods: {
          values: [{ value: 'YTD', label: 'YTD' }],
        },
      } as any;

      it('should map L3M to QTD when QTD is available', () => {
        const result = resolver('L3M', 'YTD', mockDataFiltersWithQTD, {});
        expect(result).toBe('QTD');
      });

      it('should map MTD to QTD when QTD is available', () => {
        const result = resolver('MTD', 'YTD', mockDataFiltersWithQTD, {});
        expect(result).toBe('QTD');
      });

      it('should fall back to default when L3M maps to QTD but QTD is not available', () => {
        const result = resolver('L3M', 'YTD', mockDataFiltersWithoutQTD, {});
        expect(result).toBe('YTD');
      });

      it('should fall back to default when MTD maps to QTD but QTD is not available', () => {
        const result = resolver('MTD', 'YTD', mockDataFiltersWithoutQTD, {});
        expect(result).toBe('YTD');
      });

      it('should return default for values without a fallback mapping', () => {
        const result = resolver('MAT', 'YTD', mockDataFiltersWithQTD, {});
        expect(result).toBe('YTD');
      });
    });
  });

  describe('yearsFilterConfig', () => {
    it('should have correct configuration', () => {
      expect(yearsFilterConfig.key).toBe('years');
      expect(yearsFilterConfig.order).toBe(21);
      expect(yearsFilterConfig.isCommon).toBe(false);
      expect(yearsFilterConfig.calculator).toBeDefined();
      expect(yearsFilterConfig.validator).toBeDefined();
    });

    it('should return null when years filter has no preset options', () => {
      expect(yearsFilterConfig.calculator({} as any, {})).toBeNull();

      expect(
        yearsFilterConfig.calculator({ years: undefined } as any, {}),
      ).toBeNull();

      expect(yearsFilterConfig.calculator({ years: {} } as any, {})).toBeNull();

      expect(
        yearsFilterConfig.calculator(
          {
            years: { values: [] },
          } as any,
          {},
        ),
      ).toBeNull();
    });

    it('should use preset default value when valid', () => {
      const mockFilterData = {
        years: {
          default: { value: '2024' },
          values: [
            { value: '2024', label: '2024' },
            { value: '2025', label: '2025' },
          ],
        },
      };

      expect(yearsFilterConfig.calculator(mockFilterData as any, {})).toBe(
        '2024',
      );
    });

    it('should use first option when default is absent or invalid', () => {
      const withoutDefault = {
        years: {
          values: [
            { value: '2024', label: '2024' },
            { value: '2025', label: '2025' },
          ],
        },
      };

      expect(yearsFilterConfig.calculator(withoutDefault as any, {})).toBe(
        '2024',
      );

      const invalidDefault = {
        years: {
          default: { value: '2020' },
          values: [
            { value: '2024', label: '2024' },
            { value: '2025', label: '2025' },
          ],
        },
      };

      expect(yearsFilterConfig.calculator(invalidDefault as any, {})).toBe(
        '2024',
      );
    });

    it('should validate years only when options exist', () => {
      const mockFilterData = {
        years: {
          values: [
            { value: '2024', label: '2024' },
            { value: '2025', label: '2025' },
          ],
        },
      };

      expect(yearsFilterConfig.validator?.(mockFilterData as any, '2025')).toBe(
        true,
      );
      expect(yearsFilterConfig.validator?.(mockFilterData as any, '2020')).toBe(
        false,
      );
    });

    it('should not validate when there are no year options', () => {
      expect(yearsFilterConfig.validator?.({} as any, '2025')).toBe(false);
      expect(
        yearsFilterConfig.validator?.({ years: { values: [] } } as any, '2025'),
      ).toBe(false);
    });
  });

  describe('productScopeFilterConfig', () => {
    it('should have correct configuration', () => {
      expect(productScopeFilterConfig.key).toBe('product_scope');
      expect(productScopeFilterConfig.order).toBe(37);
      expect(productScopeFilterConfig.isCommon).toBe(false);
      expect(productScopeFilterConfig.calculator).toBeDefined();
      expect(productScopeFilterConfig.validator).toBeDefined();
    });

    it('should calculate default from product_scope default', () => {
      const mockFilterData = {
        product_scope: {
          default: { value: 'Total ABI' },
          values: [
            { value: 'Beer + Adjacencies', label: 'Beer + Adjacencies' },
            { value: 'Total ABI', label: 'Total ABI' },
          ],
        },
      };

      const result = productScopeFilterConfig.calculator(
        mockFilterData as any,
        {},
      );
      expect(result).toBe('Total ABI');
    });

    it('should validate product_scope values correctly', () => {
      const mockFilterData = {
        product_scope: {
          values: [
            { value: 'Beer + Adjacencies', label: 'Beer + Adjacencies' },
            { value: 'Total ABI', label: 'Total ABI' },
          ],
        },
      };

      expect(
        productScopeFilterConfig.validator?.(
          mockFilterData as any,
          'Beer + Adjacencies',
        ),
      ).toBe(true);
      expect(
        productScopeFilterConfig.validator?.(mockFilterData as any, 'INVALID'),
      ).toBe(false);
    });

    it('should return true when value is empty but options exist', () => {
      const mockFilterData = {
        product_scope: {
          values: [
            { value: 'Beer + Adjacencies', label: 'Beer + Adjacencies' },
            { value: 'Total ABI', label: 'Total ABI' },
          ],
        },
      };

      expect(
        productScopeFilterConfig.validator?.(mockFilterData as any, undefined),
      ).toBe(true);
    });
  });

  describe('All configs registered together', () => {
    it('should work together in correct order', () => {
      registry.register(timeFrameFilterConfig);
      registry.register(ytdMonthFilterConfig);
      registry.register(zonesFilterConfig);
      registry.register(countryFilterConfig);
      registry.register(brandsFilterConfig);
      registry.register(subBrandsFilterConfig);

      const orderedKeys = registry.getOrderedKeys();

      // Verify order
      expect(orderedKeys.indexOf('time_frame')).toBeLessThan(
        orderedKeys.indexOf('zone'),
      );
      expect(orderedKeys.indexOf('zone')).toBeLessThan(
        orderedKeys.indexOf('country'),
      );
      expect(orderedKeys.indexOf('country')).toBeLessThan(
        orderedKeys.indexOf('brands'),
      );
      expect(orderedKeys.indexOf('brands')).toBeLessThan(
        orderedKeys.indexOf('sub_brands'),
      );
    });

    it('should identify common filters', () => {
      registry.register(zonesFilterConfig);
      registry.register(countryFilterConfig);
      registry.register(brandsFilterConfig);

      const commonKeys = registry.getCommonFilterKeys();

      expect(commonKeys).toContain('zone');
      expect(commonKeys).toContain('country');
      expect(commonKeys).toContain('brands');
    });
  });
});
