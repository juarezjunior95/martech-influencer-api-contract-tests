import { render, screen } from '@testing-library/react';

import { LoadingTableSkeleton } from './LoadingTableSkeleton';

jest.mock('@hexa-ui/components', () => ({
  SkeletonLoader: ({
    height,
    width,
    'data-testid': dataTestId,
  }: {
    height: string;
    width: string;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'skeleton-loader'}
      data-height={height}
      data-width={width}
    />
  ),
}));

jest.mock(
  'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles',
  () => ({
    TableContainer: ({
      children,
      'data-testid': testId,
    }: {
      children: React.ReactNode;
      'data-testid'?: string;
    }) => <div data-testid={testId ?? 'table-container'}>{children}</div>,
  }),
);

describe('LoadingTableSkeleton', () => {
  describe('rendering', () => {
    it('renders 4 skeleton loaders with correct dimensions inside the table container', () => {
      render(<LoadingTableSkeleton />);

      const container = screen.getByTestId('table-container');
      const skeletons = screen.getAllByTestId('skeleton-loader');

      expect(skeletons).toHaveLength(4);
      skeletons.forEach((skeleton) => {
        expect(skeleton).toHaveAttribute('data-height', '550px');
        expect(skeleton).toHaveAttribute('data-width', '300px');
        expect(container).toContainElement(skeleton);
      });
    });
  });

  describe('data-testid Rendering', () => {
    it('renders and omits custom data-testid based on dataTestId prop', () => {
      const { rerender } = render(<LoadingTableSkeleton dataTestId="custom" />);
      expect(
        screen.getByTestId('loading-table-skeleton-custom'),
      ).toBeInTheDocument();

      rerender(<LoadingTableSkeleton />);
      expect(
        screen.queryByTestId('loading-table-skeleton-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
