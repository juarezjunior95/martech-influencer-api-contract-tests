import {
  type ValueCreationApiData,
  type ValueCreationCountryOption,
  ValueCreationFilterDataTransformer,
} from './ValueCreationFilterDataTransformer';

const createMockZones = () => ({
  values: [
    { value: 'ABI', label: 'Global' },
    { value: 'SAZ', label: 'South America Zone' },
  ],
  default: { value: 'ABI', label: 'Global' },
  enabled: true,
});

const createMockCountryOption = (
  overrides: Partial<ValueCreationCountryOption> = {},
): ValueCreationCountryOption => ({
  value: 'BRA',
  label: 'Brazil',
  zone: 'SAZ',
  growth_levers: [
    { value: 'lead_premium', label: 'Lead Premium', disabled: false },
    { value: 'superior_core', label: 'Superior Core', disabled: true },
  ],
  ...overrides,
});

const createMockCountryField = () => ({
  values: {
    ABI: [createMockCountryOption({ value: 'ABI', label: 'All', zone: 'ABI' })],
    SAZ: [
      createMockCountryOption({ value: 'BRA', label: 'Brazil', zone: 'SAZ' }),
      createMockCountryOption({
        value: 'ARG',
        label: 'Argentina',
        zone: 'SAZ',
      }),
    ],
  },
  default: createMockCountryOption({ value: 'ABI', label: 'All', zone: 'ABI' }),
  enabled: true,
});

const createMockPeriods = () => ({
  values: [
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
  ],
  default: { value: '2024', label: '2024' },
  enabled: true,
});

const createMockData = (
  overrides: Partial<ValueCreationApiData> = {},
): ValueCreationApiData => ({
  value_creation: {
    zones: createMockZones(),
    country: createMockCountryField(),
    periods: createMockPeriods(),
  },
  ...overrides,
});

describe('ValueCreationFilterDataTransformer', () => {
  describe('isNewFormat', () => {
    it('should return true for valid object data', () => {
      const data = createMockData();
      expect(ValueCreationFilterDataTransformer.isNewFormat(data)).toBe(true);
    });

    it('should return true for plain object', () => {
      expect(ValueCreationFilterDataTransformer.isNewFormat({})).toBe(true);
      expect(ValueCreationFilterDataTransformer.isNewFormat({ foo: 1 })).toBe(
        true,
      );
    });

    it('should return false for null', () => {
      expect(ValueCreationFilterDataTransformer.isNewFormat(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(ValueCreationFilterDataTransformer.isNewFormat(undefined)).toBe(
        false,
      );
    });

    it('should return false for non-object types', () => {
      expect(ValueCreationFilterDataTransformer.isNewFormat('string')).toBe(
        false,
      );
      expect(ValueCreationFilterDataTransformer.isNewFormat(42)).toBe(false);
      expect(ValueCreationFilterDataTransformer.isNewFormat(true)).toBe(false);
    });
  });

  describe('transform', () => {
    it('should return empty structure for invalid data', () => {
      const result = ValueCreationFilterDataTransformer.transform(null);
      expect(result).toEqual({});

      const resultUndefined =
        ValueCreationFilterDataTransformer.transform(undefined);
      expect(resultUndefined).toEqual({});
    });

    it('should return empty structure for non-object data', () => {
      const result = ValueCreationFilterDataTransformer.transform('invalid');
      expect(result).toEqual({});
    });

    it('should transform data and expose zones, country, periods at top level', () => {
      const data = createMockData();
      const expectedZones = data.value_creation.zones;
      const expectedCountry = data.value_creation.country;
      const expectedPeriods = data.value_creation.periods;

      const result = ValueCreationFilterDataTransformer.transform(data);

      expect(result.zones).toBeDefined();
      expect(result.zones).toEqual(expectedZones);
      expect(result.country).toBeDefined();
      expect(result.country).toEqual(expectedCountry);
      expect(result.periods).toBeDefined();
      expect(result.periods).toEqual(expectedPeriods);
    });

    it('should spread other properties from data onto result', () => {
      const data = createMockData({ kpis: undefined });
      const expectedZones = data.value_creation.zones;
      const expectedCountry = data.value_creation.country;
      const expectedPeriods = data.value_creation.periods;

      const result = ValueCreationFilterDataTransformer.transform(data);

      expect(result.zones).toEqual(expectedZones);
      expect(result.country).toEqual(expectedCountry);
      expect(result.periods).toEqual(expectedPeriods);
    });

    it('should mutate input data by removing value_creation after toFlat', () => {
      const data = createMockData();
      ValueCreationFilterDataTransformer.transform(data);

      expect(data.value_creation).toBeUndefined();
    });
  });

  describe('toFlat', () => {
    it('should return zones, country and periods from value_creation', () => {
      const data = createMockData();
      const expectedZones = data.value_creation.zones;
      const expectedCountry = data.value_creation.country;
      const expectedPeriods = data.value_creation.periods;

      const mapper = new ValueCreationFilterDataTransformer(data);
      const result = mapper.toFlat();

      expect(result.zones).toEqual(expectedZones);
      expect(result.country).toEqual(expectedCountry);
      expect(result.periods).toEqual(expectedPeriods);
    });

    it('should include other keys from data when value_creation is present', () => {
      const data = createMockData();
      const mapper = new ValueCreationFilterDataTransformer(data);
      const result = mapper.toFlat();

      expect(result).toHaveProperty('zones');
      expect(result).toHaveProperty('country');
      expect(result).toHaveProperty('periods');
    });

    it('should preserve country default growth_levers shape', () => {
      const data = createMockData();
      const result = ValueCreationFilterDataTransformer.transform(data);

      const defaultCountry = result.country
        ?.default as ValueCreationCountryOption;
      expect(defaultCountry).toBeDefined();
      expect(defaultCountry.growth_levers).toBeDefined();
      expect(defaultCountry.growth_levers).toHaveLength(2);
      expect(defaultCountry.growth_levers?.[0]).toEqual({
        value: 'lead_premium',
        label: 'Lead Premium',
        disabled: false,
      });
    });
  });
});
