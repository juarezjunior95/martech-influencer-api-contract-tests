import { FilterDataStructure } from 'models/Filters';

import { validateBrandsInCountry } from './validateBrandsInCountry';

describe('validateBrandsInCountry', () => {
  const mockDataFilters = {
    brands: {
      values: {
        BR: {
          brands: [
            { value: 'SKOL', label: 'Skol' },
            { value: 'BRAHMA', label: 'Brahma' },
          ],
        },
        US: {
          brands: [
            { value: 'BUDWEISER', label: 'Budweiser' },
            { value: 'MICHELOB', label: 'Michelob' },
          ],
        },
      },
      enabled: true,
    },
  } as unknown as FilterDataStructure;

  describe('valid scenarios', () => {
    it('should return true when brand exists in country', () => {
      const result = validateBrandsInCountry(
        'brands',
        mockDataFilters,
        'BR',
        'SKOL',
      );

      expect(result).toBe(true);
    });

    it('should return true when brand is empty', () => {
      const result = validateBrandsInCountry(
        'brands',
        mockDataFilters,
        'BR',
        '',
      );

      expect(result).toBe(true);
    });

    it('should validate different brands in same country', () => {
      expect(
        validateBrandsInCountry('brands', mockDataFilters, 'BR', 'SKOL'),
      ).toBe(true);
      expect(
        validateBrandsInCountry('brands', mockDataFilters, 'BR', 'BRAHMA'),
      ).toBe(true);
    });

    it('should validate brands across different countries', () => {
      expect(
        validateBrandsInCountry('brands', mockDataFilters, 'BR', 'SKOL'),
      ).toBe(true);
      expect(
        validateBrandsInCountry('brands', mockDataFilters, 'US', 'BUDWEISER'),
      ).toBe(true);
    });
  });

  describe('invalid scenarios', () => {
    it('should return false when country is empty', () => {
      const result = validateBrandsInCountry(
        'brands',
        mockDataFilters,
        '',
        'SKOL',
      );

      expect(result).toBe(false);
    });

    it('should return false when brand does not exist in country', () => {
      const result = validateBrandsInCountry(
        'brands',
        mockDataFilters,
        'BR',
        'BUDWEISER',
      );

      expect(result).toBe(false);
    });

    it('should return false when country does not exist', () => {
      const result = validateBrandsInCountry(
        'brands',
        mockDataFilters,
        'MX',
        'SKOL',
      );

      expect(result).toBe(false);
    });

    it('should return false when key does not exist in dataFilters', () => {
      const result = validateBrandsInCountry(
        'nonexistent',
        mockDataFilters,
        'BR',
        'SKOL',
      );

      expect(result).toBe(false);
    });

    it('should return false when dataFilters has no values property', () => {
      const invalidData = {
        brands: {
          enabled: true,
        },
      } as unknown as FilterDataStructure;

      const result = validateBrandsInCountry(
        'brands',
        invalidData,
        'BR',
        'SKOL',
      );

      expect(result).toBe(false);
    });

    it('should return false when country brands is not an array', () => {
      const invalidData = {
        brands: {
          values: {
            BR: 'not-an-array' as any,
          },
          enabled: true,
        },
      } as unknown as FilterDataStructure;

      const result = validateBrandsInCountry(
        'brands',
        invalidData,
        'BR',
        'SKOL',
      );

      expect(result).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty dataFilters', () => {
      const result = validateBrandsInCountry('brands', {}, 'BR', 'SKOL');

      expect(result).toBe(false);
    });

    it('should handle country with empty brands array', () => {
      const dataWithEmpty = {
        brands: {
          values: {
            BR: [],
          },
          enabled: true,
        },
      } as unknown as FilterDataStructure;

      const result = validateBrandsInCountry(
        'brands',
        dataWithEmpty,
        'BR',
        'SKOL',
      );

      expect(result).toBe(false);
    });

    it('should handle null/undefined brand gracefully', () => {
      expect(
        validateBrandsInCountry('brands', mockDataFilters, 'BR', null as any),
      ).toBe(true);
      expect(
        validateBrandsInCountry(
          'brands',
          mockDataFilters,
          'BR',
          undefined as any,
        ),
      ).toBe(true);
    });
  });
});
