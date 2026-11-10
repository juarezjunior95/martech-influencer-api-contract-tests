import { render, screen } from '@testing-library/react';

jest.mock('../GanttChartSimpleBars/GanttChartSimpleBars', () => ({
  GanttChartWithSimpleBars: ({ cell, cellIndex, dataTestId }: any) => (
    <div
      data-testid={
        dataTestId ? `gantt-simple-bar-${dataTestId}` : 'simple-bars'
      }
      data-cell-id={cell.id}
      data-cell-index={cellIndex}
    >
      SimpleBars
    </div>
  ),
}));

jest.mock('../GanttChartWithMilestones/GanttChartWithMilestones', () => ({
  GanttChartWithMilestones: ({ cell, tooltip, cellIndex, dataTestId }: any) => (
    <div
      data-testid={dataTestId ? `gantt-milestone-${dataTestId}` : 'milestones'}
      data-cell-id={cell.id}
      data-cell-index={cellIndex}
      data-has-tooltip={!!tooltip}
    >
      Milestones
    </div>
  ),
}));

jest.mock('./GanttChartRow.styles', () => ({
  StyledGanttChartRow: ({
    children,
    style,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div data-testid={dataTestId || 'gantt-chart-row'} style={style} {...props}>
      {children}
    </div>
  ),
  StyledGanttChartRowCell: ({ children, style }: any) => (
    <div data-testid="gantt-chart-row-cell" style={style}>
      {children}
    </div>
  ),
}));

import { GanttChartRow } from './GanttChartRow';

describe('GanttChartRow', () => {
  const mockRowWithBar = {
    id: 'row-1',
    cells: [
      { id: 'cell-1', color: '#FF0000' },
      { id: 'cell-2', color: '#00FF00' },
    ],
    mode: 'bar' as const,
  };

  const mockRowWithMilestones = {
    id: 'row-2',
    cells: [
      { id: 'cell-3', color: '#0000FF', milestone: { color: '#FFFF00' } },
      { id: 'cell-4', color: '#FF00FF' },
    ],
    mode: 'milestones' as const,
    tooltip: [{ label: 'Label', value: 'Value' }],
  };

  it('should render StyledGanttChartRow', () => {
    render(<GanttChartRow row={mockRowWithBar} lastRow={false} />);

    expect(screen.getByTestId('gantt-chart-row')).toBeInTheDocument();
  });

  it('should render row cells', () => {
    render(<GanttChartRow row={mockRowWithBar} lastRow={false} />);

    const cells = screen.getAllByTestId('gantt-chart-row-cell');
    expect(cells).toHaveLength(2);
  });

  it('should render GanttChartWithSimpleBars when mode is bar', () => {
    render(<GanttChartRow row={mockRowWithBar} lastRow={false} />);

    const simpleBars = screen.getAllByTestId('simple-bars');
    expect(simpleBars).toHaveLength(2);
  });

  it('should render GanttChartWithMilestones when mode is milestones', () => {
    render(<GanttChartRow row={mockRowWithMilestones} lastRow={false} />);

    const milestones = screen.getAllByTestId('milestones');
    expect(milestones).toHaveLength(2);
  });

  it('should pass cellIndex to components', () => {
    render(<GanttChartRow row={mockRowWithBar} lastRow={false} />);

    const simpleBars = screen.getAllByTestId('simple-bars');
    expect(simpleBars[0]).toHaveAttribute('data-cell-index', '0');
    expect(simpleBars[1]).toHaveAttribute('data-cell-index', '1');
  });

  it('should pass tooltip to GanttChartWithMilestones', () => {
    render(<GanttChartRow row={mockRowWithMilestones} lastRow={false} />);

    const milestones = screen.getAllByTestId('milestones');
    expect(milestones[0]).toHaveAttribute('data-has-tooltip', 'true');
  });

  it('should apply row style height to row container', () => {
    const rowWithStyle = {
      ...mockRowWithBar,
      style: { height: '50px' },
    };

    render(<GanttChartRow row={rowWithStyle} lastRow={false} />);

    const row = screen.getByTestId('gantt-chart-row');
    expect(row).toHaveStyle({ maxHeight: '50px' });
  });

  it('should apply row style to cells', () => {
    const rowWithStyle = {
      ...mockRowWithBar,
      style: { height: '50px' },
    };

    render(<GanttChartRow row={rowWithStyle} lastRow={false} />);

    const cells = screen.getAllByTestId('gantt-chart-row-cell');
    cells.forEach((cell) => {
      expect(cell).toHaveStyle({ height: '50px' });
    });
  });

  it('should render GanttChartWithSimpleBars by default when mode is undefined', () => {
    const rowWithoutMode = {
      id: 'row-3',
      cells: [{ id: 'cell-5', color: '#000000' }],
    };

    render(<GanttChartRow row={rowWithoutMode} lastRow={false} />);

    expect(screen.getByTestId('simple-bars')).toBeInTheDocument();
  });

  it('should render with data-testid when provided', () => {
    render(
      <GanttChartRow row={mockRowWithBar} lastRow={false} dataTestId="test" />,
    );

    expect(screen.getByTestId('gantt-chart-row-test')).toBeInTheDocument();
  });

  it('should render without custom data-testid when not provided', () => {
    const { container } = render(
      <GanttChartRow row={mockRowWithBar} lastRow={false} />,
    );

    const row = container.querySelector('[data-testid="gantt-chart-row-test"]');
    expect(row).not.toBeInTheDocument();
  });

  it('should propagate dataTestId to child cells', () => {
    render(
      <GanttChartRow row={mockRowWithBar} lastRow={false} dataTestId="test" />,
    );

    // All cells receive the same dataTestId and format internally
    const cells = screen.getAllByTestId('gantt-simple-bar-test');
    expect(cells).toHaveLength(2); // mockRowWithBar has 2 cells
  });
});
