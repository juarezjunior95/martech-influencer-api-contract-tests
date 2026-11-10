import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  BigNumber,
  ChartHeader,
  DataStateHandler,
  SubPillarCard,
} from 'components';
import { useMediaQuery, usePageFilterManagement } from 'hooks';

import { PortfolioBrandHomeBigNumberCardData } from '../../../PortfolioBrandHome';

export interface SubPilarPortfolioStrategyProps {
  loading: boolean;
  error: Error | null;
  data: PortfolioBrandHomeBigNumberCardData[];
}

export const SubPilarPortfolioStrategy: React.FC<
  SubPilarPortfolioStrategyProps
> = ({ loading, error, data }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');
  const { apply: applyFilters, updateForm } = usePageFilterManagement(
    'portfolio-brand-home',
  );

  const handleCardClick = (title: string) => {
    if (title === 'Megabrands Volume') {
      navigate('/portfolio-brand/portfolio-performance');
    }

    if (title === 'Megabrands Brand Power') {
      updateForm('scopes', 'portfolio');
      updateForm('sub_scopes', 'Megabrands');
      applyFilters();
      navigate('/portfolio-brand/brand-power-book/power-book');
    }
  };

  return (
    <SubPillarCard
      title={formatMessage({
        id: 'PortfolioBrand.Home.portfolioStrategy.title',
      })}
      description={formatMessage({
        id: 'PortfolioBrand.Home.portfolioStrategy.description',
      })}
    >
      <DataStateHandler
        loading={loading}
        error={error}
        empty={!data}
        skeletonProps={{
          height: '156px',
          width: '100%',
          length: 2,
          hasContainer: false,
        }}
      >
        {data?.map((cardData) => (
          <BigNumber
            key={cardData.title}
            header={
              <ChartHeader
                title={cardData.title}
                period={cardData.period}
                config={{ inline: 'horizontal', type: 'small' }}
              />
            }
            data={cardData.bigNumberData}
            asCard={true}
            size={isDesktopLarge ? 'medium' : 'small'}
            onClick={() => handleCardClick(cardData.title)}
            spacing="loose"
            style={{ minHeight: '156px' }}
          />
        ))}
      </DataStateHandler>
    </SubPillarCard>
  );
};
