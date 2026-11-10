import { useIntl } from 'react-intl';

import { SegmentedControl } from '@hexa-ui/components';

interface CompetitionSelectorProps {
  competitionType: string;
  setCompetitionType: (value: string) => void;
  dataTestId?: string;
}

export const CompetitionSelector: React.FC<CompetitionSelectorProps> = ({
  competitionType,
  setCompetitionType,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();

  const options = [
    {
      label: formatMessage({
        id: 'ValueCreation.GrowthLeague.Rankings.League',
        defaultMessage: '',
      }),
      value: 'league',
    },
    {
      label: formatMessage({
        id: 'ValueCreation.GrowthLeague.Rankings.Cup',
        defaultMessage: '',
      }),
      value: 'cup',
    },
  ];

  return (
    <SegmentedControl
      data-testid={
        dataTestId
          ? `competition-selector-${competitionType}-${dataTestId}`
          : undefined
      }
      options={options}
      value={competitionType}
      onValueChange={(value) => setCompetitionType(value)}
    />
  );
};
