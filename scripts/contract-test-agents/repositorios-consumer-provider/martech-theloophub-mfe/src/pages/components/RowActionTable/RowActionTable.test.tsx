import React from 'react';

import { act, render, screen } from '@testing-library/react';

import { RowActionTable } from './RowActionTable';
import { mergeRowsInPairs } from './utils/mergeRowsInPairs';

let capturedOnGridReady: any = null;
let capturedOnRowClicked: any = null;
let capturedGetRowHeight: any = null;

jest.mock('components', () => ({
  Table: ({
    dataTestId,
    headerHeight,
    rowHeight,
    chartType,
    fixedHeight,
    scrollbarWidth,
    onGridReadyCallback,
    onRowClicked,
    getRowHeight,
    rowSelection,
    noRowsMessage,
  }: any) => {
    capturedOnGridReady = onGridReadyCallback;
    capturedOnRowClicked = onRowClicked;
    capturedGetRowHeight = getRowHeight;
    return (
      <div
        data-testid={dataTestId || 'table'}
        data-header-height={headerHeight}
        data-row-height={rowHeight}
        data-chart-type={chartType}
        data-fixed-height={fixedHeight}
        data-scrollbar-width={scrollbarWidth}
        data-row-selection={rowSelection ? 'true' : 'false'}
        data-no-rows-message={noRowsMessage?.message}
      >
        Table
      </div>
    );
  },
}));

jest.mock('./config', () => ({
  COMPETITOR_HEADER: 'competitor_header',
}));

jest.mock('./RowActionTable.styles', () => ({
  StyledRowActionTable: {},
  StyledSelectionRowActionTable: {},
}));

jest.mock('./utils/mergeRowsInPairs', () => ({
  mergeRowsInPairs: jest.fn((rows) => rows),
}));

describe('RowActionTable', () => {
  const mockData = {
    header: [{ field: 'name' }],
    rows: [[{ name: 'Test' }]],
  };

  const mockColumnDefsConfig = jest.fn(() => ({}));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render Table component', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
      />,
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should pass headerHeight 32 to Table', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
      />,
    );

    expect(screen.getByTestId('table')).toHaveAttribute(
      'data-header-height',
      '32',
    );
  });

  it('should pass chartType single-bar to Table', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
      />,
    );

    expect(screen.getByTestId('table')).toHaveAttribute(
      'data-chart-type',
      'single-bar',
    );
  });

  it('should pass scrollbarWidth 8 to Table', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
      />,
    );

    expect(screen.getByTestId('table')).toHaveAttribute(
      'data-scrollbar-width',
      '8',
    );
  });

  it('should pass fixedHeight to Table when provided', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        fixedHeight="500px"
      />,
    );

    expect(screen.getByTestId('table')).toHaveAttribute(
      'data-fixed-height',
      '500px',
    );
  });

  it('should pass rowHeight to Table when provided', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        rowHeight={64}
      />,
    );

    expect(screen.getByTestId('table')).toHaveAttribute(
      'data-row-height',
      '64',
    );
  });

  it('should call columnDefsConfig with false initially', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
      />,
    );

    expect(mockColumnDefsConfig).toHaveBeenCalledWith(false);
  });

  it('should render with rowSelection true by default', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
      />,
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should render with rowSelection false when specified', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        rowSelection={false}
      />,
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should render with byCompetitor false by default', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
      />,
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should render with byCompetitor true when specified', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        byCompetitor={true}
      />,
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should call mergeRowsInPairs when byCompetitor is true', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        byCompetitor={true}
      />,
    );

    expect(mergeRowsInPairs).toHaveBeenCalled();
  });

  it('should not call mergeRowsInPairs when byCompetitor is false', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        byCompetitor={false}
      />,
    );

    expect(mergeRowsInPairs).not.toHaveBeenCalled();
  });

  it('should call onChangeRows when row is clicked', () => {
    const mockOnChangeRows = jest.fn();

    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        onChangeRows={mockOnChangeRows}
      />,
    );

    const mockApi = {
      refreshCells: jest.fn(),
    };

    act(() => {
      capturedOnRowClicked({ api: mockApi, data: { id: 'test-id' } });
    });

    expect(mockOnChangeRows).toHaveBeenCalledWith('test-id');
  });

  it('should not call onChangeRows when rowSelection is false', () => {
    const mockOnChangeRows = jest.fn();

    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        onChangeRows={mockOnChangeRows}
        rowSelection={false}
      />,
    );

    capturedOnRowClicked({ api: {}, data: { id: 'test-id' } });

    expect(mockOnChangeRows).not.toHaveBeenCalled();
  });

  it('should return rowHeight from getRowHeight when provided', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        rowHeight={64}
      />,
    );

    const result = capturedGetRowHeight({ data: { id: 'test' } });

    expect(result).toBe(64);
  });

  it('should return 32 for COMPETITOR_HEADER row', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
      />,
    );

    const result = capturedGetRowHeight({ data: { id: 'competitor_header' } });

    expect(result).toBe(32);
  });

  it('should return 88 for byCompetitor rows', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        byCompetitor={true}
      />,
    );

    const result = capturedGetRowHeight({ data: { id: 'other' } });

    expect(result).toBe(88);
  });

  it('should return 56 for non-byCompetitor rows', () => {
    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        byCompetitor={false}
      />,
    );

    const result = capturedGetRowHeight({ data: { id: 'other' } });

    expect(result).toBe(56);
  });

  it('should set gridApi when onGridReadyCallback is called', () => {
    const mockApi = {
      deselectAll: jest.fn(),
      refreshCells: jest.fn(),
    };

    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
      />,
    );

    act(() => {
      capturedOnGridReady({ api: mockApi });
    });

    expect(capturedOnGridReady).toBeDefined();
  });

  it('should provide setClearSelectionHandler prop to component', () => {
    const mockSetClearSelectionHandler = jest.fn();

    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        setClearSelectionHandler={mockSetClearSelectionHandler}
      />,
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should provide setRowSelectionHandler prop to component', () => {
    const mockSetRowSelectionHandler = jest.fn();

    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        setRowSelectionHandler={mockSetRowSelectionHandler}
      />,
    );

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should pass noRowsMessage to Table', () => {
    const mockNoRowsMessage = { message: 'No data' };

    render(
      <RowActionTable
        data={mockData as any}
        columnDefsConfig={mockColumnDefsConfig}
        noRowsMessage={mockNoRowsMessage as any}
      />,
    );

    expect(screen.getByTestId('table')).toHaveAttribute(
      'data-no-rows-message',
      'No data',
    );
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Table when provided', () => {
      render(
        <RowActionTable
          data={mockData as any}
          columnDefsConfig={mockColumnDefsConfig}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('custom')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <RowActionTable
          data={mockData as any}
          columnDefsConfig={mockColumnDefsConfig}
        />,
      );

      expect(screen.getByTestId('table')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <RowActionTable
          data={mockData as any}
          columnDefsConfig={mockColumnDefsConfig}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });
});
