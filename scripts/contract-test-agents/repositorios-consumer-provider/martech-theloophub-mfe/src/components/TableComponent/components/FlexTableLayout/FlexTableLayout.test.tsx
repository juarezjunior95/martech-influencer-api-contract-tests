import { fireEvent, render, screen } from '@testing-library/react';

import { TableCellType, TableHeaderType } from '../../types';
import { FlatRow } from '../../utils';
import { FlexTableLayout } from './FlexTableLayout';

const mockHeader: TableHeaderType[] = [
  { id: 'col1', title: 'Column 1' },
  { id: 'col2', title: 'Column 2' },
];

const mockRows: FlatRow[] = [
  {
    row: { col1: { value: 'A1' }, col2: { value: 'B1' } },
    groupIndex: 0,
    rowIndex: 0,
  },
  {
    row: { col1: { value: 'A2' }, col2: { value: 'B2' } },
    groupIndex: 0,
    rowIndex: 1,
  },
];

const mockRenderCell = (cell: TableCellType) => <span>{cell.value}</span>;

const defaultProps = {
  header: mockHeader,
  allRows: mockRows,
  hoveredColumnId: null,
  setHoveredColumnId: jest.fn(),
  handleSortClick: jest.fn(),
  getSortDirection: jest.fn(() => undefined),
  handleCellClick: jest.fn(),
  handleRowClick: jest.fn(),
  renderCell: mockRenderCell,
};

describe('FlexTableLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render table structure', () => {
      render(<FlexTableLayout {...defaultProps} dataTestId="flex-table" />);

      expect(screen.getByTestId('flex-table-table')).toBeInTheDocument();
      expect(screen.getByTestId('flex-table-header')).toBeInTheDocument();
      expect(screen.getByTestId('flex-table-body')).toBeInTheDocument();
    });

    it('should render header cells', () => {
      render(<FlexTableLayout {...defaultProps} dataTestId="flex-table" />);

      expect(
        screen.getByTestId('flex-table-header-cell-0'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('flex-table-header-cell-1'),
      ).toBeInTheDocument();
      expect(screen.getByText('Column 1')).toBeInTheDocument();
      expect(screen.getByText('Column 2')).toBeInTheDocument();
    });

    it('should render rows', () => {
      render(<FlexTableLayout {...defaultProps} dataTestId="flex-table" />);

      expect(screen.getByTestId('flex-table-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('flex-table-row-1')).toBeInTheDocument();
    });

    it('should render cell values', () => {
      render(<FlexTableLayout {...defaultProps} dataTestId="flex-table" />);

      expect(screen.getByText('A1')).toBeInTheDocument();
      expect(screen.getByText('B1')).toBeInTheDocument();
      expect(screen.getByText('A2')).toBeInTheDocument();
      expect(screen.getByText('B2')).toBeInTheDocument();
    });
  });

  describe('Zebra Striping', () => {
    it('should apply zebra striping when enabled', () => {
      render(
        <FlexTableLayout
          {...defaultProps}
          zebraStriping={true}
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByTestId('flex-table-row-0')).toBeInTheDocument();
      expect(screen.getByTestId('flex-table-row-1')).toBeInTheDocument();
    });
  });

  describe('Row Click', () => {
    it('should call handleRowClick when row is clicked and onRowClick is true', () => {
      render(
        <FlexTableLayout
          {...defaultProps}
          onRowClick={true}
          dataTestId="flex-table"
        />,
      );

      fireEvent.click(screen.getByTestId('flex-table-row-0'));

      expect(defaultProps.handleRowClick).toHaveBeenCalledWith(
        mockRows[0].row,
        0,
        0,
      );
    });

    it('should not call handleRowClick when onRowClick is false', () => {
      render(
        <FlexTableLayout
          {...defaultProps}
          onRowClick={false}
          dataTestId="flex-table"
        />,
      );

      fireEvent.click(screen.getByTestId('flex-table-row-0'));

      expect(defaultProps.handleRowClick).not.toHaveBeenCalled();
    });
  });

  describe('Grouped Headers', () => {
    it('should render grouped headers with children', () => {
      const groupedHeader: TableHeaderType[] = [
        {
          id: 'group1',
          title: 'Group 1',
          children: [
            { id: 'sub1', title: 'Sub 1' },
            { id: 'sub2', title: 'Sub 2' },
          ],
        },
      ];

      const groupedRows: FlatRow[] = [
        {
          row: { sub1: { value: 'S1' }, sub2: { value: 'S2' } },
          groupIndex: 0,
          rowIndex: 0,
        },
      ];

      render(
        <FlexTableLayout
          {...defaultProps}
          header={groupedHeader}
          allRows={groupedRows}
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Sub 1')).toBeInTheDocument();
      expect(screen.getByText('Sub 2')).toBeInTheDocument();
    });
  });

  describe('Sortable Columns', () => {
    it('should render sort button for sortable columns', () => {
      const sortableHeader: TableHeaderType[] = [
        { id: 'col1', title: 'Sortable', sortable: true },
      ];

      render(
        <FlexTableLayout
          {...defaultProps}
          header={sortableHeader}
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByTestId('flex-table-sort-col1')).toBeInTheDocument();
    });

    it('should call handleSortClick when sort button is clicked', () => {
      const sortableHeader: TableHeaderType[] = [
        { id: 'col1', title: 'Sortable', sortable: true },
      ];

      render(
        <FlexTableLayout
          {...defaultProps}
          header={sortableHeader}
          dataTestId="flex-table"
        />,
      );

      fireEvent.click(screen.getByTestId('flex-table-sort-col1'));

      expect(defaultProps.handleSortClick).toHaveBeenCalledWith('col1');
    });
  });

  describe('Highlight Features', () => {
    it('should render with highlightedItems prop', () => {
      const rowsWithSegment: FlatRow[] = [
        {
          row: {
            col1: { value: 'A1' },
            col2: { value: 'B1' },
            segment: { value: 'Male' },
          },
          groupIndex: 0,
          rowIndex: 0,
        },
      ];

      render(
        <FlexTableLayout
          {...defaultProps}
          allRows={rowsWithSegment}
          highlightedItems={['Male']}
          highlightField="segment"
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByTestId('flex-table-body')).toBeInTheDocument();
    });

    it('should highlight row when segment matches highlighted item ignoring whitespace', () => {
      const rowsWithSegment: FlatRow[] = [
        {
          row: {
            col1: { value: 'A1' },
            col2: { value: 'B1' },
            segment: { value: 'LDA-24' },
          },
          groupIndex: 0,
          rowIndex: 0,
        },
      ];

      render(
        <FlexTableLayout
          {...defaultProps}
          allRows={rowsWithSegment}
          highlightedItems={['LDA - 24']}
          highlightField="segment"
          highlightStyle={{ backgroundColor: 'rgb(255, 0, 0)' }}
          dataTestId="flex-table"
        />,
      );

      const row = screen.getByTestId('flex-table-row-0');
      expect(row).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
    });

    it('should render with highlightStyle prop', () => {
      render(
        <FlexTableLayout
          {...defaultProps}
          highlightStyle={{
            backgroundColor: '#FFFEF0',
            borderLeft: '4px solid #EDCD20',
          }}
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByTestId('flex-table-body')).toBeInTheDocument();
    });
  });

  describe('Column Border Features', () => {
    it('should render with headerOnlyColumnBorder prop', () => {
      const groupedHeader: TableHeaderType[] = [
        {
          id: 'group1',
          title: 'Group 1',
          children: [
            { id: 'sub1', title: 'Sub 1' },
            { id: 'sub2', title: 'Sub 2' },
          ],
        },
      ];

      render(
        <FlexTableLayout
          {...defaultProps}
          header={groupedHeader}
          headerOnlyColumnBorder
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByTestId('flex-table-header')).toBeInTheDocument();
    });

    it('should render with columnBorder prop', () => {
      render(
        <FlexTableLayout
          {...defaultProps}
          columnBorder
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByTestId('flex-table-body')).toBeInTheDocument();
    });
  });

  describe('Hover Features', () => {
    it('should render with hoverRowColumn prop', () => {
      render(
        <FlexTableLayout
          {...defaultProps}
          hoverRowColumn
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByTestId('flex-table-body')).toBeInTheDocument();
    });

    it('should render with rowHover prop', () => {
      render(
        <FlexTableLayout {...defaultProps} rowHover dataTestId="flex-table" />,
      );

      expect(screen.getByTestId('flex-table-body')).toBeInTheDocument();
    });

    it('should render with cellHover prop', () => {
      render(
        <FlexTableLayout {...defaultProps} cellHover dataTestId="flex-table" />,
      );

      expect(screen.getByTestId('flex-table-body')).toBeInTheDocument();
    });
  });

  describe('Row Group Label', () => {
    it('should render with vertical rowGroupLabel', () => {
      const rowsWithGroup: FlatRow[] = [
        {
          row: { col1: { value: 'A1' }, rowGroupLabel: 'Gender' },
          groupIndex: 0,
          rowIndex: 0,
        },
      ];

      render(
        <FlexTableLayout
          {...defaultProps}
          allRows={rowsWithGroup}
          rowGroupLabel="vertical"
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByTestId('flex-table-body')).toBeInTheDocument();
    });

    it('should render with horizontal rowGroupLabel', () => {
      const rowsWithGroup: FlatRow[] = [
        {
          row: { col1: { value: 'A1' }, rowGroupLabel: 'Gender' },
          groupIndex: 0,
          rowIndex: 0,
        },
      ];

      render(
        <FlexTableLayout
          {...defaultProps}
          allRows={rowsWithGroup}
          rowGroupLabel="horizontal"
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByTestId('flex-table-body')).toBeInTheDocument();
    });
  });

  describe('Grouped header with sub-columns', () => {
    it('should render parent group title and child column titles', () => {
      const groupedHeader: TableHeaderType[] = [
        {
          id: 'group1',
          title: 'Beer',
          children: [
            { id: 'volume', title: 'Volume' },
            { id: 'index', title: 'Index' },
          ],
        },
      ];

      render(
        <FlexTableLayout
          {...defaultProps}
          header={groupedHeader}
          dataTestId="flex-table"
        />,
      );

      expect(screen.getByText('Beer')).toBeInTheDocument();
      expect(screen.getByText('Volume')).toBeInTheDocument();
      expect(screen.getByText('Index')).toBeInTheDocument();
    });
  });
});
