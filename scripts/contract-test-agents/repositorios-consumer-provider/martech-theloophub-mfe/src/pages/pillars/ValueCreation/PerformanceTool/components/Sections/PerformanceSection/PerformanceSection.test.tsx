import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { UseBffDataResponse } from 'hooks/useBffData/useBffData';
import { WaterfallConfig } from 'pages/pillars/ValueCreation/PerformanceTool/config';

import { PerformanceSection } from './PerformanceSection';

const mockUsePageFilterApplied = jest.fn();

jest.mock('hooks', () => ({
  usePageFilterApplied: (...args: unknown[]) =>
    mockUsePageFilterApplied(...args),
}));

const mockBasicContainer = jest.fn();

jest.mock('components', () => ({
  ContentCard: ({
    children,
    title,
    fullWidth,
  }: {
    children: React.ReactNode;
    title: string;
    tooltip?: string;
    fullWidth?: boolean;
  }) => (
    <div
      data-testid="content-card"
      data-title={title}
      data-full-width={fullWidth}
    >
      {children}
    </div>
  ),
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
    if (props.loading) return <div data-testid="loading">Loading...</div>;
    if (props.error)
      return <div data-testid="error">{props.error.message}</div>;
    if (props.empty) return <div data-testid="empty">Empty</div>;
    return <div data-testid="content">{props.children}</div>;
  },
  Skeleton: () => <div data-testid="skeleton" />,
}));

jest.mock('./PerformanceSection.styles', () => ({
  StyledSectionsContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sections-container">{children}</div>
  ),
}));

const mockLineBarChartsSection = jest.fn();
jest.mock('../Charts/LineBarChartsSection', () => ({
  LineBarChartsSection: (props: {
    title: string;
    measure: string;
    data: unknown;
  }) => {
    mockLineBarChartsSection(props);
    return (
      <div
        data-testid="line-bar-section"
        data-title={props.title}
        data-measure={props.measure}
      >
        {props.data ? 'has-data' : 'no-data'}
      </div>
    );
  },
}));

const mockWaterfallSection = jest.fn();
jest.mock('../Charts/WaterfallSection', () => ({
  WaterfallSection: (props: {
    title: string;
    measure: string;
    data: unknown;
    variant: string;
    rightContent?: React.ReactNode;
    loading?: boolean;
    error?: Error | null;
  }) => {
    mockWaterfallSection(props);
    return (
      <div
        data-testid="waterfall-section"
        data-title={props.title}
        data-measure={props.measure}
        data-variant={props.variant}
      >
        {props.data ? 'has-data' : 'no-data'}
        {props.rightContent && (
          <span data-testid="right-content">{props.rightContent}</span>
        )}
      </div>
    );
  },
}));

const mockLineBarData = {
  legend: [{ label: 'Last Year' }, { label: 'Current' }],
  lineChart: {
    datasets: [{ label: 'Test', data: [1, 2, 3] }],
    labels: ['Q1', 'Q2', 'Q3'],
    formattedData: [['1', '2', '3']],
  },
  barChart: {
    datasets: [{ label: 'Test', data: [1, 2] }],
    labels: ['YTD24', 'YTD25'],
    formattedData: [['1', '2']],
  },
};

const mockWaterfallData = {
  large: {
    data: [1, 2, 3],
    labels: ['A', 'B', 'C'],
    formattedData: [['1', '2', '3']],
  },
  small: {
    data: [1, 2],
    labels: ['A', 'B'],
    formattedData: [['1', '2']],
  },
};

const createMockRequest = (
  loading = false,
  error: Error | null = null,
): UseBffDataResponse => ({
  data: undefined,
  loading,
  error,
  refetch: jest.fn(),
});

const mockWaterfallConfig: WaterfallConfig = {
  kpiName: 'test',
  viewByToGrouping: { portfolio: 'Portfolio' },
  groupingToViewBy: { global: { Portfolio: 'portfolio' } },
  isViewByDisabled: () => false,
  getDisabledIndexes: () => [0, 1],
  handleBarClick: jest.fn(),
  shouldSyncSubFilters: () => true,
  getContextKey: () => 'global',
};

const defaultProps = {
  measure: '[ test ]',
  lineBarChartsData: mockLineBarData,
  waterfallData: mockWaterfallData,
  lineBarChartsRequest: createMockRequest(),
  waterfallRequest: createMockRequest(),
  waterfallConfig: mockWaterfallConfig,
};

describe('PerformanceSection', () => {
  beforeEach(() => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: { kpis: 'volume' },
    });
  });

  describe('Component Rendering', () => {
    it('should render without errors', () => {
      render(<PerformanceSection {...defaultProps} />);

      expect(screen.getByTestId('content-card')).toBeInTheDocument();
    });

    it('should render LineBarChartsSection with correct props', () => {
      render(<PerformanceSection {...defaultProps} />);

      const lineBarSection = screen.getByTestId('line-bar-section');
      expect(lineBarSection).toBeInTheDocument();
      expect(lineBarSection).toHaveAttribute('data-title', 'Volume Overtime');
      expect(lineBarSection).toHaveAttribute('data-measure', '[ test ]');
    });

    it('should render WaterfallSection with correct props', () => {
      render(<PerformanceSection {...defaultProps} />);

      const waterfallSection = screen.getByTestId('waterfall-section');
      expect(waterfallSection).toBeInTheDocument();
      expect(waterfallSection).toHaveAttribute(
        'data-title',
        'Volume Contribution',
      );
      expect(waterfallSection).toHaveAttribute('data-measure', '[ test ]');
    });
  });

  describe('ContentCard Props', () => {
    it('should render ContentCard with correct title and fullWidth', () => {
      render(<PerformanceSection {...defaultProps} tooltip="Test Tooltip" />);

      const contentCard = screen.getByTestId('content-card');
      expect(contentCard).toHaveAttribute('data-title', 'Volume Performance');
      expect(contentCard).toHaveAttribute('data-full-width', 'true');
    });
  });

  describe('showDrivers prop', () => {
    it('should hide WaterfallSection when showDrivers is true', () => {
      render(<PerformanceSection {...defaultProps} showDrivers />);

      expect(screen.queryByTestId('waterfall-section')).not.toBeInTheDocument();
    });

    it('should show WaterfallSection when showDrivers is false (default)', () => {
      render(<PerformanceSection {...defaultProps} />);

      expect(screen.getByTestId('waterfall-section')).toBeInTheDocument();
    });
  });

  describe('Request Props', () => {
    it('should pass loading=true to LineBarChartsSection when lineBarChartsRequest is loading', () => {
      render(
        <PerformanceSection
          {...defaultProps}
          lineBarChartsRequest={createMockRequest(true)}
        />,
      );

      expect(mockLineBarChartsSection).toHaveBeenCalledWith(
        expect.objectContaining({ loading: true }),
      );
    });

    it('should pass loading=true to WaterfallSection when waterfallRequest is loading', () => {
      render(
        <PerformanceSection
          {...defaultProps}
          waterfallRequest={createMockRequest(true)}
        />,
      );

      expect(mockWaterfallSection).toHaveBeenCalledWith(
        expect.objectContaining({ loading: true }),
      );
    });

    it('should pass error to LineBarChartsSection when lineBarChartsRequest has error', () => {
      const error = new Error('Test error');
      render(
        <PerformanceSection
          {...defaultProps}
          lineBarChartsRequest={createMockRequest(false, error)}
        />,
      );

      expect(mockLineBarChartsSection).toHaveBeenCalledWith(
        expect.objectContaining({ error }),
      );
    });

    it('should pass error to WaterfallSection when waterfallRequest has error', () => {
      const error = new Error('Test error');
      render(
        <PerformanceSection
          {...defaultProps}
          waterfallRequest={createMockRequest(false, error)}
        />,
      );

      expect(mockWaterfallSection).toHaveBeenCalledWith(
        expect.objectContaining({ error }),
      );
    });
  });

  describe('Waterfall Variant', () => {
    it('should use large variant by default', () => {
      render(<PerformanceSection {...defaultProps} />);

      expect(screen.getByTestId('waterfall-section')).toHaveAttribute(
        'data-variant',
        'large',
      );
    });

    it('should pass custom variant to WaterfallSection', () => {
      render(<PerformanceSection {...defaultProps} waterfallVariant="small" />);

      expect(screen.getByTestId('waterfall-section')).toHaveAttribute(
        'data-variant',
        'small',
      );
    });
  });
});
