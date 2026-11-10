import { Skeleton } from 'components';

import { AISummaryVolumePagesSkeletonStyles } from './AISummaryVolumePages.styles';

export const AISummaryVolumePagesSkeleton = () => {
  return (
    <AISummaryVolumePagesSkeletonStyles.Container>
      <Skeleton
        width={'100%'}
        height={'87px'}
        length={1}
        borderRadius={'small'}
      />

      <AISummaryVolumePagesSkeletonStyles.FirstSectionSkeleton>
        {Array.from({ length: 2 }, (_, index) => index).map((index) => (
          <Skeleton
            key={`first-section-skeleton-${index}`}
            width={'779px'}
            height={'289px'}
            length={1}
            borderRadius={'small'}
          />
        ))}
      </AISummaryVolumePagesSkeletonStyles.FirstSectionSkeleton>

      <AISummaryVolumePagesSkeletonStyles.SecondSectionSkeleton>
        {Array.from({ length: 4 }, (_, index) => index).map((index) => (
          <Skeleton
            key={`second-section-skeleton-${index}`}
            width={'779px'}
            height={'122px'}
            length={1}
            borderRadius={'small'}
          />
        ))}
      </AISummaryVolumePagesSkeletonStyles.SecondSectionSkeleton>
    </AISummaryVolumePagesSkeletonStyles.Container>
  );
};
