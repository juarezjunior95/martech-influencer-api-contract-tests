import React from 'react';

import { render, screen } from '@testing-library/react';
import { TableDataType } from 'components/Table/types';

import { PnlBrands } from './PnlBrands';

interface MockNoResultsProps {
  type: string;
  headerTitleId: string;
}

interface MockPnlTableProps {
  loading?: boolean;
  tableView?: string;
  chartType?: string;
  dataTestId?: string;
}

const mockOpenModal = jest.fn();

jest.mock('pages/pillars/PortfolioBrand/Performance/Performance', () => ({
  PERFORMANCE_PAGE_NAME: 'performance-page',
}));

jest.mock('contexts/Modal/ModalContext', () => ({
  useModalContext: jest.fn(() => ({
    openModal: jest.fn(),
    closeModal: jest.fn(),
    isOpen: false,
  })),
  useScopedModal: jest.fn(() => ({ open: jest.fn() })),
}));

jest.mock('hooks', () => ({
  useFilters: jest.fn(() => ({
    isActiveGlobalZone: false,
    openModal: mockOpenModal,
  })),
  useCurrentPage: () => ({ currentPage: 'test-page' }),
  usePageFilterApplied: () => ({ isGlobalZone: false }),
}));

jest.mock('contexts', () => ({
  useScopedModal: jest.fn(() => ({ open: mockOpenModal })),
  useModalContext: jest.fn(() => ({
    openModal: jest.fn(),
    closeModal: jest.fn(),
    isOpen: false,
  })),
}));

jest.mock('components/Filter', () => ({
  FILTER_MODAL_NAME: 'filter-modal',
}));

jest.mock('components', () => ({
  NoResultsState: ({ type, headerTitleId }: MockNoResultsProps) => (
    <div
      data-testid="no-results-state"
      data-type={type}
      data-header-title-id={headerTitleId}
    >
      No Results
    </div>
  ),
  TableFilter: jest.fn(),
}));

jest.mock('../../PnlTable', () => ({
  PnlTable: ({
    loading,
    tableView,
    chartType,
    dataTestId,
  }: MockPnlTableProps) => (
    <div
      data-testid={dataTestId || 'pnl-table'}
      data-loading={loading}
      data-table-view={tableView}
      data-chart-type={chartType}
    >
      PnlTable
    </div>
  ),
}));

describe('PnlBrands', () => {
  const mockData = {
    rows: [{ id: 1, name: 'Test' }],
    columns: [{ field: 'name' }],
  } as unknown as TableDataType;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render PnlTable when isActiveGlobalZone is false', () => {
    render(<PnlBrands data={mockData} />);

    expect(screen.getByTestId('pnl-table')).toBeInTheDocument();
    expect(screen.queryByTestId('no-results-state')).not.toBeInTheDocument();
  });

  it('should render with dataTestId and propagate to PnlTable', () => {
    render(<PnlBrands data={mockData} dataTestId="pnl-brands-container" />);

    expect(screen.getByTestId('pnl-brands-container')).toBeInTheDocument();

    expect(
      screen.getByTestId('pnl-brands-container-table'),
    ).toBeInTheDocument();
  });
});
