import React from 'react';

import { render, screen } from '@testing-library/react';

import {
  commercialResultsLineBarChartMock_monthlyView,
  commercialResultsLineBarChartMock_volumeOvertime,
} from '../../../../__mocks__/LineBarChart';
import { UseLineBarChartData } from '../../../../types';
import { LineBarChartsSection } from './LineBarChartSection';

const mockLine = jest.fn();
const mockBar = jest.fn();
const mockComparisonLine = jest.fn();
const mockChartLegend = jest.fn();
const mockDataStateHandler = jest.fn();
const mockBasicContainer = jest.fn();

jest.mock('components', () => ({
  BasicContainer: (props: {
    header: { title: string; measure?: string; bottomTag?: React.ReactNode };
    children: React.ReactNode;
  }) => {
    mockBasicContainer(props);
    return (
      <div
        data-testid="basic-container"
        data-title={props.header?.title}
        data-measure={props.header?.measure}
      >
        {props.header?.bottomTag}
        {props.children}
      </div>
    );
  },
  DataStateHandler: (props: {
    loading: boolean;
    error: Error | null;
    empty: boolean;
    children: React.ReactNode;
    skeletonProps?: Record<string, unknown>;
  }) => {
    mockDataStateHandler(props);
    if (props.loading) return <div data-testid="loading">Loading</div>;
    if (props.error)
      return <div data-testid="error">{props.error.message}</div>;
    if (props.empty) return <div data-testid="empty">Empty</div>;
    return <div data-testid="data-state-content">{props.children}</div>;
  },
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
  ChartLegend: (props: Record<string, unknown>) => {
    mockChartLegend(props);
    return <div data-testid="chart-legend" />;
  },
  SkeletonProps: {},
}));

jest.mock('./LineBarChartSection.styles', () => ({
  StyledBodyContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="body-container">{children}</div>
  ),
  StyledChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
  StyledChartsWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="charts-wrapper">{children}</div>
  ),
  StyledChartWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-wrapper">{children}</div>
  ),
  StyledLegendContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="legend-container">{children}</div>
  ),
  StyledLineBarChartsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-bar-charts-grid">{children}</div>
  ),
  StyledSubtitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="subtitle">{children}</div>
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/PerformanceTool/constants/performanceLineTooltipLabels',
  () => ({
    PERFORMANCE_LINE_TOOLTIP_LABELS: {},
  }),
);

jest.mock(
  'pages/pillars/ValueCreation/PerformanceTool/utils/getBarChartOptions',
  () => ({
    getBarChartOptionsFromDatasets: jest.fn(() => ({})),
  }),
);

jest.mock('theme', () => ({
  theme: {
    colors: {
      txt: {
        secondary: '#999',
        default: '#333',
      },
    },
  },
}));

const skeletonProps = {
  height: '200px',
  width: '100%',
  length: 2,
  borderRadius: 'small' as const,
};

const mockLineBarChartData: UseLineBarChartData = {
  title: 'Volume Overtime',
  subtitle: { prefix: 'Showing data for', value: 'YTD' },
  data: commercialResultsLineBarChartMock_volumeOvertime as any,
  loading: false,
  error: null,
  showLineDataLabels: false,
};

function renderSection(
  overrides: Partial<UseLineBarChartData> = {},
  measure?: string,
) {
  const lineBarChartData = { ...mockLineBarChartData, ...overrides };
  return render(
    <LineBarChartsSection
      lineBarChartData={lineBarChartData}
      skeletonProps={skeletonProps}
      measure={measure}
    />,
  );
}

describe('LineBarChartsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders without errors', () => {
      renderSection();

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
    });

    it('passes title and measure to BasicContainer header', () => {
      renderSection({}, '[ k hl ]');

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-title', 'Volume Overtime');
      expect(container).toHaveAttribute('data-measure', '[ k hl ]');
    });

    it('renders the subtitle with prefix and value', () => {
      renderSection();

      const subtitle = screen.getByTestId('subtitle');
      expect(subtitle).toHaveTextContent('Showing data for');
      expect(subtitle).toHaveTextContent('YTD');
    });

    it('renders the Line chart', () => {
      renderSection();

      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('renders the Bar chart', () => {
      renderSection();

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('renders the ChartLegend', () => {
      renderSection();

      expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
    });
  });

  describe('DataStateHandler states', () => {
    it('renders loading state when loading is true', () => {
      renderSection({ loading: true });

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    it('renders error state when error is set', () => {
      const error = new Error('Fetch failed');
      renderSection({ error });

      expect(screen.getByTestId('error')).toHaveTextContent('Fetch failed');
    });

    it('renders empty state when data is null', () => {
      renderSection({ data: null as any });

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    it('renders empty state when data.empty is true', () => {
      renderSection({
        data: { ...mockLineBarChartData.data, empty: true },
      });

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    it('passes skeletonProps to DataStateHandler', () => {
      renderSection();

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({ skeletonProps }),
      );
    });
  });

  describe('ComparisonLine rendering', () => {
    it('renders two ComparisonLines when both lineChart and barChart have comparisonLine', () => {
      renderSection();

      expect(screen.getAllByTestId('comparison-line')).toHaveLength(2);
    });

    it('renders only barChart ComparisonLine when lineChart has no comparisonLine', () => {
      renderSection({
        data: {
          ...mockLineBarChartData.data,
          lineChart: {
            ...mockLineBarChartData.data.lineChart,
            comparisonLine: undefined,
          },
        } as any,
      });

      expect(screen.getAllByTestId('comparison-line')).toHaveLength(1);
    });

    it('renders only lineChart ComparisonLine when barChart has no comparisonLine', () => {
      renderSection({
        data: {
          ...mockLineBarChartData.data,
          barChart: {
            ...mockLineBarChartData.data.barChart,
            comparisonLine: undefined,
          },
        } as any,
      });

      expect(screen.getAllByTestId('comparison-line')).toHaveLength(1);
    });

    it('renders no ComparisonLine when neither chart has comparisonLine', () => {
      renderSection({
        data: {
          ...mockLineBarChartData.data,
          lineChart: {
            ...mockLineBarChartData.data.lineChart,
            comparisonLine: undefined,
          },
          barChart: {
            ...mockLineBarChartData.data.barChart,
            comparisonLine: undefined,
          },
        } as any,
      });

      expect(screen.queryByTestId('comparison-line')).not.toBeInTheDocument();
    });
  });

  describe('legend items', () => {
    it('passes legend items derived from data.legend to ChartLegend', () => {
      renderSection();

      expect(mockChartLegend).toHaveBeenCalledWith(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              label: 'Last Year',
              shape: 'rectangle',
              size: 'small',
              decoration: 'none',
            }),
            expect.objectContaining({
              label: 'Budget',
              shape: 'rectangle',
              size: 'small',
              decoration: 'dash',
            }),
            expect.objectContaining({
              label: 'Current',
              shape: 'rectangle',
              size: 'small',
              decoration: 'none',
            }),
          ]),
        }),
      );
    });

    it('passes empty items to ChartLegend when data.legend is undefined', () => {
      renderSection({
        data: {
          ...mockLineBarChartData.data,
          legend: undefined,
        } as any,
      });

      expect(mockChartLegend).toHaveBeenCalledWith(
        expect.objectContaining({ items: [] }),
      );
    });
  });

  describe('Line chart props', () => {
    it('passes datasets with fallback borderColor and pointBackgroundColor to Line', () => {
      const dataWithoutColors = {
        ...mockLineBarChartData.data,
        lineChart: {
          ...mockLineBarChartData.data.lineChart,
          datasets: [
            {
              label: 'Current Year',
              data: [1, 2, 3],
              borderColor: undefined,
              pointBackgroundColor: undefined,
            },
          ],
        },
      };
      renderSection({ data: dataWithoutColors as any });

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              borderColor: '#d1a33c',
              pointBackgroundColor: '#d1a33c',
            }),
          ]),
        }),
      );
    });

    it('passes formattedData to Line when showLineDataLabels is true', () => {
      renderSection({ showLineDataLabels: true });

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          formattedData: mockLineBarChartData.data.lineChart.formattedData,
        }),
      );
    });

    it('passes undefined formattedData to Line when showLineDataLabels is false', () => {
      renderSection({ showLineDataLabels: false });

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({ formattedData: undefined }),
      );
    });

    it('passes highlightedIndexes from lineChart data to Line', () => {
      renderSection();

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({
          highlightedIndexes:
            mockLineBarChartData.data.lineChart.highlightedIndexes,
        }),
      );
    });

    it('uses empty array for highlightedIndexes when lineChart has no highlightedIndexes', () => {
      renderSection({
        data: {
          ...mockLineBarChartData.data,
          lineChart: {
            ...mockLineBarChartData.data.lineChart,
            highlightedIndexes: undefined,
          },
        } as any,
      });

      expect(mockLine).toHaveBeenCalledWith(
        expect.objectContaining({ highlightedIndexes: [] }),
      );
    });
  });

  describe('Bar chart props', () => {
    it('passes datasets with backgroundColor to Bar', () => {
      renderSection();

      expect(mockBar).toHaveBeenCalledWith(
        expect.objectContaining({
          datasets: expect.arrayContaining([
            expect.objectContaining({
              backgroundColor: expect.any(Array),
            }),
          ]),
        }),
      );
    });

    it('passes stripedIndexes to Bar', () => {
      renderSection();

      expect(mockBar).toHaveBeenCalledWith(
        expect.objectContaining({
          stripedIndexes: mockLineBarChartData.data.barChart.stripedIndexes,
        }),
      );
    });

    it('uses monthlyView mock data (no stripedIndexes)', () => {
      renderSection({
        data: commercialResultsLineBarChartMock_monthlyView as any,
      });

      expect(mockBar).toHaveBeenCalledWith(
        expect.objectContaining({ stripedIndexes: [] }),
      );
    });
  });
});
