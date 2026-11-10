import React from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { featureToggles } from 'config/featureToggle';
import { getViewtype } from 'utils/filter';

import { buildInnovationHomeBffMockData } from './__mocks';
import { InnovationHome } from './InnovationHome';

const mockUseFeatureToggle = jest.fn();
const mockUseBffData = jest.fn();
const mockUseLastDataRefresh = jest.fn();
const mockUsePageFilterStatus = jest.fn();

jest.mock('utils/filter', () => ({
  getViewtype: jest.fn(),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

const innovationHomeMessages: Record<string, string> = {
  'Pillars.innovation': '4. Innovation',
  'Pillars.sidebar.innovation': '4. Innovation',
  'Pillars.pageName.innovation': 'Innovation',
  'Innovation.Home.pageSubtitle':
    "Identify the right innovation opportunities to accelerate a brand's long-term growth",
  'Innovation.Home.breadcrumbPageName': 'Value Creation',
  'Innovation.Home.newInnovationHomeTitle': 'Innovation',
  'Innovation.Home.howWeDoIt': 'How We Do It',
  'Innovation.Home.globalOvertimePerformance': 'Global Overtime Performance',
  'Innovation.Home.increaseVolume': 'Increase Volume',
  'Innovation.Home.increaseRevenue': 'Increase Revenue',
  'Innovation.Home.performanceKpiMaco': 'MACO',
  'Innovation.Home.performanceKpiMacoMargin': 'MACO Margin',
  'Innovation.Home.portfolioHealth.title': '4.1 - Portfolio Health',
  'Innovation.Home.portfolioHealth.description':
    'Continuously assess & rationalize our portfolio of brands and SKUs',
  'Innovation.Home.packPrice.title': '4.2 - Pack & Price',
  'Innovation.Home.packPrice.description':
    'Leverage POS data to map pack opportunities to close gaps',
  'Innovation.Home.brandRenovation.title': '4.3 - Brand Renovation',
  'Innovation.Home.brandRenovation.description':
    'Assess brand superiority and identify opportunities for renovation',
  'Innovation.Home.newInnovations.title': '4.4 - New Innovations',
  'Innovation.Home.newInnovations.description':
    'Scale new innovations using the "prove and move" approach',
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => innovationHomeMessages[id] ?? id,
  }),
}));

const mockSetSubFilterValue = jest.fn();

jest.mock('hooks', () => {
  const { featureToggles: ft } = jest.requireActual(
    'config/featureToggle',
  ) as typeof import('config/featureToggle');

  return {
    useFeatureToggle: (...args: unknown[]) => mockUseFeatureToggle(...args),
    useMediaQuery: () => false,
    useMultiplesFeatureToggles: () => ({
      featuresListByToggleName: {
        [ft.pillar.innovation.home.aiSummary.volume]: false,
        [ft.pillar.innovation.home.aiSummary.nr]: false,
      },
      togglesReady: true,
    }),
    useSubFilters: () => ({
      setSubFilterValue: mockSetSubFilterValue,
    }),
    usePageFilterApplied: () => ({
      applied: { zone: ['LATAM'], country: ['BR'] },
    }),
    usePageFilterStatus: () => mockUsePageFilterStatus(),
    useBffData: (...args: unknown[]) => mockUseBffData(...args),
  };
});

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header?: { title: string };
  }) => (
    <div data-testid="basic-container">
      {header?.title && <h2 data-testid="section-title">{header.title}</h2>}
      {children}
    </div>
  ),
  BigNumber: ({
    children,
    onClick,
    footer,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    footer?: React.ReactNode;
  }) => (
    <div data-testid="big-number">
      {onClick ? (
        <button type="button" onClick={onClick}>
          BigNumber
        </button>
      ) : null}
      {children}
      {footer}
    </div>
  ),
  BigNumberWithContent: ({
    children,
    onClick,
    header,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    header?: React.ReactNode;
  }) => (
    <div data-testid="big-number-with-content">
      {header}
      {onClick ? (
        <button type="button" onClick={onClick}>
          BigNumberWithContent
        </button>
      ) : null}
      {children}
    </div>
  ),
  ChartHeader: () => <div data-testid="chart-header">ChartHeader</div>,
  DataStateHandler: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="data-state-handler">{children}</div>
  ),
  NoDataYet: () => <div data-testid="no-data-yet">NoDataYet</div>,
  Skeleton: () => <div data-testid="skeleton">Skeleton</div>,
  SparkLine: () => <div data-testid="spark-line">SparkLine</div>,
  StickyScrollWithFilters: () => (
    <div>
      <div data-testid="filter">Filter</div>
      <nav data-testid="breadcrumbs">Breadcrumbs</nav>
    </div>
  ),
  PageHeader: ({ title }: { title: string }) => (
    <header data-testid="page-header">{title}</header>
  ),
  PillarResources: ({ pillar }: { pillar: string }) => (
    <div data-testid="pillar-resources">{pillar}</div>
  ),
  SubPillarCard: ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <div data-testid="sub-pillar-card" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock('shared/Styles/layout.styles', () => ({
  StyledGridContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="grid-container">{children}</div>
  ),
  StyledHomeContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="home-container">{children}</div>
  ),
  StyledHomeHeaderContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="home-header-container">{children}</div>
  ),
  StyledSectionContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-content">{children}</div>
  ),
}));

jest.mock('./InnovationHome.styles', () => ({
  StyledSubPillarCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sub-pillar-cards-grid">{children}</div>
  ),
}));

jest.mock(
  './components/OldInnovationContent/OldInnovationContent.styles',
  () => ({
    StyledCardsGrid: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="innovation-home-legacy-main-cards-grid">{children}</div>
    ),
  }),
);

jest.mock(
  './components/NewInnovationContent/NewInnovationContent.styles',
  () => ({
    StyledNewInnovationKpiGrid: ({
      children,
    }: {
      children: React.ReactNode;
    }) => <div data-testid="innovation-home-four-cards-grid">{children}</div>,
    StyledHowWeDoItHandoffSection: ({
      children,
    }: {
      children: React.ReactNode;
    }) => <div data-testid="how-we-do-it-handoff-section">{children}</div>,
    StyledHowWeDoItCardsGrid: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="sub-pillar-cards-grid">{children}</div>
    ),
  }),
);

const innovationHomeContentToggleName =
  featureToggles.pillar.innovation.innovation_home_content;
const innovationHomeNewPageExperienceToggleName =
  featureToggles.pillar.innovation.innovation_home_new_page_experience;

function defaultInnovationHomeFeatureToggleImpl(toggleName: string) {
  if (toggleName === innovationHomeContentToggleName) {
    return [true, false];
  }
  if (toggleName === innovationHomeNewPageExperienceToggleName) {
    return [true, false];
  }
  return [false, false];
}

function TestLocationOutlet() {
  const { pathname, search } = useLocation();
  return (
    <div
      data-testid="test-location"
      data-pathname={pathname}
      data-search={search}
    />
  );
}

function renderInnovationHome() {
  return render(
    <MemoryRouter
      initialEntries={['/innovation']}
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <>
        <InnovationHome />
        <TestLocationOutlet />
      </>
    </MemoryRouter>,
  );
}

describe('InnovationHome', () => {
  beforeEach(() => {
    mockSetSubFilterValue.mockClear();
    mockUseFeatureToggle.mockImplementation(
      defaultInnovationHomeFeatureToggleImpl,
    );
    mockUsePageFilterStatus.mockReturnValue({ isLoading: false });
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDateMonthYear: {
        'portfolio-health': '2025-08',
        'pillar-rennovation': '2025-08',
        innovation: '2025-08',
      },
    });
    mockUseBffData.mockReturnValue({
      data: buildInnovationHomeBffMockData(),
      loading: false,
      error: null,
    });
    (getViewtype as jest.Mock).mockReturnValue('country');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page', () => {
    renderInnovationHome();

    expect(screen.getByTestId('grid-container')).toBeInTheDocument();
    expect(screen.getByTestId('home-container')).toBeInTheDocument();
    expect(screen.getByTestId('home-header-container')).toBeInTheDocument();
    expect(screen.getByTestId('filter')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('page-header')).toHaveTextContent('Innovation');
    expect(
      screen.getByTestId('innovation-home-four-cards-grid'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Global Overtime Performance' }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId('basic-container').length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
      'Innovation',
    );
  });

  it('should not render performance KPI section when innovation_home_new_page_experience is disabled', () => {
    mockUseFeatureToggle.mockImplementation((toggleName: string) => {
      if (toggleName === innovationHomeContentToggleName) {
        return [true, false];
      }
      if (toggleName === innovationHomeNewPageExperienceToggleName) {
        return [false, false];
      }
      return [false, false];
    });

    renderInnovationHome();

    expect(
      screen.queryByTestId('innovation-home-four-cards-grid'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Global Overtime Performance' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId('innovation-home-legacy-main-cards-grid'),
    ).toBeInTheDocument();
    const legacyGrid = screen.getByTestId(
      'innovation-home-legacy-main-cards-grid',
    );
    expect(within(legacyGrid).getAllByTestId('basic-container')).toHaveLength(
      2,
    );
    expect(
      screen.getByRole('heading', { name: 'How We Do It' }),
    ).toBeInTheDocument();
  });

  it('should render section title How we do it', () => {
    renderInnovationHome();

    expect(
      screen.getByRole('heading', { name: 'How We Do It' }),
    ).toBeInTheDocument();
  });

  it('should render four performance KPI cards with hand-off variant', () => {
    renderInnovationHome();

    const perfGrid = screen.getByTestId('innovation-home-four-cards-grid');
    const kpiCards = within(perfGrid).getAllByTestId(
      'big-number-sparkline-card',
    );
    expect(kpiCards).toHaveLength(4);
    kpiCards.forEach((card) => {
      expect(card).toHaveAttribute('data-variant', 'innovationHandOff');
    });
  });

  it('should render four-card performance KPI grid when innovation_home_new_page_experience is enabled', () => {
    mockUseFeatureToggle.mockImplementation((toggleName: string) => {
      if (toggleName === innovationHomeContentToggleName) {
        return [true, false];
      }
      if (toggleName === innovationHomeNewPageExperienceToggleName) {
        return [true, false];
      }
      return [false, false];
    });

    renderInnovationHome();

    expect(
      screen.getByRole('heading', { name: 'Global Overtime Performance' }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('innovation-home-four-cards-grid'),
    ).toBeInTheDocument();

    const perfGrid = screen.getByTestId('innovation-home-four-cards-grid');
    const kpiCards = within(perfGrid).getAllByTestId(
      'big-number-sparkline-card',
    );
    expect(kpiCards).toHaveLength(4);
    kpiCards.forEach((card) => {
      expect(card).toHaveAttribute('data-variant', 'innovationHandOff');
    });
  });

  it('should pass portfolio-health and pillar-rennovation subfilters with dt_end to useBffData', () => {
    renderInnovationHome();

    expect(getViewtype).toHaveBeenCalledWith(['BR']);
    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'innovation_home_home',
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

  it('should render four How We Do It pillar cards in How We Do It section', () => {
    renderInnovationHome();

    const subPillarCardsGrid = screen.getByTestId('sub-pillar-cards-grid');
    const howWeDoItCards = subPillarCardsGrid.querySelectorAll(
      '[data-testid="new-how-we-do-it-card"]',
    );
    expect(howWeDoItCards).toHaveLength(4);
  });

  it.each([
    {
      caseName: 'volume KPI card',
      cardIndex: 0,
      kpi: 'volume',
    },
    {
      caseName: 'nr KPI card',
      cardIndex: 1,
      kpi: 'nr',
    },
  ])(
    'should call setSubFilterValue and navigate when clicking $caseName',
    async ({ cardIndex, kpi }) => {
      renderInnovationHome();

      const kpiCards = screen.getAllByTestId('big-number-sparkline-card');
      await userEvent.click(within(kpiCards[cardIndex]).getByRole('button'));

      expect(mockSetSubFilterValue).toHaveBeenCalledWith('kpis', kpi);
      const location = screen.getByTestId('test-location');
      expect(location).toHaveAttribute(
        'data-pathname',
        '/innovation/innovation/performance-and-breakdown',
      );
      expect(location).toHaveAttribute('data-search', `?kpi=${kpi}`);
    },
  );
});
