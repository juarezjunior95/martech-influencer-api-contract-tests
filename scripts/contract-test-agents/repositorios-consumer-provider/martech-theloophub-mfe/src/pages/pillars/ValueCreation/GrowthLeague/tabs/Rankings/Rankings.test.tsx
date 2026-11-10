import { IntlProvider } from 'react-intl';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import enUS from 'i18n/languages/en-US';
import { flattenObject } from 'i18n/provider';

// Override the temp-hide flag so all tests run against the full component behaviour.
// When TEMP_HIDE_COMPETITION_SELECTOR is reverted to false in tabs/Rankings/constants/index.ts,
// remove this mock — no other test changes needed.
jest.mock('./constants', () => ({
  TEMP_HIDE_COMPETITION_SELECTOR: false,
}));

import { Rankings } from './Rankings';

const messages = flattenObject(enUS);

const mockNavigate = jest.fn();
let mockLocationSearch = '';
let mockLocationPathname = '/rankings';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({
    pathname: mockLocationPathname,
    search: mockLocationSearch,
  }),
  useNavigate: () => mockNavigate,
}));

const mockTrackGA = jest.fn();
jest.mock('hooks', () => ({
  useGoogleAnalytics: () => mockTrackGA,
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    header,
    children,
    dataTestId,
  }: {
    header: { title: string; rightContent: React.ReactNode };
    children: React.ReactNode;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId ?? 'basic-container'}>
      <div data-testid="header-title">{header.title}</div>
      <div data-testid="header-right">{header.rightContent}</div>
      <div data-testid="container-content">{children}</div>
    </div>
  ),
}));

interface CompetitionSelectorProps {
  competitionType: string;
  setCompetitionType: (value: string) => void;
}

jest.mock('./components', () => ({
  CompetitionSelector: ({
    competitionType,
    setCompetitionType,
  }: CompetitionSelectorProps) => (
    <div data-testid="competition-selector">
      <span data-testid="current-competition">{competitionType}</span>
      <button
        data-testid="select-league"
        onClick={() => setCompetitionType('league')}
      >
        League
      </button>
      <button
        data-testid="select-cup"
        onClick={() => setCompetitionType('cup')}
      >
        Cup
      </button>
    </div>
  ),
  LeagueSection: ({
    leagueType,
    setLeagueType,
  }: {
    leagueType: string;
    setLeagueType: (value: string) => void;
  }) => (
    <div data-testid="league-section">
      <span data-testid="current-league">{leagueType}</span>
      <button
        data-testid="select-premier"
        onClick={() => setLeagueType('premier-league')}
      >
        Premier
      </button>
      <button
        data-testid="select-super"
        onClick={() => setLeagueType('super-league')}
      >
        Super
      </button>
    </div>
  ),
  CupSection: () => <div data-testid="cup-section">CupSection</div>,
}));

const renderRankings = (props?: { dataTestId?: string }) =>
  render(
    <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
      <Rankings {...props} />
    </IntlProvider>,
  );

describe('Rankings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocationSearch = '';
    mockLocationPathname = '/rankings';
  });

  describe('Rendering', () => {
    it('renders BasicContainer with CompetitionSelector in header and LeagueSection by default', () => {
      renderRankings();

      expect(screen.getByTestId('basic-container')).toBeInTheDocument();
      expect(screen.getByTestId('competition-selector')).toBeInTheDocument();
      expect(screen.getByTestId('header-right')).toContainElement(
        screen.getByTestId('competition-selector'),
      );
      expect(screen.getByTestId('league-section')).toBeInTheDocument();
      expect(screen.queryByTestId('cup-section')).not.toBeInTheDocument();
    });

    it('renders CupSection and hides LeagueSection when competition is cup', async () => {
      const user = userEvent.setup();
      renderRankings();

      await user.click(screen.getByTestId('select-cup'));

      await waitFor(() => {
        expect(screen.getByTestId('cup-section')).toBeInTheDocument();
        expect(screen.queryByTestId('league-section')).not.toBeInTheDocument();
      });
    });
  });

  describe('URL State - Competition Type', () => {
    it('defaults to league when no URL param', () => {
      renderRankings();

      expect(screen.getByTestId('current-competition')).toHaveTextContent(
        'league',
      );
    });

    it('reads competition-type=cup from URL', () => {
      mockLocationSearch = '?competition-type=cup';
      renderRankings();

      expect(screen.getByTestId('cup-section')).toBeInTheDocument();
    });

    it('updates URL and tracks GA when competition changes', async () => {
      const user = userEvent.setup();
      renderRankings();

      await user.click(screen.getByTestId('select-cup'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.objectContaining({
            search: expect.stringContaining('competition-type=cup'),
          }),
        );
        expect(mockTrackGA).toHaveBeenCalledWith({
          event_category: 'Content',
          event_action: 'Content',
          event_label: 'cup',
        });
      });
    });
  });

  describe('URL State - League Type', () => {
    it('defaults to super-league when no URL param', () => {
      renderRankings();

      expect(screen.getByTestId('current-league')).toHaveTextContent(
        'super-league',
      );
    });

    it('reads league-type=premier-league from URL', () => {
      mockLocationSearch =
        '?competition-type=league&league-type=premier-league';
      renderRankings();

      expect(screen.getByTestId('current-league')).toHaveTextContent(
        'premier-league',
      );
    });

    it('updates URL and tracks GA when league changes', async () => {
      const user = userEvent.setup();
      renderRankings();

      await user.click(screen.getByTestId('select-premier'));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.objectContaining({
            search: expect.stringContaining('league-type=premier-league'),
          }),
        );
        expect(mockTrackGA).toHaveBeenCalledWith({
          event_category: 'Filter',
          event_action: 'Select',
          event_label: 'premier-league',
        });
      });
    });
  });

  describe('Navigation Sync', () => {
    it('syncs URL on mount when pathname includes "rankings"', () => {
      renderRankings();

      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/rankings',
        search: '?competition-type=league&league-type=super-league',
      });
    });

    it('syncs URL with values from URL params', () => {
      mockLocationSearch = '?competition-type=cup&league-type=premier-league';
      renderRankings();

      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/rankings',
        search: '?competition-type=cup&league-type=premier-league',
      });
    });

    it('does not call navigate when pathname does not include "rankings"', () => {
      mockLocationPathname = '/other-page';
      renderRankings();

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('data-testid Rendering', () => {
    it('renders and omits custom data-testid based on dataTestId prop', () => {
      const { rerender } = renderRankings({ dataTestId: 'custom' });
      expect(screen.getByTestId('custom-rankings')).toBeInTheDocument();

      rerender(
        <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
          <Rankings />
        </IntlProvider>,
      );
      expect(screen.queryByTestId('custom-rankings')).not.toBeInTheDocument();
    });
  });
});
