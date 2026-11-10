import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConnectionsCreativityHome } from './ConnectionsCreativityHome';

jest.mock(
  'assets/img/ConnectionsCreativityOverview/abi_connect.png',
  () => 'abi_connect.png',
);
jest.mock(
  'assets/img/ConnectionsCreativityOverview/abi_connect_qrcode.png',
  () => 'abi_connect_qrcode.png',
);
jest.mock(
  'assets/img/ConnectionsCreativityOverview/creative_development.png',
  () => 'creative_development.png',
);

const connectionsCreativityHomeMessages: Record<string, string> = {
  'Pillars.connectionsCreativity': '5. Connections & Creativity',
  'Pillars.sidebar.connectionsCreativity': '5. Connections & Creativity',
  'Pillars.pageName.connectionsCreativity': '5. Connections & Creativity',
  'ConnectionsCreativity.Home.pageSubtitle':
    'Connect with consumers effectively and use creativity to solve consumer & business problems',
  'ConnectionsCreativity.Home.breadcrumbPageName': 'Connections & Creativity',
  'ConnectionsCreativity.Home.howWeDoIt': 'How We Do It',
  'ConnectionsCreativity.Home.mediaEffectiveness': 'Media Effectiveness',
  'ConnectionsCreativity.Home.businessEfficiency': 'Business Efficiency',
  'ConnectionsCreativity.Home.resourceAllocation.title':
    '5.1 - Resource Allocation',
  'ConnectionsCreativity.Home.resourceAllocation.description':
    'Design Connections plans in accordance with media best practices & resource allocation guidelines',
  'ConnectionsCreativity.Home.creativeDevelopment.title':
    '5.2 - Creative Development',
  'ConnectionsCreativity.Home.creativeDevelopment.description':
    'Develop Creative through a cross-functional briefing and assessment process, supported by our CreativeX ecosystem',
  'ConnectionsCreativity.Home.creativeDevelopment.alt': 'Creative Development',
  'ConnectionsCreativity.Home.abiConnect.title': '5.3 - ABI Connect',
  'ConnectionsCreativity.Home.abiConnect.description':
    'Execute digital components following the Social & Influencers process, leveraging ABI Connect to monitor & adjust',
  'ConnectionsCreativity.Home.abiConnect.alt': 'ABI Connect',
};

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) =>
      connectionsCreativityHomeMessages[id] ?? id,
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockUseFeatureToggle = jest.fn();
const mockUseMediaQuery = jest.fn();
const mockUseBffData = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockSetSubFilterValue = jest.fn();

jest.mock('hooks', () => ({
  useFeatureToggle: (name: string) => mockUseFeatureToggle(name),
  useMediaQuery: (q: string) => mockUseMediaQuery(q),
  useSubFilters: () => ({ setSubFilterValue: mockSetSubFilterValue }),
  usePageFilterApplied: (pageName: string) =>
    mockUsePageFilterApplied(pageName),
  useBffData: (props: unknown) => mockUseBffData(props),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header?: { title: string; titleSize?: string };
  }) => (
    <div
      data-testid="basic-container"
      data-title-size={header?.titleSize ?? ''}
    >
      {header?.title && <h2 data-testid="section-title">{header.title}</h2>}
      {children}
    </div>
  ),
  BigNumber: ({
    children,
    onClick,
    data,
    size,
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    data?: unknown;
    size?: string;
  }) => (
    <button
      type="button"
      data-testid="big-number"
      data-size={size ?? ''}
      data-bignumber={JSON.stringify(data ?? [])}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  ChartHeader: () => <div data-testid="chart-header">ChartHeader</div>,
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
    onClick,
    loading,
    error,
    data,
  }: {
    containerTitle: string;
    onClick?: () => void;
    loading?: boolean;
    error?: unknown;
    data?: unknown;
  }) => (
    <button
      type="button"
      data-testid="big-number-sparkline-card"
      data-title={containerTitle}
      data-loading={loading ?? false}
      data-error={error ? 'true' : 'false'}
      data-has-data={data ? 'true' : 'false'}
      onClick={onClick}
    >
      BigNumberSparkLineCard
    </button>
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

jest.mock('./ConnectionsCreativityHome.styles', () => ({
  StyledAbiConnectContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="abi-connect-content">{children}</div>
  ),
  StyledAbiConnectImage: (props: { src: string; alt: string }) => (
    <img data-testid="abi-connect-image" alt={props.alt} src={props.src} />
  ),
  StyledAbiConnectQrcodeImage: (props: { src: string; alt: string }) => (
    <img
      data-testid="abi-connect-qrcode-image"
      alt={props.alt}
      src={props.src}
    />
  ),
  StyledCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="cards-grid">{children}</div>
  ),
  StyledHowWeDoItImage: (props: { src: string; alt: string }) => (
    <img data-testid="how-we-do-it-image" alt={props.alt} src={props.src} />
  ),
  StyledSubPillarCardsGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sub-pillar-cards-grid">{children}</div>
  ),
}));

const mockBigNumbersTrendData = [
  { chartTitle: 'Media Spend', value: 1000, trend: 5 },
  { chartTitle: 'Non-Working Money', value: 200, trend: -3 },
];

const mockResourceAllocationData = {
  megabrandsQwoaBigNumber: {
    title: 'Megabrands QWoA',
    period: 'YTD',
    bigNumberData: [{ value: 850, label: 'Megabrands' }],
  },
  campaignsQwoaBigNumber: {
    title: 'Campaigns QWoA',
    period: 'YTD',
    bigNumberData: [{ value: 720, label: 'Campaigns' }],
  },
};

describe('ConnectionsCreativityHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFeatureToggle.mockReturnValue([true, false]);
    mockUseMediaQuery.mockReturnValue(false);
    mockUsePageFilterApplied.mockReturnValue({
      applied: { zone: undefined, country: undefined },
    });
    mockUseBffData.mockReturnValue({
      data: undefined,
      loading: false,
      error: null,
    });
  });

  describe('layout & feature toggle', () => {
    it('renders header and PillarResources regardless of feature toggle', () => {
      render(<ConnectionsCreativityHome />);

      expect(screen.getByTestId('page-header')).toHaveTextContent(
        '5. Connections & Creativity',
      );
      expect(screen.getByTestId('pillar-resources')).toHaveTextContent(
        'Connections & Creativity',
      );
    });

    it('does not render cards grid when feature toggle is disabled', () => {
      mockUseFeatureToggle.mockReturnValue([false, false]);

      render(<ConnectionsCreativityHome />);

      expect(screen.queryByTestId('cards-grid')).not.toBeInTheDocument();
    });

    it('does not render cards grid while feature toggle is loading', () => {
      mockUseFeatureToggle.mockReturnValue([undefined, true]);

      render(<ConnectionsCreativityHome />);

      expect(screen.queryByTestId('cards-grid')).not.toBeInTheDocument();
    });
  });

  describe('BFF integration', () => {
    it('passes applied zone/country as subFilters to useBffData', () => {
      mockUsePageFilterApplied.mockReturnValue({
        applied: { zone: 'LATAM', country: 'BR' },
      });

      render(<ConnectionsCreativityHome />);

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'connections-and-creativity_home_home',
          kpiGroup: 'media',
          subFilters: { zone: 'LATAM', country: 'BR' },
        }),
      );
    });

    it('maps "Media Spend" to Media Effectiveness card and "Non-Working Money" to Business Efficiency', () => {
      mockUseBffData.mockReturnValue({
        data: {
          'connections-and-creativity-home-big-numbers-trend':
            mockBigNumbersTrendData,
        },
        loading: false,
        error: null,
      });

      render(<ConnectionsCreativityHome />);

      const sparklineCards = screen.getAllByTestId('big-number-sparkline-card');
      expect(sparklineCards[0]).toHaveAttribute(
        'data-title',
        'Media Effectiveness',
      );
      expect(sparklineCards[0]).toHaveAttribute('data-has-data', 'true');
      expect(sparklineCards[1]).toHaveAttribute(
        'data-title',
        'Business Efficiency',
      );
      expect(sparklineCards[1]).toHaveAttribute('data-has-data', 'true');
    });
  });

  describe('responsive layout', () => {
    it('uses titleSize H2 and size medium in desktop large', () => {
      mockUseMediaQuery.mockReturnValue(true);
      mockUseBffData.mockReturnValue({
        data: {
          'connections-and-creativity-home-resource-allocation':
            mockResourceAllocationData,
        },
        loading: false,
        error: null,
      });

      render(<ConnectionsCreativityHome />);

      expect(screen.getByTestId('basic-container')).toHaveAttribute(
        'data-title-size',
        'H2',
      );
      expect(screen.getAllByTestId('big-number')[0]).toHaveAttribute(
        'data-size',
        'medium',
      );
    });

    it('uses titleSize H3 and size small in smaller viewport', () => {
      mockUseBffData.mockReturnValue({
        data: {
          'connections-and-creativity-home-resource-allocation':
            mockResourceAllocationData,
        },
        loading: false,
        error: null,
      });

      render(<ConnectionsCreativityHome />);

      expect(screen.getByTestId('basic-container')).toHaveAttribute(
        'data-title-size',
        'H3',
      );
      expect(screen.getAllByTestId('big-number')[0]).toHaveAttribute(
        'data-size',
        'small',
      );
    });
  });

  describe('navigation', () => {
    it.each([
      ['Media Effectiveness', 0],
      ['Business Efficiency', 1],
    ])(
      'navigates to resource-allocation when clicking %s sparkline card',
      async (cardName, index) => {
        render(<ConnectionsCreativityHome />);

        const sparklineCards = screen.getAllByTestId(
          'big-number-sparkline-card',
        );
        await userEvent.click(sparklineCards[index]);

        expect(mockNavigate).toHaveBeenCalledWith(
          '/connections-creativity/resource-allocation-media/resource-allocation',
        );
      },
    );

    it('applies kpi media_qwoa and navigates to media-drilldown when clicking megabrands BigNumber', async () => {
      mockUseBffData.mockReturnValue({
        data: {
          'connections-and-creativity-home-resource-allocation':
            mockResourceAllocationData,
        },
        loading: false,
        error: null,
      });

      render(<ConnectionsCreativityHome />);

      await userEvent.click(screen.getAllByTestId('big-number')[0]);

      expect(mockSetSubFilterValue).toHaveBeenCalledWith('kpis', 'media_qwoa');
      expect(mockNavigate).toHaveBeenCalledWith(
        '/connections-creativity/resource-allocation-media/media-drilldown',
      );
    });

    it('applies kpi campaign_qwoa and navigates to media-drilldown when clicking campaigns BigNumber', async () => {
      mockUseBffData.mockReturnValue({
        data: {
          'connections-and-creativity-home-resource-allocation':
            mockResourceAllocationData,
        },
        loading: false,
        error: null,
      });

      render(<ConnectionsCreativityHome />);

      await userEvent.click(screen.getAllByTestId('big-number')[1]);

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'kpis',
        'campaign_qwoa',
      );
      expect(mockNavigate).toHaveBeenCalledWith(
        '/connections-creativity/resource-allocation-media/media-drilldown',
      );
    });
  });
});
