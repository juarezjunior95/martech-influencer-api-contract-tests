import {
  BigNumber,
  ChartHeader,
  ContentCard,
  DataStateHandler,
  Skeleton,
} from 'components';
import { BigNumberOrientation } from 'components/BigNumber/types';

import { UseBigNumberData } from '../../../types';
import { StyledBigNumbersContainer } from './BigNumbersSection.styles';

interface BigNumbersSectionProps {
  data: UseBigNumberData;
  orientation?: BigNumberOrientation;
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
}

export const BigNumbersSection: React.FC<BigNumbersSectionProps> = ({
  data,
  orientation = 'vertical',
  skeletonProps = {
    height: '112px',
    width: '336px',
    length: 2,
    borderRadius: 'medium',
  },
}) => {
  return (
    <ContentCard
      fullWidth
      title={data.title}
      data-testid="commercial-results-big-numbers-section"
    >
      <DataStateHandler
        loading={data.loading}
        error={data.error}
        empty={!data.bigNumbersData || data.bigNumbersData.length === 0}
        skeletonProps={skeletonProps}
      >
        <StyledBigNumbersContainer>
          {data.bigNumbersData?.map((bigNumber, index) => (
            <BigNumber
              dataTestId={`commercial-results-big-number-${index}`}
              key={`${bigNumber.header.title}-${index}`}
              header={
                <ChartHeader
                  title={bigNumber.header.title}
                  measure={bigNumber.header.measure}
                  config={{ inline: 'horizontal', type: 'large' }}
                />
              }
              data={bigNumber.data}
              size="small"
              asCard
              spacing="loose"
              orientation={orientation}
              fullWidth
              onClick={
                data?.handleBigNumbersSelect
                  ? () => data.handleBigNumbersSelect(index)
                  : undefined
              }
              isSelected={data.selectedBigNumberIndex === index}
              enableTruncation
            />
          ))}
        </StyledBigNumbersContainer>
      </DataStateHandler>
    </ContentCard>
  );
};
