import { render, screen } from '@testing-library/react';
import { TableDataType } from 'components/Table/types';
import { useFeatureToggle } from 'hooks';

import { POSBookTable } from './POSBookTable';

const mockTableData: TableDataType & { empty?: boolean } = {
  header: [
    { id: 'country', title: 'Country' },
    { id: 'volume', title: 'Volume' },
  ],
  rows: [
    [
      {
        country: { value: 'Brazil' },
        volume: {
          value: '100',
          chartData: { data: [10, 20, 30], backgroundColor: ['#F0DF78'] },
        },
      },
      {
        country: { value: 'USA' },
        volume: {
          value: '200',
          chartData: { data: [15, 25, 35], backgroundColor: ['#A1CFF4'] },
        },
      },
      {
        country: { value: 'Mexico' },
        volume: {
          value: '150',
          chartData: { data: [5, 15, 40], backgroundColor: ['#A1E3BC'] },
        },
      },
    ],
  ],
};

const mockConfig = {
  country: { minWidth: 150 },
  volume: { minWidth: 100 },
};

jest.mock('hooks', () => ({
  useFeatureToggle: jest.fn(() => [false, false]),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      category: {
        submenus: {
          posBook: {
            disableUsa: 'DISABLE_USA_TOGGLE',
          },
        },
      },
    },
  },
}));

jest.mock('components', () => ({
  Table: ({
    data,
    chartType,
    headerHeight,
    groupHeaderHeight,
    scrollbarWidth,
    columnDefsConfig,
    rowHeight,
    style,
    emptyRow,
    context,
    suppressColumnVirtualisation,
    suppressRowVirtualisation,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId || 'table'}
      data-chart-type={chartType}
      data-header-height={headerHeight}
      data-group-header-height={groupHeaderHeight}
      data-scrollbar-width={scrollbarWidth}
      data-row-height={rowHeight}
      data-style={style}
      data-empty-row-add-on-start={emptyRow?.addOnStart}
      data-has-column-defs-config={!!columnDefsConfig}
      data-context-pos-kpi={context?.posKpi}
      data-has-context-column-max-values={!!context?.columnMaxValues}
      data-suppress-column-virtualisation={suppressColumnVirtualisation}
      data-suppress-row-virtualisation={suppressRowVirtualisation}
    >
      Table Component
      {data && (
        <div data-testid="table-rows-count">{data.rows?.length || 0}</div>
      )}
      {data && (
        <div data-testid="table-first-group-count">
          {data.rows?.[0]?.length || 0}
        </div>
      )}
    </div>
  ),
  Skeleton: ({ width, height, length, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'skeleton'}
      data-width={width}
      data-height={height}
      data-length={length}
    >
      Loading Skeleton
    </div>
  ),
  ColumnDefsConfig: {} as any,
}));

jest.mock('components/Skeleton', () => ({
  Skeleton: ({ width, height, length, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'skeleton'}
      data-width={width}
      data-height={height}
      data-length={length}
    >
      Loading Skeleton
    </div>
  ),
}));

jest.mock('pages/pillars/Category/POSBook/components', () => ({
  NoDataAvailable: ({ dataTestId }: any) => (
    <div
      data-testid={
        dataTestId ? `no-data-available-${dataTestId}` : 'no-data-available'
      }
    >
      No Data Available
    </div>
  ),
}));

jest.mock('./POSBookTable.styles', () => ({
  StyledPOSBookTableContainer: 'mock-styled-pos-book-table-container',
}));

describe('POSBookTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useFeatureToggle as jest.Mock).mockReturnValue([false, false]);
  });

  describe('Loading State', () => {
    it('renders Skeleton when loading is true', () => {
      render(
        <POSBookTable
          loading={true}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.getByText('Loading Skeleton')).toBeInTheDocument();
    });

    it('does not render Table when loading', () => {
      render(
        <POSBookTable
          loading={true}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    });

    it('does not render NoDataAvailable when loading', () => {
      render(
        <POSBookTable
          loading={true}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.queryByTestId('no-data-available')).not.toBeInTheDocument();
    });

    it('Skeleton has correct dimensions', () => {
      render(
        <POSBookTable
          loading={true}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-width', '1290px');
      expect(skeleton).toHaveAttribute('data-height', '684px');
      expect(skeleton).toHaveAttribute('data-length', '1');
    });
  });

  describe('Empty Data State', () => {
    it('renders NoDataAvailable when data.empty is true', () => {
      const emptyData = { ...mockTableData, empty: true };

      render(
        <POSBookTable loading={false} data={emptyData} config={mockConfig} />,
      );

      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.getByText('No Data Available')).toBeInTheDocument();
    });

    it('does not render Table when data is empty', () => {
      const emptyData = { ...mockTableData, empty: true };

      render(
        <POSBookTable loading={false} data={emptyData} config={mockConfig} />,
      );

      expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    });

    it('does not render Skeleton when data is empty but not loading', () => {
      const emptyData = { ...mockTableData, empty: true };

      render(
        <POSBookTable loading={false} data={emptyData} config={mockConfig} />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });
  });

  describe('Table Rendering', () => {
    it('renders Table when loading is false and data is not empty', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
      expect(screen.getByText('Table Component')).toBeInTheDocument();
    });

    it('does not render Skeleton when showing Table', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    it('does not render NoDataAvailable when showing Table', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.queryByTestId('no-data-available')).not.toBeInTheDocument();
    });
  });

  describe('Table Configuration', () => {
    it('passes chartType as single-bar', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-chart-type', 'single-bar');
    });

    it('passes headerHeight as 0', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-header-height', '0');
    });

    it('passes default groupHeaderHeight as 64', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-group-header-height', '64');
    });

    it('passes custom groupHeaderHeight when provided', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          groupHeaderHeight={80}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-group-header-height', '80');
    });

    it('passes scrollbarWidth as 0', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-scrollbar-width', '0');
    });

    it('passes rowHeight as 44', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-row-height', '44');
    });

    it('passes columnDefsConfig', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-has-column-defs-config', 'true');
    });

    it('passes style as StyledPOSBookTableContainer', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute(
        'data-style',
        'mock-styled-pos-book-table-container',
      );
    });
  });

  describe('Empty Row Configuration', () => {
    it('passes emptyRow with addOnStart true', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-empty-row-add-on-start', 'true');
    });
  });

  describe('Virtualisation Configuration', () => {
    it('passes suppressColumnVirtualisation as true', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute(
        'data-suppress-column-virtualisation',
        'true',
      );
    });

    it('passes suppressRowVirtualisation as true', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-suppress-row-virtualisation', 'true');
    });
  });

  describe('Context Props', () => {
    it('passes posKpi in context when provided', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          posKpi="volume"
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-context-pos-kpi', 'volume');
    });

    it('passes columnMaxValues in context', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute(
        'data-has-context-column-max-values',
        'true',
      );
    });
  });

  describe('USA Feature Toggle', () => {
    it('includes USA rows when feature toggle is disabled', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([false, false]);

      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const firstGroupCount = screen.getByTestId('table-first-group-count');
      expect(firstGroupCount).toHaveTextContent('3');
    });

    it('filters out USA rows when feature toggle is enabled', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);

      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const firstGroupCount = screen.getByTestId('table-first-group-count');
      expect(firstGroupCount).toHaveTextContent('2');
    });

    it('includes USA rows when feature toggle is loading', () => {
      (useFeatureToggle as jest.Mock).mockReturnValue([true, true]);

      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const firstGroupCount = screen.getByTestId('table-first-group-count');
      expect(firstGroupCount).toHaveTextContent('3');
    });

    it('calls useFeatureToggle with correct toggle key', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(useFeatureToggle).toHaveBeenCalledWith('DISABLE_USA_TOGGLE');
    });
  });

  describe('Column Max Values Calculation', () => {
    it('calculates columnMaxValues from chartData', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute(
        'data-has-context-column-max-values',
        'true',
      );
    });

    it('handles data without chartData gracefully', () => {
      const dataWithoutChart = {
        header: [{ id: 'country', title: 'Country' }],
        rows: [[{ country: { value: 'Brazil' } }]],
      };

      render(
        <POSBookTable
          loading={false}
          data={dataWithoutChart}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
    });
  });

  describe('Component Stability', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();

      rerender(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
    });

    it('transitions from loading to loaded', () => {
      const { rerender } = render(
        <POSBookTable
          loading={true}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('table')).not.toBeInTheDocument();

      rerender(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('table')).toBeInTheDocument();
    });

    it('transitions from loaded to empty', () => {
      const { rerender } = render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();

      const emptyData = { ...mockTableData, empty: true };
      rerender(
        <POSBookTable loading={false} data={emptyData} config={mockConfig} />,
      );

      expect(screen.queryByTestId('table')).not.toBeInTheDocument();
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined rows gracefully', () => {
      const dataWithoutRows = { header: [], rows: undefined };

      render(
        <POSBookTable
          loading={false}
          data={dataWithoutRows as any}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
    });

    it('handles empty rows array', () => {
      const dataWithEmptyRows = { header: [], rows: [] };

      render(
        <POSBookTable
          loading={false}
          data={dataWithEmptyRows}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
      const rowsCount = screen.getByTestId('table-rows-count');
      expect(rowsCount).toHaveTextContent('0');
    });

    it('handles data without header', () => {
      const dataWithoutHeader = { rows: mockTableData.rows };

      render(
        <POSBookTable
          loading={false}
          data={dataWithoutHeader as any}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
    });
  });

  describe('Props Combinations', () => {
    it('loading takes precedence over empty data', () => {
      const emptyData = { ...mockTableData, empty: true };

      render(
        <POSBookTable loading={true} data={emptyData} config={mockConfig} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('no-data-available')).not.toBeInTheDocument();
      expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    });

    it('renders with all optional props', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          groupHeaderHeight={100}
          posKpi="sales"
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-group-header-height', '100');
      expect(table).toHaveAttribute('data-context-pos-kpi', 'sales');
    });
  });

  describe('data-testid', () => {
    it('should propagate dataTestId to Table when provided', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          dataTestId="pos-book-table"
        />,
      );

      expect(screen.getByTestId('pos-book-table')).toBeInTheDocument();
    });

    it('should propagate dataTestId to Skeleton when loading', () => {
      render(
        <POSBookTable
          loading={true}
          data={mockTableData}
          config={mockConfig}
          dataTestId="pos-book-table"
        />,
      );

      expect(screen.getByTestId('skeleton-pos-book-table')).toBeInTheDocument();
    });

    it('should propagate dataTestId to NoDataAvailable when empty', () => {
      const emptyData = { ...mockTableData, empty: true };

      render(
        <POSBookTable
          loading={false}
          data={emptyData}
          config={mockConfig}
          dataTestId="pos-book-table"
        />,
      );

      expect(
        screen.getByTestId('no-data-available-pos-book-table'),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid on Table when not provided', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const table = screen.getByTestId('table');
      expect(table).toHaveAttribute('data-testid', 'table');
    });

    it('should not render custom data-testid on Skeleton when not provided', () => {
      render(
        <POSBookTable
          loading={true}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-testid', 'skeleton');
    });

    it('should not render custom data-testid on NoDataAvailable when not provided', () => {
      const emptyData = { ...mockTableData, empty: true };

      render(
        <POSBookTable loading={false} data={emptyData} config={mockConfig} />,
      );

      const noData = screen.getByTestId('no-data-available');
      expect(noData).toHaveAttribute('data-testid', 'no-data-available');
    });

    it('should use custom dataTestId value', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          dataTestId="custom-table"
        />,
      );

      expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    });

    it('should follow kebab-case naming convention', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          dataTestId="my-custom-pos-table"
        />,
      );

      expect(screen.getByTestId('my-custom-pos-table')).toBeInTheDocument();
    });

    it('should handle undefined dataTestId gracefully', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          dataTestId={undefined}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
    });

    it('should handle empty string dataTestId gracefully', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          dataTestId=""
        />,
      );

      // Should render with default testid when empty string
      expect(screen.getByTestId('table')).toBeInTheDocument();
    });

    it('should not cause visual changes when dataTestId is added', () => {
      const { container: withoutTestId } = render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      const { container: withTestId } = render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          dataTestId="test"
        />,
      );

      // Both should render the table component
      expect(
        withoutTestId.querySelector('[data-testid="table"]'),
      ).toBeInTheDocument();
      expect(
        withTestId.querySelector('[data-testid="test"]'),
      ).toBeInTheDocument();
    });

    it('should work with all other props when dataTestId is provided', () => {
      render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
          groupHeaderHeight={100}
          posKpi="sales"
          dataTestId="pos-book-table"
        />,
      );

      const table = screen.getByTestId('pos-book-table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('data-group-header-height', '100');
      expect(table).toHaveAttribute('data-context-pos-kpi', 'sales');
    });
  });

  describe('Null/Undefined data', () => {
    it('renders NoDataAvailable when data is null and not loading', () => {
      render(
        <POSBookTable loading={false} data={null as any} config={mockConfig} />,
      );

      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    });

    it('renders NoDataAvailable when data is undefined and not loading', () => {
      render(
        <POSBookTable
          loading={false}
          data={undefined as any}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.queryByTestId('table')).not.toBeInTheDocument();
    });

    it('renders Skeleton when loading is true even if data is null', () => {
      render(
        <POSBookTable loading={true} data={null as any} config={mockConfig} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('no-data-available')).not.toBeInTheDocument();
    });

    it('does not crash when data transitions from valid to null', () => {
      const { rerender } = render(
        <POSBookTable
          loading={false}
          data={mockTableData}
          config={mockConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();

      rerender(
        <POSBookTable loading={false} data={null as any} config={mockConfig} />,
      );

      expect(screen.queryByTestId('table')).not.toBeInTheDocument();
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });
  });
});
