import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { renderHook } from '@testing-library/react-hooks';
import { FilterRegistry } from 'domain/Filter';
import { useCurrentPage, usePageFilterData, usePageFilterStatus } from 'hooks';

import { useFiltersUrlSync } from './useFiltersUrlSync';

// Mocks
jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterData: jest.fn(),
  usePageFilterStatus: jest.fn(),
}));

jest.mock('redux/slices/filters', () => ({
  applyFilters: jest.fn(() => ({ type: 'filters/applyFilters' })),
  updateFormValue: jest.fn((payload) => ({
    type: 'filters/updateFormValue',
    payload,
  })),
  setFilterVisibility: jest.fn((payload) => ({
    type: 'filters/setFilterVisibility',
    payload,
  })),
}));

jest.mock('domain/Filter', () => ({
  FilterRegistry: {
    validateUrlFilters: jest.fn(),
    extractFiltersFromUrl: jest.fn((params) => {
      const result = {};
      params.forEach((value, key) => {
        if (typeof key === 'string' && key.startsWith('filter_')) {
          result[key.replace('filter_', '')] = value;
        }
      });
      return result;
    }),
    getInstance: jest.fn(() => ({
      getOrderedKeys: jest.fn(() => ['zone', 'country', 'brands', 'subBrands']),
    })),
  },
}));

describe('useFiltersUrlSync', () => {
  let mockDispatch: jest.Mock;
  let mockSetSearchParams: jest.Mock;
  let mockSearchParams: URLSearchParams;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDispatch = jest.fn();
    mockSetSearchParams = jest.fn();
    mockSearchParams = new URLSearchParams();

    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSearchParams as jest.Mock).mockReturnValue([
      mockSearchParams,
      mockSetSearchParams,
    ]);

    // Default mocks
    (useCurrentPage as jest.Mock).mockReturnValue({ currentPage: 'test-page' });
    (usePageFilterStatus as jest.Mock).mockReturnValue({ status: 'loaded' });
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: { zones: {}, country: {} },
      defaults: { zone: 'ABI', country: 'ABI' },
    });
    (useSelector as jest.Mock).mockReturnValue({});
  });

  describe('Guards', () => {
    it('should not execute when currentPage is null', () => {
      (useCurrentPage as jest.Mock).mockReturnValue({ currentPage: null });

      renderHook(() => useFiltersUrlSync());

      expect(FilterRegistry.validateUrlFilters).not.toHaveBeenCalled();
    });

    it('should not execute when status is not loaded', () => {
      (usePageFilterStatus as jest.Mock).mockReturnValue({ status: 'loading' });

      renderHook(() => useFiltersUrlSync());

      expect(FilterRegistry.validateUrlFilters).not.toHaveBeenCalled();
    });

    it('should not execute when dataFilters is empty', () => {
      (usePageFilterData as jest.Mock).mockReturnValue({
        dataFilters: {},
        defaults: {},
      });

      renderHook(() => useFiltersUrlSync());

      expect(FilterRegistry.validateUrlFilters).not.toHaveBeenCalled();
    });

    it('should set visibility when filter is hidden', () => {
      renderHook(() => useFiltersUrlSync(true, 'test-page')); // isHidden = true

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'filters/setFilterVisibility',
          payload: { page: 'test-page', isHidden: true },
        }),
      );
    });
  });

  describe('Effect 1: Read from URL (URL → Redux)', () => {
    it('should read and apply filters from URL on mount', () => {
      // Setup URL with filters
      mockSearchParams = new URLSearchParams(
        'filter_zone=SAZ&filter_country=BRA',
      );
      (useSearchParams as jest.Mock).mockReturnValue([
        mockSearchParams,
        mockSetSearchParams,
      ]);

      // Mock FilterRegistry validation
      (FilterRegistry.validateUrlFilters as jest.Mock).mockReturnValue({
        zone: 'SAZ',
        country: 'BRA',
      });

      renderHook(() => useFiltersUrlSync());

      // Should validate URL filters
      expect(FilterRegistry.validateUrlFilters).toHaveBeenCalledWith(
        mockSearchParams,
        { zones: {}, country: {} },
        { zone: 'ABI', country: 'ABI' },
        expect.anything(),
      );

      // Should apply to Redux
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: { key: 'zone', value: 'SAZ' } }),
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: { key: 'country', value: 'BRA' } }),
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'filters/applyFilters' }),
      );
    });

    it('should filter out null/undefined/empty values before applying', () => {
      mockSearchParams = new URLSearchParams('filter_zone=SAZ');
      (useSearchParams as jest.Mock).mockReturnValue([
        mockSearchParams,
        mockSetSearchParams,
      ]);

      (FilterRegistry.validateUrlFilters as jest.Mock).mockReturnValue({
        zone: 'SAZ',
        country: null,
        brands: undefined,
        subBrands: '',
      });

      renderHook(() => useFiltersUrlSync());

      // Should only apply non-null values
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ payload: { key: 'zone', value: 'SAZ' } }),
      );

      // Should not apply null/undefined/empty
      expect(mockDispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ payload: { key: 'country' } }),
      );
    });

    it('should skip reading from URL if no filter params exist', () => {
      mockSearchParams = new URLSearchParams('otherParam=value');
      (useSearchParams as jest.Mock).mockReturnValue([
        mockSearchParams,
        mockSetSearchParams,
      ]);

      renderHook(() => useFiltersUrlSync());

      expect(FilterRegistry.validateUrlFilters).not.toHaveBeenCalled();
    });

    it('should only read from URL once per page', () => {
      mockSearchParams = new URLSearchParams('filter_zone=SAZ');
      (useSearchParams as jest.Mock).mockReturnValue([
        mockSearchParams,
        mockSetSearchParams,
      ]);

      (FilterRegistry.validateUrlFilters as jest.Mock).mockReturnValue({
        zone: 'SAZ',
      });

      const { rerender } = renderHook(() => useFiltersUrlSync());

      expect(FilterRegistry.validateUrlFilters).toHaveBeenCalledTimes(1);

      // Rerender should not read again
      rerender();
      expect(FilterRegistry.validateUrlFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('Page change handling', () => {
    it('should reset and re-read when page changes', () => {
      mockSearchParams = new URLSearchParams('filter_zone=SAZ');
      (useSearchParams as jest.Mock).mockReturnValue([
        mockSearchParams,
        mockSetSearchParams,
      ]);

      (FilterRegistry.validateUrlFilters as jest.Mock).mockReturnValue({
        zone: 'SAZ',
      });

      const { rerender } = renderHook(() => useFiltersUrlSync());

      expect(FilterRegistry.validateUrlFilters).toHaveBeenCalledTimes(1);

      // Change page
      (useCurrentPage as jest.Mock).mockReturnValue({
        currentPage: 'new-page',
      });

      rerender();

      // Should read from URL again for new page
      expect(FilterRegistry.validateUrlFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration: Reading from URL', () => {
    it('should handle complete URL → Redux flow', () => {
      // Step 1: Start with URL containing filters
      mockSearchParams = new URLSearchParams(
        'filter_zone=SAZ&filter_country=BRA',
      );
      (useSearchParams as jest.Mock).mockReturnValue([
        mockSearchParams,
        mockSetSearchParams,
      ]);

      (FilterRegistry.validateUrlFilters as jest.Mock).mockReturnValue({
        zone: 'SAZ',
        country: 'BRA',
        brands: 'All',
      });

      renderHook(() => useFiltersUrlSync());

      // Step 2: Verify URL was read
      expect(FilterRegistry.validateUrlFilters).toHaveBeenCalled();

      // Step 3: Verify applied to Redux
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'filters/applyFilters' }),
      );
    });

    it('should handle empty URL on mount', () => {
      mockSearchParams = new URLSearchParams('');
      (useSearchParams as jest.Mock).mockReturnValue([
        mockSearchParams,
        mockSetSearchParams,
      ]);

      renderHook(() => useFiltersUrlSync());

      // Should not read from URL (no filter_ params)
      expect(FilterRegistry.validateUrlFilters).not.toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should handle special characters in filter values', () => {
      mockSearchParams = new URLSearchParams("filter_brands=Beck's");
      (useSearchParams as jest.Mock).mockReturnValue([
        mockSearchParams,
        mockSetSearchParams,
      ]);

      (FilterRegistry.validateUrlFilters as jest.Mock).mockReturnValue({
        brands: "Beck's",
      });

      renderHook(() => useFiltersUrlSync());

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { key: 'brands', value: "Beck's" },
        }),
      );
    });
  });
});
