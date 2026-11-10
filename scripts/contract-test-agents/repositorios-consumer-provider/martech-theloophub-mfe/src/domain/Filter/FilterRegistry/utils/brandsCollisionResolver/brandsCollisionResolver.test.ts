import FilterRegistry from '../../FilterRegistry';
import { resolveBrandsCollisions } from './brandsCollisionResolver';

describe('brandsCollisionResolver', () => {
  let mockRegistry: FilterRegistry;

  beforeEach(() => {
    mockRegistry = {
      isValueValid: jest.fn(),
    } as any;
  });

  describe('resolveBrandsCollisions', () => {
    it('should return empty object when no conversion is needed', () => {
      const previousApplied = {
        zones: 'LATAM',
        country: 'BR',
      };

      const currentDataFilters = {
        zones: { values: [] },
        country: { values: [] },
      };

      const currentDefaults = {
        zones: 'LATAM',
        country: 'BR',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        'BR',
      );

      expect(result).toEqual({});
    });

    it('should convert brands to brands_abi when needed', () => {
      const previousApplied = {
        brands: 'BRAHMA',
        sub_brands: 'BRAHMA_DUPLO_MALTE',
      };

      const currentDataFilters = {
        brands_abi: {
          values: {
            BR: [
              {
                values: [
                  { value: 'BRAHMA_DUPLO_MALTE', label: 'BRAHMA_DUPLO_MALTE' },
                  { value: 'BRAHMA', label: 'BRAHMA' },
                ],
              },
            ],
          },
        },
      };

      const currentDefaults = {
        brands_abi: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        'BR',
      );

      expect(result).toEqual({ brands_abi: 'BRAHMA_DUPLO_MALTE' });
    });

    it('should convert brands to brands_abi using brand label', () => {
      const previousApplied = {
        country: 'BR',
        brands: 'BRAHMA',
        sub_brands: 'BRAHMA_LABEL',
      };

      const currentDataFilters = {
        brands_abi: {
          values: {
            BR: [
              {
                values: [
                  { value: 'BRAHMA_ID', label: 'BRAHMA' },
                  { value: 'SKOL_ID', label: 'SKOL' },
                ],
              },
            ],
          },
        },
      };

      const currentDefaults = {
        brands_abi: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        'BR',
      );

      expect(result).toEqual({ brands_abi: 'BRAHMA_ID' });
    });

    it('should return default when brands or sub_brands is missing', () => {
      const previousApplied = {
        country: 'BR',
        brands: 'BRAHMA',
        sub_brands: null,
      };

      const currentDataFilters = {
        brands_abi: {
          values: {
            BR: [
              {
                values: [{ value: 'BRAHMA', label: 'BRAHMA' }],
              },
            ],
          },
        },
      };

      const currentDefaults = {
        country: 'BR',
        brands_abi: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        'BR',
      );

      expect(result).toEqual({ brands_abi: 'All' });
    });

    it('should convert brands_abi to brands when needed', () => {
      (mockRegistry.isValueValid as jest.Mock)
        .mockReturnValueOnce(true) // brands exists
        .mockReturnValueOnce(true); // sub_brands exists

      const previousApplied = {
        brands_abi: 'BRAHMA_DUPLO_MALTE',
      };

      const currentDataFilters = {
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

      const currentDefaults = {
        brands: 'All',
        sub_brands: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        'BR',
      );

      expect(result).toEqual({
        brands: 'BRAHMA',
        sub_brands: 'BRAHMA_DUPLO_MALTE',
      });
    });

    it('should convert brands_abi to brand only when sub_brand not found', () => {
      (mockRegistry.isValueValid as jest.Mock).mockReturnValue(true);

      const previousApplied = {
        brands_abi: 'BRAHMA',
      };

      const currentDataFilters = {
        brands: {
          values: {
            BR: {
              brands: [
                {
                  value: 'BRAHMA',
                  label: 'Brahma',
                  sub_brands: [],
                },
              ],
            },
          },
        },
      };

      const currentDefaults = {
        brands: 'All',
        sub_brands: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        'BR',
      );

      expect(result).toEqual({
        brands: 'BRAHMA',
        sub_brands: 'All',
      });
    });

    it('should return defaults when brands_abi value is not found', () => {
      (mockRegistry.isValueValid as jest.Mock).mockReturnValue(false);

      const previousApplied = {
        brands_abi: 'NONEXISTENT',
      };

      const currentDataFilters = {
        brands: {
          values: {
            BR: {
              brands: [
                {
                  value: 'BRAHMA',
                  label: 'Brahma',
                  sub_brands: [],
                },
              ],
            },
          },
        },
      };

      const currentDefaults = {
        brands: 'All',
        sub_brands: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        'BR',
      );

      expect(result).toEqual({
        brands: 'All',
        sub_brands: 'All',
      });
    });

    it('should return defaults when conversion data is missing', () => {
      const previousApplied = {
        brands: 'BRAHMA',
        sub_brands: 'BRAHMA_DUPLO_MALTE',
      };

      const currentDataFilters = {
        brands_abi: {
          values: {},
        },
      };

      const currentDefaults = {
        brands_abi: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        null,
      );

      expect(result).toEqual({ brands_abi: 'All' });
    });

    it('should return defaults when previous country is missing', () => {
      const previousApplied = {
        brands: 'BRAHMA',
        sub_brands: 'BRAHMA_DUPLO_MALTE',
      };

      const currentDataFilters = {
        brands_abi: {
          values: {
            BR: [
              {
                values: [{ value: 'BRAHMA', label: 'BRAHMA' }],
              },
            ],
          },
        },
      };

      const currentDefaults = {
        brands_abi: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        null,
      );

      expect(result).toEqual({ brands_abi: 'All' });
    });

    it('should handle malformed brands_abi data structure', () => {
      const previousApplied = {
        brands: 'BRAHMA',
        sub_brands: 'BRAHMA_DUPLO_MALTE',
      };

      const currentDataFilters = {
        brands_abi: {
          values: {
            BR: 'invalid_structure',
          },
        },
      };

      const currentDefaults = {
        brands_abi: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        'BR',
      );

      expect(result).toEqual({ brands_abi: 'All' });
    });

    it('should handle missing brands data in brands structure', () => {
      (mockRegistry.isValueValid as jest.Mock).mockReturnValue(false);

      const previousApplied = {
        brands_abi: 'BRAHMA',
      };

      const currentDataFilters = {
        brands: {
          values: {
            BR: {
              // Missing 'brands' array
            },
          },
        },
      };

      const currentDefaults = {
        brands: 'All',
        sub_brands: 'All',
      };

      const result = resolveBrandsCollisions(
        mockRegistry,
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        'BR',
      );

      expect(result).toEqual({
        brands: 'All',
        sub_brands: 'All',
      });
    });
  });
});
