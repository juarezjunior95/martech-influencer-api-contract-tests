import React from 'react';

import { render, screen } from '@testing-library/react';

import { LineBarChartsGrid } from './LineBarChartsGrid';

const mockLine = jest.fn();
const mockBar = jest.fn();
const mockComparisonLine = jest.fn();

jest.mock('components', () => ({
  Line: (props: Record<string, unknown>) => {
    mockLine(props);
    return <div data-testid="line-chart" />;
  },
  Bar: (props: Record<string, unknown>) => {
    mockBar(props);
    return <div data-testid="bar-chart" />;
  },
  ComparisonLine: (props: Record<string, unknown>) => {
    mockComparisonLine(props);
    return <div data-testid="comparison-line" />;
  },
}));

jest.mock(
  'pages/pillars/ValueCreation/PerformanceTool/constants/performanceLineTooltipLabels',
  () => ({ PERFORMANCE_LINE_TOOLTIP_LABELS: {} }),
);

jest.mock('theme', () => ({
  theme: { colors: { txt: { secondary: '#999', default: '#333' } } },
}));

const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="grid">{children}</div>
);
const LineContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div data-testid="line-container">{children}</div>;
const BarContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div data-testid="bar-container">{children}</div>;
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="chart-wrapper">{children}</div>
);

const COMPARISON_LINE_DATA = [{ title: 'vs LY', data: [] }];

const BASE_DATA: any = {
  lineChart: {
    labels: ['JAN', 'FEB'],
    formattedData: [['1', '2']],
    suggestedMin: 0,
    suggestedMax: 100,
    comparisonLine: { data: COMPARISON_LINE_DATA },
  },
  barChart: {
    labels: ["YTD'25", "YTD'26"],
    formattedData: [['100', '200']],
    stripedIndexes: [0],
    comparisonLine: { data: COMPARISON_LINE_DATA },
  },
};

const BASE_PROPS = {
  data: BASE_DATA,
  lineDatasets: [{ label: 'A', data: [1, 2] }] as any,
  barDatasets: [{ label: 'B', data: [3, 4] }] as any,
  highlightedIndexes: [0],
  barOptions: { mocked: true } as any,
  ChartsGrid: Grid,
  LineChartContainer: LineContainer,
  BarChartContainer: BarContainer,
};

describe('LineBarChartsGrid', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the grid, line container, and bar container', () => {
    render(<LineBarChartsGrid {...BASE_PROPS} />);

    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('line-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-container')).toBeInTheDocument();
  });

  it('renders Line and Bar charts', () => {
    render(<LineBarChartsGrid {...BASE_PROPS} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('passes correct props to Line', () => {
    render(<LineBarChartsGrid {...BASE_PROPS} />);

    expect(mockLine).toHaveBeenCalledWith(
      expect.objectContaining({
        datasets: BASE_PROPS.lineDatasets,
        labels: BASE_DATA.lineChart.labels,
        formattedData: BASE_DATA.lineChart.formattedData,
        highlightedIndexes: BASE_PROPS.highlightedIndexes,
        showDivider: true,
      }),
    );
  });

  it('afterFit callback sets axis width to 45', () => {
    render(<LineBarChartsGrid {...BASE_PROPS} />);

    const { options } = mockLine.mock.calls[0][0] as any;
    const fakeAxis = { width: 0 };
    options.scales.y.afterFit(fakeAxis);

    expect(fakeAxis.width).toBe(45);
  });

  it('passes correct props to Bar', () => {
    render(<LineBarChartsGrid {...BASE_PROPS} />);

    expect(mockBar).toHaveBeenCalledWith(
      expect.objectContaining({
        datasets: BASE_PROPS.barDatasets,
        labels: BASE_DATA.barChart.labels,
        formattedData: BASE_DATA.barChart.formattedData,
        stripedIndexes: BASE_DATA.barChart.stripedIndexes,
        options: BASE_PROPS.barOptions,
        size: 'large',
        showGrid: false,
        showDivider: false,
        axisType: 'none',
      }),
    );
  });

  describe('showLineDataLabels', () => {
    it('passes formattedData to Line when showLineDataLabels is true (default)', () => {
      render(<LineBarChartsGrid {...BASE_PROPS} />);

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          formattedData: BASE_DATA.lineChart.formattedData,
        }),
      );
    });

    it('passes undefined formattedData to Line when showLineDataLabels is false', () => {
      render(<LineBarChartsGrid {...BASE_PROPS} showLineDataLabels={false} />);

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({ formattedData: undefined }),
      );
    });
  });

  describe('ChartWrapper', () => {
    it('wraps charts in ChartWrapper when provided', () => {
      render(<LineBarChartsGrid {...BASE_PROPS} ChartWrapper={Wrapper} />);

      expect(screen.getAllByTestId('chart-wrapper')).toHaveLength(2);
    });

    it('does not render ChartWrapper when not provided', () => {
      render(<LineBarChartsGrid {...BASE_PROPS} />);

      expect(screen.queryByTestId('chart-wrapper')).not.toBeInTheDocument();
    });
  });

  describe('ComparisonLine rendering', () => {
    it('renders two ComparisonLines when both charts have comparisonLine', () => {
      render(<LineBarChartsGrid {...BASE_PROPS} />);

      expect(screen.getAllByTestId('comparison-line')).toHaveLength(2);
    });

    it('passes correct props to lineChart ComparisonLine', () => {
      render(<LineBarChartsGrid {...BASE_PROPS} />);

      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({
          data: COMPARISON_LINE_DATA,
          gridColumnsLength: 2,
          gridConfig: { paddingLeft: 5, paddingRight: 0 },
          borderConfig: { marginLeft: 40, marginRight: 8 },
        }),
      );
    });

    it('passes correct props to barChart ComparisonLine', () => {
      render(<LineBarChartsGrid {...BASE_PROPS} />);

      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({
          gridConfig: { paddingLeft: 0, paddingRight: 0 },
          borderConfig: { marginLeft: 16, marginRight: 16 },
        }),
      );
    });

    it('does not render lineChart ComparisonLine when absent', () => {
      const data = {
        ...BASE_DATA,
        lineChart: { ...BASE_DATA.lineChart, comparisonLine: undefined },
      };
      render(<LineBarChartsGrid {...BASE_PROPS} data={data} />);

      expect(screen.getAllByTestId('comparison-line')).toHaveLength(1);
    });

    it('does not render barChart ComparisonLine when absent', () => {
      const data = {
        ...BASE_DATA,
        barChart: { ...BASE_DATA.barChart, comparisonLine: undefined },
      };
      render(<LineBarChartsGrid {...BASE_PROPS} data={data} />);

      expect(screen.getAllByTestId('comparison-line')).toHaveLength(1);
    });

    it('renders no ComparisonLine when neither chart has comparisonLine', () => {
      const data = {
        ...BASE_DATA,
        lineChart: { ...BASE_DATA.lineChart, comparisonLine: undefined },
        barChart: { ...BASE_DATA.barChart, comparisonLine: undefined },
      };
      render(<LineBarChartsGrid {...BASE_PROPS} data={data} />);

      expect(screen.queryByTestId('comparison-line')).not.toBeInTheDocument();
    });

    it('uses 0 for gridColumnsLength when lineChart has no labels', () => {
      const data = {
        ...BASE_DATA,
        lineChart: { ...BASE_DATA.lineChart, labels: undefined },
      };
      render(<LineBarChartsGrid {...BASE_PROPS} data={data} />);

      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({ gridColumnsLength: 0 }),
      );
    });

    it('uses 0 for gridColumnsLength when barChart has no labels', () => {
      const data = {
        ...BASE_DATA,
        barChart: { ...BASE_DATA.barChart, labels: undefined },
      };
      render(<LineBarChartsGrid {...BASE_PROPS} data={data} />);

      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({ gridColumnsLength: 0 }),
      );
    });
  });

  it('renders correctly with no data prop', () => {
    render(<LineBarChartsGrid {...BASE_PROPS} data={undefined} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.queryByTestId('comparison-line')).not.toBeInTheDocument();
  });
});
