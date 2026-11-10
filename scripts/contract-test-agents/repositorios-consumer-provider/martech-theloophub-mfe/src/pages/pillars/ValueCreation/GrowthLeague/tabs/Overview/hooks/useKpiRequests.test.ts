import { renderHook } from '@testing-library/react-hooks';
import { useBffData, type UseBffDataResponse } from 'hooks';

import { useKpiRequests } from './useKpiRequests';

function mockBffResponse(
  data: UseBffDataResponse['data'],
  loading: boolean,
  error: Error | null = null,
): UseBffDataResponse {
  return {
    data,
    loading,
    error,
    refetch: jest.fn().mockResolvedValue(undefined),
  };
}

jest.mock('../constants', () => ({
  TEMP_HIDE_CUP_WINNERS: false,
}));

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

const BFF_VIEW_IDS = {
  leagueChampions: 'value-creation_growth-league_overview_league-champions',
  cupWinners: 'value-creation_growth-league_overview_cup-winners',
  leaguesLeaderboard: 'value-creation_growth-league_overview_rank',
};

/** Minimal `BffNormalizedData` shape for leaderboard hook when tests only care about `loading`. */
const idleLeaguesLeaderboardBffData: UseBffDataResponse['data'] = {
  rank: {},
};

describe('useKpiRequests', () => {
  const mockUseBffData = jest.mocked(useBffData);

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseBffData.mockReturnValue(mockBffResponse(null, false, null));
  });

  it('calls useBffData three times with growth_league, skipMainFilters, and the three view ids', () => {
    renderHook(() => useKpiRequests());

    expect(mockUseBffData).toHaveBeenCalledTimes(3);

    const ids = mockUseBffData.mock.calls.map((c) => c[0].id);
    expect(ids).toEqual(
      expect.arrayContaining([
        BFF_VIEW_IDS.leagueChampions,
        BFF_VIEW_IDS.cupWinners,
        BFF_VIEW_IDS.leaguesLeaderboard,
      ]),
    );

    mockUseBffData.mock.calls.forEach((call) => {
      expect(call[0].kpiGroup).toBe('growth_league');
      expect(call[0].skipMainFilters).toBe(true);
    });
  });

  it('returns kpis map, per-kpi loading, and top-level loading false when hooks are idle', () => {
    const { result } = renderHook(() => useKpiRequests());

    expect(Object.keys(result.current.kpis)).toEqual([
      'leagueChampions',
      'cupWinners',
      'leaguesLeaderboard',
    ]);
    Object.values(result.current.kpis).forEach((kpi) => {
      expect(kpi).toHaveProperty('kpiData');
      expect(kpi).toHaveProperty('loading');
    });
    expect(result.current.loading).toBe(false);
  });

  describe('League champions', () => {
    it('maps league-champions payload into kpiData', () => {
      const leagueChampionsPayload = {
        leagueChampions: [{ label: 'super-league', rank: [] }],
      };
      mockUseBffData.mockReturnValueOnce(
        mockBffResponse(
          { 'league-champions': leagueChampionsPayload },
          false,
          null,
        ),
      );

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.kpis.leagueChampions.kpiData).toEqual(
        leagueChampionsPayload,
      );
    });

    it('uses undefined kpiData when BFF data is null', () => {
      mockUseBffData.mockReturnValueOnce(mockBffResponse(null, false, null));

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.kpis.leagueChampions.kpiData).toBeUndefined();
    });
  });

  describe('Cup winners', () => {
    it('maps cup-winners payload into kpiData', () => {
      mockUseBffData
        .mockReturnValueOnce(mockBffResponse(null, false, null))
        .mockReturnValueOnce(
          mockBffResponse(
            { 'cup-winners': { bees_cup_acceleration: {} } },
            false,
            null,
          ),
        );

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.kpis.cupWinners.kpiData).toEqual({
        bees_cup_acceleration: {},
      });
    });

    it('uses undefined kpiData when cup hook returns null data', () => {
      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.kpis.cupWinners.kpiData).toBeUndefined();
    });
  });

  describe('Leagues leaderboard', () => {
    it('maps rank payload into kpiData', () => {
      const rankData = {
        'super-league': {
          label: 'Super League',
          rank: [
            {
              countryName: 'USA',
              position: '1',
              value: '95.5',
              flag: 'usa.png',
              measure: '%',
            },
            {
              countryName: 'BRA',
              position: '2',
              value: '88.3',
              flag: 'bra.png',
              measure: '%',
            },
          ],
        },
        'premier-league': {
          label: 'Premier League',
          rank: [
            {
              countryName: 'MEX',
              position: '1',
              value: '82.1',
              flag: 'mex.png',
              measure: '%',
            },
          ],
        },
      };

      mockUseBffData
        .mockReturnValueOnce(mockBffResponse(null, false, null))
        .mockReturnValueOnce(mockBffResponse(null, false, null))
        .mockReturnValueOnce(mockBffResponse({ rank: rankData }, false, null));

      const { result } = renderHook(() => useKpiRequests());

      const leaderboardData = result.current.kpis.leaguesLeaderboard.kpiData;
      expect(leaderboardData).toBeDefined();
      expect(leaderboardData['super-league']).toBeDefined();
      expect(leaderboardData['super-league'].rank).toHaveLength(2);
      expect(leaderboardData['premier-league']).toBeDefined();
      expect(leaderboardData['premier-league'].rank).toHaveLength(1);
    });

    it('uses undefined kpiData when leaderboard hook returns null data', () => {
      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.kpis.leaguesLeaderboard.kpiData).toBeUndefined();
    });
  });

  describe('Loading aggregation', () => {
    it('exposes per-kpi loading and top-level loading true when all hooks report loading', () => {
      mockUseBffData.mockReturnValue(mockBffResponse(null, true, null));

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.kpis.leagueChampions.loading).toBe(true);
      expect(result.current.kpis.cupWinners.loading).toBe(true);
      expect(result.current.kpis.leaguesLeaderboard.loading).toBe(true);
      expect(result.current.loading).toBe(true);
    });

    it('sets top-level loading true when any KPI is still loading', () => {
      let callCount = 0;
      mockUseBffData.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return mockBffResponse(null, true, null);
        }
        return mockBffResponse(idleLeaguesLeaderboardBffData, false, null);
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.loading).toBe(true);
    });

    it('sets top-level loading false when every KPI is idle', () => {
      mockUseBffData.mockReturnValue(
        mockBffResponse(idleLeaguesLeaderboardBffData, false, null),
      );

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.loading).toBe(false);
    });

    it('aggregates mixed per-kpi states', () => {
      let callCount = 0;
      mockUseBffData.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return mockBffResponse(
            {
              'league-champions': {
                leagueChampions: [{ label: 'super-league', rank: [] }],
              },
            },
            false,
            null,
          );
        }
        if (callCount === 2) {
          return mockBffResponse(null, true, null);
        }
        if (callCount === 3) {
          return mockBffResponse(null, false, new Error('Error'));
        }
        return mockBffResponse(null, false, null);
      });

      const { result } = renderHook(() => useKpiRequests());

      expect(result.current.kpis.leagueChampions.kpiData).toEqual({
        leagueChampions: [{ label: 'super-league', rank: [] }],
      });
      expect(result.current.kpis.cupWinners.loading).toBe(true);
      expect(result.current.loading).toBe(true);
    });
  });

  it('keeps the same kpi keys after rerender', () => {
    const { result, rerender } = renderHook(() => useKpiRequests());

    const firstStructure = Object.keys(result.current.kpis);

    rerender();

    expect(Object.keys(result.current.kpis)).toEqual(firstStructure);
  });
});
