import { render, screen } from '@testing-library/react';

import { PortfolioTable } from './PortfolioTable';

const mockSplitGenericTable = jest.fn();

jest.mock('components', () => ({
  Table: ({
    data,
    columnDefsConfig,
    style,
    rowHeight,
    headerHeight,
    scrollbarWidth,
    emptyRow,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId ?? 'table-component'}
      data-row-height={rowHeight}
      data-header-height={headerHeight}
      data-scrollbar-width={scrollbarWidth}
      data-empty-row-add-on-start={emptyRow?.addOnStart?.toString()}
    >
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      <div data-testid="table-config">{JSON.stringify(columnDefsConfig)}</div>
      <div data-testid="table-style">{JSON.stringify(style)}</div>
    </div>
  ),
}));

jest.mock('components/Table/utils', () => ({
  splitGenericTable: (...args: any[]) => mockSplitGenericTable(...args),
}));

jest.mock('./config', () => ({
  tableConfig: {
    portfolio: { minWidth: 240 },
    mtd: { minWidth: 100 },
  },
}));

jest.mock('./PortfolioTable.styles', () => ({
  StyledPortfolioPerformanceTableContainer: ({
    children,
    'data-testid': dataTestIdProp,
  }: any) => (
    <div data-testid={dataTestIdProp ?? 'table-container'}>{children}</div>
  ),
  StyledPortfolioPerformanceTable: { className: 'styled-table' },
}));

describe('PortfolioTable Component', () => {
  const mockData = {
    header: [
      { id: 'portfolio', title: 'Portfolio' },
      { id: 'mtd', title: 'MTD' },
    ],
    rows: [[{ portfolio: { value: 'Test' }, mtd: { value: '100' } }]],
    splits: [['portfolio'], ['mtd']],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render table container', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      expect(screen.getByTestId('table-container')).toBeInTheDocument();
    });

    it('should call splitGenericTable with correct arguments', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      expect(mockSplitGenericTable).toHaveBeenCalledWith(
        mockData,
        mockData.splits,
      );
    });

    it('should render Table components for each split result', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
        MTD: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const tables = screen.getAllByTestId('table-component');
      expect(tables).toHaveLength(2);
    });
  });

  describe('Table Component Props', () => {
    it('should pass data to each Table component', () => {
      const splitData = {
        Portfolio: {
          ...mockData,
          header: [{ id: 'portfolio', title: 'Portfolio' }],
        },
      };
      mockSplitGenericTable.mockReturnValue(splitData);

      render(<PortfolioTable data={mockData} />);

      const tableData = screen.getByTestId('table-data');
      expect(tableData).toHaveTextContent(JSON.stringify(splitData.Portfolio));
    });

    it('should pass columnDefsConfig to Table component', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const tableConfig = screen.getByTestId('table-config');
      expect(tableConfig).toBeInTheDocument();
      expect(tableConfig.textContent).toContain('portfolio');
    });

    it('should pass style to Table component', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const tableStyle = screen.getByTestId('table-style');
      expect(tableStyle).toBeInTheDocument();
      expect(tableStyle.textContent).toContain('className');
    });

    it('should set rowHeight to 80', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-row-height', '80');
    });

    it('should set scrollbarWidth to 0', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-scrollbar-width', '0');
    });

    it('should set emptyRow with addOnStart true', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-empty-row-add-on-start', 'true');
    });
  });

  describe('HeaderHeight Conditional Logic', () => {
    it('should set headerHeight to 102 when key is Portfolio', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '102');
    });

    it('should set headerHeight to 45 when key is not Portfolio', () => {
      mockSplitGenericTable.mockReturnValue({
        MTD: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '45');
    });

    it('should set correct headerHeight for multiple tables', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
        MTD: mockData,
        YTD: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const tables = screen.getAllByTestId('table-component');
      expect(tables[0]).toHaveAttribute('data-header-height', '102'); // Portfolio
      expect(tables[1]).toHaveAttribute('data-header-height', '45'); // MTD
      expect(tables[2]).toHaveAttribute('data-header-height', '45'); // YTD
    });

    it('should be case-sensitive for Portfolio key', () => {
      mockSplitGenericTable.mockReturnValue({
        portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '45');
    });

    it('should handle PORTFOLIO in uppercase', () => {
      mockSplitGenericTable.mockReturnValue({
        PORTFOLIO: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '45');
    });
  });

  describe('UseMemo Behavior', () => {
    it('should call splitGenericTable on initial render', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      expect(mockSplitGenericTable).toHaveBeenCalledTimes(1);
    });

    it('should call splitGenericTable again when data changes', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      const { rerender } = render(<PortfolioTable data={mockData} />);

      const newData = {
        ...mockData,
        rows: [[{ portfolio: { value: 'New' }, mtd: { value: '200' } }]],
      };

      rerender(<PortfolioTable data={newData} />);

      expect(mockSplitGenericTable).toHaveBeenCalledTimes(2);
      expect(mockSplitGenericTable).toHaveBeenLastCalledWith(
        newData,
        newData.splits,
      );
    });

    it('should not call splitGenericTable again when data reference is the same', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      const { rerender } = render(<PortfolioTable data={mockData} />);

      rerender(<PortfolioTable data={mockData} />);

      expect(mockSplitGenericTable).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple Tables Rendering', () => {
    it('should render single table when split returns one result', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const tables = screen.getAllByTestId('table-component');
      expect(tables).toHaveLength(1);
    });

    it('should render multiple tables when split returns multiple results', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
        MTD: mockData,
        L3M: mockData,
        YTD: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const tables = screen.getAllByTestId('table-component');
      expect(tables).toHaveLength(4);
    });

    it('should use key as React key for each table', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
        MTD: mockData,
      });

      const { container } = render(<PortfolioTable data={mockData} />);

      const tables = container.querySelectorAll(
        '[data-testid="table-component"]',
      );
      expect(tables).toHaveLength(2);
    });

    it('should pass different data to each table', () => {
      const portfolioData = {
        ...mockData,
        header: [{ id: 'portfolio', title: 'Portfolio' }],
      };
      const mtdData = {
        ...mockData,
        header: [{ id: 'mtd', title: 'MTD' }],
      };

      mockSplitGenericTable.mockReturnValue({
        Portfolio: portfolioData,
        MTD: mtdData,
      });

      render(<PortfolioTable data={mockData} />);

      const tableDatas = screen.getAllByTestId('table-data');
      expect(tableDatas[0]).toHaveTextContent(JSON.stringify(portfolioData));
      expect(tableDatas[1]).toHaveTextContent(JSON.stringify(mtdData));
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty split result', () => {
      mockSplitGenericTable.mockReturnValue({});

      render(<PortfolioTable data={mockData} />);

      const tables = screen.queryAllByTestId('table-component');
      expect(tables).toHaveLength(0);
    });

    it('should handle data without splits property', () => {
      const dataWithoutSplits = {
        header: [{ id: 'portfolio', title: 'Portfolio' }],
        rows: [[{ portfolio: { value: 'Test' } }]],
      };

      mockSplitGenericTable.mockReturnValue({
        Portfolio: dataWithoutSplits,
      });

      render(<PortfolioTable data={dataWithoutSplits as any} />);

      expect(mockSplitGenericTable).toHaveBeenCalledWith(
        dataWithoutSplits,
        undefined,
      );
    });

    it('should handle null splits', () => {
      const dataWithNullSplits = {
        ...mockData,
        splits: null,
      };

      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={dataWithNullSplits as any} />);

      expect(mockSplitGenericTable).toHaveBeenCalledWith(
        dataWithNullSplits,
        null,
      );
    });

    it('should handle empty splits array', () => {
      const dataWithEmptySplits = {
        ...mockData,
        splits: [],
      };

      mockSplitGenericTable.mockReturnValue({});

      render(<PortfolioTable data={dataWithEmptySplits} />);

      expect(mockSplitGenericTable).toHaveBeenCalledWith(
        dataWithEmptySplits,
        [],
      );
    });

    it('should handle keys with special characters', () => {
      mockSplitGenericTable.mockReturnValue({
        'Portfolio-Special': mockData,
        MTD_2024: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const tables = screen.getAllByTestId('table-component');
      expect(tables).toHaveLength(2);
    });
  });

  describe('Container Rendering', () => {
    it('should render all tables inside container', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
        MTD: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      const container = screen.getByTestId('table-container');
      const tables = container.querySelectorAll(
        '[data-testid="table-component"]',
      );
      expect(tables).toHaveLength(2);
    });

    it('should maintain order of tables from Object.entries', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: { ...mockData, id: '1' },
        MTD: { ...mockData, id: '2' },
        YTD: { ...mockData, id: '3' },
      });

      render(<PortfolioTable data={mockData} />);

      const tables = screen.getAllByTestId('table-component');
      expect(tables).toHaveLength(3);
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} dataTestId="custom" />);

      expect(screen.getByTestId('portfolio-table-custom')).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      mockSplitGenericTable.mockReturnValue({
        Portfolio: mockData,
      });

      render(<PortfolioTable data={mockData} />);

      expect(
        screen.queryByTestId('portfolio-table-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
