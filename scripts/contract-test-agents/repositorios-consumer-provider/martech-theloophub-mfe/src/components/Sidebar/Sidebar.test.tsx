import { render } from '@testing-library/react';
import { useSidebar } from 'martech-portal-shared-services';

const pillarMessages: Record<string, string> = {
  'Pillars.category': '1. Category',
  'Pillars.sidebar.category': '1. Category',
  'Pillars.consumer': '2. Consumer',
  'Pillars.sidebar.consumer': '2. Consumer',
  'Pillars.portfolioBrand': '3. Portfolio & Brand',
  'Pillars.sidebar.portfolioBrand': '3. Portfolio & Brand',
  'Pillars.innovation': '4. Innovation',
  'Pillars.sidebar.innovation': '4. Innovation',
  'Pillars.connectionsCreativity': '5. Connections & Creativity',
  'Pillars.sidebar.connectionsCreativity': '5. Connections & Creativity',
  'Pillars.tradeExecution': '6. Trade Execution',
  'Pillars.sidebar.tradeExecution': '6. Trade Execution',
  'Pillars.valueCreation': '7. Value Creation',
  'Pillars.sidebar.valueCreation': '7. Value Creation',
  'Sidebar.posBook': 'POS Results',
  'Sidebar.powerBiPos': 'PowerBI | POS',
  'Sidebar.categoryHealth': 'Category Health',
  'Sidebar.audienceTargeting': 'Audience Targeting',
  'Sidebar.brandAnalysis': 'Brand Power Drivers',
  'Sidebar.brandPowerBook': 'Brand Power Results',
  'Sidebar.brandPowerBookExport': 'Brand Power Results Export',
  'Sidebar.beyondBeer': 'PowerBI | Beyond Beer',
  'Sidebar.brandPower': 'PowerBI | Brand Power',
  'Sidebar.naBeer': 'PowerBI | NA Beer',
  'Sidebar.innovation': 'Innovation',
  'Sidebar.resourceAllocationMedia': 'Media & Campaign Results',
  'Sidebar.beesDistribution': 'BEES Distribution',
  'Sidebar.growthLeague': 'Growth League',
  'Sidebar.portfolioPerformance': 'Portfolio Performance',
  'Sidebar.volumePages': 'Volume Pages',
  'Sidebar.nrPages': 'Net Revenue Pages',
  'Sidebar.market_sharePages': 'Market Share Pages',
  'Sidebar.volumePagesCountryPpr': 'PPR Preread',
  'Sidebar.performanceTool': 'Performance Tool',
  'Sidebar.commercialResults': 'Commercial Results',
  'Sidebar.reportABug': 'Report a Bug',
  'Sidebar.refreshAndSource': 'Refresh & Source',
};

const mockFormatMessage = jest.fn(
  ({ id }: { id: string }) => pillarMessages[id] ?? id,
);

const mockSetModalOpen = jest.fn();
const mockTrackGA = jest.fn();
const mockUseCurrentPage = jest.fn();
const mockUseMultiplesFeatureToggles = jest.fn();

jest.mock('martech-portal-shared-services', () => ({
  useSidebar: jest.fn(),
}));

jest.mock('@hexa-ui/icons', () => ({
  BarChart4: () => <span>BarChart4</span>,
  Beer: () => <span>Beer</span>,
  BeerBottles: () => <span>BeerBottles</span>,
  CalendarClock: () => <span>CalendarClock</span>,
  Cart: () => <span>Cart</span>,
  DollarSign: () => <span>DollarSign</span>,
  Lightbulb: () => <span>Lightbulb</span>,
  Users: () => <span>Users</span>,
}));

jest.mock('assets/BugReport.svg', () => 'bug-report-icon.svg');

jest.mock('config/api', () => ({
  APP_BASENAME: '/theloophub',
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      category: {
        id: 'category-toggle',
        submenus: {
          posBook: { id: 'pos-book-toggle' },
          posPbi: { id: 'pos-pbi-toggle' },
          categoryHealth: { id: 'category-health-toggle' },
        },
      },
      consumer: {
        id: 'consumer-toggle',
        submenus: {
          audienceTargeting: { id: 'audience-targeting-toggle' },
        },
      },
      portfolioBrand: {
        id: 'portfolio-brand-toggle',
        submenus: {
          brandAnalysis: { id: 'brand-analysis-toggle' },
          brandPower: { id: 'brand-power-toggle' },
          beyondBeerControlTower: { id: 'beyond-beer-toggle' },
          nonAlcBeerControlTower: { id: 'non-alc-beer-toggle' },
          brandPowerBook: { id: 'brand-power-book-toggle' },
          brandPowerBookExport: { id: 'brand-power-book-export-toggle' },
          portfolioPerformance: { id: 'portfolio-performance-toggle' },
          pnl: { id: 'country-brand-portfolio-pl-toggle' },
        },
      },
      innovation: {
        id: 'innovation-toggle',
        submenus: {
          innovation: { id: 'submenu-innovation-toggle' },
        },
      },
      connectionsAndCreativity: {
        id: 'connections-creativity-toggle',
        submenus: {
          resourceAllocationMedia: { id: 'resource-allocation-toggle' },
        },
      },
      tradeExecution: {
        id: 'trade-execution-toggle',
        submenus: {
          beesDistribution: { id: 'bees-distribution' },
        },
      },
      valueCreation: {
        id: 'value-creation-toggle',
        submenus: {
          growthLeague: { id: 'growth-league-toggle' },
          volumePages: { id: 'volume-pages-toggle' },
          nrPages: { id: 'nr-pages-toggle' },
          market_sharePages: { id: 'market-share-pages-toggle' },
          volumePagesCountryPpr: {
            id: 'volume-pages-country-ppr-toggle',
          },
          performanceTool: { id: 'performance-tool-toggle' },
          commercialResults: { id: 'commercial-results-toggle' },
        },
      },
      refreshSource: { id: 'refresh-source-toggle' },
      bugReport: { id: 'bug-report-toggle' },
    },
  },
}));

jest.mock('contexts', () => ({
  useDataRefreshContext: () => ({
    setModalOpen: mockSetModalOpen,
  }),
}));

jest.mock('hooks', () => ({
  useCurrentPage: () => mockUseCurrentPage(),
  useGoogleAnalytics: () => mockTrackGA,
  useMultiplesFeatureToggles: () => mockUseMultiplesFeatureToggles(),
}));

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

import Sidebar from './Sidebar';

const mockUseSidebar = useSidebar as jest.Mock;

const allTogglesEnabled = {
  'category-toggle': true,
  'pos-book-toggle': true,
  'pos-pbi-toggle': true,
  'category-health-toggle': true,
  'consumer-toggle': true,
  'audience-targeting-toggle': true,
  'portfolio-brand-toggle': true,
  'brand-analysis-toggle': true,
  'brand-power-toggle': true,
  'beyond-beer-toggle': true,
  'non-alc-beer-toggle': true,
  'brand-power-book-toggle': true,
  'brand-power-book-export-toggle': true,
  'innovation-toggle': true,
  'submenu-innovation-toggle': true,
  'connections-creativity-toggle': true,
  'resource-allocation-toggle': true,
  'trade-execution-toggle': true,
  'value-creation-toggle': true,
  'portfolio-performance-toggle': true,
  'growth-league-toggle': true,
  'commercial-results-toggle': true,
  'volume-pages-toggle': true,
  'nr-pages-toggle': true,
  'volume-pages-country-ppr-toggle': true,
  'refresh-source-toggle': true,
  'bug-report-toggle': true,
  'bees-distribution': true,
};

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCurrentPage.mockReturnValue({
      currentPage: 'portfolio-brand_brand-analysis',
    });
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: allTogglesEnabled,
      togglesReady: true,
    });
  });

  it('should render without crashing', () => {
    const { container } = render(<Sidebar />);
    expect(container).toBeInTheDocument();
  });

  it('should call useSidebar with items and utils', () => {
    render(<Sidebar />);

    expect(mockUseSidebar).toHaveBeenCalled();
    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    expect(sidebarArgs).toHaveProperty('items');
    expect(sidebarArgs).toHaveProperty('utils');
  });

  it('should have 7 main menu items', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    expect(sidebarArgs.items).toHaveLength(7);
  });

  it('should include Category item with correct subitems', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );

    expect(categoryItem).toBeDefined();
    expect(categoryItem.title).toBe('1. Category');
    expect(categoryItem.subItems).toHaveLength(3);
  });

  it('should include Value Creation item with correct subitems', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const valueCreationItem = sidebarArgs.items.find(
      (item: any) => item.id === 'value-creation-toggle',
    );

    expect(valueCreationItem).toBeDefined();
    expect(valueCreationItem.title).toBe('7. Value Creation');
    expect(valueCreationItem.subItems).toHaveLength(5);
  });

  it('should include Report a Bug in utils', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const bugReportItem = sidebarArgs.utils.find(
      (item: any) => item.id === 'bug-report-toggle',
    );

    expect(bugReportItem).toBeDefined();
    expect(bugReportItem.title).toBe('Report a Bug');
    expect(bugReportItem.target).toBe('_blank');
  });

  it('should include Refresh & Source in utils when pillar has data', () => {
    mockUseCurrentPage.mockReturnValue({
      currentPage: 'portfolio-brand_brand-analysis',
    });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const refreshItem = sidebarArgs.utils.find(
      (item: any) => item.id === 'refresh-source-toggle',
    );

    expect(refreshItem).toBeDefined();
    expect(refreshItem.title).toBe('Refresh & Source');
  });

  it('should include Refresh & Source for standalone page names with data', () => {
    mockUseCurrentPage.mockReturnValue({
      currentPage: 'portfolio-brand_brand-power-results',
    });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const refreshItem = sidebarArgs.utils.find(
      (item: any) => item.id === 'refresh-source-toggle',
    );

    expect(refreshItem).toBeDefined();
  });

  it('should not include Refresh & Source when page has no data', () => {
    mockUseCurrentPage.mockReturnValue({ currentPage: 'innovation' });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const refreshItem = sidebarArgs.utils.find(
      (item: any) => item.id === 'refresh-source-toggle',
    );

    expect(refreshItem).toBeUndefined();
  });

  it('should not include Refresh & Source on home page even if pillar has data', () => {
    mockUseCurrentPage.mockReturnValue({ currentPage: 'portfolio-brand/home' });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const refreshItem = sidebarArgs.utils.find(
      (item: any) => item.id === 'refresh-source-toggle',
    );

    expect(refreshItem).toBeUndefined();
  });

  it('should return empty items and utils when togglesReady is false', () => {
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: allTogglesEnabled,
      togglesReady: false,
    });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    expect(sidebarArgs.items).toHaveLength(0);
    expect(sidebarArgs.utils).toHaveLength(0);
  });

  it('should disable items when their toggle is false', () => {
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: {
        ...allTogglesEnabled,
        'category-toggle': false,
      },
      togglesReady: true,
    });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );

    expect(categoryItem.disabled).toBe(true);
  });

  it('should filter out subitems when their toggle is false', () => {
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: {
        ...allTogglesEnabled,
        'pos-book-toggle': false,
        'pos-pbi-toggle': false,
      },
      togglesReady: true,
    });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );

    expect(categoryItem.subItems).toHaveLength(1);
    expect(categoryItem.subItems[0].id).toBe('category-health-toggle');
  });

  it('should call trackGA when onPageChange is triggered', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );
    const posBookSubItem = categoryItem.subItems.find(
      (item: any) => item.id === 'pos-book-toggle',
    );

    posBookSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'POS Results',
    });
  });

  it('should call setModalOpen when Refresh & Source onPageChange is triggered', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const refreshItem = sidebarArgs.utils.find(
      (item: any) => item.id === 'refresh-source-toggle',
    );

    refreshItem.onPageChange();

    expect(mockSetModalOpen).toHaveBeenCalledWith(true);
  });

  it('should include Consumer item with Audience Targeting subitem', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const consumerItem = sidebarArgs.items.find(
      (item: any) => item.id === 'consumer-toggle',
    );

    expect(consumerItem).toBeDefined();
    expect(consumerItem.title).toBe('2. Consumer');
    expect(consumerItem.subItems).toHaveLength(1);
    expect(consumerItem.subItems[0].title).toBe('Audience Targeting');
  });

  it('should include Portfolio & Brand item with 6 subitems', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );

    expect(portfolioItem).toBeDefined();
    expect(portfolioItem.title).toBe('3. Portfolio & Brand');
    expect(portfolioItem.subItems).toHaveLength(7);
  });

  it('should include Innovation item', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const innovationItem = sidebarArgs.items.find(
      (item: any) => item.id === 'innovation-toggle',
    );

    expect(innovationItem).toBeDefined();
    expect(innovationItem.title).toBe('4. Innovation');
    // Handles both: with subItems (UAT) or without (current)
    if (innovationItem.subItems) {
      expect(innovationItem.subItems).toHaveLength(1);
      expect(innovationItem.subItems[0].title).toBe('Innovation');
    } else {
      expect(innovationItem.onPageChange).toBeDefined();
    }
  });

  it('should include Connections & Creativity item', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const connectionsItem = sidebarArgs.items.find(
      (item: any) => item.id === 'connections-creativity-toggle',
    );

    expect(connectionsItem).toBeDefined();
    expect(connectionsItem.title).toBe('5. Connections & Creativity');
    expect(connectionsItem.subItems).toHaveLength(1);
  });

  it('should include Trade Execution item with BEES Distribution subitem', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    // Handles both: id='bees-distribution' (UAT) or id='trade-execution-toggle' (current)
    const tradeItem = sidebarArgs.items.find(
      (item: any) =>
        item.id === 'bees-distribution' || item.id === 'trade-execution-toggle',
    );

    expect(tradeItem).toBeDefined();
    expect(tradeItem.title).toBe('6. Trade Execution');
    expect(tradeItem.subItems).toHaveLength(1);
    expect(tradeItem.subItems[0].title).toBe('BEES Distribution');
  });

  it('should have correct paths for subitems', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );

    const posBookSubItem = categoryItem.subItems.find(
      (item: any) => item.id === 'pos-book-toggle',
    );
    expect(posBookSubItem.path).toBe('/theloophub/category/pos');

    const posPbiSubItem = categoryItem.subItems.find(
      (item: any) => item.id === 'pos-pbi-toggle',
    );
    expect(posPbiSubItem.path).toBe('https://abi.tools/s/pos');
    expect(posPbiSubItem.target).toBe('_blank');
  });

  it('should set items as not disabled when their toggle is true', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );

    expect(categoryItem.disabled).toBe(false);
  });

  it('should call trackGA for Power BI | POS onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );
    const posPbiSubItem = categoryItem.subItems.find(
      (item: any) => item.id === 'pos-pbi-toggle',
    );

    posPbiSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Power BI | POS',
    });
  });

  it('should call trackGA for Category Health onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );
    const categoryHealthSubItem = categoryItem.subItems.find(
      (item: any) => item.id === 'category-health-toggle',
    );

    categoryHealthSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Category Health',
    });
  });

  it('should call trackGA for Audience Targeting onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const consumerItem = sidebarArgs.items.find(
      (item: any) => item.id === 'consumer-toggle',
    );
    const audienceTargetingSubItem = consumerItem.subItems.find(
      (item: any) => item.id === 'audience-targeting-toggle',
    );

    audienceTargetingSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Audience Targeting',
    });
  });

  it('should call trackGA for Innovation onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const innovationItem = sidebarArgs.items.find(
      (item: any) => item.id === 'innovation-toggle',
    );

    // Handles both: subItem (UAT) or main item (current)
    if (innovationItem.subItems && innovationItem.subItems.length > 0) {
      const innovationSubItem = innovationItem.subItems.find(
        (item: any) => item.id === 'submenu-innovation-toggle',
      );
      innovationSubItem.onPageChange();
    } else {
      innovationItem.onPageChange();
    }

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Innovation',
    });
  });

  it('should call trackGA for Brand Analysis onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );
    const brandAnalysisSubItem = portfolioItem.subItems.find(
      (item: any) => item.id === 'brand-analysis-toggle',
    );

    brandAnalysisSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Brand Power Drivers',
    });
  });

  it('should call trackGA for Brand Power Book onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );
    const brandPowerBookSubItem = portfolioItem.subItems.find(
      (item: any) => item.id === 'brand-power-book-toggle',
    );

    brandPowerBookSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Brand Power Results',
    });
  });

  it('should call trackGA for Brand Power Book Export onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );
    const brandPowerBookExportSubItem = portfolioItem.subItems.find(
      (item: any) => item.id === 'brand-power-book-export-toggle',
    );

    brandPowerBookExportSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Brand Power Results Export',
    });
  });

  it('should call trackGA for PowerBI | Beyond Beer onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );
    const beyondBeerSubItem = portfolioItem.subItems.find(
      (item: any) => item.id === 'beyond-beer-toggle',
    );

    beyondBeerSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'PowerBI | Beyond Beer',
    });
  });

  it('should call trackGA for PowerBI | Brand Power onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );
    const brandPowerSubItem = portfolioItem.subItems.find(
      (item: any) => item.id === 'brand-power-toggle',
    );

    brandPowerSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'PowerBI | Brand Power',
    });
  });

  it('should call trackGA for PowerBI | NA Beer onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );
    const naBeerSubItem = portfolioItem.subItems.find(
      (item: any) => item.id === 'non-alc-beer-toggle',
    );

    naBeerSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'PowerBI | NA Beer',
    });
  });

  it('should call trackGA for Resource Allocation & Media onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const connectionsItem = sidebarArgs.items.find(
      (item: any) => item.id === 'connections-creativity-toggle',
    );
    const resourceAllocationSubItem = connectionsItem.subItems.find(
      (item: any) => item.id === 'resource-allocation-toggle',
    );

    resourceAllocationSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Media & Campaign Results',
    });
  });

  it('should call trackGA for BEES Distribution onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    // Handles both: id='bees-distribution' (UAT) or id='trade-execution-toggle' (current)
    const tradeItem = sidebarArgs.items.find(
      (item: any) =>
        item.id === 'bees-distribution' || item.id === 'trade-execution-toggle',
    );
    const beesSubItem = tradeItem.subItems.find(
      (item: any) => item.id === 'bees-distribution',
    );

    beesSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'BEES Distribution',
    });
  });

  it('should call trackGA for Growth League onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const valueCreationItem = sidebarArgs.items.find(
      (item: any) => item.id === 'value-creation-toggle',
    );
    const growthLeagueSubItem = valueCreationItem.subItems.find(
      (item: any) => item.id === 'growth-league-toggle',
    );

    growthLeagueSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Growth League',
    });
  });

  it('should call trackGA for Portfolio Performance onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioBrandItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );
    const portfolioPerformanceSubItem = portfolioBrandItem.subItems.find(
      (item: any) => item.id === 'portfolio-performance-toggle',
    );

    portfolioPerformanceSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Portfolio Performance',
    });
  });

  it('should call trackGA for Volume Pages onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const valueCreationItem = sidebarArgs.items.find(
      (item: any) => item.id === 'value-creation-toggle',
    );
    const volumePagesSubItem = valueCreationItem.subItems.find(
      (item: any) => item.id === 'volume-pages-toggle',
    );

    volumePagesSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Volume Pages',
    });
  });

  it('should call trackGA for Net Revenue Pages onPageChange', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const valueCreationItem = sidebarArgs.items.find(
      (item: any) => item.id === 'value-creation-toggle',
    );
    const nrPagesSubItem = valueCreationItem.subItems.find(
      (item: any) => item.id === 'nr-pages-toggle',
    );

    nrPagesSubItem.onPageChange();

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Menu',
      event_action: 'Click',
      event_label: 'Net Revenue Pages',
    });
  });

  it('should have icon function for each main item', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];

    sidebarArgs.items.forEach((item: any) => {
      expect(typeof item.icon).toBe('function');
    });
  });

  it('should have icon function for Report a Bug', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const bugReportItem = sidebarArgs.utils.find(
      (item: any) => item.id === 'bug-report-toggle',
    );

    expect(typeof bugReportItem.icon).toBe('function');
  });

  it('should have icon function for Refresh & Source', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const refreshItem = sidebarArgs.utils.find(
      (item: any) => item.id === 'refresh-source-toggle',
    );

    expect(typeof refreshItem.icon).toBe('function');
  });

  it('should filter out all subitems when all their toggles are false', () => {
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: {
        ...allTogglesEnabled,
        'pos-book-toggle': false,
        'pos-pbi-toggle': false,
        'category-health-toggle': false,
      },
      togglesReady: true,
    });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );

    expect(categoryItem.subItems).toHaveLength(0);
  });

  it('should disable multiple items when their toggles are false', () => {
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: {
        ...allTogglesEnabled,
        'category-toggle': false,
        'consumer-toggle': false,
        'innovation-toggle': false,
      },
      togglesReady: true,
    });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];

    const categoryItem = sidebarArgs.items.find(
      (item: any) => item.id === 'category-toggle',
    );
    const consumerItem = sidebarArgs.items.find(
      (item: any) => item.id === 'consumer-toggle',
    );
    const innovationItem = sidebarArgs.items.find(
      (item: any) => item.id === 'innovation-toggle',
    );

    expect(categoryItem.disabled).toBe(true);
    expect(consumerItem.disabled).toBe(true);
    expect(innovationItem.disabled).toBe(true);
  });

  it('should have correct external paths with _blank target', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );

    const beyondBeerSubItem = portfolioItem.subItems.find(
      (item: any) => item.id === 'beyond-beer-toggle',
    );
    expect(beyondBeerSubItem.path).toBe('https://abi.tools/s/beyondbeer');
    expect(beyondBeerSubItem.target).toBe('_blank');

    const brandPowerSubItem = portfolioItem.subItems.find(
      (item: any) => item.id === 'brand-power-toggle',
    );
    expect(brandPowerSubItem.path).toBe('https://abi.tools/s/brandguidance');
    expect(brandPowerSubItem.target).toBe('_blank');

    const naBeerSubItem = portfolioItem.subItems.find(
      (item: any) => item.id === 'non-alc-beer-toggle',
    );
    expect(naBeerSubItem.path).toBe('https://abi.tools/s/nabeer');
    expect(naBeerSubItem.target).toBe('_blank');
  });

  it('should have correct internal paths for Value Creation subitems', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const valueCreationItem = sidebarArgs.items.find(
      (item: any) => item.id === 'value-creation-toggle',
    );

    const growthLeague = valueCreationItem.subItems.find(
      (item: any) => item.id === 'growth-league-toggle',
    );
    expect(growthLeague.path).toBe('/theloophub/value-creation/growth-league');

    const volumePages = valueCreationItem.subItems.find(
      (item: any) => item.id === 'volume-pages-toggle',
    );
    expect(volumePages.path).toBe('/theloophub/value-creation/volume-pages');

    const nrPages = valueCreationItem.subItems.find(
      (item: any) => item.id === 'nr-pages-toggle',
    );
    expect(nrPages.path).toBe('/theloophub/value-creation/nr-pages');

    const volumePagesCountryPpr = valueCreationItem.subItems.find(
      (item: any) => item.id === 'volume-pages-country-ppr-toggle',
    );
    expect(volumePagesCountryPpr.path).toBe(
      '/theloophub/value-creation/volume-pages-country-ppr',
    );
  });

  it('should have path for Portfolio & Brand item', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );

    expect(portfolioItem.path).toBe('/theloophub/portfolio-brand');
  });

  it('should have path for Connections & Creativity item', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const connectionsItem = sidebarArgs.items.find(
      (item: any) => item.id === 'connections-creativity-toggle',
    );

    expect(connectionsItem.path).toBe('/theloophub/connections-creativity');
  });

  it('should have correct path for Report a Bug', () => {
    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const bugReportItem = sidebarArgs.utils.find(
      (item: any) => item.id === 'bug-report-toggle',
    );

    expect(bugReportItem.path).toContain('forms.office.com');
  });

  it('should filter subitems in Portfolio & Brand when some toggles are false', () => {
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: {
        ...allTogglesEnabled,
        'brand-analysis-toggle': false,
        'brand-power-toggle': false,
        'beyond-beer-toggle': false,
      },
      togglesReady: true,
    });

    render(<Sidebar />);

    const sidebarArgs = mockUseSidebar.mock.calls[0][0];
    const portfolioItem = sidebarArgs.items.find(
      (item: any) => item.id === 'portfolio-brand-toggle',
    );

    expect(portfolioItem.subItems).toHaveLength(4);
  });
});
