import { useIntl } from 'react-intl';

import brandWorldImage from 'assets/img/PortfolioBrand/brand-world.png';
import { SubPillarCard } from 'components';

import { StyledSubPillarImageSmall } from '../../../PortfolioBrandHome.styles';

export const SubPilarBrandWorld: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <SubPillarCard
      title={formatMessage({
        id: 'PortfolioBrand.Home.brandWorld.title',
      })}
      description={formatMessage({
        id: 'PortfolioBrand.Home.brandWorld.description',
      })}
    >
      <StyledSubPillarImageSmall
        src={brandWorldImage}
        alt={formatMessage({
          id: 'PortfolioBrand.Home.brandWorld.alt',
        })}
      />
    </SubPillarCard>
  );
};
