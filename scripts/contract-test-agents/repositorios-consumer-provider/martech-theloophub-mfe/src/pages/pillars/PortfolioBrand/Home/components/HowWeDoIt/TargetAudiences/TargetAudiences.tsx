import { useIntl } from 'react-intl';

import {
  BigNumber,
  ChartHeader,
  DataStateHandler,
  SubPillarCard,
} from 'components';
import { useMediaQuery } from 'hooks';

import { PortfolioBrandHomeBigNumberCardData } from '../../../PortfolioBrandHome';

export interface TargetAudiencesProps {
  data: PortfolioBrandHomeBigNumberCardData;
  loading: boolean;
  error: Error | null;
}

export const TargetAudiences: React.FC<TargetAudiencesProps> = ({
  data,
  loading,
  error,
}) => {
  const { formatMessage } = useIntl();
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');

  return (
    <SubPillarCard
      title={formatMessage({
        id: 'PortfolioBrand.Home.targetAudiences.title',
      })}
      description={formatMessage({
        id: 'PortfolioBrand.Home.targetAudiences.description',
      })}
    >
      <DataStateHandler
        loading={loading}
        error={error}
        empty={!data}
        skeletonProps={{
          height: '156px',
          width: '100%',
          length: 1,
        }}
      >
        <BigNumber
          header={
            <ChartHeader
              title={data?.title}
              period={data?.period}
              config={{ inline: 'horizontal', type: 'small' }}
            />
          }
          data={data?.bigNumberData ?? []}
          asCard={true}
          size={isDesktopLarge ? 'medium' : 'small'}
          spacing="loose"
          style={{ minHeight: '156px' }}
        />
      </DataStateHandler>
    </SubPillarCard>
  );
};
