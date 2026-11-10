import { useMemo } from 'react';

import { useBffData } from 'hooks';
import {
  CupWinnersType,
  LeagueChampionsType,
  LeagueLeaderboardType,
} from 'pages/pillars/ValueCreation/GrowthLeague/types';

import { TEMP_HIDE_CUP_WINNERS } from '../constants';

const BFF_VIEW_IDS = {
  leagueChampions: 'value-creation_growth-league_overview_league-champions',
  cupWinners: 'value-creation_growth-league_overview_cup-winners',
  leaguesLeaderboard: 'value-creation_growth-league_overview_rank',
};

type CupWinnersData = { cupWinners: CupWinnersType };
type LeaguesLeaderboardData = { ranking: LeagueLeaderboardType };

export function useKpiRequests() {
  const leagueChampions = useBffData({
    id: BFF_VIEW_IDS.leagueChampions,
    kpiGroup: 'growth_league',
    skipMainFilters: true,
  });

  const cupWinners = useBffData({
    id: BFF_VIEW_IDS.cupWinners,
    kpiGroup: 'growth_league',
    skipMainFilters: true,
    skipRequest: TEMP_HIDE_CUP_WINNERS,
  });

  const leaguesLeaderboard = useBffData({
    id: BFF_VIEW_IDS.leaguesLeaderboard,
    kpiGroup: 'growth_league',
    skipMainFilters: true,
  });

  const kpis = useMemo(
    () => ({
      leagueChampions: {
        kpiData: leagueChampions.data?.[
          'league-champions'
        ] as LeagueChampionsType,
        loading: leagueChampions.loading,
      },
      cupWinners: {
        kpiData: cupWinners.data?.['cup-winners'] as CupWinnersData,
        loading: cupWinners.loading,
      },
      leaguesLeaderboard: {
        kpiData: leaguesLeaderboard.data?.rank as LeaguesLeaderboardData,
        loading: leaguesLeaderboard.loading,
      },
    }),
    [
      leagueChampions.data,
      leagueChampions.loading,
      cupWinners.data,
      cupWinners.loading,
      leaguesLeaderboard.data,
      leaguesLeaderboard.loading,
    ],
  );

  const loading = Object.values(kpis).some((kpi) => kpi.loading);

  return { kpis, loading };
}
