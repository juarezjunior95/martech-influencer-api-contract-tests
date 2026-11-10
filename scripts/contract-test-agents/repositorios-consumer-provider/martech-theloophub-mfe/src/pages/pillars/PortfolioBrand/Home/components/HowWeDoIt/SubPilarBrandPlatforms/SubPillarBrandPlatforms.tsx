import { useIntl } from 'react-intl';

import brandPlatformsImage from 'assets/img/PortfolioBrand/brand-platforms.png';
import { SubPillarCard } from 'components';

import { StyledSubPillarImageSmall } from '../../../PortfolioBrandHome.styles';

export const SubPilarBrandPlatforms: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <SubPillarCard
      title={formatMessage({
        id: 'PortfolioBrand.Home.brandPlatforms.title',
      })}
      description={formatMessage({
        id: 'PortfolioBrand.Home.brandPlatforms.description',
      })}
    >
      <StyledSubPillarImageSmall
        src={brandPlatformsImage}
        alt={formatMessage({
          id: 'PortfolioBrand.Home.brandPlatforms.alt',
        })}
      />
    </SubPillarCard>
  );
};
