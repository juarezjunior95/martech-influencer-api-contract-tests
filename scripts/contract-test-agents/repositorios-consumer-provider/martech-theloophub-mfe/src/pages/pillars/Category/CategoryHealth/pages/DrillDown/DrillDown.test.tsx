import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';

import { DrillDown } from './DrillDown';

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('@hexa-ui/components', () => ({
  Grid: Object.assign(
    ({ children }: any) => <div data-testid="grid">{children}</div>,
    {
      Item: ({ children, style }: any) => (
        <div data-testid="grid-item" style={style}>
          {children}
        </div>
      ),
    },
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({ children }: any) => (
    <div data-testid="styled-grid-container">{children}</div>
  ),
  StyledTooltip: ({ children }: any) => (
    <div data-testid="styled-tooltip">{children}</div>
  ),
}));

const mockFilter = jest.fn();
const mockBreadcrumbs = jest.fn();
const mockStickyScrollWithFilters = jest.fn();

jest.mock('components', () => ({
  StickyScrollWithFilters: (props: any) => {
    mockStickyScrollWithFilters(props);
    mockFilter(props.filter);
    if (props.breadcrumbs) mockBreadcrumbs(props.breadcrumbs);
    return (
      <div data-testid="sticky-scroll-with-filters">
        <div data-testid="filter">Filter</div>
        <div data-testid="breadcrumbs">Breadcrumbs</div>
      </div>
    );
  },
}));

const mockPageTitle = jest.fn();

jest.mock('pages/components', () => ({
  PageTitle: (props: any) => {
    mockPageTitle(props);
    return <div data-testid="page-title">{props.title}</div>;
  },
}));

const mockOvertimePerformance = jest.fn();
const mockLineChartPerformance = jest.fn();
const mockShareOfThroatPerformance = jest.fn();
const mockDrivers = jest.fn();

jest.mock('./components', () => ({
  OvertimePerformance: (props: any) => {
    mockOvertimePerformance(props);
    return <div data-testid="overtime-performance">OvertimePerformance</div>;
  },
  LineChartPerformance: (props: any) => {
    mockLineChartPerformance(props);
    return <div data-testid={props.dataTestId}>LineChartPerformance</div>;
  },
  ShareOfThroatPerformance: (props: any) => {
    mockShareOfThroatPerformance(props);
    return (
      <div data-testid="share-of-throat-performance">
        ShareOfThroatPerformance
      </div>
    );
  },
  Drivers: (props: any) => {
    mockDrivers(props);
    return <div data-testid="drivers">Drivers</div>;
  },
}));

const mockUseBffData = jest.fn();
let mockUseBffDataReturnValues: Record<string, any> = {};

jest.mock('hooks', () => ({
  useBffData: (props: any) => {
    mockUseBffData(props);
    return (
      mockUseBffDataReturnValues[props.id] ?? {
        data: null,
        loading: false,
        error: null,
        refetch: jest.fn(),
      }
    );
  },
}));

let mockAppliedValue: any = {};
let mockIsGlobalZoneValue = false;
const mockIsLoadedValue = true;
let mockDataFiltersValue: any = {};
let mockRefreshDateLabel: any = 'Feb - 2025';
const mockHandleClearAllAndNavigateOverview = jest.fn();

jest.mock('../../hooks/useCategoryHealthFilters', () => ({
  useCategoryHealthFilters: () => ({
    applied: mockAppliedValue,
    isGlobalZone: mockIsGlobalZoneValue,
    isLoaded: mockIsLoadedValue,
    dataFilters: mockDataFiltersValue,
    refreshDateLabel: mockRefreshDateLabel,
    handleClearAllAndNavigateOverview: mockHandleClearAllAndNavigateOverview,
    dispatch: mockDispatch,
  }),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

const mockGetCountry = jest.fn();
const mockGetOptions = jest.fn();

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getCountry: mockGetCountry,
      getOptions: mockGetOptions,
    }),
  },
}));

let mockBreadcrumbPageList = [
  { pageName: 'Category', href: '/category' },
  {
    pageName: 'Category.CategoryHealth.title',
    href: '/category/category-health/overview?filter_zone=ABI&filter_years=2025&filter_segments=Beer',
  },
  { pageName: 'Drill Down', href: '' },
];
const mockUseDrillDownBreadcrumbs = jest.fn();

jest.mock('./hooks/useDrillDownBreadcrumbs', () => ({
  useDrillDownBreadcrumbs: (params: any) => {
    mockUseDrillDownBreadcrumbs(params);
    return mockBreadcrumbPageList;
  },
}));

jest.mock('./utils/buildFilterSearchParams', () => ({
  buildFilterSearchParams: (
    applied: Record<string, any>,
    extras?: Record<string, string>,
  ) => {
    const params = new URLSearchParams();
    if (applied?.zone) params.set('filter_zone', String(applied.zone));
    if (applied?.country) params.set('filter_country', String(applied.country));
    if (applied?.years) params.set('filter_years', String(applied.years));
    if (applied?.segments)
      params.set('filter_segments', String(applied.segments));
    if (extras) {
      Object.entries(extras).forEach(([k, v]) => params.set(k, v));
    }
    return params;
  },
}));

const mockSyncUrlFiltersToRedux = jest.fn().mockReturnValue(false);

jest.mock('../../utils/syncUrlFiltersToRedux', () => ({
  syncUrlFiltersToRedux: (...args: any[]) => mockSyncUrlFiltersToRedux(...args),
}));

jest.mock('../../constants', () => ({
  FILTER_CONFIGS: {
    pageName: 'category-health',
    filtersList: ['zones', 'country'],
    visibleFields: ['zone', 'country', 'years', 'segments'],
    params: {
      'zones[include_global]': true,
      'country[include_global]': false,
    },
  },
  DEFAULT_PRODUCT_TYPE: 'Beer',
  GLOBAL_ZONE: 'ABI',
  DRILL_DOWN_BASE_URL: '/category/category-health/drill-down',
  OVERVIEW_BASE_URL: '/category/category-health/overview',
  KPI_COLUMN_MAPPING: {
    bv_fy: 'volume',
    bv_vsly: 'volume',
    bicl_fy: 'icl',
    bicl_vsly: 'icl',
    sot_fy: 'sot',
    sot_vsly: 'sot',
    bp_fy: 'participation',
    bp_vsly: 'participation',
    wmtbb_fy: 'wmtbb',
    wmtbb_vsly: 'wmtbb',
  },
}));

const mockBffBigNumbers = [
  {
    title: 'Beer Volume',
    kpiKey: 'volume',
    dataTestId: 'beer-volume',
    emptyStateMessage: null,
    data: [
      {
        bigNumber: { value: '1.7', measure: '%', direction: 'up' },
        comparison: { label: 'vs', value: "24'FY" },
        secondaryInfo: { value: '148,817', measure: '[ k hl ]' },
      },
    ],
  },
];

const mockMappedOvertimeData = [
  {
    title: 'Beer Volume',
    kpiKey: 'volume',
    dataTestId: 'beer-volume',
    emptyStateMessage: undefined,
    data: [
      {
        bigNumber: {
          value: '1.7',
          measure: '%',
          trend: 'positive',
          color: undefined,
        },
        comparison: { label: 'vs', value: "24'FY" },
        secondaryInfo: { value: '148,817', measure: '[ k hl ]' },
      },
    ],
  },
];

const mockApiData = {
  beerVolume: {
    title: 'Beer Volume Performance',
    chartTitle: 'Beer Volume Overtime',
    chartLabel: 'Beer Volume',
    unit: 'k hl',
    comparisonTitle: 'vs LY',
    labels: ['2024', '2025'],
    values: [135.9, 151.4],
    formattedValues: ['135.9', '151.4'],
    comparisonData: [],
  },
  beerIcl: {
    title: 'Beer ICL',
    chartTitle: 'BICL Overtime',
    chartLabel: 'BICL',
    unit: 'L/Year',
    comparisonTitle: 'vs LY',
    labels: ['2024', '2025'],
    values: [92.4, 93.0],
    formattedValues: ['92.4', '93.0'],
    comparisonData: [],
  },
  beerParticipation: {
    title: 'Beer Participation',
    chartTitle: 'Beer Participation Overtime',
    chartLabel: 'Beer Participation',
    unit: '%',
    comparisonTitle: 'vs LY',
    labels: ['2024', '2025'],
    values: [51.4, 52.6],
    formattedValues: ['51.4', '52.6'],
    comparisonData: [],
  },
  wmtbb: {
    title: 'WMTBB',
    chartTitle: 'WMTBB Overtime',
    chartLabel: 'WMTBB',
    unit: 'Min',
    comparisonTitle: 'vs LY',
    labels: ['2024', '2025'],
    values: [9.8, 7.3],
    formattedValues: ['9.8', '7.3'],
    comparisonData: [],
  },
  beyondBeerVolume: {
    title: 'BYB Volume',
    chartTitle: 'BYB Volume Overtime',
    chartLabel: 'BYB Volume',
    unit: 'k hl',
    comparisonTitle: 'vs LY',
    labels: [],
    values: [],
    formattedValues: [],
    comparisonData: [],
  },
  beyondBeerIcl: {
    title: 'BYB ICL',
    chartTitle: 'BYB ICL Overtime',
    chartLabel: 'BYB ICL',
    unit: 'L/Year',
    comparisonTitle: 'vs LY',
    labels: [],
    values: [],
    formattedValues: [],
    comparisonData: [],
  },
  beyondBeerParticipation: {
    title: 'BYB Participation',
    chartTitle: 'BYB Participation Overtime',
    chartLabel: 'BYB Participation',
    unit: '%',
    comparisonTitle: 'vs LY',
    labels: [],
    values: [],
    formattedValues: [],
    comparisonData: [],
  },
  beerBeyondBeerVolume: {
    title: 'B+BYB Volume',
    chartTitle: 'B+BYB Volume Overtime',
    chartLabel: 'B+BYB Volume',
    unit: 'k hl',
    comparisonTitle: 'vs LY',
    labels: [],
    values: [],
    formattedValues: [],
    comparisonData: [],
  },
  beerBeyondBeerIcl: {
    title: 'B+BYB ICL',
    chartTitle: 'B+BYB ICL Overtime',
    chartLabel: 'B+BYB ICL',
    unit: 'L/Year',
    comparisonTitle: 'vs LY',
    labels: [],
    values: [],
    formattedValues: [],
    comparisonData: [],
  },
  beerBeyondBeerParticipation: {
    title: 'B+BYB Participation',
    chartTitle: 'B+BYB Participation Overtime',
    chartLabel: 'B+BYB Participation',
    unit: '%',
    comparisonTitle: 'vs LY',
    labels: [],
    values: [],
    formattedValues: [],
    comparisonData: [],
  },
  drivers: {
    title: 'Drivers',
    chartTitle: 'Population & BICL Overtime',
    populationUnit: '# and L/Year',
    populationLabel: 'Population',
    iclLabel: 'BICL',
    populationComparisonTitle: 'Population vs LY',
    iclComparisonTitle: 'BICL vs LY',
    labels: ['2024', '2025'],
    populationValues: [160.1, 162.8],
    iclValues: [92.4, 93.0],
    populationFormattedValues: ['160.1', '162.8'],
    iclFormattedValues: ['92.4', '93.0'],
    populationComparisonData: [],
    iclComparisonData: [],
  },
  shareOfThroat: null,
  metadata: {
    filters: {
      overtime_performance: 'volume' as const,
      years: '2025',
      zone: 'LATAM',
      segments: 'Beer' as const,
      country: 'BRA',
    },
    lastUpdate: '2025-02-19T12:34:56.789Z',
    dataSource: 'mock',
  },
};

function setUrlParams(params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  Object.defineProperty(window, 'location', {
    value: { ...window.location, search: `?${searchParams.toString()}` },
    writable: true,
  });
}

function clearUrlParams() {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, search: '' },
    writable: true,
  });
}

function setupDefaultMocks() {
  mockAppliedValue = {
    zone: 'LATAM',
    country: 'BRA',
    years: '2025',
    segments: 'Beer',
  };
  mockIsGlobalZoneValue = false;
  mockDataFiltersValue = {};
  mockRefreshDateLabel = 'Feb - 2025';
  mockGetCountry.mockReturnValue({ value: 'BRA', label: 'Brazil' });
  mockGetOptions.mockReturnValue([]);
  mockSyncUrlFiltersToRedux.mockReturnValue(false);
  mockBreadcrumbPageList = [
    { pageName: 'Category', href: '/category' },
    {
      pageName: 'Category.CategoryHealth.title',
      href: '/category/category-health/overview?filter_zone=ABI&filter_years=2025&filter_segments=Beer',
    },
    { pageName: 'Drill Down', href: '' },
  ];
  mockUseBffDataReturnValues = {
    'category_category-health_drill-down_big-numbers-drill': {
      data: {
        'category-health_drill-down-big-numbers': mockBffBigNumbers,
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    },
    'category_category-health_drill-down_line-chart-drill': {
      data: {
        'category-health_drill-down-line-chart-drill': {
          beerVolume: mockApiData.beerVolume,
          drivers: mockApiData.drivers,
        },
      },
      loading: false,
      error: null,
      refetch: jest.fn(),
    },
  };
}

function getLineChartCallsByTestId(testId: string) {
  return mockLineChartPerformance.mock.calls.filter(
    (call: any[]) => call[0].dataTestId === testId,
  );
}

function renderDrillDown() {
  return render(<DrillDown />);
}

function setLineChartResponse(response: Record<string, any>, loading = false) {
  mockUseBffDataReturnValues[
    'category_category-health_drill-down_line-chart-drill'
  ] = {
    data: {
      'category-health_drill-down-line-chart-drill': response,
    },
    loading,
    error: null,
    refetch: jest.fn(),
  };
}

function setSelectedKpiUrl(kpi: string) {
  setUrlParams({
    filter_zone: 'LATAM',
    filter_country: 'BRA',
    filter_years: '2025',
    filter_segments: 'Beer',
    overtime_performance: kpi,
  });
}

describe('DrillDown Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
    setUrlParams({
      filter_zone: 'LATAM',
      filter_country: 'BRA',
      filter_years: '2025',
      filter_segments: 'Beer',
      overtime_performance: 'volume',
    });
  });

  afterEach(() => {
    clearUrlParams();
  });

  describe('Rendering', () => {
    it('should render the default page shell with volume chart and drivers', () => {
      const { container } = renderDrillDown();

      expect(container.firstChild).not.toBeNull();
      expect(mockFilter).toHaveBeenCalled();
      expect(mockBreadcrumbs).toHaveBeenCalled();
      expect(mockPageTitle).toHaveBeenCalled();
      expect(mockOvertimePerformance).toHaveBeenCalled();
      expect(mockLineChartPerformance).toHaveBeenCalled();
      expect(mockShareOfThroatPerformance).not.toHaveBeenCalled();
      expect(mockDrivers).toHaveBeenCalled();
    });
  });

  describe('Breadcrumbs', () => {
    it('should pass the drill-down breadcrumb contract', () => {
      renderDrillDown();

      const pageList = mockBreadcrumbs.mock.calls[0][0].pageList;
      expect(pageList).toHaveLength(3);
      expect(pageList[0].pageName).toBe('Category');
      expect(pageList[0].href).toBe('/category');
      expect(pageList[1].pageName).toBe('Category.CategoryHealth.title');
      expect(pageList[2].pageName).toBe('Drill Down');
      expect(mockBreadcrumbs).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'drill-down',
          showIcon: true,
        }),
      );
    });

    it('should pass breadcrumb page list from useDrillDownBreadcrumbs', () => {
      mockBreadcrumbPageList = [
        { pageName: 'Category', href: '/category' },
        {
          pageName: 'Category.CategoryHealth.title',
          href: '/category/category-health/overview?filter_zone=ABI&filter_years=2025',
        },
        { pageName: 'Drill Down', href: '' },
      ];
      renderDrillDown();

      const pageList = mockBreadcrumbs.mock.calls[0][0].pageList;
      expect(pageList).toEqual(mockBreadcrumbPageList);
      expect(mockUseDrillDownBreadcrumbs).toHaveBeenCalledWith(
        expect.objectContaining({
          applied: mockAppliedValue,
          dataFilters: mockDataFiltersValue,
        }),
      );
    });
  });

  describe('PageTitle', () => {
    it('should pass formatted title with country name when not global zone', () => {
      mockGetCountry.mockReturnValue({ value: 'BRA', label: 'Brazil' });
      mockIsGlobalZoneValue = false;
      renderDrillDown();

      expect(mockPageTitle).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Brazil Category.CategoryHealth.title',
          dataTestId: 'drill-down',
          description: 'Category.CategoryHealth.description',
          tooltip: expect.anything(),
        }),
      );
    });

    it('should pass title with "Global" prefix when zone is global', () => {
      mockIsGlobalZoneValue = true;
      mockGetCountry.mockReturnValue({ value: 'ABI', label: 'Global' });
      renderDrillDown();

      expect(mockPageTitle).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Global Category.CategoryHealth.title',
        }),
      );
    });
  });

  describe('OvertimePerformance Props', () => {
    it('should pass mapped BFF big numbers and page context props', () => {
      renderDrillDown();

      expect(mockOvertimePerformance).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockMappedOvertimeData,
          refreshDateLabel: 'Feb - 2025',
          selectedKPI: 'volume',
          loading: false,
          productType: 'Beer',
          dataTestId: 'drill-down',
        }),
      );
    });
  });

  describe('LineChartPerformance Data Distribution', () => {
    it('should pass extracted chart data with dataTestId for volume KPI', () => {
      renderDrillDown();

      const calls = getLineChartCallsByTestId('drill-down-volume-performance');
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0].data).toEqual(mockApiData.beerVolume);
    });

    it('should pass correct dataTestId and yAxisConfig for icl KPI', () => {
      setSelectedKpiUrl('icl');
      setLineChartResponse({ beerIcl: mockApiData.beerIcl });
      renderDrillDown();

      const calls = getLineChartCallsByTestId('drill-down-icl-performance');
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0].data).toEqual(mockApiData.beerIcl);
      expect(calls[0][0].yAxisConfig).toEqual({
        suggestedMin: 80,
        suggestedMax: 100,
        stepSize: 5,
      });
    });

    it('should pass correct dataTestId and yAxisConfig for participation KPI', () => {
      setSelectedKpiUrl('participation');
      setLineChartResponse({
        beerParticipation: mockApiData.beerParticipation,
      });
      renderDrillDown();

      const calls = getLineChartCallsByTestId(
        'drill-down-participation-performance',
      );
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0].data).toEqual(mockApiData.beerParticipation);
      expect(calls[0][0].yAxisConfig).toEqual({
        suggestedMin: 0,
        suggestedMax: 100,
        stepSize: 20,
      });
    });

    it('should pass correct dataTestId for wmtbb KPI', () => {
      setSelectedKpiUrl('wmtbb');
      setLineChartResponse({ wmtbb: mockApiData.wmtbb });
      renderDrillDown();

      const calls = getLineChartCallsByTestId('drill-down-wmtbb-performance');
      expect(calls.length).toBeGreaterThanOrEqual(1);
      expect(calls[0][0].data).toEqual(mockApiData.wmtbb);
    });

    it('should render share of throat chart instead of line chart when KPI is sot', () => {
      setSelectedKpiUrl('sot');
      const sotData = {
        title: 'Share of Throat Performance',
        subtitle: '[%]',
        chartData: {
          columns: [],
          colors: [],
          connectorColors: [],
          legends: [],
          comparisonLine: [],
        },
      };
      setLineChartResponse({ shareOfThroat: sotData });
      renderDrillDown();

      expect(mockShareOfThroatPerformance).toHaveBeenCalledWith(
        expect.objectContaining({
          data: sotData,
          dataTestId: 'drill-down',
        }),
      );
      expect(mockLineChartPerformance).not.toHaveBeenCalled();
    });

    it('should pass drivers and highlight year from volume response', () => {
      renderDrillDown();

      expect(mockDrivers).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockApiData.drivers,
          highlightLabel: '2025',
          dataTestId: 'drill-down',
        }),
      );
      mockLineChartPerformance.mock.calls.forEach((call: any[]) => {
        expect(call[0].highlightLabel).toBe('2025');
      });
    });

    it('should pass null highlightLabel when years is not set', () => {
      mockAppliedValue = { ...mockAppliedValue, years: undefined };
      renderDrillDown();

      mockLineChartPerformance.mock.calls.forEach((call: any[]) => {
        expect(call[0].highlightLabel).toBeNull();
      });
    });

    it('should fallback to volume when selected KPI has no overtime data', () => {
      setSelectedKpiUrl('icl');
      mockUseBffDataReturnValues[
        'category_category-health_drill-down_big-numbers-drill'
      ] = {
        data: {
          'category-health_drill-down-big-numbers': [
            ...mockBffBigNumbers,
            {
              title: 'Beer ICL',
              kpiKey: 'icl',
              dataTestId: 'beer-icl',
              emptyStateMessage: null,
              data: [],
            },
          ],
        },
        loading: false,
        error: null,
        refetch: jest.fn(),
      };
      renderDrillDown();

      const lastOvertimeCall =
        mockOvertimePerformance.mock.calls[
          mockOvertimePerformance.mock.calls.length - 1
        ][0];
      expect(lastOvertimeCall.selectedKPI).toBe('volume');
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('overtime_performance=volume'),
        { replace: true },
      );
    });

    it('should keep chart loading while a new chart response is syncing', () => {
      setLineChartResponse(
        {
          beerVolume: mockApiData.beerVolume,
          drivers: mockApiData.drivers,
        },
        true,
      );
      const { rerender } = renderDrillDown();

      let lastLineChartCall =
        mockLineChartPerformance.mock.calls[
          mockLineChartPerformance.mock.calls.length - 1
        ][0];
      expect(lastLineChartCall.loading).toBe(true);

      setLineChartResponse({
        beerVolume: mockApiData.beerVolume,
        drivers: mockApiData.drivers,
      });
      rerender(<DrillDown />);

      lastLineChartCall =
        mockLineChartPerformance.mock.calls[
          mockLineChartPerformance.mock.calls.length - 1
        ][0];
      expect(lastLineChartCall.loading).toBe(false);
    });
  });

  describe('useBffData Hook Calls', () => {
    it('should call useBffData for big-numbers with correct id and subFilters', () => {
      renderDrillDown();

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'category_category-health_drill-down_big-numbers-drill',
          kpiGroup: 'category-health',
          subFilters: expect.objectContaining({
            viewtype: 'country',
            category: 'Beer',
            country: 'BRA',
            year: '2025',
          }),
          skipMainFilters: false,
        }),
      );
    });

    it('should call useBffData for line-chart with correct id and dynamic kpi_name', () => {
      renderDrillDown();

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'category_category-health_drill-down_line-chart-drill',
          kpiGroup: 'category-health',
          subFilters: expect.objectContaining({
            viewtype: 'country',
            kpi_name: 'volume',
          }),
          skipMainFilters: false,
        }),
      );
    });

    it('should pass skipRequest true when filters are not loaded', () => {
      mockAppliedValue = {};
      clearUrlParams();
      renderDrillDown();

      const bigNumbersCalls = mockUseBffData.mock.calls.filter(
        (call: any[]) =>
          call[0].id ===
          'category_category-health_drill-down_big-numbers-drill',
      );
      bigNumbersCalls.forEach((call: any[]) => {
        expect(call[0].skipRequest).toBe(true);
      });
    });
  });

  describe('KPI Selection (handleKPISelect)', () => {
    it('should navigate and update selectedKPI when onKPISelect is invoked', () => {
      renderDrillDown();

      const onKPISelect = mockOvertimePerformance.mock.calls[0][0].onKPISelect;
      expect(typeof onKPISelect).toBe('function');

      act(() => {
        onKPISelect('icl');
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('overtime_performance=icl'),
        { replace: true },
      );
      const lastCall =
        mockOvertimePerformance.mock.calls[
          mockOvertimePerformance.mock.calls.length - 1
        ][0];
      expect(lastCall.selectedKPI).toBe('icl');
    });
  });

  describe('URL Parameter Sync', () => {
    it('should initialize selectedKPI from URL param overtime_performance', () => {
      setSelectedKpiUrl('icl');
      renderDrillDown();

      expect(mockOvertimePerformance).toHaveBeenCalledWith(
        expect.objectContaining({ selectedKPI: 'icl' }),
      );
    });

    it('should default selectedKPI to volume when URL param is missing', () => {
      setUrlParams({
        filter_zone: 'LATAM',
        filter_country: 'BRA',
        filter_years: '2025',
        filter_segments: 'Beer',
      });
      renderDrillDown();

      expect(mockOvertimePerformance).toHaveBeenCalledWith(
        expect.objectContaining({ selectedKPI: 'volume' }),
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('overtime_performance=volume'),
        { replace: true },
      );
    });
  });

  describe('Page Rendering Without Redirect', () => {
    it('should render page for supported global and country filter states', () => {
      const cases = [
        {
          applied: {
            zone: 'LATAM',
            country: undefined,
            years: '2025',
            segments: 'Beer',
          },
          params: {
            filter_zone: 'LATAM',
            filter_years: '2025',
            filter_segments: 'Beer',
          },
        },
        {
          applied: {
            zone: 'ABI',
            country: 'ABI',
            years: '2025',
            segments: 'Beer',
          },
          params: {
            filter_zone: 'ABI',
            filter_country: 'ABI',
            filter_years: '2025',
            filter_segments: 'Beer',
          },
        },
        {
          applied: mockAppliedValue,
          params: {
            filter_zone: 'LATAM',
            filter_country: 'BRA',
            filter_years: '2025',
            filter_segments: 'Beer',
          },
        },
      ];

      cases.forEach(({ applied, params }) => {
        jest.clearAllMocks();
        setupDefaultMocks();
        mockAppliedValue = applied;
        setUrlParams(params);

        const { container, unmount } = renderDrillDown();
        expect(container.firstChild).not.toBeNull();
        unmount();
      });
    });
  });

  describe('Filter Sync Effect', () => {
    it('should call syncUrlFiltersToRedux with dispatch, applied and URL params', () => {
      renderDrillDown();

      expect(mockSyncUrlFiltersToRedux).toHaveBeenCalledWith(
        mockDispatch,
        mockAppliedValue,
        expect.objectContaining({
          zone: 'LATAM',
          country: 'BRA',
          years: '2025',
          segments: 'Beer',
        }),
      );
    });

    it('should skip request when syncUrlFiltersToRedux returns true (needs sync)', () => {
      mockSyncUrlFiltersToRedux.mockReturnValue(true);
      mockAppliedValue = {
        zone: 'EMEA',
        country: 'DEU',
        years: '2024',
        segments: 'Beyond Beer',
      };
      setUrlParams({
        filter_zone: 'LATAM',
        filter_country: 'BRA',
        filter_years: '2025',
        filter_segments: 'Beer',
      });
      renderDrillDown();

      const bigNumbersCalls = mockUseBffData.mock.calls.filter(
        (call: any[]) =>
          call[0].id ===
          'category_category-health_drill-down_big-numbers-drill',
      );
      bigNumbersCalls.forEach((call: any[]) => {
        expect(call[0].skipRequest).toBe(true);
      });
    });

    it('should pass applied filter values to useBffData subFilters after filters are loaded', () => {
      renderDrillDown();

      const bigNumbersCalls = mockUseBffData.mock.calls.filter(
        (call: any[]) =>
          call[0].id ===
          'category_category-health_drill-down_big-numbers-drill',
      );
      const lastCall = bigNumbersCalls[bigNumbersCalls.length - 1][0];
      expect(lastCall.subFilters.year).toBe('2025');
      expect(lastCall.subFilters.category).toBe('Beer');
      expect(lastCall.subFilters.country).toBe('BRA');
    });
  });
});
