import { render } from '@testing-library/react';
import { DEFAULT_ENDPOINTS } from 'pages/pillars/ValueCreation/VolumePages/config/api';

import { pageSections } from '../../constants/sections';
import { GlobalResultsSection } from './GlobalResultsSection';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

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

jest.mock('pages/components/ValueCreation/Slides/SlideContent', () => ({
  SlideContent: () => <div data-testid="slide-content" />,
}));

jest.mock(
  'pages/components/ValueCreation/Slides/TopBottomWaterfallSlideContent',
  () => ({
    TopBottomWaterfallSlideContent: () => (
      <div data-testid="top-bottom-waterfall-slide-content" />
    ),
  }),
);

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportPageSection: ({ children, ...props }: any) => (
    <section data-page-name={props['data-page-name']}>{children}</section>
  ),
}));

const mockUseBffData = jest.requireMock('hooks').useBffData;

const defaultProps = {
  globalCoverLink: '/value-creation?zone=ABI&country=ABI',
  getPageByName: jest.fn(() => ({ index: 1, name: 'test-page' })),
  dataTestId: 'test',
  monthYear: 'Jan 2025',
  period: "JAN'25",
};

describe('GlobalResultsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue({
      data: {},
      loading: false,
      error: null,
    });
  });

  it('renders the main cover section', () => {
    const { container } = render(<GlobalResultsSection {...defaultProps} />);

    expect(
      container.querySelector(`[data-page-name="${pageSections.mainCover}"]`),
    ).toBeInTheDocument();
  });

  it('renders the secondary cover section', () => {
    const { container } = render(<GlobalResultsSection {...defaultProps} />);

    expect(
      container.querySelector(
        `[data-page-name="${pageSections.secondaryCover}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('renders the global volume section', () => {
    const { container } = render(<GlobalResultsSection {...defaultProps} />);

    expect(
      container.querySelector(
        `[data-page-name="${pageSections.globalVolume}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('renders the global volume countries breakdown section', () => {
    const { container } = render(<GlobalResultsSection {...defaultProps} />);

    expect(
      container.querySelector(
        `[data-page-name="${pageSections.globalVolumeCountriesBreakdown}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('renders the top brands YTD section', () => {
    const { container } = render(<GlobalResultsSection {...defaultProps} />);

    expect(
      container.querySelector(
        `[data-page-name="${pageSections.topBrandsYtd}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('renders the top brands MTD section', () => {
    const { container } = render(<GlobalResultsSection {...defaultProps} />);

    expect(
      container.querySelector(
        `[data-page-name="${pageSections.topBrandsMtd}"]`,
      ),
    ).toBeInTheDocument();
  });

  it('renders all 6 sections total', () => {
    const { container } = render(<GlobalResultsSection {...defaultProps} />);

    const sections = container.querySelectorAll('[data-page-name]');
    expect(sections).toHaveLength(6);
  });

  it('calls useBffData with the global kpiGroup and skipMainFilters', () => {
    render(<GlobalResultsSection {...defaultProps} />);

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: DEFAULT_ENDPOINTS.global,
        kpiGroup: 'volume',
        skipMainFilters: true,
      }),
    );
  });

  it('passes loading state to slide content', () => {
    mockUseBffData.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const { getAllByTestId } = render(
      <GlobalResultsSection {...defaultProps} />,
    );

    expect(getAllByTestId('slide-content').length).toBeGreaterThan(0);
  });

  it('calls getPageByName for each slide section', () => {
    const getPageByName = jest.fn(() => ({ index: 5, name: 'test-page' }));

    render(
      <GlobalResultsSection {...defaultProps} getPageByName={getPageByName} />,
    );

    expect(getPageByName).toHaveBeenCalledWith(pageSections.globalVolume);
    expect(getPageByName).toHaveBeenCalledWith(
      pageSections.globalVolumeCountriesBreakdown,
    );
    expect(getPageByName).toHaveBeenCalledWith(pageSections.topBrandsYtd);
    expect(getPageByName).toHaveBeenCalledWith(pageSections.topBrandsMtd);
  });
});
