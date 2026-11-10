import React from 'react';
import { IntlProvider } from 'react-intl';

import { fireEvent, render, screen, within } from '@testing-library/react';

import { HowWeDoIt } from './HowWeDoIt';
import { SubPilarBrandPlatforms } from './SubPilarBrandPlatforms/SubPillarBrandPlatforms';
import { SubPilarBrandWorld } from './SubPilarBrandWorld/SubPillarBrandWorld';
import { SubPilarPortfolioStrategy } from './SubPilarPortfolioStrategy/SubPillarPortfolioStrategy';
import { TargetAudiences } from './TargetAudiences/TargetAudiences';

const mockNavigate = jest.fn();
const mockApplyFilters = jest.fn();
const mockUpdateForm = jest.fn();
const mockUseMediaQuery = jest.fn(() => false);

const messages = {
  'PortfolioBrand.Home.containerTitleHowWeDoIt': 'How We Do It',
  'PortfolioBrand.Home.portfolioStrategy.title': '3.1 - Portfolio Strategy',
  'PortfolioBrand.Home.portfolioStrategy.description':
    'Define the role and ambition of each brand in the portfolio',
  'PortfolioBrand.Home.brandWorld.title': '3.2 - Brand World',
  'PortfolioBrand.Home.brandWorld.description':
    'Define how the brand shows up in the world',
  'PortfolioBrand.Home.brandWorld.alt': 'Brand World',
  'PortfolioBrand.Home.brandPlatforms.title': '3.3 - Brand Platforms',
  'PortfolioBrand.Home.brandPlatforms.description':
    'Build brand platforms to drive growth',
  'PortfolioBrand.Home.brandPlatforms.alt': 'Brand Platforms',
  'PortfolioBrand.Home.targetAudiences.title': '3.4 - Target Audiences',
  'PortfolioBrand.Home.targetAudiences.description':
    'Define the target audience for each brand',
};

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={messages} onError={() => undefined}>
      {ui}
    </IntlProvider>,
  );

const portfolioStrategyData = [
  { title: 'Megabrands Volume', period: '', bigNumberData: [] },
  { title: 'Megabrands Brand Power', period: '', bigNumberData: [] },
];

const targetAudiencesData = {
  title: 'Brands Superior',
  period: "Q3'25 YTD",
  bigNumberData: [],
};

const howWeDoItDefaultProps = {
  loading: false,
  error: null as Error | null,
  targetAudiencesData,
  portfolioStrategyData,
};

jest.mock('assets/img/PortfolioBrand/brand-world.png', () => 'brand-world.png');
jest.mock(
  'assets/img/PortfolioBrand/brand-platforms.png',
  () => 'brand-platforms.png',
);

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('hooks', () => ({
  useMediaQuery: () => mockUseMediaQuery(),
  usePageFilterManagement: () => ({
    apply: mockApplyFilters,
    updateForm: mockUpdateForm,
  }),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header?: { title: string; titleSize?: string };
  }) => (
    <div data-testid="basic-container" data-title-size={header?.titleSize}>
      {header?.title && <h2 data-testid="section-title">{header.title}</h2>}
      {children}
    </div>
  ),
  DataStateHandler: ({
    children,
    loading,
    error,
    empty,
  }: {
    children: React.ReactNode;
    loading?: boolean;
    error?: unknown;
    empty?: boolean;
  }) =>
    loading || error || empty ? (
      <div data-testid="data-state-handler-skeleton">Skeleton</div>
    ) : (
      <div data-testid="data-state-handler">{children}</div>
    ),
  SubPillarCard: ({
    children,
    title,
    description,
  }: {
    children: React.ReactNode;
    title: string;
    description: string;
  }) => (
    <div data-testid="sub-pillar-card" data-title={title}>
      <span data-testid="sub-pillar-description">{description}</span>
      {children}
    </div>
  ),
  BigNumber: ({
    header,
    onClick,
  }: {
    header: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button data-testid="big-number" onClick={onClick}>
      {header}
    </button>
  ),
  ChartHeader: ({ title, period }: { title: string; period: string }) => (
    <div data-testid="chart-header" data-title={title} data-period={period}>
      {title} - {period}
    </div>
  ),
}));

jest.mock('../../PortfolioBrandHome.styles', () => ({
  StyledSubPillarCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sub-pillar-cards-grid">{children}</div>
  ),
  StyledSubPillarImageSmall: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="sub-pillar-image" src={src} alt={alt} />
  ),
}));

describe('HowWeDoIt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMediaQuery.mockReturnValue(false);
  });

  it('renders the section with localized title and the four sub-pillar cards inside the grid', () => {
    renderWithIntl(<HowWeDoIt {...howWeDoItDefaultProps} />);

    expect(screen.getByTestId('section-title')).toHaveTextContent(
      'How We Do It',
    );

    const grid = screen.getByTestId('sub-pillar-cards-grid');
    const cards = within(grid).getAllByTestId('sub-pillar-card');
    expect(cards).toHaveLength(4);
    expect(cards.map((card) => card.dataset.title)).toEqual([
      '3.1 - Portfolio Strategy',
      '3.2 - Brand World',
      '3.3 - Brand Platforms',
      '3.4 - Target Audiences',
    ]);
  });

  describe('Responsive title size', () => {
    it('uses H3 as the title size on smaller viewports', () => {
      mockUseMediaQuery.mockReturnValue(false);

      renderWithIntl(<HowWeDoIt {...howWeDoItDefaultProps} />);

      expect(screen.getByTestId('basic-container')).toHaveAttribute(
        'data-title-size',
        'H3',
      );
    });

    it('uses H2 as the title size on large desktop viewports', () => {
      mockUseMediaQuery.mockReturnValue(true);

      renderWithIntl(<HowWeDoIt {...howWeDoItDefaultProps} />);

      expect(screen.getByTestId('basic-container')).toHaveAttribute(
        'data-title-size',
        'H2',
      );
    });
  });

  describe('SubPilarPortfolioStrategy', () => {
    const defaultProps = {
      loading: false,
      error: null as Error | null,
      data: portfolioStrategyData,
    };

    it('renders the card with the localized title and description', () => {
      renderWithIntl(<SubPilarPortfolioStrategy {...defaultProps} />);

      const card = screen.getByTestId('sub-pillar-card');
      expect(card).toHaveAttribute('data-title', '3.1 - Portfolio Strategy');
      expect(screen.getByTestId('sub-pillar-description')).toHaveTextContent(
        'Define the role and ambition of each brand in the portfolio',
      );
    });

    it('renders one BigNumber per portfolio strategy entry, each with its ChartHeader title', () => {
      renderWithIntl(<SubPilarPortfolioStrategy {...defaultProps} />);

      expect(screen.getAllByTestId('big-number')).toHaveLength(2);
      const chartTitles = screen
        .getAllByTestId('chart-header')
        .map((header) => header.dataset.title);
      expect(chartTitles).toEqual([
        'Megabrands Volume',
        'Megabrands Brand Power',
      ]);
    });

    it('navigates to the portfolio performance overview when the Megabrands Volume card is clicked', () => {
      renderWithIntl(<SubPilarPortfolioStrategy {...defaultProps} />);

      fireEvent.click(screen.getAllByTestId('big-number')[0]);

      expect(mockNavigate).toHaveBeenCalledWith(
        '/portfolio-brand/portfolio-performance',
      );
      expect(mockUpdateForm).not.toHaveBeenCalled();
      expect(mockApplyFilters).not.toHaveBeenCalled();
    });

    it('updates filters and navigates to the brand power book when the Megabrands Brand Power card is clicked', () => {
      renderWithIntl(<SubPilarPortfolioStrategy {...defaultProps} />);

      fireEvent.click(screen.getAllByTestId('big-number')[1]);

      expect(mockUpdateForm).toHaveBeenCalledWith('scopes', 'portfolio');
      expect(mockUpdateForm).toHaveBeenCalledWith('sub_scopes', 'Megabrands');
      expect(mockApplyFilters).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        '/portfolio-brand/brand-power-book/power-book',
      );
    });
  });

  describe('static image sub-pillars', () => {
    it.each([
      [
        'SubPilarBrandWorld',
        SubPilarBrandWorld,
        '3.2 - Brand World',
        'Define how the brand shows up in the world',
        'Brand World',
      ],
      [
        'SubPilarBrandPlatforms',
        SubPilarBrandPlatforms,
        '3.3 - Brand Platforms',
        'Build brand platforms to drive growth',
        'Brand Platforms',
      ],
    ])(
      '%s renders the card with localized title, description and image alt',
      (_label, Component, expectedTitle, expectedDescription, expectedAlt) => {
        renderWithIntl(<Component />);

        expect(screen.getByTestId('sub-pillar-card')).toHaveAttribute(
          'data-title',
          expectedTitle,
        );
        expect(screen.getByTestId('sub-pillar-description')).toHaveTextContent(
          expectedDescription,
        );
        expect(screen.getByTestId('sub-pillar-image')).toHaveAttribute(
          'alt',
          expectedAlt,
        );
      },
    );
  });

  describe('TargetAudiences', () => {
    const defaultProps = {
      data: targetAudiencesData,
      loading: false,
      error: null as Error | null,
    };

    it('renders the card with localized title, description and a BigNumber wrapping the data', () => {
      renderWithIntl(<TargetAudiences {...defaultProps} />);

      const card = screen.getByTestId('sub-pillar-card');
      expect(card).toHaveAttribute('data-title', '3.4 - Target Audiences');
      expect(screen.getByTestId('sub-pillar-description')).toHaveTextContent(
        'Define the target audience for each brand',
      );
      expect(screen.getByTestId('big-number')).toBeInTheDocument();
    });

    it('forwards the data title and period to the ChartHeader', () => {
      renderWithIntl(<TargetAudiences {...defaultProps} />);

      const chartHeader = screen.getByTestId('chart-header');
      expect(chartHeader).toHaveAttribute('data-title', 'Brands Superior');
      expect(chartHeader).toHaveAttribute('data-period', "Q3'25 YTD");
    });

    it('still renders the BigNumber when bigNumberData is missing on the payload', () => {
      renderWithIntl(
        <TargetAudiences
          {...defaultProps}
          data={
            {
              title: 'Brands Superior',
              period: "Q3'25 YTD",
            } as any
          }
        />,
      );

      expect(screen.getByTestId('big-number')).toBeInTheDocument();
    });
  });
});
