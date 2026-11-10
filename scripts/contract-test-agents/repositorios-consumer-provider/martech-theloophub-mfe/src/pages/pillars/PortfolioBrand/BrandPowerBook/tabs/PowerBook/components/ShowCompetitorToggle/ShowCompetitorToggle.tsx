import { useIntl } from 'react-intl';

import { Paragraph } from '@hexa-ui/components';
import { Toggle } from 'components/Toggle';

import { StyledShowCompetitorToggle } from './ShowCompetitorToggle.styles';

interface ShowCompetitorToggleProps {
  showCompetitor: boolean;
  setShowCompetitor: (showCompetitor: boolean) => void;
  isDisabled?: boolean;
  handleGAEvent?: (label: string) => void;
  dataTestId?: string;
}

export const ShowCompetitorToggle: React.FC<ShowCompetitorToggleProps> = ({
  handleGAEvent,
  showCompetitor,
  setShowCompetitor,
  isDisabled,
  dataTestId,
}) => {
  const { formatMessage } = useIntl();
  const toggleLabel = formatMessage({
    id: 'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceBreakdown.showCompetitorToggle.title',
  });
  const onChange = (e: boolean) => {
    handleGAEvent?.(e.toString());
    setShowCompetitor(!showCompetitor);
  };
  return (
    <StyledShowCompetitorToggle data-testid={dataTestId}>
      <Toggle
        checked={showCompetitor}
        onCheckedChange={(e) => onChange(e)}
        ariaLabel={toggleLabel}
        disabled={isDisabled}
      />
      <Paragraph style={{ opacity: isDisabled ? 0.5 : 1 }}>
        {toggleLabel}
      </Paragraph>
    </StyledShowCompetitorToggle>
  );
};
