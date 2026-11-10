import { createInitialFilterPage } from '../../../redux/slices/filters/constants';
import FilterRegistry from './FilterRegistry';
import type {
  FilterCollisionResolver,
  FilterConfig,
  FilterDefaultCalculator,
  FilterDependentDefaultCascadingCalculator,
  FilterValueValidator,
} from './types';

describe('FilterRegistry', () => {
  let registry: FilterRegistry;

  // Mock filter configurations with validators adapted for test data
  const mockZonesCalculator: FilterDefaultCalculator = (filterData) =>
    filterData.zones?.default?.value ?? null;

  const mockCountryCalculator: FilterDefaultCalculator = (
    filterData,
    currentDefaults,
  ) => {
    const zonesValue = currentDefaults.zone;
    if (zonesValue) {
      return (
        filterData.country?.values?.[String(zonesValue)]?.[0]?.value ?? null
      );
    }
    return filterData.country?.default?.value ?? null;
  };

  const mockCountryDependentCalculator: FilterDependentDefaultCascadingCalculator =
    (filterData, currentValues) => {
      const zoneValue = currentValues.zone;
      if (!zoneValue) return null;
      const countries = filterData.country?.values?.[String(zoneValue)];
      return countries?.[0]?.value ?? null;
    };

  // Validator that accepts array structure
  const mockZonesValidator: FilterValueValidator = (filterData, value) => {
    const options = filterData.zones?.values || [];
    if (Array.isArray(options)) {
      return options.some((opt) => {
        if (typeof opt === 'string') return opt === value;
        return opt?.value === value;
      });
    }
    return false;
  };

  // Validator for country that accepts array format
  const mockCountryValidator: FilterValueValidator = (filterData, value) => {
    const options = filterData.country?.values || [];
    if (Array.isArray(options)) {
      return options.some((opt) => {
        if (typeof opt === 'string') return opt === value;
        return opt?.value === value || opt?.code === value;
      });
    }
    return false;
  };

  // Validator for brands that accepts array format
  const mockBrandsValidator: FilterValueValidator = (filterData, value) => {
    const options = filterData.brands?.values || [];
    if (Array.isArray(options)) {
      return options.some((opt) => {
        if (typeof opt === 'string') return opt === value;
        return opt?.value === value;
      });
    }
    return false;
  };

  const zonesConfig: FilterConfig = {
    key: 'zone',
    order: 10,
    calculator: mockZonesCalculator,
    validator: mockZonesValidator,
    dependencies: ['country', 'brands'],
    isCommon: true,
    metadata: {
      displayName: 'Zones',
      description: 'Geographic zones',
    },
  };

  const countryConfig: FilterConfig = {
    key: 'country',
    order: 20,
    calculator: mockCountryCalculator,
    validator: mockCountryValidator,
    dependentDefaultCascadingCalculator: mockCountryDependentCalculator,
    dependencies: ['brands', 'sub_brands'],
    isCommon: true,
  };

  const brandsConfig: FilterConfig = {
    key: 'brands',
    order: 30,
    calculator: () => 'All',
    validator: mockBrandsValidator,
    isCommon: true,
  };

  const subBrandsConfig: FilterConfig = {
    key: 'sub_brands',
    order: 40,
    calculator: () => 'All',
  };

  beforeEach(() => {
    registry = FilterRegistry.getInstance();
    // Clear any previously registered filters
    (registry as any).filters.clear();
    (registry as any).orderIndex.clear();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = FilterRegistry.getInstance();
      const instance2 = FilterRegistry.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('register', () => {
    it('should register a filter configuration', () => {
      registry.register(zonesConfig);

      expect(registry.has('zone')).toBe(true);
      expect(registry.size()).toBe(1);
    });

    it('should allow overwriting existing filter', () => {
      registry.register(zonesConfig);
      registry.register(zonesConfig);

      expect(registry.has('zone')).toBe(true);
      expect(registry.size()).toBe(1);
    });

    it('should index filters by order', () => {
      registry.register(zonesConfig);
      registry.register(countryConfig);

      const orderedKeys = registry.getOrderedKeys();
      expect(orderedKeys).toEqual(['zone', 'country']);
    });
  });

  describe('get', () => {
    it('should retrieve registered filter config', () => {
      registry.register(zonesConfig);

      const config = registry.get('zone');
      expect(config).toBeDefined();
      expect(config?.key).toBe('zone');
    });

    it('should return undefined for non-existent filter', () => {
      const config = registry.get('nonexistent');
      expect(config).toBeUndefined();
    });
  });

  describe('getOrderedKeys', () => {
    it('should return keys in order', () => {
      const config1: FilterConfig = {
        key: 'filter1',
        order: 30,
        calculator: () => null,
      };
      const config2: FilterConfig = {
        key: 'filter2',
        order: 10,
        calculator: () => null,
      };
      const config3: FilterConfig = {
        key: 'filter3',
        order: 20,
        calculator: () => null,
      };

      registry.register(config1);
      registry.register(config2);
      registry.register(config3);

      const keys = registry.getOrderedKeys();
      expect(keys).toEqual(['filter2', 'filter3', 'filter1']);
    });

    it('should handle multiple filters with same order', () => {
      const config1: FilterConfig = {
        key: 'filter1',
        order: 10,
        calculator: () => null,
      };
      const config2: FilterConfig = {
        key: 'filter2',
        order: 10,
        calculator: () => null,
      };

      registry.register(config1);
      registry.register(config2);

      const keys = registry.getOrderedKeys();
      expect(keys).toHaveLength(2);
      expect(keys).toContain('filter1');
      expect(keys).toContain('filter2');
    });
  });

  describe('getAll', () => {
    it('should return all registered configurations', () => {
      registry.register(zonesConfig);
      registry.register(countryConfig);

      const all = registry.getAll();
      expect(all).toHaveLength(2);
    });
  });

  describe('getCalculator', () => {
    it('should return calculator for registered filter', () => {
      registry.register(zonesConfig);

      const calculator = registry.getCalculator('zone');
      expect(calculator).toBe(mockZonesCalculator);
    });

    it('should return undefined for non-existent filter', () => {
      const calculator = registry.getCalculator('nonexistent');
      expect(calculator).toBeUndefined();
    });
  });

  describe('getDependentDefaultCascadingCalculator', () => {
    it('should return dependent calculator when provided', () => {
      registry.register(countryConfig);

      const calculator =
        registry.getDependentDefaultCascadingCalculator('country');
      expect(calculator).toBe(mockCountryDependentCalculator);
    });

    it('should fallback to default calculator when dependent not provided', () => {
      registry.register(zonesConfig);

      const calculator =
        registry.getDependentDefaultCascadingCalculator('zone');
      expect(calculator).toBe(mockZonesCalculator);
    });
  });

  describe('getValidator', () => {
    it('should return validator when provided', () => {
      registry.register(zonesConfig);

      const validator = registry.getValidator('zone');
      expect(validator).toBe(mockZonesValidator);
    });

    it('should return undefined when validator not provided', () => {
      registry.register(subBrandsConfig);

      const validator = registry.getValidator('sub_brands');
      expect(validator).toBeUndefined();
    });
  });

  describe('isValueValid', () => {
    it('should validate using custom validator', () => {
      registry.register(zonesConfig);

      const mockFilterData = {
        zones: {
          values: [
            { value: 'LATAM', label: 'LATAM' },
            { value: 'NAZ', label: 'NAZ' },
          ],
        },
      };

      expect(
        registry.isValueValid('zone', mockFilterData as any, 'LATAM'),
      ).toBe(true);
      expect(
        registry.isValueValid('zone', mockFilterData as any, 'INVALID'),
      ).toBe(false);
    });

    it('should use default validator when custom not provided', () => {
      registry.register(subBrandsConfig);

      const mockFilterData = {
        sub_brands: {
          values: [{ value: 'BR', label: 'Brazil' }],
        },
      };

      expect(
        registry.isValueValid('sub_brands', mockFilterData as any, 'BR'),
      ).toBe(true);
    });
  });

  describe('getDependencies', () => {
    it('should return dependencies array', () => {
      registry.register(zonesConfig);

      const deps = registry.getDependencies('zone');
      expect(deps).toEqual(['country', 'brands']);
    });

    it('should return empty array when no dependencies', () => {
      registry.register(subBrandsConfig);

      const deps = registry.getDependencies('sub_brands');
      expect(deps).toEqual([]);
    });
  });

  describe('has', () => {
    it('should return true for registered filter', () => {
      registry.register(zonesConfig);

      expect(registry.has('zone')).toBe(true);
    });

    it('should return false for non-registered filter', () => {
      expect(registry.has('nonexistent')).toBe(false);
    });
  });

  describe('size', () => {
    it('should return number of registered filters', () => {
      expect(registry.size()).toBe(0);

      registry.register(zonesConfig);
      expect(registry.size()).toBe(1);

      registry.register(countryConfig);
      expect(registry.size()).toBe(2);
    });
  });

  describe('getCommonFilterKeys', () => {
    it('should return only filters marked as common', () => {
      registry.register(zonesConfig); // isCommon: true
      registry.register(countryConfig); // isCommon: true
      registry.register(subBrandsConfig); // no isCommon

      const commonKeys = registry.getCommonFilterKeys();
      expect(commonKeys).toHaveLength(2);
      expect(commonKeys).toContain('zone');
      expect(commonKeys).toContain('country');
      expect(commonKeys).not.toContain('sub_brands');
    });

    it('should return empty array when no common filters', () => {
      const config: FilterConfig = {
        key: 'filter1',
        order: 10,
        calculator: () => null,
      };

      registry.register(config);

      const commonKeys = registry.getCommonFilterKeys();
      expect(commonKeys).toEqual([]);
    });
  });

  describe('Static Methods', () => {
    describe('calculateDefaults', () => {
      it('should calculate defaults in order', () => {
        registry.register(zonesConfig);
        registry.register(countryConfig);

        const mockFilterData = {
          zones: {
            default: { value: 'LATAM' },
            values: [{ value: 'LATAM', label: 'LATAM' }],
          },
          country: {
            default: { value: 'BR' },
            values: {
              LATAM: [{ value: 'BR', label: 'Brazil' }],
            },
          },
        };

        const defaults = FilterRegistry.calculateDefaults(
          mockFilterData as any,
        );

        expect(defaults.zone).toBe('LATAM');
        expect(defaults.country).toBe('BR');
      });
    });

    describe('getDependentDefaultCascading', () => {
      it('should calculate dependent default', () => {
        registry.register(countryConfig);

        const mockFilterData = {
          country: {
            values: {
              LATAM: [{ value: 'BR', label: 'Brazil' }],
            },
          },
        };

        const currentValues = { zone: 'LATAM' };

        const result = FilterRegistry.getDependentDefaultCascading(
          mockFilterData as any,
          'country',
          currentValues,
        );

        expect(result).toBe('BR');
      });

      it('should return null when no calculator found', () => {
        const result = FilterRegistry.getDependentDefaultCascading(
          {} as any,
          'nonexistent',
          {},
        );

        expect(result).toBeNull();
      });
    });

    describe('resolveCascadingUpdates', () => {
      it('should update value and reset dependencies', () => {
        registry.register(zonesConfig);
        registry.register(countryConfig);

        const mockFilterData = {
          country: {
            values: {
              NAZ: [{ value: 'US', label: 'United States' }],
            },
          },
        };

        const currentForm = {
          zone: 'LATAM',
          country: 'BR',
        };

        const result = FilterRegistry.resolveCascadingUpdates(
          mockFilterData as any,
          currentForm,
          'zone',
          'NAZ',
        );

        expect(result.zone).toBe('NAZ');
        expect(result.country).toBe('US');
      });
    });

    describe('resolveFilterCollisions', () => {
      it('should use fallbackCollisionResolver when previous value is invalid and resolver is defined', () => {
        const periodsCollisionResolver: FilterCollisionResolver = jest.fn(
          (previousValue, currentDefault, currentDataFilters) => {
            const fallbackMap: Record<string, string> = {
              L3M: 'QTD',
              MTD: 'QTD',
            };
            const fallback = fallbackMap[String(previousValue)];
            if (!fallback) return currentDefault;
            const isValid = currentDataFilters.periods?.values?.some(
              (opt) => opt?.value === fallback,
            );
            return isValid ? fallback : currentDefault;
          },
        );

        const periodsConfig: FilterConfig = {
          key: 'periods',
          order: 20,
          isCommon: true,
          calculator: (filterData) =>
            filterData.periods?.default?.value ?? null,
          validator: (filterData, value) =>
            filterData.periods?.values?.some((opt) => opt?.value === value),
          fallbackCollisionResolver: periodsCollisionResolver,
        };

        registry.register(periodsConfig);

        const currentPage = {
          ...createInitialFilterPage(),
          status: 'loaded' as const,
          dataFilters: {
            periods: {
              values: [
                { value: 'YTD', label: 'YTD' },
                { value: 'QTD', label: 'QTD' },
              ],
              default: { value: 'YTD' },
            },
          },
          defaults: { periods: 'YTD' },
          applied: {},
        };

        const previousPage = {
          ...createInitialFilterPage(),
          status: 'loaded' as const,
          dataFilters: {},
          defaults: { periods: 'L3M' },
          applied: { periods: 'L3M' },
        };

        const result = FilterRegistry.resolveFilterCollisions(
          currentPage as any,
          previousPage as any,
          currentPage.defaults,
        );

        expect(periodsCollisionResolver).toHaveBeenCalledWith(
          'L3M',
          'YTD',
          currentPage.dataFilters,
          expect.any(Object),
        );
        expect(result.periods).toBe('QTD');
      });

      it('should use default when fallbackCollisionResolver is not defined and previous value is invalid', () => {
        const periodsConfig: FilterConfig = {
          key: 'periods',
          order: 20,
          isCommon: true,
          calculator: (filterData) =>
            filterData.periods?.default?.value ?? null,
          validator: (filterData, value) =>
            filterData.periods?.values?.some((opt) => opt?.value === value),
        };

        registry.register(periodsConfig);

        const currentPage = {
          ...createInitialFilterPage(),
          status: 'loaded' as const,
          dataFilters: {
            periods: {
              values: [{ value: 'YTD', label: 'YTD' }],
              default: { value: 'YTD' },
            },
          },
          defaults: { periods: 'YTD' },
          applied: {},
        };

        const previousPage = {
          ...createInitialFilterPage(),
          status: 'loaded' as const,
          dataFilters: {},
          defaults: { periods: 'L3M' },
          applied: { periods: 'L3M' },
        };

        const result = FilterRegistry.resolveFilterCollisions(
          currentPage as any,
          previousPage as any,
          currentPage.defaults,
        );

        expect(result.periods).toBe('YTD');
      });

      it('should preserve previous value when it is valid (no fallbackCollisionResolver needed)', () => {
        const periodsConfig: FilterConfig = {
          key: 'periods',
          order: 20,
          isCommon: true,
          calculator: (filterData) =>
            filterData.periods?.default?.value ?? null,
          validator: (filterData, value) =>
            filterData.periods?.values?.some((opt) => opt?.value === value),
          fallbackCollisionResolver: jest.fn(),
        };

        registry.register(periodsConfig);

        const currentPage = {
          ...createInitialFilterPage(),
          status: 'loaded' as const,
          dataFilters: {
            periods: {
              values: [
                { value: 'YTD', label: 'YTD' },
                { value: 'QTD', label: 'QTD' },
              ],
              default: { value: 'YTD' },
            },
          },
          defaults: { periods: 'YTD' },
          applied: {},
        };

        const previousPage = {
          ...createInitialFilterPage(),
          status: 'loaded' as const,
          dataFilters: {},
          defaults: { periods: 'QTD' },
          applied: { periods: 'QTD' },
        };

        const result = FilterRegistry.resolveFilterCollisions(
          currentPage as any,
          previousPage as any,
          currentPage.defaults,
        );

        expect(periodsConfig.fallbackCollisionResolver).not.toHaveBeenCalled();
        expect(result.periods).toBe('QTD');
      });

      describe('contextual validation (parentKey)', () => {
        const zoneContextConfig: FilterConfig = {
          key: 'zone',
          order: 10,
          isCommon: true,
          calculator: (filterData) => filterData.zones?.default?.value ?? null,
          validator: (filterData, value) =>
            (filterData.zones?.values as any[])?.some(
              (opt) => opt.value === value,
            ) ?? false,
          dependencies: ['country'],
        };

        const countryContextConfig: FilterConfig = {
          key: 'country',
          order: 20,
          isCommon: true,
          parentKey: 'zone',
          calculator: (filterData) =>
            filterData.country?.default?.value ?? null,
          dependentDefaultCascadingCalculator: (filterData, currentValues) => {
            const zone = String(currentValues.zone ?? '');
            if (zone === 'ABI') return 'ABI';
            const countries = (filterData.country?.values as any)?.[zone];
            return countries?.[0]?.value ?? null;
          },
          validator: (filterData, value) =>
            Object.values((filterData.country?.values as any) ?? {}).some(
              (list: any) => list.some((c: any) => c.value === value),
            ),
          contextualValidator: (dataFilters, parentValue, childValue) => {
            const values = (dataFilters.country as any)?.values;
            if (parentValue === 'ABI') return childValue === 'ABI';
            const countriesInZone = values?.[String(parentValue)];
            return Array.isArray(countriesInZone)
              ? countriesInZone.some((c: any) => c.value === childValue)
              : false;
          },
        };

        const zoneCountryDataFilters = {
          zones: {
            values: [
              { value: 'ABI', label: 'Global' },
              { value: 'EUR', label: 'EUR' },
            ],
            default: { value: 'ABI' },
          },
          country: {
            values: {
              ABI: [
                { value: 'ABI', label: 'Global', zone: 'ABI' },
                { value: 'BEL', label: 'Belgium', zone: 'EUR' },
                { value: 'FRA', label: 'France', zone: 'EUR' },
              ],
              EUR: [
                { value: 'BEL', label: 'Belgium', zone: 'EUR' },
                { value: 'FRA', label: 'France', zone: 'EUR' },
              ],
            },
            default: { value: 'ABI' },
          },
        };

        beforeEach(() => {
          registry.register(zoneContextConfig);
          registry.register(countryContextConfig);
        });

        it('should reject country contextually invalid for resolved zone', () => {
          const currentPage = {
            ...createInitialFilterPage(),
            status: 'loaded' as const,
            dataFilters: zoneCountryDataFilters,
            defaults: { zone: 'ABI', country: 'ABI' },
            applied: {},
          };

          const previousPage = {
            ...createInitialFilterPage(),
            status: 'loaded' as const,
            dataFilters: {},
            defaults: {},
            applied: { zone: 'EUR', country: 'ABI' },
          };

          const result = FilterRegistry.resolveFilterCollisions(
            currentPage as any,
            previousPage as any,
            currentPage.defaults,
          );

          // zone=EUR is globally valid → kept
          expect(result.zone).toBe('EUR');
          // country=ABI is globally valid but contextually invalid for zone=EUR
          // → must fall back to first EUR country (BEL)
          expect(result.country).toBe('BEL');
        });

        it('should keep country when contextually valid for the resolved zone', () => {
          const currentPage = {
            ...createInitialFilterPage(),
            status: 'loaded' as const,
            dataFilters: zoneCountryDataFilters,
            defaults: { zone: 'ABI', country: 'ABI' },
            applied: {},
          };

          const previousPage = {
            ...createInitialFilterPage(),
            status: 'loaded' as const,
            dataFilters: {},
            defaults: {},
            applied: { zone: 'EUR', country: 'BEL' },
          };

          const result = FilterRegistry.resolveFilterCollisions(
            currentPage as any,
            previousPage as any,
            currentPage.defaults,
          );

          expect(result.zone).toBe('EUR');
          // BEL is valid for EUR zone → must be kept
          expect(result.country).toBe('BEL');
        });

        it('should reject country contextually invalid for resolved zone ABI', () => {
          const currentPage = {
            ...createInitialFilterPage(),
            status: 'loaded' as const,
            dataFilters: zoneCountryDataFilters,
            defaults: { zone: 'ABI', country: 'ABI' },
            applied: {},
          };

          const previousPage = {
            ...createInitialFilterPage(),
            status: 'loaded' as const,
            dataFilters: {},
            defaults: {},
            applied: { zone: 'ABI', country: 'BEL' },
          };

          const result = FilterRegistry.resolveFilterCollisions(
            currentPage as any,
            previousPage as any,
            currentPage.defaults,
          );

          expect(result.zone).toBe('ABI');
          // BEL is globally valid but not allowed under zone ABI (only ABI country)
          expect(result.country).toBe('ABI');
        });

        it('should fall back to isValueValid when parent is not yet resolved', () => {
          const leafContextualValidator = jest.fn(() => false);
          const leafConfig: FilterConfig = {
            key: 'growth_levers',
            order: 5,
            isCommon: false,
            parentKey: 'country',
            calculator: () => 'default_lever',
            validator: (filterData, value) =>
              (filterData.growth_levers?.values as any[])?.some(
                (opt) => opt.value === value,
              ) ?? false,
            contextualValidator: leafContextualValidator,
          };

          registry.register(leafConfig);

          const dataFiltersWithLeaf = {
            ...zoneCountryDataFilters,
            growth_levers: {
              values: [
                { value: 'volume', label: 'Volume' },
                { value: 'revenue', label: 'Revenue' },
              ],
              default: { value: 'volume' },
            },
          };

          const currentPage = {
            ...createInitialFilterPage(),
            status: 'loaded' as const,
            dataFilters: dataFiltersWithLeaf,
            defaults: { zone: 'ABI', country: 'ABI', growth_levers: 'volume' },
            applied: {},
          };

          const previousPage = {
            ...createInitialFilterPage(),
            status: 'loaded' as const,
            dataFilters: {},
            defaults: {},
            applied: { zone: 'EUR', country: 'BEL', growth_levers: 'volume' },
          };

          FilterRegistry.resolveFilterCollisions(
            currentPage as any,
            previousPage as any,
            currentPage.defaults,
          );

          // growth_levers (order=5) is processed before country (order=20),
          // so country is not yet in resolved → contextualValidator must NOT be called;
          // isValueValid is used instead (safe fallback)
          expect(leafContextualValidator).not.toHaveBeenCalled();
        });
      });
    });

    describe('validateValues', () => {
      it('should validate all values', () => {
        registry.register(zonesConfig);
        registry.register(countryConfig);

        const mockFilterData = {
          zones: {
            values: [{ value: 'LATAM', label: 'LATAM' }],
          },
          country: {
            values: [{ value: 'BR', label: 'Brazil' }],
          },
        };

        const values = {
          zone: 'LATAM',
          country: 'BR',
        };

        const results = FilterRegistry.validateValues(
          mockFilterData as any,
          values,
        );

        expect(results.zone).toBe(true);
        expect(results.country).toBe(true);
      });
    });

    describe('extractFiltersFromUrl', () => {
      it('should extract filters from URL params', () => {
        const searchParams = new URLSearchParams();
        searchParams.set('filter_zone', 'SAZ');
        searchParams.set('filter_country', 'BRA');
        searchParams.set('other', 'param');

        const filters = FilterRegistry.extractFiltersFromUrl(searchParams);

        expect(filters).toEqual({
          zone: 'SAZ',
          country: 'BRA',
        });
        expect(filters.other).toBeUndefined();
      });

      it('should return empty object when no filters in URL', () => {
        const searchParams = new URLSearchParams();
        searchParams.set('other', 'param');

        const filters = FilterRegistry.extractFiltersFromUrl(searchParams);

        expect(filters).toEqual({});
      });
    });

    describe('validateCompleteFilterSet', () => {
      beforeEach(() => {
        registry.register(zonesConfig);
        registry.register(countryConfig);
        registry.register(brandsConfig);
      });

      it('should validate and apply valid filters', () => {
        const mockDataFilters = {
          zones: {
            values: [
              { value: 'SAZ', label: 'SAZ' },
              { value: 'NAZ', label: 'NAZ' },
            ],
          },
          country: {
            values: [
              { value: 'BRA', label: 'Brazil' },
              { value: 'ARG', label: 'Argentina' },
            ],
          },
          brands: {
            values: [
              { value: 'Skol', label: 'Skol' },
              { value: 'Brahma', label: 'Brahma' },
            ],
          },
        };

        const filters = {
          zone: 'SAZ',
          country: 'BRA',
          brands: 'Skol',
        };

        const result = FilterRegistry.validateCompleteFilterSet(
          filters,
          mockDataFilters,
          {},
        );

        expect(result.zone).toBe('SAZ');
        expect(result.country).toBe('BRA');
        expect(result.brands).toBe('Skol');
      });

      it('should preserve filters that dont exist in dataFilters', () => {
        const customFilterConfig: FilterConfig = {
          key: 'customFilter',
          order: 50,
          calculator: () => 'customValue',
        };
        registry.register(customFilterConfig);

        const mockDataFilters = {
          zones: {
            values: [{ value: 'SAZ', label: 'SAZ' }],
          },
          // customFilter is NOT in dataFilters
        };

        const filters = {
          zone: 'SAZ',
          customFilter: 'customValue',
        };

        const result = FilterRegistry.validateCompleteFilterSet(
          filters,
          mockDataFilters,
          {},
        );

        expect(result.zone).toBe('SAZ');
        expect(result.customFilter).toBe('customValue');
      });

      it('should use defaults for invalid filters', () => {
        const mockDataFilters = {
          zones: {
            default: { value: 'SAZ' },
            values: [
              { value: 'SAZ', label: 'SAZ' },
              { value: 'NAZ', label: 'NAZ' },
            ],
          },
          country: {
            default: { value: 'BRA' },
            values: [{ value: 'BRA', label: 'Brazil' }],
          },
        };

        const filters = {
          zone: 'INVALID',
          country: 'BRA',
        };

        const defaults = {
          zone: 'SAZ',
          country: 'BRA',
        };

        const result = FilterRegistry.validateCompleteFilterSet(
          filters,
          mockDataFilters,
          defaults,
        );

        expect(result.zone).toBe('SAZ');
        expect(result.country).toBe('BRA');
      });

      it('should skip validation for All and ABI values', () => {
        const mockDataFilters = {
          zones: {
            values: [{ value: 'SAZ' }],
          },
          country: {
            values: [
              { value: 'All', label: 'All' },
              { value: 'BRA', label: 'Brazil' },
            ],
          },
        };

        const filters = {
          zone: 'SAZ',
          country: 'All',
        };

        const result = FilterRegistry.validateCompleteFilterSet(
          filters,
          mockDataFilters,
          {},
        );

        expect(result.country).toBe('All');
      });
    });

    describe('validateUrlFilters', () => {
      beforeEach(() => {
        registry.register(zonesConfig);
        registry.register(countryConfig);
      });

      it('should validate filters from URL', () => {
        const searchParams = new URLSearchParams();
        searchParams.set('filter_zone', 'SAZ');
        searchParams.set('filter_country', 'BRA');

        const mockDataFilters = {
          zones: {
            values: [{ value: 'SAZ', label: 'SAZ' }],
          },
          country: {
            values: [
              { value: 'BRA', label: 'Brazil' },
              { value: 'ARG', label: 'Argentina' },
            ],
          },
        };

        const defaults = {
          zone: 'ABI',
          country: 'ABI',
        };

        const result = FilterRegistry.validateUrlFilters(
          searchParams,
          mockDataFilters,
          defaults,
        );

        expect(result.zone).toBe('SAZ');
        expect(result.country).toBe('BRA');
      });

      it('should return empty object when no URL filters', () => {
        const searchParams = new URLSearchParams();
        const result = FilterRegistry.validateUrlFilters(searchParams, {}, {});

        expect(result).toEqual({});
      });

      it('should merge URL filters with defaults', () => {
        const searchParams = new URLSearchParams();
        searchParams.set('filter_zone', 'SAZ');

        const brandsTestConfig: FilterConfig = {
          key: 'brands',
          order: 30,
          calculator: () => 'All',
          validator: mockBrandsValidator,
        };
        registry.register(brandsTestConfig);

        const mockDataFilters = {
          zones: {
            values: [{ value: 'SAZ' }, { value: 'NAZ' }],
          },
          country: {
            values: [{ value: 'BRA' }, { value: 'ARG' }],
          },
          brands: {
            values: [{ value: 'All' }, { value: 'Skol' }],
          },
        };

        const defaults = {
          zone: 'ABI',
          country: 'BRA',
          brands: 'All',
        };

        const result = FilterRegistry.validateUrlFilters(
          searchParams,
          mockDataFilters,
          defaults,
        );

        expect(result.zone).toBe('SAZ');
        expect(result.brands).toBe('All');
      });
    });
  });

  describe('mergeFilterParamsIntoHref', () => {
    describe('passthrough cases', () => {
      it('returns empty href as-is', () => {
        expect(
          FilterRegistry.mergeFilterParamsIntoHref('', '?filter_zone=SAZ'),
        ).toBe('');
      });

      it('returns "#" href as-is', () => {
        expect(
          FilterRegistry.mergeFilterParamsIntoHref('#', '?filter_zone=SAZ'),
        ).toBe('#');
      });

      it('does not touch absolute http URLs', () => {
        expect(
          FilterRegistry.mergeFilterParamsIntoHref(
            'https://example.com',
            '?filter_zone=SAZ',
          ),
        ).toBe('https://example.com');
      });

      it('does not touch absolute https URLs with path', () => {
        expect(
          FilterRegistry.mergeFilterParamsIntoHref(
            'https://one.martech.uat.bees-platform.dev/?pillar=category',
            '?filter_zone=SAZ',
          ),
        ).toBe('https://one.martech.uat.bees-platform.dev/?pillar=category');
      });
    });

    describe('internal hrefs', () => {
      it('appends current filter_* params to a clean href', () => {
        const result = FilterRegistry.mergeFilterParamsIntoHref(
          '/category',
          '?filter_zone=SAZ&filter_country=ARG&filter_years=2025&filter_segments=Beer',
        );
        expect(result).toBe(
          '/category?filter_zone=SAZ&filter_country=ARG&filter_years=2025&filter_segments=Beer',
        );
      });

      it('keeps non-filter params untouched when the href already has them', () => {
        const result = FilterRegistry.mergeFilterParamsIntoHref(
          '/category?tab=overview',
          '?filter_zone=SAZ',
        );
        expect(result).toBe('/category?tab=overview&filter_zone=SAZ');
      });

      it('does NOT override filter_* already declared in href', () => {
        const result = FilterRegistry.mergeFilterParamsIntoHref(
          '/category/category-health/overview?filter_zone=ABI&filter_country=ABI',
          '?filter_zone=SAZ&filter_country=ARG',
        );
        expect(result).toBe(
          '/category/category-health/overview?filter_zone=ABI&filter_country=ABI',
        );
      });

      it('only copies filter_* keys, ignoring other source params', () => {
        const result = FilterRegistry.mergeFilterParamsIntoHref(
          '/category',
          '?overtime_performance=volume&filter_zone=SAZ',
        );
        expect(result).toBe('/category?filter_zone=SAZ');
      });

      it('returns the pathname when no params are available', () => {
        expect(FilterRegistry.mergeFilterParamsIntoHref('/category', '')).toBe(
          '/category',
        );
      });

      it('accepts source search without leading "?"', () => {
        expect(
          FilterRegistry.mergeFilterParamsIntoHref(
            '/category',
            'filter_zone=SAZ',
          ),
        ).toBe('/category?filter_zone=SAZ');
      });
    });
  });
});
