import { cleanup, render, screen } from '@testing-library/react';
import { Chart as ChartJS } from 'chart.js';

import { Scale } from './Scale';

// Mock the styled components
jest.mock('./Scale.styles', () => ({
  StyledScaleContainer: ({ children, style }: any) => (
    <div data-testid="scale-container" style={style}>
      {children}
    </div>
  ),
  StyledScale: ({ children, style }: any) => (
    <div data-testid="scale" style={style}>
      {children}
    </div>
  ),
  StyledScaleItem: ({ children }: any) => (
    <div data-testid="scale-item">{children}</div>
  ),
  StyledScaleItemLine: () => <div data-testid="scale-item-line" />,
}));

describe('Scale Component', () => {
  const mockChart = {
    scales: {
      y: {
        ticks: [
          { label: '0', value: 0 },
          { label: '10', value: 10 },
          { label: '20', value: 20 },
          { label: '30', value: 30 },
        ],
      },
    },
  } as unknown as ChartJS<'bar'>;

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Scale chart={mockChart} />);
    expect(screen.getByTestId('scale-container')).toBeInTheDocument();
  });

  it('renders all tick labels from chart', () => {
    render(<Scale chart={mockChart} />);

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('renders correct number of scale items', () => {
    render(<Scale chart={mockChart} />);

    const scaleItems = screen.getAllByTestId('scale-item');
    expect(scaleItems).toHaveLength(4);
  });

  it('renders scale item lines for each tick', () => {
    render(<Scale chart={mockChart} />);

    const scaleItemLines = screen.getAllByTestId('scale-item-line');
    expect(scaleItemLines).toHaveLength(4);
  });

  it('applies correct height without variation', () => {
    const height = 300;
    render(<Scale chart={mockChart} height={height} />);

    const container = screen.getByTestId('scale-container');
    expect(container).toHaveStyle({ height: '413px' });
  });

  it('applies correct height with variation', () => {
    const height = 300;
    render(<Scale chart={mockChart} height={height} hasVariation={true} />);

    const container = screen.getByTestId('scale-container');
    expect(container).toHaveStyle({ height: '465px' });
  });

  it('applies custom top and left positioning', () => {
    render(<Scale chart={mockChart} top="20px" left="30px" height={200} />);

    const scale = screen.getByTestId('scale');
    expect(scale).toHaveStyle({
      top: '20px',
      left: '30px',
      height: '200px',
    });
  });

  it('handles chart with no ticks gracefully', () => {
    const emptyChart = {
      scales: { y: { ticks: [] } },
    } as unknown as ChartJS<'bar'>;

    render(<Scale chart={emptyChart} />);

    const scaleItems = screen.queryAllByTestId('scale-item');
    expect(scaleItems).toHaveLength(0);
  });

  it('handles chart with undefined scales', () => {
    const chartWithoutScales = {} as ChartJS<'bar'>;

    render(<Scale chart={chartWithoutScales} />);

    const scaleItems = screen.queryAllByTestId('scale-item');
    expect(scaleItems).toHaveLength(0);
  });

  it('uses tick value when label is not provided', () => {
    const chartWithValueOnly = {
      scales: {
        y: {
          ticks: [{ value: 5 }, { value: 15 }],
        },
      },
    } as unknown as ChartJS<'bar'>;

    render(<Scale chart={chartWithValueOnly} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });
});
