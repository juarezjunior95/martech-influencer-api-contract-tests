import { renderHook } from '@testing-library/react-hooks';
import { UseBffDataResponse } from 'hooks/useBffData/useBffData';

import { usePerformanceToolData } from './usePerformanceToolData';

describe('usePerformanceToolData', () => {
  const mockResponse: UseBffDataResponse = {
    data: {
      'overtime-performance': [{ header: { title: 'Test' }, data: [] }],
      'overtime-trends': { legend: [], lineChart: {}, barChart: {} },
      contribution: { large: {}, small: {} },
    },
    loading: false,
    error: null,
    refetch: jest.fn(),
  };

  describe('Hook Initialization', () => {
    it('should return empty object when response is undefined', () => {
      const { result } = renderHook(() =>
        usePerformanceToolData(['overtime-performance']),
      );

      expect(result.current['overtime-performance']).toBeUndefined();
    });

    it('should return empty object when response has no data', () => {
      const emptyResponse: UseBffDataResponse = {
        data: {},
        loading: false,
        error: null,
        refetch: jest.fn(),
      };

      const { result } = renderHook(() =>
        usePerformanceToolData(['overtime-performance'], emptyResponse),
      );

      expect(result.current['overtime-performance']).toBeNull();
    });
  });

  describe('Data Extraction', () => {
    it('should extract overtime-performance data correctly', () => {
      const { result } = renderHook(() =>
        usePerformanceToolData(['overtime-performance'], mockResponse),
      );

      expect(result.current['overtime-performance']).toEqual(
        mockResponse.data['overtime-performance'],
      );
    });

    it('should extract overtime-trends data correctly', () => {
      const { result } = renderHook(() =>
        usePerformanceToolData(['overtime-trends'], mockResponse),
      );

      expect(result.current['overtime-trends']).toEqual(
        mockResponse.data['overtime-trends'],
      );
    });

    it('should extract contribution data correctly', () => {
      const { result } = renderHook(() =>
        usePerformanceToolData(['contribution'], mockResponse),
      );

      expect(result.current['contribution']).toEqual(
        mockResponse.data['contribution'],
      );
    });

    it('should extract multiple components at once', () => {
      const { result } = renderHook(() =>
        usePerformanceToolData(
          ['overtime-performance', 'overtime-trends', 'contribution'],
          mockResponse,
        ),
      );

      expect(result.current['overtime-performance']).toEqual(
        mockResponse.data['overtime-performance'],
      );
      expect(result.current['overtime-trends']).toEqual(
        mockResponse.data['overtime-trends'],
      );
      expect(result.current['contribution']).toEqual(
        mockResponse.data['contribution'],
      );
    });
  });

  describe('Missing Components', () => {
    it('should return null for non-existent component id', () => {
      const partialResponse: UseBffDataResponse = {
        data: {
          'overtime-performance': [{ header: { title: 'Test' }, data: [] }],
        },
        loading: false,
        error: null,
        refetch: jest.fn(),
      };

      const { result } = renderHook(() =>
        usePerformanceToolData(
          ['overtime-performance', 'overtime-trends'],
          partialResponse,
        ),
      );

      expect(result.current['overtime-performance']).toBeDefined();
      expect(result.current['overtime-trends']).toBeNull();
    });
  });

  describe('Memoization', () => {
    it('should return same reference when inputs do not change', () => {
      const ids: (
        'overtime-performance' | 'overtime-trends' | 'contribution'
      )[] = ['overtime-performance'];

      const { result, rerender } = renderHook(() =>
        usePerformanceToolData(ids, mockResponse),
      );

      const firstResult = result.current;

      rerender();

      expect(result.current).toBe(firstResult);
    });

    it('should update when response changes', () => {
      const ids: (
        'overtime-performance' | 'overtime-trends' | 'contribution'
      )[] = ['overtime-performance'];

      const { result, rerender } = renderHook(
        ({ response }) => usePerformanceToolData(ids, response),
        { initialProps: { response: mockResponse } },
      );

      const firstResult = result.current['overtime-performance'];

      const newResponse: UseBffDataResponse = {
        data: {
          'overtime-performance': [{ header: { title: 'Updated' }, data: [] }],
        },
        loading: false,
        error: null,
        refetch: jest.fn(),
      };

      rerender({ response: newResponse });

      expect(result.current['overtime-performance']).not.toBe(firstResult);
      expect(result.current['overtime-performance']).toEqual(
        newResponse.data['overtime-performance'],
      );
    });
  });
});
