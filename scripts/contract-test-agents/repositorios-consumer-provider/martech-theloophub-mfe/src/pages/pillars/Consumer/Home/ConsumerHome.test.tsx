import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { featureToggles } from 'config/featureToggle';

import { ConsumerHome } from './ConsumerHome';

const mockUseFeatureToggle = jest.fn();
const mockUseMultiplesFeatureToggles = jest.fn();

const consumerHomeMessages: Record<string, string> = {
  'Pillars.consumer': '6. Consumer',
  'Pillars.sidebar.consumer': '6. Consumer',
  'Pillars.pageName.consumer': 'Consumer',
  'Consumer.Home.pageSubtitle':
    'Understand consumers to build superior connections and experiences',
  'Consumer.Home.breadcrumbPageName': 'Consumer',
  'Consumer.Home.howWeDoIt': 'How We Do It',
  'Consumer.Home.increaseABILovers': 'Increase ABI Lovers',
  'Consumer.Home.increaseParticipation': 'Increase Participation',
  'Consumer.Home.targetAudiences.title': '6.1 - Target Audiences',
  'Consumer.Home.targetAudiences.description':
    'Define and reach your target audiences',
  'Consumer.Home.understandingAudiences.title': '6.2 - Understanding Audiences',
  'Consumer.Home.understandingAudiences.description':
    'Deep dive into audience insights',
  'Consumer.Home.understandingAudiences.alt': 'Understanding Audiences',
  'Consumer.Home.jobsToBeDone.title': '6.3 - Jobs to be Done',
  'Consumer.Home.jobsToBeDone.description': 'Identify jobs to be done',
  'Consumer.Home.jobsToBeDone.alt': 'Jobs to be Done',
};

jest.mock('assets/img/Consumer/jobsToBeDone.png', () => 'jobsToBeDone.png');
jest.mock(
  'assets/img/Consumer/understanding_audiences.png',
  () => 'understanding_audiences.png',
);

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => consumerHomeMessages[id] ?? id,
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('hooks', () => ({
  useFeatureToggle: (...args: unknown[]) => mockUseFeatureToggle(...args),
  useMultiplesFeatureToggles: (...args: unknown[]) =>
    mockUseMultiplesFeatureToggles(...args),
  useMediaQuery: () => false,
  usePageFilterApplied: () => ({
    applied: { zone: '', country: '', timeperiod: '' },
  }),
  useBffData: () => ({
    loading: false,
    error: null,
    data: {
      'increase-abi-lovers': {},
      'increase-participation': {},
      'target-audiences': {
        title: '',
        period: '',
        description: '',
        bigNumberData: [],
      },
    },
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
  BigNumber: ({
    children,
    onClick,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button type="button" data-testid="big-number" onClick={onClick}>
      {children}
    </button>
  ),
  ChartHeader: () => <div data-testid="chart-header">ChartHeader</div>,
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

jest.mock('pages/components', () => ({
  BigNumberSparkLineCard: ({
    containerTitle,
    children,
  }: {
    containerTitle: string;
    children?: React.ReactNode;
  }) => (
    <div data-testid="big-number-sparkline-card" data-title={containerTitle}>
      BigNumberSparkLineCard
      {children}
    </div>
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

jest.mock('./ConsumerHome.styles', () => ({
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

describe('ConsumerHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockUseFeatureToggle.mockReturnValue([true, false]);
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: {
        [featureToggles.pillar.consumer.home.aiSummary.abiLovers]: true,
        [featureToggles.pillar.consumer.home.aiSummary.increaseParticipation]:
          true,
      },
      togglesReady: true,
    });
  });

  describe('Basic Rendering', () => {
    it('should render the page structure, static section and cards', () => {
      render(<ConsumerHome />);

      expect(screen.getByTestId('grid-container')).toBeInTheDocument();
      expect(screen.getByTestId('home-container')).toBeInTheDocument();
      expect(screen.getByTestId('home-header-container')).toBeInTheDocument();
      expect(screen.getByTestId('filter')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
      expect(screen.getByTestId('page-header')).toHaveTextContent(
        '6. Consumer',
      );
      expect(screen.getByTestId('cards-grid')).toBeInTheDocument();
      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
        'Consumer',
      );
      expect(
        screen.getByRole('heading', { name: 'How We Do It' }),
      ).toBeInTheDocument();

      const sparklineCards = screen.getAllByTestId('big-number-sparkline-card');
      expect(sparklineCards).toHaveLength(2);
      expect(sparklineCards[0]).toHaveAttribute(
        'data-title',
        'Increase ABI Lovers',
      );
      expect(sparklineCards[1]).toHaveAttribute(
        'data-title',
        'Increase Participation',
      );

      const subPillarCards = screen.getAllByTestId('sub-pillar-card');
      expect(subPillarCards).toHaveLength(3);
      expect(subPillarCards[0]).toHaveAttribute(
        'data-title',
        '6.1 - Target Audiences',
      );
      expect(subPillarCards[1]).toHaveAttribute(
        'data-title',
        '6.2 - Understanding Audiences',
      );
      expect(subPillarCards[2]).toHaveAttribute(
        'data-title',
        '6.3 - Jobs to be Done',
      );
    });
  });

  describe('Click behavior', () => {
    it('should navigate to audience-targeting when clicking BigNumber in Target Audiences', async () => {
      render(<ConsumerHome />);

      const bigNumbers = screen.getAllByTestId('big-number');
      await userEvent.click(bigNumbers[0]);

      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith(
        '/consumer/audience-targeting/definition',
      );
    });
  });

  describe('AI Summary with Feature Toggle', () => {
    it('should render AI Summary for both cards when both feature toggles are enabled', () => {
      render(<ConsumerHome />);

      const aiSummaries = screen.getAllByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummaries).toHaveLength(2);
    });

    it('should render AI Summary only for ABI Lovers when only abiLovers toggle is enabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.pillar.consumer.home.aiSummary.abiLovers]: true,
          [featureToggles.pillar.consumer.home.aiSummary.increaseParticipation]:
            false,
        },
        togglesReady: true,
      });

      render(<ConsumerHome />);

      const aiSummaries = screen.getAllByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummaries).toHaveLength(1);
      expect(aiSummaries[0]).toHaveAttribute(
        'data-identifier',
        '2. Consumer; Home; ABI Lovers',
      );
    });

    it('should render AI Summary only for Increase Participation when only increaseParticipation toggle is enabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.pillar.consumer.home.aiSummary.abiLovers]: false,
          [featureToggles.pillar.consumer.home.aiSummary.increaseParticipation]:
            true,
        },
        togglesReady: true,
      });

      render(<ConsumerHome />);

      const aiSummaries = screen.getAllByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummaries).toHaveLength(1);
      expect(aiSummaries[0]).toHaveAttribute(
        'data-identifier',
        '2. Consumer; Home; Increase Participation',
      );
    });

    it('should NOT render any AI Summary when both feature toggles are disabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.pillar.consumer.home.aiSummary.abiLovers]: false,
          [featureToggles.pillar.consumer.home.aiSummary.increaseParticipation]:
            false,
        },
        togglesReady: true,
      });

      render(<ConsumerHome />);

      expect(
        screen.queryByTestId('ai-summary-big-number-spark-line-card'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AI Summary when togglesReady is false', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        featuresListByToggleName: {
          [featureToggles.pillar.consumer.home.aiSummary.abiLovers]: true,
          [featureToggles.pillar.consumer.home.aiSummary.increaseParticipation]:
            true,
        },
        togglesReady: false,
      });

      render(<ConsumerHome />);

      expect(
        screen.queryByTestId('ai-summary-big-number-spark-line-card'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AI Summary when consumer home content is disabled', () => {
      mockUseFeatureToggle.mockReturnValue([false, false]);

      render(<ConsumerHome />);

      expect(
        screen.queryByTestId('ai-summary-big-number-spark-line-card'),
      ).not.toBeInTheDocument();
    });
  });
});
