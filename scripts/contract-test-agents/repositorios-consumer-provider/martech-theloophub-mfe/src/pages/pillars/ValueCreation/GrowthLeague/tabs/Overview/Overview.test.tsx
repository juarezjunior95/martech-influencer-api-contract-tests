import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import enUS from 'i18n/languages/en-US';
import { flattenObject } from 'i18n/provider';

import * as useKpiRequestsModule from './hooks/useKpiRequests';
import { Overview } from './Overview';

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('./hooks/useKpiRequests', () => ({
  useKpiRequests: jest.fn(),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => ({
    lastDataRefreshKpisDate: { growth_league: '2024-11-01' },
  }),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: () => jest.fn(),
}));

jest.mock('utils/format', () => ({
  formatDateToMonthYear: () => 'Nov 2024',
}));

const messages = flattenObject(enUS);

const mockUseKpiRequests = jest.mocked(useKpiRequestsModule.useKpiRequests);

const emptyRankData = { label: '', rank: [] };

const defaultKpiReturn = (): ReturnType<
  typeof useKpiRequestsModule.useKpiRequests
> => ({
  kpis: {
    leagueChampions: {
      kpiData: {
        leagueChampions: [
          { label: 'super-league', rank: [] },
          { label: 'premier-league', rank: [] },
        ],
      },
      loading: false,
    },
    cupWinners: {
      kpiData: {
        cupWinners: {
          mega_brands_cup_country: emptyRankData,
          mega_brands_cup: emptyRankData,
          bees_cup_acceleration: emptyRankData,
          bees_cup_maturity: emptyRankData,
          ka_cup_league_a: emptyRankData,
          ka_cup_league_b: emptyRankData,
          dtc_cup: emptyRankData,
        },
      } as any,
      loading: false,
    },
    leaguesLeaderboard: {
      kpiData: {
        ranking: {
          'super-league': emptyRankData,
          'premier-league': emptyRankData,
        },
      } as any,
      loading: false,
    },
  },
  loading: false,
});

const renderOverview = (ui: React.ReactElement) =>
  render(
    <IntlProvider defaultLocale="en-US" locale="en-US" messages={messages}>
      {ui}
    </IntlProvider>,
  );

describe('Overview', () => {
  const getOverviewContainer = (container: HTMLElement) =>
    container.querySelector('.overview');

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseKpiRequests.mockReturnValue(defaultKpiReturn());
  });

  it('renders overview layout, Growth League sections, and calls useKpiRequests for tab data', () => {
    const { container } = renderOverview(<Overview />);

    const overview = getOverviewContainer(container);
    expect(overview).toBeInTheDocument();
    expect(overview).toHaveClass('overview');
    expect(overview).toHaveStyle({
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    });

    expect(screen.getByText('Growth League')).toBeInTheDocument();
    expect(screen.getByText('League Winners')).toBeInTheDocument();
    expect(screen.getByText('Leagues Leaderboard')).toBeInTheDocument();

    expect(mockUseKpiRequests).toHaveBeenCalled();
  });

  describe('data-testid', () => {
    it('adds tabpanel data-testid when dataTestId is provided', () => {
      renderOverview(<Overview dataTestId="custom" />);

      expect(
        screen.getByTestId('tabpanel-overview-custom'),
      ).toBeInTheDocument();
    });

    it('does not add tabpanel data-testid when dataTestId is omitted', () => {
      renderOverview(<Overview />);

      expect(
        screen.queryByTestId('tabpanel-overview-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
