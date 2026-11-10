import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { CategoryHealth } from './CategoryHealth';

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

jest.mock('@hexa-ui/icons2', () => ({
  CalendarClock: () => <div data-testid="calendar-clock">CalendarClock</div>,
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({ children }: any) => (
    <div data-testid="styled-grid-container">{children}</div>
  ),
  StyledTooltip: ({ children }: any) => (
    <div data-testid="styled-tooltip">{children}</div>
  ),
}));

jest.mock('./CategoryHealth.styles', () => ({
  StyledOverviewContainer: ({ children }: any) => (
    <div data-testid="styled-overview-container">{children}</div>
  ),
  StyledNoDataContainer: ({ children }: any) => (
    <div data-testid="styled-no-data-container">{children}</div>
  ),
}));

const mockFilter = jest.fn();
const mockBreadcrumbs = jest.fn();
const mockStickyScrollWithFilters = jest.fn();
const mockBasicContainer = jest.fn();
const mockTag = jest.fn();
const mockSkeleton = jest.fn();
const mockNoDataYet = jest.fn();

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
  BasicContainer: ({ children, ...props }: any) => {
    mockBasicContainer(props);
    return <div data-testid="basic-container">{children}</div>;
  },
  Tag: (props: any) => {
    mockTag(props);
    return <div data-testid="tag">Tag</div>;
  },
  Skeleton: (props: any) => {
    mockSkeleton(props);
    return <div data-testid="skeleton">Loading Skeleton</div>;
  },
  NoDataYet: (props: any) => {
    mockNoDataYet(props);
    return <div data-testid="no-data-yet">No Data Yet</div>;
  },
}));

const mockPageTitle = jest.fn();

jest.mock('pages/components', () => ({
  PageTitle: (props: any) => {
    mockPageTitle(props);
    return <div data-testid="page-title">{props.title}</div>;
  },
}));

const mockDataTable = jest.fn();

jest.mock('components/TableComponent', () => ({
  DataTable: (props: any) => {
    mockDataTable(props);
    return <div data-testid="data-table">DataTable</div>;
  },
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

let mockAppliedValue: any = {};
let mockDataFiltersValue: any = {};
let mockDefaultsValue: any = {};
let mockIsLoadedValue = true;
let mockRefreshDateLabel: any = 'Feb - 2025';

jest.mock('./hooks/useCategoryHealthFilters', () => ({
  useCategoryHealthFilters: () => ({
    applied: mockAppliedValue,
    dataFilters: mockDataFiltersValue,
    defaults: mockDefaultsValue,
    isLoaded: mockIsLoadedValue,
    refreshDateLabel: mockRefreshDateLabel,
    dispatch: mockDispatch,
  }),
}));

const mockUseBffData = jest.fn();
let mockUseBffDataReturnValue: any = { data: null, loading: false };

jest.mock('hooks', () => ({
  useBffData: (props: any) => {
    mockUseBffData(props);
    return mockUseBffDataReturnValue;
  },
}));

const mockSyncUrlFiltersToRedux = jest.fn().mockReturnValue(false);

jest.mock('./utils/syncUrlFiltersToRedux', () => ({
  syncUrlFiltersToRedux: (...args: any[]) => mockSyncUrlFiltersToRedux(...args),
}));

jest.mock('./constants', () => ({
  FILTER_CONFIGS: {
    pageName: 'category-health',
    filtersList: ['zones', 'years', 'segments'],
    visibleFields: ['zone', 'years', 'segments'],
    params: {
      'zones[include_global]': true,
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

jest.mock('domain/Filter/FilterRegistry/configs', () => ({
  filterConfigs: [],
  zonesFilterConfig: {
    validator: jest.fn(() => true),
  },
}));

const mockTableData = {
  header: [
    { id: 'countries', title: 'Countries' },
    { id: 'bv_fy', title: 'Volume FY' },
    { id: 'wmtbb_fy', title: 'WMTBB FY' },
  ],
  rows: [
    {
      rows: [
        [
          {
            countries: { value: 'Global', icon: 'World' },
            bv_fy: { value: 1000, clickUrl: '?...' },
            wmtbb_fy: '-',
          },
        ],
      ],
    },
    {
      rows: [
        [
          {
            rowGroup: 'M3',
            countries: { value: 'M3' },
            bv_fy: { value: 500, clickUrl: '?...' },
            wmtbb_fy: '-',
          },
        ],
        [
          {
            rowGroup: 'M3',
            countries: { value: 'USA', zone: 'NAZ' },
            bv_fy: { value: 200, clickUrl: '?...' },
            wmtbb_fy: { value: 3.7, clickUrl: '?...' },
          },
        ],
      ],
    },
  ],
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
    zone: 'ABI',
    years: '2025',
    segments: 'Beer',
  };
  mockDataFiltersValue = {};
  mockDefaultsValue = {
    zone: 'ABI',
    years: '2025',
    segments: 'Beer',
  };
  mockIsLoadedValue = true;
  mockRefreshDateLabel = 'Feb - 2025';
  mockSyncUrlFiltersToRedux.mockReturnValue(false);
  mockUseBffDataReturnValue = {
    data: { 'category-health_overview': { tableData: mockTableData } },
    loading: false,
  };
}

function renderCategoryHealth() {
  const utils = render(<CategoryHealth />);
  const getOnCellClick = () => mockDataTable.mock.calls[0][0].onCellClick;

  return { ...utils, getOnCellClick };
}

function clickTableCell(event: any) {
  const { getOnCellClick } = renderCategoryHealth();
  getOnCellClick()(event);
}

function getNavigationUrl() {
  return mockNavigate.mock.calls[0][0] as string;
}

describe('CategoryHealth (Overview) Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
    clearUrlParams();
  });

  afterEach(() => {
    clearUrlParams();
  });

  describe('Rendering', () => {
    test('should render without crashing', () => {
      const { container } = render(<CategoryHealth />);
      expect(container.firstChild).not.toBeNull();
    });

    test('should render Filter, Breadcrumbs, and PageTitle', () => {
      render(<CategoryHealth />);
      expect(mockFilter).toHaveBeenCalled();
      expect(mockBreadcrumbs).toHaveBeenCalled();
      expect(mockPageTitle).toHaveBeenCalled();
    });

    test('should render BasicContainer and DataTable when data is available', () => {
      render(<CategoryHealth />);
      expect(mockBasicContainer).toHaveBeenCalled();
      expect(mockDataTable).toHaveBeenCalled();
    });

    test('should NOT render DataTable when loading', () => {
      mockUseBffDataReturnValue = { data: null, loading: true };
      render(<CategoryHealth />);
      expect(mockDataTable).not.toHaveBeenCalled();
    });

    test('should render Skeleton when loading is true', () => {
      mockUseBffDataReturnValue = { data: null, loading: true };
      const { getByTestId } = render(<CategoryHealth />);
      expect(getByTestId('skeleton')).toBeInTheDocument();
      expect(mockSkeleton).toHaveBeenCalledWith(
        expect.objectContaining({
          width: '100%',
          height: '600px',
          length: 1,
          dataTestId: 'loading-skeleton-category-health-overview',
        }),
      );
    });

    test('should render NoDataYet when data is null and not loading', () => {
      mockUseBffDataReturnValue = { data: null, loading: false };
      const { getByTestId } = render(<CategoryHealth />);
      expect(getByTestId('no-data-yet')).toBeInTheDocument();
    });
  });

  describe('Filter Props', () => {
    test('should pass FILTER_CONFIGS values to Filter', () => {
      render(<CategoryHealth />);
      expect(mockFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          pageName: 'category-health',
          visibleFields: ['zone', 'years', 'segments'],
        }),
      );
    });
  });

  describe('Breadcrumbs', () => {
    test('should render breadcrumbs with 2 levels', () => {
      render(<CategoryHealth />);
      const pageList = mockBreadcrumbs.mock.calls[0][0].pageList;
      expect(pageList).toHaveLength(2);
      expect(pageList[0].pageName).toBe('Category');
      expect(pageList[0].href).toBe('/category');
      expect(pageList[1].pageName).toBe('Category.CategoryHealth.title');
    });
  });

  describe('DataTable Props', () => {
    test('should pass tableData to DataTable', () => {
      render(<CategoryHealth />);
      expect(mockDataTable).toHaveBeenCalledWith(
        expect.objectContaining({
          data: mockTableData,
        }),
      );
    });

    test('should pass table display options to DataTable', () => {
      render(<CategoryHealth />);
      expect(mockDataTable).toHaveBeenCalledWith(
        expect.objectContaining({
          showAxis: true,
          headerGap: true,
          headerColumnGap: true,
          groupBorder: true,
          rowBorder: false,
          rowHover: true,
        }),
      );
    });

    test('should pass onCellClick handler to DataTable', () => {
      render(<CategoryHealth />);
      const onCellClick = mockDataTable.mock.calls[0][0].onCellClick;
      expect(onCellClick).toBeDefined();
      expect(typeof onCellClick).toBe('function');
    });
  });

  describe('useBffData Hook Call', () => {
    test('should call useBffData with correct params', () => {
      mockAppliedValue = {
        zone: 'ABI',
        years: '2025',
        segments: 'Beer',
      };
      render(<CategoryHealth />);
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'category_category-health_overview',
          kpiGroup: 'category-health',
          skipRequest: false,
        }),
      );
    });

    test('should skip request when applied filters are not available', () => {
      mockAppliedValue = null;
      render(<CategoryHealth />);
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          skipRequest: true,
        }),
      );
    });
  });

  describe('Cell Click - Navigation Blocking', () => {
    test('should navigate when clicking on Global row', () => {
      clickTableCell({
        columnId: 'bv_fy',
        rowData: {
          countries: { value: 'Global', icon: 'World' },
          bv_fy: { value: 1000 },
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/category/category-health/drill-down'),
      );
    });

    test('should NOT navigate when clicking on group rows', () => {
      const { getOnCellClick } = renderCategoryHealth();
      const onCellClick = getOnCellClick();

      ['M1', 'M2', 'M3'].forEach((rowGroup) => {
        onCellClick({
          columnId: 'bv_fy',
          rowData: {
            rowGroup,
            countries: { value: rowGroup },
            bv_fy: { value: 500 },
          },
        });

        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });

    test.each([
      ['wmtbb_fy', 'Beyond Beer'],
      ['wmtbb_vsly', 'Beer + Beyond Beer'],
    ])(
      'should NOT navigate when clicking %s column with segments=%s',
      (columnId, segments) => {
        mockAppliedValue = {
          zone: 'ABI',
          years: '2025',
          segments,
        };

        clickTableCell({
          columnId,
          rowData: {
            countries: { value: 'USA', zone: 'NAZ' },
            [columnId]: { value: 3.7 },
          },
        });

        expect(mockNavigate).not.toHaveBeenCalled();
      },
    );

    test('should navigate when clicking on countries column', () => {
      clickTableCell({
        columnId: 'countries',
        rowData: {
          countries: { value: 'USA', zone: 'NAZ' },
          bv_fy: { value: 200 },
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/category/category-health/drill-down'),
      );
    });

    test('should NOT navigate when clicking unavailable cells', () => {
      const { getOnCellClick } = renderCategoryHealth();
      const onCellClick = getOnCellClick();

      [
        ['bp_fy', { value: '-' }],
        ['bp_vsly', '-'],
        ['bv_fy', { value: null }],
        ['bv_fy', { value: undefined }],
      ].forEach(([columnId, value]) => {
        onCellClick({
          columnId,
          rowData: {
            countries: { value: 'IND', zone: 'APAC' },
            [String(columnId)]: value,
          },
        });

        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });

  describe('Cell Click - Navigation Success', () => {
    test('should navigate to drill-down with all selected filters', () => {
      mockAppliedValue = {
        zone: 'ABI',
        years: '2024',
        segments: 'Beer',
      };

      clickTableCell({
        columnId: 'bv_fy',
        rowData: {
          countries: { value: 'USA', zone: 'NAZ' },
          bv_fy: { value: 200 },
        },
      });

      const [path, queryString] = getNavigationUrl().split('?');
      const params = new URLSearchParams(queryString);

      expect(path).toBe('/category/category-health/drill-down');
      expect(params.get('filter_years')).toBe('2024');
      expect(params.get('filter_zone')).toBe('NAZ');
      expect(params.get('filter_segments')).toBe('Beer');
      expect(params.get('filter_country')).toBe('USA');
      expect(params.get('overtime_performance')).toBe('volume');
    });

    test('should navigate to WMTBB when clicking WMTBB column with segments=Beer', () => {
      mockAppliedValue = {
        zone: 'ABI',
        years: '2025',
        segments: 'Beer',
      };

      clickTableCell({
        columnId: 'wmtbb_fy',
        rowData: {
          countries: { value: 'USA', zone: 'NAZ' },
          wmtbb_fy: { value: 3.7 },
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('overtime_performance=wmtbb'),
      );
    });
  });

  describe('Cell Click - KPI Mapping', () => {
    test('should map clicked columns to drill-down KPIs', () => {
      const { getOnCellClick } = renderCategoryHealth();
      const onCellClick = getOnCellClick();

      [
        ['bv_fy', 'volume', 200],
        ['bv_vsly', 'volume', -2.2],
        ['bicl_fy', 'icl', 69.1],
        ['sot_fy', 'sot', '69%'],
        ['bp_fy', 'participation', '62.5%'],
        ['unknown_column', 'volume', 'test'],
      ].forEach(([columnId, expectedKpi, value]) => {
        onCellClick({
          columnId,
          rowData: {
            countries: { value: 'USA', zone: 'NAZ' },
            [String(columnId)]: { value },
          },
        });

        expect(mockNavigate).toHaveBeenLastCalledWith(
          expect.stringContaining(`overtime_performance=${expectedKpi}`),
        );
      });
    });
  });

  describe('URL Parameter Sync', () => {
    test('should call syncUrlFiltersToRedux when filters are loaded', () => {
      setUrlParams({
        filter_years: '2024',
        filter_segments: 'nab',
      });
      render(<CategoryHealth />);
      expect(mockSyncUrlFiltersToRedux).toHaveBeenCalled();
    });

    test('should NOT call syncUrlFiltersToRedux when there are no URL filter params', () => {
      clearUrlParams();
      mockDefaultsValue = {
        zone: 'ABI',
        years: '2025',
        segments: 'Beer',
      };
      render(<CategoryHealth />);
      expect(mockSyncUrlFiltersToRedux).not.toHaveBeenCalled();
    });

    test('should call syncUrlFiltersToRedux with dispatch and applied when URL has filter params', () => {
      setUrlParams({
        filter_zone: 'ABI',
        filter_years: '2025',
        filter_segments: 'Beer',
      });
      mockDefaultsValue = {
        zone: 'ABI',
        years: '2025',
        segments: 'Beer',
      };
      render(<CategoryHealth />);
      expect(mockSyncUrlFiltersToRedux).toHaveBeenCalledWith(
        mockDispatch,
        mockAppliedValue,
        expect.any(Object),
      );
    });
  });

  describe('Redirect to Drill Down when zone is not ABI', () => {
    test('should redirect to drill-down when applied zone is not ABI', () => {
      mockAppliedValue = {
        zone: 'NAZ',
        country: 'USA',
        years: '2025',
        segments: 'Beer',
      };
      setUrlParams({
        filter_zone: 'NAZ',
        filter_country: 'USA',
        filter_years: '2025',
        filter_segments: 'Beer',
      });
      render(<CategoryHealth />);
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/category/category-health/drill-down'),
        { replace: true },
      );
    });

    test('should preserve all filter params in redirect URL', () => {
      mockAppliedValue = {
        zone: 'EUR',
        country: 'GBR',
        years: '2024',
        segments: 'Beyond Beer',
      };
      setUrlParams({
        filter_zone: 'EUR',
        filter_country: 'GBR',
        filter_years: '2024',
        filter_segments: 'Beyond Beer',
      });
      render(<CategoryHealth />);
      const redirectCall = mockNavigate.mock.calls.find((call: any[]) =>
        call[0].includes('/category/category-health/drill-down'),
      );
      expect(redirectCall).toBeDefined();
      expect(redirectCall[0]).toContain('overtime_performance=volume');
    });

    test('should NOT redirect when zone is ABI', () => {
      mockAppliedValue = {
        zone: 'ABI',
        years: '2025',
        segments: 'Beer',
      };
      render(<CategoryHealth />);
      const drillDownRedirect = mockNavigate.mock.calls.find((call: any[]) =>
        call[0].includes('/category/category-health/drill-down'),
      );
      expect(drillDownRedirect).toBeUndefined();
    });
  });

  describe('Edge Cases - Zone Fallback', () => {
    test('should use applied.zone when cell.zone is undefined', () => {
      mockAppliedValue = {
        zone: 'SAZ',
        years: '2025',
        segments: 'Beer',
      };

      clickTableCell({
        columnId: 'bv_fy',
        rowData: {
          countries: { value: 'BRA' },
          bv_fy: { value: 150 },
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('filter_zone=SAZ'),
      );
    });

    test('should handle non-string country value', () => {
      clickTableCell({
        columnId: 'bv_fy',
        rowData: {
          countries: { value: 123 },
          bv_fy: { value: 150 },
        },
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('filter_country='),
      );
    });

    test('should handle missing countries cell', () => {
      clickTableCell({
        columnId: 'bv_fy',
        rowData: {
          bv_fy: { value: 150 },
        },
      });

      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  describe('Error States', () => {
    test('should render NoDataYet when data is undefined and not loading', () => {
      mockUseBffDataReturnValue = {
        data: undefined,
        loading: false,
      };
      const { getByTestId } = render(<CategoryHealth />);
      expect(getByTestId('no-data-yet')).toBeInTheDocument();
    });

    test('should render error message when tableData is null', () => {
      mockUseBffDataReturnValue = {
        data: { 'category-health_overview': { tableData: null } },
        loading: false,
      };
      const { getByTestId } = render(<CategoryHealth />);
      expect(getByTestId('no-data-yet')).toBeInTheDocument();
      expect(mockNoDataYet).toHaveBeenCalledWith(
        expect.objectContaining({
          dataTestId: 'no-data-category-health-overview',
        }),
      );
    });

    test('should not call onCellClick when DataTable is not rendered', () => {
      mockUseBffDataReturnValue = {
        data: null,
        loading: false,
      };
      render(<CategoryHealth />);
      expect(mockDataTable).not.toHaveBeenCalled();
    });
  });

  describe('Breadcrumb Href', () => {
    test('should have empty href for current page breadcrumb', () => {
      mockAppliedValue = {
        zone: 'ABI',
        years: '2025',
        segments: 'Beer',
      };
      render(<CategoryHealth />);
      const pageList = mockBreadcrumbs.mock.calls[0][0].pageList;
      expect(pageList[1].href).toBe('');
    });

    test('should use pageName from formatMessage for Category Health breadcrumb', () => {
      render(<CategoryHealth />);
      const pageList = mockBreadcrumbs.mock.calls[0][0].pageList;
      expect(pageList[1].pageName).toBe('Category.CategoryHealth.title');
    });
  });

  describe('State Transitions', () => {
    test('should transition from loading to data loaded', () => {
      mockUseBffDataReturnValue = { data: null, loading: true };
      const { rerender, getByTestId, queryByTestId } = render(
        <CategoryHealth />,
      );

      expect(getByTestId('skeleton')).toBeInTheDocument();

      mockUseBffDataReturnValue = {
        data: { 'category-health_overview': { tableData: mockTableData } },
        loading: false,
      };
      rerender(<CategoryHealth />);

      expect(queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(mockDataTable).toHaveBeenCalled();
    });

    test('should show skeleton when refetching data', () => {
      mockUseBffDataReturnValue = {
        data: { 'category-health_overview': { tableData: mockTableData } },
        loading: false,
      };
      const { rerender, queryByTestId } = render(<CategoryHealth />);

      expect(queryByTestId('skeleton')).not.toBeInTheDocument();

      mockUseBffDataReturnValue = {
        data: { 'category-health_overview': { tableData: mockTableData } },
        loading: true,
      };
      rerender(<CategoryHealth />);

      expect(queryByTestId('skeleton')).toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    test('should pass stringified undefined year when applied is null', () => {
      mockAppliedValue = null;
      render(<CategoryHealth />);
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({
            year: 'undefined',
          }),
          skipRequest: true,
        }),
      );
    });

    test('should use default segments when applied is undefined', () => {
      mockAppliedValue = null;
      render(<CategoryHealth />);
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({
            category: expect.any(String),
          }),
        }),
      );
    });
  });
});
