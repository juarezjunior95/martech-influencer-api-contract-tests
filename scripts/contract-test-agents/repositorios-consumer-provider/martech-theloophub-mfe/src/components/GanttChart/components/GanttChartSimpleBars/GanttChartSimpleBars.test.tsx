import { render, screen } from '@testing-library/react';

jest.mock('components/GanttChart/utils/utils', () => ({
  isWeekDelimiter: jest.fn((index: number) => index === 3),
}));

jest.mock('./GanttChartSimpleBars.styles', () => ({
  StyledSimpleBars: ({
    style,
    weekDelimiter,
    'data-testid': dataTestId,
    ...props
  }: any) => (
    <div
      data-testid={dataTestId || 'styled-simple-bars'}
      style={style}
      data-week-delimiter={weekDelimiter}
      {...props}
    >
      SimpleBars
    </div>
  ),
}));

import { GanttChartWithSimpleBars } from './GanttChartSimpleBars';

describe('GanttChartWithSimpleBars', () => {
  const mockCell = {
    id: 'cell-1',
    color: '#FF0000',
  };

  it('should render StyledSimpleBars', () => {
    render(<GanttChartWithSimpleBars cell={mockCell} cellIndex={0} />);

    expect(screen.getByTestId('styled-simple-bars')).toBeInTheDocument();
  });

  it('should apply cell color as backgroundColor', () => {
    render(<GanttChartWithSimpleBars cell={mockCell} cellIndex={0} />);

    const bars = screen.getByTestId('styled-simple-bars');
    expect(bars).toHaveStyle({ backgroundColor: '#FF0000' });
  });

  it('should pass weekDelimiter based on cellIndex', () => {
    render(<GanttChartWithSimpleBars cell={mockCell} cellIndex={3} />);

    const bars = screen.getByTestId('styled-simple-bars');
    expect(bars).toHaveAttribute('data-week-delimiter', 'true');
  });

  it('should pass false for weekDelimiter when index is not delimiter', () => {
    render(<GanttChartWithSimpleBars cell={mockCell} cellIndex={0} />);

    const bars = screen.getByTestId('styled-simple-bars');
    expect(bars).toHaveAttribute('data-week-delimiter', 'false');
  });

  it('should merge style prop with cell color', () => {
    const style = { height: '20px' };

    render(
      <GanttChartWithSimpleBars cell={mockCell} cellIndex={0} style={style} />,
    );

    const bars = screen.getByTestId('styled-simple-bars');
    expect(bars).toHaveStyle({ backgroundColor: '#FF0000', height: '20px' });
  });

  it('should render without color when cell has no color', () => {
    const cellWithoutColor = { id: 'cell-2' };

    render(<GanttChartWithSimpleBars cell={cellWithoutColor} cellIndex={0} />);

    expect(screen.getByTestId('styled-simple-bars')).toBeInTheDocument();
  });

  it('should render with data-testid when provided', () => {
    render(
      <GanttChartWithSimpleBars
        cell={mockCell}
        cellIndex={0}
        dataTestId="test"
      />,
    );

    expect(screen.getByTestId('gantt-simple-bar-test')).toBeInTheDocument();
  });

  it('should render without custom data-testid when not provided', () => {
    const { container } = render(
      <GanttChartWithSimpleBars cell={mockCell} cellIndex={0} />,
    );

    const bars = container.querySelector(
      '[data-testid="gantt-simple-bar-test"]',
    );
    expect(bars).not.toBeInTheDocument();
  });
});
