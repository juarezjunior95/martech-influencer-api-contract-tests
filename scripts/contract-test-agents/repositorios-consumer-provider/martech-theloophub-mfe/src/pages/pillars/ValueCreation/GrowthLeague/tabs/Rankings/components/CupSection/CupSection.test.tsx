import { render, screen } from '@testing-library/react';
import * as hooksModule from 'hooks';

import { createMockUseSubFiltersReturn } from '../../../../__mocks__/mockFactories';
import * as cupKpiModule from '../../hooks/useKpiRequests';
import { CupSection } from './CupSection';

jest.mock('hooks', () => ({
  useSubFilters: jest.fn(),
}));

jest.mock('../../hooks/useKpiRequests', () => ({
  useCupKpiRequests: jest.fn(),
}));

jest.mock('../CupFilter/CupFilter', () => ({
  CupFilter: () => <div data-testid="cup-filter">CupFilter</div>,
}));

jest.mock('../GridTable/GridTable', () => ({
  GridTable: ({
    data,
    leagueType,
    isBrandView,
  }: {
    data: unknown;
    leagueType: string;
    isBrandView: boolean;
  }) => (
    <div
      data-testid="grid-table"
      data-league-type={leagueType}
      data-brand-view={isBrandView}
      data-has-data={!!data}
    >
      GridTable
    </div>
  ),
}));

jest.mock('../LoadingTableSkeleton/LoadingTableSkeleton', () => ({
  LoadingTableSkeleton: () => (
    <div data-testid="loading-skeleton">Loading...</div>
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles',
  () => ({
    StyledSection: ({
      children,
      'data-testid': testId,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
    }) => <div data-testid={testId ?? 'styled-section'}>{children}</div>,
  }),
);

jest.mock('utils/container', () => ({
  ContainerWithScroll: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId ?? 'container-scroll'}>{children}</div>,
}));

const mockUseSubFilters = hooksModule.useSubFilters as jest.Mock;
const mockUseCupKpiRequests = cupKpiModule.useCupKpiRequests as jest.Mock;

const createMockCupReturn = (
  overrides: Partial<{ kpiData: unknown; loading: boolean }> = {},
) => ({
  kpiData: null,
  loading: false,
  ...overrides,
});

describe('CupSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSubFilters.mockReturnValue(createMockUseSubFiltersReturn());
    mockUseCupKpiRequests.mockReturnValue(createMockCupReturn());
  });

  describe('Rendering', () => {
    it('renders CupFilter, styled section and scroll container', () => {
      render(<CupSection />);

      expect(screen.getByTestId('cup-filter')).toBeInTheDocument();
      expect(screen.getByTestId('styled-section')).toBeInTheDocument();
      expect(screen.getByTestId('container-scroll')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders loading skeleton and hides GridTable when loading', () => {
      mockUseCupKpiRequests.mockReturnValue(
        createMockCupReturn({ loading: true }),
      );

      render(<CupSection />);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('grid-table')).not.toBeInTheDocument();
    });

    it('renders GridTable and hides loading skeleton when not loading', () => {
      render(<CupSection />);

      expect(screen.getByTestId('grid-table')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });
  });

  describe('Cup Suffix Logic', () => {
    it('uses activeCup as suffix when no subCup', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          activeSubFilters: { 'gl-competitions': 'megabrands_cup' },
        }),
      );

      render(<CupSection />);

      expect(screen.getByTestId('grid-table')).toHaveAttribute(
        'data-league-type',
        'megabrands_cup',
      );
    });

    it('combines activeCup and subCup for suffix', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          activeSubFilters: {
            'gl-competitions': 'bees_cup',
            'gl-competitions_bees_cup': 'acceleration',
          },
        }),
      );

      render(<CupSection />);

      expect(screen.getByTestId('grid-table')).toHaveAttribute(
        'data-league-type',
        'bees_cup_acceleration',
      );
    });

    it('handles empty activeCup gracefully', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          activeSubFilters: {},
        }),
      );

      render(<CupSection />);

      expect(screen.getByTestId('grid-table')).toHaveAttribute(
        'data-league-type',
        '',
      );
    });
  });

  describe('Brand View Detection', () => {
    it('sets isBrandView=true for megabrands_cup_brand and false for other cups', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          activeSubFilters: {
            'gl-competitions': 'megabrands_cup',
            'gl-competitions_megabrands_cup': 'brand',
          },
        }),
      );
      render(<CupSection />);
      expect(screen.getByTestId('grid-table')).toHaveAttribute(
        'data-brand-view',
        'true',
      );
    });

    it('sets isBrandView=false for non-brand cups', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          activeSubFilters: { 'gl-competitions': 'bees_cup' },
        }),
      );
      render(<CupSection />);
      expect(screen.getByTestId('grid-table')).toHaveAttribute(
        'data-brand-view',
        'false',
      );
    });
  });

  describe('KPI Data', () => {
    it('calls useCupKpiRequests with correct suffix and passes kpiData to GridTable', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          activeSubFilters: { 'gl-competitions': 'megabrands_cup' },
        }),
      );
      mockUseCupKpiRequests.mockReturnValue(
        createMockCupReturn({ kpiData: { table: { header: [], rows: [] } } }),
      );

      render(<CupSection />);

      expect(mockUseCupKpiRequests).toHaveBeenCalledWith('megabrands_cup');
      expect(screen.getByTestId('grid-table')).toHaveAttribute(
        'data-has-data',
        'true',
      );
    });

    it('handles null kpiData without crashing', () => {
      mockUseCupKpiRequests.mockReturnValue(
        createMockCupReturn({ kpiData: null }),
      );

      render(<CupSection />);

      expect(screen.getByTestId('grid-table')).toHaveAttribute(
        'data-has-data',
        'false',
      );
    });
  });

  describe('data-testid Rendering', () => {
    it('renders and omits custom data-testid based on dataTestId prop', () => {
      const { rerender } = render(<CupSection dataTestId="custom" />);
      expect(screen.getByTestId('cup-section-custom')).toBeInTheDocument();

      rerender(<CupSection />);
      expect(
        screen.queryByTestId('cup-section-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
