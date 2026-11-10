import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';

import enUS from '../../../../i18n/languages/en-US';
import { flattenObject } from '../../../../i18n/provider';
import { GrowthLeague } from './GrowthLeague';

const messages = flattenObject(enUS);

const mockFeaturesListByToggleName: Record<string, boolean> = {};
let mockTogglesReady = true;

jest.mock('hooks', () => ({
  useMultiplesFeatureToggles: () => ({
    featuresListByToggleName: mockFeaturesListByToggleName,
    togglesReady: mockTogglesReady,
  }),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      valueCreation: {
        submenus: {
          growthLeague: {
            tab: {
              overview: { id: 'growth_league_overview' },
              rank: { id: 'growth_league_rank' },
            },
          },
        },
      },
    },
  },
}));

jest.mock('components', () => ({
  TabsWithFilters: ({ filter, tabConfig, dataTestId }: any) => (
    <div
      data-testid={dataTestId || filter.pageName}
      data-page-name={filter.pageName}
      data-base-route={tabConfig.baseRoute}
    >
      <div data-testid="filters-list">{filter.pageName}</div>
      <div data-testid="tabs-container">
        {tabConfig.tabs.map((tab: any) => (
          <div
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            data-disabled={tab.disabled}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  ),
}));

const renderGrowthLeague = () =>
  render(
    <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
      <GrowthLeague />
    </IntlProvider>,
  );

describe('GrowthLeague', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTogglesReady = true;
    mockFeaturesListByToggleName['growth_league_overview'] = true;
    mockFeaturesListByToggleName['growth_league_rank'] = true;
  });

  describe('loading state', () => {
    it('renders an empty div when toggles are not ready; renders shell when ready', () => {
      mockTogglesReady = false;
      const { container, unmount } = renderGrowthLeague();
      expect(container.firstChild).toBeEmptyDOMElement();
      expect(screen.queryByTestId('growth-league')).not.toBeInTheDocument();
      unmount();

      mockTogglesReady = true;
      renderGrowthLeague();
      expect(screen.getByTestId('growth-league')).toBeInTheDocument();
    });
  });

  describe('tabs configuration', () => {
    it('renders page shell with route, both tab labels, and filter page name', () => {
      renderGrowthLeague();

      const shell = screen.getByTestId('growth-league');
      expect(shell).toHaveAttribute(
        'data-page-name',
        'value-creation_growth-league',
      );
      expect(shell).toHaveAttribute(
        'data-base-route',
        '/value-creation/growth-league',
      );
      expect(screen.getByTestId('filters-list')).toHaveTextContent(
        'value-creation_growth-league',
      );
      expect(screen.getByTestId('tab-overview')).toBeInTheDocument();
      expect(screen.getByTestId('tab-rankings')).toBeInTheDocument();
    });
  });

  describe('feature toggles', () => {
    it('disables each tab when its toggle is false and enables when true', () => {
      mockFeaturesListByToggleName['growth_league_overview'] = false;
      mockFeaturesListByToggleName['growth_league_rank'] = true;
      const { unmount } = renderGrowthLeague();
      expect(screen.getByTestId('tab-overview')).toHaveAttribute(
        'data-disabled',
        'true',
      );
      expect(screen.getByTestId('tab-rankings')).toHaveAttribute(
        'data-disabled',
        'false',
      );
      unmount();

      mockFeaturesListByToggleName['growth_league_overview'] = true;
      mockFeaturesListByToggleName['growth_league_rank'] = false;
      renderGrowthLeague();
      expect(screen.getByTestId('tab-overview')).toHaveAttribute(
        'data-disabled',
        'false',
      );
      expect(screen.getByTestId('tab-rankings')).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });

    it('disables both tabs when both toggles are false', () => {
      mockFeaturesListByToggleName['growth_league_overview'] = false;
      mockFeaturesListByToggleName['growth_league_rank'] = false;

      renderGrowthLeague();

      expect(screen.getByTestId('tab-overview')).toHaveAttribute(
        'data-disabled',
        'true',
      );
      expect(screen.getByTestId('tab-rankings')).toHaveAttribute(
        'data-disabled',
        'true',
      );
    });
  });

  describe('data-testid', () => {
    it('exposes growth-league test id only when toggles are ready', () => {
      mockTogglesReady = true;
      const { unmount } = renderGrowthLeague();
      expect(screen.getByTestId('growth-league')).toBeInTheDocument();
      unmount();

      mockTogglesReady = false;
      renderGrowthLeague();
      expect(screen.queryByTestId('growth-league')).not.toBeInTheDocument();
    });
  });
});
