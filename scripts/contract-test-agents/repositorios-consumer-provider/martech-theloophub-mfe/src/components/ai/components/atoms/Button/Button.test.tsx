import { fireEvent, render, screen } from '@testing-library/react';

import { Button } from './Button';

describe('Button', () => {
  describe('Basic Rendering', () => {
    it('should render with children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('should render as a button element', () => {
      render(<Button>Test</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Button ref={ref}>Test</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('should render with primary variant by default', () => {
      render(<Button>Primary</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with tertiary variant', () => {
      render(<Button variant="tertiary">Tertiary</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render with medium size by default', () => {
      render(<Button>Medium</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with small size', () => {
      render(<Button size="small">Small</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with large size', () => {
      render(<Button size="large">Large</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show spinner when loading', () => {
      const { container } = render(<Button loading>Loading</Button>);
      expect(
        container.querySelector('[aria-hidden="true"]'),
      ).toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have aria-busy when loading', () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
    });

    it('should show both children and spinner when loading', () => {
      const { container } = render(<Button loading>Loading Text</Button>);
      expect(screen.getByText('Loading Text')).toBeInTheDocument();
      expect(
        container.querySelector('[aria-hidden="true"]'),
      ).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should have aria-disabled when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });
  });

  describe('Full Width', () => {
    it('should apply full width style when fullWidth is true', () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole('button')).toHaveStyle('width: 100%');
    });
  });

  describe('Icon Mode', () => {
    it('should apply icon mode style when iconMode is true', () => {
      render(<Button iconMode startContent={<span>Icon</span>} />);
      expect(screen.getByRole('button')).toHaveStyle('padding: 0');
    });

    it('should not render children when iconMode is true', () => {
      render(
        <Button iconMode startContent={<span>Icon</span>}>
          Hidden
        </Button>,
      );
      expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });

    it('should pass through aria-label from caller', () => {
      render(
        <Button iconMode startContent={<span>Icon</span>} aria-label="Close" />,
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close');
    });
  });

  describe('Start and End Content', () => {
    it('should render startContent', () => {
      render(
        <Button startContent={<span data-testid="start-icon">→</span>}>
          With Icon
        </Button>,
      );
      expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    });

    it('should render endContent', () => {
      render(
        <Button endContent={<span data-testid="end-icon">←</span>}>
          With Icon
        </Button>,
      );
      expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    });

    it('should render both start and end content', () => {
      render(
        <Button
          startContent={<span data-testid="start">S</span>}
          endContent={<span data-testid="end">E</span>}
        >
          Both
        </Button>,
      );
      expect(screen.getByTestId('start')).toBeInTheDocument();
      expect(screen.getByTestId('end')).toBeInTheDocument();
    });
  });

  describe('Events', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>,
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(
        <Button onClick={handleClick} loading>
          Click
        </Button>,
      );

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Custom className', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <Button className="custom-class">Custom</Button>,
      );
      expect(container.querySelector('button')).toHaveClass('custom-class');
    });
  });
});
