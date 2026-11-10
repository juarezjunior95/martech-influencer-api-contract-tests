import { Api } from 'Api';

import {
  BffComponent,
  BffNormalizedData,
  BffResponse,
  BffService,
} from './BffService';

jest.mock('Api', () => ({
  Api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApi = Api as jest.Mocked<typeof Api>;

describe('BffService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (BffService as any).instance = undefined;
    localStorage.removeItem('bffUrl');
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = BffService.getInstance();
      const instance2 = BffService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should create a new instance if none exists', () => {
      const instance = BffService.getInstance();

      expect(instance).toBeInstanceOf(BffService);
    });
  });

  describe('getUrl', () => {
    it('should build URL with only apiPrefix and endpoint', () => {
      const service = BffService.getInstance();
      const endpoint = '/views/sample-view';

      const url = (service as any).getUrl(endpoint);

      expect(url).toBe('/api/martech-oneway-reports-bff/v1/views/sample-view');
    });

    it('should handle empty endpoint', () => {
      const service = BffService.getInstance();

      const url = (service as any).getUrl('');

      expect(url).toBe('/api/martech-oneway-reports-bff/v1');
    });

    it('should handle complex endpoint paths', () => {
      const service = BffService.getInstance();
      const endpoint = '/views/brand-analysis/overview';

      const url = (service as any).getUrl(endpoint);

      expect(url).toBe(
        '/api/martech-oneway-reports-bff/v1/views/brand-analysis/overview',
      );
    });

    it('should use bffUrl from localStorage when set', () => {
      localStorage.setItem('bffUrl', 'http://localhost:3030/v1');
      const service = BffService.getInstance();

      const url = (service as any).getUrl('/views/sample-view');

      expect(url).toBe('http://localhost:3030/v1/views/sample-view');
    });

    it('should fall back to default URL when localStorage bffUrl is not set', () => {
      localStorage.removeItem('bffUrl');
      const service = BffService.getInstance();

      const url = (service as any).getUrl('/views/test');

      expect(url).toBe('/api/martech-oneway-reports-bff/v1/views/test');
    });
  });

  describe('normalizeParams', () => {
    it('should transform params to filter format', () => {
      const service = BffService.getInstance();
      const params = { country: 'BR', brand: 'Skol' };

      const result = (service as any).normalizeParams(params);

      expect(result).toEqual({
        'filter[country]': 'BR',
        'filter[brand]': 'Skol',
      });
    });

    it('should handle single param', () => {
      const service = BffService.getInstance();
      const params = { timeframe: '2024' };

      const result = (service as any).normalizeParams(params);

      expect(result).toEqual({
        'filter[timeframe]': '2024',
      });
    });

    it('should handle empty params', () => {
      const service = BffService.getInstance();
      const params = {};

      const result = (service as any).normalizeParams(params);

      expect(result).toEqual({});
    });

    it('should handle params with array values', () => {
      const service = BffService.getInstance();
      const params = { countries: ['BR', 'US', 'MX'] };

      const result = (service as any).normalizeParams(params);

      expect(result).toEqual({
        'filter[countries]': ['BR', 'US', 'MX'],
      });
    });

    it('should handle params with numeric values', () => {
      const service = BffService.getInstance();
      const params = { year: 2024, month: 12 };

      const result = (service as any).normalizeParams(params);

      expect(result).toEqual({
        'filter[year]': 2024,
        'filter[month]': 12,
      });
    });

    it('should handle params with null/undefined values', () => {
      const service = BffService.getInstance();
      const params = { active: null, inactive: undefined };

      const result = (service as any).normalizeParams(params);

      expect(result).toEqual({
        'filter[active]': null,
        'filter[inactive]': undefined,
      });
    });
  });

  describe('normalizeResponse', () => {
    it('should normalize response with multiple components', () => {
      const response: BffResponse = {
        view: 'sample-view',
        components: [
          { id: 'volume', type: 'chart', data: { value: 100 } },
          { id: 'revenue', type: 'card', data: { value: 500 } },
        ],
      };

      const result = BffService.normalizeResponse(response);

      expect(result).toEqual({
        volume: { value: 100 },
        revenue: { value: 500 },
      });
    });

    it('should normalize response with single component', () => {
      const response: BffResponse = {
        view: 'test',
        components: [{ id: 'single', type: 'table', data: { rows: [] } }],
      };

      const result = BffService.normalizeResponse(response);

      expect(result).toEqual({
        single: { rows: [] },
      });
    });

    it('should return empty object for empty components', () => {
      const response: BffResponse = {
        view: 'empty',
        components: [],
      };

      const result = BffService.normalizeResponse(response);

      expect(result).toEqual({});
    });

    it('should handle complex data structures', () => {
      const response: BffResponse = {
        view: 'complex',
        components: [
          {
            id: 'chart',
            type: 'bar',
            data: {
              labels: ['Jan', 'Feb', 'Mar'],
              datasets: [{ values: [10, 20, 30] }],
              metadata: { source: 'BFF' },
            },
          },
        ],
      };

      const result = BffService.normalizeResponse(response);

      expect(result).toEqual({
        chart: {
          labels: ['Jan', 'Feb', 'Mar'],
          datasets: [{ values: [10, 20, 30] }],
          metadata: { source: 'BFF' },
        },
      });
    });

    it('should preserve component data exactly as provided', () => {
      const componentData = { nested: { deep: { value: 42 } } };
      const response: BffResponse = {
        view: 'test',
        components: [{ id: 'test', type: 'custom', data: componentData }],
      };

      const result = BffService.normalizeResponse(response);

      expect(result.test).toBe(componentData);
    });
  });

  describe('getData', () => {
    it('should call get with normalized params', async () => {
      mockApi.get.mockResolvedValue({ data: 'test' });
      const service = BffService.getInstance();

      await service.getData({
        endpoint: '/views/sample-view',
        params: { country: 'BR', brand: 'Skol' },
      });

      expect(mockApi.get).toHaveBeenCalledWith({
        url: '/api/martech-oneway-reports-bff/v1/views/sample-view',
        config: {
          params: {
            'filter[country]': 'BR',
            'filter[brand]': 'Skol',
          },
          signal: undefined,
        },
      });
    });

    it('should pass AbortSignal to get method', async () => {
      mockApi.get.mockResolvedValue({ data: 'test' });
      const service = BffService.getInstance();
      const controller = new AbortController();

      await service.getData({
        endpoint: '/views/test',
        params: { id: '123' },
        signal: controller.signal,
      });

      expect(mockApi.get).toHaveBeenCalledWith({
        url: '/api/martech-oneway-reports-bff/v1/views/test',
        config: {
          params: { 'filter[id]': '123' },
          signal: controller.signal,
        },
      });
    });

    it('should return API response', async () => {
      const mockResponse = {
        data: {
          view: 'test',
          components: [{ id: 'comp1', type: 'chart', data: {} }],
        },
      };
      mockApi.get.mockResolvedValue(mockResponse);
      const service = BffService.getInstance();

      const result = await service.getData({
        endpoint: 'test',
        params: {},
      });

      expect(result).toEqual(mockResponse);
    });

    it('should handle empty params', async () => {
      mockApi.get.mockResolvedValue({ data: 'test' });
      const service = BffService.getInstance();

      await service.getData({
        endpoint: '/views/test',
        params: {},
      });

      expect(mockApi.get).toHaveBeenCalledWith({
        url: '/api/martech-oneway-reports-bff/v1/views/test',
        config: {
          params: {},
          signal: undefined,
        },
      });
    });

    it('should handle API errors', async () => {
      const errorResponse = { hasError: true, message: 'Server error' };
      mockApi.get.mockResolvedValue(errorResponse);
      const service = BffService.getInstance();

      const result = await service.getData({
        endpoint: 'test',
        params: { id: '1' },
      });

      expect(result).toEqual(errorResponse);
    });

    it('should send params as-is when endpoint targets /presets/*', async () => {
      mockApi.get.mockResolvedValue({ data: 'test' });
      const service = BffService.getInstance();

      await service.getData({
        endpoint: '/presets/sub-filters_kpis',
        params: { 'kpis[kpi_groups]': 'innovation' },
      });

      expect(mockApi.get).toHaveBeenCalledWith({
        url: '/api/martech-oneway-reports-bff/v1/presets/sub-filters_kpis',
        config: {
          params: { 'kpis[kpi_groups]': 'innovation' },
          signal: undefined,
        },
      });
    });

    it('should keep wrapping params for /views/* endpoints', async () => {
      mockApi.get.mockResolvedValue({ data: 'test' });
      const service = BffService.getInstance();

      await service.getData({
        endpoint: '/views/test',
        params: { country: 'BR' },
      });

      expect(mockApi.get).toHaveBeenCalledWith({
        url: '/api/martech-oneway-reports-bff/v1/views/test',
        config: {
          params: { 'filter[country]': 'BR' },
          signal: undefined,
        },
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in params values', async () => {
      mockApi.get.mockResolvedValue({ data: 'test' });
      const service = BffService.getInstance();

      await service.getData({
        endpoint: '/views/test',
        params: { query: 'test&value=1', name: 'A&B' },
      });

      expect(mockApi.get).toHaveBeenCalledWith({
        url: '/api/martech-oneway-reports-bff/v1/views/test',
        config: {
          params: {
            'filter[query]': 'test&value=1',
            'filter[name]': 'A&B',
          },
          signal: undefined,
        },
      });
    });

    it('should handle params with object values', async () => {
      mockApi.get.mockResolvedValue({ data: 'test' });
      const service = BffService.getInstance();
      const complexParam = { nested: { key: 'value' } };

      await service.getData({
        endpoint: '/views/test',
        params: { complex: complexParam },
      });

      expect(mockApi.get).toHaveBeenCalledWith({
        url: '/api/martech-oneway-reports-bff/v1/views/test',
        config: {
          params: { 'filter[complex]': complexParam },
          signal: undefined,
        },
      });
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle typical view request with multiple filters', async () => {
      const mockBffResponse: BffResponse = {
        view: 'sample-view',
        components: [
          { id: 'volume-kpi', type: 'kpi', data: { value: 1000, trend: 5 } },
          { id: 'revenue-kpi', type: 'kpi', data: { value: 50000, trend: -2 } },
          {
            id: 'chart-data',
            type: 'chart',
            data: { series: [{ name: 'Sales', data: [1, 2, 3] }] },
          },
        ],
      };
      mockApi.get.mockResolvedValue({ data: mockBffResponse });
      const service = BffService.getInstance();

      await service.getData({
        endpoint: '/views/sample-view',
        params: {
          country: 'BR',
          zone: 'SAZ',
          timeframe: '2024',
          brand: 'Brahma',
        },
      });

      expect(mockApi.get).toHaveBeenCalledWith({
        url: '/api/martech-oneway-reports-bff/v1/views/sample-view',
        config: {
          params: {
            'filter[country]': 'BR',
            'filter[zone]': 'SAZ',
            'filter[timeframe]': '2024',
            'filter[brand]': 'Brahma',
          },
          signal: undefined,
        },
      });

      const normalized = BffService.normalizeResponse(mockBffResponse);
      expect(normalized).toEqual({
        'volume-kpi': { value: 1000, trend: 5 },
        'revenue-kpi': { value: 50000, trend: -2 },
        'chart-data': { series: [{ name: 'Sales', data: [1, 2, 3] }] },
      });
    });

    it('should handle request cancellation', async () => {
      const controller = new AbortController();
      mockApi.get.mockResolvedValue({ data: 'test' });
      const service = BffService.getInstance();

      controller.abort();

      await service.getData({
        endpoint: 'test',
        params: { id: '1' },
        signal: controller.signal,
      });

      expect(mockApi.get).toHaveBeenCalledWith(
        expect.objectContaining({
          config: expect.objectContaining({
            signal: controller.signal,
          }),
        }),
      );
    });
  });

  describe('Interface Types', () => {
    it('should correctly type BffComponent', () => {
      const component: BffComponent = {
        id: 'test-id',
        type: 'chart',
        data: { value: 100 },
      };

      expect(component.id).toBe('test-id');
      expect(component.type).toBe('chart');
      expect(component.data).toEqual({ value: 100 });
    });

    it('should correctly type BffResponse', () => {
      const response: BffResponse = {
        view: 'test-view',
        components: [{ id: 'comp1', type: 'kpi', data: {} }],
      };

      expect(response.view).toBe('test-view');
      expect(response.components).toHaveLength(1);
    });

    it('should correctly type BffNormalizedData', () => {
      const normalized: BffNormalizedData = {
        'kpi-1': { value: 100 },
        'kpi-2': { value: 200, trend: 5 },
      };

      expect(normalized['kpi-1']).toEqual({ value: 100 });
      expect(normalized['kpi-2']).toEqual({ value: 200, trend: 5 });
    });
  });
});
