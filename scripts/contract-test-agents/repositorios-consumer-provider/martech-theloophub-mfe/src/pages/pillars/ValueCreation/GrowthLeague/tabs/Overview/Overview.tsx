import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';

import { LeaderboardSection, LeagueSection } from './components';

interface OverviewProps {
  dataTestId?: string;
}

export const Overview: React.FC<OverviewProps> = ({ dataTestId }) => {
  useDataRefreshForTab('Growth League - Overview');

  return (
    <div
      className="overview"
      data-testid={dataTestId ? `tabpanel-overview-${dataTestId}` : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <LeagueSection
        dataTestId={dataTestId ? `${dataTestId}-overview` : undefined}
      />

      <LeaderboardSection
        dataTestId={dataTestId ? `${dataTestId}-overview` : undefined}
      />
    </div>
  );
};

export default Overview;
