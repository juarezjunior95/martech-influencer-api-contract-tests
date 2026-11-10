import { useIntl } from 'react-intl';

import { SegmentedControl } from '@hexa-ui/components';

interface LeagueSelectorProps {
  leagueType: string;
  setLeagueType: (value: string) => void;
  dataTestId?: string;
}

export const LeagueSelector: React.FC<LeagueSelectorProps> = ({
  leagueType,
  setLeagueType,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();

  const options = [
    {
      label: formatMessage({
        id: 'ValueCreation.GrowthLeague.leagues.super',
        defaultMessage: '',
      }),
      value: 'super-league',
    },
    {
      label: formatMessage({
        id: 'ValueCreation.GrowthLeague.leagues.premier',
        defaultMessage: '',
      }),
      value: 'premier-league',
    },
  ];

  return (
    <SegmentedControl
      data-testid={
        dataTestId ? `league-selector-${leagueType}-${dataTestId}` : undefined
      }
      options={options}
      value={leagueType}
      onValueChange={(value) => setLeagueType(value)}
    />
  );
};
