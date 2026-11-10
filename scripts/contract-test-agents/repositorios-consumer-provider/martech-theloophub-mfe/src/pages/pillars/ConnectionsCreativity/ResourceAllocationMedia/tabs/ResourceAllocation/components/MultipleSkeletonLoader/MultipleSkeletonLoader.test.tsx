import { render, screen } from '@testing-library/react';

import { MultipleSkeletonLoader } from './MultipleSkeletonLoader';

jest.mock('components', () => ({
  Skeleton: ({
    borderRadius,
    width,
    height,
    length,
    dataTestId,
  }: {
    borderRadius: string;
    width: string;
    height: string;
    length: number;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'skeleton'}
      data-border-radius={borderRadius}
      data-width={width}
      data-height={height}
      data-length={length}
    />
  ),
}));

jest.mock('./MultipleSkeletonLoader.styles', () => ({
  StyledSkeletonContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'skeleton-container'}>{children}</div>,
  StyledSkeletonContent: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'skeleton-content'}>{children}</div>,
  StyledSkeletonLabelCol: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  StyledSkeletonBarsWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('MultipleSkeletonLoader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders 5 blocks each with 4 skeletons (1 label + 1 flag + 2 bars)', () => {
    render(<MultipleSkeletonLoader />);

    const contents = screen.getAllByTestId('skeleton-content');
    expect(contents).toHaveLength(5);

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(20);
  });

  it('each block has one label skeleton (60×16px), one flag skeleton (32×32px) and two bar skeletons (100%×48px)', () => {
    render(<MultipleSkeletonLoader />);

    const contents = screen.getAllByTestId('skeleton-content');
    const firstBlock = contents[0];
    const blockSkeletons = firstBlock.querySelectorAll(
      '[data-testid="skeleton"]',
    );

    expect(blockSkeletons).toHaveLength(4);
    expect(blockSkeletons[0]).toHaveAttribute('data-width', '60px');
    expect(blockSkeletons[0]).toHaveAttribute('data-height', '16px');
    expect(blockSkeletons[1]).toHaveAttribute('data-width', '32px');
    expect(blockSkeletons[1]).toHaveAttribute('data-height', '32px');
    expect(blockSkeletons[2]).toHaveAttribute('data-width', '100%');
    expect(blockSkeletons[2]).toHaveAttribute('data-height', '48px');
    expect(blockSkeletons[3]).toHaveAttribute('data-width', '100%');
    expect(blockSkeletons[3]).toHaveAttribute('data-height', '48px');
  });

  it('propagates dataTestId to the container, and omits test ids when not provided', () => {
    const { rerender } = render(
      <MultipleSkeletonLoader dataTestId="test-skeleton" />,
    );
    expect(screen.getByTestId('test-skeleton')).toBeInTheDocument();

    rerender(<MultipleSkeletonLoader />);
    expect(screen.queryByTestId('test-skeleton')).not.toBeInTheDocument();
    expect(screen.getByTestId('skeleton-container')).toBeInTheDocument();
  });
});
