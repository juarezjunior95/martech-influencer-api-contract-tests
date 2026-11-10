import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import enUS from 'i18n/languages/en-US';
import { flattenObject } from 'i18n/provider';

import * as useKpiRequestsModule from '../../hooks/useKpiRequests';
import { LeaderboardSection } from './LeaderboardSection';

jest.mock('../../hooks/useKpiRequests', () => ({
  useKpiRequests: jest.fn(),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
    dataTestId,
  }: {
    children: React.ReactNode;
    header: { title: string };
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'basic-container'}
      data-title={header.title}
    >
      {children}
    </div>
  ),
  RankingTag: ({ position, type }: { position: string; type: string }) => (
    <span data-testid="ranking-tag" data-position={position} data-type={type} />
  ),
}));

jest.mock('@hexa-ui/components', () => ({
  SkeletonLoader: ({
    height,
    width,
    'data-testid': dataTestId,
  }: {
    height: string;
    width: string;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'skeleton-loader'}
      data-height={height}
      data-width={width}
    />
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles',
  () => ({
    StyledGridLeagueContainer: ({
      children,
      'data-testid': testId,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
    }) => <div data-testid={testId ?? 'grid-container'}>{children}</div>,
    StyledBoxLink: ({
      children,
      'data-testid': testId,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
    }) => <div data-testid={testId ?? 'styled-box-link'}>{children}</div>,
  }),
);

jest.mock('@hexa-ui/icons', () => ({
  ArrowRight: ({
    size,
    'data-testid': dataTestId,
  }: {
    size: string;
    'data-testid'?: string;
  }) => (
    <span data-testid={dataTestId ?? 'arrow-right-icon'} data-size={size}>
      →
    </span>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledLinkA: ({
    children,
    href,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    href: string;
    'data-testid'?: string;
  }) => (
    <a data-testid={testId ?? 'styled-link'} href={href}>
      {children}
    </a>
  ),
}));

jest.mock('../Leaderboard/Leaderboard.styles', () => ({
  StyledLeaderBoardContainer: ({
    children,
    'data-testid': testId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={testId ?? 'leaderboard-root'}>{children}</div>,
  StyledLeaderBoardItem: ({
    children,
    position,
  }: {
    children: React.ReactNode;
    position: string;
  }) => (
    <div data-testid="leaderboard-item" data-position={position}>
      {children}
    </div>
  ),
  StyledLeaderCountryInfo: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="country-info">{children}</div>
  ),
  StyledBoxMedal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="medal-box">{children}</div>
  ),
  StyledImageBox: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="image-box">{children}</div>
  ),
  StyledImage: ({ src, alt }: { src: string; alt: string }) => (
    <img data-testid="flag-image" src={src} alt={alt} />
  ),
  StyledCountryName: ({ children }: { children: React.ReactNode }) => (
    <span data-testid="country-name">{children}</span>
  ),
  StyledLeagueTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="league-title">{children}</h3>
  ),
  StyledValue: ({
    children,
    color,
  }: {
    children: React.ReactNode;
    color: string;
  }) => (
    <span data-testid="value" data-color={color}>
      {children}
    </span>
  ),
}));

jest.mock('pages/pillars/ValueCreation/GrowthLeague/constants', () => ({
  LEAGUE_OPTIONS: [
    {
      value: 'super-league',
      id: 'ValueCreation.GrowthLeague.LeaguesLeaderboard.SuperLeague',
    },
    {
      value: 'premier-league',
      id: 'ValueCreation.GrowthLeague.LeaguesLeaderboard.PremierLeague',
    },
  ],
}));

const messages = flattenObject(enUS);

const mockUseKpiRequests = jest.mocked(useKpiRequestsModule.useKpiRequests);

const rankSlice = (
  rows: Array<{ countryName: string; position: string; value: string }>,
) => ({
  label: 'League',
  rank: rows.map((r) => ({
    countryName: r.countryName,
    position: r.position,
    flag: 'f.png',
    value: r.value,
    measure: 'pts',
  })),
});

const mockLeaderboardData = {
  ranking: {
    'super-league': rankSlice([
      { countryName: 'Brazil', position: '1', value: '95' },
      { countryName: 'Mexico', position: '2', value: '88' },
    ]),
    'premier-league': rankSlice([
      { countryName: 'Colombia', position: '1', value: '75' },
      { countryName: 'Argentina', position: '2', value: '70' },
    ]),
  },
};

const createMockKpiRequests = (
  overrides?: Partial<{
    kpiData: unknown;
    loading: boolean;
  }>,
) => ({
  kpis: {
    leagueChampions: { kpiData: null as any, loading: false },
    cupWinners: { kpiData: null as any, loading: false },
    leaguesLeaderboard: {
      kpiData: (overrides?.kpiData ?? null) as any,
      loading: overrides?.loading ?? false,
    },
  },
  loading: overrides?.loading ?? false,
});

const renderSection = (ui: React.ReactElement) =>
  render(
    <IntlProvider defaultLocale="en-US" locale="en-US" messages={messages}>
      {ui}
    </IntlProvider>,
  );

describe('LeaderboardSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseKpiRequests.mockReturnValue(
      createMockKpiRequests({ kpiData: mockLeaderboardData }),
    );
  });

  it('renders section title, grid, two leaderboards with country rows, and ranking links with league query params', () => {
    renderSection(<LeaderboardSection />);

    expect(screen.getByTestId('basic-container')).toHaveAttribute(
      'data-title',
      'Leagues Leaderboard',
    );
    expect(screen.getByTestId('grid-container')).toBeInTheDocument();

    expect(screen.getAllByTestId('league-title')).toHaveLength(2);
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getByText('Colombia')).toBeInTheDocument();

    const links = screen.getAllByRole('link', { name: /see full ranking/i });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      'href',
      '/reports/value-creation/growth-league/rankings?competition-type=league&league-type=super-league',
    );
    expect(links[1]).toHaveAttribute(
      'href',
      '/reports/value-creation/growth-league/rankings?competition-type=league&league-type=premier-league',
    );

    expect(mockUseKpiRequests).toHaveBeenCalled();
  });

  it('passes loading into Leaderboard when the KPI hook reports loading', () => {
    mockUseKpiRequests.mockReturnValue(
      createMockKpiRequests({ loading: true }),
    );

    renderSection(<LeaderboardSection />);

    expect(screen.getAllByTestId('skeleton-loader').length).toBeGreaterThan(0);
  });

  it('handles null kpiData without country rows', () => {
    mockUseKpiRequests.mockReturnValue(
      createMockKpiRequests({ kpiData: null }),
    );

    renderSection(<LeaderboardSection />);

    expect(screen.queryByText('Brazil')).not.toBeInTheDocument();
    expect(screen.getByTestId('grid-container')).toBeInTheDocument();
  });

  it('handles empty ranking object', () => {
    mockUseKpiRequests.mockReturnValue(
      createMockKpiRequests({ kpiData: { ranking: {} } }),
    );

    renderSection(<LeaderboardSection />);

    expect(screen.getByTestId('grid-container')).toBeInTheDocument();
  });

  describe('data-testid', () => {
    it('adds custom section and grid test ids when dataTestId is provided', () => {
      renderSection(<LeaderboardSection dataTestId="custom" />);

      expect(
        screen.getByTestId('custom-leaderboard-section'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('leaderboard-grid-custom')).toBeInTheDocument();
    });

    it('does not add custom test ids when dataTestId is omitted', () => {
      renderSection(<LeaderboardSection />);

      expect(
        screen.queryByTestId('custom-leaderboard-section'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('leaderboard-grid-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
