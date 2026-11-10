import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { LineBarChartsSection } from './LineBarChartsSection';

const mockBasicContainer = jest.fn();
const mockDataStateHandler = jest.fn();
const mockLine = jest.fn();
const mockBar = jest.fn();
const mockChartLegend = jest.fn();
const mockComparisonLine = jest.fn();

jest.mock('components', () => ({
  BasicContainer: (props: Record<string, unknown>) => {
    mockBasicContainer(props);
    return (
      <div data-testid="basic-container">
        {props.children as React.ReactNode}
      </div>
    );
  },
  DataStateHandler: (props: {
    loading: boolean;
    error?: Error | null;
    empty: boolean;
    children: React.ReactNode;
  }) => {
    mockDataStateHandler(props);
    if (props.loading) return <div data-testid="loading">Loading...</div>;
    if (props.error)
      return <div data-testid="error">{props.error.message}</div>;
    if (props.empty) return <div data-testid="empty">Empty</div>;
    return <div data-testid="content">{props.children}</div>;
  },
  Skeleton: () => <div data-testid="skeleton" />,
  Line: (props: Record<string, unknown>) => {
    mockLine(props);
    return <div data-testid="line-chart" />;
  },
  Bar: (props: Record<string, unknown>) => {
    mockBar(props);
    return <div data-testid="bar-chart" />;
  },
  ChartLegend: (props: { items: unknown[] }) => {
    mockChartLegend(props);
    return <div data-testid="chart-legend">{props.items?.length} items</div>;
  },
  ComparisonLine: (props: Record<string, unknown>) => {
    mockComparisonLine(props);
    return <div data-testid="comparison-line" />;
  },
}));

jest.mock('theme', () => ({
  theme: {
    colors: {
      txt: {
        secondary: '#666666',
        default: '#000000',
      },
    },
  },
}));

jest.mock('./LineBarChartsSection.styles', () => ({
  StyledBodyContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="body-container">{children}</div>
  ),
  StyledChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  StyledChartsWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="charts-wrapper">{children}</div>
  ),
  StyledLegendContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="legend-container">{children}</div>
  ),
  StyledLineBarChartsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="charts-grid">{children}</div>
  ),
}));

const mockData = {
  legend: [{ label: 'Last Year' }, { label: 'Current' }],
  lineChart: {
    suggestedMin: 30,
    suggestedMax: 70,
    datasets: [
      { label: 'Last Year', data: [46, 50, 55] },
      { label: 'Current Year', data: [53, 53, 53] },
    ],
    labels: ["Q1'24", "Q2'24", "Q3'24"],
    formattedData: [
      ['46.0', '50.0', '55.0'],
      ['53.0', '53.0', '53.0'],
    ],
    comparisonLine: {
      data: [
        {
          title: 'vs LY',
          data: [
            { value: '2.1', measure: 'pp', trend: 'positive' as const },
            { value: '2.1', measure: 'pp', trend: 'positive' as const },
            { value: '-0.7', measure: 'pp', trend: 'negative' as const },
          ],
        },
      ],
    },
  },
  barChart: {
    datasets: [{ label: 'YTD Comparison', data: [55.3, 55.3] }],
    labels: ["YTD'24", "YTD'25"],
    formattedData: [['55.3', '55.3']],
    comparisonLine: {
      data: [
        {
          title: 'vs LY',
          data: [
            { value: '2.1', measure: 'pp', trend: 'positive' as const },
            { value: '-0.7', measure: 'pp', trend: 'negative' as const },
          ],
        },
      ],
    },
  },
};

describe('LineBarChartsSection', () => {
  describe('Component Rendering', () => {
    it('should render container, Line chart, Bar chart and ChartLegend', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
    });

    it('should render ComparisonLine for line chart', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      const comparisonLines = screen.getAllByTestId('comparison-line');
      expect(comparisonLines.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('BasicContainer Props', () => {
    it('should pass correct header props', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          measure="[ % ]"
          tooltip="Test Tooltip"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          header: expect.objectContaining({
            title: 'Test Title',
            measure: '[ % ]',
            tooltip: 'Test Tooltip',
            titleSize: 'H4',
          }),
        }),
      );
    });

    it('should pass correct layout props', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          layout: expect.objectContaining({
            border: 'small',
            shadow: 'small',
            headerPadding: 'medium',
            bodyPadding: false,
            bottomSeparator: 'border',
          }),
        }),
      );
    });
  });

  describe('DataStateHandler Props', () => {
    it('should pass loading state correctly', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={true}
        />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          loading: true,
        }),
      );
    });

    it('should pass error state correctly', () => {
      const error = new Error('Test error');
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
          error={error}
        />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          error,
        }),
      );
    });

    it('should pass empty state when data is undefined', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={undefined}
          loading={false}
        />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          empty: true,
        }),
      );
    });
  });

  describe('Legend Items', () => {
    it('should create legend items from data', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockChartLegend).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              label: 'Last Year',
              color: '#eddab1',
              shape: 'rectangle',
            }),
            expect.objectContaining({
              label: 'Current',
              color: '#d1a33c',
              shape: 'rectangle',
            }),
          ]),
        }),
      );
    });

    it('should return empty legend when no data', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={{ ...mockData, legend: undefined }}
          loading={false}
        />,
      );

      expect(mockChartLegend).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [],
        }),
      );
    });
  });

  describe('Line Chart Configuration', () => {
    it('should apply correct colors to datasets', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              borderColor: '#eddab1',
              pointBackgroundColor: '#eddab1',
            }),
            expect.objectContaining({
              borderColor: '#d1a33c',
              pointBackgroundColor: '#d1a33c',
            }),
          ]),
        }),
      );
    });

    it('should pass labels to Line chart without value labels on data points', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: mockData.lineChart.labels,
        }),
      );
    });
  });

  describe('Bar Chart Configuration', () => {
    it('should disable grid and divider', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockBar).toHaveBeenCalledWith(
        expect.objectContaining({
          showGrid: false,
          showDivider: false,
        }),
      );
    });
  });

  describe('ComparisonLine', () => {
    it('should render comparison line for line chart', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockData.lineChart.comparisonLine?.data,
          gridColumnsLength: mockData.lineChart.labels.length,
        }),
      );
    });

    it('should render comparison line for bar chart', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockComparisonLine).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockData.barChart.comparisonLine?.data,
          gridColumnsLength: mockData.barChart.labels.length,
        }),
      );
    });

    it('should not render comparison line when not provided', () => {
      const dataWithoutComparison = {
        ...mockData,
        lineChart: { ...mockData.lineChart, comparisonLine: undefined },
        barChart: { ...mockData.barChart, comparisonLine: undefined },
      };

      render(
        <LineBarChartsSection
          title="Test Title"
          data={dataWithoutComparison}
          loading={false}
        />,
      );

      expect(screen.queryByTestId('comparison-line')).not.toBeInTheDocument();
    });
  });

  describe('Highlighted Indexes Functionality', () => {
    it('should pass highlightedIndexes to Line component when provided', () => {
      const dataWithHighlightedIndexes = {
        ...mockData,
        lineChart: {
          ...mockData.lineChart,
          highlightedIndexes: [0, 2],
        },
      };

      render(
        <LineBarChartsSection
          title="Test Title"
          data={dataWithHighlightedIndexes}
          loading={false}
        />,
      );

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndexes: [0, 2],
        }),
      );
    });

    it('should pass empty highlightedIndexes when not provided', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndexes: [],
        }),
      );
    });

    it('should not render Line at all when data is undefined', () => {
      render(
        <LineBarChartsSection
          title="Test Title"
          data={undefined}
          loading={false}
        />,
      );

      expect(mockLine).not.toHaveBeenCalled();
    });
  });
});
