import React from 'react';

import {
  StyledSkeletonContainer,
  StyledSkeletonLoader,
} from './Skeleton.styles';
import { SkeletonProps } from './types';

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  length,
  variant = 'body',
  borderRadius = 'medium',
  gap = 'small',
  hasContainer = true,
  dataTestId,
}) => {
  const skeletonItems = Array.from({ length }, (_, index) => (
    <StyledSkeletonLoader
      key={`skeleton-${index}${width}${height}`}
      data-testid={dataTestId ? `${dataTestId}-item-${index}` : undefined}
      borderRadius={borderRadius}
      width={width}
      height={height}
      variant={variant}
    />
  ));

  if (hasContainer) {
    return (
      <StyledSkeletonContainer data-testid={dataTestId} gap={gap}>
        {skeletonItems}
      </StyledSkeletonContainer>
    );
  }

  return <>{skeletonItems}</>;
};
