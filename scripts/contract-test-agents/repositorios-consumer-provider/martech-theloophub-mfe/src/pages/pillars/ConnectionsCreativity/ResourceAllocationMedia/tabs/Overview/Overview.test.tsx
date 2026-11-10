import { render, screen } from '@testing-library/react';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';

import { useOverviewDataSource } from './hooks/useOverviewDataSource';
import { Overview } from './Overview';

const DATA_TEST_ID = 'test-overview';
const TAB_NAME = 'Resource Allocation - Overview';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockLastDataRefreshKpisFormated = { media: '2025-01-15' };

const createDefaultDataSource = () => ({
  charts: { data: {}, loading: false, available: true },
  table: { data: {}, rawData: {}, loading: false, available: true },
  ranking: { data: {}, loading: false, available: true },
});

const createDefaultHookReturn = () => ({
  dataSource: createDefaultDataSource(),
  isReady: true,
  isBreakdownViewer: false,
  activeDeepDiveSubfilter: 'media_spend',
});

const emptyLastDataRefreshContext = {
  lastDataRefreshKpisFormated: null,
  data: null,
  lastDataRefreshKpis: null,
  lastDataRefreshKpisDateMonthYear: null,
  lastDataRefreshKpisDate: null,
  setData: jest.fn(),
};

jest.mock('react-intl', () => ({
  useIntl: jest.fn(() => ({
    formatMessage: mockFormatMessage,
  })),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(() => ({
    lastDataRefreshKpisFormated: mockLastDataRefreshKpisFormated,
  })),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('components', () => ({
  BasicContainer: ({ children, header, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'basic-container'}>
      <div data-testid="header-title">{header?.title}</div>
      <div data-testid="header-tooltip">{header?.tooltip}</div>
      <div data-testid="header-right-content">{header?.rightContent}</div>
      <div data-testid="header-bottom-tag">{header?.bottomTag}</div>
      {children}
    </div>
  ),
  CountryFlag: ({ dataTestId }: any) => (
    <div
      data-testid={dataTestId ? `country-flag-${dataTestId}` : 'country-flag'}
    />
  ),
  Tag: ({ text, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'tag'}>{text}</div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children, ...props }: any) => (
    <div data-testid={props['data-testid'] ?? 'styled-tooltip'} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('./components', () => ({
  DeepDiveView: ({
    dataSource,
    activeDeepDiveSubfilter,
    isBreakdownViewer,
    dataTestId,
  }: any) => (
    <div
      data-testid={
        dataTestId ? `${dataTestId}-deep-dive-view` : 'deep-dive-view'
      }
      data-active-subfilter={activeDeepDiveSubfilter}
      data-is-breakdown-viewer={isBreakdownViewer}
      data-has-charts={dataSource?.charts?.available}
      data-has-table={dataSource?.table?.available}
      data-has-ranking={dataSource?.ranking?.available}
    />
  ),
  SummaryView: ({ charts, dataTestId }: any) => (
    <div
      data-testid={dataTestId ? `${dataTestId}-summary-view` : 'summary-view'}
      data-loading={charts?.loading}
      data-available={charts?.available}
    />
  ),
}));

jest.mock('./hooks/useOverviewDataSource', () => ({
  useOverviewDataSource: jest.fn(),
}));

describe('Overview', () => {
  const mockUseLastDataRefresh = jest.mocked(useLastDataRefresh);
  const mockUseDataRefreshForTab = jest.mocked(useDataRefreshForTab);
  const mockUseOverviewDataSourceFn = jest.mocked(useOverviewDataSource);

  const renderOverview = (dataTestId?: string) =>
    render(<Overview dataTestId={dataTestId} />);

  const setHookReturn = (
    overrides: {
      isReady?: boolean;
      isBreakdownViewer?: boolean;
      activeDeepDiveSubfilter?: string;
      dataSource?: {
        charts?: Partial<ReturnType<typeof createDefaultDataSource>['charts']>;
        table?: Partial<ReturnType<typeof createDefaultDataSource>['table']>;
        ranking?: Partial<
          ReturnType<typeof createDefaultDataSource>['ranking']
        >;
      };
    } = {},
  ) => {
    const base = createDefaultHookReturn();
    const { dataSource: dataSourcePatch, ...hookPatch } = overrides;
    mockUseOverviewDataSourceFn.mockReturnValue({
      ...base,
      ...hookPatch,
      dataSource: {
        charts: { ...base.dataSource.charts, ...dataSourcePatch?.charts },
        table: { ...base.dataSource.table, ...dataSourcePatch?.table },
        ranking: { ...base.dataSource.ranking, ...dataSourcePatch?.ranking },
      },
    } as ReturnType<typeof useOverviewDataSource>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setHookReturn();
    mockUseLastDataRefresh.mockReturnValue({
      ...emptyLastDataRefreshContext,
      lastDataRefreshKpisFormated: mockLastDataRefreshKpisFormated,
    });
  });

  describe('hooks on mount', () => {
    it('registers tab refresh and loads overview data source', () => {
      renderOverview();

      expect(mockUseDataRefreshForTab).toHaveBeenCalledWith(TAB_NAME);
      expect(mockUseOverviewDataSourceFn).toHaveBeenCalled();
    });
  });

  describe('when data is not ready', () => {
    it('returns null', () => {
      setHookReturn({ isReady: false });

      const { container } = renderOverview();

      expect(container).toBeEmptyDOMElement();
    });
  });

  describe('layout and child views', () => {
    it('renders BasicContainer with SummaryView and DeepDiveView when ready', () => {
      renderOverview();

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('summary-view')).toBeInTheDocument();
      expect(screen.getByTestId('deep-dive-view')).toBeInTheDocument();
    });
  });

  describe('header', () => {
    it('renders i18n title and tooltip, CountryFlag, and last data refresh tag', () => {
      renderOverview();

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ConnectionsCreativity.ResourceAllocationMedia.Overview.title',
      });
      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ConnectionsCreativity.ResourceAllocationMedia.Overview.tooltip',
      });
      expect(screen.getByTestId('country-flag')).toBeInTheDocument();
      expect(screen.getByTestId('tag')).toHaveTextContent(': 2025-01-15');
    });

    it('omits last data refresh tag when media date is unavailable', () => {
      mockUseLastDataRefresh.mockReturnValue(emptyLastDataRefreshContext);

      renderOverview();

      expect(screen.queryByTestId('tag')).not.toBeInTheDocument();
    });
  });

  describe('SummaryView integration', () => {
    it.each([
      { loading: true, expected: 'true' },
      { loading: false, expected: 'false' },
    ])(
      'passes charts loading=$loading to SummaryView',
      ({ loading, expected }) => {
        setHookReturn({
          dataSource: {
            charts: { ...createDefaultDataSource().charts, loading },
          },
        });

        renderOverview();

        expect(screen.getByTestId('summary-view')).toHaveAttribute(
          'data-loading',
          expected,
        );
      },
    );

    it('passes charts availability to SummaryView', () => {
      renderOverview();

      expect(screen.getByTestId('summary-view')).toHaveAttribute(
        'data-available',
        'true',
      );
    });
  });

  describe('DeepDiveView integration', () => {
    it('passes activeDeepDiveSubfilter and default availability flags', () => {
      renderOverview();

      const deepDiveView = screen.getByTestId('deep-dive-view');
      expect(deepDiveView).toHaveAttribute(
        'data-active-subfilter',
        'media_spend',
      );
      expect(deepDiveView).toHaveAttribute('data-has-charts', 'true');
      expect(deepDiveView).toHaveAttribute('data-has-table', 'true');
      expect(deepDiveView).toHaveAttribute('data-has-ranking', 'true');
    });

    it.each([
      { isBreakdownViewer: false, expected: 'false' },
      { isBreakdownViewer: true, expected: 'true' },
    ])(
      'passes isBreakdownViewer=$isBreakdownViewer to DeepDiveView',
      ({ isBreakdownViewer, expected }) => {
        setHookReturn({ isBreakdownViewer });

        renderOverview();

        expect(screen.getByTestId('deep-dive-view')).toHaveAttribute(
          'data-is-breakdown-viewer',
          expected,
        );
      },
    );

    it.each([
      ['charts', 'data-has-charts'] as const,
      ['table', 'data-has-table'] as const,
      ['ranking', 'data-has-ranking'] as const,
    ])(
      'sets %s availability on DeepDiveView when unavailable',
      (section, attribute) => {
        const baseDataSource = createDefaultDataSource();
        setHookReturn({
          dataSource: {
            [section]: { ...baseDataSource[section], available: false },
          },
        });

        renderOverview();

        expect(screen.getByTestId('deep-dive-view')).toHaveAttribute(
          attribute,
          'false',
        );
      },
    );
  });

  describe('dataTestId propagation', () => {
    it('uses default test ids when dataTestId is omitted', () => {
      renderOverview();

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.queryByTestId(DATA_TEST_ID)).not.toBeInTheDocument();
    });

    it('propagates dataTestId to container, header, and child views', () => {
      renderOverview(DATA_TEST_ID);

      expect(screen.getByTestId(DATA_TEST_ID)).toBeInTheDocument();
      expect(screen.getByTestId(`${DATA_TEST_ID}-tooltip`)).toBeInTheDocument();
      expect(
        screen.getByTestId(`country-flag-${DATA_TEST_ID}`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${DATA_TEST_ID}-last-data-refresh-tag`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${DATA_TEST_ID}-container`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${DATA_TEST_ID}-summary-view`),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId(`${DATA_TEST_ID}-deep-dive-view`),
      ).toBeInTheDocument();

      const basicContainer = screen.getByTestId(DATA_TEST_ID);
      const container = screen.getByTestId(`${DATA_TEST_ID}-container`);
      expect(basicContainer).toContainElement(container);
      expect(container).toContainElement(
        screen.getByTestId(`${DATA_TEST_ID}-summary-view`),
      );
      expect(container).toContainElement(
        screen.getByTestId(`${DATA_TEST_ID}-deep-dive-view`),
      );
    });

    it('omits last data refresh tag dataTestId when media date is unavailable', () => {
      mockUseLastDataRefresh.mockReturnValue(emptyLastDataRefreshContext);

      renderOverview(DATA_TEST_ID);

      expect(
        screen.queryByTestId(`${DATA_TEST_ID}-last-data-refresh-tag`),
      ).not.toBeInTheDocument();
    });
  });
});
