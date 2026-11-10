import { render, screen } from '@testing-library/react';

import { PageHeader } from './PageHeader';

jest.mock('components/Skeleton', () => ({
  Skeleton: ({ width, height }: any) => (
    <div data-testid="skeleton" data-width={width} data-height={height} />
  ),
}));

jest.mock('./PageHeader.styles', () => ({
  StyledPageHeader: ({
    children,
    'data-testid': dataTestId,
    className,
  }: any) => (
    <div data-testid={dataTestId ?? 'page-header'} className={className}>
      {children}
    </div>
  ),
  StyledPageHeaderTitle: ({ children, className, size }: any) => (
    <h1 className={className} data-size={size}>
      {children}
    </h1>
  ),
  StyledPageSubtitle: ({ children }: any) => (
    <p data-testid="page-subtitle">{children}</p>
  ),
}));

describe('PageHeader', () => {
  describe('Rendering', () => {
    it('should render page-header with data-testid', () => {
      render(<PageHeader title="Test Title" />);

      expect(screen.getByTestId('page-header')).toBeInTheDocument();
    });

    it('should render title when not loading', () => {
      render(<PageHeader title="My Title" />);

      expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('should render subtitle when provided and not loading', () => {
      render(<PageHeader title="My Title" subtitle="My Subtitle" />);

      expect(screen.getByTestId('page-subtitle')).toHaveTextContent(
        'My Subtitle',
      );
    });

    it('should not render subtitle when not provided', () => {
      render(<PageHeader title="My Title" />);

      expect(screen.queryByTestId('page-subtitle')).not.toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should render skeleton when loading is true', () => {
      render(<PageHeader title="My Title" loading />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render subtitle skeleton when loading is true', () => {
      render(<PageHeader title="My Title" loading />);

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons).toHaveLength(2);
    });

    it('should not render title element when loading', () => {
      render(<PageHeader title="My Title" loading />);

      expect(screen.queryByText('My Title')).not.toBeInTheDocument();
    });
  });
});
