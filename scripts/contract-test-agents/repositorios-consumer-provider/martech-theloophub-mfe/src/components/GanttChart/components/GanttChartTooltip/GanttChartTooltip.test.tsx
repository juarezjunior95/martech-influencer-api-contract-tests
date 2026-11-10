import { render, screen } from '@testing-library/react';

jest.mock('./GanttChartTooltip.styles', () => ({
  StyledGanttChartTooltip: ({
    children,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div data-testid={dataTestId || 'gantt-tooltip'} {...props}>
      {children}
    </div>
  ),
  StyledGanttChartTooltipItem: ({ children, firstIndex }: any) => (
    <div data-testid="tooltip-item" data-first-index={firstIndex}>
      {children}
    </div>
  ),
}));

import { GanttTooltip } from './GanttChartTooltip';

describe('GanttTooltip', () => {
  const mockTooltip = [
    { label: 'Label 1', value: 'Value 1' },
    { label: 'Label 2', value: 'Value 2' },
    { label: 'Label 3', value: 'Value 3' },
  ];

  it('should render StyledGanttChartTooltip', () => {
    render(<GanttTooltip tooltip={mockTooltip} />);

    expect(screen.getByTestId('gantt-tooltip')).toBeInTheDocument();
  });

  it('should render tooltip items for each item in tooltip array', () => {
    render(<GanttTooltip tooltip={mockTooltip} />);

    const items = screen.getAllByTestId('tooltip-item');
    expect(items).toHaveLength(3);
  });

  it('should render label and value for each item', () => {
    render(<GanttTooltip tooltip={mockTooltip} />);

    expect(screen.getByText('Label 1: Value 1')).toBeInTheDocument();
    expect(screen.getByText('Label 2: Value 2')).toBeInTheDocument();
    expect(screen.getByText('Label 3: Value 3')).toBeInTheDocument();
  });

  it('should mark first item with firstIndex true', () => {
    render(<GanttTooltip tooltip={mockTooltip} />);

    const items = screen.getAllByTestId('tooltip-item');
    expect(items[0]).toHaveAttribute('data-first-index', 'true');
    expect(items[1]).toHaveAttribute('data-first-index', 'false');
    expect(items[2]).toHaveAttribute('data-first-index', 'false');
  });

  it('should render single item with firstIndex true', () => {
    render(<GanttTooltip tooltip={[mockTooltip[0]]} />);

    const items = screen.getAllByTestId('tooltip-item');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveAttribute('data-first-index', 'true');
  });

  it('should render empty tooltip container when array is empty', () => {
    render(<GanttTooltip tooltip={[]} />);

    expect(screen.getByTestId('gantt-tooltip')).toBeInTheDocument();
    expect(screen.queryByTestId('tooltip-item')).not.toBeInTheDocument();
  });

  it('should render with data-testid when provided', () => {
    render(<GanttTooltip tooltip={mockTooltip} dataTestId="test" />);

    expect(screen.getByTestId('gantt-tooltip-test')).toBeInTheDocument();
  });

  it('should render without custom data-testid when not provided', () => {
    const { container } = render(<GanttTooltip tooltip={mockTooltip} />);

    const tooltip = container.querySelector(
      '[data-testid="gantt-tooltip-test"]',
    );
    expect(tooltip).not.toBeInTheDocument();
  });
});
