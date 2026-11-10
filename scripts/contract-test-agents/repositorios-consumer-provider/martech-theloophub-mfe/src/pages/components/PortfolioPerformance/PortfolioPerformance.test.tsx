import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { splitGenericTable } from 'components/Table/utils/splitGenericTable';

import { PortfolioPerformance } from './PortfolioPerformance';

jest.mock('hooks', () => ({
  useIsInExportPage: jest.fn(() => false),
}));

jest.mock('components', () => ({
  ErrorMessage: () => <div data-testid="error-message">Error</div>,
}));

jest.mock('components/Table/utils/splitGenericTable', () => ({
  splitGenericTable: jest.fn(),
}));

jest.mock('components/Table/utils/transformAgGridData', () => ({
  transformAgGridData: jest.fn(() => ({})),
}));

jest.mock('utils/container', () => ({
  ContainerWithScroll: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('./components', () => ({
  PortfolioPerformanceTable: ({ headerHeight, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'portfolio-table'}
      data-header-height={headerHeight}
    >
      Table
    </div>
  ),
  PortfolioSkeleton: () => <div data-testid="portfolio-skeleton">Skeleton</div>,
}));

jest.mock('./constants', () => ({
  includesHeaderHeight: [true, false, false],
  prPagesTableWidths: ['100px', '200px', '300px'],
  tableWidths: ['150px', '250px', '350px'],
}));

jest.mock('./PortfolioPerformance.styles', () => ({
  StyledPortfolioPerformanceTable: ({ children }: any) => <div>{children}</div>,
}));

describe('PortfolioPerformance', () => {
  const mockData = {
    columnDefs: [],
    splits: [],
    rowData: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render PortfolioSkeleton when loading is true', () => {
    render(
      <PortfolioPerformance data={{} as any} error={null} loading={true} />,
    );

    expect(screen.getByTestId('portfolio-skeleton')).toBeInTheDocument();
  });

  it('should render ErrorMessage when error is present', () => {
    render(
      <PortfolioPerformance
        data={{} as any}
        error={new Error('Test')}
        loading={false}
      />,
    );

    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('should render tables when data is already split (e.g. Overview) without calling splitGenericTable again', async () => {
    const preSplit = {
      Portfolio: { header: [{ id: 'a', title: 'A' }], rows: [[]] },
      Volume: { header: [{ id: 'b', title: 'B' }], rows: [[]] },
    };

    render(
      <PortfolioPerformance
        data={preSplit as any}
        error={null}
        loading={false}
        dataTestId="overview-split"
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('overview-split-table-Portfolio'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('overview-split-table-Volume'),
      ).toBeInTheDocument();
    });

    expect(splitGenericTable).not.toHaveBeenCalled();
  });

  describe('data-testid', () => {
    it('should render component with data-testid and propagate to tables', async () => {
      (splitGenericTable as jest.Mock).mockReturnValue({
        overview: { headers: [], rows: [] },
        details: { headers: [], rows: [] },
      });

      render(
        <PortfolioPerformance
          data={mockData as any}
          error={null}
          loading={false}
          dataTestId="my-portfolio"
        />,
      );

      await waitFor(() => {
        expect(screen.getByTestId('my-portfolio')).toBeInTheDocument();
      });

      expect(
        screen.getByTestId('my-portfolio-table-overview'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('my-portfolio-table-details'),
      ).toBeInTheDocument();
    });

    it('should NOT render data-testid if not provided', async () => {
      (splitGenericTable as jest.Mock).mockReturnValue({
        overview: { headers: [], rows: [] },
      });

      render(
        <PortfolioPerformance
          data={mockData as any}
          error={null}
          loading={false}
        />,
      );

      await waitFor(() => {
        expect(screen.queryByTestId('my-portfolio')).not.toBeInTheDocument();
      });

      const table = screen.getByTestId('portfolio-table');
      expect(table.getAttribute('data-testid')).toBe('portfolio-table');
    });
  });
});
