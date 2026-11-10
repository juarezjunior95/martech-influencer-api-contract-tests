import { render, screen } from '@testing-library/react';

import { ResourceAllocationMedia } from './ResourceAllocationMedia';

const resourceAllocationMediaMessages: Record<string, string> = {
  'Pillars.pageName.connectionsCreativity': '5. Connections & Creativity',
  'Sidebar.resourceAllocationMedia': 'Resource Allocation & Media',
};

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) =>
      resourceAllocationMediaMessages[id] ?? id,
  }),
}));

const mockUseMultiplesFeatureToggles = jest.fn();
let mockFeaturesListByToggleName: Record<string, boolean> = {};
let mockTogglesReady = true;

jest.mock('hooks', () => ({
  useMultiplesFeatureToggles: (...args: unknown[]) =>
    mockUseMultiplesFeatureToggles(...args),
}));

jest.mock('components', () => ({
  TabsWithFilters: ({
    dataTestId,
    filter,
    tabConfig,
    breadcrumbsList,
  }: {
    dataTestId?: string;
    filter?: { pageName: string; visibleFields?: string[] };
    tabConfig: {
      tabs: Array<{
        id: string;
        label: string;
        content: any;
        disabled: boolean;
      }>;
      baseRoute: string;
    };
    breadcrumbsList?: Array<{ href: string; pageName: string }>;
  }) => (
    <div
      data-testid={dataTestId || 'tabs-with-filters'}
      data-preset-id={filter?.pageName ?? ''}
      data-base-route={tabConfig.baseRoute}
      data-visible-fields={filter?.visibleFields?.join(',') ?? ''}
      data-breadcrumbs-count={breadcrumbsList?.length ?? 0}
    >
      <div data-testid="tabs-container">
        {tabConfig.tabs.map((tab) => (
          <div
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            data-disabled={tab.disabled}
            data-label={tab.label}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('./tabs', () => ({
  Overview: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'overview-component'}>Overview</div>
  ),
  ResourceAllocation: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'resource-allocation-component'}>
      Resource Allocation
    </div>
  ),
  InvestmentBreakdown: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'investment-breakdown-component'}>
      Investment Breakdown
    </div>
  ),
}));

jest.mock('./tabs/CampaignDeepDive/CampaignDeepDive', () => ({
  CampaignDeepDive: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'campaign-deep-dive-component'}>
      Campaign Deep Dive
    </div>
  ),
}));

jest.mock('./tabs/MediaDrilldoown/MediaDrilldoown', () => ({
  MediaDrilldoown: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'media-drilldown-component'}>
      Media Drilldown
    </div>
  ),
}));

describe('ResourceAllocationMedia', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockTogglesReady = true;
    mockFeaturesListByToggleName = {
      tab_resource_allocation_media_overview: true,
      tab_resource_allocation_media_media_drilldoown: true,
      tab_resource_allocation_media_campaign_deep_dive: true,
      tab_resource_allocation_media_resource_allocation: true,
      tab_resource_allocation_media_investment_breakdown: true,
    };

    mockUseMultiplesFeatureToggles.mockImplementation(() => ({
      featuresListByToggleName: mockFeaturesListByToggleName,
      togglesReady: mockTogglesReady,
    }));
  });

  describe('loading state', () => {
    it('renders empty fragment when toggles are not ready', () => {
      mockTogglesReady = false;

      const { container } = render(<ResourceAllocationMedia />);

      expect(container.firstChild).toBeNull();
      expect(
        screen.queryByTestId('resource-allocation-media'),
      ).not.toBeInTheDocument();
    });

    it('renders TabsWithFilters when toggles are ready', () => {
      render(<ResourceAllocationMedia />);

      expect(
        screen.getByTestId('resource-allocation-media'),
      ).toBeInTheDocument();
    });
  });

  describe('TabsWithFilters configuration', () => {
    it('renders with correct page name and visible fields', () => {
      render(<ResourceAllocationMedia />);

      const root = screen.getByTestId('resource-allocation-media');
      expect(root).toHaveAttribute(
        'data-preset-id',
        'connections-creativity_media-campaign-results',
      );
      expect(root).toHaveAttribute(
        'data-visible-fields',
        'zone,country,time_frame',
      );
    });

    it('renders with correct base route', () => {
      render(<ResourceAllocationMedia />);

      expect(screen.getByTestId('resource-allocation-media')).toHaveAttribute(
        'data-base-route',
        '/connections-creativity/resource-allocation-media',
      );
    });

    it('renders with correct breadcrumbs', () => {
      render(<ResourceAllocationMedia />);

      expect(screen.getByTestId('resource-allocation-media')).toHaveAttribute(
        'data-breadcrumbs-count',
        '2',
      );
    });
  });

  describe('feature toggles', () => {
    it.each([
      ['overview', 'tab_resource_allocation_media_overview', 'Overview'],
      [
        'media-drilldown',
        'tab_resource_allocation_media_media_drilldoown',
        'Media Drilldown',
      ],
      [
        'campaign-deep-dive',
        'tab_resource_allocation_media_campaign_deep_dive',
        'Campaign Deep Dive',
      ],
      [
        'resource-allocation',
        'tab_resource_allocation_media_resource_allocation',
        'Resource Allocation',
      ],
      [
        'investment-breakdown',
        'tab_resource_allocation_media_investment_breakdown',
        'Investment Breakdown',
      ],
    ])(
      'disables %s tab when feature toggle is false',
      (tabId, toggleId, label) => {
        mockFeaturesListByToggleName[toggleId] = false;

        render(<ResourceAllocationMedia />);

        expect(screen.getByTestId(`tab-${tabId}`)).toHaveAttribute(
          'data-disabled',
          'true',
        );
        expect(screen.getByTestId(`tab-${tabId}`)).toHaveAttribute(
          'data-label',
          label,
        );
      },
    );

    it('enables all tabs when all feature toggles are true', () => {
      render(<ResourceAllocationMedia />);

      expect(screen.getByTestId('tab-overview')).toHaveAttribute(
        'data-disabled',
        'false',
      );
      expect(screen.getByTestId('tab-media-drilldown')).toHaveAttribute(
        'data-disabled',
        'false',
      );
      expect(screen.getByTestId('tab-campaign-deep-dive')).toHaveAttribute(
        'data-disabled',
        'false',
      );
      expect(screen.getByTestId('tab-resource-allocation')).toHaveAttribute(
        'data-disabled',
        'false',
      );
      expect(screen.getByTestId('tab-investment-breakdown')).toHaveAttribute(
        'data-disabled',
        'false',
      );
    });
  });

  describe('tab panels', () => {
    it.each([
      ['tabpanel-overview', 'Overview'],
      ['tabpanel-media-drilldown', 'Media Drilldown'],
      ['tabpanel-campaign-deep-dive', 'Campaign Deep Dive'],
      ['tabpanel-resource-allocation', 'Resource Allocation'],
      ['tabpanel-investment-breakdown', 'Investment Breakdown'],
    ])('renders %s panel with correct content', (testId, content) => {
      render(<ResourceAllocationMedia />);

      const panel = screen.getByTestId(testId);
      expect(panel).toBeInTheDocument();
      expect(panel).toHaveTextContent(content);
    });

    it('maintains correct hierarchy for all panels', () => {
      render(<ResourceAllocationMedia />);

      const root = screen.getByTestId('resource-allocation-media');
      const panels = [
        'tabpanel-overview',
        'tabpanel-media-drilldown',
        'tabpanel-campaign-deep-dive',
        'tabpanel-resource-allocation',
        'tabpanel-investment-breakdown',
      ];

      panels.forEach((panelId) => {
        expect(root).toContainElement(screen.getByTestId(panelId));
      });
    });
  });
});
