import { useState } from 'react';

import { Heading } from '@hexa-ui/components';
import { TableFooter, useDataTablePagination } from 'components/TableComponent';

import { StyledContainer, StyledSection } from '../../ComponentsPage.styles';

export const TableFooterExample = () => {
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const defaultPagination = useDataTablePagination({
    totalPages: Math.ceil(50 / 25),
    totalItems: 50,
    itemsPerPage: 25,
    initialPage: 1,
    maxVisiblePages: 5,
  });

  const withoutCounterPagination = useDataTablePagination({
    totalPages: Math.ceil(100 / 10),
    totalItems: 100,
    itemsPerPage: 10,
    initialPage: 1,
    maxVisiblePages: 5,
  });

  const fewPagesPagination = useDataTablePagination({
    totalPages: Math.ceil(30 / 10),
    totalItems: 30,
    itemsPerPage: 10,
    initialPage: 1,
    maxVisiblePages: 3,
  });

  const manyPagesPagination = useDataTablePagination({
    totalPages: Math.ceil(500 / 25),
    totalItems: 500,
    itemsPerPage: 25,
    initialPage: 1,
    maxVisiblePages: 5,
  });

  const withItemsPerPagePagination = useDataTablePagination({
    totalPages: Math.ceil(100 / itemsPerPage),
    totalItems: 100,
    itemsPerPage: itemsPerPage,
    initialPage: 1,
    maxVisiblePages: 5,
  });

  return (
    <StyledContainer>
      <StyledSection>
        <Heading>Table Footer</Heading>
      </StyledSection>

      <StyledSection>
        <h6
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#141414',
            marginBottom: '16px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Default (50 items, 25 per page)
        </h6>
        <TableFooter
          {...defaultPagination}
          totalItems={50}
          itemsPerPage={25}
          showQuantityIndicator={true}
          dataTestId="table-footer-default"
        />
      </StyledSection>

      <StyledSection>
        <h6
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#141414',
            marginBottom: '16px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Without Quantity Indicator
        </h6>
        <TableFooter
          {...withoutCounterPagination}
          totalItems={100}
          itemsPerPage={10}
          showQuantityIndicator={false}
          dataTestId="table-footer-without-counter"
        />
      </StyledSection>

      <StyledSection>
        <h6
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#141414',
            marginBottom: '16px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Few Visible Pages (maxVisiblePages=3)
        </h6>
        <TableFooter
          {...fewPagesPagination}
          totalItems={30}
          itemsPerPage={10}
          showQuantityIndicator={true}
          dataTestId="table-footer-few-pages"
        />
      </StyledSection>

      <StyledSection>
        <h6
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#141414',
            marginBottom: '16px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Many Items (500 items, 20 pages)
        </h6>
        <TableFooter
          {...manyPagesPagination}
          totalItems={500}
          itemsPerPage={25}
          showQuantityIndicator={true}
          dataTestId="table-footer-many-pages"
        />
      </StyledSection>

      <StyledSection>
        <h6
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#141414',
            marginBottom: '16px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          With Items Per Page Selector
        </h6>
        <TableFooter
          {...withItemsPerPagePagination}
          totalItems={100}
          itemsPerPage={itemsPerPage}
          showQuantityIndicator={true}
          showItemsPerPage={true}
          itemsPerPageOptions={[10, 25, 50, 100]}
          onItemsPerPageChange={setItemsPerPage}
          dataTestId="table-footer-with-selector"
        />
      </StyledSection>
    </StyledContainer>
  );
};
