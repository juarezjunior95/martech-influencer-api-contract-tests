import React from 'react';

import { render, screen } from '@testing-library/react';

import { commercialResultsWaterfallData } from '../../../../__mocks__/Waterfall';
import { UseWaterfallData } from '../../../../types';
import { WaterfallSection } from './WaterfallSection';

const mockWaterfall = jest.fn();
const mockSubFilterSelect = jest.fn();
const mockDataStateHandler = jest.fn();
const mockBasicContainer = jest.fn();
const mockComparisonLine = jest.fn();
const mockBrandAvatarList = jest.fn();

jest.mock('components', () => ({
  BasicContainer: (props: {
    header: { title: string; measure: string; rightContent: React.ReactNode };
    children: React.ReactNode;
    fullWidth?: boolean;
  }) => {
    mockBasicContainer(props);
    return (
      <div
        data-testid="basic-container"
        data-title={props.header?.title}
        data-measure={props.header?.measure}
      >
        {props.header?.rightContent}
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
  Waterfall: (props: Record<string, unknown>) => {
    mockWaterfall(props);
    return <div data-testid="waterfall" />;
  },
  ComparisonLine: (props: Record<string, unknown>) => {
    mockComparisonLine(props);
    return <div data-testid="comparison-line" />;
  },
  BrandAvatarList: (props: Record<string, unknown>) => {
    mockBrandAvatarList(props);
    return <div data-testid="brand-avatar-list" />;
  },
  SubFilter: {
    Select: (props: Record<string, unknown>) => {
      mockSubFilterSelect(props);
      return (
        <div
          data-testid="subfilter-select"
          data-context-key={props.contextKey as string}
        />
      );
    },
  },
  Skeleton: () => <div data-testid="skeleton" />,
}));

jest.mock('./WaterfallSection.styles', () => ({
  StyledWaterfallContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="waterfall-container">{children}</div>
  ),
  StyledChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
}));

jest.mock('pages/pillars/ValueCreation/PerformanceTool/constants', () => ({
  WATERFALL_COLORS: ['#000'],
}));

const mockGetDisabledIndexes = jest.fn(() => [0, 6]);

const mockConfig = {
  kpiName: 'volume',
  getDisabledIndexes: mockGetDisabledIndexes,
} as any;

const mockHandleBarClick = jest.fn();
const mockHandleViewByChange = jest.fn();

const mockData: UseWaterfallData = {
  title: 'Volume Waterfall',
  loading: false,
  error: null,
  isViewByDisabled: false,
  contextKey: 'global',
  handleViewByChange: mockHandleViewByChange,
  handleBarClick: mockHandleBarClick,
  waterfallData: commercialResultsWaterfallData,
};

function renderWaterfallSection(
  overrides: Partial<{ data: UseWaterfallData; measure: string }> = {},
) {
  return render(
    <WaterfallSection
      config={mockConfig}
      measure="[ k hl ]"
      data={mockData}
      {...overrides}
    />,
  );
}

describe('WaterfallSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDisabledIndexes.mockReturnValue([0, 6]);
  });

  describe('rendering', () => {
    it('renders without errors', () => {
      renderWaterfallSection();

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
    });

    it('passes title and measure to BasicContainer header', () => {
      renderWaterfallSection({ measure: '[ % ]' });

      const container = screen.getByTestId('basic-container');
      expect(container).toHaveAttribute('data-title', 'Volume Waterfall');
      expect(container).toHaveAttribute('data-measure', '[ % ]');
    });

    it('renders the Waterfall chart', () => {
      renderWaterfallSection();

      expect(screen.getByTestId('waterfall')).toBeInTheDocument();
    });

    it('renders the SubFilter.Select in the header', () => {
      renderWaterfallSection();

      expect(screen.getByTestId('subfilter-select')).toBeInTheDocument();
    });

    it('renders ComparisonLine when chartData has comparisonLine data', () => {
      renderWaterfallSection();

      expect(screen.getByTestId('comparison-line')).toBeInTheDocument();
    });

    it('does NOT render ComparisonLine when comparisonLine data is absent', () => {
      const dataWithoutComparison: UseWaterfallData = {
        ...mockData,
        waterfallData: {
          ...commercialResultsWaterfallData,
          comparisonLine: undefined,
        },
      };

      renderWaterfallSection({ data: dataWithoutComparison });

      expect(screen.queryByTestId('comparison-line')).not.toBeInTheDocument();
    });
  });

  describe('DataStateHandler states', () => {
    it('renders loading state when data.loading is true', () => {
      renderWaterfallSection({ data: { ...mockData, loading: true } });

      expect(screen.getByTestId('loading')).toBeInTheDocument();
      expect(screen.queryByTestId('waterfall')).not.toBeInTheDocument();
    });

    it('renders error state when data.error is set', () => {
      const error = new Error('Fetch failed');
      renderWaterfallSection({ data: { ...mockData, error } });

      expect(screen.getByTestId('error')).toHaveTextContent('Fetch failed');
    });

    it('renders empty state when waterfallData is null', () => {
      renderWaterfallSection({
        data: { ...mockData, waterfallData: null as any },
      });

      expect(screen.getByTestId('empty')).toBeInTheDocument();
    });

    it('passes skeletonProps to DataStateHandler when provided', () => {
      const skeletonProps = {
        height: '200px',
        width: '50%',
        length: 2,
        borderRadius: 'none' as const,
      };
      render(
        <WaterfallSection
          config={mockConfig}
          measure="[ k hl ]"
          data={mockData}
          skeletonProps={skeletonProps}
        />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({ skeletonProps }),
      );
    });
  });

  describe('SubFilter.Select props', () => {
    it('passes the contextKey to SubFilter.Select', () => {
      renderWaterfallSection();

      expect(screen.getByTestId('subfilter-select')).toHaveAttribute(
        'data-context-key',
        'global',
      );
    });

    it('passes isViewByDisabled to SubFilter.Select', () => {
      renderWaterfallSection({ data: { ...mockData, isViewByDisabled: true } });

      expect(mockSubFilterSelect).toHaveBeenCalledWith(
        expect.objectContaining({ disabled: true }),
      );
    });

    it('passes handleViewByChange as onValueChange to SubFilter.Select', () => {
      renderWaterfallSection();

      expect(mockSubFilterSelect).toHaveBeenCalledWith(
        expect.objectContaining({ onValueChange: mockHandleViewByChange }),
      );
    });

    it('builds the apiKey using the normalized kpiName (underscores → dashes)', () => {
      const configWithUnderscores = { ...mockConfig, kpiName: 'market_share' };
      render(
        <WaterfallSection
          config={configWithUnderscores}
          measure="[ k hl ]"
          data={mockData}
        />,
      );

      expect(mockSubFilterSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'performance-tool-waterfall-options_market-share',
        }),
      );
    });
  });
});
