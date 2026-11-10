import React, { CSSProperties, ReactNode } from 'react';

import { render, screen } from '@testing-library/react';

import { PortfolioSkeleton } from './PortfolioSkeleton';

interface MockSkeletonProps {
  height?: string;
  width?: string;
}

interface MockStyledProps {
  children?: ReactNode;
  style?: CSSProperties;
}

jest.mock('@hexa-ui/components', () => ({
  SkeletonLoader: ({ height, width }: MockSkeletonProps) => (
    <div data-testid="skeleton-loader" data-height={height} data-width={width}>
      Skeleton
    </div>
  ),
}));

jest.mock('../../constants', () => ({
  tableWidths: ['100px', '200px', '300px'],
}));

jest.mock('./PortfolioSkeleton.styles', () => ({
  StyledContent: ({ children, style }: MockStyledProps) => (
    <div data-testid="styled-content" style={style}>
      {children}
    </div>
  ),
}));

describe('PortfolioSkeleton', () => {
  it('should render with status role and aria-busy for accessibility', () => {
    render(<PortfolioSkeleton />);

    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute('aria-busy', 'true');
  });

  it('should render with data-testid', () => {
    render(<PortfolioSkeleton dataTestId="skeleton-test-id" />);

    expect(screen.getByTestId('skeleton-test-id')).toBeInTheDocument();
  });
});
