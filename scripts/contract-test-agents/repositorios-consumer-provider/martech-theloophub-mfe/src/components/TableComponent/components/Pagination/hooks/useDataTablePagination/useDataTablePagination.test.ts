import { act, renderHook } from '@testing-library/react-hooks';

import { useDataTablePagination } from './useDataTablePagination';

describe('useDataTablePagination', () => {
  test('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
        totalItems: 50,
        itemsPerPage: 25,
      }),
    );

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.itemsPerPage).toBe(25);
  });

  test('should accept totalPages from backend', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 10,
      }),
    );

    expect(result.current.totalPages).toBe(10);
  });

  test('should navigate to next page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
      }),
    );

    act(() => {
      result.current.onNextPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  test('should navigate to previous page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
        initialPage: 3,
      }),
    );

    act(() => {
      result.current.onPreviousPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  test('should navigate to first page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
        initialPage: 5,
      }),
    );

    act(() => {
      result.current.onFirstPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  test('should navigate to last page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
      }),
    );

    act(() => {
      result.current.onLastPage();
    });

    expect(result.current.currentPage).toBe(5);
  });

  test('should navigate to specific page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
      }),
    );

    act(() => {
      result.current.onPageChange(3);
    });

    expect(result.current.currentPage).toBe(3);
  });

  test('should not navigate before first page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
      }),
    );

    act(() => {
      result.current.onPreviousPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  test('should not navigate beyond last page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
        initialPage: 5,
      }),
    );

    act(() => {
      result.current.onNextPage();
    });

    expect(result.current.currentPage).toBe(5);
  });

  test('should calculate visible pages correctly', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 10,
        maxVisiblePages: 5,
      }),
    );

    expect(result.current.visiblePages).toEqual([1, 2, 3, 4, 5]);
  });

  test('should adjust visible pages when in middle', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 10,
        initialPage: 5,
        maxVisiblePages: 5,
      }),
    );

    expect(result.current.visiblePages).toEqual([3, 4, 5, 6, 7]);
  });

  test('should adjust visible pages when at end', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 10,
        initialPage: 10,
        maxVisiblePages: 5,
      }),
    );

    expect(result.current.visiblePages).toEqual([6, 7, 8, 9, 10]);
  });

  test('should return correct navigation states', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
        initialPage: 3,
      }),
    );

    expect(result.current.canGoToPrevious).toBe(true);
    expect(result.current.canGoToNext).toBe(true);
  });

  test('should disable navigation on first page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
      }),
    );

    expect(result.current.canGoToPrevious).toBe(false);
    expect(result.current.canGoToNext).toBe(true);
  });

  test('should disable navigation on last page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
        initialPage: 5,
      }),
    );

    expect(result.current.canGoToPrevious).toBe(true);
    expect(result.current.canGoToNext).toBe(false);
  });

  test('should navigate to last page correctly', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
      }),
    );

    act(() => {
      result.current.onLastPage();
    });

    expect(result.current.currentPage).toBe(5);
  });

  test('should handle single page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 1,
      }),
    );

    expect(result.current.totalPages).toBe(1);
    expect(result.current.visiblePages).toEqual([1]);
    expect(result.current.canGoToPrevious).toBe(false);
    expect(result.current.canGoToNext).toBe(false);
  });

  test('should not navigate to invalid page', () => {
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
      }),
    );

    act(() => {
      result.current.onPageChange(0);
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.onPageChange(10);
    });
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.onPageChange(-1);
    });
    expect(result.current.currentPage).toBe(1);
  });

  test('should call onPageChange callback when page changes', () => {
    const onPageChange = jest.fn();
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
        onPageChange,
      }),
    );

    act(() => {
      result.current.onNextPage();
    });

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('should not call onPageChange callback when navigating to same page', () => {
    const onPageChange = jest.fn();
    const { result } = renderHook(() =>
      useDataTablePagination({
        totalPages: 5,
        initialPage: 3,
        onPageChange,
      }),
    );

    act(() => {
      result.current.onPageChange(3);
    });

    expect(onPageChange).not.toHaveBeenCalled();
  });

  test('should reset to last page if current page exceeds totalPages', () => {
    const { result, rerender } = renderHook(
      ({ totalPages }) =>
        useDataTablePagination({ totalPages, initialPage: 10 }),
      { initialProps: { totalPages: 10 } },
    );

    expect(result.current.currentPage).toBe(10);

    rerender({ totalPages: 5 });

    expect(result.current.currentPage).toBe(5);
  });
});
