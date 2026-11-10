import { render, screen } from '@testing-library/react';

import { TableCard } from './TableCard';

jest.mock('components', () => ({
  DataStateHandler: ({ loading, error, empty, children }: any) => (
    <div data-testid="data-state-handler">
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">Error</div>}
      {empty && <div data-testid="empty">Empty</div>}
      {!loading && !error && !empty && children}
    </div>
  ),
}));

jest.mock('pages/components', () => ({
  ContentHeader: ({ title, subtitle, tooltip, rightContent }: any) => (
    <div data-testid="content-header">
      <div data-testid="header-title">{title}</div>
      {subtitle && <div data-testid="header-subtitle">{subtitle}</div>}
      {tooltip && <div data-testid="header-tooltip">{tooltip}</div>}
      {rightContent && (
        <div data-testid="header-right-content">{rightContent}</div>
      )}
    </div>
  ),
  RowActionTable: ({
    data,
    columnDefsConfig,
    rowSelection,
    byCompetitor,
    fixedHeight,
  }: any) => (
    <div
      data-testid="row-action-table"
      {...(fixedHeight && { 'data-fixed-height': fixedHeight })}
      {...(rowSelection !== undefined && {
        'data-row-selection': String(rowSelection),
      })}
      {...(byCompetitor !== undefined && {
        'data-by-competitor': String(byCompetitor),
      })}
    >
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      <div data-testid="table-columns">{JSON.stringify(columnDefsConfig)}</div>
    </div>
  ),
}));

const mockData = [
  { id: '1', name: 'Item 1', value: 100 },
  { id: '2', name: 'Item 2', value: 200 },
];
const mockColumnDefsConfig = [
  { field: 'name', headerName: 'Name' },
  { field: 'value', headerName: 'Value' },
];

const defaultProps = {
  title: 'Test Table',
  loading: false,
  error: null,
  data: mockData,
  columnDefsConfig: mockColumnDefsConfig,
};

describe('TableCard', () => {
  it('renders the title and the populated table for the happy path', () => {
    render(<TableCard {...defaultProps} />);

    expect(screen.getByTestId('header-title')).toHaveTextContent('Test Table');
    expect(screen.getByTestId('row-action-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-data')).toHaveTextContent(
      JSON.stringify(mockData),
    );
  });

  it('renders subtitle and rightContent only when provided', () => {
    const { rerender } = render(<TableCard {...defaultProps} />);
    expect(screen.queryByTestId('header-subtitle')).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('header-right-content'),
    ).not.toBeInTheDocument();

    rerender(
      <TableCard
        {...defaultProps}
        subtitle="Test Subtitle"
        rightContent={<div data-testid="custom-right">Right Content</div>}
      />,
    );

    expect(screen.getByTestId('header-subtitle')).toHaveTextContent(
      'Test Subtitle',
    );
    expect(screen.getByTestId('custom-right')).toBeInTheDocument();
  });

  it.each([
    {
      label: 'loading',
      props: { loading: true },
      visible: 'loading',
    },
    {
      label: 'error',
      props: { error: new Error('Test error') },
      visible: 'error',
    },
    {
      label: 'empty (data.length === 0)',
      props: { data: [] },
      visible: 'empty',
    },
  ])('forwards $label state to DataStateHandler', ({ props, visible }) => {
    render(<TableCard {...defaultProps} {...props} />);

    expect(screen.getByTestId(visible)).toBeInTheDocument();
    expect(screen.queryByTestId('row-action-table')).not.toBeInTheDocument();
  });

  it('forwards optional table props (fixedHeight, rowSelection, byCompetitor) when set', () => {
    render(
      <TableCard
        {...defaultProps}
        fixedHeight="500px"
        rowSelection
        byCompetitor
      />,
    );

    const table = screen.getByTestId('row-action-table');
    expect(table).toHaveAttribute('data-fixed-height', '500px');
    expect(table).toHaveAttribute('data-row-selection', 'true');
    expect(table).toHaveAttribute('data-by-competitor', 'true');
  });
});
