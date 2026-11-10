import { Skeleton } from 'components/Skeleton';

export const SkeletonLoader = ({
  isExport,
  dataTestId,
}: {
  isExport: boolean;
  dataTestId?: string;
}) => {
  if (isExport) {
    return (
      <Skeleton
        width="1578px"
        height="745px"
        length={1}
        dataTestId={dataTestId ? `skeleton-${dataTestId}` : undefined}
      />
    );
  }

  return (
    <Skeleton
      width="1290px"
      height="684px"
      length={1}
      dataTestId={dataTestId ? `skeleton-${dataTestId}` : undefined}
    />
  );
};
