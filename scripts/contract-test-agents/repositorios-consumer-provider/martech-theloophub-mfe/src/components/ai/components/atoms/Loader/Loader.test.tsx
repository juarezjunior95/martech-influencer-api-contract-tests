import { render, screen } from '@testing-library/react';

import { Loader } from './Loader';

describe('Loader', () => {
  describe('Dots variant', () => {
    it('should render three dots by default', () => {
      render(<Loader />);
      const wrapper = screen.getByLabelText('Loading');
      const dots = wrapper.querySelectorAll('span');
      expect(dots).toHaveLength(3);
    });

    it('should have aria-label for accessibility', () => {
      render(<Loader />);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Loader ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('Spinner variant', () => {
    it('should render spinner with loading text', () => {
      render(<Loader variant="spinner" />);
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Loader variant="spinner" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe('Custom className', () => {
    it('should accept custom className on dots variant', () => {
      const { container } = render(<Loader className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should accept custom className on spinner variant', () => {
      const { container } = render(
        <Loader variant="spinner" className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Additional Props', () => {
    it('should pass through additional props', () => {
      render(<Loader data-testid="loader" />);
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });
});
