jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(() => ({
    currentPage: 'value-creation/performance-tool',
  })),
  usePageFilterApplied: jest.fn(() => ({
    applied: {},
    isGlobalZone: true,
  })),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {},
  })),
  usePageFilterManagement: jest.fn(() => ({
    updateForm: jest.fn(),
    apply: jest.fn(),
  })),
  useSubFilters: jest.fn(() => ({
    activeSubFilters: {},
    setSubFilterValue: jest.fn(),
  })),
}));

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { WaterfallConfig } from '../../../../config';
import { WaterfallSection } from './WaterfallSection';

const mockBasicContainer = jest.fn();
const mockDataStateHandler = jest.fn();
const mockWaterfall = jest.fn();
const mockBrandAvatarList = jest.fn();
const mockComparisonLine = jest.fn();
const mockSubFilterSelect = jest.fn();

jest.mock('components', () => ({
  BasicContainer: (props: Record<string, unknown>) => {
    mockBasicContainer(props);
    const header = props.header as
      { rightContent?: React.ReactNode } | undefined;
    return (
      <div data-testid="basic-container">
        {header?.rightContent}
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
  Waterfall: (props: Record<string, unknown>) => {
    mockWaterfall(props);
    return <div data-testid="waterfall-chart" />;
  },
  BrandAvatarList: (props: Record<string, unknown>) => {
    mockBrandAvatarList(props);
    return <div data-testid="brand-avatar-list" />;
  },
  ComparisonLine: (props: Record<string, unknown>) => {
    mockComparisonLine(props);
    return <div data-testid="comparison-line" />;
  },
  SubFilter: {
    Select: (props: Record<string, unknown>) => {
      mockSubFilterSelect(props);
      return <div data-testid="subfilter-select" />;
    },
  },
}));

jest.mock('./WaterfallSection.styles', () => ({
  StyledWaterfallContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="waterfall-container">{children}</div>
  ),
  StyledChartContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-container">{children}</div>
  ),
}));

const mockConfig: WaterfallConfig = {
  kpiName: 'power',
  viewByToGrouping: { portfolio: 'Portfolio', brand: 'All Brands' },
  groupingToViewBy: { global: { Portfolio: 'portfolio' } },
  isViewByDisabled: () => false,
  getDisabledIndexes: (labels = []) => [0, labels.length - 1],
  handleBarClick: jest.fn(),
  shouldSyncSubFilters: () => true,
  getContextKey: () => 'global',
};

const mockData = {
  large: {
    data: [55.3, 0.5, 0.3, -0.2, 55.3],
    values: [55.3, 0.5, 0.3, -0.2, 55.3],
    labels: ["Q3'24", 'BRA', 'MEX', 'CHN', "Q3'25"],
    formattedData: [['55.3', '0.5', '0.3', '-0.2', '55.3']],
    images: {
      data: [
        {
          title: "Q3'24",
          mainBrand: { src: 'test.png', alt: 'Test' },
        },
      ],
    },
    comparisonLine: {
      data: [
        {
          title: 'vs LY',
          data: [
            { value: '-', measure: '' },
            { value: '-0.2', measure: 'pp', trend: 'negative' as const },
          ],
        },
      ],
    },
  },
  small: {
    data: [55.3, 0.5, 55.3],
    values: [55.3, 0.5, 55.3],
    labels: ["Q3'24", 'BRA', "Q3'25"],
    formattedData: [['55.3', '0.5', '55.3']],
  },
};

describe('WaterfallSection', () => {
  describe('Component Rendering', () => {
    it('should render the container with the Waterfall chart', () => {
      render(
        <WaterfallSection
          config={mockConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('waterfall-chart')).toBeInTheDocument();
    });

    it('should pass renderLegend to Waterfall interactiveConfig', () => {
      render(
        <WaterfallSection
          config={mockConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      const waterfallCall = mockWaterfall.mock.calls[0][0];
      expect(waterfallCall).toMatchObject({
        interactiveConfig: {
          renderLegend: expect.any(Function),
          clickability: {
            enabled: true,
            disabledIndexes: expect.arrayContaining([0, 4]),
          },
          onBarSelect: expect.any(Function),
        },
      });
    });
  });

  describe('BasicContainer Props', () => {
    it('should pass correct header props', () => {
      render(
        <WaterfallSection
          config={mockConfig}
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
          fullWidth: true,
        }),
      );
    });

    it('should render subFilters in rightContent when provided', () => {
      render(
        <WaterfallSection
          config={mockConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockBasicContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          header: expect.objectContaining({
            rightContent: expect.anything(),
          }),
        }),
      );
    });
  });

  describe('DataStateHandler Props', () => {
    it('should pass loading state correctly', () => {
      render(
        <WaterfallSection
          config={mockConfig}
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
        <WaterfallSection
          config={mockConfig}
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

    it('should not be empty when using mocked data', () => {
      render(
        <WaterfallSection
          config={mockConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockDataStateHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          empty: false,
        }),
      );
    });
  });

  describe('Variant Selection', () => {
    it('should pass data.large values and labels to Waterfall by default', () => {
      render(
        <WaterfallSection
          config={mockConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockWaterfall).toHaveBeenCalledWith(
        expect.objectContaining({
          values: mockData.large.values,
          labels: mockData.large.labels,
          formattedData: mockData.large.formattedData,
        }),
      );
    });

    it('should pass data.small values and labels to Waterfall when variant is small', () => {
      render(
        <WaterfallSection
          config={mockConfig}
          title="Test Title"
          data={mockData}
          loading={false}
          variant="small"
        />,
      );

      expect(mockWaterfall).toHaveBeenCalledWith(
        expect.objectContaining({
          values: mockData.small.values,
          labels: mockData.small.labels,
          formattedData: mockData.small.formattedData,
        }),
      );
    });
  });

  describe('Waterfall Chart Props', () => {
    it('should pass correct props to Waterfall', () => {
      render(
        <WaterfallSection
          config={mockConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockWaterfall).toHaveBeenCalledWith(
        expect.objectContaining({
          values: expect.any(Array),
          labels: expect.any(Array),
          showLabels: false,
        }),
      );
    });
  });

  describe('Interactive Config', () => {
    it('should configure clickability with disabled indexes', () => {
      render(
        <WaterfallSection
          config={mockConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      const waterfallCall = mockWaterfall.mock.calls[0][0];
      expect(waterfallCall.interactiveConfig.clickability).toEqual({
        enabled: true,
        disabledIndexes: [0, 4],
      });
    });

    it('should pass onBarSelect callback', () => {
      render(
        <WaterfallSection
          config={mockConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      const waterfallCall = mockWaterfall.mock.calls[0][0];
      expect(waterfallCall.interactiveConfig.onBarSelect).toBeInstanceOf(
        Function,
      );
    });
  });

  describe('Configuration Integration', () => {
    it('should propagate config.kpiName into the SubFilter.Select apiKey (with underscores normalized to dashes)', () => {
      const customConfig = { ...mockConfig, kpiName: 'market_share' };
      render(
        <WaterfallSection
          config={customConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(mockSubFilterSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          apiKey: 'performance-tool-waterfall-options_market-share',
          stateKey: 'waterfall_view_by',
        }),
      );
    });

    it('should use config.getDisabledIndexes for clickability', () => {
      const getDisabledIndexes = jest.fn(() => [1, 2, 3]);
      const customConfig = { ...mockConfig, getDisabledIndexes };

      render(
        <WaterfallSection
          config={customConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      expect(getDisabledIndexes).toHaveBeenCalledWith(mockData.large.labels);
    });

    it('should invoke config.handleBarClick when a bar index is selected', () => {
      const handleBarClick = jest.fn();
      const customConfig = { ...mockConfig, handleBarClick };

      render(
        <WaterfallSection
          config={customConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      const onBarSelect = mockWaterfall.mock.calls[0][0].interactiveConfig
        .onBarSelect as (index: number | null) => void;
      onBarSelect(2);

      expect(handleBarClick).toHaveBeenCalledTimes(1);
      expect(handleBarClick).toHaveBeenCalledWith(
        expect.objectContaining({ index: 2, labels: mockData.large.labels }),
      );
    });

    it('should NOT invoke config.handleBarClick when index is null', () => {
      const handleBarClick = jest.fn();
      const customConfig = { ...mockConfig, handleBarClick };

      render(
        <WaterfallSection
          config={customConfig}
          title="Test Title"
          data={mockData}
          loading={false}
        />,
      );

      const onBarSelect = mockWaterfall.mock.calls[0][0].interactiveConfig
        .onBarSelect as (index: number | null) => void;
      onBarSelect(null);

      expect(handleBarClick).not.toHaveBeenCalled();
    });
  });
});
