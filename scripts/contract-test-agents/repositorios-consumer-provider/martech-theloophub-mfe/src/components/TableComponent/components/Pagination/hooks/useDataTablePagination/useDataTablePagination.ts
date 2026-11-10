import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UseDataTablePaginationParams {
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  initialPage?: number;
  maxVisiblePages?: number;
  onPageChange?: (page: number) => void;
}

export interface UseDataTablePaginationReturn {
  currentPage: number;
  totalPages: number;
  itemsPerPage?: number;
  visiblePages: number[];
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  onPageChange: (page: number) => void;
}

const clampPage = (page: number, maxPages: number): number => {
  const validMax = Math.max(1, maxPages);
  return Math.min(Math.max(page, 1), validMax);
};

export const useDataTablePagination = ({
  totalPages,
  itemsPerPage,
  initialPage = 1,
  maxVisiblePages = 5,
  onPageChange: onPageChangeCallback,
}: UseDataTablePaginationParams): UseDataTablePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(() =>
    clampPage(initialPage, totalPages),
  );

  const canGoToPrevious = currentPage > 1;
  const canGoToNext = currentPage < totalPages;

  const visiblePages = useMemo(() => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }, [currentPage, totalPages, maxVisiblePages]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setCurrentPage(page);
        onPageChangeCallback?.(page);
      }
    },
    [currentPage, totalPages, onPageChangeCallback],
  );

  const onFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  const onPreviousPage = useCallback(() => {
    handlePageChange(Math.max(1, currentPage - 1));
  }, [handlePageChange, currentPage]);

  const onNextPage = useCallback(() => {
    handlePageChange(Math.min(totalPages, currentPage + 1));
  }, [handlePageChange, totalPages, currentPage]);

  const onLastPage = useCallback(() => {
    handlePageChange(totalPages);
  }, [handlePageChange, totalPages]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    visiblePages,
    canGoToPrevious,
    canGoToNext,
    onFirstPage,
    onPreviousPage,
    onNextPage,
    onLastPage,
    onPageChange: handlePageChange,
  };
};
