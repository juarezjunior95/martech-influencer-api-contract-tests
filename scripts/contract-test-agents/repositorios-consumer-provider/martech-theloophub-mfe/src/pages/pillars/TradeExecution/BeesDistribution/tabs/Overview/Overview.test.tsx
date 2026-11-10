import { render, screen } from '@testing-library/react';

import { mockBeesDistributionKpiData } from '../../__mocks';
import { BeesDistributionKpiData } from '../../types';
import { Overview } from './Overview';

const mockUseCurrentPage = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUseBffData = jest.fn();
const mockUseFeatureToggle = jest.fn();

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => {
      const messages: Record<string, string> = {
        'TradeExecution.BeesDistribution.title': 'BEES Distribution',
      };
      return messages[id] ?? id;
    },
  }),
}));

jest.mock('hooks', () => ({
  useCurrentPage: () => mockUseCurrentPage(),
  usePageFilterApplied: (page: string) => mockUsePageFilterApplied(page),
  useBffData: (params: unknown) => mockUseBffData(params),
  useFeatureToggle: (...args: unknown[]) => mockUseFeatureToggle(...args),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    header,
    children,
    dataTestId,
  }: {
    header: {
      title: string;
      tooltipBackgroundTransparent?: boolean;
      titleSize?: string;
      rightContent?: React.ReactNode;
    };
    children: React.ReactNode;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId || 'basic-container'}>
      <div data-testid="header-title">{header.title}</div>
      <div data-testid="header-title-size">{header.titleSize}</div>
      <div data-testid="header-right-content">{header.rightContent}</div>
      {children}
    </div>
  ),
  CountryFlag: () => <div data-testid="country-flag">CountryFlag</div>,
  Legend: ({
    caption,
    dataTestId,
    legendPosition,
  }: {
    caption: unknown[];
    dataTestId?: string;
    legendPosition?: string;
  }) => (
    <div
      data-testid={dataTestId || 'legend'}
      data-legend-position={legendPosition}
      data-caption-count={caption?.length || 0}
    >
      Legend
    </div>
  ),
  Skeleton: ({
    width,
    height,
    length,
    borderRadius,
    dataTestId,
  }: {
    width: string;
    height: string;
    length: number;
    borderRadius: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'skeleton'}
      data-width={width}
      data-height={height}
      data-length={length}
      data-border-radius={borderRadius}
    >
      Skeleton
    </div>
  ),
}));

jest.mock('../../components/ChartItem/ChartItem', () => ({
  ChartItem: ({
    kpi,
    dataTestId,
  }: {
    kpi: BeesDistributionKpiData;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'chart-item'}
      data-kpi-header={kpi?.header?.title}
    >
      ChartItem
    </div>
  ),
}));

jest.mock('./Overview.styles', () => ({
  StyledOverviewContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'styled-overview-container'}>
      {children}
    </div>
  ),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      tradeExecution: {
        submenus: {
          beesDistribution: {
            tab: {
              overview: {
                aiSummary: 'ai_summary_bees_distribution_overview',
              },
            },
          },
        },
      },
    },
  },
}));

jest.mock('pages/components/AISummary', () => ({
  AISummaryAlert: ({
    pageName,
    kpiGroup,
    dataTestId,
    subFilters,
  }: {
    pageName: string;
    kpiGroup: string;
    dataTestId?: string;
    subFilters?: { scope: string };
  }) => (
    <div
      data-testid={dataTestId ?? 'ai-summary'}
      data-page-name={pageName}
      data-kpi-group={kpiGroup}
      data-scope={subFilters?.scope}
    />
  ),
}));

const mockKpiData = mockBeesDistributionKpiData.total_distribution;

describe('Overview', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCurrentPage.mockReturnValue({
      currentPage: 'bees-distribution',
    });

    mockUsePageFilterApplied.mockReturnValue({
      applied: {
        zone: 'zone1',
        country: 'BR',
        distribution_scopes: 'scope1',
      },
    });

    mockUseBffData.mockReturnValue({
      loading: false,
      data: {
        kpi1: mockKpiData,
        kpi2: mockKpiData,
      },
      error: null,
      refetch: jest.fn(),
    });

    mockUseFeatureToggle.mockReturnValue([true, false]);
  });

  describe('Rendering', () => {
    it('should render overview with data-testid', () => {
      render(<Overview dataTestId="test-id" />);

      expect(
        screen.getByTestId('tabpanel-overview-test-id'),
      ).toBeInTheDocument();
    });

    it('should render BasicContainer', () => {
      render(<Overview dataTestId="test-id" />);

      expect(
        screen.getByTestId('test-id-tabpanel-overview'),
      ).toBeInTheDocument();
    });

    it('should render BasicContainer with correct header', () => {
      render(<Overview dataTestId="test-id" />);

      expect(screen.getByTestId('header-title')).toHaveTextContent(
        'BEES Distribution',
      );
      expect(screen.getByTestId('header-title-size')).toHaveTextContent('H2');
    });

    it('should render CountryFlag in header', () => {
      render(<Overview dataTestId="test-id" />);

      expect(screen.getByTestId('country-flag')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should render skeletons when loading', () => {
      mockUseBffData.mockReturnValue({
        loading: true,
        data: null,
        error: null,
        refetch: jest.fn(),
      });

      render(<Overview dataTestId="test-id" />);

      expect(
        screen.getByTestId('test-id-tabpanel-overview-content-skeleton'),
      ).toBeInTheDocument();
    });

    it('should render all skeleton items when loading', () => {
      mockUseBffData.mockReturnValue({
        loading: true,
        data: null,
        error: null,
        refetch: jest.fn(),
      });

      render(<Overview dataTestId="test-id" />);

      expect(
        screen.getByTestId('test-id-tabpanel-overview-content-skeleton-item-1'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-id-tabpanel-overview-content-skeleton-item-2'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-id-tabpanel-overview-content-skeleton-item-3'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-id-tabpanel-overview-content-skeleton-item-4'),
      ).toBeInTheDocument();
    });
  });

  describe('Data state', () => {
    it('should render Legend when data is loaded', () => {
      render(<Overview dataTestId="test-id" />);

      expect(
        screen.getByTestId('test-id-tabpanel-overview-content-legend-legend'),
      ).toBeInTheDocument();
    });

    it('should pass legend data to Legend component', () => {
      render(<Overview dataTestId="test-id" />);

      const legend = screen.getByTestId(
        'test-id-tabpanel-overview-content-legend-legend',
      );
      expect(legend).toHaveAttribute('data-legend-position', 'left');
      expect(legend).toHaveAttribute('data-caption-count', '2');
    });

    it('should render ChartItem for each KPI', () => {
      render(<Overview dataTestId="test-id" />);

      expect(screen.getByTestId('test-id-kpi1')).toBeInTheDocument();
      expect(screen.getByTestId('test-id-kpi2')).toBeInTheDocument();
    });
  });

  describe('Hooks integration', () => {
    it('should call usePageFilterApplied with current page', () => {
      mockUseCurrentPage.mockReturnValue({
        currentPage: 'bees-distribution',
      });

      render(<Overview dataTestId="test-id" />);

      expect(mockUsePageFilterApplied).toHaveBeenCalledWith(
        'bees-distribution',
      );
    });

    it('should call useBffData with correct params', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          zone: 'zone1',
          country: 'BR',
          distribution_scopes: 'scope1',
        },
      });

      render(<Overview dataTestId="test-id" />);

      expect(mockUseBffData).toHaveBeenCalledWith({
        id: 'trade-execution_bees-distribution_overview',
        kpiGroup: 'bees-distribution',
        subFilters: {
          zone: 'zone1',
          country: 'BR',
          scope: 'scope1',
        },
        skipMainFilters: true,
        skipRequest: false,
      });
    });

    it('should skip request when distribution_scopes is not applied', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: {
          zone: 'zone1',
          country: 'BR',
          distribution_scopes: undefined,
        },
      });

      render(<Overview dataTestId="test-id" />);

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          skipRequest: true,
        }),
      );
    });
  });

  describe('Edge cases', () => {
    it('should handle null data', () => {
      mockUseBffData.mockReturnValue({
        loading: false,
        data: null,
        error: null,
        refetch: jest.fn(),
      });

      render(<Overview dataTestId="test-id" />);

      expect(
        screen.getByTestId('test-id-tabpanel-overview-content-legend'),
      ).toBeInTheDocument();
    });

    it('should handle data with empty legend', () => {
      const kpiWithoutLegend = {
        ...mockKpiData,
        legend: [],
      };

      mockUseBffData.mockReturnValue({
        loading: false,
        data: {
          kpi1: kpiWithoutLegend,
        },
        error: null,
        refetch: jest.fn(),
      });

      render(<Overview dataTestId="test-id" />);

      const legend = screen.getByTestId(
        'test-id-tabpanel-overview-content-legend-legend',
      );
      expect(legend).toHaveAttribute('data-caption-count', '0');
    });
  });

  describe('Overview - AI Summary feature toggle', () => {
    beforeEach(() => {
      jest.clearAllMocks();

      mockUseBffData.mockReturnValue({
        data: null,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });
      mockUseCurrentPage.mockReturnValue({ currentPage: 'bees-distribution' });
    });

    it('should render AISummary when feature toggle is enabled and not loading', () => {
      mockUseFeatureToggle.mockReturnValue([true, false]);

      render(<Overview dataTestId="test" />);

      expect(
        screen.getByTestId('test-tabpanel-overview-ai-summary'),
      ).toBeInTheDocument();
    });

    it('should not render AISummary when feature toggle is disabled', () => {
      mockUseFeatureToggle.mockReturnValue([false, false]);

      render(<Overview dataTestId="test" />);

      expect(
        screen.queryByTestId('test-tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should not render AISummary when feature toggle is still loading', () => {
      mockUseFeatureToggle.mockReturnValue([true, true]);

      render(<Overview dataTestId="test" />);

      expect(
        screen.queryByTestId('test-tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should not render AISummary when feature toggle is undefined (not resolved yet)', () => {
      mockUseFeatureToggle.mockReturnValue([undefined, true]);

      render(<Overview dataTestId="test" />);

      expect(
        screen.queryByTestId('test-tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should pass currentPage as pageName to AISummary', () => {
      mockUseFeatureToggle.mockReturnValue([true, false]);
      mockUseCurrentPage.mockReturnValue({
        currentPage: 'custom-bees-page',
      });

      render(<Overview dataTestId="test" />);

      const aiSummary = screen.getByTestId('test-tabpanel-overview-ai-summary');
      expect(aiSummary).toHaveAttribute('data-page-name', 'custom-bees-page');
    });

    it('should pass kpiGroup="bees-distribution" to AISummary', () => {
      mockUseFeatureToggle.mockReturnValue([true, false]);

      render(<Overview dataTestId="test" />);

      const aiSummary = screen.getByTestId('test-tabpanel-overview-ai-summary');
      expect(aiSummary).toHaveAttribute('data-kpi-group', 'bees-distribution');
    });

    it('should still render content area when AI Summary toggle is disabled', () => {
      mockUseFeatureToggle.mockReturnValue([false, false]);

      render(<Overview dataTestId="test" />);

      expect(
        screen.getByTestId('test-tabpanel-overview-content'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('test-tabpanel-overview-ai-summary'),
      ).not.toBeInTheDocument();
    });

    it('should render AISummary alongside data content when toggle is enabled and data is loaded', () => {
      mockUseFeatureToggle.mockReturnValue([true, false]);
      mockUseBffData.mockReturnValue({
        data: {
          total_distribution: {
            legend: [{ label: 'Test', color: '#000' }],
          },
        },
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<Overview dataTestId="test" />);

      expect(
        screen.getByTestId('test-tabpanel-overview-ai-summary'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-tabpanel-overview-content-legend'),
      ).toBeInTheDocument();
    });

    it('should render AISummary alongside skeleton when toggle is enabled and data is loading', () => {
      mockUseFeatureToggle.mockReturnValue([true, false]);
      mockUseBffData.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        refetch: jest.fn(),
      });

      render(<Overview dataTestId="test" />);

      expect(
        screen.getByTestId('test-tabpanel-overview-ai-summary'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('test-tabpanel-overview-content-skeleton'),
      ).toBeInTheDocument();
    });
  });
});
