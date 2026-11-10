import { renderHook } from '@testing-library/react-hooks';
import { getFiltersToReset } from 'components/Filter/utils/filterDependencies';
import { usePageFilterData, usePageFilterManagement } from 'hooks';

import { useQuickFilterReset } from './useQuickFilterReset';

jest.mock('hooks', () => ({
  usePageFilterData: jest.fn(),
  usePageFilterManagement: jest.fn(),
}));

jest.mock('components/Filter/utils/filterDependencies', () => ({
  getFiltersToReset: jest.fn(),
}));

describe('useQuickFilterReset', () => {
  const mockUpdateForm = jest.fn();
  const mockApply = jest.fn();
  const mockDefaults = {
    zone: 'ABI',
    country: 'ABI',
    brands: null,
    sub_brands: null,
    global_brands: null,
    brand_filter_groupings: 'All Brands',
    time_frame: 2025,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (usePageFilterData as jest.Mock).mockReturnValue({
      defaults: mockDefaults,
    });

    (usePageFilterManagement as jest.Mock).mockReturnValue({
      updateForm: mockUpdateForm,
      apply: mockApply,
    });
  });

  it('should return handleClear function', () => {
    const { result } = renderHook(() =>
      useQuickFilterReset('test-page', 'country'),
    );

    expect(result.current.handleClear).toBeDefined();
    expect(typeof result.current.handleClear).toBe('function');
  });

  it('should reset filter and its dependents when handleClear is called', () => {
    const filtersToReset = ['country', 'brands', 'sub_brands'];
    (getFiltersToReset as jest.Mock).mockReturnValue(filtersToReset);

    const { result } = renderHook(() =>
      useQuickFilterReset('test-page', 'country'),
    );

    result.current.handleClear();

    expect(getFiltersToReset).toHaveBeenCalledWith('country');

    expect(mockUpdateForm).toHaveBeenCalledTimes(3);
    expect(mockUpdateForm).toHaveBeenCalledWith('country', 'ABI');
    expect(mockUpdateForm).toHaveBeenCalledWith('brands', null);
    expect(mockUpdateForm).toHaveBeenCalledWith('sub_brands', null);

    expect(mockApply).toHaveBeenCalledTimes(1);
  });

  it('should handle filter with no dependents', () => {
    (getFiltersToReset as jest.Mock).mockReturnValue(['brands_abi']);

    const { result } = renderHook(() =>
      useQuickFilterReset('test-page', 'brands_abi'),
    );

    result.current.handleClear();

    expect(getFiltersToReset).toHaveBeenCalledWith('brands_abi');
    expect(mockUpdateForm).toHaveBeenCalledTimes(1);
    expect(mockApply).toHaveBeenCalledTimes(1);
  });

  it('should not reset temporal fields', () => {
    const filtersToReset = ['zone', 'country', 'brands'];
    (getFiltersToReset as jest.Mock).mockReturnValue(filtersToReset);

    const { result } = renderHook(() =>
      useQuickFilterReset('test-page', 'zone'),
    );

    result.current.handleClear();

    expect(mockUpdateForm).toHaveBeenCalledTimes(3);
    expect(mockUpdateForm).not.toHaveBeenCalledWith(
      'time_frame',
      expect.anything(),
    );
    expect(mockUpdateForm).toHaveBeenCalledWith('zone', 'ABI');
    expect(mockUpdateForm).toHaveBeenCalledWith('country', 'ABI');
    expect(mockUpdateForm).toHaveBeenCalledWith('brands', null);
  });

  it('should handle undefined defaults gracefully', () => {
    (usePageFilterData as jest.Mock).mockReturnValue({
      defaults: undefined,
    });

    const filtersToReset = ['country'];
    (getFiltersToReset as jest.Mock).mockReturnValue(filtersToReset);

    const { result } = renderHook(() =>
      useQuickFilterReset('test-page', 'country'),
    );

    result.current.handleClear();

    expect(mockUpdateForm).toHaveBeenCalledWith('country', undefined);
    expect(mockApply).toHaveBeenCalledTimes(1);
  });

  it('should memoize handleClear function', () => {
    const { result, rerender } = renderHook(() =>
      useQuickFilterReset('test-page', 'country'),
    );

    const firstHandleClear = result.current.handleClear;

    rerender();

    const secondHandleClear = result.current.handleClear;

    expect(firstHandleClear).toBe(secondHandleClear);
  });

  it('should create new handleClear when dependencies change', () => {
    const { result, rerender } = renderHook(
      ({ fieldKey }) => useQuickFilterReset('test-page', fieldKey),
      { initialProps: { fieldKey: 'country' } },
    );

    const firstHandleClear = result.current.handleClear;

    rerender({ fieldKey: 'brands' });

    const secondHandleClear = result.current.handleClear;

    expect(firstHandleClear).not.toBe(secondHandleClear);
  });

  it('should reset global_brands along with brand_filter_groupings and sub_brands', () => {
    const filtersToReset = [
      'global_brands',
      'brand_filter_groupings',
      'sub_brands',
    ];
    (getFiltersToReset as jest.Mock).mockReturnValue(filtersToReset);

    const { result } = renderHook(() =>
      useQuickFilterReset('test-page', 'global_brands'),
    );

    result.current.handleClear();

    expect(getFiltersToReset).toHaveBeenCalledWith('global_brands');
    expect(mockUpdateForm).toHaveBeenCalledTimes(3);
    expect(mockUpdateForm).toHaveBeenCalledWith('global_brands', null);
    expect(mockUpdateForm).toHaveBeenCalledWith(
      'brand_filter_groupings',
      'All Brands',
    );
    expect(mockUpdateForm).toHaveBeenCalledWith('sub_brands', null);
    expect(mockApply).toHaveBeenCalledTimes(1);
  });

  it('should reset multiple filters in correct order', () => {
    const filtersToReset = ['zone', 'country', 'brands', 'sub_brands'];
    (getFiltersToReset as jest.Mock).mockReturnValue(filtersToReset);

    const { result } = renderHook(() =>
      useQuickFilterReset('test-page', 'zone'),
    );

    result.current.handleClear();

    expect(mockUpdateForm).toHaveBeenNthCalledWith(1, 'zone', 'ABI');
    expect(mockUpdateForm).toHaveBeenNthCalledWith(2, 'country', 'ABI');
    expect(mockUpdateForm).toHaveBeenNthCalledWith(3, 'brands', null);
    expect(mockUpdateForm).toHaveBeenNthCalledWith(4, 'sub_brands', null);
    expect(mockApply).toHaveBeenCalledTimes(1);
  });
});
