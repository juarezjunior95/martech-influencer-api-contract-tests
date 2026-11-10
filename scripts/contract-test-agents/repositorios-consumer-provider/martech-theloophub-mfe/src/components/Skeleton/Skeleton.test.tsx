import { render, screen } from '@testing-library/react';

import { Skeleton } from './Skeleton';

describe('Skeleton Loadder Component', () => {
  it('should render the component without crashing', () => {
    const { container } = render(
      <Skeleton width="10px" height="10px" length={1} />,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  describe('dataTestId prop', () => {
    it('should apply data-testid when dataTestId prop is provided', () => {
      render(
        <Skeleton
          width="10px"
          height="10px"
          length={1}
          dataTestId="skeleton-loading"
        />,
      );
      expect(screen.getByTestId('skeleton-loading')).toBeInTheDocument();
    });

    it('should apply data-testid to items when dataTestId prop is provided', () => {
      render(
        <Skeleton
          width="10px"
          height="10px"
          length={3}
          dataTestId="skeleton-loading"
        />,
      );
      expect(screen.getByTestId('skeleton-loading-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-loading-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('skeleton-loading-item-2')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId prop is not provided', () => {
      const { container } = render(
        <Skeleton width="10px" height="10px" length={1} />,
      );
      expect(container.querySelector('[data-testid]')).not.toBeInTheDocument();
    });
  });
});
