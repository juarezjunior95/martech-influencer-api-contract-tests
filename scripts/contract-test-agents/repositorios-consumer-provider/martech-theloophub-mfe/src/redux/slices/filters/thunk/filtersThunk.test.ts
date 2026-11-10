import { configureStore } from '@reduxjs/toolkit';
import { FilterRegistry } from 'domain/Filter';
import * as FilterDataTransformerModule from 'domain/Filter/FilterDataTransformer';
import { PerformanceToolFilterDataTransformer } from 'domain/Filter/FilterDataTransformer';
import { BffService } from 'services';

import { filterSlice } from '../filters';
import { loadFilters } from './filtersThunk';

jest.mock('services', () => ({
  BffService: {
    getInstance: jest.fn(),
  },
}));

jest.spyOn(
  FilterDataTransformerModule.PerformanceToolFilterDataTransformer,
  'transform',
);

type AppStore = ReturnType<typeof configureStore>;

describe('filtersThunk', () => {
  let store: AppStore;
  let mockGetData: jest.Mock;

  const mockFilterData = {
    zones: {
      default: { value: 'LATAM', label: 'LATAM' },
      values: [
        { value: 'LATAM', label: 'LATAM' },
        { value: 'NAZ', label: 'NAZ' },
      ],
      enabled: true,
    },
    country: {
      default: {
        value: 'BR',
        label: 'Brazil',
        growth_levers: [
          { value: 'Growth Lever 1', label: 'Growth Lever 1', disabled: false },
          { value: 'Growth Lever 2', label: 'Growth Lever 2', disabled: false },
        ],
      },
      values: {
        LATAM: [
          {
            value: 'BR',
            label: 'Brazil',
            growth_levers: [
              {
                value: 'Growth Lever 1',
                label: 'Growth Lever 1',
                disabled: false,
              },
              {
                value: 'Growth Lever 2',
                label: 'Growth Lever 2',
                disabled: false,
              },
            ],
          },
          {
            value: 'AR',
            label: 'Argentina',
            growth_levers: [
              {
                value: 'Growth Lever 1',
                label: 'Growth Lever 1',
                disabled: false,
              },
              {
                value: 'Growth Lever 2',
                label: 'Growth Lever 2',
                disabled: false,
              },
            ],
          },
        ],
      },
      enabled: true,
    },
  };

  const mockPerformanceToolData = {
    kpis: {
      default: { value: 'power', label: 'Brand Power', full: 'Brand Power' },
      values: [
        { value: 'power', label: 'Brand Power', full: 'Brand Power' },
        { value: 'volume', label: 'Volume', full: 'Volume' },
      ],
      enabled: true,
    },
    performance_tool: {
      zones: [
        { value: 'ABI', label: 'Global' },
        { value: 'SAZ', label: 'SAZ' },
      ],
      countries: [
        { id: 'ABI', label: 'All', zone: 'ABI' },
        { id: 'BRA', label: 'Brazil', zone: 'SAZ' },
      ],
      kpi: {
        power: {
          brands_classification: ['All Brands'],
          periods: {
            values: [
              { value: '2024', label: '2024' },
              { value: '2023', label: '2023' },
            ],
            default: { value: '2024', label: '2024' },
          },
          relations: {
            zone_countries: { SAZ: 'BRA|ARG' },
            brand_classification: {},
            subbrands: {
              country_subbrands: {},
              brand_country_subbrands: {},
            },
          },
        },
        volume: {
          brands_classification: ['All Brands'],
          periods: {
            values: [
              { value: '2024', label: '2024' },
              { value: '2023', label: '2023' },
            ],
            default: { value: '2024', label: '2024' },
          },
          relations: {
            zone_countries: { SAZ: 'BRA|ARG' },
            brand_classification: {},
            subbrands: {
              country_subbrands: {},
              brand_country_subbrands: {},
            },
          },
        },
      },
    },
    full_year: {
      default: { value: '2025', label: "FY'25" },
      values: [
        { value: '2025', label: "FY'25" },
        { value: '2024', label: "FY'24" },
        { value: '2023', label: "FY'23" },
        { value: '2022', label: "FY'22" },
        { value: '2021', label: "FY'21" },
        { value: '2020', label: "FY'20" },
        { value: '2019', label: "FY'19" },
        { value: '2018', label: "FY'18" },
      ],
      enabled: true,
    },
    product_type: {
      default: { value: 'beer', label: 'Beer' },
      values: [
        { value: 'beer', label: 'Beer' },
        { value: 'beyond-beer', label: 'Beyond Beer' },
        { value: 'beer-beyond-beer', label: 'Beer + Beyond Beer' },
      ],
      enabled: true,
    },
  };

  const mockTransformedData = {
    kpis: {
      default: { value: 'power', label: 'Brand Power' },
      values: [
        { value: 'power', label: 'Brand Power' },
        { value: 'volume', label: 'Volume' },
      ],
      enabled: true,
    },
    zones: {
      default: { value: 'ABI', label: 'Global' },
      values: [
        { value: 'ABI', label: 'Global' },
        { value: 'SAZ', label: 'SAZ' },
      ],
      enabled: true,
    },
    country: {
      default: { value: 'ABI', label: 'All' },
      values: {
        SAZ: [{ value: 'BRA', label: 'Brazil', zone: 'SAZ' }],
      },
      enabled: true,
    },
    periods: {
      default: { value: '2024', label: '2024' },
      values: [
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
      ],
      enabled: true,
    },
    brand_filter_groupings: {
      values: [],
      default: null,
      enabled: false,
    },
    brands: {
      values: [],
      default: null,
      enabled: false,
    },
    sub_brands: {
      values: [],
      default: null,
      enabled: false,
    },
    global_brands: {
      values: [],
      default: null,
      enabled: false,
    },
    portfolios: {
      values: [],
      default: null,
      enabled: false,
    },
    beer_price_segment: {
      values: [],
      default: null,
      enabled: false,
    },
    growth_levers: {
      values: [],
      default: null,
      enabled: false,
    },
  };

  const mockBffOk = (data: Record<string, unknown>) => ({
    hasError: false,
    data: { data },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();

    mockGetData = jest.fn();
    (BffService.getInstance as jest.Mock).mockReturnValue({
      getData: mockGetData,
    });

    store = configureStore({
      reducer: {
        filters: filterSlice.reducer,
      },
    });
  });

  describe('loadFilters thunk', () => {
    it('should load filters successfully via the BFF preset endpoint', async () => {
      mockGetData.mockResolvedValue(mockBffOk(mockFilterData));

      await store.dispatch<any>(
        loadFilters({
          pageName: 'page1',
        }),
      );

      expect(mockGetData).toHaveBeenCalledWith({
        endpoint: `/presets/page1`,
        params: {},
      });

      const state = (store.getState() as any).filters;
      expect(state.pages.page1.status).toBe('loaded');
      expect(state.pages.page1.dataFilters).toEqual(mockFilterData);
    });

    it('should return cached when the page is already loaded', async () => {
      store = configureStore({
        reducer: { filters: filterSlice.reducer },
        preloadedState: {
          filters: {
            pages: {
              page1: {
                status: 'loaded' as const,
                applied: {} as any,
                dataFilters: mockFilterData as any,
                rawData: mockFilterData as any,
                form: {} as any,
                defaults: {} as any,
              },
            },
          } as any,
        },
      });

      await store.dispatch<any>(
        loadFilters({
          pageName: 'page1',
        }),
      );

      expect(mockGetData).not.toHaveBeenCalled();
    });

    it('should handle BFF error response', async () => {
      mockGetData.mockResolvedValue({
        hasError: true,
        message: 'API Error',
      });

      await store.dispatch<any>(
        loadFilters({
          pageName: 'page1',
        }),
      );

      const state = (store.getState() as any).filters;
      expect(state.pages.page1.status).toBe('error');
    });

    it('should handle network error', async () => {
      mockGetData.mockRejectedValue(new Error('Network error'));

      await store.dispatch<any>(
        loadFilters({
          pageName: 'page1',
        }),
      );

      const state = (store.getState() as any).filters;
      expect(state.pages.page1.status).toBe('error');
    });

    it('should set status to loading while fetching', () => {
      mockGetData.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      store.dispatch<any>(
        loadFilters({
          pageName: 'page1',
        }),
      );

      const state = (store.getState() as any).filters;
      expect(state.pages.page1.status).toBe('loading');
    });
  });

  describe('Performance Tool filters', () => {
    let getCalculatorOriginal: (
      key: string,
    ) => ReturnType<FilterRegistry['getCalculator']>;

    beforeAll(() => {
      const registry = FilterRegistry.getInstance();
      getCalculatorOriginal = registry.getCalculator.bind(registry);
    });

    beforeEach(() => {
      sessionStorage.setItem('performance_tool_default_kpi', 'power');

      (
        FilterDataTransformerModule.PerformanceToolFilterDataTransformer
          .transform as jest.Mock
      ).mockReturnValue(mockTransformedData);

      const registry = FilterRegistry.getInstance();
      jest.spyOn(registry, 'getCalculator').mockImplementation((key) => {
        if (key === 'value_creation_growth_levers') {
          return () => null;
        }
        return getCalculatorOriginal(key);
      });
    });

    it('should transform performance_tool data when present in the BFF response', async () => {
      mockGetData.mockResolvedValue(mockBffOk(mockPerformanceToolData));

      await store.dispatch<any>(
        loadFilters({
          pageName: 'performanceTool',
        }),
      );

      const state = (store.getState() as any).filters;
      expect(state.pages.performanceTool.status).toBe('loaded');

      expect(
        FilterDataTransformerModule.PerformanceToolFilterDataTransformer
          .transform,
      ).toHaveBeenCalledWith(mockPerformanceToolData, 'power', {});

      expect(state.pages.performanceTool.dataFilters).toEqual(
        mockTransformedData,
      );
      expect(state.pages.performanceTool.rawData).toEqual(
        mockPerformanceToolData,
      );
    });

    it('should prefer the sessionStorage default KPI over applied filters and forward applied filters to the transformer', async () => {
      store = configureStore({
        reducer: { filters: filterSlice.reducer },
        preloadedState: {
          filters: {
            pages: {
              performanceTool: {
                status: 'idle' as const,
                applied: { kpis: 'volume' } as any,
                dataFilters: {} as any,
                rawData: {} as any,
              },
            },
          } as any,
        },
      });

      mockGetData.mockResolvedValue(mockBffOk(mockPerformanceToolData));

      await store.dispatch<any>(
        loadFilters({
          pageName: 'performanceTool',
        }),
      );

      expect(
        FilterDataTransformerModule.PerformanceToolFilterDataTransformer
          .transform,
      ).toHaveBeenCalledWith(mockPerformanceToolData, 'power', {
        kpis: 'volume',
      });
    });

    it('should use default KPI from sessionStorage when no applied filter exists', async () => {
      mockGetData.mockResolvedValue(mockBffOk(mockPerformanceToolData));

      await store.dispatch<any>(
        loadFilters({
          pageName: 'performanceTool',
        }),
      );

      expect(
        FilterDataTransformerModule.PerformanceToolFilterDataTransformer
          .transform,
      ).toHaveBeenCalledWith(mockPerformanceToolData, 'power', {});

      const state = (store.getState() as any).filters;
      expect(state.pages.performanceTool.status).toBe('loaded');
    });

    it('should not transform when performance_tool is absent from the response', async () => {
      mockGetData.mockResolvedValue(mockBffOk(mockFilterData));

      await store.dispatch<any>(
        loadFilters({
          pageName: 'regularPage',
        }),
      );

      expect(
        FilterDataTransformerModule.PerformanceToolFilterDataTransformer
          .transform,
      ).not.toHaveBeenCalled();

      const state = (store.getState() as any).filters;
      expect(state.pages.regularPage.dataFilters).toEqual(mockFilterData);
    });

    it('should normalize KPI values to lowercase', async () => {
      sessionStorage.setItem('performance_tool_default_kpi', 'POWER');

      const dataWithUppercaseKpi = {
        kpis: {
          default: {
            value: 'POWER',
            label: 'Brand Power',
            full: 'Brand Power',
          },
          values: [
            { value: 'POWER', label: 'Brand Power', full: 'Brand Power' },
            { value: 'VOLUME', label: 'Volume', full: 'Volume' },
          ],
          enabled: true,
        },
        performance_tool: {
          kpis_filter: [
            { label: 'Brand Power', value: 'POWER' },
            { label: 'Volume', value: 'VOLUME' },
          ],
        },
      };

      mockGetData.mockResolvedValue(mockBffOk(dataWithUppercaseKpi));

      await store.dispatch<any>(
        loadFilters({
          pageName: 'performance-tool',
        }),
      );

      expect(
        PerformanceToolFilterDataTransformer.transform,
      ).toHaveBeenCalledWith(dataWithUppercaseKpi, 'power', {});
    });
  });
});
