import React from 'react';

import { render, screen } from '@testing-library/react';
import { useMultiplesFeatureToggles } from 'hooks';
import { createTab } from 'utils/tab';

import { Innovation } from './Innovation';

jest.mock('react-intl', () => ({
  IntlProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  useIntl: () => ({
    formatMessage: jest.fn(({ id }) => id),
  }),
}));

jest.mock('hooks', () => ({
  useMultiplesFeatureToggles: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Navigate: ({ to }: { to: string }) => (
    <div data-testid="navigate-component" data-to={to} />
  ),
}));

interface MockTabsWithFiltersProps {
  filter: {
    pageName?: string;
    visibleFields?: string[];
    hidden?: boolean;
  };
  tabConfig: {
    tabs: Array<{
      id: string;
      label: string;
      content: React.ReactNode;
      disabled?: boolean;
    }>;
    baseRoute: string;
    onTabChange?: (tabId: string) => void;
  };
  dataTestId?: string;
}

jest.mock('components/TabsWithFilters/TabsWithFilters', () => ({
  TabsWithFilters: ({
    filter,
    tabConfig,
    dataTestId,
  }: MockTabsWithFiltersProps) => (
    <div
      data-testid={dataTestId || filter.pageName}
      data-page-name={filter.pageName}
      data-base-route={tabConfig.baseRoute}
      data-filter-visible-fields={JSON.stringify(filter.visibleFields)}
    >
      <div data-testid="tabs-content">
        {tabConfig.tabs.map((tab, index: number) => (
          <div
            key={tab.id}
            data-testid={`tab-${index}`}
            data-tab-id={tab.id}
            data-tab-label={tab.label}
            data-tab-disabled={tab.disabled}
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
    <div data-testid={dataTestId || 'overview-component'}>Overview Content</div>
  ),
  PerformanceAndBreakdown: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId || 'performance-and-breakdown-component'}>
      Performance And Breakdown Content
    </div>
  ),
}));

jest.mock('utils/tab', () => ({
  createTab: jest.fn((id, label, content, disabled) => ({
    id,
    label,
    content,
    disabled,
  })),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      category: {
        submenus: {
          posBook: { id: 'submenu_pos' },
          categoryHealth: { id: 'submenu_category_health' },
        },
      },
      consumer: {
        submenus: {
          audienceTargeting: { id: 'submenu_audience_targeting' },
        },
      },
      portfolioBrand: {
        submenus: {
          portfolioPerformance: { id: 'submenu_portfolio_performance' },
          brandAnalysis: { id: 'submenu_brand_analysis' },
          brandPowerBook: { id: 'submenu_brand_power_book' },
          brandPowerBookExport: { id: 'submenu_brand_power_book_export' },
          pnl: { id: 'submenu_country_brand_and_portfolio_pl' },
        },
      },
      innovation: {
        submenus: {
          innovation: {
            id: 'submenu_innovation',
            tab: {
              overview: { id: 'innovation-overview-toggle' },
              performanceAndBreakdown: {
                id: 'innovation-performance-and-breakdown-toggle',
              },
            },
          },
          innovationHub: { id: 'innovation-hub-toggle' },
        },
      },
      connectionsAndCreativity: {
        submenus: {
          resourceAllocationMedia: {
            id: 'submenu_resource_allocation_media',
          },
        },
      },
      tradeExecution: {
        submenus: {
          beesDistribution: { id: 'submenu_bees-distribution' },
        },
      },
      valueCreation: {
        submenus: {
          commercialResults: { id: 'submenu_commercial_results' },
          growthLeague: { id: 'submenu_growth_league' },
          volumePages: { id: 'submenu_volume_page' },
        },
      },
    },
  },
}));

const togglesBothEnabled = {
  featuresListByToggleName: {
    'innovation-overview-toggle': true,
    'innovation-performance-and-breakdown-toggle': true,
    'innovation-hub-toggle': false,
  },
  togglesReady: true,
};

const useMultiplesFeatureTogglesMock = useMultiplesFeatureToggles as jest.Mock;
const createTabMock = createTab as jest.Mock;

describe('Innovation Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createTabMock.mockImplementation((id, label, content, disabled) => ({
      id,
      label,
      content,
      disabled,
    }));
    useMultiplesFeatureTogglesMock.mockReturnValue(togglesBothEnabled);
  });

  it('should render without errors when toggles are ready', () => {
    render(<Innovation />);

    expect(screen.getByTestId('innovation')).toBeInTheDocument();
  });

  it('should render empty component when toggles are not ready', () => {
    useMultiplesFeatureTogglesMock.mockReturnValue({
      featuresListByToggleName: {},
      togglesReady: false,
    });

    render(<Innovation />);

    expect(screen.queryByTestId('innovation')).not.toBeInTheDocument();
    expect(screen.queryByTestId('tabpanel-overview')).not.toBeInTheDocument();
  });

  it('should pass correct props to TabsPageWithFilters', () => {
    render(<Innovation />);

    const tabsPageComponent = screen.getByTestId('innovation');

    expect(tabsPageComponent).toHaveAttribute(
      'data-page-name',
      'innovation_innovation',
    );
    expect(tabsPageComponent).toHaveAttribute(
      'data-base-route',
      '/innovation/innovation',
    );

    const visibleFields = JSON.parse(
      tabsPageComponent.dataset.filterVisibleFields || '[]',
    );
    expect(visibleFields).toEqual(['zone', 'country', 'time_frame']);
  });

  it('should create overview tab with correct parameters', () => {
    render(<Innovation />);

    expect(createTabMock).toHaveBeenCalledWith(
      'overview',
      'Overview',
      expect.anything(),
      false,
    );

    expect(screen.getByTestId('tab-0')).toBeInTheDocument();
    expect(screen.getByTestId('tab-0')).toHaveAttribute(
      'data-tab-id',
      'overview',
    );
    expect(screen.getByTestId('tab-0')).toHaveAttribute(
      'data-tab-label',
      'Overview',
    );
    expect(screen.getByTestId('tab-0')).toHaveAttribute(
      'data-tab-disabled',
      'false',
    );
    expect(screen.getByTestId('tabpanel-overview')).toBeInTheDocument();
  });

  it('should disable overview tab when feature toggle is disabled', () => {
    useMultiplesFeatureTogglesMock.mockReturnValue({
      featuresListByToggleName: {
        'innovation-overview-toggle': false,
        'innovation-performance-and-breakdown-toggle': true,
      },
      togglesReady: true,
    });

    render(<Innovation />);

    expect(createTabMock).toHaveBeenCalledWith(
      'overview',
      'Overview',
      expect.anything(),
      true,
    );

    expect(screen.getByTestId('tab-0')).toHaveAttribute(
      'data-tab-disabled',
      'true',
    );
  });

  it('should call useMultiplesFeatureToggles with correct feature toggle', () => {
    render(<Innovation />);

    expect(useMultiplesFeatureTogglesMock).toHaveBeenCalledWith([
      'innovation-overview-toggle',
      'innovation-performance-and-breakdown-toggle',
      'innovation-hub-toggle',
    ]);
  });

  it('should handle empty featuresListByToggleName', () => {
    useMultiplesFeatureTogglesMock.mockReturnValue({
      featuresListByToggleName: {},
      togglesReady: true,
    });

    render(<Innovation />);

    expect(screen.getByTestId('innovation')).toBeInTheDocument();
    expect(screen.getByTestId('tab-0')).toHaveAttribute(
      'data-tab-disabled',
      'true',
    );
  });

  describe('innovationHub toggle', () => {
    it('should redirect to innovation-performance when innovationHub toggle is ON', () => {
      useMultiplesFeatureTogglesMock.mockReturnValue({
        featuresListByToggleName: {
          'innovation-overview-toggle': true,
          'innovation-performance-and-breakdown-toggle': true,
          'innovation-hub-toggle': true,
        },
        togglesReady: true,
      });

      render(<Innovation />);

      const nav = screen.getByTestId('navigate-component');
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveAttribute(
        'data-to',
        '/innovation/innovation-performance/overview',
      );
      expect(screen.queryByTestId('innovation')).not.toBeInTheDocument();
    });

    it('should render legacy TabsWithFilters when innovationHub toggle is OFF', () => {
      useMultiplesFeatureTogglesMock.mockReturnValue({
        featuresListByToggleName: {
          'innovation-overview-toggle': true,
          'innovation-performance-and-breakdown-toggle': true,
          'innovation-hub-toggle': false,
        },
        togglesReady: true,
      });

      render(<Innovation />);

      expect(screen.getByTestId('innovation')).toBeInTheDocument();
      expect(
        screen.queryByTestId('navigate-component'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render tabs container with correct structure', () => {
    render(<Innovation />);

    expect(screen.getByTestId('tabs-content')).toBeInTheDocument();
    expect(screen.getAllByTestId(/^tab-\d+$/)).toHaveLength(2);
    expect(screen.getByTestId('tab-1')).toHaveAttribute(
      'data-tab-id',
      'performance-and-breakdown',
    );
    expect(screen.getByTestId('tab-1')).toHaveAttribute(
      'data-tab-label',
      'Performance & Breakdown',
    );
    expect(
      screen.getByTestId('tabpanel-performance-and-breakdown'),
    ).toBeInTheDocument();
  });

  describe('data-testid implementation', () => {
    it('should always render with hardcoded dataTestId="innovation"', () => {
      render(<Innovation />);

      expect(screen.getByTestId('innovation')).toBeInTheDocument();
    });

    it('should pass dataTestId with tabpanel prefix to Overview tab', () => {
      render(<Innovation />);

      expect(screen.getByTestId('tabpanel-overview')).toBeInTheDocument();
    });

    it('should pass dataTestId with tabpanel prefix to PerformanceAndBreakdown tab', () => {
      render(<Innovation />);

      expect(
        screen.getByTestId('tabpanel-performance-and-breakdown'),
      ).toBeInTheDocument();
    });

    it('should maintain proper data-testid hierarchy', () => {
      render(<Innovation />);

      const container = screen.getByTestId('innovation');
      const tabsContent = screen.getByTestId('tabs-content');

      expect(container).toContainElement(tabsContent);
    });

    it('should persist data-testid attributes across rerenders', () => {
      const { rerender } = render(<Innovation />);

      expect(screen.getByTestId('innovation')).toBeInTheDocument();

      rerender(<Innovation />);

      expect(screen.getByTestId('innovation')).toBeInTheDocument();
    });
  });
});
