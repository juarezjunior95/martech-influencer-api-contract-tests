import { waitFor as rtlWaitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import * as contexts from 'contexts';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import * as hooks from 'hooks';
import { BffService } from 'services';
import * as filterUtils from 'utils/filter';

import { useBffData, UseBffDataProps } from './useBffData';

const waitFor: typeof rtlWaitFor = (callback, options) =>
  rtlWaitFor(callback, { interval: 1, timeout: 1000, ...options });

jest.mock('contexts', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
  usePageFilterStatus: jest.fn(),
  usePageFilterData: jest.fn(),
  useLastDataRefresh: jest.fn(),
}));
jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
  usePageFilterStatus: jest.fn(),
  usePageFilterData: jest.fn(),
  useLastDataRefresh: jest.fn(),
}));
jest.mock('services', () => ({
  BffService: {
    getInstance: jest.fn(),
    normalizeResponse: jest.fn(),
  },
}));
jest.mock('utils/filter', () => ({
  normalizeFilters: jest.fn(),
  getViewtype: jest.fn(),
}));
jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(),
  },
}));

describe('useBffData', () => {
  let mockUseCurrentPage: jest.SpyInstance;
  let mockUsePageFilterApplied: jest.SpyInstance;
  let mockUsePageFilterStatus: jest.SpyInstance;
  let mockUsePageFilterData: jest.SpyInstance;
  let mockUseLastDataRefresh: jest.SpyInstance;
  let mockNormalizeFilters: jest.SpyInstance;
  let mockGetViewtype: jest.SpyInstance;
  let mockGetData: jest.Mock;
  let mockNormalizeResponse: jest.Mock;
  let mockFilterDataAccessor: jest.Mocked<FilterDataAccessor>;

  const defaultProps: UseBffDataProps = {
    id: 'test-endpoint',
    kpiGroup: 'power',
    subFilters: null,
    skipMainFilters: false,
    skipRequest: false,
  };

  const mockAppliedFilters = {
    zone: { value: 'LATAM', label: 'LATAM' },
    country: { value: 'BR', label: 'Brazil' },
    time_frame: { value: 'L13W', label: 'Last 13 Weeks' },
  };

  const mockNormalizedFilters = {
    zone: 'LATAM',
    country: 'BR',
    time_frame: 'L13W',
  };

  const mockDataFilters = {
    zones: {
      default: { value: 'LATAM', label: 'LATAM' },
      values: [{ value: 'LATAM', label: 'LATAM' }],
      enabled: true,
    },
    time_frame: {
      default: {
        ini: '2023-09-01',
        end: '2023-12-01',
      },
      values: [{ value: 'L13W', label: 'Last 13 Weeks' }],
      enabled: true,
    },
  };

  const mockBffResponse = {
    hasError: false,
    data: {
      data: [{ id: 1, value: 100 }],
      metadata: {},
    },
  };

  const mockNormalizedData = {
    data: [{ id: 1, value: 100 }],
    metadata: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCurrentPage = jest.spyOn(hooks, 'useCurrentPage');
    mockUsePageFilterApplied = jest.spyOn(hooks, 'usePageFilterApplied');
    mockUsePageFilterStatus = jest.spyOn(hooks, 'usePageFilterStatus');
    mockUsePageFilterData = jest.spyOn(hooks, 'usePageFilterData');
    mockUseLastDataRefresh = jest.spyOn(contexts, 'useLastDataRefresh');
    mockNormalizeFilters = jest.spyOn(filterUtils, 'normalizeFilters');
    mockGetViewtype = jest.spyOn(filterUtils, 'getViewtype');

    mockGetData = jest.fn();
    mockNormalizeResponse = jest.fn();

    // Mock FilterDataAccessor
    mockFilterDataAccessor = {
      getTimeFrame: jest.fn(),
    } as any;

    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue(
      mockFilterDataAccessor,
    );
    mockFilterDataAccessor.getTimeFrame.mockReturnValue('2023-09-01');

    (BffService.getInstance as jest.Mock).mockReturnValue({
      getData: mockGetData,
    });
    (BffService.normalizeResponse as jest.Mock) = mockNormalizeResponse;

    mockUseCurrentPage.mockReturnValue({ currentPage: 'test-page' });
    mockUsePageFilterApplied.mockReturnValue({ applied: mockAppliedFilters });
    mockUsePageFilterStatus.mockReturnValue({ isLoading: false });
    mockUsePageFilterData.mockReturnValue({ dataFilters: mockDataFilters });
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: {
        power: new Date(2023, 11, 1),
      },
      lastDataRefreshKpisDateMonthYear: {
        power: '2023-12-01',
      },
    });
    mockNormalizeFilters.mockReturnValue(mockNormalizedFilters);
    mockGetViewtype.mockReturnValue('country');
    mockGetData.mockResolvedValue(mockBffResponse);
    mockNormalizeResponse.mockReturnValue(mockNormalizedData);
  });

  describe('successful data fetching', () => {
    it('should fetch data successfully with default props', async () => {
      const { result } = renderHook(() => useBffData(defaultProps));

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toEqual(mockNormalizedData);
      expect(result.current.error).toBeNull();
      expect(mockGetData).toHaveBeenCalledWith({
        endpoint: '/views/test-endpoint',
        params: {
          viewtype: 'country',
          zone: 'LATAM',
          country: 'BR',
          time_frame: 'L13W',
          dt_ini: '2023-09-01',
          dt_end: '2023-12-01',
        },
        signal: expect.any(AbortSignal),
      });
    });

    it('should fetch data with subFilters', async () => {
      const subFilters = { brand: 'Brand A', segment: 'Premium' };
      const { result } = renderHook(() =>
        useBffData({ ...defaultProps, subFilters }),
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetData).toHaveBeenCalledWith({
        endpoint: '/views/test-endpoint',
        params: {
          viewtype: 'country',
          zone: 'LATAM',
          country: 'BR',
          time_frame: 'L13W',
          brand: 'Brand A',
          segment: 'Premium',
          dt_ini: '2023-09-01',
          dt_end: '2023-12-01',
        },
        signal: expect.any(AbortSignal),
      });
    });

    it('should use global viewtype when country is ABI', async () => {
      mockNormalizeFilters.mockReturnValue({
        ...mockNormalizedFilters,
        country: 'ABI',
      });
      mockGetViewtype.mockReturnValue('global');

      const { result } = renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetData).toHaveBeenCalledWith(
        expect.objectContaining({
          params: expect.objectContaining({
            viewtype: 'global',
          }),
        }),
      );
    });

    it('should skip main filters when skipMainFilters is true', async () => {
      const subFilters = { brand: 'Brand A' };
      const { result } = renderHook(() =>
        useBffData({ ...defaultProps, skipMainFilters: true, subFilters }),
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetData).toHaveBeenCalledWith({
        endpoint: '/views/test-endpoint',
        params: {
          viewtype: 'country',
          brand: 'Brand A',
          dt_ini: '2023-09-01',
          dt_end: '2023-12-01',
        },
        signal: expect.any(AbortSignal),
      });
    });
  });

  describe('skip request conditions', () => {
    it('should not make request when skipRequest is true', async () => {
      const { result } = renderHook(() =>
        useBffData({ ...defaultProps, skipRequest: true }),
      );

      await waitFor(() => {
        expect(result.current.data).toBe(null);
      });

      expect(mockGetData).not.toHaveBeenCalled();
    });

    it('should not make request when filters are loading', async () => {
      mockUsePageFilterStatus.mockReturnValue({ isLoading: true });

      const { result } = renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });

      expect(mockGetData).not.toHaveBeenCalled();
    });

    it('should not make request when id is empty', async () => {
      const { result } = renderHook(() =>
        useBffData({ ...defaultProps, id: '' }),
      );

      await waitFor(() => {
        expect(result.current.data).toBe(null);
      });

      expect(mockGetData).not.toHaveBeenCalled();
    });

    it('should not make request when dataFilters is null', async () => {
      mockUsePageFilterData.mockReturnValue({ dataFilters: null });

      const { result } = renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(result.current.data).toBe(null);
      });

      expect(mockGetData).not.toHaveBeenCalled();
    });

    it('should not make request when activeFilters is empty', async () => {
      mockNormalizeFilters.mockReturnValue({});

      const { result } = renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(result.current.data).toBe(null);
      });

      expect(mockGetData).not.toHaveBeenCalled();
    });

    it('should not make request when subFilters is empty object', async () => {
      const { result } = renderHook(() =>
        useBffData({ ...defaultProps, subFilters: {} }),
      );

      await waitFor(() => {
        expect(result.current.data).toBe(null);
      });

      expect(mockGetData).not.toHaveBeenCalled();
    });

    it('should not make request when dt_end is not available', async () => {
      mockUseLastDataRefresh.mockReturnValue({
        lastDataRefreshKpisDate: {},
      });

      const { result } = renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(result.current.data).toBe(null);
      });

      expect(mockGetData).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('should handle API error response', async () => {
      mockGetData.mockResolvedValue({
        hasError: true,
        message: 'API Error',
      });

      const { result } = renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(result.current.error).toEqual(new Error('API Error'));
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle API error response without message', async () => {
      mockGetData.mockResolvedValue({
        hasError: true,
      });

      const { result } = renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(result.current.error).toEqual(new Error('Failed to load data'));
      });

      expect(result.current.data).toBeNull();
    });

    it('should handle network error', async () => {
      const networkError = new Error('Network error');
      mockGetData.mockRejectedValue(networkError);

      const { result } = renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toEqual(networkError);
      expect(result.current.data).toBeNull();
    });
  });

  describe('request deduplication', () => {
    it('should not make duplicate requests with same parameters', async () => {
      const { rerender } = renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(mockGetData).toHaveBeenCalledTimes(1);
      });

      rerender();

      await waitFor(() => {
        expect(mockGetData).toHaveBeenCalledTimes(1);
      });
    });

    it('should make new request when parameters change', async () => {
      const { rerender } = renderHook(
        ({ subFilters }) => useBffData({ ...defaultProps, subFilters }),
        { initialProps: { subFilters: { brand: 'Brand A' } } },
      );

      await waitFor(() => {
        expect(mockGetData).toHaveBeenCalledTimes(1);
      });

      rerender({ subFilters: { brand: 'Brand B' } });

      await waitFor(() => {
        expect(mockGetData).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('abort controller', () => {
    it('should abort previous request when new request is made', async () => {
      let resolveFirst: ((value: unknown) => void) | undefined;
      const firstRequest = new Promise((resolve) => {
        resolveFirst = resolve;
      });

      mockGetData.mockReturnValueOnce(firstRequest);

      const { rerender } = renderHook(
        ({ id }) => useBffData({ ...defaultProps, id }),
        { initialProps: { id: 'endpoint-1' } },
      );

      expect(mockGetData).toHaveBeenCalledTimes(1);

      mockGetData.mockResolvedValueOnce(mockBffResponse);
      rerender({ id: 'endpoint-2' });

      await waitFor(() => {
        expect(mockGetData).toHaveBeenCalledTimes(2);
      });

      if (resolveFirst) {
        resolveFirst(mockBffResponse);
      }
    });
  });

  describe('refetch functionality', () => {
    it('should refetch data when refetch is called', async () => {
      mockNormalizeFilters.mockReturnValue(mockNormalizedFilters);

      const { result, rerender } = renderHook(
        ({ applied }) => {
          mockUsePageFilterApplied.mockReturnValue({ applied });
          return useBffData(defaultProps);
        },
        { initialProps: { applied: mockAppliedFilters } },
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetData).toHaveBeenCalledTimes(1);

      const newAppliedFilters = {
        zone: { value: 'NAZ', label: 'NAZ' },
        country: { value: 'US', label: 'United States' },
        time_frame: { value: 'L13W', label: 'Last 13 Weeks' },
      };

      mockNormalizeFilters.mockReturnValue({
        zone: 'NAZ',
        country: 'US',
        time_frame: 'L13W',
      });

      mockGetData.mockClear();
      mockGetData.mockResolvedValue(mockBffResponse);

      rerender({ applied: newAppliedFilters });

      await waitFor(() => {
        expect(mockGetData).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('loading state', () => {
    it('should combine hook loading state with filters loading state', async () => {
      mockUsePageFilterStatus.mockReturnValue({ isLoading: true });

      const { result } = renderHook(() => useBffData(defaultProps));

      expect(result.current.loading).toBe(true);
    });

    it('should show loading while fetching data', async () => {
      mockNormalizeFilters.mockReturnValue(mockNormalizedFilters);

      let resolveRequest: ((value: unknown) => void) | undefined;
      const requestPromise = new Promise((resolve) => {
        resolveRequest = resolve;
      });

      mockGetData.mockReturnValue(requestPromise);

      const { result } = renderHook(() => useBffData(defaultProps));

      expect(result.current.loading).toBe(true);

      if (resolveRequest) {
        resolveRequest(mockBffResponse);
      }

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('filters normalization', () => {
    it('should normalize applied filters', async () => {
      renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(mockNormalizeFilters).toHaveBeenCalledWith(mockAppliedFilters);
      });
    });
  });

  describe('date formatting', () => {
    it('should format date correctly for dt_end', async () => {
      mockUseLastDataRefresh.mockReturnValue({
        lastDataRefreshKpisDate: {
          power: new Date(2024, 2, 15),
        },
        lastDataRefreshKpisDateMonthYear: {
          power: '2024-03-15',
        },
      });
      mockNormalizeFilters.mockReturnValue(mockNormalizedFilters);
      mockGetViewtype.mockReturnValue('country');

      renderHook(() => useBffData(defaultProps));

      await waitFor(() => {
        expect(mockGetData).toHaveBeenCalledWith(
          expect.objectContaining({
            params: expect.objectContaining({
              dt_ini: '2023-09-01',
              dt_end: '2024-03-15',
            }),
          }),
        );
      });
    });
  });

  describe('skipMainFilters behavior', () => {
    it('should not make request when activeFilters is empty even with skipMainFilters true', async () => {
      mockNormalizeFilters.mockReturnValue({});
      const subFilters = { brand: 'Brand A' };

      const { result } = renderHook(() =>
        useBffData({ ...defaultProps, skipMainFilters: true, subFilters }),
      );

      await waitFor(() => {
        expect(result.current.data).toBe(null);
      });

      expect(mockGetData).not.toHaveBeenCalled();
    });

    it('should make request with skipMainFilters true when activeFilters exists', async () => {
      mockNormalizeFilters.mockReturnValue(mockNormalizedFilters);
      mockGetViewtype.mockReturnValue('country');
      mockUseLastDataRefresh.mockReturnValue({
        lastDataRefreshKpisDate: {
          power: new Date(2023, 11, 1),
        },
        lastDataRefreshKpisDateMonthYear: {
          power: '2023-12-01',
        },
      });
      const subFilters = { brand: 'Brand A' };

      const { result } = renderHook(() =>
        useBffData({ ...defaultProps, skipMainFilters: true, subFilters }),
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(mockGetData).toHaveBeenCalled();
      expect(mockGetData).toHaveBeenCalledWith(
        expect.objectContaining({
          endpoint: '/views/test-endpoint',
          params: expect.objectContaining({
            viewtype: 'country',
            brand: 'Brand A',
            dt_ini: '2023-09-01',
            dt_end: '2023-12-01',
          }),
          signal: expect.any(AbortSignal),
        }),
      );
    });
  });
});
