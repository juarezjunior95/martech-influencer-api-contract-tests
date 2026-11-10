jest.mock('components/Skeleton', () => ({
  Skeleton: ({
    height,
    width,
    length,
    borderRadius,
    dataTestId,
  }: {
    height: string;
    width: string;
    length: number;
    borderRadius: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'loading-skeleton'}
      data-height={height}
      data-width={width}
      data-length={length}
      data-border-radius={borderRadius}
    >
      Loading...
    </div>
  ),
}));

import { render, screen } from '@testing-library/react';

import { LoadingSkeleton } from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('should render skeleton component', () => {
    render(<LoadingSkeleton />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('should use correct height', () => {
    render(<LoadingSkeleton />);

    const skeleton = screen.getByTestId('loading-skeleton');
    expect(skeleton).toHaveAttribute('data-height', '40px');
  });

  it('should use correct width', () => {
    render(<LoadingSkeleton />);

    const skeleton = screen.getByTestId('loading-skeleton');
    expect(skeleton).toHaveAttribute('data-width', '160px');
  });

  it('should render single skeleton', () => {
    render(<LoadingSkeleton />);

    const skeleton = screen.getByTestId('loading-skeleton');
    expect(skeleton).toHaveAttribute('data-length', '3');
  });

  it('should use large border radius', () => {
    render(<LoadingSkeleton />);

    const skeleton = screen.getByTestId('loading-skeleton');
    expect(skeleton).toHaveAttribute('data-border-radius', 'large');
  });

  describe('data-testid Rendering', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(<LoadingSkeleton dataTestId="custom" />);

      expect(screen.getByTestId('custom-loading-skeleton')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<LoadingSkeleton />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="custom-loading-skeleton"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is explicitly undefined', () => {
      const { container } = render(<LoadingSkeleton dataTestId={undefined} />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="custom-loading-skeleton"]',
      );
      expect(elementsWithTestId.length).toBe(0);
      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });
  });
});
