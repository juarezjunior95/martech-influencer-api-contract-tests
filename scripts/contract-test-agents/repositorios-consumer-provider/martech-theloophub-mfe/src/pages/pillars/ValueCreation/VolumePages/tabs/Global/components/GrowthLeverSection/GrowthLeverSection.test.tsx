import { render } from '@testing-library/react';
import { DEFAULT_ENDPOINTS } from 'pages/pillars/ValueCreation/VolumePages/config/api';

import { GrowthLeverSection } from './GrowthLeverSection';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
  useFeatureToggle: jest.fn(() => [false, false]),
  usePageFilterApplied: jest.fn(() => ({ applied: {} })),
}));

jest.mock('pages/pillars/ValueCreation/VolumePages/contexts', () => ({
  useRegisterLoading: jest.fn(),
  KPI_TO_PAGE_NAME: {
    volume: 'value-creation_volume-pages',
  },
  useVolumePagesKpi: jest.fn(() => ({
    kpi: 'volume',
    kpiName: 'Volume',
  })),
}));

jest.mock('pages/pillars/ValueCreation/VolumePages/config', () => {
  const { DEFAULT_ENDPOINTS: ENDPOINTS } = jest.requireActual(
    'pages/pillars/ValueCreation/VolumePages/config/api',
  );
  return {
    KPI_CONFIGS: {
      volume: {
        kpiGroup: 'volume',
        measure: '[k hl]',
        legend: { default: [] },
        endpoints: ENDPOINTS,
        growthLevers: {
          'superior-core': {
            endpoints: {
              priorities: ENDPOINTS.segmentsGbTable,
              portfolio: ENDPOINTS.segmentsGbPortfolio,
            },
          },
        },
      },
    },
  };
});

jest.mock('domain/Filter', () => ({
  FilterRegistry: {
    buildFilterQueryString: jest.fn((filters: Record<string, string>) =>
      Object.entries(filters)
        .map(([k, v]) => `${k}=${v}`)
        .join('&'),
    ),
  },
}));

jest.mock('components', () => ({
  Cover: ({ name }: any) => <div data-testid="cover">{name}</div>,
  TemplateSlide: ({ children, title }: any) => (
    <div data-testid="template-slide" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock('pages/components/ValueCreation', () => ({
  SlideContent: () => <div data-testid="slide-content" />,
  TopBottomWaterfallSlideContent: () => (
    <div data-testid="top-bottom-waterfall-slide-content" />
  ),
}));

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportPageSection: ({ children, ...props }: any) => (
    <section data-page-name={props['data-page-name']}>{children}</section>
  ),
}));

const mockUseBffData = jest.requireMock('hooks').useBffData;

const mockConfigMainSubFilters = {
  page_type: 'Superior Core',
  growth_lever: 'Superior Core',
  dt_ini: null,
  bigNumbers: { growth_lever: 'Superior Core' },
  topBottomBrands: { growth_lever: 'Superior Core' },
};

const mockSectionMainSubFilters = {
  ...mockConfigMainSubFilters,
  bigNumbers: { ...mockConfigMainSubFilters.bigNumbers, dt_end: null },
  topBottomBrands: {
    ...mockConfigMainSubFilters.topBottomBrands,
    dt_end: null,
  },
};

const mockPortfolioConfig = {
  endpoint: DEFAULT_ENDPOINTS.segmentsGbPortfolio,
  pageType: 'Superior Core - Portfolio',
  dataKey: 'portfolio',
};

const mockConfig = {
  title: 'Superior Core',
  endpoints: {
    priorities: DEFAULT_ENDPOINTS.segmentsGbTable,
    portfolio: DEFAULT_ENDPOINTS.segmentsGbPortfolio,
  },
  growthLeverKey: 'Superior Core',
  section: 'superior-core-global',
  coverSection: 'superior-core-cover',
  volumeCountriesBreakdown: 'superior-core-volume-countries-breakdown',
  topBrandsYtd: 'superior-core-top-brands-ytd',
  topBrandsMtd: 'superior-core-top-brands-mtd',
  mainSubFilters: mockConfigMainSubFilters,
  prioritiesPageType: 'Superior Core',
  portfolioConfig: mockPortfolioConfig,
};

const defaultProps = {
  leverKey: 'superior-core',
  config: mockConfig,
  period: "JAN'25",
  dt_end: null,
  getPageByName: jest.fn(() => ({ index: 1, name: 'test-page' })),
  dataTestId: 'test',
  mainSubFilters: mockSectionMainSubFilters,
  prioritiesPageType: 'Superior Core',
  portfolioConfig: mockPortfolioConfig,
  tableOrder: ['priorities', 'portfolio', 'markets'] as Array<
    'priorities' | 'portfolio' | 'markets'
  >,
};

describe('GrowthLeverSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue({
      data: {},
      loading: false,
      error: null,
    });
  });

  it('renders the cover section', () => {
    const { container } = render(<GrowthLeverSection {...defaultProps} />);

    expect(
      container.querySelector(`[data-page-name="${mockConfig.coverSection}"]`),
    ).toBeInTheDocument();
  });

  it('renders the main volume section', () => {
    const { container } = render(<GrowthLeverSection {...defaultProps} />);

    expect(
      container.querySelector(`[data-page-name="${mockConfig.section}"]`),
    ).toBeInTheDocument();
  });

  it('renders the volume countries breakdown section', () => {
    const { container } = render(<GrowthLeverSection {...defaultProps} />);

    expect(
      container.querySelector(
        `[data-page-name="${mockConfig.volumeCountriesBreakdown}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('renders the top brands YTD section', () => {
    const { container } = render(<GrowthLeverSection {...defaultProps} />);

    expect(
      container.querySelector(`[data-page-name="${mockConfig.topBrandsYtd}"]`),
    ).toBeInTheDocument();
  });

  it('renders the top brands MTD section', () => {
    const { container } = render(<GrowthLeverSection {...defaultProps} />);

    expect(
      container.querySelector(`[data-page-name="${mockConfig.topBrandsMtd}"]`),
    ).toBeInTheDocument();
  });

  it('renders all 5 sections', () => {
    const { container } = render(<GrowthLeverSection {...defaultProps} />);

    const sections = container.querySelectorAll('[data-page-name]');
    expect(sections).toHaveLength(5);
  });

  it('calls useBffData 3 times (main, priorities, portfolio)', () => {
    render(<GrowthLeverSection {...defaultProps} />);

    expect(mockUseBffData).toHaveBeenCalledTimes(3);
  });

  it('calls useBffData for main data with mainSubFilters', () => {
    render(<GrowthLeverSection {...defaultProps} />);

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: DEFAULT_ENDPOINTS.segmentsGb,
        kpiGroup: 'volume',
        subFilters: defaultProps.mainSubFilters,
        skipMainFilters: true,
      }),
    );
  });

  it('calls useBffData for priorities with prioritiesPageType', () => {
    render(<GrowthLeverSection {...defaultProps} />);

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: DEFAULT_ENDPOINTS.segmentsGbTable,
        kpiGroup: 'volume',
        subFilters: { page_type: 'Superior Core', kpi: 'volume' },
        skipMainFilters: true,
      }),
    );
  });

  it('skips portfolio request when portfolioConfig is undefined', () => {
    render(
      <GrowthLeverSection {...defaultProps} portfolioConfig={undefined} />,
    );

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        skipRequest: true,
      }),
    );
  });

  it('uses portfolio endpoint from portfolioConfig when provided', () => {
    render(<GrowthLeverSection {...defaultProps} />);

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: mockPortfolioConfig.endpoint,
        subFilters: {
          page_type: mockPortfolioConfig.pageType,
          kpi: 'volume',
        },
        skipRequest: false,
      }),
    );
  });

  it('renders cover with growth lever title', () => {
    const { getAllByTestId } = render(<GrowthLeverSection {...defaultProps} />);

    const covers = getAllByTestId('cover');
    expect(covers[0]).toHaveTextContent('Superior Core');
  });
});
