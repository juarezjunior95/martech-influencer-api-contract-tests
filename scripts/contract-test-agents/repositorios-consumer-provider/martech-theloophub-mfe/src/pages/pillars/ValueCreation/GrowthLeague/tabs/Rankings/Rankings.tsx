import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { BasicContainer } from 'components';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { useGoogleAnalytics } from 'hooks';

import { CompetitionSelector, CupSection, LeagueSection } from './components';
import { TEMP_HIDE_COMPETITION_SELECTOR } from './constants';

interface RankingsProps {
  dataTestId?: string;
}

export const Rankings: React.FC<RankingsProps> = ({ dataTestId }) => {
  useDataRefreshForTab('Growth League - Ranking');
  const location = useLocation();
  const navigate = useNavigate();
  const trackGA = useGoogleAnalytics();

  const competitionTypeUrl = new URLSearchParams(location.search).get(
    'competition-type',
  );
  const leagueTypeUrl = new URLSearchParams(location.search).get('league-type');

  const [competitionType, setCompetitionType] = useState(
    competitionTypeUrl || 'league',
  );

  const [leagueType, setLeagueType] = useState(leagueTypeUrl || 'super-league');

  const { formatMessage } = useIntl();
  const shouldHideCompetitionSelector = TEMP_HIDE_COMPETITION_SELECTOR === true;
  const shouldShowLeagueSection =
    shouldHideCompetitionSelector || competitionType === 'league';
  const shouldShowCupSection =
    shouldHideCompetitionSelector === false && competitionType === 'cup';

  const handleCompetitionTypeChange = (value: string) => {
    setCompetitionType(value);
    navigate({
      pathname: location.pathname,
      search: `?competition-type=${value}`,
    });
    trackGA({
      event_category: 'Content',
      event_action: 'Content',
      event_label: value,
    });
  };

  const handleLeagueTypeChange = (value: string) => {
    setLeagueType(value);
    navigate({
      pathname: location.pathname,
      search: `?competition-type=${competitionType}&league-type=${value}`,
    });
    trackGA({
      event_category: 'Filter',
      event_action: 'Select',
      event_label: value,
    });
  };

  useEffect(() => {
    const isRankingsTab = location.pathname.includes('rankings');
    if (isRankingsTab) {
      navigate({
        pathname: location.pathname,
        search: `?competition-type=${competitionType}&league-type=${leagueType}`,
      });
    }
  }, [competitionType, leagueType, location.pathname, navigate]);

  return (
    <BasicContainer
      dataTestId={dataTestId ? `${dataTestId}-rankings` : undefined}
      header={{
        title: formatMessage({
          id: 'ValueCreation.GrowthLeague.Rankings.rankingBreakdown',
          defaultMessage: '',
        }),
        titleSize: 'H2',
        rightContent: shouldHideCompetitionSelector ? undefined : (
          <CompetitionSelector
            dataTestId={dataTestId ? `${dataTestId}-rankings` : undefined}
            competitionType={competitionType}
            setCompetitionType={handleCompetitionTypeChange}
          />
        ),
      }}
    >
      {shouldShowLeagueSection && (
        <LeagueSection
          dataTestId={dataTestId ? `${dataTestId}-rankings` : undefined}
          leagueType={leagueType}
          setLeagueType={handleLeagueTypeChange}
        />
      )}
      {shouldShowCupSection && (
        <CupSection
          dataTestId={dataTestId ? `${dataTestId}-rankings` : undefined}
        />
      )}
    </BasicContainer>
  );
};
