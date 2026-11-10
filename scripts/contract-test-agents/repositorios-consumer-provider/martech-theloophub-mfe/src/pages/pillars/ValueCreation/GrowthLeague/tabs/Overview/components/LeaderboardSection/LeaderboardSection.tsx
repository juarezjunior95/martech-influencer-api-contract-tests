import { useIntl } from 'react-intl';

import { BasicContainer } from 'components';
import { LEAGUE_OPTIONS } from 'pages/pillars/ValueCreation/GrowthLeague/constants';
import { StyledGridLeagueContainer } from 'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles';

import { useKpiRequests } from '../../hooks/useKpiRequests';
import { Leaderboard } from '../Leaderboard/Leaderboard';
import { RankingLink } from '../RankingLink/RankingLink';

interface LeaderboardSectionProps {
  dataTestId?: string;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  dataTestId,
}) => {
  const { formatMessage } = useIntl();

  const { kpis } = useKpiRequests();
  const {
    kpiData: leaguesLeaderboardData,
    loading: leaguesLeaderboardLoading,
  } = kpis.leaguesLeaderboard;

  return (
    <BasicContainer
      dataTestId={dataTestId ? `${dataTestId}-leaderboard-section` : undefined}
      header={{
        title: formatMessage({
          id: 'ValueCreation.GrowthLeague.LeaguesLeaderboard.title',
          defaultMessage: '',
        }),
        titleSize: 'H3',
      }}
    >
      <StyledGridLeagueContainer
        data-testid={dataTestId ? `leaderboard-grid-${dataTestId}` : undefined}
      >
        {LEAGUE_OPTIONS.map((league) => (
          <div
            key={league.value}
            data-testid={
              dataTestId
                ? `leaderboard-item-${league.value}-${dataTestId}`
                : undefined
            }
          >
            <Leaderboard
              dataTestId={dataTestId ? `${dataTestId}-${league.id}` : undefined}
              title={formatMessage({
                id: league.id,
                defaultMessage: '',
              })}
              rankData={leaguesLeaderboardData?.ranking?.[league.value]}
              loading={leaguesLeaderboardLoading}
            />
            <RankingLink
              dataTestId={
                dataTestId
                  ? `${dataTestId}-leaderboard-link-${league.value}`
                  : undefined
              }
              to={`/reports/value-creation/growth-league/rankings?competition-type=league&league-type=${league.value}`}
            />
          </div>
        ))}
      </StyledGridLeagueContainer>
    </BasicContainer>
  );
};
