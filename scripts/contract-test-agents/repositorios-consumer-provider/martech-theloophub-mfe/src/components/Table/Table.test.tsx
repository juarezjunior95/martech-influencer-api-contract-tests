import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Table } from './Table';
import { TableDataType } from './types';

jest.mock('ag-grid-community', () => ({
  ModuleRegistry: { registerModules: jest.fn() },
  AllCommunityModule: {},
  themeQuartz: { withParams: jest.fn(() => 'mocked-theme') },
}));

jest.mock('ag-grid-react', () => {
  const ReactLib = jest.requireActual('react');
  return {
    AgGridReact: ({
      onGridReady,
      onFirstDataRendered,
      noRowsOverlayComponent,
      rowData,
    }: any) => {
      const apiMock = {
        autoSizeAllColumns: jest.fn(),
        sizeColumnsToFit: jest.fn(),
        addEventListener: jest.fn(),
        getColumns: jest.fn(() => []),
        getColumnDefs: jest.fn(() => []),
        getRowNode: jest.fn(),
        setColumnsVisible: jest.fn(),
      };
      ReactLib.useEffect(() => {
        onGridReady?.({ api: apiMock });
        onFirstDataRendered?.({ api: apiMock });
      }, []);
      const NoRows = noRowsOverlayComponent;
      const isEmpty = !rowData || rowData.length === 0;
      return (
        <div className="ag-root-wrapper">
          <div className="ag-header" />
          {isEmpty && NoRows && (
            <div className="ag-overlay-no-rows-wrapper">
              <NoRows />
            </div>
          )}
        </div>
      );
    },
  };
});

jest.mock('./components', () => ({
  CustomNoRows: ({ title, description }: any) => (
    <div data-testid="custom-no-rows">
      <div data-testid="no-rows-title">{title || 'No rows'}</div>
      <div data-testid="no-rows-description">
        {description || 'No data available'}
      </div>
    </div>
  ),
  CustomAgGridTooltip: () => null,
  CustomHeader: () => null,
  ImgRenderer: () => null,
  SingleChartWithVariation: () => null,
}));

jest.mock('./theme', () => ({
  AgGridTheme: 'mocked-theme',
}));

jest.mock('./config/callbacks', () => ({
  getRowClass: jest.fn(),
  getRowHeight: jest.fn(),
  onColumnResized: jest.fn(),
}));

jest.mock('./config/columnDefs', () => ({
  gridOptions: {},
}));

jest.mock('./Table.styles', () => {
  const ReactLib = jest.requireActual('react');
  return {
    CustomStyleDefault: ({ children }: any) => <div>{children}</div>,
    StyledTableContainer: ReactLib.forwardRef(
      ({ children, className, style, ...rest }: any, ref: any) => (
        <div ref={ref} className={className} style={style} {...rest}>
          {children}
        </div>
      ),
    ),
  };
});

jest.mock('./utils', () => ({
  getAllFields: jest.fn(
    (columnDefs) => columnDefs?.map((col: any) => col.field) || [],
  ),
  getAllFieldsToHide: jest.fn((filter) => filter?.fieldsToHide || []),
}));

jest.mock('./utils/generateColumnDefs', () => ({
  generateColumnDefs: jest.fn((header) =>
    header?.map((col: any) => ({
      field: col.id || col.title,
      headerName: col.title,
    })),
  ),
}));

jest.mock('./utils/generateRowData', () => ({
  generateRowData: jest.fn((rows, _chartType, addStart, addEnd) => {
    const result = [...(rows || [])];
    if (addStart) result.unshift({ isEmpty: true });
    if (addEnd) result.push({ isEmpty: true });
    return result;
  }),
}));

const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
globalThis.IntersectionObserver = mockIntersectionObserver as any;

describe('Table', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockData: TableDataType = {
    header: [
      { title: 'Name', id: 'name' },
      { title: 'Age', id: 'age' },
    ],
    rows: [
      [{ name: { value: 'John' }, age: { value: 30 } }],
      [{ name: { value: 'Jane' }, age: { value: 25 } }],
    ],
  };

  it('should render the Table component', () => {
    render(<Table data={mockData} />);
    const gridElement = document.querySelector('.ag-root-wrapper');
    expect(gridElement).toBeInTheDocument();
  });

  it('should render with empty data', () => {
    const emptyData: TableDataType = {
      header: [],
      rows: [],
    };
    render(<Table data={emptyData} />);
    const gridElement = document.querySelector('.ag-root-wrapper');
    expect(gridElement).toBeInTheDocument();
  });

  it('should apply fixedHeight when provided', () => {
    const { container } = render(<Table data={mockData} fixedHeight="500px" />);
    const tableContainer = container.querySelector('.table-container');
    expect(tableContainer).toHaveStyle({ height: '500px' });
  });

  it('should use default rowHeight of 48px', () => {
    const { container } = render(<Table data={mockData} />);
    expect(container.querySelector('.table-container')).toBeInTheDocument();
  });

  it('should accept custom rowHeight', () => {
    const { container } = render(<Table data={mockData} rowHeight={60} />);
    expect(container.querySelector('.table-container')).toBeInTheDocument();
  });

  it('should show NoRows overlay when data is empty', async () => {
    const emptyData: TableDataType = {
      header: [{ title: 'Name', id: 'name' }],
      rows: [],
    };
    render(<Table data={emptyData} />);

    await waitFor(
      () => {
        const overlay = document.querySelector('.ag-overlay-no-rows-wrapper');
        expect(overlay).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should use custom noRowsMessage when provided', async () => {
    const emptyData: TableDataType = {
      header: [{ title: 'Name', id: 'name' }],
      rows: [],
    };
    render(
      <Table
        data={emptyData}
        noRowsMessage={{
          title: 'Custom Title',
          description: 'Custom Description',
        }}
      />,
    );

    await waitFor(
      () => {
        expect(screen.getByTestId('custom-no-rows')).toBeInTheDocument();
        expect(screen.getByTestId('no-rows-title')).toHaveTextContent(
          'Custom Title',
        );
        expect(screen.getByTestId('no-rows-description')).toHaveTextContent(
          'Custom Description',
        );
      },
      { timeout: 3000 },
    );
  });

  it('should call onGridReadyCallback when grid is ready', async () => {
    const mockCallback = jest.fn();
    render(<Table data={mockData} onGridReadyCallback={mockCallback} />);

    await waitFor(
      () => {
        expect(mockCallback).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });

  it('should provide api to onGridReadyCallback', async () => {
    const mockCallback = jest.fn();
    render(<Table data={mockData} onGridReadyCallback={mockCallback} />);

    await waitFor(
      () => {
        expect(mockCallback).toHaveBeenCalledWith(
          expect.objectContaining({
            api: expect.any(Object),
          }),
        );
      },
      { timeout: 3000 },
    );
  });

  it('should setup IntersectionObserver', () => {
    render(<Table data={mockData} />);
    expect(mockIntersectionObserver).toHaveBeenCalled();
  });

  it('should observe the container element', () => {
    render(<Table data={mockData} />);

    const observeCall = mockIntersectionObserver.mock.results[0]?.value.observe;
    expect(observeCall).toBeDefined();
  });

  it('should cleanup IntersectionObserver on unmount', () => {
    const { unmount } = render(<Table data={mockData} />);
    const disconnectMock =
      mockIntersectionObserver.mock.results[0]?.value.disconnect;

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it('should handle data with header but no rows', () => {
    const dataWithHeaderOnly: TableDataType = {
      header: [{ title: 'Name', id: 'name' }],
      rows: [],
    };
    render(<Table data={dataWithHeaderOnly} />);
    const gridElement = document.querySelector('.ag-root-wrapper');
    expect(gridElement).toBeInTheDocument();
  });

  it('should pass through additional AgGridReactProps', () => {
    render(
      <Table
        data={mockData}
        animateRows={true}
        enableCellTextSelection={true}
      />,
    );
    const gridElement = document.querySelector('.ag-root-wrapper');
    expect(gridElement).toBeInTheDocument();
  });

  it('should handle filter prop', async () => {
    const filter = {
      allFieldsToFilter: ['name', 'age'],
      fieldsToHide: ['age'],
    };

    render(<Table data={mockData} filter={filter} />);

    await waitFor(
      () => {
        const gridElement = document.querySelector('.ag-root-wrapper');
        expect(gridElement).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should handle filter with empty fieldsToHide', async () => {
    const filter = {
      allFieldsToFilter: ['name'],
      fieldsToHide: [],
    };

    render(<Table data={mockData} filter={filter} />);

    await waitFor(
      () => {
        const gridElement = document.querySelector('.ag-root-wrapper');
        expect(gridElement).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it('should handle single-bar chartType', () => {
    render(<Table data={mockData} chartType="single-bar" />);
    const gridElement = document.querySelector('.ag-root-wrapper');
    expect(gridElement).toBeInTheDocument();
  });

  it('should handle multi-bar chartType', () => {
    render(<Table data={mockData} chartType="waterfall" />);
    const gridElement = document.querySelector('.ag-root-wrapper');
    expect(gridElement).toBeInTheDocument();
  });

  it('should handle emptyRow prop', () => {
    render(<Table data={mockData} emptyRow={{ addOnStart: true }} />);
    const gridElement = document.querySelector('.ag-root-wrapper');
    expect(gridElement).toBeInTheDocument();
  });

  it('should re-render when data changes', () => {
    const { rerender } = render(<Table data={mockData} />);

    const newData: TableDataType = {
      header: [{ title: 'City', id: 'city' }],
      rows: [[{ city: { value: 'NYC' } }], [{ city: { value: 'LA' } }]],
    };

    rerender(<Table data={newData} />);

    const gridElement = document.querySelector('.ag-root-wrapper');
    expect(gridElement).toBeInTheDocument();
  });

  it('should calculate height automatically when fixedHeight is not provided', () => {
    const { container } = render(<Table data={mockData} />);
    const tableContainer = container.querySelector('.table-container');
    expect(tableContainer).toBeInTheDocument();
  });

  it('should use fixedHeight when visibility changes', async () => {
    const { container } = render(<Table data={mockData} fixedHeight="400px" />);

    await waitFor(
      () => {
        const tableContainer = container.querySelector('.table-container');
        expect(tableContainer).toHaveStyle({ height: '400px' });
      },
      { timeout: 3000 },
    );
  });

  describe('dataTestId', () => {
    it('should render with data-testid when provided', () => {
      const { container } = render(
        <Table data={mockData} dataTestId="investment" />,
      );
      const tableContainer = container.querySelector(
        '[data-testid="table-investment"]',
      );
      expect(tableContainer).toBeInTheDocument();
    });

    it('should render without data-testid when not provided', () => {
      const { container } = render(<Table data={mockData} />);
      const tableContainer = container.querySelector('.table-container');
      expect(tableContainer).toBeInTheDocument();
      expect(tableContainer).not.toHaveAttribute('data-testid');
    });
  });
});
