import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { PerformanceAndBreakdown } from './PerformanceAndBreakdown';

const MEMORY_ROUTER_FUTURE = {
  v7_relativeSplatPath: true,
  v7_startTransition: true,
} as const;

const mockBigNumbers = jest.fn((props: Record<string, unknown>) => (
  <div data-testid={props.dataTestId as string}>Big Numbers</div>
));

const mockInnovationPerfomance = jest.fn((props: Record<string, unknown>) => (
  <div data-testid={props.dataTestId as string}>Innovation Performance</div>
));

const mockBasicContainer = jest.fn(
  ({
    children,
    dataTestId,
    header,
  }: {
    children?: React.ReactNode;
    dataTestId?: string;
    header?: {
      rightContent?: React.ReactNode;
      tooltip?: React.ReactNode;
      bottomTag?: React.ReactNode;
    };
  }) => (
    <div data-testid={dataTestId}>
      {header?.tooltip}
      {header?.bottomTag}
      {header?.rightContent}
      {children}
    </div>
  ),
);

const mockSubFilterSelect = jest.fn((props: { dataTestId?: string }) => (
  <select data-testid={props.dataTestId} />
));

const mockCountryFlag = jest.fn((props: { dataTestId?: string }) => (
  <div data-testid={props.dataTestId} />
));

const mockTag = jest.fn(({ text }: { text: string }) => (
  <div data-testid="tag">{text}</div>
));

jest.mock('../Overview/components/BigNumbers/BigNumbers', () => ({
  BigNumbers: (props: Record<string, unknown>) => mockBigNumbers(props),
}));

jest.mock('./components/InnovationPerfomance/InnovationPerfomance', () => ({
  InnovationPerfomance: (props: Record<string, unknown>) =>
    mockInnovationPerfomance(props),
}));

jest.mock('components', () => ({
  BasicContainer: (props: Record<string, unknown>) => mockBasicContainer(props),
  CountryFlag: (props: Record<string, unknown>) =>
    mockCountryFlag(props as never),
  Tag: (props: Record<string, unknown>) => mockTag(props as never),
}));

jest.mock('components/SubFilter/components/SubFilterSelect', () => ({
  SubFilterSelect: (props: Record<string, unknown>) =>
    mockSubFilterSelect(props as never),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => ({
    lastDataRefreshKpisFormated: { innovation: '2024-01-01' },
  }),
}));

const mockSetSubFilterValue = jest.fn();
const mockUseBffData = jest.fn();
const mockUseCurrentPage = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterStatus = jest.fn();
const mockUseSubFilters = jest.fn();

const defaultBffData = {
  data: {
    'big-numbers': [],
    'performance-volume': undefined,
    'performance-nr': undefined,
    'performance-maco': undefined,
    'breakdown-volume': undefined,
    'breakdown-nr': undefined,
    'breakdown-maco': undefined,
  },
  loading: false,
  error: null,
};

jest.mock('hooks', () => ({
  useBffData: (params: unknown) => mockUseBffData(params),
  useCurrentPage: () => mockUseCurrentPage(),
  usePageFilterApplied: () => mockUsePageFilterApplied(),
  usePageFilterStatus: () => mockUsePageFilterStatus(),
  useSubFilters: () => mockUseSubFilters(),
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

const PERFORMANCE_BREAKDOWN_ENTRY =
  '/innovation/innovation/performance-and-breakdown/volume';

const PerformanceBreakdownRouteHarness: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <MemoryRouter
    future={MEMORY_ROUTER_FUTURE}
    initialEntries={[PERFORMANCE_BREAKDOWN_ENTRY]}
  >
    <Routes>
      <Route
        path="/innovation/innovation/performance-and-breakdown/:kpi"
        element={<>{children}</>}
      />
    </Routes>
  </MemoryRouter>
);

const renderComponent = (dataTestId?: string) =>
  render(
    <PerformanceBreakdownRouteHarness>
      <PerformanceAndBreakdown dataTestId={dataTestId} />
    </PerformanceBreakdownRouteHarness>,
  );

describe('PerformanceAndBreakdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue(defaultBffData);
    mockUseCurrentPage.mockReturnValue({ currentPage: 'innovation' });
    mockUsePageFilterApplied.mockReturnValue({
      applied: { country: ['BR'], zone: ['LATAM'] },
    });
    mockUsePageFilterStatus.mockReturnValue({ isLoading: false });
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: { kpis: 'volume' },
      setSubFilterValue: mockSetSubFilterValue,
    });
  });

  it('requests BFF data with innovation filters and respects loading skip flag', () => {
    renderComponent();

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'innovation_innovation_performance-breakdown_overview',
        kpiGroup: 'innovation',
        skipRequest: false,
        subFilters: {
          country: ['BR'],
          zone: ['LATAM'],
        },
      }),
    );

    mockUsePageFilterStatus.mockReturnValue({ isLoading: true });
    mockUseBffData.mockReturnValue({ ...defaultBffData, loading: true });

    renderComponent();

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({ skipRequest: true }),
    );
  });

  it('syncs the kpis sub-filter from the route param when it differs from active state', () => {
    mockUseSubFilters.mockReturnValue({
      activeSubFilters: { kpis: 'nr' },
      setSubFilterValue: mockSetSubFilterValue,
    });

    renderComponent();

    expect(mockSetSubFilterValue).toHaveBeenCalledWith('kpis', 'volume');
  });

  it('passes big numbers, KPI filter map, and innovation performance payloads from BFF data', () => {
    const bigNumbers = [{ id: 'volume', data: [] }] as unknown[];
    const perfVol = { id: 'pv' };
    mockUseBffData.mockReturnValue({
      data: {
        ...defaultBffData.data,
        'big-numbers': bigNumbers,
        'performance-volume': perfVol,
      },
      loading: false,
      error: null,
    });

    renderComponent();

    expect(mockBigNumbers).toHaveBeenCalledWith(
      expect.objectContaining({
        data: bigNumbers,
        loading: false,
        kpiFilter: {
          volume: ['volume', 'volumeMix'],
          nr: ['nr'],
          maco: ['maco'],
        },
        orientation: { header: 'horizontal', body: 'vertical' },
      }),
    );

    expect(mockInnovationPerfomance).toHaveBeenCalledWith(
      expect.objectContaining({
        loading: false,
        performanceData: expect.objectContaining({
          volume: perfVol,
        }),
      }),
    );
  });

  it('renders header chrome, last refresh tag, and main sections', () => {
    renderComponent('tabpanel-performance-and-breakdown');

    expect(
      screen.getByTestId('tabpanel-performance-and-breakdown-container'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabpanel-performance-and-breakdown-tooltip'),
    ).toHaveTextContent(
      'Innovation.Innovation.Overview.PerformanceAndBreakdown.tooltip',
    );
    expect(screen.getByTestId('tag')).toHaveTextContent(': 2024-01-01');

    expect(
      screen.getByTestId('tabpanel-performance-and-breakdown-subfilter-select'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabpanel-performance-and-breakdown-divider'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('tabpanel-performance-and-breakdown-country-flag'),
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('tabpanel-performance-and-breakdown-content'),
    ).toContainElement(
      screen.getByTestId('tabpanel-performance-and-breakdown-big-numbers'),
    );
  });

  describe('dataTestId', () => {
    it('omits prefixed test ids on the layout when dataTestId is not passed', () => {
      renderComponent();

      expect(
        screen.queryByTestId('tabpanel-performance-and-breakdown-container'),
      ).not.toBeInTheDocument();
      expect(mockBigNumbers).toHaveBeenCalledWith(
        expect.objectContaining({ dataTestId: undefined }),
      );
    });

    it('updates the container test id when the prefix changes on rerender', () => {
      const { rerender } = renderComponent('a');

      expect(screen.getByTestId('a-container')).toBeInTheDocument();

      rerender(
        <PerformanceBreakdownRouteHarness>
          <PerformanceAndBreakdown dataTestId="b" />
        </PerformanceBreakdownRouteHarness>,
      );

      expect(screen.queryByTestId('a-container')).not.toBeInTheDocument();
      expect(screen.getByTestId('b-container')).toBeInTheDocument();
    });
  });
});
