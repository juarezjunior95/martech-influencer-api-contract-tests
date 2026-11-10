import React from 'react';

import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight,
} from '@hexa-ui/icons2';

import { UseDataTablePaginationReturn } from './hooks';
import {
  CounterText,
  ItemsPerPageContainer,
  ItemsPerPageLabel,
  ItemsPerPageSelect,
  NavigationGroup,
  PageButton,
  PaginationButton,
  PaginationContainer,
  PaginationNumbers,
} from './Pagination.styles';

export interface PaginationProps extends Omit<
  Partial<UseDataTablePaginationReturn>,
  'totalPages'
> {
  currentPage: number;
  totalItems?: number;
  itemsPerPage?: number;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  onPageChange: (page: number) => void;
  canGoToPrevious: boolean;
  canGoToNext: boolean;
  visiblePages?: number[];
  showQuantityIndicator?: boolean;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  dataTestId?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  onPageChange,
  canGoToPrevious,
  canGoToNext,
  visiblePages = [],
  showQuantityIndicator = true,
  showItemsPerPage = false,
  itemsPerPageOptions = [10, 25, 50, 100],
  onItemsPerPageChange,
  dataTestId,
}) => {
  const startItem =
    totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : 0;

  return (
    <PaginationContainer data-testid={dataTestId}>
      {showQuantityIndicator && !!totalItems && !!itemsPerPage && (
        <CounterText
          data-testid={dataTestId ? `${dataTestId}-counter` : undefined}
        >
          {startItem} - {endItem} of {totalItems}
        </CounterText>
      )}

      {showItemsPerPage && !!itemsPerPage && onItemsPerPageChange && (
        <ItemsPerPageContainer
          data-testid={
            dataTestId ? `${dataTestId}-items-per-page-container` : undefined
          }
        >
          <ItemsPerPageLabel>Items per page:</ItemsPerPageLabel>
          <ItemsPerPageSelect
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            data-testid={
              dataTestId ? `${dataTestId}-items-per-page-select` : undefined
            }
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </ItemsPerPageSelect>
        </ItemsPerPageContainer>
      )}

      <NavigationGroup>
        <PaginationButton
          onClick={onFirstPage}
          disabled={!canGoToPrevious}
          aria-label="First page"
          data-testid={dataTestId ? `${dataTestId}-first` : undefined}
          position="first"
        >
          <ChevronDoubleLeft />
        </PaginationButton>

        <PaginationButton
          onClick={onPreviousPage}
          disabled={!canGoToPrevious}
          aria-label="Previous page"
          data-testid={dataTestId ? `${dataTestId}-previous` : undefined}
          position="middle"
        >
          <ChevronLeft />
        </PaginationButton>

        <PaginationNumbers>
          {visiblePages.map((pageNum) => (
            <PageButton
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              active={currentPage === pageNum}
              data-testid={
                dataTestId ? `${dataTestId}-page-${pageNum}` : undefined
              }
            >
              {pageNum}
            </PageButton>
          ))}
        </PaginationNumbers>

        <PaginationButton
          onClick={onNextPage}
          disabled={!canGoToNext}
          aria-label="Next page"
          data-testid={dataTestId ? `${dataTestId}-next` : undefined}
          position="middle"
        >
          <ChevronRight />
        </PaginationButton>

        <PaginationButton
          onClick={onLastPage}
          disabled={!canGoToNext}
          aria-label="Last page"
          data-testid={dataTestId ? `${dataTestId}-last` : undefined}
          position="last"
        >
          <ChevronDoubleRight />
        </PaginationButton>
      </NavigationGroup>
    </PaginationContainer>
  );
};
