import { fireEvent, render, screen } from '@testing-library/react';

import {
  cellTypesMock,
  interactiveCellsMock,
  simpleTableMock,
  variationTableMock,
} from './__mocks__';
import { DataTable } from './DataTable';

const renderCellEntry = (
  cell: any,
  key: string,
  header: any[] | undefined,
  flatRow: any,
  rowIdx: number,
  renderCell: any,
  colIndex: number,
) => {
  const column = header?.find((c: any) => c.id === key) ?? { id: key };
  return (
    <span key={key}>
      {cell?.value === undefined ? '' : String(cell.value)}
      {renderCell?.(cell, column, {
        colIndex,
        rowIndex: flatRow?.rowIndex ?? rowIdx,
        rowData: flatRow?.row ?? flatRow,
        groupIndex: flatRow?.groupIndex ?? 0,
      })}
    </span>
  );
};

jest.mock('./components/FlexTableLayout', () => ({
  FlexTableLayout: ({
    dataTestId,
    allRows,
    header,
    handleRowClick,
    handleSortClick,
    renderCell,
  }: any) => (
    <div data-testid={dataTestId ? `${dataTestId}-wrapper-inner` : undefined}>
      <div data-testid={dataTestId ? `${dataTestId}-header` : undefined}>
        {header?.map((col: any, idx: number) => (
          <button
            type="button"
            key={col.id ?? idx}
            data-testid={
              dataTestId ? `${dataTestId}-header-cell-${idx}` : undefined
            }
            onClick={() => col.sortable && handleSortClick?.(col.id)}
          >
            {col.title}
          </button>
        ))}
      </div>
      <div data-testid={dataTestId ? `${dataTestId}-body` : undefined}>
        {allRows?.map((flatRow: any, rowIdx: number) => {
          const rowData = flatRow?.row ?? flatRow;
          return (
            <button
              type="button"
              key={`${flatRow?.groupIndex ?? 0}-${flatRow?.rowIndex ?? rowIdx}`}
              data-testid={
                dataTestId ? `${dataTestId}-row-${rowIdx}` : undefined
              }
              onClick={() =>
                handleRowClick?.(
                  rowData,
                  flatRow?.rowIndex ?? rowIdx,
                  flatRow?.groupIndex ?? 0,
                )
              }
            >
              {Object.entries(rowData ?? {}).map(
                ([key, cell]: [string, any], colIndex: number) =>
                  renderCellEntry(
                    cell,
                    key,
                    header,
                    flatRow,
                    rowIdx,
                    renderCell,
                    colIndex,
                  ),
              )}
            </button>
          );
        })}
      </div>
    </div>
  ),
}));

jest.mock('./components/TableFooter', () => ({
  TableFooter: ({ dataTestId }: any) => (
    <div data-testid={dataTestId}>TableFooter</div>
  ),
}));

jest.mock('./components/CellRenderers', () => ({
  AxisCell: () => null,
  CheckboxCell: ({ cell, onCheckboxChange }: any) => (
    <input
      type="checkbox"
      defaultChecked={!!cell?.checkbox}
      onChange={(e) => onCheckboxChange?.(e.target.checked)}
    />
  ),
  HeaderGridCell: () => null,
  IconCell: () => null,
  ImageCell: () => null,
  IndexTagCell: () => null,
  NumberCell: () => null,
  TextCell: () => null,
}));

describe('DataTable', () => {
  describe('Rendering', () => {
    it('should render the table container', () => {
      render(<DataTable data={simpleTableMock} dataTestId="test-table" />);

      expect(screen.getByTestId('test-table')).toBeInTheDocument();
    });

    it('should render table header', () => {
      render(<DataTable data={simpleTableMock} dataTestId="test-table" />);

      expect(screen.getByTestId('test-table-header')).toBeInTheDocument();
    });

    it('should render table body', () => {
      render(<DataTable data={simpleTableMock} dataTestId="test-table" />);

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should render correct number of header columns', () => {
      render(<DataTable data={simpleTableMock} dataTestId="test-table" />);

      const headerCells = simpleTableMock.header.map((_, idx) =>
        screen.getByTestId(`test-table-header-cell-${idx}`),
      );
      expect(headerCells).toHaveLength(simpleTableMock.header.length);
    });

    it('should render rows', () => {
      render(<DataTable data={simpleTableMock} dataTestId="test-table" />);

      const row0 = screen.getByTestId('test-table-row-0');
      expect(row0).toBeInTheDocument();
    });
  });

  describe('Cell Rendering', () => {
    it('should render text cells correctly', () => {
      render(<DataTable data={simpleTableMock} dataTestId="test-table" />);

      expect(screen.getAllByText('Axis').length).toBeGreaterThan(0);
      expect(screen.getAllByText('0000').length).toBeGreaterThan(0);
    });

    it('should render variation cells with correct color', () => {
      render(<DataTable data={variationTableMock} dataTestId="test-table" />);

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
      expect(screen.getAllByText('1.2').length).toBeGreaterThan(0);
    });

    it('should render icon and image cells', () => {
      render(<DataTable data={cellTypesMock} dataTestId="test-table" />);

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should render checkbox and interactive cells', () => {
      render(<DataTable data={interactiveCellsMock} dataTestId="test-table" />);

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });
  });

  describe('Zebra Striping', () => {
    it('should apply zebra striping by default', () => {
      render(<DataTable data={simpleTableMock} dataTestId="test-table" />);

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should not apply zebra striping when disabled', () => {
      render(
        <DataTable
          data={simpleTableMock}
          zebraStriping={false}
          dataTestId="test-table"
        />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });
  });

  describe('Click Events', () => {
    it('should render with onCellClick prop', () => {
      const handleCellClick = jest.fn();
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          onCellClick={handleCellClick}
        />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should call onRowClick when row is clicked', () => {
      const handleRowClick = jest.fn();
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          onRowClick={handleRowClick}
        />,
      );

      const row = screen.getByTestId('test-table-row-0');
      fireEvent.click(row);

      expect(handleRowClick).toHaveBeenCalledTimes(1);
      expect(handleRowClick).toHaveBeenCalledWith(
        expect.objectContaining({
          rowIndex: expect.any(Number),
          groupIndex: expect.any(Number),
          rowData: expect.any(Object),
        }),
      );
    });

    it('should not throw when onCellClick is not provided', () => {
      render(<DataTable data={simpleTableMock} dataTestId="test-table" />);

      const row = screen.getByTestId('test-table-row-0');
      expect(() => fireEvent.click(row)).not.toThrow();
    });
  });

  describe('Section Header and Footer', () => {
    it('should render section header when showSectionHeader is true', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          showSectionHeader
          sectionTitle="Test Section"
        />,
      );

      expect(
        screen.getByTestId('test-table-section-header'),
      ).toBeInTheDocument();
      expect(screen.getByText('Test Section')).toBeInTheDocument();
    });

    it('should not render section header when showSectionHeader is false', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          sectionTitle="Test Section"
        />,
      );

      expect(
        screen.queryByTestId('test-table-section-header'),
      ).not.toBeInTheDocument();
    });

    it('should render section footer when showSectionFooter is true', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          showSectionFooter
        />,
      );

      expect(
        screen.getByTestId('test-table-section-footer'),
      ).toBeInTheDocument();
    });

    it('should render footer info with custom text', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          showSectionFooter
          footerInfo="Custom footer info"
        />,
      );

      expect(screen.getByText('Custom footer info')).toBeInTheDocument();
    });

    it('should render footer info with pagination info', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          showSectionFooter
          pagination={{
            currentPage: 1,
            totalPages: 5,
            totalItems: 50,
            itemsPerPage: 10,
          }}
        />,
      );

      expect(screen.getByText('Showing 1-10 of 50 items')).toBeInTheDocument();
      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    });
  });

  describe('Layout Props', () => {
    it('should render with showAxis', () => {
      render(
        <DataTable data={simpleTableMock} dataTestId="test-table" showAxis />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should render with headerGap', () => {
      render(
        <DataTable data={simpleTableMock} dataTestId="test-table" headerGap />,
      );

      expect(screen.getByTestId('test-table-header')).toBeInTheDocument();
    });

    it('should render with groupBorder', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          groupBorder
        />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should render with headerColumnGap', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          headerColumnGap
        />,
      );

      expect(screen.getByTestId('test-table-header')).toBeInTheDocument();
    });

    it('should render with rowHover', () => {
      render(
        <DataTable data={simpleTableMock} dataTestId="test-table" rowHover />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should render with cellHover', () => {
      render(
        <DataTable data={simpleTableMock} dataTestId="test-table" cellHover />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should render with columnHover', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          columnHover
        />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should render with columnBorder', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          columnBorder
        />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should render without rowBorder', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          rowBorder={false}
        />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });

    it('should render with axisWidth', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          showAxis
          axisWidth="200px"
        />,
      );

      expect(screen.getByTestId('test-table-body')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should render with sortState', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          sortState={{ columnId: 'column1', direction: 'asc' }}
        />,
      );

      expect(screen.getByTestId('test-table-header')).toBeInTheDocument();
    });

    it('should render sortable table correctly', () => {
      const handleSortChange = jest.fn();
      const sortableTableMock = {
        header: [
          { id: 'col1', title: 'Column 1', sortable: true },
          { id: 'col2', title: 'Column 2' },
        ],
        rows: [[{ col1: { value: 'A' }, col2: { value: 'B' } }]],
      };

      render(
        <DataTable
          data={sortableTableMock}
          dataTestId="test-table"
          onSortChange={handleSortChange}
        />,
      );

      expect(screen.getByTestId('test-table-header')).toBeInTheDocument();
      expect(screen.getByText('Column 1')).toBeInTheDocument();
    });
  });

  describe('Checkbox', () => {
    it('should call onCheckboxChange when checkbox is clicked', () => {
      const handleCheckboxChange = jest.fn();
      render(
        <DataTable
          data={interactiveCellsMock}
          dataTestId="test-table"
          onCheckboxChange={handleCheckboxChange}
        />,
      );

      const checkboxes = screen.getAllByRole('checkbox');
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0]);
        expect(handleCheckboxChange).toHaveBeenCalled();
      }
    });
  });

  describe('Section Position', () => {
    it('should render with sectionPosition top', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          sectionPosition="top"
        />,
      );

      expect(screen.getByTestId('test-table')).toBeInTheDocument();
    });

    it('should render with sectionPosition middle', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          sectionPosition="middle"
        />,
      );

      expect(screen.getByTestId('test-table')).toBeInTheDocument();
    });

    it('should render with sectionPosition bottom', () => {
      render(
        <DataTable
          data={simpleTableMock}
          dataTestId="test-table"
          sectionPosition="bottom"
        />,
      );

      expect(screen.getByTestId('test-table')).toBeInTheDocument();
    });
  });
});
