import { BigNumber, ChartHeader, DataStateHandler, Skeleton } from 'components';
import { BigNumberSecondaryInfo } from 'components/BigNumber/components/BigNumberSecondaryInfo';
import { BigNumberOrientation } from 'components/BigNumber/types';
import { BigNumbersKpiData } from 'pages/pillars/ValueCreation/VolumePages/types';

import {
  StyledBigNumberContainer,
  StyledBottomInfo,
  StyledCardWrapper,
} from './BigNumberSection.styles';

interface BigNumbersSectionProps {
  loading: boolean;
  error: Error | null;
  data?: BigNumbersKpiData[];
  orientation?: BigNumberOrientation;
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
  dataTestId?: string;
}

export const BigNumbersSection: React.FC<BigNumbersSectionProps> = ({
  loading,
  error,
  data,
  orientation = 'vertical',
  skeletonProps = {
    height: '154px',
    width: '534px',
    length: 3,
    borderRadius: 'medium',
    gap: 'large',
  },
  dataTestId,
}) => (
  <DataStateHandler
    dataTestId={dataTestId ? `${dataTestId}-big-numbers-section` : undefined}
    loading={loading}
    error={error}
    empty={!data || data.length === 0}
    skeletonProps={skeletonProps}
  >
    <StyledBigNumberContainer>
      {data?.map((bigNumber) => (
        <StyledCardWrapper
          key={bigNumber.header.title + JSON.stringify(bigNumber.data)}
        >
          <BigNumber
            dataTestId={dataTestId ? `${dataTestId}` : undefined}
            header={
              <ChartHeader
                title={bigNumber.header.title}
                period={bigNumber.header.period}
                config={{
                  inline: 'vertical',
                  type: 'large',
                  periodPosition: 'top-right',
                }}
              />
            }
            data={bigNumber.data}
            size="medium"
            alignment="center"
            spacing="loose"
            orientation={orientation}
            fullWidth
          />
          {bigNumber.bottomInfo && (
            <StyledBottomInfo>
              <BigNumberSecondaryInfo item={bigNumber.bottomInfo} />
            </StyledBottomInfo>
          )}
        </StyledCardWrapper>
      ))}
    </StyledBigNumberContainer>
  </DataStateHandler>
);
