import React from 'react';

import { render, screen } from '@testing-library/react';

import { bigNumberSparkLineCardsData } from './__mocks';
import { TradeExecutionHome } from './TradeExecutionHome';

const mockUseTradeExecutionHome = jest.fn();

jest.mock('assets/img/TradeOverview/execution.png', () => 'execution.png');
jest.mock(
  'assets/img/TradeOverview/poc_segmentation.png',
  () => 'poc_segmentation.png',
);
jest.mock(
  'assets/img/TradeOverview/resource_allocation.png',
  () => 'resource_allocation.png',
);

const tradeExecutionHomeMessages: Record<string, string> = {
  'Pillars.tradeExecution': '6. Trade Execution',
  'Pillars.sidebar.tradeExecution': '6. Trade Execution',
  'Pillars.pageName.tradeExecution': 'Trade Execution',
  'TradeExecution.Home.pageSubtitle':
    'Build iconic brands while delivering growth at the point-of-purchase',
  'TradeExecution.Home.breadcrumbPageName': 'Trade Execution',
  'TradeExecution.Home.howWeDoIt': 'How We do it',
  'TradeExecution.Home.growthAtPointOfPurchase':
    'Growth at the point-of-purchase',
  'TradeExecution.Home.buildIconicBrands': 'Build Iconic Brands',
  'TradeExecution.Home.pocSegmentation.title': '6.1 - POC Segmentation',
  'TradeExecution.Home.pocSegmentation.description':
    'Categorize POCs based on profile and potential, defining hero and secondary brand for each establishment.',
  'TradeExecution.Home.pocSegmentation.alt': 'POC Segmentation',
  'TradeExecution.Home.execution.title': '6.2 - Execution',
  'TradeExecution.Home.execution.description':
    'Define the strategy to achieve a Powerful Presence and Build Worth consistently.',
  'TradeExecution.Home.execution.alt': 'Execution',
  'TradeExecution.Home.resourceAllocation.title': '6.3 - Resource Allocation',
  'TradeExecution.Home.resourceAllocation.description':
    'Design Trade plans in accordance with resource allocation guidelines for Portfolio Classifications and POCs.',
  'TradeExecution.Home.resourceAllocation.alt': 'Resource Allocation',
};

const mockTradeExecutionHomeBffData = {
  'total-distribution': bigNumberSparkLineCardsData[0],
  'total-megabrands-distribution': bigNumberSparkLineCardsData[1],
};

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) =>
      tradeExecutionHomeMessages[id] ?? id,
  }),
}));

jest.mock('hooks', () => ({
  useMediaQuery: () => false,
}));

jest.mock('./hooks/useTradeExecutionHome', () => ({
  useTradeExecutionHome: () => mockUseTradeExecutionHome(),
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
  PageHeader: ({ title }: { title: string }) => (
    <header data-testid="page-header">{title}</header>
  ),
  StickyScrollWithFilters: ({ filter }: { filter: { hidden: boolean } }) => (
    <div data-testid="sticky-scroll" data-hidden={String(filter.hidden)}>
      <div data-testid="filter">Filter</div>
      <nav data-testid="breadcrumbs">Breadcrumbs</nav>
    </div>
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

jest.mock('pages/components', () => ({
  BigNumberSparkLineCard: ({
    containerTitle,
    children,
    loading,
    error,
    data,
  }: {
    containerTitle: string;
    children?: React.ReactNode;
    loading?: boolean;
    error?: Error | null;
    data?: unknown;
  }) => (
    <div
      data-testid="big-number-sparkline-card"
      data-title={containerTitle}
      data-loading={String(Boolean(loading))}
      data-has-error={String(Boolean(error))}
      data-has-data={String(Boolean(data))}
    >
      BigNumberSparkLineCard
      {children}
    </div>
  ),
}));

jest.mock('pages/components/AISummary', () => ({
  AISummary: ({
    dataTestId,
    summaryPageIdentifier,
    subFilters,
  }: {
    dataTestId: string;
    summaryPageIdentifier: string;
    subFilters?: { scope: string };
  }) => (
    <div
      data-testid={dataTestId}
      data-identifier={summaryPageIdentifier}
      data-scope={subFilters?.scope}
    >
      AISummary
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
}));

jest.mock('./TradeExecutionHome.styles', () => ({
  StyledCardImage: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="card-image" src={src} alt={alt} />
  ),
  StyledCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cards-grid">{children}</div>
  ),
  StyledSubPillarCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sub-pillar-cards-grid">{children}</div>
  ),
}));

const defaultHookReturn = {
  isHomeContentEnabled: true,
  pageData: {
    data: mockTradeExecutionHomeBffData,
    loading: false,
    error: null,
  },
  handleCardClick: jest.fn(),
  isAISummaryTotalEnabled: true,
  isAISummaryMegabrandsEnabled: true,
  togglesReady: true,
};

describe('TradeExecutionHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseTradeExecutionHome.mockReturnValue(defaultHookReturn);
  });

  it('should render the page', () => {
    render(<TradeExecutionHome />);

    expect(screen.getByTestId('grid-container')).toBeInTheDocument();
    expect(screen.getByTestId('home-container')).toBeInTheDocument();
    expect(screen.getByTestId('home-header-container')).toBeInTheDocument();
    expect(screen.getByTestId('filter')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByTestId('page-header')).toHaveTextContent(
      '6. Trade Execution',
    );
    expect(screen.getByTestId('cards-grid')).toBeInTheDocument();
    expect(screen.getByTestId('basic-container')).toBeInTheDocument();
    expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
      'Trade Execution',
    );
  });

  it('should render section title How We do it', () => {
    render(<TradeExecutionHome />);

    expect(
      screen.getByRole('heading', { name: 'How We do it' }),
    ).toBeInTheDocument();
  });

  it('should render BigNumberSparkLineCards with container titles', () => {
    render(<TradeExecutionHome />);

    const sparklineCards = screen.getAllByTestId('big-number-sparkline-card');
    expect(sparklineCards).toHaveLength(2);
    expect(sparklineCards[0]).toHaveAttribute(
      'data-title',
      'Growth at the point-of-purchase',
    );
    expect(sparklineCards[1]).toHaveAttribute(
      'data-title',
      'Build Iconic Brands',
    );
  });

  it('should render three SubPillarCards', () => {
    render(<TradeExecutionHome />);

    const subPillarCards = screen.getAllByTestId('sub-pillar-card');
    expect(subPillarCards).toHaveLength(3);
    expect(subPillarCards[0]).toHaveAttribute(
      'data-title',
      '6.1 - POC Segmentation',
    );
    expect(subPillarCards[1]).toHaveAttribute('data-title', '6.2 - Execution');
    expect(subPillarCards[2]).toHaveAttribute(
      'data-title',
      '6.3 - Resource Allocation',
    );
  });

  it('should hide the KPI cards and How We Do It section when home content is disabled', () => {
    mockUseTradeExecutionHome.mockReturnValue({
      ...defaultHookReturn,
      isHomeContentEnabled: false,
    });

    render(<TradeExecutionHome />);

    expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
      'data-hidden',
      'true',
    );
    expect(
      screen.queryByTestId('big-number-sparkline-card'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('basic-container')).not.toBeInTheDocument();
    expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
      'Trade Execution',
    );
  });

  it('should forward the loading state to the KPI cards when home content is enabled', () => {
    mockUseTradeExecutionHome.mockReturnValue({
      ...defaultHookReturn,
      pageData: {
        data: null,
        loading: true,
        error: null,
      },
    });

    render(<TradeExecutionHome />);

    const sparklineCards = screen.getAllByTestId('big-number-sparkline-card');
    expect(sparklineCards).toHaveLength(2);
    sparklineCards.forEach((card) => {
      expect(card).toHaveAttribute('data-loading', 'true');
      expect(card).toHaveAttribute('data-has-data', 'false');
      expect(card).toHaveAttribute('data-has-error', 'false');
    });
  });

  it('should forward data to the KPI cards when the BFF response is available', () => {
    render(<TradeExecutionHome />);

    const sparklineCards = screen.getAllByTestId('big-number-sparkline-card');
    expect(sparklineCards).toHaveLength(2);
    sparklineCards.forEach((card) => {
      expect(card).toHaveAttribute('data-loading', 'false');
      expect(card).toHaveAttribute('data-has-data', 'true');
      expect(card).toHaveAttribute('data-has-error', 'false');
    });
  });

  it('should forward the error state to the KPI cards without breaking the page', () => {
    mockUseTradeExecutionHome.mockReturnValue({
      ...defaultHookReturn,
      pageData: {
        data: null,
        loading: false,
        error: new Error('BFF request failed'),
      },
    });

    render(<TradeExecutionHome />);

    expect(screen.getByTestId('page-header')).toHaveTextContent(
      '6. Trade Execution',
    );
    expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
      'Trade Execution',
    );

    const sparklineCards = screen.getAllByTestId('big-number-sparkline-card');
    expect(sparklineCards).toHaveLength(2);
    sparklineCards.forEach((card) => {
      expect(card).toHaveAttribute('data-has-error', 'true');
      expect(card).toHaveAttribute('data-has-data', 'false');
    });
  });

  describe('AI Summary with Feature Toggle', () => {
    it('should render AI Summary for both cards when both feature toggles are enabled', () => {
      render(<TradeExecutionHome />);

      const aiSummaries = screen.getAllByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummaries).toHaveLength(2);
    });

    it('should render AI Summary only for Total when only total toggle is enabled', () => {
      mockUseTradeExecutionHome.mockReturnValue({
        ...defaultHookReturn,
        isAISummaryMegabrandsEnabled: false,
      });

      render(<TradeExecutionHome />);

      const aiSummaries = screen.getAllByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummaries).toHaveLength(1);
      expect(aiSummaries[0]).toHaveAttribute('data-scope', 'total');
    });

    it('should render AI Summary only for Megabrands when only megabrands toggle is enabled', () => {
      mockUseTradeExecutionHome.mockReturnValue({
        ...defaultHookReturn,
        isAISummaryTotalEnabled: false,
      });

      render(<TradeExecutionHome />);

      const aiSummaries = screen.getAllByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummaries).toHaveLength(1);
      expect(aiSummaries[0]).toHaveAttribute('data-scope', 'megabrand');
    });

    it('should NOT render any AI Summary when both feature toggles are disabled', () => {
      mockUseTradeExecutionHome.mockReturnValue({
        ...defaultHookReturn,
        isAISummaryTotalEnabled: false,
        isAISummaryMegabrandsEnabled: false,
      });

      render(<TradeExecutionHome />);

      expect(
        screen.queryByTestId('ai-summary-big-number-spark-line-card'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AI Summary when togglesReady is false', () => {
      mockUseTradeExecutionHome.mockReturnValue({
        ...defaultHookReturn,
        togglesReady: false,
      });

      render(<TradeExecutionHome />);

      expect(
        screen.queryByTestId('ai-summary-big-number-spark-line-card'),
      ).not.toBeInTheDocument();
    });
  });
});
