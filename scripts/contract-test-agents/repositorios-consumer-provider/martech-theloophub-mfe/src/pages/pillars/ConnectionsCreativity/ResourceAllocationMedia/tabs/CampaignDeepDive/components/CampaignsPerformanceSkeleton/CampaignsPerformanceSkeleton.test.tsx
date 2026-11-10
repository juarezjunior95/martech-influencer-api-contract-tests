import { render, screen } from '@testing-library/react';

import { CampaignsPerformanceSkeleton } from './CampaignsPerformanceSkeleton';

jest.mock('components', () => ({
  Skeleton: ({ width, height, length, 'data-testid': dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'skeleton'}
      data-width={width}
      data-height={height}
      data-length={length}
    />
  ),
}));

jest.mock(
  '../../../Overview/components/CustomSkeletonLoader/CustomSkeletonLoader.styles',
  () => ({
    CustomSkeletonLoaderContainer: ({
      children,
      'data-testid': dataTestId,
    }: any) => (
      <div data-testid={dataTestId ?? 'skeleton-container'}>{children}</div>
    ),
    CustomSkeletonLoaderWrapper: ({
      children,
      marginBottom,
      'data-testid': dataTestId,
    }: any) => (
      <div
        data-testid={dataTestId ?? 'skeleton-wrapper'}
        data-margin-bottom={marginBottom}
      >
        {children}
      </div>
    ),
  }),
);

describe('CampaignsPerformanceSkeleton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders wrapper with marginBottom prop', () => {
    render(<CampaignsPerformanceSkeleton />);

    expect(screen.getByTestId('skeleton-wrapper')).toHaveAttribute(
      'data-margin-bottom',
      'true',
    );
  });

  it('renders skeleton with correct dimensions and length', () => {
    render(<CampaignsPerformanceSkeleton />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('data-width', '1210px');
    expect(skeleton).toHaveAttribute('data-height', '468px');
    expect(skeleton).toHaveAttribute('data-length', '1');
  });

  describe('data-testid Rendering', () => {
    it('renders custom data-testid when dataTestId is provided', () => {
      render(<CampaignsPerformanceSkeleton dataTestId="campaigns-skeleton" />);

      expect(
        screen.getByTestId('skeleton-loader-container-campaigns-skeleton'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('skeleton-loader-wrapper-campaigns-skeleton'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('skeleton-loader-item-campaigns-skeleton'),
      ).toBeInTheDocument();
    });

    it('does not render custom data-testid when dataTestId is not provided', () => {
      render(<CampaignsPerformanceSkeleton />);

      expect(
        screen.queryByTestId('skeleton-loader-container-'),
      ).not.toBeInTheDocument();
    });
  });
});
