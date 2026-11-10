import { Skeleton } from 'components/Skeleton';

interface FilterSkeletonProps {
  dataTestId?: string;
}

export const FilterSkeleton = ({ dataTestId }: FilterSkeletonProps) => (
  <Skeleton
    length={1}
    width="130px"
    height="40px"
    borderRadius="large"
    dataTestId={dataTestId}
  />
);
