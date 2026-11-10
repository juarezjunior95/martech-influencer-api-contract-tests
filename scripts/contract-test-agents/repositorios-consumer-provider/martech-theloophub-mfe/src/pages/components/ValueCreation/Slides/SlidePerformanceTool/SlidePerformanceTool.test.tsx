import React from 'react';

import { render, screen } from '@testing-library/react';
import type { ComparisonLineData } from 'components/ComparisonLine';

import { SlidePerformanceTool } from './SlidePerformanceTool';
import type { SlidePerformanceToolProps } from './types';

const mockGetBarChartOptionsFromDatasets = jest.fn((datasets: unknown) => ({
  mockedBarOptions: true,
}));

jest.mock(
  'pages/pillars/ValueCreation/PerformanceTool/utils/getBarChartOptions',
  () => ({
    getBarChartOptionsFromDatasets: (datasets: unknown) =>
      mockGetBarChartOptionsFromDatasets(datasets),
  }),
);

const mockLine = jest.fn((props: Record<string, unknown>) => (
  <div data-testid="line-chart" />
));
const mockBar = jest.fn((props: Record<string, unknown>) => (
  <div data-testid="bar-chart" />
));
const mockChartLegend = jest.fn((props: { items: unknown[] }) => (
  <div data-testid="chart-legend" data-item-count={props.items?.length ?? 0} />
));
const mockComparisonLine = jest.fn((_props?: Record<string, unknown>) => (
  <div data-testid="comparison-line" />
));
const mockBigNumber = jest.fn(({ header }: { header?: React.ReactNode }) => (
  <div data-testid="big-number">{header}</div>
));
const mockChartHeader = jest.fn((_props?: Record<string, unknown>) => (
  <div data-testid="chart-header" />
));

type DataStateHandlerProps = {
  children: React.ReactNode;
  loading: boolean;
  error: Error | null;
  empty: boolean;
};

const mockDataStateHandler = jest.fn(
  ({ children, loading, error, empty }: DataStateHandlerProps) => {
    if (loading) return <div data-testid="dsh-loading" />;
    if (error) return <div data-testid="dsh-error" />;
    if (empty) return <div data-testid="dsh-empty" />;
    return <>{children}</>;
  },
);

jest.mock('theme', () => ({
  theme: {
    colors: {
      txt: { secondary: '#secondary-mock', default: '#default-mock' },
    },
  },
}));

jest.mock('./SlidePerformanceTool.styles', () => ({
  StyledSlidePerformanceToolRoot: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="styled-slide-root">{children}</div>,
  StyledSlidePerformanceToolBigNumberContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="styled-bn-container">{children}</div>,
  StyledSlidePerformanceToolBodyContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="styled-body">{children}</div>,
  StyledSlidePerformanceToolChartContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="styled-chart-container">{children}</div>,
  StyledSlidePerformanceToolChartsWrapper: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="styled-charts-wrapper">{children}</div>,
  StyledSlidePerformanceToolLegendContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="styled-legend">{children}</div>,
  StyledSlidePerformanceToolLineBarChartsGrid: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="styled-line-bar-grid">{children}</div>,
  StyledSlidePerformanceToolLineChartContainer: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="styled-line-chart-wrap">{children}</div>,
}));

jest.mock('components', () => ({
  DataStateHandler: (props: DataStateHandlerProps) =>
    mockDataStateHandler(props),
  BigNumber: (props: Record<string, unknown>) => mockBigNumber(props),
  ChartHeader: (props: Record<string, unknown>) => mockChartHeader(props),
  ChartLegend: (props: { items: unknown[] }) => mockChartLegend(props),
  ComparisonLine: (props: Record<string, unknown>) => mockComparisonLine(props),
  Line: (props: Record<string, unknown>) => mockLine(props),
  Bar: (props: Record<string, unknown>) => mockBar(props),
}));

const defaultBff = {
  data: null,
  loading: false,
  error: null as Error | null,
  refetch: jest.fn(),
};

const baseLineBarChartsData: NonNullable<
  SlidePerformanceToolProps['lineBarChartsData']
> = {
  legend: [{ label: 'Last Year' }, { label: 'Budget' }, { label: 'Current' }],
  lineChart: {
    labels: ['A', 'B'],
    formattedData: [['1', '2']],
    suggestedMin: 0,
    suggestedMax: 100,
    highlightedIndexes: [0],
    datasets: [
      {
        label: 'Last Year',
        data: [1, 2],
        borderColor: '#custom-border',
        pointBackgroundColor: '#custom-point',
      },
      {
        label: 'Other',
        data: [3, 4],
      },
    ],
  },
  barChart: {
    labels: ['x', 'y', 'z'],
    formattedData: [['a', 'b', 'c']],
    stripedIndexes: [1],
    datasets: [
      {
        label: 'Bar',
        data: [1, 2, 3],
      },
    ],
  },
};

const defaultProps: SlidePerformanceToolProps = {
  bigNumberData: [
    {
      header: { title: 'KPI 1', measure: '%' },
      data: [
        {
          bigNumber: { value: '1', measure: 'u' },
        },
      ],
    },
  ],
  bigNumberRequest: defaultBff,
  lineBarChartsData: baseLineBarChartsData,
  lineBarChartsRequest: defaultBff,
};

const comparisonBlock: { data: ComparisonLineData[] } = {
  data: [
    {
      title: 'Comparison',
      data: [{ value: '1', measure: '%', color: '#000' }],
    },
  ],
};

describe('SlidePerformanceTool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton for big numbers when bigNumberRequest.loading is true', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        bigNumberRequest={{ ...defaultBff, loading: true }}
      />,
    );

    expect(screen.getByTestId('dsh-loading')).toBeInTheDocument();
    expect(mockBigNumber).not.toHaveBeenCalled();
  });

  it('renders empty state for big numbers when bigNumberData is missing or empty', () => {
    const { rerender } = render(
      <SlidePerformanceTool
        {...defaultProps}
        bigNumberData={undefined}
        bigNumberRequest={defaultBff}
      />,
    );

    expect(screen.getByTestId('dsh-empty')).toBeInTheDocument();

    rerender(
      <SlidePerformanceTool
        {...defaultProps}
        bigNumberData={[]}
        bigNumberRequest={defaultBff}
      />,
    );

    expect(screen.getByTestId('dsh-empty')).toBeInTheDocument();
  });

  it('renders error state for big numbers when bigNumberRequest.error is set', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        bigNumberRequest={{ ...defaultBff, error: new Error('fail') }}
      />,
    );

    expect(screen.getByTestId('dsh-error')).toBeInTheDocument();
  });

  it('maps bigNumberData to BigNumber with ChartHeader', () => {
    render(<SlidePerformanceTool {...defaultProps} />);

    expect(mockBigNumber).toHaveBeenCalled();
    expect(mockChartHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'KPI 1',
        measure: '%',
      }),
    );
    expect(screen.getByTestId('chart-header')).toBeInTheDocument();
  });

  it('renders loading for charts when lineBarChartsRequest.loading is true', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsRequest={{ ...defaultBff, loading: true }}
      />,
    );

    const loadings = screen.getAllByTestId('dsh-loading');
    expect(loadings.length).toBeGreaterThanOrEqual(1);
    expect(mockLine).not.toHaveBeenCalled();
  });

  it('renders charts empty when lineBarChartsData is undefined', () => {
    render(
      <SlidePerformanceTool {...defaultProps} lineBarChartsData={undefined} />,
    );

    expect(screen.getByTestId('dsh-empty')).toBeInTheDocument();
  });

  it('renders charts empty when lineBarChartsData.empty is true', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsData={{ ...baseLineBarChartsData, empty: true }}
      />,
    );

    expect(screen.getByTestId('dsh-empty')).toBeInTheDocument();
  });

  it('passes legend items with colors and Budget dash decoration', () => {
    render(<SlidePerformanceTool {...defaultProps} />);

    expect(mockChartLegend).toHaveBeenCalledWith(
      expect.objectContaining({
        items: expect.arrayContaining([
          expect.objectContaining({
            label: 'Last Year',
            color: '#eddab1',
            shape: 'rectangle',
            decoration: 'none',
          }),
          expect.objectContaining({
            label: 'Budget',
            color: '#f1d715',
            decoration: 'dash',
          }),
          expect.objectContaining({
            label: 'Current',
            color: '#d1a33c',
          }),
        ]),
      }),
    );
  });

  it('uses empty legend items when legend is absent', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsData={{
          ...baseLineBarChartsData,
          legend: undefined,
        }}
      />,
    );

    expect(mockChartLegend).toHaveBeenCalledWith(
      expect.objectContaining({ items: [] }),
    );
  });

  it('merges line datasets with getColor when border colors are omitted', () => {
    render(<SlidePerformanceTool {...defaultProps} />);

    const lineCall = mockLine.mock.calls[0][0] as {
      datasets: Array<{
        label?: string;
        borderColor?: string;
        pointBackgroundColor?: string;
      }>;
      labelColors: string[];
      highlightedIndexes: number[];
      options: {
        scales: {
          y: {
            suggestedMin?: number;
            suggestedMax?: number;
            afterFit?: (axis: { width: number }) => void;
          };
        };
      };
    };

    expect(lineCall.datasets[0].borderColor).toBe('#custom-border');
    expect(lineCall.datasets[1].borderColor).toBe('#d1a33c');
    expect(lineCall.datasets[1].pointBackgroundColor).toBe('#d1a33c');
    expect(lineCall.labelColors).toEqual(['#secondary-mock', '#default-mock']);
    expect(lineCall.highlightedIndexes).toEqual([0]);

    const axis = { width: 0 };
    lineCall.options.scales.y.afterFit?.(axis);
    expect(axis.width).toBe(45);
  });

  it('returns empty line datasets when line chart datasets are missing', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsData={{
          ...baseLineBarChartsData,
          lineChart: {
            ...baseLineBarChartsData.lineChart,
            datasets:
              undefined as unknown as typeof baseLineBarChartsData.lineChart.datasets,
          },
        }}
      />,
    );

    const lineCall = mockLine.mock.calls[0][0] as { datasets: unknown[] };
    expect(lineCall.datasets).toEqual([]);
  });

  it('computes bar background colors for striped, last, and prior bars', () => {
    render(<SlidePerformanceTool {...defaultProps} />);

    const barCall = mockBar.mock.calls[0][0] as {
      datasets: Array<{ backgroundColor: string[] }>;
      stripedIndexes: number[];
      options: { mockedBarOptions: boolean };
    };

    expect(barCall.datasets[0].backgroundColor).toEqual([
      '#eddab1',
      '#f1d715',
      '#d1a33c',
    ]);
    expect(barCall.stripedIndexes).toEqual([1]);
    expect(barCall.options).toEqual({ mockedBarOptions: true });
    expect(mockGetBarChartOptionsFromDatasets).toHaveBeenCalledWith(
      baseLineBarChartsData.barChart.datasets,
    );
  });

  it('defaults bar labels and stripedIndexes when undefined but datasets exist', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsData={{
          ...baseLineBarChartsData,
          barChart: {
            ...baseLineBarChartsData.barChart,
            labels: undefined,
            stripedIndexes: undefined,
          },
        }}
      />,
    );

    const barCall = mockBar.mock.calls[0][0] as {
      datasets: Array<{ backgroundColor: string[] }>;
      labels: unknown;
      stripedIndexes: number[];
    };

    expect(barCall.labels).toBeUndefined();
    expect(barCall.stripedIndexes).toEqual([]);
    expect(barCall.datasets[0].backgroundColor).toEqual([]);
  });

  it('uses empty bar datasets and default striped indexes when bar section is incomplete', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsData={{
          ...baseLineBarChartsData,
          barChart: {
            labels: undefined,
            formattedData: [],
            stripedIndexes: undefined,
            datasets:
              undefined as unknown as typeof baseLineBarChartsData.barChart.datasets,
          },
        }}
      />,
    );

    const barCall = mockBar.mock.calls[0][0] as {
      datasets: unknown[];
      labels: unknown;
      stripedIndexes: number[];
    };
    expect(barCall.datasets).toEqual([]);
    expect(barCall.stripedIndexes).toEqual([]);
  });

  it('renders ComparisonLine for line and bar when comparisonLine is provided', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsData={{
          ...baseLineBarChartsData,
          lineChart: {
            ...baseLineBarChartsData.lineChart,
            comparisonLine: comparisonBlock,
          },
          barChart: {
            ...baseLineBarChartsData.barChart,
            comparisonLine: comparisonBlock,
          },
        }}
      />,
    );

    expect(mockComparisonLine).toHaveBeenCalledTimes(2);
  });

  it('uses zero grid columns when comparison lines are shown but labels are undefined', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsData={{
          ...baseLineBarChartsData,
          lineChart: {
            ...baseLineBarChartsData.lineChart,
            labels: undefined as unknown as string[],
            comparisonLine: comparisonBlock,
          },
          barChart: {
            ...baseLineBarChartsData.barChart,
            labels: undefined,
            comparisonLine: comparisonBlock,
          },
        }}
      />,
    );

    expect(mockComparisonLine).toHaveBeenCalledTimes(2);
    const comparisonCalls = mockComparisonLine.mock.calls as [
      [Record<string, unknown>],
      [Record<string, unknown>],
    ];
    expect(comparisonCalls[0][0]).toEqual(
      expect.objectContaining({ gridColumnsLength: 0 }),
    );
    expect(comparisonCalls[1][0]).toEqual(
      expect.objectContaining({ gridColumnsLength: 0 }),
    );
  });

  it('does not render ComparisonLine when comparisonLine is absent', () => {
    render(<SlidePerformanceTool {...defaultProps} />);

    expect(mockComparisonLine).not.toHaveBeenCalled();
  });

  it('defaults highlighted indexes to empty array when omitted', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsData={{
          ...baseLineBarChartsData,
          lineChart: {
            ...baseLineBarChartsData.lineChart,
            highlightedIndexes: undefined,
          },
        }}
      />,
    );

    const lineCall = mockLine.mock.calls[0][0] as {
      highlightedIndexes: number[];
    };
    expect(lineCall.highlightedIndexes).toEqual([]);
  });

  it('applies getColor for Last Year and Budget labels on line datasets', () => {
    render(
      <SlidePerformanceTool
        {...defaultProps}
        lineBarChartsData={{
          ...baseLineBarChartsData,
          lineChart: {
            labels: ['Jan'],
            formattedData: [[]],
            datasets: [
              { label: 'Last Year', data: [1] },
              { label: 'Budget', data: [2] },
            ],
          },
        }}
      />,
    );

    const lineCall = mockLine.mock.calls[0][0] as {
      datasets: Array<{ borderColor?: string; pointBackgroundColor?: string }>;
    };

    expect(lineCall.datasets[0].borderColor).toBe('#eddab1');
    expect(lineCall.datasets[1].borderColor).toBe('#f1d715');
  });
});
