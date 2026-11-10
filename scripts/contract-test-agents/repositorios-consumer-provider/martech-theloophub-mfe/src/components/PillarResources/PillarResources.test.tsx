import React from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PillarResources } from './PillarResources';
import type { PlatformPillar, PlatformResource } from './types';

const mockToggle = jest.fn();
const mockUseMultiplesFeatureToggles = jest.fn();

jest.mock('hooks', () => ({
  useMediaQuery: jest.fn(() => false),
  useMultiplesFeatureToggles: (...args: unknown[]) =>
    mockUseMultiplesFeatureToggles(...args),
}));

jest.mock('assets/icons/arrow-down.svg', () => 'arrow-down.svg');
jest.mock('assets/icons/filters.svg', () => 'filters.svg');

jest.mock('./hooks', () => ({
  useFavoriteIds: () => ({ favoriteIds: [], toggle: mockToggle }),
  usePlatformResources: jest.fn(),
}));

jest.mock('./config/platformResourcesData', () => ({
  REPORT_VISIBILITY_TOGGLE_KEYS: ['submenu_portfolio_performance'],
  RESOURCE_ID_TO_TOGGLE_KEY: {
    101: 'submenu_portfolio_performance',
  },
  PLATFORM_RESOURCE_TYPE_NAMES: {
    powerBI: 'Power BI',
    report: 'Report',
    learningMaterial: 'Learning Material',
  },
}));

jest.mock('components/BasicContainer', () => ({
  BasicContainer: ({
    children,
    header,
  }: {
    children: React.ReactNode;
    header: { title: string };
  }) => (
    <div data-testid="basic-container">
      <h1 data-testid="page-title">{header?.title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('components/Skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

jest.mock('./components/PillarResourcesCard', () => ({
  PillarResourcesCard: ({
    resource,
    onFavoriteClick,
  }: {
    resource: PlatformResource;
    onFavoriteClick: (r: PlatformResource) => void;
  }) => (
    <div data-testid={`pillar-resources-card-${resource.id}`}>
      <span data-testid="card-name">{resource.name}</span>
      <button
        data-testid="card-favorite"
        onClick={() => onFavoriteClick?.(resource)}
      >
        Favorite
      </button>
    </div>
  ),
}));

jest.mock('./components/PillarResourcesFilterModal', () => ({
  PillarResourcesFilterModal: ({
    isOpen,
    onClose,
    onSetFilter,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onSetFilter: (order: string) => void;
  }) =>
    isOpen ? (
      <div data-testid="filter-modal">
        <button onClick={onClose} data-testid="filter-modal-close">
          Close
        </button>
        <button
          onClick={() => onSetFilter('z-a')}
          data-testid="filter-modal-set-z-a"
        >
          Z-A
        </button>
      </div>
    ) : null,
}));

jest.mock('./PillarResources.styles', () => ({
  StyledPillarResourcesContainer: ({ children }: any) => (
    <div data-testid="container">{children}</div>
  ),
  StyledPillarResourcesActions: ({ children }: any) => (
    <div data-testid="actions">{children}</div>
  ),
  StyledPillarResourcesContent: ({ children }: any) => (
    <div data-testid="content">{children}</div>
  ),
  StyledPillarResourcesSearch: ({ placeholder, onChange, value }: any) => (
    <input
      data-testid="search-input"
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange?.({
          target: e.target,
        } as unknown as React.FormEvent<HTMLInputElement>)
      }
    />
  ),
  PillarResourcesFilterButton: ({ children, onClick, selected }: any) => (
    <button
      data-testid="filter-chip"
      onClick={onClick}
      data-selected={selected}
    >
      {children}
    </button>
  ),
  PillarResourcesFilterLabel: ({ children }: any) => <span>{children}</span>,
  StyledNoFavoritesFound: ({ children, ...props }: any) => (
    <div data-testid="no-favorites-found" {...props}>
      {children}
    </div>
  ),
  StyledNoResultsFound: ({ children, ...props }: any) => (
    <div data-testid="no-results-found" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('./icons', () => ({
  platformResourceIcons: [{ id: 'chart', icon: () => null }],
}));

const usePlatformResources = jest.requireMock('./hooks').usePlatformResources;

function createMockData(overrides?: {
  pillars?: PlatformPillar[];
  resources?: PlatformResource[];
}) {
  const defaultPillar: PlatformPillar = {
    id: 1,
    name: 'Value Creation',
    description: 'Value Creation pillar',
    hexaIcon: 'chart',
    resourcesIds: [101],
  };
  const defaultResource: PlatformResource = {
    id: 101,
    name: 'Portfolio Performance',
    summary: 'View portfolio performance',
    mfeUrl: '/value-creation/portfolio-performance',
    pillarsIds: [1],
    typesIds: [11],
    comingSoon: false,
    subPillar: null,
    options: [],
    isUserFavorite: false,
  };
  return {
    platformPillars: overrides?.pillars ?? [defaultPillar],
    platformResources: overrides?.resources ?? [defaultResource],
    platformResourceTypes: [{ id: 11, name: 'Report', hexaColor: 'blue' }],
  };
}

describe('PillarResources', () => {
  const user = userEvent.setup({ delay: null });

  beforeEach(() => {
    jest.clearAllMocks();
    (usePlatformResources as jest.Mock).mockReturnValue({
      data: createMockData(),
      isLoading: false,
    });
    mockUseMultiplesFeatureToggles.mockReturnValue({
      togglesReady: true,
      togglesValues: [],
      featuresListByToggleName: {
        submenu_portfolio_performance: true,
      },
    });
  });

  describe('Rendering', () => {
    it('should render with pillar prop and show page title', () => {
      render(<PillarResources pillar="Value Creation" />);

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('page-title')).toHaveTextContent(
        'Pillar Resources',
      );
    });

    it('should render search input with placeholder', () => {
      render(<PillarResources pillar="Value Creation" />);

      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    });

    it('should render Filter and Favorites buttons', () => {
      render(<PillarResources pillar="Value Creation" />);

      expect(screen.getByText('Filter')).toBeInTheDocument();
      expect(screen.getByText('Favorites')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should show skeleton while toggles are not ready and pillar has gated reports', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        togglesReady: false,
        togglesValues: [],
        featuresListByToggleName: {},
      });

      render(<PillarResources pillar="Value Creation" />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(
        screen.queryByTestId('pillar-resources-card-101'),
      ).not.toBeInTheDocument();
    });

    it('should not show skeleton when pillar has no gated reports', () => {
      (usePlatformResources as jest.Mock).mockReturnValue({
        data: createMockData({
          resources: [
            {
              id: 999,
              name: 'Public Resource',
              summary: '',
              mfeUrl: '/x',
              pillarsIds: [1],
              typesIds: [11],
              comingSoon: false,
              subPillar: null,
              options: [],
              isUserFavorite: false,
            },
          ],
        }),
        isLoading: false,
      });
      mockUseMultiplesFeatureToggles.mockReturnValue({
        togglesReady: false,
        togglesValues: [],
        featuresListByToggleName: {},
      });

      render(<PillarResources pillar="Value Creation" />);

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(
        screen.getByTestId('pillar-resources-card-999'),
      ).toBeInTheDocument();
    });
  });

  describe('Content states', () => {
    it('should render resource cards when data is loaded and pillar matches', () => {
      render(<PillarResources pillar="Value Creation" />);

      expect(
        screen.getByTestId('pillar-resources-card-101'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('card-name')).toHaveTextContent(
        'Portfolio Performance',
      );
    });

    it('should hide a report card when its visibility toggle is disabled', () => {
      mockUseMultiplesFeatureToggles.mockReturnValue({
        togglesReady: true,
        togglesValues: [],
        featuresListByToggleName: {
          submenu_portfolio_performance: false,
        },
      });

      render(<PillarResources pillar="Value Creation" />);

      expect(
        screen.queryByTestId('pillar-resources-card-101'),
      ).not.toBeInTheDocument();
      expect(screen.getByTestId('no-results-found')).toBeInTheDocument();
    });

    it('should show no results found when pillar has no resources', () => {
      (usePlatformResources as jest.Mock).mockReturnValue({
        data: createMockData({
          pillars: [
            {
              id: 1,
              name: 'Value Creation',
              description: '',
              hexaIcon: 'chart',
              resourcesIds: [],
            },
          ],
          resources: [],
        }),
        isLoading: false,
      });

      render(<PillarResources pillar="Value Creation" />);

      expect(screen.getByTestId('no-results-found')).toBeInTheDocument();
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('should show no favorites found when favorites filter is on and user has no favorites', () => {
      (usePlatformResources as jest.Mock).mockReturnValue({
        data: createMockData({
          resources: [
            {
              id: 101,
              name: 'Portfolio Performance',
              summary: '',
              mfeUrl: '/reports/foo',
              pillarsIds: [1],
              typesIds: [11],
              comingSoon: false,
              subPillar: null,
              options: [],
              isUserFavorite: false,
            },
          ],
        }),
        isLoading: false,
      });

      render(<PillarResources pillar="Value Creation" />);
      fireEvent.click(screen.getByText('Favorites'));

      expect(screen.getByTestId('no-favorites-found')).toBeInTheDocument();
      expect(screen.getByText('No favorites found')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should open filter modal when Filter button is clicked', () => {
      render(<PillarResources pillar="Value Creation" />);

      expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument();

      fireEvent.click(screen.getByText('Filter'));

      expect(screen.getByTestId('filter-modal')).toBeInTheDocument();
    });

    it('should close filter modal when close is clicked', () => {
      render(<PillarResources pillar="Value Creation" />);
      fireEvent.click(screen.getByText('Filter'));
      expect(screen.getByTestId('filter-modal')).toBeInTheDocument();

      fireEvent.click(screen.getByTestId('filter-modal-close'));

      expect(screen.queryByTestId('filter-modal')).not.toBeInTheDocument();
    });

    it('should call toggleFavorite mutate when card favorite is clicked', () => {
      render(<PillarResources pillar="Value Creation" />);
      const card = screen.getByTestId('pillar-resources-card-101');
      const favoriteButton = within(card).getByTestId('card-favorite');

      fireEvent.click(favoriteButton);

      expect(mockToggle).toHaveBeenCalledWith(101, false);
    });
  });

  describe('Search', () => {
    it('should filter cards by search term', async () => {
      (usePlatformResources as jest.Mock).mockReturnValue({
        data: createMockData({
          resources: [
            {
              id: 101,
              name: 'Portfolio Performance',
              summary: '',
              mfeUrl: '/a',
              pillarsIds: [1],
              typesIds: [11],
              comingSoon: false,
              subPillar: null,
              options: [],
              isUserFavorite: false,
            },
            {
              id: 102,
              name: 'Growth League',
              summary: '',
              mfeUrl: '/b',
              pillarsIds: [1],
              typesIds: [11],
              comingSoon: false,
              subPillar: null,
              options: [],
              isUserFavorite: false,
            },
          ],
        }),
        isLoading: false,
      });

      render(<PillarResources pillar="Value Creation" />);
      expect(
        screen.getByTestId('pillar-resources-card-101'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('pillar-resources-card-102'),
      ).toBeInTheDocument();

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'Growth');

      expect(
        screen.getByTestId('pillar-resources-card-102'),
      ).toBeInTheDocument();
      expect(
        screen.queryByTestId('pillar-resources-card-101'),
      ).not.toBeInTheDocument();
    });
  });
});
