import React from 'react';

import { render, screen } from '@testing-library/react';
import { TableDataType } from 'components/Table/types';

import { PnlTable } from './PnlTable';

interface MockTableProps {
  headerHeight?: number;
  rowHeight?: number;
  chartType?: string;
  dataTestId?: string;
}

interface MockSkeletonProps {
  dataTestId?: string;
}

jest.mock('hooks', () => ({
  useIsInExportPage: jest.fn(() => false),
}));

jest.mock('components/Table/Table', () => ({
  Table: ({
    headerHeight,
    rowHeight,
    chartType,
    dataTestId,
  }: MockTableProps) => (
    <div
      data-testid={dataTestId || 'table'}
      data-header-height={headerHeight}
      data-row-height={rowHeight}
      data-chart-type={chartType}
    >
      Table
    </div>
  ),
}));

jest.mock('./components', () => ({
  PnlSkeleton: ({ dataTestId }: MockSkeletonProps) => (
    <div data-testid={dataTestId || 'pnl-skeleton'}>Skeleton</div>
  ),
}));

jest.mock('./config', () => ({
  tableConfigs: jest.fn(() => ({})),
}));

jest.mock('./config/helpers/helper', () => ({
  customRowHeight: jest.fn(() => 36),
}));

jest.mock('./PnlTable.styles', () => ({
  StyledPnlTable: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('PnlTable', () => {
  const mockData: TableDataType = {
    header: [{ id: 'name', title: 'Name' }],
    rows: [[{ name: { value: 'Test' } }]],
  };

  it('should render Table when loading is false', () => {
    render(<PnlTable data={mockData} tableView="brands" loading={false} />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
    expect(screen.queryByTestId('pnl-skeleton')).not.toBeInTheDocument();
  });

  it('should render Skeleton when loading is true', () => {
    render(<PnlTable data={mockData} tableView="brands" loading={true} />);

    expect(screen.getByTestId('pnl-skeleton')).toBeInTheDocument();
  });

  describe('data-testid', () => {
    it('should pass dataTestId to Table when loaded', () => {
      render(
        <PnlTable
          data={mockData}
          tableView="brands"
          loading={false}
          dataTestId="my-pnl-table"
        />,
      );

      expect(screen.getByTestId('my-pnl-table')).toBeInTheDocument();
    });

    it('should pass dataTestId with suffix to Skeleton when loading', () => {
      render(
        <PnlTable
          data={mockData}
          tableView="brands"
          loading={true}
          dataTestId="my-pnl-table"
        />,
      );

      expect(screen.getByTestId('my-pnl-table-skeleton')).toBeInTheDocument();
    });
  });
});
