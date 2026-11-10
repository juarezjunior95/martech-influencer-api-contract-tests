import { useIntl } from 'react-intl';

import { SegmentedControl } from '@hexa-ui/components';
import { LeagueType } from 'pages/pillars/ValueCreation/GrowthLeague/types';

interface LeagueSelectorProps {
  selectedLeague: LeagueType;
  onLeagueChange: (value: string) => void;
  dataTestId?: string;
}

export const LeagueSelector: React.FC<LeagueSelectorProps> = ({
  selectedLeague,
  onLeagueChange,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const leagueOptions = [
    {
      label: formatMessage({
        id: 'ValueCreation.GrowthLeague.leagues.super',
      }),
      value: 'super-league' as const,
    },
    {
      label: formatMessage({
        id: 'ValueCreation.GrowthLeague.leagues.premier',
      }),
      value: 'premier-league' as const,
    },
  ];

  return (
    <SegmentedControl
      data-testid={dataTestId ? `league-selector-${dataTestId}` : undefined}
      options={leagueOptions}
      value={selectedLeague}
      onValueChange={onLeagueChange}
    />
  );
};
