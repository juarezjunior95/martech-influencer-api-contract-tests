import { render, screen } from '@testing-library/react';

jest.mock('./components', () => ({
  GanttChartHeader: ({ weekRanges, title, headerHeight, dataTestId }: any) => (
    <div
      data-testid={
        dataTestId ? `gantt-chart-header-${dataTestId}` : 'gantt-chart-header'
      }
      data-title={title}
      data-header-height={headerHeight}
      data-week-ranges={JSON.stringify(weekRanges)}
    >
      GanttChartHeader
    </div>
  ),
  GanttChartBody: ({ rows, dataTestId }: any) => (
    <div
      data-testid={
        dataTestId ? `gantt-chart-body-${dataTestId}` : 'gantt-chart-body'
      }
      data-rows-count={rows?.length}
    >
      GanttChartBody
    </div>
  ),
}));

jest.mock('./GanttChart.styles', () => ({
  StyledGanttChart: ({
    children,
    className,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div data-testid={dataTestId} className={className} {...props}>
      {children}
    </div>
  ),
}));

import { GanttChart } from './GanttChart';

describe('GanttChart', () => {
  const mockHeader = {
    weekRanges: ['Week 1', 'Week 2', 'Week 3'],
    title: 'Test Gantt Chart',
    headerHeight: 50,
  };

  const mockRows = [
    {
      id: 'row-1',
      cells: [
        { id: 'cell-1', color: '#FF0000' },
        { id: 'cell-2', color: '#00FF00' },
      ],
    },
    {
      id: 'row-2',
      cells: [{ id: 'cell-3', color: '#0000FF' }],
    },
  ];

  it('should render StyledGanttChart with gantt-chart class', () => {
    const { container } = render(
      <GanttChart header={mockHeader} rows={mockRows} />,
    );

    const chart = container.querySelector('.gantt-chart');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveClass('gantt-chart');
  });

  it('should render GanttChartHeader', () => {
    render(<GanttChart header={mockHeader} rows={mockRows} />);

    expect(screen.getByTestId('gantt-chart-header')).toBeInTheDocument();
  });

  it('should pass header props to GanttChartHeader', () => {
    render(<GanttChart header={mockHeader} rows={mockRows} />);

    const header = screen.getByTestId('gantt-chart-header');
    expect(header).toHaveAttribute('data-title', 'Test Gantt Chart');
    expect(header).toHaveAttribute('data-header-height', '50');
    expect(header).toHaveAttribute(
      'data-week-ranges',
      JSON.stringify(['Week 1', 'Week 2', 'Week 3']),
    );
  });

  it('should render GanttChartBody', () => {
    render(<GanttChart header={mockHeader} rows={mockRows} />);

    expect(screen.getByTestId('gantt-chart-body')).toBeInTheDocument();
  });

  it('should pass rows to GanttChartBody', () => {
    render(<GanttChart header={mockHeader} rows={mockRows} />);

    const body = screen.getByTestId('gantt-chart-body');
    expect(body).toHaveAttribute('data-rows-count', '2');
  });

  it('should render with empty rows', () => {
    render(<GanttChart header={mockHeader} rows={[]} />);

    const body = screen.getByTestId('gantt-chart-body');
    expect(body).toHaveAttribute('data-rows-count', '0');
  });

  it('should render with data-testid when provided', () => {
    render(
      <GanttChart header={mockHeader} rows={mockRows} dataTestId="test" />,
    );

    expect(screen.getByTestId('gantt-chart-test')).toBeInTheDocument();
    expect(screen.getByTestId('gantt-chart-header-test')).toBeInTheDocument();
    expect(screen.getByTestId('gantt-chart-body-test')).toBeInTheDocument();
  });

  it('should render without data-testid when not provided', () => {
    const { container } = render(
      <GanttChart header={mockHeader} rows={mockRows} />,
    );

    const mainContainer = container.querySelector('.gantt-chart');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).not.toHaveAttribute('data-testid');
  });

  it('should apply correct data-testid format with prefix', () => {
    render(
      <GanttChart header={mockHeader} rows={mockRows} dataTestId="my-gantt" />,
    );

    const chart = screen.getByTestId('gantt-chart-my-gantt');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveAttribute('data-testid', 'gantt-chart-my-gantt');
  });
});
