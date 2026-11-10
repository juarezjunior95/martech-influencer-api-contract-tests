import React from 'react';

import { render, screen } from '@testing-library/react';

import { PnlSkeleton } from './PnlSkeleton';

interface MockSkeletonProps {
  height?: string;
  width?: string;
}

jest.mock('@hexa-ui/components', () => ({
  SkeletonLoader: ({ height, width }: MockSkeletonProps) => (
    <div data-testid="skeleton-loader" data-height={height} data-width={width}>
      Skeleton
    </div>
  ),
}));

describe('PnlSkeleton', () => {
  it('should render skeleton container with default id', () => {
    render(<PnlSkeleton />);

    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should render with custom data-testid', () => {
    render(<PnlSkeleton dataTestId="my-custom-skeleton" />);

    expect(screen.getByTestId('my-custom-skeleton')).toBeInTheDocument();
  });
});
