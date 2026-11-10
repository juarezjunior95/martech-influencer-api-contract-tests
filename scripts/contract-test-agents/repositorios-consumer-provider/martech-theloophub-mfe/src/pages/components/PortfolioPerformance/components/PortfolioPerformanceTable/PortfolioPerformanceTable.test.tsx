import React from 'react';

import { render, screen } from '@testing-library/react';
import { TableDataType } from 'components/Table/types';

import { PortfolioPerformanceTable } from './PortfolioPerformanceTable';

interface MockTableProps {
  rowHeight?: number;
  headerHeight?: number;
  scrollbarWidth?: number;
  emptyRow?: { addOnStart: boolean };
  dataTestId?: string;
}

jest.mock('components', () => ({
  Table: ({
    rowHeight,
    headerHeight,
    scrollbarWidth,
    emptyRow,
    dataTestId,
  }: MockTableProps) => (
    <div
      data-testid={dataTestId || 'table'}
      data-row-height={rowHeight}
      data-header-height={headerHeight}
      data-scrollbar-width={scrollbarWidth}
      data-empty-row-add-on-start={emptyRow?.addOnStart}
    >
      Table
    </div>
  ),
}));

jest.mock('./config', () => ({
  tableConfig: {},
}));

jest.mock('./PortfolioPerformanceTable.styles', () => ({
  StyledPortfolioPerformanceTableContainer: {},
}));

describe('PortfolioPerformanceTable', () => {
  const mockData = {
    rows: [{ id: 1, name: 'Test' }],
    columns: [{ field: 'name' }],
  } as unknown as TableDataType;

  it('should render the Table component', () => {
    render(<PortfolioPerformanceTable data={mockData} />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should render with specific data-testid', () => {
    render(
      <PortfolioPerformanceTable
        data={mockData}
        dataTestId="custom-table-id"
      />,
    );

    expect(screen.getByTestId('custom-table-id')).toBeInTheDocument();
  });
});
