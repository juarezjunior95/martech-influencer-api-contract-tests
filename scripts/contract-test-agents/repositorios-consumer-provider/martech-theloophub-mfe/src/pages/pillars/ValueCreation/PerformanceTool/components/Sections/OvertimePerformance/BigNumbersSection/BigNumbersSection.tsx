import {
  BigNumber,
  ChartHeader,
  ContentCard,
  DataStateHandler,
  Skeleton,
} from 'components';
import { BigNumberOrientation } from 'components/BigNumber/types';
import { BigNumbersSectionData } from 'pages/pillars/ValueCreation/PerformanceTool/types';

import { StyledBigNumbersContainer } from './BigNumbersSection.styles';

interface BigNumbersSectionProps {
  title: string;
  tooltip?: string;
  data?: BigNumbersSectionData[];
  loading: boolean;
  error: Error | null;
  orientation?: BigNumberOrientation;
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
  onSelect?: (index: number) => void;
  defaultSelected?: number;
}

export const BigNumbersSection: React.FC<BigNumbersSectionProps> = ({
  title,
  tooltip,
  loading,
  error,
  data,
  orientation = 'vertical',
  skeletonProps = {
    height: '112px',
    width: '336px',
    length: 2,
    borderRadius: 'medium',
  },
  onSelect,
  defaultSelected = 0,
}) => {
  return (
    <ContentCard fullWidth title={title} tooltip={tooltip}>
      <DataStateHandler
        loading={loading}
        error={error}
        empty={!data || data.length === 0}
        skeletonProps={skeletonProps}
      >
        <StyledBigNumbersContainer>
          {data?.map((bigNumber, index) => (
            <BigNumber
              key={bigNumber.header.title}
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
              onClick={() => onSelect?.(index)}
              isSelected={defaultSelected === index}
              enableTruncation
            />
          ))}
        </StyledBigNumbersContainer>
      </DataStateHandler>
    </ContentCard>
  );
};
