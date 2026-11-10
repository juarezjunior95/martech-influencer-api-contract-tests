import '@testing-library/jest-dom';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { featureToggles } from 'config/featureToggle';
import { BffNormalizedData } from 'services';

import { KpiDrillDown } from './KpiDrillDown';
import { KpiDrillDownConfig } from './types';

const exploreFurtherIntlMessages: Record<string, string> = {
  'ExploreFurther.title': 'Explore Further',
  'ExploreFurther.subtitle': 'Deep Dive Analysis',
  'ExploreFurther.tooltip':
    'Continue your analysis across multiple business dimensions and key performance.',
  'ExploreFurther.commercialResults.title': 'Commercial Data',
  'ExploreFurther.commercialResults.description':
    'Continue analyzing country performance across business dimensions, such as channel, pack type, region, and more.',
  'ExploreFurther.commercialResults.linkLabel': 'Go to Commercial Results',
  'ExploreFurther.watchTower.title': 'Drivers Decomposition',
  'ExploreFurther.watchTower.description':
    'Understand how key drivers impact Brand Performance.',
  'ExploreFurther.watchTower.linkLabel': 'Go to WatchTower Drivers',
};

const mockOnFilterChange = jest.fn();

const mockUseMediaQuery = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUseSubFilters = jest.fn();
const mockUseBffData = jest.fn();
const mockUsePerformanceToolData = jest.fn();
const mockUseFeatureToggle = jest.fn();
const mockAISummary = jest.fn();

jest.mock('hooks', () => ({
  useMediaQuery: (...args: unknown[]) => mockUseMediaQuery(...args),
  usePageFilterApplied: (...args: unknown[]) =>
    mockUsePageFilterApplied(...args),
  useSubFilters: (...args: unknown[]) => mockUseSubFilters(...args),
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
  useFeatureToggle: (...args: unknown[]) => mockUseFeatureToggle(...args),
  useGoogleAnalytics: jest.fn(() => jest.fn()),
}));

jest.mock('pages/components/AISummary', () => ({
  AISummary: (props: Record<string, unknown>) => {
    mockAISummary(props);
    return <div data-testid="ai-summary" />;
  },
}));

jest.mock('../../../hooks/usePerformanceToolData', () => ({
  usePerformanceToolData: (...args: unknown[]) =>
    mockUsePerformanceToolData(...args),
}));

jest.mock('../../../PerformanceTool.styles', () => ({
  StyledPerformanceToolContent: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="performance-tool-content">{children}</div>,
}));

jest.mock('components', () => ({
  ExploreFurther: ({
    filterPageName,
    dataTestId,
    cards,
  }: {
    filterPageName: string;
    dataTestId: string;
    cards: any[];
  }) => (
    <div
      data-testid="explore-further"
      data-filter-page-name={filterPageName}
      data-data-test-id={dataTestId}
    >
      {cards.map((card) => (
        <div key={card.title} data-testid="explore-further-card">
          {card.title}
        </div>
      ))}
    </div>
  ),
}));
const mockBigNumbersSection = jest.fn();
const mockPerformanceSection = jest.fn();
jest.mock('../../Sections', () => ({
  BigNumbersSection: (props: any) => {
    mockBigNumbersSection(props);
    return (
      <div
        data-testid="big-numbers-section"
        data-title={props.title}
        data-tooltip={props.tooltip}
        data-loading={props.loading}
        data-error={props.error ? props.error.message : null}
        data-default-selected={props.defaultSelected}
      >
        {props.data ? 'has-data' : 'no-data'}
        {props.onSelect && (
          <button
            data-testid="big-number-select-button"
            onClick={() => props.onSelect?.(0)}
          >
            Select
          </button>
        )}
      </div>
    );
  },
  PerformanceSection: (props: any) => {
    mockPerformanceSection(props);
    return (
      <div
        data-testid="performance-section"
        data-variant={props.waterfallVariant}
        data-measure={props.measure}
      >
        {props.lineBarChartsData ? 'has-line-bar-data' : 'no-line-bar-data'}
        {props.waterfallData ? 'has-waterfall-data' : 'no-waterfall-data'}
      </div>
    );
  },
  DriversSection: ({ title }: { title: string }) => (
    <div data-testid="drivers-section">{title}</div>
  ),
}));

const createMockBffData = (
  loading = false,
  error: Error | null = null,
  data: BffNormalizedData | null = null,
) => ({
  data,
  loading,
  error,
  refetch: jest.fn(),
});

const PERIOD_VALUES = ['YTD', 'L3M', 'MTD'] as const;

const mockWaterfallConfig = {
  kpiName: 'test-kpi',
  viewByToGrouping: { portfolio: 'Portfolio' },
  groupingToViewBy: { global: { Portfolio: 'portfolio' } },
  isViewByDisabled: () => false,
  getDisabledIndexes: () => [0, 1],
  handleBarClick: jest.fn(),
  shouldSyncSubFilters: () => true,
};

const defaultConfig: KpiDrillDownConfig = {
  kpiSlug: 'volume',
  kpiGroup: 'volume',
  waterfallConfig: mockWaterfallConfig as any,
  measure: '[ k hl ]',
  driversTitle: 'Volume Drivers',
  periodValues: PERIOD_VALUES,
};

const mockBigNumbersData = [
  {
    header: { title: 'KPI YTD', measure: '[ k hl ]' },
    data: [
      {
        bigNumber: { value: '-0.7', measure: '%', trend: 'negative' },
        secondaryInfo: { value: '41,921.5', label: '[ k hl ]' },
        comparison: { label: 'vs', value: 'LY' },
      },
    ],
  },
  {
    header: { title: 'KPI L3M', measure: '[ k hl ]' },
    data: [
      {
        bigNumber: { value: '0.5', measure: '%', trend: 'positive' },
        secondaryInfo: { value: '5,126.5', label: '[ k hl ]' },
        comparison: { label: 'vs', value: 'LY' },
      },
    ],
  },
  {
    header: { title: 'KPI MTD', measure: '[ k hl ]' },
    data: [
      {
        bigNumber: { value: '0.5', measure: '%', trend: 'positive' },
        secondaryInfo: { value: '5,126.5', label: '[ k hl ]' },
        comparison: { label: 'vs', value: 'LY' },
      },
    ],
  },
];

const mockOvertimeData = {
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
  large: { data: [1, 2, 3], labels: ['A', 'B', 'C'] },
  small: { data: [1, 2], labels: ['A', 'B'] },
};

const defaultApplied = {
  zone: 'NAZ',
  country: 'CAN',
  kpis: 'volume',
  brand_filter_groupings: 'All Brands',
  portfolios: 'All',
  periods: 'YTD',
  growth_levers: 'All',
  brands: 'All',
  sub_brands: 'All',
};

const commercialResultsToggleId =
  featureToggles.pillar.valueCreation.submenus.commercialResults.id;
const aiSummaryVolumeToggleId =
  featureToggles.pillar.valueCreation.submenus.performanceTool.aiSummary.volume;

function setFeatureToggleMock(options?: {
  aiSummaryEnabled?: boolean;
  aiSummaryLoading?: boolean;
  commercialResultsEnabled?: boolean;
  commercialResultsLoading?: boolean;
}) {
  const {
    commercialResultsEnabled = false,
    commercialResultsLoading = false,
    aiSummaryEnabled = false,
    aiSummaryLoading = false,
  } = options ?? {};
  mockUseFeatureToggle.mockImplementation((id: string) => {
    if (id === commercialResultsToggleId) {
      return [commercialResultsEnabled, commercialResultsLoading];
    }
    if (id === aiSummaryVolumeToggleId) {
      return [aiSummaryEnabled, aiSummaryLoading];
    }
    return [false, false];
  });
}

const setupDefaultMocks = () => {
  mockUsePerformanceToolData.mockReset();
  mockUseMediaQuery.mockReturnValue(false);
  mockUsePageFilterApplied.mockReturnValue({ applied: defaultApplied });
  mockUseSubFilters.mockReturnValue({
    activeSubFilters: { waterfall_view_by: undefined },
  });
  setFeatureToggleMock();
  mockUseBffData.mockReturnValue(createMockBffData(false, null));
  mockUsePerformanceToolData
    .mockReturnValueOnce({ 'overtime-performance': mockBigNumbersData })
    .mockReturnValueOnce({ 'overtime-trends': mockOvertimeData })
    .mockReturnValueOnce({ contribution: mockWaterfallData })
    .mockReturnValueOnce({ composition: undefined });
};

type RenderKpiDrillDownOptions = {
  initialEntries?: string[];
};

const renderComponent = (
  config: KpiDrillDownConfig = defaultConfig,
  options?: RenderKpiDrillDownOptions,
) =>
  render(
    <IntlProvider
      locale="en-US"
      messages={exploreFurtherIntlMessages}
      onError={() => undefined}
    >
      <MemoryRouter
        initialEntries={
          options?.initialEntries ?? ['/value-creation/performance-tool']
        }
      >
        <KpiDrillDown config={config} onFilterChange={mockOnFilterChange} />
      </MemoryRouter>
    </IntlProvider>,
  );

describe('KpiDrillDown', () => {
  beforeEach(() => {
    setupDefaultMocks();
  });

  describe('Rendering', () => {
    it('should render the wrapper, BigNumbersSection and PerformanceSection', () => {
      renderComponent();

      expect(
        screen.getByTestId('performance-tool-content'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('big-numbers-section')).toBeInTheDocument();
      expect(screen.getByTestId('performance-section')).toBeInTheDocument();
    });

    it('should not render DriversSection when sub_brands is All', () => {
      renderComponent();

      expect(screen.queryByTestId('drivers-section')).not.toBeInTheDocument();
    });

    it('should render DriversSection when sub_brands is set and not All', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { ...defaultApplied, sub_brands: 'SubBrand1' },
      });

      renderComponent();

      expect(screen.getByTestId('drivers-section')).toBeInTheDocument();
      expect(screen.getByTestId('drivers-section')).toHaveTextContent(
        'Volume Drivers',
      );
    });

    it('should not render DriversSection when sub_brands is falsy', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { ...defaultApplied, sub_brands: undefined },
      });

      renderComponent();

      expect(screen.queryByTestId('drivers-section')).not.toBeInTheDocument();
    });
  });

  describe('Config Props', () => {
    it('should render BigNumbersSection with default title', () => {
      renderComponent();

      expect(screen.getByTestId('big-numbers-section')).toHaveAttribute(
        'data-title',
        'Overtime Performance',
      );
    });

    it('should render BigNumbersSection with custom title', () => {
      renderComponent({
        ...defaultConfig,
        bigNumbersTitle: 'Custom Title',
      });

      expect(screen.getByTestId('big-numbers-section')).toHaveAttribute(
        'data-title',
        'Custom Title',
      );
    });

    it('should pass tooltip to BigNumbersSection when provided', () => {
      renderComponent({
        ...defaultConfig,
        bigNumbersTooltip: 'My Tooltip',
      });

      expect(mockBigNumbersSection).toHaveBeenCalledWith(
        expect.objectContaining({ tooltip: 'My Tooltip' }),
      );
    });

    it('should pass undefined tooltip when not provided', () => {
      renderComponent();

      expect(mockBigNumbersSection).toHaveBeenCalledWith(
        expect.objectContaining({ tooltip: undefined }),
      );
    });

    it('should pass measure to PerformanceSection', () => {
      renderComponent();

      expect(screen.getByTestId('performance-section')).toHaveAttribute(
        'data-measure',
        '[ k hl ]',
      );
    });

    it('should pass waterfallConfig to PerformanceSection', () => {
      renderComponent();

      expect(mockPerformanceSection).toHaveBeenCalledWith(
        expect.objectContaining({ waterfallConfig: mockWaterfallConfig }),
      );
    });

    it('should render drivers title from config', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { ...defaultApplied, sub_brands: 'SubBrand1' },
      });

      renderComponent({
        ...defaultConfig,
        driversTitle: 'Net Revenue Drivers',
      });

      expect(screen.getByTestId('drivers-section')).toHaveTextContent(
        'Net Revenue Drivers',
      );
    });
  });

  describe('BFF Data Calls', () => {
    it('should build BFF IDs from kpiSlug', () => {
      renderComponent({
        ...defaultConfig,
        kpiSlug: 'net-revenue',
        kpiGroup: 'finance',
      });

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'value-creation_performance-tool_drill-down_net-revenue_overtime-performance',
        }),
      );
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'value-creation_performance-tool_drill-down_net-revenue_overtime-trends',
        }),
      );
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'value-creation_performance-tool_drill-down_net-revenue_contribution',
        }),
      );
    });

    it('should use kpiGroup volume for all BFF calls', () => {
      renderComponent();

      const calls = mockUseBffData.mock.calls;
      calls.forEach((call: unknown[]) => {
        expect(call[0]).toEqual(
          expect.objectContaining({ kpiGroup: 'volume' }),
        );
      });
    });

    it('should pass hardcoded YTD timeframe for big numbers', () => {
      renderComponent();

      expect(mockUseBffData).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          subFilters: expect.objectContaining({ timeframe: 'YTD' }),
        }),
      );
    });

    it('should pass applied.periods as timeframe for overtime and waterfall', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { ...defaultApplied, periods: 'L3M' },
      });

      renderComponent();

      expect(mockUseBffData).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          subFilters: expect.objectContaining({
            timeframe: 'L3M',
            period_type: 'L3M',
          }),
        }),
      );
      expect(mockUseBffData).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          subFilters: expect.objectContaining({
            timeframe: 'L3M',
            period_type: 'L3M',
          }),
        }),
      );
    });

    it('should pass waterfall_filter from activeSubFilters', () => {
      mockUseSubFilters.mockReturnValue({
        activeSubFilters: { waterfall_view_by: 'portfolio' },
      });

      renderComponent();

      const calls = mockUseBffData.mock.calls;
      calls.forEach((call: unknown[]) => {
        expect(
          (call[0] as { subFilters: Record<string, unknown> }).subFilters,
        ).toEqual(expect.objectContaining({ waterfall_filter: 'portfolio' }));
      });
    });

    it('should pass the expected AI summary filters', () => {
      setFeatureToggleMock({ aiSummaryEnabled: true });

      renderComponent();

      expect(mockAISummary).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({
            country: 'CAN',
            page_filter: 'All',
            brand: 'All',
            sub_brand: 'All',
            growth_lever: 'All',
            period_type: 'YTD',
            viewtype: '',
          }),
        }),
      );
    });

    it('should include growth_lever in AI summary subFilters when a lever is selected and a brand is selected', () => {
      setFeatureToggleMock({ aiSummaryEnabled: true });
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          ...defaultApplied,
          brands: 'Brand X',
          growth_levers: 'Beyond Beer',
        },
      });

      renderComponent();

      expect(mockAISummary).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({
            growth_lever: 'Beyond Beer',
            period_type: 'YTD',
          }),
        }),
      );
    });

    it('should send selected growth_lever for AI summary when brand is All', () => {
      setFeatureToggleMock({ aiSummaryEnabled: true });
      mockUsePageFilterApplied.mockReturnValue({
        applied: { ...defaultApplied, growth_levers: 'Beyond Beer' },
      });

      renderComponent();

      expect(mockAISummary).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({
            brand: 'All',
            growth_lever: 'Beyond Beer',
          }),
        }),
      );
    });

    it('should send growth_lever All for AI summary when a brand is selected but growth levers is All', () => {
      setFeatureToggleMock({ aiSummaryEnabled: true });
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          ...defaultApplied,
          brands: 'Brand X',
          growth_levers: 'All',
        },
      });

      renderComponent();

      expect(mockAISummary).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({
            brand: 'Brand X',
            growth_lever: 'All',
          }),
        }),
      );
    });

    it('should pass AI summary subFilters with period for non-finance_market-share', () => {
      setFeatureToggleMock({ aiSummaryEnabled: true });

      renderComponent({
        ...defaultConfig,
        kpiSlug: 'non-finance_market-share',
        kpiGroup: 'market_share',
        driversTitle: 'Market Share Drivers',
      });

      expect(mockAISummary).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({
            country: 'CAN',
            brand: 'All',
            sub_brand: 'All',
            period: 'YTD',
            viewtype: '',
          }),
        }),
      );
    });

    it('should pass subFilters from getPerformanceToolSubFilters', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          ...defaultApplied,
          brand_filter_groupings: 'Portfolio',
          portfolios: 'Premium',
          brands: 'Brand1',
          growth_levers: 'Lever1',
          sub_brands: 'SubBrand1',
        },
      });

      renderComponent();

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({
            page_filter: 'Premium',
            brand: 'Brand1',
            sub_brand: 'SubBrand1',
            growth_lever: 'Lever1',
          }),
        }),
      );
    });

    it('should default subFilters to All when applied values are undefined', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          portfolios: undefined,
          periods: undefined,
          growth_levers: undefined,
          brands: undefined,
          sub_brands: undefined,
        },
      });

      renderComponent();

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({
            page_filter: 'All',
            growth_lever: 'All',
            brand: 'All',
            sub_brand: 'All',
          }),
        }),
      );
    });
  });

  describe('Waterfall Variant', () => {
    it('should use small variant when screen is not large', () => {
      mockUseMediaQuery.mockReturnValue(false);

      renderComponent();

      expect(screen.getByTestId('performance-section')).toHaveAttribute(
        'data-variant',
        'small',
      );
    });

    it('should use large variant when screen is large', () => {
      mockUseMediaQuery.mockReturnValue(true);

      renderComponent();

      expect(screen.getByTestId('performance-section')).toHaveAttribute(
        'data-variant',
        'large',
      );
    });
  });

  describe('Period Selection', () => {
    it.each([
      ['YTD', 0],
      ['L3M', 1],
      ['MTD', 2],
    ])(
      'should set defaultSelected to %i when periods is %s',
      (period, expectedIndex) => {
        mockUsePageFilterApplied.mockReturnValue({
          applied: { ...defaultApplied, periods: period },
        });

        renderComponent();

        expect(mockBigNumbersSection).toHaveBeenCalledWith(
          expect.objectContaining({ defaultSelected: expectedIndex }),
        );
      },
    );

    it('should set defaultSelected to 0 when periods is not in periodValues', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { ...defaultApplied, periods: 'UNKNOWN' },
      });

      renderComponent();

      expect(mockBigNumbersSection).toHaveBeenCalledWith(
        expect.objectContaining({ defaultSelected: 0 }),
      );
    });
  });

  describe('Big Numbers Selection', () => {
    it('should call onFilterChange with correct period when selecting', () => {
      renderComponent();

      fireEvent.click(screen.getByTestId('big-number-select-button'));

      expect(mockOnFilterChange).toHaveBeenCalledWith('periods', 'YTD');
    });

    it('should not call onFilterChange when overtime-performance data is undefined', () => {
      mockUsePerformanceToolData
        .mockReset()
        .mockReturnValueOnce({ 'overtime-performance': undefined })
        .mockReturnValueOnce({ 'overtime-trends': mockOvertimeData })
        .mockReturnValueOnce({ contribution: mockWaterfallData })
        .mockReturnValueOnce({ composition: undefined });

      renderComponent();

      fireEvent.click(screen.getByTestId('big-number-select-button'));

      expect(mockOnFilterChange).not.toHaveBeenCalled();
    });

    it('should not call onFilterChange when selected index is out of data bounds', () => {
      mockUsePerformanceToolData
        .mockReset()
        .mockReturnValueOnce({
          'overtime-performance': [mockBigNumbersData[0]],
        })
        .mockReturnValueOnce({ 'overtime-trends': mockOvertimeData })
        .mockReturnValueOnce({ contribution: mockWaterfallData })
        .mockReturnValueOnce({ composition: undefined });

      renderComponent();

      const onSelect = mockBigNumbersSection.mock.calls[0][0].onSelect;
      onSelect(5);

      expect(mockOnFilterChange).not.toHaveBeenCalled();
    });
  });

  describe('Loading and Error States', () => {
    it('should pass loading state to BigNumbersSection', () => {
      mockUseBffData.mockReturnValueOnce(createMockBffData(true, null));

      renderComponent();

      expect(mockBigNumbersSection).toHaveBeenCalledWith(
        expect.objectContaining({ loading: true }),
      );
    });

    it('should pass error to BigNumbersSection', () => {
      const error = new Error('Test error');
      mockUseBffData.mockReturnValueOnce(createMockBffData(false, error));

      renderComponent();

      expect(mockBigNumbersSection).toHaveBeenCalledWith(
        expect.objectContaining({ error }),
      );
    });

    it('should pass skeletonProps to BigNumbersSection', () => {
      renderComponent();

      expect(mockBigNumbersSection).toHaveBeenCalledWith(
        expect.objectContaining({
          skeletonProps: {
            height: '112px',
            width: '336px',
            length: 3,
            borderRadius: 'medium',
          },
        }),
      );
    });
  });

  describe('Data Handling', () => {
    it('should handle undefined bigNumbersData', () => {
      mockUsePerformanceToolData
        .mockReset()
        .mockReturnValueOnce({ 'overtime-performance': undefined })
        .mockReturnValueOnce({ 'overtime-trends': mockOvertimeData })
        .mockReturnValueOnce({ contribution: mockWaterfallData })
        .mockReturnValueOnce({ composition: undefined });

      renderComponent();

      expect(mockBigNumbersSection).toHaveBeenCalledWith(
        expect.objectContaining({ data: undefined }),
      );
    });

    it('should handle undefined overtimeData', () => {
      mockUsePerformanceToolData
        .mockReset()
        .mockReturnValueOnce({ 'overtime-performance': mockBigNumbersData })
        .mockReturnValueOnce({ 'overtime-trends': undefined })
        .mockReturnValueOnce({ contribution: mockWaterfallData })
        .mockReturnValueOnce({ composition: undefined });

      renderComponent();

      expect(screen.getByTestId('performance-section')).toHaveTextContent(
        'no-line-bar-data',
      );
    });

    it('should handle undefined waterfallData', () => {
      mockUsePerformanceToolData
        .mockReset()
        .mockReturnValueOnce({ 'overtime-performance': mockBigNumbersData })
        .mockReturnValueOnce({ 'overtime-trends': mockOvertimeData })
        .mockReturnValueOnce({ contribution: undefined })
        .mockReturnValueOnce({ composition: undefined });

      renderComponent();

      expect(screen.getByTestId('performance-section')).toHaveTextContent(
        'no-waterfall-data',
      );
    });
  });

  describe('Explore Further', () => {
    it('should not render Explore Further when Commercial Results toggle is disabled', () => {
      setFeatureToggleMock({ commercialResultsEnabled: false });
      renderComponent();

      expect(screen.queryByTestId('explore-further')).not.toBeInTheDocument();
    });

    it('should not render Explore Further for non-volume KPI when Commercial Results is on', () => {
      setFeatureToggleMock({ commercialResultsEnabled: true });
      renderComponent({
        ...defaultConfig,
        kpiSlug: 'net-revenue',
        kpiGroup: 'finance',
      });

      expect(screen.queryByTestId('explore-further')).not.toBeInTheDocument();
    });

    it('should not render Explore Further when Commercial Results toggle is loading', () => {
      setFeatureToggleMock({
        commercialResultsEnabled: true,
        commercialResultsLoading: true,
      });
      renderComponent();

      expect(screen.queryByTestId('explore-further')).not.toBeInTheDocument();
    });

    it('should render Explore Further for volume when Commercial Results is enabled', () => {
      setFeatureToggleMock({ commercialResultsEnabled: true });
      renderComponent();

      expect(screen.getByTestId('explore-further')).toBeInTheDocument();
    });
  });
});
