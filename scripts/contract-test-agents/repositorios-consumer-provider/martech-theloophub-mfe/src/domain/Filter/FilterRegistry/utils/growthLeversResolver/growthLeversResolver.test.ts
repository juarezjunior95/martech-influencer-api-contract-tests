import { resolveGrowthLeversCollisions } from './growthLeversResolver';

describe('growthLeversResolver', () => {
  describe('resolveGrowthLeversCollisions', () => {
    it('should return empty object when no previous growth lever values', () => {
      const previousApplied = { country: 'BR' };
      const currentDataFilters = {
        growth_levers: { values: [{ value: 'volume', label: 'Volume' }] },
        country: { values: {} },
      };
      const currentDefaults = {
        growth_levers: 'volume',
        value_creation_growth_levers: 'volume',
      };
      const resolved = { country: 'BR' };

      const result = resolveGrowthLeversCollisions(
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        resolved,
      );

      expect(result).toEqual({});
    });

    it('should map value_creation_growth_levers to growth_levers when option exists', () => {
      const previousApplied = { value_creation_growth_levers: 'volume' };
      const currentDataFilters = {
        growth_levers: {
          values: [
            { value: 'power', label: 'Power' },
            { value: 'volume', label: 'Volume' },
          ],
        },
        country: { values: {} },
      };
      const currentDefaults = {
        growth_levers: 'power',
        value_creation_growth_levers: null,
      };
      const resolved = {};

      const result = resolveGrowthLeversCollisions(
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        resolved,
      );

      expect(result).toEqual({ growth_levers: 'volume' });
    });

    it('should use currentDefaults.growth_levers when value_creation_growth_levers not found', () => {
      const previousApplied = { value_creation_growth_levers: 'unknown' };
      const currentDataFilters = {
        growth_levers: {
          values: [
            { value: 'power', label: 'Power' },
            { value: 'volume', label: 'Volume' },
          ],
        },
        country: { values: {} },
      };
      const currentDefaults = {
        growth_levers: 'power',
        value_creation_growth_levers: null,
      };
      const resolved = {};

      const result = resolveGrowthLeversCollisions(
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        resolved,
      );

      expect(result).toEqual({ growth_levers: 'power' });
    });

    it('should map growth_levers to value_creation_growth_levers when found in country options', () => {
      const previousApplied = { growth_levers: 'sustainable_growth' };
      const currentDataFilters = {
        country: {
          values: {
            EUR: [
              {
                value: 'DE',
                label: 'Germany',
                growth_levers: [
                  {
                    value: 'sustainable_growth',
                    label: 'Sustainable Growth',
                    disabled: false,
                  },
                  {
                    value: 'premiumization',
                    label: 'Premiumization',
                    disabled: false,
                  },
                ],
              },
            ],
          },
        },
      };
      const currentDefaults = {
        value_creation_growth_levers: 'premiumization',
      };
      const resolved = { country: 'DE' };

      const result = resolveGrowthLeversCollisions(
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        resolved,
      );

      expect(result).toEqual({
        value_creation_growth_levers: 'sustainable_growth',
      });
    });

    it('should use currentDefaults.value_creation_growth_levers when growth_levers not found for country', () => {
      const previousApplied = { growth_levers: 'unknown_lever' };
      const currentDataFilters = {
        country: {
          values: {
            EUR: [
              {
                value: 'DE',
                label: 'Germany',
                growth_levers: [
                  {
                    value: 'sustainable_growth',
                    label: 'Sustainable Growth',
                    disabled: false,
                  },
                ],
              },
            ],
          },
        },
      };
      const currentDefaults = {
        value_creation_growth_levers: 'sustainable_growth',
      };
      const resolved = { country: 'DE' };

      const result = resolveGrowthLeversCollisions(
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        resolved,
      );

      expect(result).toEqual({
        value_creation_growth_levers: 'sustainable_growth',
      });
    });

    it('should return empty when currentDataFilters has no growth_levers nor country values', () => {
      const previousApplied = {
        value_creation_growth_levers: 'volume',
        growth_levers: 'sustainable_growth',
      };
      const currentDataFilters = {};
      const currentDefaults = {
        growth_levers: 'power',
        value_creation_growth_levers: null,
      };
      const resolved = { country: 'BR' };

      const result = resolveGrowthLeversCollisions(
        previousApplied,
        currentDataFilters as any,
        currentDefaults,
        resolved,
      );

      expect(result).toEqual({});
    });
  });
});
