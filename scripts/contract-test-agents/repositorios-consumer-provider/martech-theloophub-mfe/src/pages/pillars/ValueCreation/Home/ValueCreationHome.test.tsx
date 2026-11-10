import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { featureToggles } from 'config/featureToggle';

import { ValueCreationHome } from './ValueCreationHome';

jest.mock('contexts/LastDataRefresh/LastDataRefresh', () => ({
  useLastDataRefresh: () => ({
    lastDataRefreshKpisDateMonthYear: {
      finance: '2025-01-01',
      pos: '2025-01-01',
      market_share: '2025-01-01',
      power: '2025-01-01',
    },
  }),
}));

const mockUseFeatureToggle = jest.fn();

jest.mock('hooks', () => ({
  useFeatureToggle: (...args: unknown[]) => mockUseFeatureToggle(...args),
  useMediaQuery: () => false,
  usePageBackground: jest.fn(),
  usePageFilterApplied: jest.fn(() => ({
    applied: { zone: 'ABI', country: 'ABI', periods: 'R3M' },
  })),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      zones: { values: [{ value: 'ABI', label: 'Global' }] },
      country: {
        values: { ABI: [{ value: 'ABI', label: 'All' }] },
      },
    },
    defaults: {},
    availableFields: [],
  })),
  usePageFilterManagement: jest.fn(() => ({
    apply: jest.fn(),
    updateForm: jest.fn(),
  })),
  useBffData: jest.fn(() => ({
    loading: false,
    data: {},
  })),
}));

const valueCreationHomeMessages: Record<string, string> = {
  'Pillars.valueCreation': '7. Value Creation',
  'Pillars.sidebar.valueCreation': '7. Value Creation',
  'Pillars.pageName.valueCreation': 'Value Creation',
  'ValueCreation.Home.pageSubtitle':
    'Analyze Value Creation performance across the 5 sustainable growth levers',
  'ValueCreation.Home.breadcrumbPageName': 'Value Creation',
  'ValueCreation.Home.globalSustainableGrowthOverview.tooltip':
    'Track performance and drive sustainable growth through the 5 main KPIs.',
  'ValueCreation.Home.strategyDrivers.title': 'Strategy Drivers',
  'ValueCreation.Home.strategyDrivers.tooltip':
    'KPIs used to strategically analyze the initiatives that drive sustainable growth.',
  'ValueCreation.Home.tooltips.volume': 'ABI Volume based on B2B sales',
  'ValueCreation.Home.tooltips.netRevenue':
    'Gross turnover after taxes and discounts',
  'ValueCreation.Home.tooltips.cores':
    'Net Revenue after logistics, sales and marketing costs',
  'ValueCreation.Home.tooltips.marketShare':
    'Percentage of ABI Volume in the Beer industry based on B2C sales',
  'ValueCreation.Home.tooltips.brandPower':
    "Share of consumers' purchase predisposition for each brand",
  'ValueCreation.Home.tooltips.abiLovers':
    'Percentage of LDA+ population who consumes ABI Beer brands at least once a week',
  'ValueCreation.Home.tooltips.occasions':
    'Frequency of consumption occasions among ABI Beer drinkers',
  'ValueCreation.Home.tooltips.lda24Participation':
    'Percentage of LDA+ population under 24 years old who consumes ABI Beer brands',
  'ValueCreation.Home.tooltips.leadPremium':
    'Lead the Beer category with premium products',
  'ValueCreation.Home.tooltips.superiorCore':
    'Maintain and grow the Beer category with accessible/entry brands',
  'ValueCreation.Home.tooltips.balancedChoices':
    'Diversify the Beer category with products that meet the new consumption profile',
  'ValueCreation.Home.tooltips.beyondBeer':
    'Opportunity to lead and grow a new alcoholic category that goes beyond beer',
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) =>
      valueCreationHomeMessages[id] ?? id,
  }),
}));

jest.mock('components/Filter/hooks', () => ({
  useKpiFeatureToggles: () => ({
    featureToggleMap: {
      volume: true,
      netRevenue: true,
      cores: true,
      marketShare: true,
      brandPower: true,
    },
    filterOptionsByFeatureToggle: (options: unknown[]) => options,
  }),
}));

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
  DataStateHandler: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="data-state-handler">{children}</div>
  ),
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
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="tooltip">{children}</span>
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

jest.mock('./ValueCreationHome.styles', () => ({
  StyledCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cards-grid">{children}</div>
  ),
  StyledGrowthLeversGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="growth-levers-grid">{children}</div>
  ),
  StyledStrategyDriversGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="strategy-drivers-grid">{children}</div>
  ),
  StyledSectionContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-content">{children}</div>
  ),
}));

jest.mock('pages/components/KpiOverviewCard', () => ({
  KpiOverviewCard: () => (
    <div data-testid="kpi-overview-card">KpiOverviewCard</div>
  ),
}));

jest.mock('pages/components/ValueCreation', () => ({
  GrowthLeverCard: () => (
    <div data-testid="growth-lever-card">GrowthLeverCard</div>
  ),
  StrategyDriverCard: () => (
    <div data-testid="strategy-driver-card">StrategyDriverCard</div>
  ),
}));

jest.mock('pages/components/AISummary', () => ({
  AISummary: ({
    dataTestId,
    summaryPageIdentifier,
  }: {
    dataTestId: string;
    summaryPageIdentifier: string;
  }) => (
    <div data-testid={dataTestId} data-identifier={summaryPageIdentifier}>
      AISummary
    </div>
  ),
}));

const AI_SUMMARY_TOGGLE =
  featureToggles.pillar.valueCreation.home.aiSummary.sustainableGrowthOverview;
const VALUE_CREATION_HOME_CONTENT_TOGGLE =
  featureToggles.pillar.valueCreation.value_creation_home_content;

function renderValueCreationHome() {
  return render(
    <MemoryRouter
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <ValueCreationHome />
    </MemoryRouter>,
  );
}

describe('ValueCreationHome', () => {
  beforeEach(() => {
    mockUseFeatureToggle.mockReturnValue([true, false]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render shell, page header, pillar resources, and main section headings', () => {
    renderValueCreationHome();

    expect(screen.getByTestId('grid-container')).toBeInTheDocument();
    expect(screen.getByTestId('home-container')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('filter')).toBeInTheDocument();
    expect(screen.getByTestId('page-header')).toHaveTextContent(
      '7. Value Creation',
    );
    expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
      'Value Creation',
    );
    expect(
      screen.getByRole('heading', {
        name: 'Global Sustainable Growth Overview',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Strategy Drivers' }),
    ).toBeInTheDocument();
  });

  describe('AI Summary (feature toggle gating)', () => {
    it('should render AI Summary when toggle is ready, pass summary identifier, and call useFeatureToggle with AI toggle id', () => {
      renderValueCreationHome();

      const ai = screen.getByTestId('ai-summary-value-creation-home');
      expect(ai).toBeInTheDocument();
      expect(ai).toHaveAttribute('data-identifier', '7. Value Creation; Home');
      expect(mockUseFeatureToggle).toHaveBeenCalledWith(AI_SUMMARY_TOGGLE);
    });

    it.each([
      {
        caseName:
          'should not render AI Summary when feature toggle is disabled',
        applyMock: () => {
          mockUseFeatureToggle.mockImplementation((toggleId: string) => {
            if (toggleId === AI_SUMMARY_TOGGLE) {
              return [false, false];
            }
            return [true, false];
          });
        },
      },
      {
        caseName:
          'should not render AI Summary when feature toggle is still loading',
        applyMock: () => {
          mockUseFeatureToggle.mockImplementation((toggleId: string) => {
            if (toggleId === AI_SUMMARY_TOGGLE) {
              return [true, true];
            }
            return [true, false];
          });
        },
      },
      {
        caseName:
          'should not render AI Summary when value creation home content is disabled',
        applyMock: () => {
          mockUseFeatureToggle.mockImplementation((toggleId: string) => {
            if (toggleId === VALUE_CREATION_HOME_CONTENT_TOGGLE) {
              return [false, false];
            }
            if (toggleId === AI_SUMMARY_TOGGLE) {
              return [true, false];
            }
            return [true, false];
          });
        },
      },
    ])('$caseName', ({ applyMock }) => {
      applyMock();
      renderValueCreationHome();

      expect(
        screen.queryByTestId('ai-summary-value-creation-home'),
      ).not.toBeInTheDocument();
    });
  });
});
