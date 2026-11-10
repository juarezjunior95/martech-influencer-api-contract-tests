import { defaultValidator } from './defaultValidator';

describe('defaultValidator', () => {
  it('should return true when value exists in options', () => {
    const mockFilterData = {
      zones: {
        values: [
          { value: 'LATAM', label: 'LATAM' },
          { value: 'NAZ', label: 'NAZ' },
          { value: 'APAC', label: 'APAC' },
        ],
      },
    };

    expect(defaultValidator('zones', mockFilterData, 'LATAM')).toBe(true);
    expect(defaultValidator('zones', mockFilterData, 'NAZ')).toBe(true);
    expect(defaultValidator('zones', mockFilterData, 'APAC')).toBe(true);
  });

  it('should return false when value does not exist in options', () => {
    const mockFilterData = {
      zones: {
        values: [
          { value: 'LATAM', label: 'LATAM' },
          { value: 'NAZ', label: 'NAZ' },
        ],
      },
    };

    expect(defaultValidator('zones', mockFilterData, 'INVALID')).toBe(false);
    expect(defaultValidator('zones', mockFilterData, 'APAC')).toBe(false);
  });

  it('should return false when filter has no values array', () => {
    const mockFilterData = {
      zones: {
        default: { value: 'LATAM' },
      },
    };

    expect(defaultValidator('zones', mockFilterData, 'LATAM')).toBe(false);
  });

  it('should return false when filter does not exist', () => {
    const mockFilterData = {};

    expect(defaultValidator('zones', mockFilterData, 'LATAM')).toBe(false);
  });

  it('should handle null values in options', () => {
    const mockFilterData = {
      zones: {
        values: [
          { value: 'LATAM', label: 'LATAM' },
          null,
          { value: 'NAZ', label: 'NAZ' },
        ],
      },
    };

    expect(defaultValidator('zones', mockFilterData, 'LATAM')).toBe(true);
    expect(defaultValidator('zones', mockFilterData, 'NAZ')).toBe(true);
  });

  it('should handle undefined filter values', () => {
    const mockFilterData = {
      zones: {
        values: undefined,
      },
    };

    expect(defaultValidator('zones', mockFilterData, 'LATAM')).toBe(false);
  });

  it('should work with different filter keys', () => {
    const mockFilterData = {
      country: {
        values: [
          { value: 'BR', label: 'Brazil' },
          { value: 'US', label: 'United States' },
        ],
      },
      brands: {
        values: [
          { value: 'BRAHMA', label: 'Brahma' },
          { value: 'SKOL', label: 'Skol' },
        ],
      },
    };

    expect(defaultValidator('country', mockFilterData, 'BR')).toBe(true);
    expect(defaultValidator('country', mockFilterData, 'US')).toBe(true);
    expect(defaultValidator('brands', mockFilterData, 'BRAHMA')).toBe(true);
    expect(defaultValidator('brands', mockFilterData, 'CORONA')).toBe(false);
  });

  it('should handle empty values array', () => {
    const mockFilterData = {
      zones: {
        values: [],
      },
    };

    expect(defaultValidator('zones', mockFilterData, 'LATAM')).toBe(false);
  });
});
