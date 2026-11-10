import React from 'react';

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { featureToggles } from 'config/featureToggle';

import { CategoryHome } from './CategoryHome';

jest.mock(
  'assets/img/CategoryOverview/category_understanding.png',
  () => 'category_understanding.png',
);
jest.mock(
  'assets/img/CategoryOverview/consumer_motivation.png',
  () => 'consumer_motivation.png',
);

const mockUseFeatureToggle = jest.fn();
const mockUseMultiplesFeatureToggles = jest.fn();
const mockUseBffData = jest.fn();
const mockNavigate = jest.fn();
const mockApplyFilters = jest.fn();
const mockUpdateForm = jest.fn();
const mockBigNumberSparkLineCard = jest.fn();
const mockDataStateHandler = jest.fn();
const mockAISummary = jest.fn();

let mockAppliedFilters = { zone: '', country: '', timeperiod: 'R12M' };
let mockIsDesktopLarge = false;

const categoryHomeMessages: Record<string, string> = {
  'Pillars.category': '1. Category',
  'Pillars.sidebar.category': '1. Category',
  'Pillars.pageName.category': 'Category',
  'Category.Home.breadcrumbPageName': 'Category',
  'Category.Home.pageSubtitle':
    'Define the key opportunities to Lead and Grow the category',
  'Category.Home.containerTitleGrow': 'Grow the Category',
  'Category.Home.containerTitleLead': 'Lead the Category',
  'Category.Home.howWeDoIt': 'How We do it',
  'Category.Home.categoryUnderstanding.title': '1.1 - Category Understanding',
  'Category.Home.categoryUnderstanding.description':
    'Understand which of the growth levers...',
  'Category.Home.categoryUnderstanding.alt': 'Category Understanding',
  'Category.Home.consumerMotivation.title': '1.2 - Consumer Motivation',
  'Category.Home.consumerMotivation.description':
    'Define the brand portfolio...',
  'Category.Home.consumerMotivation.alt': 'Consumer Motivation',
  'Category.Home.consumerBehavior.title': '1.3 - Consumer Behavior',
  'Category.Home.consumerBehavior.description': 'Assess consumer behavior...',
};

const growTheCategoryData = {
  title: 'Grow KPI',
  data: [{ value: 10 }],
};

const leadTheCategoryData = {
  title: 'Lead KPI',
  data: [{ value: 20 }],
};

const consumerBehaviorData = [
  {
    title: 'Beer Participation',
    period: 'R12M',
    bigNumberData: [{ value: 30 }],
  },
  {
    title: 'Brand Power',
    period: 'R12M',
    bigNumberData: [{ value: 40 }],
  },
  {
    title: 'Unused item',
    period: 'R12M',
    bigNumberData: [{ value: 50 }],
  },
];

const defaultPageData = {
  data: {
    'grow-the-category': [growTheCategoryData],
    'lead-the-category': [leadTheCategoryData],
    'consumer-behavior': consumerBehaviorData,
  },
  loading: false,
  error: null,
};

type RenderCategoryHomeOptions = {
  featureToggle?: [boolean, boolean];
  multiplesFeatureToggles?: {
    featuresListByToggleName: Record<string, boolean>;
    togglesReady: boolean;
  };
  pageData?: {
    data: unknown;
    loading: boolean;
    error?: unknown;
  };
  appliedFilters?: typeof mockAppliedFilters;
  isDesktopLarge?: boolean;
};

const defaultMultiplesFeatureToggles = {
  featuresListByToggleName: {
    [featureToggles.pillar.category.home.aiSummary.growTheCategory]: true,
    [featureToggles.pillar.category.home.aiSummary.leadTheCategory]: true,
  },
  togglesReady: true,
};

const renderCategoryHome = ({
  featureToggle = [true, false],
  multiplesFeatureToggles = defaultMultiplesFeatureToggles,
  pageData = defaultPageData,
  appliedFilters = { zone: '', country: '', timeperiod: 'R12M' },
  isDesktopLarge = false,
}: RenderCategoryHomeOptions = {}) => {
  mockAppliedFilters = appliedFilters;
  mockIsDesktopLarge = isDesktopLarge;
  mockUseFeatureToggle.mockReturnValue(featureToggle);
  mockUseMultiplesFeatureToggles.mockReturnValue(multiplesFeatureToggles);
  mockUseBffData.mockReturnValue(pageData);

  return render(<CategoryHome />);
};

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => categoryHomeMessages[id] ?? id,
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('hooks', () => ({
  useFeatureToggle: (...args: unknown[]) => mockUseFeatureToggle(...args),
  useMultiplesFeatureToggles: (...args: unknown[]) =>
    mockUseMultiplesFeatureToggles(...args),
  useMediaQuery: () => mockIsDesktopLarge,
  usePageFilterApplied: () => ({
    applied: mockAppliedFilters,
  }),
  usePageFilterManagement: () => ({
    apply: mockApplyFilters,
    updateForm: mockUpdateForm,
  }),
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header?: { title: string; titleSize?: string };
  }) => (
    <section data-testid="basic-container" data-title-size={header?.titleSize}>
      {header?.title && <h2>{header.title}</h2>}
      {children}
    </section>
  ),
  BigNumber: ({
    header,
    data,
    onClick,
    size,
  }: {
    header?: React.ReactNode;
    data?: unknown[];
    onClick?: () => void;
    size?: string;
  }) => (
    <button
      type="button"
      data-testid="big-number"
      data-has-data={String(Boolean(data))}
      data-size={size}
      onClick={onClick}
    >
      {header}
    </button>
  ),
  ChartHeader: ({ title, period }: { title?: string; period?: string }) => (
    <span data-testid="chart-header" data-period={period}>
      {title}
    </span>
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
  }) => {
    mockDataStateHandler({ loading, error, empty });

    return (
      <div
        data-testid="data-state-handler"
        data-loading={String(Boolean(loading))}
        data-has-error={String(Boolean(error))}
        data-empty={String(Boolean(empty))}
      >
        {children}
      </div>
    );
  },
  StickyScrollWithFilters: ({
    filter,
    breadcrumbs,
  }: {
    filter: {
      hidden?: boolean;
      pageName: string;
      visibleFields: string[];
    };
    breadcrumbs: {
      pageList: Array<{ href: string; pageName: string }>;
      showIcon: boolean;
    };
  }) => (
    <div
      data-testid="sticky-scroll"
      data-hidden={String(Boolean(filter.hidden))}
      data-page-name={filter.pageName}
      data-visible-fields={filter.visibleFields.join(',')}
      data-breadcrumb-name={breadcrumbs.pageList[0].pageName}
      data-breadcrumb-href={breadcrumbs.pageList[0].href}
      data-show-icon={String(breadcrumbs.showIcon)}
    >
      <div data-testid="filter">Filter</div>
      <nav data-testid="breadcrumbs">Breadcrumbs</nav>
    </div>
  ),
  PageHeader: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <header data-testid="page-header">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  ),
  PillarResources: ({ pillar }: { pillar: string }) => (
    <div data-testid="pillar-resources">{pillar}</div>
  ),
  SubPillarCard: ({
    children,
    description,
    title,
  }: {
    children: React.ReactNode;
    description?: string;
    title: string;
  }) => (
    <article data-testid="sub-pillar-card">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {children}
    </article>
  ),
}));

jest.mock('pages/components', () => ({
  BigNumberSparkLineCard: ({
    containerTitle,
    children,
    data,
    error,
    loading,
  }: {
    containerTitle: string;
    children?: React.ReactNode;
    data?: unknown;
    error?: unknown;
    loading?: boolean;
  }) => {
    mockBigNumberSparkLineCard({ containerTitle, data, error, loading });

    return (
      <section
        data-testid="big-number-sparkline-card"
        data-title={containerTitle}
        data-loading={String(Boolean(loading))}
        data-has-error={String(Boolean(error))}
        data-has-data={String(Boolean(data))}
      >
        <h2>{containerTitle}</h2>
        {children}
      </section>
    );
  },
}));

jest.mock('pages/components/AISummary', () => ({
  AISummary: ({
    dataTestId,
    hasExpandedAction,
    kpiGroup,
    pageName,
    summaryPageIdentifier,
  }: {
    dataTestId: string;
    hasExpandedAction: boolean;
    kpiGroup: string;
    pageName: string;
    summaryPageIdentifier: string;
  }) => {
    mockAISummary({
      hasExpandedAction,
      kpiGroup,
      pageName,
      summaryPageIdentifier,
    });

    return (
      <div
        data-testid={dataTestId}
        data-expanded-action={String(hasExpandedAction)}
        data-identifier={summaryPageIdentifier}
        data-kpi-group={kpiGroup}
        data-page-name={pageName}
      >
        AISummary
      </div>
    );
  },
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

jest.mock('./CategoryHome.styles', () => ({
  StyledCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cards-grid">{children}</div>
  ),
  StyledSubPillarCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sub-pillar-cards-grid">{children}</div>
  ),
  StyledSubPillarImage: (props: { alt: string; src: string }) => (
    <img data-testid="sub-pillar-image" alt={props.alt} src={props.src} />
  ),
  StyledSubPillarImageSmall: (props: { alt: string; src: string }) => (
    <img data-testid="sub-pillar-image-small" alt={props.alt} src={props.src} />
  ),
}));

describe('CategoryHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAppliedFilters = { zone: '', country: '', timeperiod: 'R12M' };
    mockIsDesktopLarge = false;
  });

  describe('Basic Rendering', () => {
    it('should render the page shell and core content', () => {
      renderCategoryHome();

      expect(screen.getByTestId('grid-container')).toBeInTheDocument();
      expect(screen.getByTestId('home-container')).toBeInTheDocument();
      expect(screen.getByTestId('home-header-container')).toBeInTheDocument();
      expect(screen.getByTestId('filter')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: '1. Category' }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'Define the key opportunities to Lead and Grow the category',
        ),
      ).toBeInTheDocument();
      expect(screen.getByTestId('cards-grid')).toBeInTheDocument();
      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
        'Category',
      );
    });

    it('should render the How We do it section and sub-pillar content', () => {
      renderCategoryHome();

      expect(
        screen.getByRole('heading', { name: 'How We do it' }),
      ).toBeInTheDocument();

      const subPillarCards = screen.getAllByTestId('sub-pillar-card');
      expect(subPillarCards).toHaveLength(3);
      expect(subPillarCards[0]).toHaveTextContent(
        '1.1 - Category Understanding',
      );
      expect(subPillarCards[0]).toHaveTextContent(
        'Understand which of the growth levers...',
      );
      expect(
        within(subPillarCards[0]).getByRole('img', {
          name: 'Category Understanding',
        }),
      ).toBeInTheDocument();
      expect(subPillarCards[1]).toHaveTextContent('1.2 - Consumer Motivation');
      expect(subPillarCards[1]).toHaveTextContent(
        'Define the brand portfolio...',
      );
      expect(
        within(subPillarCards[1]).getByRole('img', {
          name: 'Consumer Motivation',
        }),
      ).toBeInTheDocument();
      expect(subPillarCards[2]).toHaveTextContent('1.3 - Consumer Behavior');
      expect(subPillarCards[2]).toHaveTextContent(
        'Assess consumer behavior...',
      );
    });

    it('should render BigNumberSparkLineCards with container titles', () => {
      renderCategoryHome();

      const sparklineCards = screen.getAllByTestId('big-number-sparkline-card');
      expect(sparklineCards).toHaveLength(2);
      expect(sparklineCards[0]).toHaveAttribute(
        'data-title',
        'Grow the Category',
      );
      expect(sparklineCards[1]).toHaveAttribute(
        'data-title',
        'Lead the Category',
      );
    });

    it('should use desktop title and big number sizes on large screens', () => {
      renderCategoryHome({ isDesktopLarge: true });

      expect(screen.getByTestId('basic-container')).toHaveAttribute(
        'data-title-size',
        'H2',
      );
      screen.getAllByTestId('big-number').forEach((bigNumber) => {
        expect(bigNumber).toHaveAttribute('data-size', 'medium');
      });
    });
  });

  describe('Feature Toggle', () => {
    it('should pass configured filters and breadcrumbs to StickyScrollWithFilters', () => {
      renderCategoryHome();

      expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
        'data-hidden',
        'false',
      );
      expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
        'data-page-name',
        'category_home',
      );
      expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
        'data-visible-fields',
        'zone,country,periods',
      );
      expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
        'data-breadcrumb-name',
        'Category',
      );
      expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
        'data-breadcrumb-href',
        '/category',
      );
      expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
        'data-show-icon',
        'true',
      );
    });

    it('should hide home content and filters when category home content is disabled', () => {
      renderCategoryHome({ featureToggle: [false, false] });

      expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
        'data-hidden',
        'true',
      );
      expect(
        screen.queryByTestId('big-number-sparkline-card'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'How We do it' }),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
        'Category',
      );
    });

    it('should hide home content and filters while category home content is loading', () => {
      renderCategoryHome({ featureToggle: [true, true] });

      expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
        'data-hidden',
        'true',
      );
      expect(
        screen.queryByTestId('big-number-sparkline-card'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: 'How We do it' }),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
        'Category',
      );
    });
  });

  describe('Data Contract', () => {
    it('should call useBffData with applied filters', () => {
      renderCategoryHome({
        appliedFilters: {
          zone: 'Europe',
          country: 'Belgium',
          timeperiod: 'YTD',
        },
      });

      expect(mockUseBffData).toHaveBeenCalledWith({
        id: 'category_home',
        kpiGroup: 'pos',
        subFilters: {
          zone: 'Europe',
          country: 'Belgium',
          timeperiod: 'R12M',
          pos_kpi: 'participation',
        },
      });
    });

    it('should pass BFF data, loading, and error to the main cards', () => {
      const error = new Error('BFF failed');

      renderCategoryHome({
        pageData: {
          ...defaultPageData,
          loading: true,
          error,
        },
      });

      expect(mockBigNumberSparkLineCard).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          containerTitle: 'Grow the Category',
          data: growTheCategoryData,
          loading: true,
          error,
        }),
      );
      expect(mockBigNumberSparkLineCard).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          containerTitle: 'Lead the Category',
          data: leadTheCategoryData,
          loading: true,
          error,
        }),
      );
    });
  });

  describe('Consumer Behavior', () => {
    it('should render two BigNumbers from the first two consumer behavior items', () => {
      renderCategoryHome();

      const bigNumbers = screen.getAllByRole('button');
      expect(bigNumbers).toHaveLength(2);
      expect(bigNumbers[0]).toHaveTextContent('Beer Participation');
      expect(within(bigNumbers[0]).getByTestId('chart-header')).toHaveAttribute(
        'data-period',
        'R12M',
      );
      expect(bigNumbers[0]).toHaveAttribute('data-has-data', 'true');
      expect(bigNumbers[1]).toHaveTextContent('Brand Power');
      expect(screen.queryByText('Unused item')).not.toBeInTheDocument();
    });

    it('should pass loading and error states to DataStateHandler', () => {
      const error = new Error('Consumer behavior failed');

      renderCategoryHome({
        pageData: {
          ...defaultPageData,
          loading: true,
          error,
        },
      });

      expect(mockDataStateHandler).toHaveBeenCalledTimes(2);
      expect(mockDataStateHandler).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          loading: true,
          error,
          empty: false,
        }),
      );
      expect(screen.getAllByTestId('data-state-handler')[0]).toHaveAttribute(
        'data-loading',
        'true',
      );
      expect(screen.getAllByTestId('data-state-handler')[0]).toHaveAttribute(
        'data-has-error',
        'true',
      );
    });

    it('should pass empty state to DataStateHandler when consumer behavior data is missing', () => {
      renderCategoryHome({
        pageData: {
          ...defaultPageData,
          data: {
            'grow-the-category': [growTheCategoryData],
            'lead-the-category': [leadTheCategoryData],
          },
        },
      });

      expect(mockDataStateHandler).toHaveBeenCalledTimes(2);
      expect(mockDataStateHandler).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ empty: true }),
      );
      screen.getAllByTestId('data-state-handler').forEach((handler) => {
        expect(handler).toHaveAttribute('data-empty', 'true');
      });
    });

    it('should apply filters and navigate to grow tab when Beer Participation is clicked', async () => {
      renderCategoryHome();

      await userEvent.click(
        screen.getByRole('button', { name: /beer participation/i }),
      );

      expect(mockUpdateForm).toHaveBeenCalledWith('pos_periods', 'R12M');
      expect(mockApplyFilters).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/category/pos/grow');
    });

    it('should apply filters and navigate to lead tab when another consumer behavior item is clicked', async () => {
      renderCategoryHome();

      await userEvent.click(
        screen.getByRole('button', { name: /brand power/i }),
      );

      expect(mockUpdateForm).toHaveBeenCalledWith('pos_periods', 'R12M');
      expect(mockApplyFilters).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/category/pos/lead');
    });
  });

  describe('AI Summary', () => {
    it('should render AI Summary for both cards when both feature toggles are enabled', () => {
      renderCategoryHome();

      const aiSummaries = screen.getAllByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummaries).toHaveLength(2);
      expect(aiSummaries[0]).toHaveAttribute(
        'data-identifier',
        '1. Category; POS Book; Grow the category',
      );
      expect(aiSummaries[1]).toHaveAttribute(
        'data-identifier',
        '1. Category; POS Book; Lead the Category',
      );
      aiSummaries.forEach((aiSummary) => {
        expect(aiSummary).toHaveAttribute('data-page-name', 'category_home');
        expect(aiSummary).toHaveAttribute('data-kpi-group', 'pos');
        expect(aiSummary).toHaveAttribute('data-expanded-action', 'false');
      });
    });

    it('should pass the expected contract to AISummary', () => {
      renderCategoryHome();

      expect(mockAISummary).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          hasExpandedAction: false,
          kpiGroup: 'pos',
          pageName: 'category_home',
          summaryPageIdentifier: '1. Category; POS Book; Grow the category',
        }),
      );
      expect(mockAISummary).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          hasExpandedAction: false,
          kpiGroup: 'pos',
          pageName: 'category_home',
          summaryPageIdentifier: '1. Category; POS Book; Lead the Category',
        }),
      );
    });

    it('should render AI Summary only for Grow the Category when only growTheCategory toggle is enabled', () => {
      renderCategoryHome({
        multiplesFeatureToggles: {
          featuresListByToggleName: {
            [featureToggles.pillar.category.home.aiSummary.growTheCategory]:
              true,
            [featureToggles.pillar.category.home.aiSummary.leadTheCategory]:
              false,
          },
          togglesReady: true,
        },
      });

      const aiSummaries = screen.getAllByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummaries).toHaveLength(1);
      expect(aiSummaries[0]).toHaveAttribute(
        'data-identifier',
        '1. Category; POS Book; Grow the category',
      );
    });

    it('should render AI Summary only for Lead the Category when only leadTheCategory toggle is enabled', () => {
      renderCategoryHome({
        multiplesFeatureToggles: {
          featuresListByToggleName: {
            [featureToggles.pillar.category.home.aiSummary.growTheCategory]:
              false,
            [featureToggles.pillar.category.home.aiSummary.leadTheCategory]:
              true,
          },
          togglesReady: true,
        },
      });

      const aiSummaries = screen.getAllByTestId(
        'ai-summary-big-number-spark-line-card',
      );
      expect(aiSummaries).toHaveLength(1);
      expect(aiSummaries[0]).toHaveAttribute(
        'data-identifier',
        '1. Category; POS Book; Lead the Category',
      );
    });

    it('should NOT render any AI Summary when both feature toggles are disabled', () => {
      renderCategoryHome({
        multiplesFeatureToggles: {
          featuresListByToggleName: {
            [featureToggles.pillar.category.home.aiSummary.growTheCategory]:
              false,
            [featureToggles.pillar.category.home.aiSummary.leadTheCategory]:
              false,
          },
          togglesReady: true,
        },
      });

      expect(
        screen.queryByTestId('ai-summary-big-number-spark-line-card'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AI Summary when togglesReady is false', () => {
      renderCategoryHome({
        multiplesFeatureToggles: {
          featuresListByToggleName: {
            [featureToggles.pillar.category.home.aiSummary.growTheCategory]:
              true,
            [featureToggles.pillar.category.home.aiSummary.leadTheCategory]:
              true,
          },
          togglesReady: false,
        },
      });

      expect(
        screen.queryByTestId('ai-summary-big-number-spark-line-card'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AI Summary when category home content is disabled', () => {
      renderCategoryHome({ featureToggle: [false, false] });

      expect(
        screen.queryByTestId('ai-summary-big-number-spark-line-card'),
      ).not.toBeInTheDocument();
    });

    it('should NOT render AI Summary when category home content is still loading', () => {
      renderCategoryHome({ featureToggle: [true, true] });

      expect(
        screen.queryByTestId('ai-summary-big-number-spark-line-card'),
      ).not.toBeInTheDocument();
    });
  });
});
