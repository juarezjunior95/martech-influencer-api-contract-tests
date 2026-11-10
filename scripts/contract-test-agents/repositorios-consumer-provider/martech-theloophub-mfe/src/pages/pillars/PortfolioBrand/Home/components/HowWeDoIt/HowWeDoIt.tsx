import { useIntl } from 'react-intl';

import { BasicContainer } from 'components';
import { useMediaQuery } from 'hooks';

import { PortfolioBrandHomeBigNumberCardData } from '../../PortfolioBrandHome';
import { StyledSubPillarCardsGrid } from '../../PortfolioBrandHome.styles';
import { SubPilarBrandPlatforms } from './SubPilarBrandPlatforms/SubPillarBrandPlatforms';
import { SubPilarBrandWorld } from './SubPilarBrandWorld/SubPillarBrandWorld';
import { SubPilarPortfolioStrategy } from './SubPilarPortfolioStrategy/SubPillarPortfolioStrategy';
import { TargetAudiences } from './TargetAudiences/TargetAudiences';

export interface HowWeDoItProps {
  loading: boolean;
  error: Error | null;
  targetAudiencesData: PortfolioBrandHomeBigNumberCardData;
  portfolioStrategyData: PortfolioBrandHomeBigNumberCardData[];
}

export const HowWeDoIt: React.FC<HowWeDoItProps> = ({
  loading,
  error,
  targetAudiencesData,
  portfolioStrategyData,
}) => {
  const { formatMessage } = useIntl();
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  return (
    <BasicContainer
      header={{
        title: formatMessage({
          id: 'PortfolioBrand.Home.containerTitleHowWeDoIt',
        }),
        titleSize: isDesktopLarge ? 'H2' : 'H3',
      }}
      layout={{ bodyPadding: false, background: '#fafafa', border: 'gray' }}
    >
      <StyledSubPillarCardsGrid>
        <SubPilarPortfolioStrategy
          loading={loading}
          error={error}
          data={portfolioStrategyData}
        />
        <SubPilarBrandWorld />
        <SubPilarBrandPlatforms />
        <TargetAudiences
          data={targetAudiencesData}
          loading={loading}
          error={error}
        />
      </StyledSubPillarCardsGrid>
    </BasicContainer>
  );
};
