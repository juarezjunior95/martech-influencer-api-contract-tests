import { render, screen } from '@testing-library/react';

jest.mock('../GanttChartRow/GanttChartRow', () => ({
  GanttChartRow: ({ row, lastRow, dataTestId }: any) => (
    <div
      data-testid={
        dataTestId ? `gantt-chart-row-${dataTestId}` : 'gantt-chart-row'
      }
      data-row-id={row.id}
      data-last-row={lastRow}
    >
      GanttChartRow
    </div>
  ),
}));

jest.mock('./GanttChartBody.styles', () => ({
  StyledGanttChartBody: ({
    children,
    className,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div
      data-testid={dataTestId || 'gantt-chart-body'}
      className={className}
      {...props}
    >
      {children}
    </div>
  ),
}));

import { GanttChartBody } from './GanttChartBody';

describe('GanttChartBody', () => {
  const mockRows = [
    {
      id: 'row-1',
      cells: [{ id: 'cell-1', color: '#FF0000' }],
    },
    {
      id: 'row-2',
      cells: [{ id: 'cell-2', color: '#00FF00' }],
    },
    {
      id: 'row-3',
      cells: [{ id: 'cell-3', color: '#0000FF' }],
    },
  ];

  it('should render StyledGanttChartBody with gantt-body class', () => {
    render(<GanttChartBody rows={mockRows} />);

    const body = screen.getByTestId('gantt-chart-body');
    expect(body).toBeInTheDocument();
    expect(body).toHaveClass('gantt-body');
  });

  it('should render GanttChartRow for each row', () => {
    render(<GanttChartBody rows={mockRows} />);

    const rows = screen.getAllByTestId('gantt-chart-row');
    expect(rows).toHaveLength(3);
  });

  it('should pass row id to each GanttChartRow', () => {
    render(<GanttChartBody rows={mockRows} />);

    const rows = screen.getAllByTestId('gantt-chart-row');
    expect(rows[0]).toHaveAttribute('data-row-id', 'row-1');
    expect(rows[1]).toHaveAttribute('data-row-id', 'row-2');
    expect(rows[2]).toHaveAttribute('data-row-id', 'row-3');
  });

  it('should mark last row with lastRow true', () => {
    render(<GanttChartBody rows={mockRows} />);

    const rows = screen.getAllByTestId('gantt-chart-row');
    expect(rows[0]).toHaveAttribute('data-last-row', 'false');
    expect(rows[1]).toHaveAttribute('data-last-row', 'false');
    expect(rows[2]).toHaveAttribute('data-last-row', 'true');
  });

  it('should render empty body when rows is empty', () => {
    render(<GanttChartBody rows={[]} />);

    const body = screen.getByTestId('gantt-chart-body');
    expect(body).toBeInTheDocument();
    expect(screen.queryByTestId('gantt-chart-row')).not.toBeInTheDocument();
  });

  it('should render single row with lastRow true', () => {
    render(<GanttChartBody rows={[mockRows[0]]} />);

    const rows = screen.getAllByTestId('gantt-chart-row');
    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveAttribute('data-last-row', 'true');
  });

  it('should render with data-testid when provided', () => {
    render(<GanttChartBody rows={mockRows} dataTestId="test" />);

    expect(screen.getByTestId('gantt-chart-body-test')).toBeInTheDocument();
  });

  it('should render without custom data-testid when not provided', () => {
    const { container } = render(<GanttChartBody rows={mockRows} />);

    const body = container.querySelector(
      '[data-testid="gantt-chart-body-test"]',
    );
    expect(body).not.toBeInTheDocument();
  });

  it('should propagate dataTestId to rows', () => {
    render(<GanttChartBody rows={mockRows} dataTestId="test" />);

    // All rows receive the same dataTestId and format internally
    const rows = screen.getAllByTestId('gantt-chart-row-test');
    expect(rows).toHaveLength(3);
  });
});
