import { Skeleton } from 'components';

import {
  CustomSkeletonLoaderContainer,
  CustomSkeletonLoaderWrapper,
} from '../../../Overview/components/CustomSkeletonLoader/CustomSkeletonLoader.styles';

export interface CampaignsPerformanceSkeletonProps {
  dataTestId?: string;
}
export const CampaignsPerformanceSkeleton = ({
  dataTestId,
}: CampaignsPerformanceSkeletonProps) => {
  return (
    <CustomSkeletonLoaderContainer
      data-testid={
        dataTestId ? `skeleton-loader-container-${dataTestId}` : undefined
      }
    >
      <CustomSkeletonLoaderWrapper
        marginBottom
        data-testid={
          dataTestId ? `skeleton-loader-wrapper-${dataTestId}` : undefined
        }
      >
        <Skeleton
          width="1210px"
          height="468px"
          length={1}
          data-testid={
            dataTestId ? `skeleton-loader-item-${dataTestId}` : undefined
          }
        />
      </CustomSkeletonLoaderWrapper>
    </CustomSkeletonLoaderContainer>
  );
};
