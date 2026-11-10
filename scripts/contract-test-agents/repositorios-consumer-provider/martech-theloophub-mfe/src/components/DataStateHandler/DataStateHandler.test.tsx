import { render, screen } from '@testing-library/react';

jest.mock('components', () => ({
  Skeleton: ({ width, height, length, 'data-testid': dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'skeleton'}
      data-width={width}
      data-height={height}
      data-length={length}
    >
      Loading...
    </div>
  ),
}));

jest.mock('components/NoDataYet/NoDataYet', () => ({
  __esModule: true,
  default: ({ title, description, dataTestId }: any) => (
    <div
      data-testid={dataTestId || 'no-data-yet'}
      data-title={title}
      data-description={description}
    >
      {title || 'No Data Yet'}
      {description && <p>{description}</p>}
    </div>
  ),
}));

jest.mock('./DataStateHandler.styles', () => ({
  StyledDataStateHandlerEmpty: ({
    children,
    'data-testid': dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'empty-container'}>{children}</div>
  ),
}));

import { DataStateHandler } from './DataStateHandler';

describe('DataStateHandler', () => {
  const defaultProps = {
    loading: false,
    empty: false,
    children: <div data-testid="children">Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('should render Skeleton when loading is true', () => {
      render(<DataStateHandler {...defaultProps} loading={true} />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    });

    it('should render Skeleton with default props when skeletonProps is not provided', () => {
      render(<DataStateHandler {...defaultProps} loading={true} />);

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-width', '100%');
      expect(skeleton).toHaveAttribute('data-height', '100%');
      expect(skeleton).toHaveAttribute('data-length', '1');
    });

    it('should render Skeleton with custom skeletonProps', () => {
      render(
        <DataStateHandler
          {...defaultProps}
          loading={true}
          skeletonProps={{ width: '50%', height: '200px', length: 3 }}
        />,
      );

      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveAttribute('data-width', '50%');
      expect(skeleton).toHaveAttribute('data-height', '200px');
      expect(skeleton).toHaveAttribute('data-length', '3');
    });

    it('should prioritize loading over error', () => {
      render(
        <DataStateHandler
          {...defaultProps}
          loading={true}
          error={new Error('Test error')}
        />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('no-data-yet')).not.toBeInTheDocument();
    });

    it('should prioritize loading over empty', () => {
      render(
        <DataStateHandler {...defaultProps} loading={true} empty={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('empty-container')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should render NoDataYet with error message when error is provided', () => {
      render(
        <DataStateHandler {...defaultProps} error={new Error('Test error')} />,
      );

      const noDataYet = screen.getByTestId('no-data-yet');
      expect(noDataYet).toBeInTheDocument();
      expect(noDataYet).toHaveAttribute('data-title', 'An error occurred');
      expect(noDataYet).toHaveAttribute(
        'data-description',
        'Please try again later.',
      );
    });

    it('should render error state inside styled container', () => {
      render(
        <DataStateHandler {...defaultProps} error={new Error('Test error')} />,
      );

      expect(screen.getByTestId('empty-container')).toBeInTheDocument();
    });

    it('should not render children when error is provided', () => {
      render(
        <DataStateHandler {...defaultProps} error={new Error('Test error')} />,
      );

      expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    });

    it('should prioritize error over empty', () => {
      render(
        <DataStateHandler
          {...defaultProps}
          error={new Error('Test error')}
          empty={true}
        />,
      );

      const noDataYet = screen.getByTestId('no-data-yet');
      expect(noDataYet).toHaveAttribute('data-title', 'An error occurred');
    });

    it('should handle truthy error values', () => {
      render(<DataStateHandler {...defaultProps} error="string error" />);

      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    });

    it('should handle error object', () => {
      render(
        <DataStateHandler {...defaultProps} error={{ message: 'error' }} />,
      );

      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should render NoDataYet when empty is true', () => {
      render(<DataStateHandler {...defaultProps} empty={true} />);

      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    });

    it('should render empty state inside styled container', () => {
      render(<DataStateHandler {...defaultProps} empty={true} />);

      expect(screen.getByTestId('empty-container')).toBeInTheDocument();
    });

    it('should not render children when empty is true', () => {
      render(<DataStateHandler {...defaultProps} empty={true} />);

      expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    });

    it('should render NoDataYet without props in empty state', () => {
      render(<DataStateHandler {...defaultProps} empty={true} />);

      const noDataYet = screen.getByTestId('no-data-yet');
      expect(noDataYet).not.toHaveAttribute('data-title');
      expect(noDataYet).not.toHaveAttribute('data-description');
    });
  });

  describe('data state', () => {
    it('should render children when not loading, no error, and not empty', () => {
      render(<DataStateHandler {...defaultProps} />);

      expect(screen.getByTestId('children')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should not render Skeleton when not loading', () => {
      render(<DataStateHandler {...defaultProps} />);

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    it('should not render NoDataYet when not empty and no error', () => {
      render(<DataStateHandler {...defaultProps} />);

      expect(screen.queryByTestId('no-data-yet')).not.toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <DataStateHandler loading={false} empty={false}>
          <div data-testid="parent">
            <span data-testid="child-1">Child 1</span>
            <span data-testid="child-2">Child 2</span>
          </div>
        </DataStateHandler>,
      );

      expect(screen.getByTestId('parent')).toBeInTheDocument();
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should render text children', () => {
      render(
        <DataStateHandler loading={false} empty={false}>
          Just text content
        </DataStateHandler>,
      );

      expect(screen.getByText('Just text content')).toBeInTheDocument();
    });
  });

  describe('state transitions', () => {
    it('should transition from loading to data', () => {
      const { rerender } = render(
        <DataStateHandler {...defaultProps} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();

      rerender(<DataStateHandler {...defaultProps} loading={false} />);

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('children')).toBeInTheDocument();
    });

    it('should transition from loading to empty', () => {
      const { rerender } = render(
        <DataStateHandler {...defaultProps} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();

      rerender(
        <DataStateHandler {...defaultProps} loading={false} empty={true} />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    });

    it('should transition from loading to error', () => {
      const { rerender } = render(
        <DataStateHandler {...defaultProps} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();

      rerender(
        <DataStateHandler
          {...defaultProps}
          loading={false}
          error={new Error('Error')}
        />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render skeleton with data-testid when loading and dataTestId is provided', () => {
      render(
        <DataStateHandler
          {...defaultProps}
          loading={true}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('data-state-handler-skeleton-custom'),
      ).toBeInTheDocument();
    });

    it('should render error state with data-testid when error and dataTestId is provided', () => {
      render(
        <DataStateHandler
          {...defaultProps}
          error={new Error('Test error')}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('data-state-handler-custom'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    });

    it('should render empty state with data-testid when empty and dataTestId is provided', () => {
      render(
        <DataStateHandler {...defaultProps} empty={true} dataTestId="custom" />,
      );

      expect(
        screen.getByTestId('data-state-handler-custom'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(
        <DataStateHandler {...defaultProps} loading={true} />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="data-state-handler"]',
      );
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
