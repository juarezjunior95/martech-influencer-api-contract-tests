import { Skeleton } from 'components';

import {
  StyledSkeletonBarsWrapper,
  StyledSkeletonContainer,
  StyledSkeletonContent,
  StyledSkeletonLabelCol,
} from './MultipleSkeletonLoader.styles';

export interface MultipleSkeletonLoaderProps {
  dataTestId?: string;
}

export const MultipleSkeletonLoader: React.FC<MultipleSkeletonLoaderProps> = ({
  dataTestId,
}) => {
  return (
    <StyledSkeletonContainer data-testid={dataTestId}>
      {Array.from({ length: 5 }, (_, index) => index).map((index) => (
        <StyledSkeletonContent
          key={`skeleton-row-${index}`}
          data-testid={
            dataTestId ? `skeleton-${dataTestId}-content-${index}` : undefined
          }
        >
          <StyledSkeletonLabelCol>
            <Skeleton
              borderRadius="small"
              width="60px"
              height="16px"
              length={1}
              dataTestId={
                dataTestId ? `skeleton-${dataTestId}-label-${index}` : undefined
              }
            />
            <Skeleton
              width="32px"
              height="32px"
              borderRadius="large"
              length={1}
              dataTestId={
                dataTestId ? `skeleton-${dataTestId}-flag-${index}` : undefined
              }
            />
          </StyledSkeletonLabelCol>

          <StyledSkeletonBarsWrapper>
            <Skeleton
              borderRadius="small"
              width="100%"
              height="48px"
              length={1}
              dataTestId={
                dataTestId
                  ? `skeleton-${dataTestId}-bar-ac-${index}`
                  : undefined
              }
            />
            <Skeleton
              borderRadius="small"
              width="100%"
              height="48px"
              length={1}
              dataTestId={
                dataTestId
                  ? `skeleton-${dataTestId}-bar-bu-${index}`
                  : undefined
              }
            />
          </StyledSkeletonBarsWrapper>
        </StyledSkeletonContent>
      ))}
    </StyledSkeletonContainer>
  );
};
