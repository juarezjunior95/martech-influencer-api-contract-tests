import { render, screen } from '@testing-library/react';

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({ children, content, backgroundStyle, fillTrigger }: any) => (
    <div
      data-testid="custom-tooltip"
      data-background-style={backgroundStyle}
      data-fill-trigger={fillTrigger ? 'true' : 'false'}
    >
      <div data-testid="custom-tooltip-content">{content}</div>
      {children}
    </div>
  ),
}));

jest.mock('components/GanttChart/utils/utils', () => ({
  isWeekDelimiter: jest.fn((index: number) => index === 3),
}));

jest.mock('../GanttChartTooltip/GanttChartTooltip', () => ({
  GanttTooltip: ({ tooltip, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'gantt-tooltip'}
      data-tooltip-count={tooltip?.length}
    >
      GanttTooltip
    </div>
  ),
}));

jest.mock('./GanttChartWithMilestones.styles', () => ({
  StyledGanttChartWithMilestones: ({
    children,
    weekDelimiter,
    className,
    style,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div
      data-testid={dataTestId || 'milestones-container'}
      data-week-delimiter={weekDelimiter}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </div>
  ),
  StyledGanttChartWithMilestonesCell: ({
    children,
    activeWeek,
    timing,
    className,
    style,
  }: any) => (
    <div
      data-testid="milestones-cell"
      data-active-week={activeWeek}
      data-timing={timing}
      className={className}
      style={style}
    >
      {children}
    </div>
  ),
  StyledMilestone: ({ className, style }: any) => (
    <div data-testid="milestone" className={className} style={style}>
      Milestone
    </div>
  ),
}));

import { GanttChartWithMilestones } from './GanttChartWithMilestones';

describe('GanttChartWithMilestones', () => {
  const mockCell = {
    id: 'cell-1',
    color: '#FF0000',
    timing: 'start' as const,
  };

  const mockCellWithMilestone = {
    ...mockCell,
    milestone: { color: '#FFFF00' },
  };

  const mockTooltip = [
    { label: 'Label 1', value: 'Value 1' },
    { label: 'Label 2', value: 'Value 2' },
  ];

  it('should render StyledGanttChartWithMilestones', () => {
    render(<GanttChartWithMilestones cell={mockCell} cellIndex={0} />);

    expect(screen.getByTestId('milestones-container')).toBeInTheDocument();
  });

  it('should render with tooltip-container class', () => {
    render(<GanttChartWithMilestones cell={mockCell} cellIndex={0} />);

    const container = screen.getByTestId('milestones-container');
    expect(container).toHaveClass('tooltip-container');
  });

  it('should pass weekDelimiter based on cellIndex', () => {
    render(<GanttChartWithMilestones cell={mockCell} cellIndex={3} />);

    const container = screen.getByTestId('milestones-container');
    expect(container).toHaveAttribute('data-week-delimiter', 'true');
  });

  it('should render StyledGanttChartWithMilestonesCell', () => {
    render(<GanttChartWithMilestones cell={mockCell} cellIndex={0} />);

    expect(screen.getByTestId('milestones-cell')).toBeInTheDocument();
  });

  it('should set activeWeek true when cell has color', () => {
    render(<GanttChartWithMilestones cell={mockCell} cellIndex={0} />);

    const cell = screen.getByTestId('milestones-cell');
    expect(cell).toHaveAttribute('data-active-week', 'true');
  });

  it('should set activeWeek false when cell has no color', () => {
    const cellWithoutColor = { id: 'cell-2' };

    render(<GanttChartWithMilestones cell={cellWithoutColor} cellIndex={0} />);

    const cell = screen.getByTestId('milestones-cell');
    expect(cell).toHaveAttribute('data-active-week', 'false');
  });

  it('should pass timing prop to cell', () => {
    render(<GanttChartWithMilestones cell={mockCell} cellIndex={0} />);

    const cell = screen.getByTestId('milestones-cell');
    expect(cell).toHaveAttribute('data-timing', 'start');
  });

  it('should apply cell color as backgroundColor', () => {
    render(<GanttChartWithMilestones cell={mockCell} cellIndex={0} />);

    const cell = screen.getByTestId('milestones-cell');
    expect(cell).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  it('should render milestone when cell has milestone', () => {
    render(
      <GanttChartWithMilestones cell={mockCellWithMilestone} cellIndex={0} />,
    );

    expect(screen.getByTestId('milestone')).toBeInTheDocument();
  });

  it('should apply milestone color as backgroundColor', () => {
    render(
      <GanttChartWithMilestones cell={mockCellWithMilestone} cellIndex={0} />,
    );

    const milestone = screen.getByTestId('milestone');
    expect(milestone).toHaveStyle({ backgroundColor: '#FFFF00' });
  });

  it('should not render milestone when cell has no milestone', () => {
    render(<GanttChartWithMilestones cell={mockCell} cellIndex={0} />);

    expect(screen.queryByTestId('milestone')).not.toBeInTheDocument();
  });

  it('should render CustomTooltip when tooltip is provided', () => {
    render(
      <GanttChartWithMilestones
        cell={mockCell}
        cellIndex={0}
        tooltip={mockTooltip}
      />,
    );

    expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
  });

  it('should render CustomTooltip with transparent backgroundStyle', () => {
    render(
      <GanttChartWithMilestones
        cell={mockCell}
        cellIndex={0}
        tooltip={mockTooltip}
      />,
    );

    const tooltip = screen.getByTestId('custom-tooltip');
    expect(tooltip).toHaveAttribute('data-background-style', 'transparent');
  });

  it('should pass fillTrigger to CustomTooltip when tooltip is provided', () => {
    render(
      <GanttChartWithMilestones
        cell={mockCell}
        cellIndex={0}
        tooltip={mockTooltip}
      />,
    );

    expect(screen.getByTestId('custom-tooltip')).toHaveAttribute(
      'data-fill-trigger',
      'true',
    );
  });

  it('should render GanttTooltip inside CustomTooltip', () => {
    render(
      <GanttChartWithMilestones
        cell={mockCell}
        cellIndex={0}
        tooltip={mockTooltip}
      />,
    );

    expect(screen.getByTestId('gantt-tooltip')).toBeInTheDocument();
  });

  it('should not render CustomTooltip when tooltip is not provided', () => {
    render(<GanttChartWithMilestones cell={mockCell} cellIndex={0} />);

    expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
  });

  it('should apply style prop to container', () => {
    const style = { height: '30px' };

    render(
      <GanttChartWithMilestones cell={mockCell} cellIndex={0} style={style} />,
    );

    const container = screen.getByTestId('milestones-container');
    expect(container).toHaveStyle({ height: '30px' });
  });

  it('should render milestone with tooltip', () => {
    render(
      <GanttChartWithMilestones
        cell={mockCellWithMilestone}
        cellIndex={0}
        tooltip={mockTooltip}
      />,
    );

    expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('milestone')).toBeInTheDocument();
  });

  it('should handle cell with end timing', () => {
    const cellWithEndTiming = { ...mockCell, timing: 'end' as const };

    render(<GanttChartWithMilestones cell={cellWithEndTiming} cellIndex={0} />);

    const cell = screen.getByTestId('milestones-cell');
    expect(cell).toHaveAttribute('data-timing', 'end');
  });

  it('should handle cell with unique timing', () => {
    const cellWithUniqueTiming = { ...mockCell, timing: 'unique' as const };

    render(
      <GanttChartWithMilestones cell={cellWithUniqueTiming} cellIndex={0} />,
    );

    const cell = screen.getByTestId('milestones-cell');
    expect(cell).toHaveAttribute('data-timing', 'unique');
  });

  it('should render with data-testid when provided', () => {
    render(
      <GanttChartWithMilestones
        cell={mockCell}
        cellIndex={0}
        dataTestId="test"
      />,
    );

    expect(screen.getByTestId('gantt-milestone-test')).toBeInTheDocument();
  });

  it('should render without custom data-testid when not provided', () => {
    const { container } = render(
      <GanttChartWithMilestones cell={mockCell} cellIndex={0} />,
    );

    const milestone = container.querySelector(
      '[data-testid="gantt-milestone-test"]',
    );
    expect(milestone).not.toBeInTheDocument();
  });

  it('should propagate dataTestId to tooltip', () => {
    render(
      <GanttChartWithMilestones
        cell={mockCellWithMilestone}
        cellIndex={0}
        tooltip={mockTooltip}
        dataTestId="test"
      />,
    );

    expect(
      screen.getByTestId('gantt-milestone-test-tooltip'),
    ).toBeInTheDocument();
  });
});
