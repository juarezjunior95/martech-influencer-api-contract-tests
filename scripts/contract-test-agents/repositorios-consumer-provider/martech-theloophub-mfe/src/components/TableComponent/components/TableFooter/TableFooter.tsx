import React from 'react';

import { Pagination } from '../Pagination/Pagination';
import type { PaginationProps } from '../Pagination/Pagination';
import { FooterContainer } from './TableFooter.styles';

export interface TableFooterProps extends PaginationProps {
  totalPages?: number;
  dataTestId?: string;
}

export const TableFooter: React.FC<TableFooterProps> = ({
  dataTestId,
  totalPages: _totalPages,
  ...paginationProps
}) => {
  return (
    <FooterContainer data-testid={dataTestId}>
      <Pagination
        {...paginationProps}
        dataTestId={dataTestId ? `${dataTestId}-pagination` : undefined}
      />
    </FooterContainer>
  );
};
