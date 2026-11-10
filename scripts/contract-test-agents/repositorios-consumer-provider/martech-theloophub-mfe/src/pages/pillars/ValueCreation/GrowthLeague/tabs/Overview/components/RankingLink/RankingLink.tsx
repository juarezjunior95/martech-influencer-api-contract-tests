import { useIntl } from 'react-intl';

import { ArrowRight } from '@hexa-ui/icons';
import { StyledBoxLink } from 'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles';
import { StyledLinkA } from 'shared/Styles';

interface RankingLinkProps {
  to: string;
  dataTestId?: string;
}

export const RankingLink: React.FC<RankingLinkProps> = ({ to, dataTestId }) => {
  const { formatMessage } = useIntl();

  return (
    <StyledBoxLink
      data-testid={dataTestId ? `ranking-link-${dataTestId}` : undefined}
    >
      <StyledLinkA
        data-testid={dataTestId ? `ranking-link-text-${dataTestId}` : undefined}
        href={to}
      >
        {formatMessage({ id: 'ValueCreation.GrowthLeague.seeFullRanking' })}
      </StyledLinkA>
      <ArrowRight
        data-testid={
          dataTestId ? `ranking-link-arrow-${dataTestId}` : undefined
        }
        size="medium"
      />
    </StyledBoxLink>
  );
};
