import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as hooksModule from 'hooks';

import * as useKpiRequestsModule from '../../hooks/useKpiRequests';
import { LeagueSection } from './LeagueSection';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(),
}));

jest.mock('../../hooks/useKpiRequests', () => ({
  useKpiRequests: jest.fn(),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => ({
    lastDataRefreshKpisDate: { growth_league: '2024-11-01' },
  }),
}));

jest.mock('utils/format', () => ({
  formatDateToMonthYear: (date: string) => `Nov 2024`,
}));

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
    dataTestId,
  }: {
    children: React.ReactNode;
    header: { title: string; rightContent?: React.ReactNode };
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'basic-container'}
      data-title={header.title}
    >
      {header.rightContent}
      {children}
    </div>
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles',
  () => ({
    StyledGridCupContainer: ({
      children,
      'data-testid': testId,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
    }) => <div data-testid={testId ?? 'cup-container'}>{children}</div>,
  }),
);

// Override the temp-hide flag so all tests run against the full component behaviour.
// When TEMP_HIDE_CUP_WINNERS is reverted to false in tabs/Overview/constants/index.ts,
// remove TEMP_HIDE_CUP_WINNERS from this mock — no other test changes needed.
jest.mock('../../constants', () => ({
  TEMP_HIDE_CUP_WINNERS: false,
  SEGMENT_OPTIONS_MEGABRANDS: [
    { value: 'MegabrandsCupCountry', label: 'Country' },
    { value: 'MegabrandsCupBrands', label: 'Brands' },
  ],
  SEGMENT_OPTIONS_BESS: [
    { value: 'BeesCupAcceleration', label: 'Index' },
    { value: 'BeesCupMaturity', label: 'Maturity' },
  ],
  SEGMENT_OPTIONS_CHANNEL: [
    { value: 'KaCupLeagueA', label: 'League A' },
    { value: 'KaCupLeagueB', label: 'League B' },
  ],
  CUP_KEY_MAPPING: {
    MegabrandsCupBrands: { megaBrands: 'mega_brands_cup' },
    MegabrandsCupCountry: { megaBrands: 'mega_brands_cup_country' },
    BeesCupAcceleration: { bees: 'bees_cup_acceleration' },
    BeesCupMaturity: { bees: 'bees_cup_maturity' },
    KaCupLeagueA: { channel: 'ka_cup_league_a' },
    KaCupLeagueB: { channel: 'ka_cup_league_b' },
    DtcCup: { dtc: 'dtc_cup' },
  },
  CUPS_CONFIG: [
    {
      key: 'megaBrands',
      labelKeys: ['label1', 'label2'],
      options: [
        { value: 'MegabrandsCupCountry', label: 'Country' },
        { value: 'MegabrandsCupBrands', label: 'Brands' },
      ],
      getSelectValue: (key: string) =>
        key === 'mega_brands_cup'
          ? 'MegabrandsCupBrands'
          : 'MegabrandsCupCountry',
    },
    {
      key: 'channel',
      labelKeys: ['label1', 'label2'],
      options: [
        { value: 'KaCupLeagueA', label: 'League A' },
        { value: 'KaCupLeagueB', label: 'League B' },
      ],
      getSelectValue: (key: string) =>
        key === 'ka_cup_league_a' ? 'KaCupLeagueA' : 'KaCupLeagueB',
    },
    {
      key: 'bees',
      labelKeys: ['label1', 'label2'],
      options: [
        { value: 'BeesCupAcceleration', label: 'Index' },
        { value: 'BeesCupMaturity', label: 'Maturity' },
      ],
      getSelectValue: (key: string) =>
        key === 'bees_cup_acceleration'
          ? 'BeesCupAcceleration'
          : 'BeesCupMaturity',
    },
    {
      key: 'dtc',
    },
  ],
}));

jest.mock('../CupWinners/CupWinners', () => ({
  CupWinners: ({
    label,
    loading,
    onSelectedChange,
    currentSelectValue,
  }: {
    label: string;
    loading: boolean;
    onSelectedChange: (value: string) => void;
    currentSelectValue: string;
  }) => (
    <div
      data-testid="cup-winners"
      data-label={label}
      data-loading={loading}
      data-current={currentSelectValue}
    >
      <button
        data-testid={`change-${currentSelectValue}`}
        onClick={() => {
          if (currentSelectValue === 'MegabrandsCupCountry')
            onSelectedChange('MegabrandsCupBrands');
          if (currentSelectValue === 'MegabrandsCupBrands')
            onSelectedChange('MegabrandsCupCountry');
          if (currentSelectValue === 'BeesCupAcceleration')
            onSelectedChange('BeesCupMaturity');
          if (currentSelectValue === 'BeesCupMaturity')
            onSelectedChange('BeesCupAcceleration');
          if (currentSelectValue === 'KaCupLeagueA')
            onSelectedChange('KaCupLeagueB');
          if (currentSelectValue === 'KaCupLeagueB')
            onSelectedChange('KaCupLeagueA');
        }}
      >
        Change
      </button>
    </div>
  ),
}));

jest.mock('../FlagRank/FlagRank', () => ({
  FlagRank: ({
    rankData,
    loading,
  }: {
    rankData: unknown;
    loading: boolean;
  }) => (
    <div
      data-testid="flag-rank"
      data-loading={loading}
      data-has-data={!!rankData}
    >
      FlagRank
    </div>
  ),
}));

jest.mock('../LeagueSelector/LeagueSelector', () => ({
  LeagueSelector: ({
    selectedLeague,
    onLeagueChange,
  }: {
    selectedLeague: string;
    onLeagueChange: (value: string) => void;
  }) => (
    <div data-testid="league-selector" data-selected={selectedLeague}>
      <button
        data-testid="select-premier"
        onClick={() => onLeagueChange('premier-league')}
      >
        Premier
      </button>
      <button
        data-testid="select-super"
        onClick={() => onLeagueChange('super-league')}
      >
        Super
      </button>
    </div>
  ),
}));

jest.mock('../RankingLink/RankingLink', () => ({
  RankingLink: ({ to }: { to: string }) => (
    <a data-testid="ranking-link" href={to}>
      View Rankings
    </a>
  ),
}));

const mockUseKpiRequests = jest.mocked(useKpiRequestsModule.useKpiRequests);
const mockUseGoogleAnalytics = jest.mocked(hooksModule.useGoogleAnalytics);

describe('LeagueSection', () => {
  const mockTrackGA = jest.fn();

  const mockLeagueChampionsData = {
    leagueChampions: [
      {
        label: 'super-league',
        rank: [{ countryName: 'Brazil', position: 1 }],
      },
      {
        label: 'premier-league',
        rank: [{ countryName: 'Mexico', position: 1 }],
      },
    ],
  };

  const mockCupWinnersData = {
    cupWinners: {
      mega_brands_cup_country: { rank: [] },
      mega_brands_cup: { rank: [] },
      bees_cup_acceleration: { rank: [] },
      bees_cup_maturity: { rank: [] },
      ka_cup_league_a: { rank: [] },
      ka_cup_league_b: { rank: [] },
      dtc_cup: { rank: [] },
    },
  };

  interface MockKpiConfig {
    leagueData?: typeof mockLeagueChampionsData | null;
    cupData?: typeof mockCupWinnersData | null;
    leagueLoading?: boolean;
    cupLoading?: boolean;
  }

  const setupMocks = (config: MockKpiConfig = {}) => {
    const {
      leagueData = mockLeagueChampionsData,
      cupData = mockCupWinnersData,
      leagueLoading = false,
      cupLoading = false,
    } = config;

    mockUseKpiRequests.mockReturnValue({
      kpis: {
        leagueChampions: {
          kpiData: leagueData as any,
          loading: leagueLoading,
        },
        cupWinners: {
          kpiData: cupData as any,
          loading: cupLoading,
        },
        leaguesLeaderboard: {
          kpiData: null as any,
          loading: false,
        },
      },
      loading: leagueLoading || cupLoading,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGoogleAnalytics.mockReturnValue(mockTrackGA);
    setupMocks();
  });

  describe('Rendering', () => {
    it('should render FlagRank', () => {
      render(<LeagueSection />);

      expect(screen.getByTestId('flag-rank')).toBeInTheDocument();
    });

    it('should render LeagueSelector', () => {
      render(<LeagueSection />);

      expect(screen.getByTestId('league-selector')).toBeInTheDocument();
    });

    it('should render 4 CupWinners components', () => {
      render(<LeagueSection />);

      expect(screen.getAllByTestId('cup-winners')).toHaveLength(4);
    });

    it('should render ranking links', () => {
      render(<LeagueSection />);

      expect(screen.getAllByTestId('ranking-link').length).toBeGreaterThan(0);
    });

    it('should render cup container', () => {
      render(<LeagueSection />);

      expect(screen.getByTestId('cup-container')).toBeInTheDocument();
    });
  });

  describe('League Selection', () => {
    it('should default to super-league', () => {
      render(<LeagueSection />);

      expect(screen.getByTestId('league-selector')).toHaveAttribute(
        'data-selected',
        'super-league',
      );
    });

    it('should change league when selector clicked', async () => {
      const user = userEvent.setup();

      render(<LeagueSection />);

      await user.click(screen.getByTestId('select-premier'));

      expect(screen.getByTestId('league-selector')).toHaveAttribute(
        'data-selected',
        'premier-league',
      );
    });

    it('should track GA when league changes', async () => {
      const user = userEvent.setup();

      render(<LeagueSection />);

      await user.click(screen.getByTestId('select-premier'));

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Growth league overview',
        event_action: 'Selected',
        event_label: 'premier-league',
      });
    });
  });

  describe('Cup Selection', () => {
    it('should change mega brands cup selection', async () => {
      const user = userEvent.setup();

      render(<LeagueSection />);

      const megaBrandsCup = screen.getAllByTestId('cup-winners')[0];
      expect(megaBrandsCup).toHaveAttribute(
        'data-current',
        'MegabrandsCupCountry',
      );

      await user.click(screen.getByTestId('change-MegabrandsCupCountry'));

      expect(screen.getAllByTestId('cup-winners')[0]).toHaveAttribute(
        'data-current',
        'MegabrandsCupBrands',
      );
    });

    it('should change bees cup selection', async () => {
      const user = userEvent.setup();

      render(<LeagueSection />);

      await user.click(screen.getByTestId('change-BeesCupAcceleration'));

      const beesCup = screen.getAllByTestId('cup-winners')[2];
      expect(beesCup).toHaveAttribute('data-current', 'BeesCupMaturity');
    });

    it('should change channel cup selection', async () => {
      const user = userEvent.setup();

      render(<LeagueSection />);

      await user.click(screen.getByTestId('change-KaCupLeagueA'));

      const channelCup = screen.getAllByTestId('cup-winners')[1];
      expect(channelCup).toHaveAttribute('data-current', 'KaCupLeagueB');
    });

    it('should not show dtc cup toggle', async () => {
      render(<LeagueSection />);

      expect(screen.getAllByTestId('cup-winners')[3]).not.toHaveAttribute(
        'data-label',
        'label1',
      );
    });

    it('should toggle mega brands cup back to country', async () => {
      const user = userEvent.setup();

      render(<LeagueSection />);

      await user.click(screen.getByTestId('change-MegabrandsCupCountry'));
      await user.click(screen.getByTestId('change-MegabrandsCupBrands'));

      const megaBrandsCup = screen.getAllByTestId('cup-winners')[0];
      expect(megaBrandsCup).toHaveAttribute(
        'data-current',
        'MegabrandsCupCountry',
      );
    });

    it('should toggle bees cup back to index', async () => {
      const user = userEvent.setup();

      render(<LeagueSection />);

      await user.click(screen.getByTestId('change-BeesCupAcceleration'));
      await user.click(screen.getByTestId('change-BeesCupMaturity'));

      const beesCup = screen.getAllByTestId('cup-winners')[2];
      expect(beesCup).toHaveAttribute('data-current', 'BeesCupAcceleration');
    });

    it('should toggle channel cup back to league a', async () => {
      const user = userEvent.setup();

      render(<LeagueSection />);

      await user.click(screen.getByTestId('change-KaCupLeagueA'));
      await user.click(screen.getByTestId('change-KaCupLeagueB'));

      const channelCup = screen.getAllByTestId('cup-winners')[1];
      expect(channelCup).toHaveAttribute('data-current', 'KaCupLeagueA');
    });
  });

  describe('Loading State', () => {
    it('should pass loading state to FlagRank', () => {
      setupMocks({
        leagueData: null,
        cupData: null,
        leagueLoading: true,
        cupLoading: true,
      });

      render(<LeagueSection />);

      expect(screen.getByTestId('flag-rank')).toHaveAttribute(
        'data-loading',
        'true',
      );
    });

    it('should pass loading state to CupWinners', () => {
      setupMocks({
        leagueData: null,
        cupData: null,
        leagueLoading: false,
        cupLoading: true,
      });

      render(<LeagueSection />);

      const cupWinners = screen.getAllByTestId('cup-winners');
      expect(cupWinners[0]).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Empty Data', () => {
    it('should handle null league champions data', () => {
      setupMocks({ leagueData: null });

      render(<LeagueSection />);

      expect(screen.getByTestId('flag-rank')).toHaveAttribute(
        'data-has-data',
        'false',
      );
    });

    it('should handle null cup winners data', () => {
      setupMocks({ cupData: null });

      render(<LeagueSection />);

      expect(screen.getAllByTestId('cup-winners')).toHaveLength(4);
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(<LeagueSection dataTestId="custom" />);

      expect(screen.getByTestId('custom-league-section')).toBeInTheDocument();
      expect(screen.getByTestId('custom-league-champions')).toBeInTheDocument();
      expect(screen.getByTestId('custom-cup-winners')).toBeInTheDocument();
      expect(
        screen.getByTestId('league-cup-winners-grid-custom'),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<LeagueSection />);

      expect(
        screen.queryByTestId('custom-league-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('league-cup-winners-grid-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
