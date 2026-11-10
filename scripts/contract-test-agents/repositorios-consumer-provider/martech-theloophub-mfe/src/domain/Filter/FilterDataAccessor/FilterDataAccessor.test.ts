import type {
  FilterDataStructure,
  FilterForm,
  FilterOption,
} from 'models/Filters';

import FilterDataAccessor from './FilterDataAccessor';

describe('FilterDataAccessor', () => {
  let accessor: FilterDataAccessor;

  beforeEach(() => {
    accessor = FilterDataAccessor.getInstance();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = FilterDataAccessor.getInstance();
      const instance2 = FilterDataAccessor.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should have a single instance across multiple calls', () => {
      const instances = Array.from({ length: 5 }, () =>
        FilterDataAccessor.getInstance(),
      );

      instances.forEach((instance) => {
        expect(instance).toBe(accessor);
      });
    });
  });

  describe('getZone', () => {
    const mockDataFilters: FilterDataStructure = {
      zones: {
        default: { value: 'LATAM', label: 'Latin America' },
        enabled: true,
        values: [
          { value: 'LATAM', label: 'Latin America' },
          { value: 'NAZ', label: 'North America Zone' },
          { value: 'EMEA', label: 'Europe, Middle East and Africa' },
        ],
      },
    };

    it('should return zone option when zone exists', () => {
      const applied: FilterForm = { zone: 'LATAM' };

      const result = accessor.getZone(mockDataFilters, applied);

      expect(result).toEqual({
        value: 'LATAM',
        label: 'Latin America',
      });
    });

    it('should return null values when zone does not exist', () => {
      const applied: FilterForm = { zone: 'INVALID' };

      const result = accessor.getZone(mockDataFilters, applied);

      expect(result).toEqual({
        value: null,
        label: null,
      });
    });

    it('should return null when dataFilters is null', () => {
      const applied: FilterForm = { zone: 'LATAM' };

      const result = accessor.getZone(
        null as unknown as FilterDataStructure,
        applied,
      );

      expect(result).toBeNull();
    });

    it('should return null when zones is undefined', () => {
      const applied: FilterForm = { zone: 'LATAM' };

      const result = accessor.getZone({} as FilterDataStructure, applied);

      expect(result).toBeNull();
    });

    it('should return null when zones.values is undefined', () => {
      const applied: FilterForm = { zone: 'LATAM' };
      const dataFilters = { zones: {} } as FilterDataStructure;

      const result = accessor.getZone(dataFilters, applied);

      expect(result).toBeNull();
    });

    it('should return null values when applied.zone is undefined', () => {
      const applied: FilterForm = {};

      const result = accessor.getZone(mockDataFilters, applied);

      expect(result).toEqual({
        value: null,
        label: null,
      });
    });
  });

  describe('getCountry', () => {
    const mockDataFilters: FilterDataStructure = {
      country: {
        default: { value: 'LATAM', label: 'Latin America' },
        enabled: true,
        values: {
          LATAM: [
            { value: 'BR', label: 'Brazil' },
            { value: 'AR', label: 'Argentina' },
            { value: 'All', label: 'All' },
          ],
          NAZ: [
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
          ],
        },
      },
    };

    it('should return country option when country exists', () => {
      const applied: FilterForm = { zone: 'LATAM', country: 'BR' };

      const result = accessor.getCountry(mockDataFilters, applied);

      expect(result).toEqual({
        value: 'BR',
        label: 'Brazil',
        quick_filter_label: null,
      });
    });

    it('should replace "All" label with "Global"', () => {
      const applied: FilterForm = { zone: 'LATAM', country: 'All' };

      const result = accessor.getCountry(mockDataFilters, applied);

      expect(result).toEqual({
        value: 'All',
        label: 'Global',
        quick_filter_label: null,
      });
    });

    it('should return null when country is not provided', () => {
      const applied: FilterForm = { zone: 'LATAM' };

      const result = accessor.getCountry(mockDataFilters, applied);

      expect(result).toBeNull();
    });

    it('should return null when zone is not provided', () => {
      const applied: FilterForm = { country: 'BR' };

      const result = accessor.getCountry(mockDataFilters, applied);

      expect(result).toBeNull();
    });

    it('should return null when country does not exist in zone', () => {
      const applied: FilterForm = { zone: 'LATAM', country: 'US' };

      const result = accessor.getCountry(mockDataFilters, applied);

      expect(result).toBeNull();
    });

    it('should return null when zone does not exist in dataFilters', () => {
      const applied: FilterForm = { zone: 'INVALID', country: 'BR' };

      const result = accessor.getCountry(mockDataFilters, applied);

      expect(result).toBeNull();
    });

    it('should return null when dataFilters.country is undefined', () => {
      const applied: FilterForm = { zone: 'LATAM', country: 'BR' };

      const result = accessor.getCountry({} as FilterDataStructure, applied);

      expect(result).toBeNull();
    });

    it('should return null when dataFilters.country.values is undefined', () => {
      const applied: FilterForm = { zone: 'LATAM', country: 'BR' };
      const dataFilters = { country: {} } as FilterDataStructure;

      const result = accessor.getCountry(dataFilters, applied);

      expect(result).toBeNull();
    });
  });

  describe('getBrandComp', () => {
    const mockDataFilters: FilterDataStructure = {
      brands_comp: {
        default: { value: 'BR', label: 'Brazil' },
        enabled: true,
        values: {
          BR: [
            {
              group: 'Group 1',
              values: [
                { value: 'Heineken', label: 'Heineken' },
                { value: 'Corona', label: 'Corona' },
              ],
            },
            {
              group: 'Group 2',
              values: [
                { value: 'Budweiser', label: 'Budweiser' },
                { value: 'Stella', label: 'Stella Artois' },
              ],
            },
          ] as FilterOption[],
          AR: [
            {
              group: 'Group 3',
              values: [{ value: 'Quilmes', label: 'Quilmes' }],
            },
          ] as FilterOption[],
        },
      },
    };

    it('should return brand competitor when found in first group', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_comp: 'Heineken',
      };

      const result = accessor.getBrandComp(mockDataFilters, applied);

      expect(result).toEqual({
        value: 'Heineken',
        label: 'Heineken',
      });
    });

    it('should return brand competitor when found in second group', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_comp: 'Budweiser',
      };

      const result = accessor.getBrandComp(mockDataFilters, applied);

      expect(result).toEqual({
        value: 'Budweiser',
        label: 'Budweiser',
      });
    });

    it('should return brand competitor from different country', () => {
      const applied: FilterForm = {
        country: 'AR',
        brands_comp: 'Quilmes',
      };

      const result = accessor.getBrandComp(mockDataFilters, applied);

      expect(result).toEqual({
        value: 'Quilmes',
        label: 'Quilmes',
      });
    });

    it('should return undefined when country is not provided', () => {
      const applied: FilterForm = { brands_comp: 'Heineken' };

      const result = accessor.getBrandComp(mockDataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when brands_comp is not provided', () => {
      const applied: FilterForm = { country: 'BR' };

      const result = accessor.getBrandComp(mockDataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when brand competitor does not exist', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_comp: 'INVALID',
      };

      const result = accessor.getBrandComp(mockDataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when country does not exist in dataFilters', () => {
      const applied: FilterForm = {
        country: 'INVALID',
        brands_comp: 'Heineken',
      };

      const result = accessor.getBrandComp(mockDataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when dataFilters.brands_comp is undefined', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_comp: 'Heineken',
      };

      const result = accessor.getBrandComp({} as FilterDataStructure, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when dataFilters.brands_comp.values is undefined', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_comp: 'Heineken',
      };
      const dataFilters = { brands_comp: {} } as FilterDataStructure;

      const result = accessor.getBrandComp(dataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when countryBrandsComp is not an array', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_comp: 'Heineken',
      };
      const dataFilters = {
        brands_comp: { values: { BR: 'not-an-array' } },
      } as unknown as FilterDataStructure;

      const result = accessor.getBrandComp(dataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when group has no values array', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_comp: 'Heineken',
      };
      const dataFilters = {
        brands_comp: {
          default: { value: 'BR', label: 'Brazil' },
          enabled: true,
          values: {
            BR: [
              {
                group: 'Group 1',
                values: [],
              },
            ] as FilterOption[],
          },
        },
      } as FilterDataStructure;

      const result = accessor.getBrandComp(dataFilters, applied);

      expect(result).toBeUndefined();
    });
  });

  describe('getBrandFamilyAbi', () => {
    const mockDataFilters: FilterDataStructure = {
      brands_abi: {
        default: { value: 'BR', label: 'Brazil' },
        enabled: true,
        values: {
          BR: [
            {
              group: 'Core Brands',
              values: [
                { value: 'Brahma', label: 'Brahma' },
                { value: 'Skol', label: 'Skol' },
              ],
            },
            {
              group: 'Premium Brands',
              values: [
                { value: 'Stella', label: 'Stella Artois' },
                { value: 'Corona', label: 'Corona' },
              ],
            },
          ] as FilterOption[],
          AR: [
            {
              group: 'Argentina Brands',
              values: [{ value: 'Quilmes', label: 'Quilmes' }],
            },
          ] as FilterOption[],
        },
      },
    };

    it('should return brand family when brand exists in first group', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_abi: 'Brahma',
      };

      const result = accessor.getBrandFamilyAbi(mockDataFilters, applied);

      expect(result).toEqual({
        group: 'Core Brands',
        values: [
          { value: 'Brahma', label: 'Brahma' },
          { value: 'Skol', label: 'Skol' },
        ],
      });
    });

    it('should return brand family when brand exists in second group', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_abi: 'Stella',
      };

      const result = accessor.getBrandFamilyAbi(mockDataFilters, applied);

      expect(result).toEqual({
        group: 'Premium Brands',
        values: [
          { value: 'Stella', label: 'Stella Artois' },
          { value: 'Corona', label: 'Corona' },
        ],
      });
    });

    it('should return brand family from different country', () => {
      const applied: FilterForm = {
        country: 'AR',
        brands_abi: 'Quilmes',
      };

      const result = accessor.getBrandFamilyAbi(mockDataFilters, applied);

      expect(result).toEqual({
        group: 'Argentina Brands',
        values: [{ value: 'Quilmes', label: 'Quilmes' }],
      });
    });

    it('should return undefined when country is not provided', () => {
      const applied: FilterForm = { brands_abi: 'Brahma' };

      const result = accessor.getBrandFamilyAbi(mockDataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when brands_abi is not provided', () => {
      const applied: FilterForm = { country: 'BR' };

      const result = accessor.getBrandFamilyAbi(mockDataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when brand does not exist in any group', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_abi: 'INVALID',
      };

      const result = accessor.getBrandFamilyAbi(mockDataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when country does not exist in dataFilters', () => {
      const applied: FilterForm = {
        country: 'INVALID',
        brands_abi: 'Brahma',
      };

      const result = accessor.getBrandFamilyAbi(mockDataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when dataFilters.brands_abi is undefined', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_abi: 'Brahma',
      };

      const result = accessor.getBrandFamilyAbi(
        {} as FilterDataStructure,
        applied,
      );

      expect(result).toBeUndefined();
    });

    it('should return undefined when dataFilters.brands_abi.values is undefined', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_abi: 'Brahma',
      };
      const dataFilters = { brands_abi: {} } as FilterDataStructure;

      const result = accessor.getBrandFamilyAbi(dataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when countryBrandsAbi is not an array', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_abi: 'Brahma',
      };
      const dataFilters = {
        brands_abi: { values: { BR: 'not-an-array' } },
      } as unknown as FilterDataStructure;

      const result = accessor.getBrandFamilyAbi(dataFilters, applied);

      expect(result).toBeUndefined();
    });

    it('should return undefined when group has no values array', () => {
      const applied: FilterForm = {
        country: 'BR',
        brands_abi: 'Brahma',
      };
      const dataFilters = {
        brands_abi: {
          values: {
            BR: [
              {
                group: 'Core Brands',
                values: [],
              },
            ],
          },
        },
      } as unknown as FilterDataStructure;

      const result = accessor.getBrandFamilyAbi(dataFilters, applied);

      expect(result).toBeUndefined();
    });
  });

  describe('getCountryOptions', () => {
    const mockDataFilters: FilterDataStructure = {
      country: {
        default: { value: 'LATAM', label: 'Latin America' },
        enabled: true,
        values: {
          LATAM: [
            { value: 'BR', label: 'Brazil' },
            { value: 'ABI', label: 'ABI Global' },
            { value: 'AR', label: 'Argentina' },
          ],
          NAZ: [
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
          ],
        },
      },
    };

    it('should return all unique country options from all zones', () => {
      const result = accessor.getCountryOptions(mockDataFilters);

      expect(result.length).toBe(5);
      expect(result).toEqual(
        expect.arrayContaining([
          { value: 'BR', label: 'Brazil' },
          { value: 'ABI', label: 'ABI Global' },
          { value: 'AR', label: 'Argentina' },
          { value: 'US', label: 'United States' },
          { value: 'CA', label: 'Canada' },
        ]),
      );
    });

    it('should place ABI as the first option in the list', () => {
      const result = accessor.getCountryOptions(mockDataFilters);

      expect(result[0]).toEqual({ value: 'ABI', label: 'ABI Global' });
    });

    it('should sort non-ABI options alphabetically by label', () => {
      const result = accessor.getCountryOptions(mockDataFilters);

      // Skip first element (ABI), check the rest are alphabetically sorted
      const nonAbiOptions = result.slice(1);
      const labels = nonAbiOptions.map((opt) => opt.label?.toString() || '');

      expect(labels).toEqual([
        'Argentina',
        'Brazil',
        'Canada',
        'United States',
      ]);
    });

    it('should handle duplicate country values across zones', () => {
      const dataFiltersWithDuplicates: FilterDataStructure = {
        country: {
          default: { value: 'LATAM', label: 'Latin America' },
          enabled: true,
          values: {
            LATAM: [
              { value: 'BR', label: 'Brazil' },
              { value: 'ABI', label: 'ABI Global' },
            ],
            NAZ: [
              { value: 'BR', label: 'Brazil' },
              { value: 'US', label: 'United States' },
            ],
          },
        },
      };

      const result = accessor.getCountryOptions(dataFiltersWithDuplicates);

      expect(result.length).toBe(3);
      expect(result.filter((opt) => opt.value === 'BR')).toHaveLength(1);
    });

    it('should return empty array when country values is undefined', () => {
      const dataFilters = { country: {} } as FilterDataStructure;

      const result = accessor.getCountryOptions(dataFilters);

      expect(result).toEqual([]);
    });

    it('should return empty array when dataFilters.country is undefined', () => {
      const result = accessor.getCountryOptions({} as FilterDataStructure);

      expect(result).toEqual([]);
    });

    it('should return empty array when dataFilters is null', () => {
      const result = accessor.getCountryOptions(
        null as unknown as FilterDataStructure,
      );

      expect(result).toEqual([]);
    });
  });
});
