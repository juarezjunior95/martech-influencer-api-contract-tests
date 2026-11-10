import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TextArea } from './TextArea';

describe('TextArea', () => {
  describe('Basic Rendering', () => {
    it('should render a textarea element', () => {
      render(<TextArea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<TextArea placeholder="Type here..." />);
      expect(screen.getByPlaceholderText('Type here...')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<TextArea ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('should work as uncontrolled with defaultValue', () => {
      render(<TextArea defaultValue="Initial value" />);
      expect(screen.getByRole('textbox')).toHaveValue('Initial value');
    });

    it('should work as controlled with value', () => {
      const handleChange = jest.fn();
      const { rerender } = render(
        <TextArea value="Controlled" onChange={handleChange} />,
      );
      expect(screen.getByRole('textbox')).toHaveValue('Controlled');

      rerender(<TextArea value="Updated" onChange={handleChange} />);
      expect(screen.getByRole('textbox')).toHaveValue('Updated');
    });

    it('should call onChange when typing', async () => {
      const handleChange = jest.fn();
      render(<TextArea onChange={handleChange} />);

      await userEvent.type(screen.getByRole('textbox'), 'Hello');
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<TextArea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should have aria-invalid when error is true', () => {
      render(<TextArea error />);
      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-invalid',
        'true',
      );
    });

    it('should set data-error when error is true', () => {
      const { container } = render(<TextArea error />);
      expect(container.firstChild).toHaveAttribute('data-error', 'true');
    });
  });

  describe('Single Line Mode', () => {
    it('should set data-single-line when singleLine is true', () => {
      const { container } = render(<TextArea singleLine />);
      expect(container.firstChild).toHaveAttribute('data-single-line', 'true');
    });

    it('should have rows=1 when singleLine is true', () => {
      render(<TextArea singleLine />);
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '1');
    });
  });

  describe('Full Width', () => {
    it('should set data-full-width by default', () => {
      const { container } = render(<TextArea />);
      expect(container.firstChild).toHaveAttribute('data-full-width', 'true');
    });

    it('should omit data-full-width when fullWidth is false', () => {
      const { container } = render(<TextArea fullWidth={false} />);
      expect(container.firstChild).not.toHaveAttribute('data-full-width');
    });
  });

  describe('Submit Button', () => {
    it('should show submit button when showSubmit is true', () => {
      render(<TextArea showSubmit />);
      expect(
        screen.getByRole('button', { name: 'Submit' }),
      ).toBeInTheDocument();
    });

    it('should not show submit button by default', () => {
      render(<TextArea />);
      expect(
        screen.queryByRole('button', { name: 'Submit' }),
      ).not.toBeInTheDocument();
    });

    it('should disable submit button when textarea is empty', () => {
      render(<TextArea showSubmit />);
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it('should enable submit button when textarea has value', async () => {
      render(<TextArea showSubmit />);
      await userEvent.type(screen.getByRole('textbox'), 'Hello');
      expect(screen.getByRole('button', { name: 'Submit' })).not.toBeDisabled();
    });

    it('should call onSubmit when submit button is clicked', async () => {
      const handleSubmit = jest.fn();
      render(<TextArea showSubmit onSubmit={handleSubmit} />);

      await userEvent.type(screen.getByRole('textbox'), 'Hello');
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      expect(handleSubmit).toHaveBeenCalledWith('Hello');
    });

    it('should call onSubmit when Enter is pressed', async () => {
      const handleSubmit = jest.fn();
      render(<TextArea showSubmit onSubmit={handleSubmit} />);

      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Hello');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

      expect(handleSubmit).toHaveBeenCalledWith('Hello');
    });

    it('should not call onSubmit when Shift+Enter is pressed', async () => {
      const handleSubmit = jest.fn();
      render(<TextArea showSubmit onSubmit={handleSubmit} />);

      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Hello');
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('should disable submit button when textarea is disabled', () => {
      render(<TextArea showSubmit disabled defaultValue="Test" />);
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });
  });

  describe('Start and End Content', () => {
    it('should render startContent', () => {
      render(<TextArea startContent={<span data-testid="start">S</span>} />);
      expect(screen.getByTestId('start')).toBeInTheDocument();
    });

    it('should render endContent', () => {
      render(<TextArea endContent={<span data-testid="end">E</span>} />);
      expect(screen.getByTestId('end')).toBeInTheDocument();
    });
  });

  describe('Custom className', () => {
    it('should accept custom className', () => {
      const { container } = render(<TextArea className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Keyboard Events', () => {
    it('should call onKeyDown when provided', () => {
      const handleKeyDown = jest.fn();
      render(<TextArea onKeyDown={handleKeyDown} />);

      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'a' });
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });
});
