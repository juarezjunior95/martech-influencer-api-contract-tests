import { render, screen } from '@testing-library/react';

jest.mock('@hexa-ui/components2', () => ({
  Tooltip: ({ children, content, position }: any) => (
    <div data-testid="tooltip" data-position={position}>
      <div data-testid="tooltip-content">{content}</div>
      {children}
    </div>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: () => <span data-testid="info-icon">Info</span>,
}));

jest.mock('./GanttChartHeader.styles', () => ({
  StyledGanttChartCellContainer: ({ children }: any) => (
    <div data-testid="cell-container">{children}</div>
  ),
  StyledGanttChartHeaderTitle: ({ children }: any) => (
    <div data-testid="header-title">{children}</div>
  ),
  StyledGanttHeader: ({
    children,
    style,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div data-testid={dataTestId || 'gantt-header'} style={style} {...props}>
      {children}
    </div>
  ),
  StyledGanttHeaderCell: ({ children, lastCell }: any) => (
    <div data-testid="header-cell" data-last-cell={lastCell}>
      {children}
    </div>
  ),
  StyledGanttHeaderTooltip: ({ children }: any) => (
    <div data-testid="header-tooltip">{children}</div>
  ),
}));

import { GanttChartHeader } from './GanttChartHeader';

describe('GanttChartHeader', () => {
  const defaultProps = {
    weekRanges: ['Week 1', 'Week 2', 'Week 3'],
    title: 'Test Title',
  };

  it('should render StyledGanttHeader', () => {
    render(<GanttChartHeader {...defaultProps} />);

    expect(screen.getByTestId('gantt-header')).toBeInTheDocument();
  });

  it('should render header with headerHeight style', () => {
    render(<GanttChartHeader {...defaultProps} headerHeight={60} />);

    const header = screen.getByTestId('gantt-header');
    expect(header).toHaveStyle({ minHeight: '60px' });
  });

  it('should render title', () => {
    render(<GanttChartHeader {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render week range cells', () => {
    render(<GanttChartHeader {...defaultProps} />);

    const cells = screen.getAllByTestId('header-cell');
    expect(cells).toHaveLength(3);
    expect(cells[0]).toHaveTextContent('Week 1');
    expect(cells[1]).toHaveTextContent('Week 2');
    expect(cells[2]).toHaveTextContent('Week 3');
  });

  it('should mark last cell with lastCell true', () => {
    render(<GanttChartHeader {...defaultProps} />);

    const cells = screen.getAllByTestId('header-cell');
    expect(cells[0]).toHaveAttribute('data-last-cell', 'false');
    expect(cells[1]).toHaveAttribute('data-last-cell', 'false');
    expect(cells[2]).toHaveAttribute('data-last-cell', 'true');
  });

  it('should not render tooltip when tooltip prop is not provided', () => {
    render(<GanttChartHeader {...defaultProps} />);

    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });

  it('should render tooltip when tooltip prop is provided', () => {
    render(<GanttChartHeader {...defaultProps} tooltip="Test tooltip text" />);

    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('should render tooltip with position top', () => {
    render(<GanttChartHeader {...defaultProps} tooltip="Test tooltip text" />);

    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toHaveAttribute('data-position', 'top');
  });

  it('should render Info icon when tooltip is provided', () => {
    render(<GanttChartHeader {...defaultProps} tooltip="Test tooltip text" />);

    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('should render tooltip content', () => {
    render(<GanttChartHeader {...defaultProps} tooltip="Test tooltip text" />);

    expect(screen.getByTestId('header-tooltip')).toHaveTextContent(
      'Test tooltip text',
    );
  });

  it('should render cell container', () => {
    render(<GanttChartHeader {...defaultProps} />);

    expect(screen.getByTestId('cell-container')).toBeInTheDocument();
  });

  it('should render with data-testid when provided', () => {
    render(<GanttChartHeader {...defaultProps} dataTestId="test" />);

    expect(screen.getByTestId('gantt-chart-header-test')).toBeInTheDocument();
  });

  it('should render without custom data-testid when not provided', () => {
    const { container } = render(<GanttChartHeader {...defaultProps} />);

    const header = container.querySelector(
      '[data-testid="gantt-chart-header-test"]',
    );
    expect(header).not.toBeInTheDocument();
  });
});
