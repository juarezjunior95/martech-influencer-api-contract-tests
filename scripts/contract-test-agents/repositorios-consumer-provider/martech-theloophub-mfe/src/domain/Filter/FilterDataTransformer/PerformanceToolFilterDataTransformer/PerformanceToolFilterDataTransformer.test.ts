import { PerformanceToolFilterDataTransformer } from './PerformanceToolFilterDataTransformer';

const createMockData = (overrides: any = {}) => ({
  kpis: {
    default: { value: 'volume', label: 'Volume', full: '' },
    values: [
      { value: 'volume', label: 'Volume', full: '' },
      { value: 'power', label: 'Power', full: '' },
    ],
    enabled: true,
  },
  performance_tool: {
    zones: [
      { label: 'Global', value: 'ABI' },
      { label: 'South America Zone', value: 'SAZ' },
      { label: 'Europe', value: 'EUR' },
      { label: 'Middle Americas Zone', value: 'MAZ' },
      { label: 'Africa Zone', value: 'AFR' },
      { label: 'Asia Pacific Zone', value: 'APAC' },
      { label: 'North America Zone', value: 'NAZ' },
    ],
    countries: [
      {
        id: 'BRA',
        label: 'Brazil',
        value: 'BRA',
        image_url: 'https://cdn.example.com/countries/bra-icon.png',
      },
      {
        id: 'ARG',
        label: 'Argentina',
        value: 'ARG',
        image_url: 'https://cdn.example.com/countries/arg-icon.png',
      },
      {
        id: 'COL',
        label: 'Colombia',
        value: 'COL',
        image_url: 'https://cdn.example.com/countries/col-icon.png',
      },
      {
        id: 'MEX',
        label: 'Mexico',
        value: 'MEX',
        image_url: 'https://cdn.example.com/countries/mex-icon.png',
      },
      {
        id: 'BEL',
        label: 'Belgium',
        value: 'BEL',
        image_url: 'https://cdn.example.com/countries/bel-icon.png',
      },
    ],
    kpi: {
      volume: {
        brands_classification: [
          'All Brands',
          'Portfolio',
          'Beer Price Segment',
          'Global Brands',
        ],
        growth_levers: [
          'Lead Premium',
          'Superior Core',
          'Balanced Choice',
          'Beyond Beer',
        ],
        periods: {
          values: [
            { value: 'YTD', label: 'YTD' },
            { value: 'L3M', label: 'L3M' },
          ],
          default: { value: 'YTD', label: 'YTD' },
        },
        relations: {
          brand_assets: {
            Brahma: {
              image_url: 'https://cdn.example.com/brands/brahma-square.png',
              image_variants: {
                square: 'https://cdn.example.com/brands/brahma-square.png',
                table: 'https://cdn.example.com/brands/brahma-table.png',
              },
            },
            Corona: {
              image_url: 'https://cdn.example.com/brands/corona-square.png',
              image_variants: {
                square: 'https://cdn.example.com/brands/corona-square.png',
                table: 'https://cdn.example.com/brands/corona-table.png',
              },
            },
            'Stella Artois': {
              image_url: 'https://cdn.example.com/brands/stella-square.png',
              image_variants: {
                square: 'https://cdn.example.com/brands/stella-square.png',
                table: 'https://cdn.example.com/brands/stella-table.png',
              },
            },
            'Brahma Chopp': {
              image_url: 'https://cdn.example.com/subbrands/brahma-chopp.png',
            },
            'Corona Extra': {
              image_url: 'https://cdn.example.com/subbrands/corona-extra.png',
            },
          },
          zone_countries: {
            ABI: 'BRA|ARG|COL|MEX|BEL',
            SAZ: 'BRA|ARG',
            MAZ: 'COL|MEX',
            EUR: 'BEL',
          },
          brand_classification: {
            'All Brands': {
              ABI: 'Brahma|Skol|Budweiser|Corona',
              BRA: 'Brahma|Skol|Antarctica',
              COL: 'Aguila|Club Colombia',
            },
            Portfolio: {
              Megabrands: {
                brands: {
                  ABI: 'Budweiser|Corona',
                  BRA: 'Brahma|Skol',
                },
                subbrands: {},
              },
              Expansion: {
                brands: {
                  ABI: 'Stella Artois',
                  BRA: 'Colorado',
                },
                subbrands: {},
              },
            },
            'Beer Price Segment': {
              'Super Premium': {
                ABI: 'Corona|Stella Artois',
                BRA: 'Corona|Stella Artois',
              },
              Premium: {
                ABI: 'Budweiser',
                BRA: 'Budweiser|Original',
              },
            },
            'Global Brands': {
              ABI: 'Budweiser|Corona|Stella Artois|Michelob Ultra',
              BRA: 'Budweiser|Corona|Stella Artois',
            },
          },
          subbrands: {
            country_subbrands: {
              BRA: 'Brahma Chopp|Brahma Extra|Skol Puro Malte',
              COL: 'Aguila Light|Aguila Cero',
            },
            brand_country_subbrands: {
              Brahma: {
                BRA: 'Brahma Chopp|Brahma Extra',
              },
              Aguila: {
                COL: 'Aguila Light|Aguila Cero',
              },
            },
            global_brand_country_subbrands: {
              Corona: {
                BRA: 'Corona Extra|Corona Cero',
                MEX: 'Corona Extra|Corona Light',
              },
            },
          },
          growth_levers: {
            'Lead Premium': {
              brand_classification: {
                'All Brands': {
                  ABI: 'Corona|Stella Artois',
                  BRA: 'Corona',
                  COL: 'Aguila',
                },
                Portfolio: {
                  Megabrands: { brands: { ABI: 'Corona' }, subbrands: {} },
                },
                'Global Brands': { ABI: 'Corona|Stella Artois' },
              },
              subbrands: {
                country_subbrands: { BRA: 'Corona Extra' },
                brand_country_subbrands: {},
              },
            },
            'Superior Core': {
              brand_classification: {
                'All Brands': {
                  ABI: 'Brahma|Skol',
                  BRA: 'Brahma',
                },
                Portfolio: {
                  Megabrands: { brands: { ABI: 'Brahma' }, subbrands: {} },
                },
              },
              subbrands: {
                country_subbrands: { BRA: 'Brahma Chopp' },
                brand_country_subbrands: {},
              },
            },
            'Beyond Beer': {
              brand_classification: {
                'All Brands': {
                  ABI: 'Guarana',
                  COL: 'Pony Malta',
                },
              },
              subbrands: {
                country_subbrands: {},
                brand_country_subbrands: {},
              },
            },
          },
        },
      },
      power: {
        brands_classification: [
          'All Brands',
          'Portfolio',
          'Beer Price Segment',
        ],
        periods: {
          values: [
            { value: 'YTD', label: 'YTD' },
            { value: 'QTD', label: 'QTD' },
          ],
          default: { value: 'YTD', label: 'YTD' },
        },
        relations: {
          zone_countries: {
            ABI: 'BRA|ARG|COL',
            SAZ: 'BRA|ARG',
            MAZ: 'COL',
          },
          brand_classification: {
            'All Brands': {
              ABI: 'Brahma|Skol|Budweiser',
              BRA: 'Brahma|Skol',
            },
            Portfolio: {
              Megabrands: {
                brands: { ABI: 'Budweiser', BRA: 'Brahma' },
                subbrands: {},
              },
            },
            'Beer Price Segment': {
              Premium: { ABI: 'Budweiser', BRA: 'Budweiser' },
            },
          },
          subbrands: {
            country_subbrands: { BRA: 'Brahma Chopp|Skol Puro Malte' },
            brand_country_subbrands: {
              Brahma: { BRA: 'Brahma Chopp|Brahma Extra' },
            },
          },
        },
      },
    },
    ...overrides,
  },
});

describe('PerformanceToolFilterDataTransformer', () => {
  describe('isValidFormat', () => {
    it('should return true for valid performance_tool data', () => {
      const data = createMockData();
      expect(PerformanceToolFilterDataTransformer.isValidFormat(data)).toBe(
        true,
      );
    });

    it('should return false when performance_tool is missing', () => {
      expect(PerformanceToolFilterDataTransformer.isValidFormat({})).toBe(
        false,
      );
      expect(PerformanceToolFilterDataTransformer.isValidFormat(null)).toBe(
        false,
      );
      expect(
        PerformanceToolFilterDataTransformer.isValidFormat(undefined),
      ).toBe(false);
    });

    it('should return false when kpis.values is missing', () => {
      const data = {
        performance_tool: { zones: [], kpi: {} },
      };
      expect(PerformanceToolFilterDataTransformer.isValidFormat(data)).toBe(
        false,
      );
    });

    it('should return false when zones is not an array', () => {
      const data = {
        kpis: { values: [{ value: 'volume', label: 'Volume', full: '' }] },
        performance_tool: { zones: 'invalid', kpi: {} },
      };
      expect(PerformanceToolFilterDataTransformer.isValidFormat(data)).toBe(
        false,
      );
    });

    it('should return false when kpi object is missing', () => {
      const data = {
        kpis: { values: [{ value: 'volume', label: 'Volume', full: '' }] },
        performance_tool: { zones: [] },
      };
      expect(PerformanceToolFilterDataTransformer.isValidFormat(data)).toBe(
        false,
      );
    });
  });

  describe('transform', () => {
    it('should return empty structure for invalid data', () => {
      const result = PerformanceToolFilterDataTransformer.transform({});
      expect(result).toEqual({});
    });

    it('should transform data correctly with default KPI (first in array)', () => {
      const data = createMockData();
      const result = PerformanceToolFilterDataTransformer.transform(data);

      expect(result.kpis).toBeDefined();
      expect(result.zones).toBeDefined();
      expect(result.country).toBeDefined();
      expect(result.brands).toBeDefined();
    });

    it('should normalize kpi values to lowercase', () => {
      const data = createMockData();
      const result = PerformanceToolFilterDataTransformer.transform(data);

      const kpisValues = result.kpis.values as Array<{ value: string }>;
      expect(kpisValues[0].value).toBe('volume');
      expect(kpisValues[1].value).toBe('power');
    });

    it('should use selectedKpi when provided', () => {
      const data = createMockData();
      const result = PerformanceToolFilterDataTransformer.transform(
        data,
        'power',
      );

      // Power não tem growth_levers
      expect(result.growth_levers.enabled).toBe(false);
    });

    it('should use selectedKpi in lowercase when provided in uppercase', () => {
      const data = createMockData();
      const result = PerformanceToolFilterDataTransformer.transform(
        data,
        'POWER',
      );

      expect(result.growth_levers.enabled).toBe(false);
    });

    describe('Growth Levers mapping', () => {
      it('should map growth levers when present in KPI data', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        expect(result.growth_levers.enabled).toBe(true);
        const values = result.growth_levers.values as Array<{ value: string }>;
        expect(values.length).toBeGreaterThan(0);
      });

      it('should not map growth levers for KPI without them', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'power',
        );

        expect(result.growth_levers.enabled).toBe(false);
        expect(result.growth_levers.values).toEqual([]);
      });

      it('should have "All" as default', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        expect(result.growth_levers.default).toEqual({
          value: 'All',
          label: 'All',
        });
      });

      it('should show all growth levers for global view (ABI)', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          { zone: 'ABI', country: 'ABI' },
        );

        const values = result.growth_levers.values as Array<{ value: string }>;
        const glNames = values.map((v) => v.value);
        expect(glNames).toContain('Lead Premium');
        expect(glNames).toContain('Superior Core');
        expect(glNames).toContain('Balanced Choice');
        expect(glNames).toContain('Beyond Beer');
        expect(values).toHaveLength(4);
      });

      it('should show all growth levers for zone-level aggregate views', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          { zone: 'SAZ', country: 'SAZ' },
        );

        const values = result.growth_levers.values as Array<{ value: string }>;
        const glNames = values.map((v) => v.value);
        expect(glNames).toContain('Lead Premium');
        expect(glNames).toContain('Superior Core');
        expect(glNames).toContain('Balanced Choice');
        expect(glNames).toContain('Beyond Beer');
        expect(values).toHaveLength(4);
      });

      it('should show growth levers available for the selected country', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          { zone: 'SAZ', country: 'BRA' },
        );

        const values = result.growth_levers.values as Array<{ value: string }>;
        const glNames = values.map((v) => v.value);
        expect(glNames).toContain('Lead Premium');
        expect(glNames).toContain('Superior Core');
        expect(glNames).toContain('Balanced Choice');
        expect(glNames).not.toContain('Beyond Beer');
      });

      it('should exclude growth levers not available for the selected country', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          { zone: 'MAZ', country: 'MEX' },
        );

        const values = result.growth_levers.values as Array<{ value: string }>;
        const glNames = values.map((v) => v.value);
        expect(glNames).toContain('Balanced Choice');
        expect(glNames).not.toContain('Lead Premium');
        expect(glNames).not.toContain('Superior Core');
        expect(glNames).not.toContain('Beyond Beer');
      });

      it('should include growth levers for a matching country (COL has Beyond Beer)', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          { zone: 'MAZ', country: 'COL' },
        );

        const values = result.growth_levers.values as Array<{ value: string }>;
        const glNames = values.map((v) => v.value);
        expect(glNames).toContain('Lead Premium');
        expect(glNames).toContain('Beyond Beer');
        expect(glNames).toContain('Balanced Choice');
        expect(glNames).not.toContain('Superior Core');
      });

      it('should include growth levers not listed in relations (default to available)', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          { zone: 'MAZ', country: 'MEX' },
        );

        const values = result.growth_levers.values as Array<{ value: string }>;
        const glNames = values.map((v) => v.value);
        expect(glNames).toContain('Balanced Choice');
      });
    });

    describe('KPIs mapping', () => {
      it('should map kpis correctly', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(data);

        const kpisValues = result.kpis.values as Array<{
          value: string;
          label: string;
        }>;
        expect(kpisValues).toHaveLength(2);
        expect(kpisValues[0]).toEqual({ value: 'volume', label: 'Volume' });
        expect(kpisValues[1]).toEqual({ value: 'power', label: 'Power' });
      });
    });

    describe('Zones mapping', () => {
      it('should map zones that have countries in relations', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        const zonesValues = result.zones.values as Array<{ value: string }>;
        const zoneIds = zonesValues.map((z) => z.value);
        expect(zoneIds).toContain('ABI');
        expect(zoneIds).toContain('SAZ');
      });

      it('should use first zone as default', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        expect(result.zones.default).toBeDefined();
      });
    });

    describe('Countries mapping', () => {
      it('should map countries grouped by zone', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        const countryValues = result.country.values as Record<
          string,
          Array<{ value: string }>
        >;
        expect(countryValues['SAZ']).toBeDefined();
        expect(countryValues['SAZ'].map((c) => c.value)).toContain('BRA');
      });

      it('should include country labels from countries array', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        const countryValues = result.country.values as Record<
          string,
          Array<{ value: string; label: string }>
        >;
        const braCountry = countryValues['SAZ']?.find((c) => c.value === 'BRA');
        expect(braCountry?.label).toBe('Brazil');
      });

      it('should include country image_url from countries array', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        const countryValues = result.country.values as Record<
          string,
          Array<{ value: string; image_url?: string }>
        >;
        const braCountry = countryValues['SAZ']?.find((c) => c.value === 'BRA');
        expect(braCountry?.image_url).toBe(
          'https://cdn.example.com/countries/bra-icon.png',
        );
      });

      it('should use first country from first zone as default', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        expect(result.country.default).toBeDefined();
      });
    });

    describe('Brand Filter Groupings mapping', () => {
      it('should map brand classifications', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        const values = result.brand_filter_groupings.values as Array<{
          value: string;
        }>;
        expect(values.map((v) => v.value)).toContain('All Brands');
      });

      it('should return all classifications regardless of growth lever', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            growth_levers: 'Superior Core',
          },
        );

        expect(result.brand_filter_groupings.enabled).toBe(true);
      });

      it('should use first classification as default', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        expect(result.brand_filter_groupings.default).toBeDefined();
      });
    });

    describe('Brands mapping', () => {
      it('should map brands for All Brands classification', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'All Brands',
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.brands.values as unknown as Array<{
          value: string;
        }>;
        expect(Array.isArray(values)).toBe(true);
        expect(values[0].value).toBe('All');
        const brandNames = values.map((v) => v.value);
        expect(brandNames).toContain('Brahma');
        expect(brandNames).toContain('Skol');
        expect(brandNames).toContain('Antarctica');
        expect(values).toHaveLength(4);
      });

      it('should return enabled true for Global + Portfolio/BPS (UI controls visibility)', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'power',
          {
            brand_filter_groupings: 'Portfolio',
            zone: 'ABI',
            country: 'ABI',
          },
        );

        expect(result.brands.enabled).toBe(true);
      });

      it('should return empty values but enabled true for Global Brands classification', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'Global Brands',
          },
        );

        expect(result.brands.values).toEqual([]);
        expect(result.brands.enabled).toBe(true);
      });

      it('should enrich mapped brands with image metadata from brand_assets', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'All Brands',
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.brands.values as unknown as Array<{
          value: string;
          image_url?: string;
        }>;
        const brahma = values.find((v) => v.value === 'Brahma');
        expect(brahma?.image_url).toBe(
          'https://cdn.example.com/brands/brahma-square.png',
        );
      });

      it('should support pipe-delimited keys from backend brand_assets', () => {
        const data = createMockData();
        (data.performance_tool.kpi.volume.relations.brand_assets as any) = {
          ...data.performance_tool.kpi.volume.relations.brand_assets,
          'Skol|Skol Puro Malte':
            'https://cdn.example.com/brands/skol-square.png',
        };

        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'All Brands',
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.brands.values as unknown as Array<{
          value: string;
          image_url?: string;
        }>;
        const skol = values.find((v) => v.value === 'Skol');
        expect(skol?.image_url).toBe(
          'https://cdn.example.com/brands/skol-square.png',
        );
      });

      it('should enrich brands from performance_tool global brand_assets fallback', () => {
        const data = createMockData();
        delete (data.performance_tool.kpi.volume.relations as any).brand_assets;
        data.performance_tool.brand_assets = {
          'Skol|Skol Puro Malte':
            'https://cdn.example.com/brands/skol-global-square.png',
        };

        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'All Brands',
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.brands.values as unknown as Array<{
          value: string;
          image_url?: string;
        }>;
        const skol = values.find((v) => v.value === 'Skol');
        expect(skol?.image_url).toBe(
          'https://cdn.example.com/brands/skol-global-square.png',
        );
      });
    });

    describe('Global Brands mapping', () => {
      it('should map global brands when classification is Global Brands', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'Global Brands',
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.global_brands.values as unknown as Array<{
          value: string;
        }>;
        const brandNames = values.map((v) => v.value);
        expect(brandNames).toContain('Budweiser');
        expect(brandNames).toContain('Corona');
        expect(brandNames).toContain('Stella Artois');
        expect(values).toHaveLength(3);
        expect(result.global_brands.enabled).toBe(true);
      });

      it('should return empty values but enabled true for other classifications', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'All Brands',
          },
        );

        expect(result.global_brands.values).toEqual([]);
        expect(result.global_brands.enabled).toBe(true);
      });

      it('should enrich global brands with image metadata', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'Global Brands',
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.global_brands.values as unknown as Array<{
          value: string;
          image_url?: string;
        }>;
        const corona = values.find((v) => v.value === 'Corona');
        expect(corona?.image_url).toBe(
          'https://cdn.example.com/brands/corona-square.png',
        );
      });
    });

    describe('Portfolios mapping', () => {
      it('should map portfolios when classification is Portfolio', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'Portfolio',
          },
        );

        const values = result.portfolios.values as Array<{ value: string }>;
        expect(values.length).toBeGreaterThan(0);
        expect(values[0].value).toBe('All');
      });

      it('should return empty values but enabled true for other classifications', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'All Brands',
          },
        );

        expect(result.portfolios.values).toEqual([]);
        expect(result.portfolios.enabled).toBe(true);
      });

      it('should have "All" as default', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'Portfolio',
          },
        );

        expect(result.portfolios.default).toEqual({
          value: 'All',
          label: 'All',
        });
      });

      it('should only include portfolios available for the selected country', () => {
        const data = createMockData({
          kpi: {
            volume: {
              brands_classification: ['All Brands', 'Portfolio'],
              periods: {
                values: [{ value: 'YTD', label: 'YTD' }],
                default: { value: 'YTD', label: 'YTD' },
              },
              relations: {
                zone_countries: { ABI: 'BRA|COL', SAZ: 'BRA', MAZ: 'COL' },
                brand_classification: {
                  'All Brands': { ABI: 'Brahma', BRA: 'Brahma', COL: 'Aguila' },
                  Portfolio: {
                    Megabrands: {
                      brands: { ABI: 'Budweiser', BRA: 'Brahma' },
                      subbrands: {},
                    },
                    Expansion: {
                      brands: { ABI: 'Stella Artois' },
                      subbrands: {},
                    },
                    Sustain: {
                      brands: { ABI: 'Skol', BRA: 'Antarctica' },
                      subbrands: {},
                    },
                  },
                },
                subbrands: {
                  country_subbrands: {},
                  brand_country_subbrands: {},
                },
              },
            },
          },
        });

        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'Portfolio',
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.portfolios.values as Array<{ value: string }>;
        const names = values.map((v) => v.value);
        expect(names).toContain('All');
        expect(names).toContain('Megabrands');
        expect(names).toContain('Sustain');
        expect(names).not.toContain('Expansion');
      });
    });

    describe('Beer Price Segment mapping', () => {
      it('should only include beer price segments available for the selected country', () => {
        const data = createMockData({
          kpi: {
            volume: {
              brands_classification: ['All Brands', 'Beer Price Segment'],
              periods: {
                values: [{ value: 'YTD', label: 'YTD' }],
                default: { value: 'YTD', label: 'YTD' },
              },
              relations: {
                zone_countries: { ABI: 'BRA|COL', SAZ: 'BRA', MAZ: 'COL' },
                brand_classification: {
                  'All Brands': { ABI: 'Brahma', BRA: 'Brahma' },
                  'Beer Price Segment': {
                    Premium: { ABI: 'Budweiser', BRA: 'Budweiser' },
                    'Super Premium': { ABI: 'Corona' },
                    Core: { ABI: 'Brahma', BRA: 'Brahma' },
                  },
                },
                subbrands: {
                  country_subbrands: {},
                  brand_country_subbrands: {},
                },
              },
            },
          },
        });

        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            brand_filter_groupings: 'Beer Price Segment',
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.beer_price_segment.values as Array<{
          value: string;
        }>;
        const names = values.map((v) => v.value);
        expect(names).toContain('All');
        expect(names).toContain('Premium');
        expect(names).toContain('Core');
        expect(names).not.toContain('Super Premium');
      });
    });

    describe('Sub Brands mapping', () => {
      it('should map sub brands for non-global countries', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.sub_brands.values as Array<{ value: string }>;
        expect(values).toHaveLength(3);
        const subBrandNames = values.map((v) => v.value);
        expect(subBrandNames).toContain('Brahma Chopp');
        expect(subBrandNames).toContain('Brahma Extra');
        expect(subBrandNames).toContain('Skol Puro Malte');
        expect(result.sub_brands.enabled).toBe(true);
      });

      it('should return enabled true for global view (UI controls visibility)', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            zone: 'ABI',
            country: 'ABI',
          },
        );

        expect(result.sub_brands.enabled).toBe(true);
      });

      it('should return sub brands list without "All" option', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            zone: 'SAZ',
            country: 'BRA',
          },
        );

        const values = result.sub_brands.values as Array<{ value: string }>;
        const hasAll = values.some((v) => v.value === 'All');
        expect(hasAll).toBe(false);
      });

      it('should map sub brands for a specific brand using brand_country_subbrands', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            zone: 'SAZ',
            country: 'BRA',
            brands: 'Brahma',
          },
        );

        const values = result.sub_brands.values as Array<{ value: string }>;
        expect(values).toHaveLength(2);
        const subBrandNames = values.map((v) => v.value);
        expect(subBrandNames).toContain('Brahma Chopp');
        expect(subBrandNames).toContain('Brahma Extra');
      });

      it('should map sub brands from global_brand_country_subbrands when available', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            zone: 'SAZ',
            country: 'BRA',
            brands: 'Corona',
          },
        );

        const values = result.sub_brands.values as Array<{ value: string }>;
        expect(values).toHaveLength(2);
        const subBrandNames = values.map((v) => v.value);
        expect(subBrandNames).toContain('Corona Extra');
        expect(subBrandNames).toContain('Corona Cero');
      });

      it('should enrich sub-brands with image metadata from brand_assets', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            zone: 'SAZ',
            country: 'BRA',
            brands: 'Brahma',
          },
        );

        const values = result.sub_brands.values as Array<{
          value: string;
          image_url?: string;
        }>;
        const brahmaChopp = values.find((v) => v.value === 'Brahma Chopp');
        expect(brahmaChopp?.image_url).toBe(
          'https://cdn.example.com/subbrands/brahma-chopp.png',
        );
      });

      it('should enrich sub-brands from performance_tool brand_assets fallback', () => {
        const data = createMockData();
        delete (data.performance_tool.kpi.volume.relations as any).brand_assets;
        data.performance_tool.brand_assets = {
          'Brahma|Brahma Chopp':
            'https://cdn.example.com/brands/brahma-global-square.png',
        };
        (data.performance_tool.kpi.volume.relations.brand_assets as any) = {
          ...(data.performance_tool.kpi.volume.relations.brand_assets || {}),
        };

        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            zone: 'SAZ',
            country: 'BRA',
            brands: 'Brahma',
          },
        );

        const values = result.sub_brands.values as Array<{
          value: string;
          image_url?: string;
        }>;
        const brahmaChopp = values.find((v) => v.value === 'Brahma Chopp');
        expect(brahmaChopp?.image_url).toBe(
          'https://cdn.example.com/brands/brahma-global-square.png',
        );
      });
    });

    describe('Periods mapping', () => {
      it('should map periods from KPI data', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        const values = result.periods.values as Array<{ value: string }>;
        expect(values.length).toBeGreaterThan(0);
      });

      it('should use backend default period', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        expect(result.periods.default).toEqual({ value: 'YTD', label: 'YTD' });
      });

      it('should fallback to first period if no default', () => {
        const data = createMockData();
        data.performance_tool.kpi.volume.periods = {
          values: [{ value: 'L3M', label: 'L3M' }],
          default: null as any,
        };
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
        );

        expect(result.periods.default).toEqual({ value: 'L3M', label: 'L3M' });
      });
    });

    describe('Applied Filters', () => {
      it('should respect applied filters when transforming', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            zone: 'SAZ',
            country: 'BRA',
            brand_filter_groupings: 'Portfolio',
          },
        );

        expect(result.portfolios.enabled).toBe(true);
        const portfolioValues = result.portfolios.values as Array<{
          value: string;
        }>;
        expect(portfolioValues.length).toBeGreaterThan(0);
      });

      it('should use selectedKpi over appliedFilters.kpis', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'power',
          {
            kpis: 'volume',
          },
        );

        expect(result.growth_levers.enabled).toBe(false);
      });
    });

    describe('Complex scenarios', () => {
      it('should handle complete transformation with all fields', () => {
        const data = createMockData();
        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'volume',
          {
            zone: 'SAZ',
            country: 'BRA',
            brand_filter_groupings: 'All Brands',
            brands: 'Brahma',
          },
        );

        expect(result.kpis).toBeDefined();
        expect(result.growth_levers).toBeDefined();
        expect(result.zones).toBeDefined();
        expect(result.country).toBeDefined();
        expect(result.brand_filter_groupings).toBeDefined();
        expect(result.brands).toBeDefined();
        expect(result.sub_brands).toBeDefined();
        expect(result.periods).toBeDefined();
      });

      it('should return empty flat structure with enabled true when kpiData is null', () => {
        const data = {
          kpis: {
            default: { value: 'volume', label: 'Volume', full: '' },
            values: [{ value: 'volume', label: 'Volume', full: '' }],
            enabled: true,
          },
          performance_tool: {
            zones: [],
            countries: [],
            kpi: {},
          },
        };

        const result = PerformanceToolFilterDataTransformer.transform(
          data,
          'unknown_kpi',
        );

        expect(result.kpis.enabled).toBe(true);
        expect(result.zones.enabled).toBe(true);
        expect(result.country.enabled).toBe(true);
        expect(result.brands.enabled).toBe(true);
        expect(result.sub_brands.enabled).toBe(true);
        expect(result.global_brands.enabled).toBe(true);
        expect(result.portfolios.enabled).toBe(true);
        expect(result.beer_price_segment.enabled).toBe(true);
        expect(result.periods.enabled).toBe(true);

        expect(result.growth_levers.enabled).toBe(false);
      });
    });
  });

  describe('buildSubBrandToBrandMap', () => {
    it('should map sub-brands to parent brands from brand_country_subbrands', () => {
      const data = createMockData();
      const map = PerformanceToolFilterDataTransformer.buildSubBrandToBrandMap(
        data,
        'volume',
        { zone: 'SAZ', country: 'BRA' },
      );

      expect(map['Brahma Chopp']).toBe('Brahma');
      expect(map['Brahma Extra']).toBe('Brahma');
    });

    it('should map sub-brands from global_brand_country_subbrands', () => {
      const data = createMockData();
      const map = PerformanceToolFilterDataTransformer.buildSubBrandToBrandMap(
        data,
        'volume',
        { zone: 'SAZ', country: 'BRA' },
      );

      expect(map['Corona Extra']).toBe('Corona');
      expect(map['Corona Cero']).toBe('Corona');
    });

    it('should include mappings from both global and regular brand_country_subbrands', () => {
      const data = createMockData();
      const map = PerformanceToolFilterDataTransformer.buildSubBrandToBrandMap(
        data,
        'volume',
        { zone: 'SAZ', country: 'BRA' },
      );

      expect(map['Brahma Chopp']).toBe('Brahma');
      expect(map['Corona Extra']).toBe('Corona');
      expect(Object.keys(map).length).toBe(4);
    });

    it('should resolve sub-brands from growth lever context when active', () => {
      const data = createMockData();
      const map = PerformanceToolFilterDataTransformer.buildSubBrandToBrandMap(
        data,
        'volume',
        {
          zone: 'SAZ',
          country: 'BRA',
          growth_levers: 'Superior Core',
        },
      );

      expect(Object.keys(map).length).toBe(0);
    });

    it('should return empty map for invalid data', () => {
      const map = PerformanceToolFilterDataTransformer.buildSubBrandToBrandMap(
        {},
        'volume',
      );

      expect(map).toEqual({});
    });

    it('should return empty map when data is null', () => {
      const map = PerformanceToolFilterDataTransformer.buildSubBrandToBrandMap(
        null,
        'volume',
      );

      expect(map).toEqual({});
    });

    it('should map sub-brands for a different country', () => {
      const data = createMockData();
      const map = PerformanceToolFilterDataTransformer.buildSubBrandToBrandMap(
        data,
        'volume',
        { zone: 'MAZ', country: 'COL' },
      );

      expect(map['Aguila Light']).toBe('Aguila');
      expect(map['Aguila Cero']).toBe('Aguila');
    });
  });
});
