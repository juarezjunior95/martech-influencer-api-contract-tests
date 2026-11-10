import { render } from '@testing-library/react';
import { KPI_CONFIGS } from 'pages/pillars/ValueCreation/VolumePages/config';
import { DEFAULT_ENDPOINTS } from 'pages/pillars/ValueCreation/VolumePages/config/api';

import { GlobalMovesSection } from './GlobalMovesSection';

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

jest.mock('components', () => ({
  Cover: ({ name }: any) => <div data-testid="cover">{name}</div>,
  TemplateSlide: ({ children, title }: any) => (
    <div data-testid="template-slide" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock(
  'pages/components/ValueCreation/Slides/TopBottomWaterfallSlideContent',
  () => ({
    TopBottomWaterfallSlideContent: () => (
      <div data-testid="top-bottom-waterfall-slide-content" />
    ),
  }),
);

jest.mock('pages/pillars/ValueCreation/VolumePages/components', () => ({
  BrandsSlide: () => <div data-testid="brands-slide" />,
}));

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportPageSection: ({ children, ...props }: any) => (
    <section data-page-name={props['data-page-name']}>{children}</section>
  ),
}));

const mockUseBffData = jest.requireMock('hooks').useBffData;

const defaultProps = {
  period: "JAN'25",
  dt_end: '2025-01',
  getPageByName: jest.fn(() => ({ index: 1, name: 'test-page' })),
  dataTestId: 'test',
};

describe('GlobalMovesSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue({
      data: {},
      loading: false,
      error: null,
    });
  });

  it('calls useBffData once for all global moves (shared request)', () => {
    render(<GlobalMovesSection {...defaultProps} />);

    expect(mockUseBffData).toHaveBeenCalledTimes(1);
    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: DEFAULT_ENDPOINTS.globalMoves,
        kpiGroup: 'volume',
        subFilters: { dt_end: '2025-01', kpi: 'volume' },
        skipMainFilters: true,
      }),
    );
  });

  it('renders a cover section for each global move', () => {
    const { container } = render(<GlobalMovesSection {...defaultProps} />);

    Object.values(KPI_CONFIGS.volume.globalMoves).forEach((config) => {
      expect(
        container.querySelector(`[data-page-name="${config.coverSection}"]`),
      ).toBeInTheDocument();
    });
  });

  it('renders a main section for each global move', () => {
    const { container } = render(<GlobalMovesSection {...defaultProps} />);

    Object.values(KPI_CONFIGS.volume.globalMoves).forEach((config) => {
      expect(
        container.querySelector(`[data-page-name="${config.section}"]`),
      ).toBeInTheDocument();
    });
  });

  it('renders a volume countries breakdown section for each global move', () => {
    const { container } = render(<GlobalMovesSection {...defaultProps} />);

    Object.values(KPI_CONFIGS.volume.globalMoves).forEach((config) => {
      expect(
        container.querySelector(
          `[data-page-name="${config.volumeCountriesBreakdown}"]`,
        ),
      ).toBeInTheDocument();
    });
  });

  it('renders 3 sections per global move (cover + main + breakdown)', () => {
    const { container } = render(<GlobalMovesSection {...defaultProps} />);

    const totalSections = container.querySelectorAll('[data-page-name]');
    expect(totalSections).toHaveLength(
      Object.keys(KPI_CONFIGS.volume.globalMoves).length * 3,
    );
  });

  it('renders BrandsSlide inside each main move section', () => {
    const { getAllByTestId } = render(<GlobalMovesSection {...defaultProps} />);

    const brandsSlides = getAllByTestId('brands-slide');
    expect(brandsSlides).toHaveLength(
      Object.keys(KPI_CONFIGS.volume.globalMoves).length,
    );
  });

  it('renders TopBottomWaterfallSlideContent for countries breakdown sections', () => {
    const { getAllByTestId } = render(<GlobalMovesSection {...defaultProps} />);

    const waterfalls = getAllByTestId('top-bottom-waterfall-slide-content');
    expect(waterfalls).toHaveLength(
      Object.keys(KPI_CONFIGS.volume.globalMoves).length,
    );
  });

  it('passes loading state from shared useBffData to slides', () => {
    mockUseBffData.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const { getAllByTestId } = render(<GlobalMovesSection {...defaultProps} />);

    expect(getAllByTestId('brands-slide').length).toBeGreaterThan(0);
  });

  it('renders corona cover section with correct page name', () => {
    const { container } = render(<GlobalMovesSection {...defaultProps} />);

    expect(
      container.querySelector(
        `[data-page-name="${KPI_CONFIGS.volume.globalMoves.corona.coverSection}"]`,
      ),
    ).toBeInTheDocument();
  });
});
