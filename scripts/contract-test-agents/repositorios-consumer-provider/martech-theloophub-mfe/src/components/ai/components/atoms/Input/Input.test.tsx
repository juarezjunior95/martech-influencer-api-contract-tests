import { fireEvent, render, screen } from '@testing-library/react';

import { Input } from './Input';

describe('Input', () => {
  describe('Basic Rendering', () => {
    it('should render as an input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Digite algo..." />);
      expect(screen.getByPlaceholderText('Digite algo...')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should render with value', () => {
      render(<Input value="test value" onChange={jest.fn()} />);
      expect(screen.getByRole('textbox')).toHaveValue('test value');
    });
  });

  describe('Variants', () => {
    it('should render with default variant by default', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('data-variant', 'default');
    });

    it('should render with rounded variant', () => {
      const { container } = render(<Input variant="rounded" />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('data-variant', 'rounded');
    });
  });

  describe('Error State', () => {
    it('should have error class when hasError is true', () => {
      const { container } = render(<Input hasError />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('data-has-error', 'true');
    });

    it('should not have error class by default', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input).not.toHaveAttribute('data-has-error');
    });
  });

  describe('Full Width', () => {
    it('should have fullWidth class when fullWidth is true', () => {
      const { container } = render(<Input fullWidth />);
      const input = container.querySelector('input');
      expect(input).toHaveAttribute('data-full-width', 'true');
    });

    it('should not have fullWidth class by default', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input).not.toHaveAttribute('data-full-width');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should not be disabled by default', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).not.toBeDisabled();
    });
  });

  describe('Events', () => {
    it('should call onChange when value changes', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'new value' },
      });
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should call onFocus when focused', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);

      fireEvent.focus(screen.getByRole('textbox'));
      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur when blurred', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should call onKeyDown when key is pressed', () => {
      const handleKeyDown = jest.fn();
      render(<Input onKeyDown={handleKeyDown} />);

      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });

    it('should not call onChange when disabled', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} disabled />);

      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: 'new value' },
      });
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Input Types', () => {
    it('should render with text type by default', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('should render with custom type', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });
  });

  describe('Custom className', () => {
    it('should accept custom className', () => {
      const { container } = render(<Input className="custom-class" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('custom-class');
    });

    it('should combine custom className with component classes', () => {
      const { container } = render(
        <Input className="custom-class" fullWidth />,
      );
      const input = container.querySelector('input');
      expect(input).toHaveClass('custom-class');
      expect(input).toHaveAttribute('data-full-width', 'true');
    });
  });

  describe('Accessibility', () => {
    it('should accept aria-label', () => {
      render(<Input aria-label="search input" />);
      expect(screen.getByLabelText('search input')).toBeInTheDocument();
    });

    it('should accept aria-describedby', () => {
      render(<Input aria-describedby="helper-text" />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'helper-text',
      );
    });

    it('should accept aria-invalid', () => {
      render(<Input aria-invalid="true" />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });
  });
});
