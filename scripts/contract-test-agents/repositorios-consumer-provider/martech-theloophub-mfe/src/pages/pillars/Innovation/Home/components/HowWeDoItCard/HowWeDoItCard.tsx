import { useIntl } from 'react-intl';

import {
  BigNumber,
  ChartHeader,
  DataStateHandler,
  SubPillarCard,
} from 'components';
import { useMediaQuery } from 'hooks';

import { StyledHowWeDoItCardRoot } from './HowWeDoItCard.styles';
import type { HowWeDoItCardProps } from './types';

const SKELETON_HEIGHT = '166px';

export const HowWeDoItCard = ({
  titleId,
  descriptionId,
  section,
  loading,
  error,
  minHeight = SKELETON_HEIGHT,
  dataTestId,
}: HowWeDoItCardProps) => {
  const { formatMessage } = useIntl();
  const isDesktopLarge = useMediaQuery('(min-width: 1440px)');

  return (
    <StyledHowWeDoItCardRoot
      data-testid="new-how-we-do-it-card"
      data-instance-testid={dataTestId}
    >
      <SubPillarCard
        title={formatMessage({ id: titleId })}
        description={formatMessage({ id: descriptionId })}
      >
        <DataStateHandler
          loading={loading}
          error={error}
          empty={!section}
          skeletonProps={{
            height: SKELETON_HEIGHT,
            width: '100%',
            length: 1,
          }}
        >
          <BigNumber
            header={
              section ? (
                <ChartHeader
                  title={section.title}
                  period={section.period}
                  measure={section.measure ? section.measure : undefined}
                  config={{ inline: 'horizontal', type: 'small' }}
                  dataTestId={
                    dataTestId ? `${dataTestId}-chart-header` : undefined
                  }
                />
              ) : null
            }
            data={section?.bigNumberData ?? []}
            asCard
            size={isDesktopLarge ? 'medium' : 'small'}
            spacing="loose"
            style={{ minHeight }}
          />
        </DataStateHandler>
      </SubPillarCard>
    </StyledHowWeDoItCardRoot>
  );
};
