import { Skeleton } from 'components/Skeleton';

interface LoadingSkeletonProps {
  dataTestId?: string;
}

export const LoadingSkeleton = ({ dataTestId }: LoadingSkeletonProps) => (
  <Skeleton
    dataTestId={dataTestId ? `${dataTestId}-loading-skeleton` : undefined}
    height="40px"
    width="160px"
    length={3}
    borderRadius="large"
  />
);
