import { fireEvent, render, screen } from '@testing-library/react';

import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('Basic Rendering', () => {
    it('should render a checkbox input', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Checkbox ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should render with label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('should not render label text when not provided', () => {
      render(<Checkbox />);
      expect(screen.queryByText(/.+/)).toBeNull();
    });
  });

  describe('Checked State', () => {
    it('should render unchecked by default', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('should render checked when checked prop is true', () => {
      render(<Checkbox checked onChange={jest.fn()} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('should render checkmark span', () => {
      const { container } = render(<Checkbox checked onChange={jest.fn()} />);
      const input = container.querySelector('input[type="checkbox"]');
      expect(input?.nextElementSibling).toBeInTheDocument();
    });
  });

  describe('Events', () => {
    it('should call onChange when clicked', () => {
      const handleChange = jest.fn();
      render(<Checkbox onChange={handleChange} />);

      fireEvent.click(screen.getByRole('checkbox'));
      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should have disabled attribute when disabled', () => {
      render(<Checkbox onChange={jest.fn()} disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  describe('Custom className', () => {
    it('should accept custom className', () => {
      const { container } = render(<Checkbox className="custom-class" />);
      expect(container.querySelector('label')).toHaveClass('custom-class');
    });
  });
});
