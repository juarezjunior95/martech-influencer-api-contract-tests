import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import * as ReactRouterDOM from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';
import { rootReducer } from 'redux/store';
import { getViewtype } from 'utils/filter';

import { Overview } from './Overview';

const MEMORY_ROUTER_FUTURE = {
  v7_relativeSplatPath: true,
  v7_startTransition: true,
} as const;

let mockAiSummaryEnabled: boolean | undefined = true;
let mockIsAiSummaryLoading = false;
let mockPerfToggleEnabled: boolean | undefined = true;

const mockNavigate = jest.fn();
const setSubFilterValueMock = jest.fn();

jest.mock('react-router-dom', () => {
  const actual =
    jest.requireActual<typeof import('react-router-dom')>('react-router-dom');

  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

const createMockBigNumbersData = (count = 4) => {
  const ids = ['volume', 'volumeMix', 'netRevenue', 'grossMargin'];

  return Array.from({ length: count }, (_, index) => ({
    id: ids[index] || `metric-${index}`,
    period: "Aug'25",
    hasDeepDive: true,
    colorIndicator: index % 2 === 0 ? '#007800' : '#0066CC',
    data: [
      {
        bigNumber: {
          value: String(10 + index * 5),
          measure: '%',
          color: '#007800',
        },
        comparison: {
          label: 'vs',
          value: "Jul'25",
        },
      },
    ],
  }));
};

const createMockChartData = (yearCount = 3) => {
  const currentYear = 2024;
  const labels = Array.from({ length: yearCount }, (_, i) =>
    String(currentYear - yearCount + i + 1),
  );

  return {
    labels,
    datasets: [
      {
        label: 'Core Innovation',
        data: labels.map((_, i) => 10 + i * 5),
        backgroundColor: '#EDDAB1',
      },
      {
        label: 'Adjacencies',
        data: labels.map((_, i) => 8 + i * 3),
        backgroundColor: '#D3E3EE',
      },
    ],
    datasetsSum: labels.map((_, i) => 18 + i * 8),
    connector: {
      value: '1.6',
      from: labels[0],
      to: labels.at(-1),
      backgroundColor: '#E6F9E6',
      textColor: '#007800',
      measure: 'pp',
    },
    comparisonLine: {
      title: 'Growth',
      data: labels.map((_, i) => {
        const value = (1.2 + i * 0.5) * (i % 2 === 0 ? 1 : -1);
        return {
          value: String(value.toFixed(1)),
          measure: '%',
          color: value > 0 ? '#007800' : '#CC0000',
        };
      }),
    },
  };
};

const createMockStrategicInnovationData = (yearCount = 3) => {
  const chartData = createMockChartData(yearCount);

  return [
    {
      id: 'portfolio',
      headerColor: '#E8F5E9',
      chartSection: {
        bigNumber: {
          id: 'portfolio-health',
          period: "Aug'25",
          data: [
            {
              bigNumber: {
                value: '10.5',
                measure: '%',
                color: '#007800',
              },
              comparison: {
                label: 'vs',
                value: "Jul'25",
                number: {
                  value: chartData.connector.value,
                  measure: chartData.connector.measure,
                  color: chartData.connector.textColor,
                },
              },
            },
          ],
        },
        chart: chartData,
      },
    },
    {
      id: 'core',
      headerColor: '#FFF8E1',
      chartSection: {
        bigNumber: {
          id: 'core-innovation',
          period: "Aug'25",
          data: [
            {
              bigNumber: {
                value: '25.3',
                measure: '%',
                color: '#007800',
              },
            },
          ],
        },
        chart: createMockChartData(yearCount),
      },
    },
    {
      id: 'adjacent',
      headerColor: '#E3F2FD',
      chartSection: {
        bigNumber: {
          id: 'adjacent-innovation',
          period: "Aug'25",
          data: [
            {
              bigNumber: {
                value: '15.8',
                measure: '%',
                color: '#007800',
              },
            },
          ],
        },
        chart: createMockChartData(yearCount),
      },
    },
  ];
};

const createMockBffData = (yearCount = 3) => ({
  'big-numbers': createMockBigNumbersData(4),
  'strategic-innovation-pillars': createMockStrategicInnovationData(yearCount),
});

const mockBigNumber = jest.fn((props: any) => {
  const Root = props.onClick ? 'button' : 'div';

  return (
    <Root
      type={props.onClick ? 'button' : undefined}
      data-testid={props.dataTestId ?? props['data-testid'] ?? 'big-number'}
      data-as-card={props.asCard}
      data-size={props.size}
      onClick={props.onClick}
    >
      {props.header}
      <div data-testid="big-number-value">{JSON.stringify(props.data)}</div>
    </Root>
  );
});

const mockBar = jest.fn((props: any) => (
  <div
    data-testid={props['data-testid'] || 'bar-chart'}
    data-labels={JSON.stringify(props.labels)}
    data-datasets-count={props.datasets?.length}
  >
    Bar Chart Mock
  </div>
));

const mockComparisonLine = jest.fn((props: any) => (
  <div
    data-testid={props['data-testid'] || 'comparison-line'}
    data-grid-length={props.gridColumnsLength}
  >
    {props.data?.map((item: any) => {
      const segment = (d: any) => [d.value, d.measure, d.color].join('|');
      const dataSegments = (item.data ?? []).map(segment).join(';');
      const groupKey =
        typeof item?.title === 'string' && item.title.length > 0
          ? `${item.title}:${dataSegments}`
          : `group-${dataSegments || 'empty'}`;

      return (
        <div key={groupKey} data-testid={`comparison-item-${groupKey}`}>
          {item.data?.map((dataItem: any) => {
            const pointKey = `${dataItem.value}-${dataItem.measure}-${dataItem.color}`;
            return (
              <span
                key={pointKey}
                data-testid={`comparison-value-${pointKey}`}
                style={{ color: dataItem.color }}
              >
                {dataItem.value}
                {dataItem.measure}
              </span>
            );
          })}
        </div>
      );
    })}
  </div>
));

const mockSkeleton = jest.fn((props: any) => (
  <div
    data-testid="skeleton"
    data-height={props.height}
    data-width={props.width}
    data-length={props.length}
  />
));

const mockBasicContainer = jest.fn((props: any) => (
  <div data-testid={props.dataTestId || 'basic-container'}>
    {props.header && (
      <div data-testid="container-header">{props.header.title}</div>
    )}
    {props.children}
  </div>
));

const mockCountryFlag = jest.fn(() => (
  <div data-testid="country-flag">Flag</div>
));

jest.mock('components', () => ({
  BasicContainer: (props: any) => mockBasicContainer(props),
  CountryFlag: () => mockCountryFlag(),
  BigNumber: (props: any) => mockBigNumber(props),
  ChartHeader: (props: any) => (
    <div data-testid="chart-header">
      <span data-testid="chart-header-title">{props.title}</span>
      <span data-testid="chart-header-period">{props.period}</span>
    </div>
  ),
  Skeleton: (props: any) => mockSkeleton(props),
  Bar: (props: any) => mockBar(props),
  NoDataYet: () => <div data-testid="no-data-yet">No Data Yet</div>,
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      innovation: {
        submenus: {
          innovation: {
            tab: {
              performanceAndBreakdown: {
                id: 'performanceAndBreakdown',
              },
              overview: {
                aiSummary: 'ai_summary_innovation_overview',
              },
            },
          },
        },
      },
    },
  },
}));

jest.mock('components/ComparisonLine/ComparisonLine', () => ({
  ComparisonLine: (props: any) => mockComparisonLine(props),
}));

jest.mock('pages/components/AISummary', () => ({
  AISummaryAlert: ({
    pageName,
    kpiGroup,
    dataTestId,
    summaryPageIdentifier,
    subFilters,
  }: {
    pageName: string;
    kpiGroup?: string;
    dataTestId?: string;
    summaryPageIdentifier?: string;
    subFilters?: Record<string, unknown>;
  }) => (
    <div
      data-testid={
        dataTestId ? `${dataTestId}-ai-summary` : `ai-summary-${pageName}`
      }
      data-page-name={pageName}
      data-kpi-group={kpiGroup}
      data-summary-page-identifier={summaryPageIdentifier}
      data-sub-filters={JSON.stringify(subFilters ?? null)}
    >
      AI Summary Component
    </div>
  ),
}));

jest.mock('react-intl', () => ({
  IntlProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useIntl: () => ({
    formatMessage: jest.fn(({ id }) => id),
  }),
}));

const mockUseBffData = jest.fn();
const mockUseCurrentPage = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterStatus = jest.fn();
const mockUseSubFilters = jest.fn();
const mockUseLastDataRefresh = jest.fn();
const mockUseFeatureToggle = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (params: any) => mockUseBffData(params),
  useCurrentPage: () => mockUseCurrentPage(),
  usePageFilterApplied: () => mockUsePageFilterApplied(),
  usePageFilterStatus: () => mockUsePageFilterStatus(),
  useSubFilters: () => mockUseSubFilters(),
  useFeatureToggle: (...args: any[]) => mockUseFeatureToggle(...args),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

jest.mock('utils/filter', () => ({
  getViewtype: jest.fn(() => 'country'),
}));

jest.mock(
  './components/StrategicInnovationItemContent/StrategicInnovationItemContent',
  () => {
    const mockReact = jest.requireActual('react') as typeof import('react');

    return {
      StrategicInnovationItemContent: (props: any) => {
        const chartSection = props.item.chartSection;
        const hasChart = (chartSection?.chart?.datasets?.length ?? 0) > 0;

        return mockReact.createElement(
          'div',
          { 'data-testid': 'strategic-innovation-item-content' },
          mockReact.createElement(
            'div',
            { 'data-testid': 'strategic-innovation-chart-section' },
            mockReact.createElement(
              'div',
              { 'data-testid': 'strategic-innovation-big-number-container' },
              chartSection?.bigNumber &&
                mockReact.createElement(
                  'div',
                  {
                    'data-testid': 'big-number',
                    'data-as-card': false,
                    'data-size': 'small',
                  },
                  JSON.stringify(chartSection.bigNumber),
                ),
            ),
            mockReact.createElement(
              'div',
              { 'data-testid': 'strategic-innovation-chart-content' },
              hasChart
                ? mockReact.createElement(
                    mockReact.Fragment,
                    null,
                    mockReact.createElement(
                      'div',
                      {
                        'data-testid': 'strategic-innovation-bar',
                        'data-labels': JSON.stringify(
                          chartSection.chart.labels,
                        ),
                        'data-datasets-count':
                          chartSection.chart.datasets?.length,
                        'data-connector': JSON.stringify(
                          chartSection.chart.connector,
                        ),
                      },
                      'Bar Chart Mock',
                    ),
                    chartSection.chart.comparisonLine &&
                      mockReact.createElement(
                        'div',
                        {
                          'data-testid':
                            'strategic-innovation-comparison-line-container',
                        },
                        mockReact.createElement(
                          'div',
                          {
                            'data-testid': 'comparison-line',
                            'data-grid-length':
                              chartSection.chart.comparisonLine.data.length,
                            'data-comparison-data': JSON.stringify(
                              chartSection.chart.comparisonLine,
                            ),
                          },
                          chartSection.chart.comparisonLine.data.map(
                            (item: any) => {
                              const pointKey = `${item.value}-${item.measure}-${item.color}`;
                              return mockReact.createElement(
                                'div',
                                {
                                  key: pointKey,
                                  'data-testid': `comparison-item-${pointKey}`,
                                },
                                mockReact.createElement(
                                  'span',
                                  {
                                    'data-testid': `comparison-value-${pointKey}`,
                                    style: { color: item.color },
                                  },
                                  `${item.value}${item.measure}`,
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                  )
                : mockReact.createElement(
                    'div',
                    { 'data-testid': 'strategic-innovation-no-data-yet' },
                    'No Data Yet',
                  ),
            ),
          ),
        );
      },
    };
  },
);

const createTestStore = () => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      subFilters: {
        activeSubFilters: {},
        subFiltersData: {},
        disabledFields: [],
        subFiltersInUse: {},
        subFiltersLoaded: {},
        hiddenSubFilters: {},
      },
    },
  });
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = createTestStore();

  return (
    <Provider store={store}>
      <IntlProvider locale="pt-BR" messages={{}}>
        <MemoryRouter
          future={MEMORY_ROUTER_FUTURE}
          initialEntries={['/innovation/innovation/overview']}
        >
          {children}
        </MemoryRouter>
      </IntlProvider>
    </Provider>
  );
};

const renderOverview = (yearCount = 3, overrides: any = {}) => {
  mockUseCurrentPage.mockReturnValue({ currentPage: 'innovation' });

  mockUsePageFilterApplied.mockReturnValue({
    applied: {
      country: ['BR'],
      zone: ['LATAM'],
    },
  });

  mockUsePageFilterStatus.mockReturnValue({
    isLoading: false,
  });

  mockUseSubFilters.mockReturnValue({
    setSubFilterValue: setSubFilterValueMock,
    activeSubFilters: {},
  });

  mockUseLastDataRefresh.mockReturnValue({
    lastDataRefreshKpisDateMonthYear: {
      'portfolio-health': '2025-08',
      'pillar-rennovation': '2025-08',
    },
  });

  const mockData = createMockBffData(yearCount);

  mockUseBffData.mockReturnValue({
    data: mockData,
    loading: false,
    error: null,
    ...overrides.bffData,
  });

  return render(
    <TestWrapper>
      <Overview dataTestId="overview" />
    </TestWrapper>,
  );
};

const getDatasetValue = (element: HTMLElement, key: string): string => {
  const value = element.dataset[key];
  if (!value) {
    throw new Error(`Dataset key "${key}" not found`);
  }
  return value;
};

describe('Overview Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ReactRouterDOM.useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    mockAiSummaryEnabled = true;
    mockIsAiSummaryLoading = false;
    mockPerfToggleEnabled = true;

    mockUseCurrentPage.mockReturnValue({ currentPage: 'innovation' });
    mockUsePageFilterApplied.mockReturnValue({
      applied: { country: ['BR'], zone: ['LATAM'] },
    });
    mockUsePageFilterStatus.mockReturnValue({ isLoading: false });
    mockUseSubFilters.mockReturnValue({
      setSubFilterValue: setSubFilterValueMock,
      activeSubFilters: {},
    });
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDateMonthYear: {
        'portfolio-health': '2025-08',
        'pillar-rennovation': '2025-08',
      },
    });
    mockUseBffData.mockReturnValue({
      data: { 'big-numbers': [], 'strategic-innovation-pillars': [] },
      loading: false,
      error: null,
    });
    mockUseFeatureToggle.mockImplementation((toggleKey: string) => {
      if (toggleKey === 'ai_summary_innovation_overview') {
        return [mockAiSummaryEnabled, mockIsAiSummaryLoading];
      }
      return [mockPerfToggleEnabled, false];
    });
  });

  describe('BigNumbers Section', () => {
    it('should render BigNumbers with expected props and values from BFF data', () => {
      renderOverview();

      expect(
        screen.getByTestId('overview-big-numbers-container'),
      ).toBeInTheDocument();

      const mockBigNumbersData = createMockBigNumbersData(4);
      expect(mockBigNumber.mock.calls.length).toBeGreaterThan(0);

      mockBigNumbersData.forEach((item) => {
        const callIndex = mockBigNumber.mock.calls.findIndex(
          (call) =>
            call[0].data?.[0]?.bigNumber?.value ===
            item.data[0].bigNumber.value,
        );

        if (callIndex !== -1) {
          const props = mockBigNumber.mock.calls[callIndex][0];
          expect(props.asCard).toBeDefined();
          expect(props.size).toBe('small');
        }

        const renderedData = screen.getAllByTestId('big-number-value');
        const hasValue = renderedData.some((el) =>
          el.textContent?.includes(item.data[0].bigNumber.value),
        );
        expect(hasValue).toBe(true);
      });
    });
  });

  describe('Bar Charts with Historical Data', () => {
    it('should render bar chart with all historical years from backend', () => {
      const yearCount = 3;
      renderOverview(yearCount);

      const barCharts = screen.getAllByTestId('strategic-innovation-bar');
      expect(barCharts.length).toBeGreaterThan(0);

      const firstBarChart = barCharts[0];
      const labelsAttr = getDatasetValue(firstBarChart, 'labels');
      const labels = JSON.parse(labelsAttr);

      expect(labels).toHaveLength(yearCount);

      const mockChartData = createMockChartData(yearCount);
      mockChartData.labels.forEach((year) => {
        expect(labels).toContain(year);
      });
    });

    it('should render correct number of datasets for each year', () => {
      const yearCount = 3;
      renderOverview(yearCount);

      const firstBarChart = screen.getAllByTestId(
        'strategic-innovation-bar',
      )[0];
      const datasetsCountAttr = getDatasetValue(firstBarChart, 'datasetsCount');
      const datasetsCount = Number.parseInt(datasetsCountAttr, 10);

      expect(datasetsCount).toBeGreaterThan(0);
    });

    it.each([3, 4, 5] as const)(
      'should render bar chart labels matching backend year count (%s)',
      (yearCount) => {
        renderOverview(yearCount);
        const firstBarChart = screen.getAllByTestId(
          'strategic-innovation-bar',
        )[0];
        const labels = JSON.parse(getDatasetValue(firstBarChart, 'labels'));
        expect(labels).toHaveLength(yearCount);
      },
    );
  });

  describe('Growth Percentages and ComparisonLine', () => {
    it('should display growth percentages for each year in the dataset', () => {
      const yearCount = 3;
      renderOverview(yearCount);

      const comparisonLines = screen.getAllByTestId('comparison-line');
      expect(comparisonLines.length).toBeGreaterThan(0);

      const firstComparison = comparisonLines[0];
      const gridLength = getDatasetValue(firstComparison, 'gridLength');
      expect(gridLength).toBe(String(yearCount));

      const comparisonItems = screen.queryAllByTestId(/comparison-value-/);
      expect(comparisonItems.length).toBeGreaterThanOrEqual(yearCount);
    });

    it('should render comparison growth points with colors from chart data', () => {
      const yearCount = 3;
      renderOverview(yearCount);
      const mockChartData = createMockChartData(yearCount);

      mockChartData.comparisonLine.data.forEach((item) => {
        const pointKey = `${item.value}-${item.measure}-${item.color}`;
        const elements = screen.getAllByTestId(`comparison-value-${pointKey}`);
        elements.forEach((el) => {
          expect(el).toHaveStyle({ color: item.color });
        });
      });
    });
  });

  describe('Total Growth Indicator', () => {
    it('should show total growth indicator above the last bar', () => {
      const yearCount = 3;
      renderOverview(yearCount);

      const firstBarChart = screen.getAllByTestId(
        'strategic-innovation-bar',
      )[0];
      const connector = JSON.parse(getDatasetValue(firstBarChart, 'connector'));
      const labels = JSON.parse(getDatasetValue(firstBarChart, 'labels'));

      expect(connector).toBeDefined();
      expect(connector.value).toBeDefined();
      expect(connector.measure).toBeDefined();

      const lastYear = labels.at(-1);

      expect(connector.to).toBe(lastYear);
    });

    it('should display correct total growth value and measure', () => {
      renderOverview(3);

      const firstBarChart = screen.getAllByTestId(
        'strategic-innovation-bar',
      )[0];
      const connector = JSON.parse(getDatasetValue(firstBarChart, 'connector'));

      expect(connector.value).toBe('1.6');
      expect(connector.measure).toBe('pp');
    });

    it('should apply correct color to total growth indicator', () => {
      renderOverview(3);

      const firstBarChart = screen.getAllByTestId(
        'strategic-innovation-bar',
      )[0];
      const connector = JSON.parse(getDatasetValue(firstBarChart, 'connector'));

      const value = Number.parseFloat(connector.value);
      const expectedColor = value > 0 ? '#007800' : '#CC0000';

      expect(connector.textColor).toBe(expectedColor);
      expect(connector.backgroundColor).toBe('#E6F9E6');
    });

    it.each([3, 4] as const)(
      'should connect total growth from first to last year (%s years)',
      (yearCount) => {
        renderOverview(yearCount);
        const firstBarChart = screen.getAllByTestId(
          'strategic-innovation-bar',
        )[0];
        const connector = JSON.parse(
          getDatasetValue(firstBarChart, 'connector'),
        );
        const labels = JSON.parse(getDatasetValue(firstBarChart, 'labels'));

        expect(connector.from).toBe(labels[0]);
        expect(connector.to).toBe(labels.at(-1));
      },
    );
  });

  describe('Loading State', () => {
    it('should show loading skeleton while data is being fetched', () => {
      renderOverview(3, {
        bffData: {
          loading: true,
          data: null,
        },
      });

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);

      expect(
        screen.queryByTestId('strategic-innovation-bar'),
      ).not.toBeInTheDocument();
      expect(screen.queryByTestId('comparison-line')).not.toBeInTheDocument();
    });

    it('should display Skeleton component with correct props during loading', () => {
      renderOverview(3, {
        bffData: {
          loading: true,
          data: null,
        },
      });

      expect(mockSkeleton).toHaveBeenCalled();

      const skeletonCalls = mockSkeleton.mock.calls;
      skeletonCalls.forEach((call) => {
        const props = call[0];
        expect(props.height).toBeDefined();
        expect(props.width).toBeDefined();
      });
    });

    it('should hide skeleton and show data after loading completes', () => {
      const { rerender } = renderOverview(3, {
        bffData: {
          loading: true,
          data: null,
        },
      });

      expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);

      mockUseBffData.mockReturnValue({
        data: createMockBffData(3),
        loading: false,
        error: null,
      });

      rerender(
        <TestWrapper>
          <Overview dataTestId="overview" />
        </TestWrapper>,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(
        screen.getByTestId('overview-big-numbers-container'),
      ).toBeInTheDocument();
    });

    it('should maintain proper data-testid hierarchy', () => {
      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      const container = screen.getByTestId('tabpanel-overview');
      const basicContainer = screen.getByTestId('tabpanel-overview-container');

      expect(container).toContainElement(basicContainer);
    });

    it('should handle data-testid with tabpanel prefix', () => {
      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('tabpanel-overview')).toBeInTheDocument();
      expect(
        screen.getByTestId('tabpanel-overview-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('tabpanel-overview-big-numbers-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('tabpanel-overview-strategic-innovation-container'),
      ).toBeInTheDocument();
    });

    it('should persist data-testid attributes across rerenders', () => {
      const { rerender } = render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('tabpanel-overview')).toBeInTheDocument();
      rerender(
        <TestWrapper>
          <Overview dataTestId="overview" />
        </TestWrapper>,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(
        screen.getByTestId('overview-big-numbers-container'),
      ).toBeInTheDocument();
    });

    it('should not render BigNumbers or Charts during loading', () => {
      renderOverview(3, {
        bffData: {
          loading: true,
          data: null,
        },
      });

      expect(mockBar).not.toHaveBeenCalled();
      expect(mockComparisonLine).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Additional Tests', () => {
    it('should handle empty data gracefully', () => {
      renderOverview(3, {
        bffData: {
          data: {
            'big-numbers': [],
            'strategic-innovation-pillars': [],
          },
          loading: false,
        },
      });

      expect(screen.getByTestId('overview-container')).toBeInTheDocument();
    });

    it('should render with minimum of 1 year of data', () => {
      renderOverview(1);

      const firstBarChart = screen.getAllByTestId(
        'strategic-innovation-bar',
      )[0];
      const labels = JSON.parse(getDatasetValue(firstBarChart, 'labels'));
      expect(labels).toHaveLength(1);
    });

    it('should render with maximum expected years', () => {
      renderOverview(6);

      const firstBarChart = screen.getAllByTestId(
        'strategic-innovation-bar',
      )[0];
      const labels = JSON.parse(getDatasetValue(firstBarChart, 'labels'));
      expect(labels).toHaveLength(6);
    });

    it('should maintain data consistency across BigNumbers and Charts', () => {
      renderOverview(3);

      const bigNumbers = screen.getAllByTestId(/overview-big-numbers-item-/);
      const barCharts = screen.getAllByTestId('strategic-innovation-bar');

      expect(bigNumbers.length).toBeGreaterThan(0);
      expect(barCharts.length).toBeGreaterThan(0);
    });

    it('should render correct section titles', () => {
      renderOverview(3);

      expect(
        screen.getByTestId('overview-big-numbers-heading'),
      ).toBeInTheDocument();

      expect(
        screen.getByTestId('overview-strategic-innovation-heading'),
      ).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    it('should render complete Overview with all sections', () => {
      renderOverview(3);

      expect(screen.getByTestId('overview-container')).toBeInTheDocument();
      expect(
        screen.getByTestId('overview-big-numbers-container'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('overview-strategic-innovation-container'),
      ).toBeInTheDocument();
    });

    it('should pass correct filters to useBffData hook', () => {
      renderOverview(3);

      expect(getViewtype).toHaveBeenCalledWith(['BR']);
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'innovation_innovation_overview',
          kpiGroup: 'innovation',
          skipRequest: false,
          subFilters: {
            'portfolio-health': {
              country: ['BR'],
              zone: ['LATAM'],
              viewtype: 'country',
              dt_end: '2025-08',
            },
            'pillar-rennovation': {
              country: ['BR'],
              viewtype: 'country',
              dt_end: '2025-08',
            },
          },
        }),
      );
    });
  });

  describe('useBffData when filters are loading', () => {
    it('should pass skipRequest true while page filters are loading', () => {
      mockUsePageFilterStatus.mockReturnValue({ isLoading: true });
      mockUseBffData.mockReturnValue({
        data: null,
        loading: true,
        error: null,
      });

      render(
        <TestWrapper>
          <Overview dataTestId="overview" />
        </TestWrapper>,
      );

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({ skipRequest: true }),
      );
    });
  });

  describe('Performance deep dive', () => {
    it('should navigate and set kpis sub-filter when a big number is clicked', () => {
      mockPerfToggleEnabled = true;
      renderOverview();

      fireEvent.click(screen.getByTestId('overview-big-numbers-big-number-0'));

      expect(setSubFilterValueMock).toHaveBeenCalledWith('kpis', 'volume');
      expect(mockNavigate).toHaveBeenCalledWith(
        '/innovation/innovation/performance-and-breakdown?kpi=volume',
      );
    });

    it('should not wire deep dive when performance toggle is disabled', () => {
      mockPerfToggleEnabled = false;
      renderOverview();

      fireEvent.click(screen.getByTestId('overview-big-numbers-big-number-0'));

      expect(setSubFilterValueMock).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('AI Summary feature toggle', () => {
    it('should render AISummary when toggle is enabled and not loading', () => {
      mockAiSummaryEnabled = true;
      mockIsAiSummaryLoading = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.getByTestId('tabpanel-overview-ai-summary'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('tabpanel-overview-ai-summary'),
      ).toHaveTextContent('AI Summary Component');
    });

    it('should NOT render AISummary when toggle is disabled', () => {
      mockAiSummaryEnabled = false;
      mockIsAiSummaryLoading = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.queryByTestId('tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AISummary when toggle is loading', () => {
      mockAiSummaryEnabled = true;
      mockIsAiSummaryLoading = true;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.queryByTestId('tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AISummary when toggle is disabled and loading', () => {
      mockAiSummaryEnabled = false;
      mockIsAiSummaryLoading = true;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.queryByTestId('tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AISummary when toggle is undefined (not yet resolved)', () => {
      mockAiSummaryEnabled = undefined;
      mockIsAiSummaryLoading = true;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.queryByTestId('tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AISummary when toggle is undefined and loading is false', () => {
      mockAiSummaryEnabled = undefined;
      mockIsAiSummaryLoading = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.queryByTestId('tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should call useFeatureToggle with the correct AI Summary toggle key', () => {
      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview />
        </MemoryRouter>,
      );

      expect(mockUseFeatureToggle).toHaveBeenCalledWith(
        'ai_summary_innovation_overview',
      );
    });

    it('should call useFeatureToggle with the correct Performance toggle key', () => {
      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview />
        </MemoryRouter>,
      );

      expect(mockUseFeatureToggle).toHaveBeenCalledWith(
        'performanceAndBreakdown',
      );
    });

    it('should pass correct pageName prop to AISummary', () => {
      mockAiSummaryEnabled = true;
      mockIsAiSummaryLoading = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      const aiSummary = screen.getByTestId('tabpanel-overview-ai-summary');
      expect(aiSummary).toHaveAttribute('data-page-name', 'innovation');
    });

    it('should pass correct kpiGroup prop to AISummary', () => {
      mockAiSummaryEnabled = true;
      mockIsAiSummaryLoading = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      const aiSummary = screen.getByTestId('tabpanel-overview-ai-summary');
      expect(aiSummary).toHaveAttribute('data-kpi-group', 'innovation');
    });

    it('should pass summaryPageIdentifier and subFilters to AISummary', () => {
      mockAiSummaryEnabled = true;
      mockIsAiSummaryLoading = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      const aiSummary = screen.getByTestId('tabpanel-overview-ai-summary');
      expect(aiSummary).toHaveAttribute(
        'data-summary-page-identifier',
        AI_SUMMARY_PAGE_IDENTIFIERS.INNOVATION_OVERVIEW,
      );
      expect(aiSummary).toHaveAttribute(
        'data-sub-filters',
        JSON.stringify({ timeframe: null }),
      );
    });

    it('should pass correct dataTestId prop to AISummary', () => {
      mockAiSummaryEnabled = true;
      mockIsAiSummaryLoading = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.getByTestId('tabpanel-overview-ai-summary'),
      ).toBeInTheDocument();
    });

    it('should render AISummary with fallback testId when dataTestId is not provided', () => {
      mockAiSummaryEnabled = true;
      mockIsAiSummaryLoading = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('ai-summary-innovation')).toBeInTheDocument();
    });

    it('should render AISummary independently from Performance toggle', () => {
      mockAiSummaryEnabled = true;
      mockIsAiSummaryLoading = false;
      mockPerfToggleEnabled = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.getByTestId('tabpanel-overview-ai-summary'),
      ).toBeInTheDocument();
    });

    it('should NOT render AISummary when disabled even if Performance toggle is enabled', () => {
      mockAiSummaryEnabled = false;
      mockIsAiSummaryLoading = false;
      mockPerfToggleEnabled = true;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.queryByTestId('tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should still render BigNumbers and StrategicInnovation when AI Summary toggle is disabled', () => {
      mockAiSummaryEnabled = false;
      mockIsAiSummaryLoading = false;

      render(
        <MemoryRouter future={MEMORY_ROUTER_FUTURE}>
          <Overview dataTestId="tabpanel-overview" />
        </MemoryRouter>,
      );

      expect(
        screen.getByTestId('tabpanel-overview-big-numbers-container'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });
  });
});
