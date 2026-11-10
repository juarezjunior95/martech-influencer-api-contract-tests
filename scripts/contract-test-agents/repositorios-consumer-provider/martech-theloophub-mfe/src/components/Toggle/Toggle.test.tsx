import { fireEvent, render, screen } from '@testing-library/react';

import { Toggle } from './Toggle';

describe('Toggle', () => {
  describe('Rendering', () => {
    it('should render with role switch', () => {
      render(<Toggle />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should render unchecked by default', () => {
      render(<Toggle />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
      expect(toggle).toHaveAttribute('data-state', 'unchecked');
    });

    it('should render checked when checked is true', () => {
      render(<Toggle checked />);
      const toggle = screen.getByRole('switch');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
      expect(toggle).toHaveAttribute('data-state', 'checked');
    });

    it('should set tabIndex 0 when enabled', () => {
      render(<Toggle />);
      expect(screen.getByRole('switch')).toHaveAttribute('tabIndex', '0');
    });

    it('should set tabIndex -1 when disabled', () => {
      render(<Toggle disabled />);
      expect(screen.getByRole('switch')).toHaveAttribute('tabIndex', '-1');
    });

    it('should pass aria-labelledby to the switch', () => {
      render(<Toggle ariaLabelledBy="toggle-label" />);
      expect(screen.getByRole('switch')).toHaveAttribute(
        'aria-labelledby',
        'toggle-label',
      );
    });

    it('should pass aria-label to the switch', () => {
      render(<Toggle ariaLabel="Custom label" />);
      expect(screen.getByRole('switch')).toHaveAttribute(
        'aria-label',
        'Custom label',
      );
    });
  });

  describe('Toggle functionality', () => {
    it('should call onCheckedChange with true when clicked from unchecked', () => {
      const onCheckedChange = jest.fn();
      render(<Toggle checked={false} onCheckedChange={onCheckedChange} />);

      fireEvent.click(screen.getByRole('switch'));

      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('should call onCheckedChange with false when clicked from checked', () => {
      const onCheckedChange = jest.fn();
      render(<Toggle checked onCheckedChange={onCheckedChange} />);

      fireEvent.click(screen.getByRole('switch'));

      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });

    it('should not throw when onCheckedChange is not provided', () => {
      render(<Toggle checked={false} />);
      expect(() => fireEvent.click(screen.getByRole('switch'))).not.toThrow();
    });
  });

  describe('Disabled state', () => {
    it('should render as disabled when disabled is true', () => {
      render(<Toggle disabled />);
      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('should not call onCheckedChange when disabled and clicked', () => {
      const onCheckedChange = jest.fn();
      render(
        <Toggle checked={false} disabled onCheckedChange={onCheckedChange} />,
      );

      fireEvent.click(screen.getByRole('switch'));

      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard', () => {
    it('should call onCheckedChange with true when Space is pressed from unchecked', () => {
      const onCheckedChange = jest.fn();
      render(<Toggle checked={false} onCheckedChange={onCheckedChange} />);

      fireEvent.keyDown(screen.getByRole('switch'), { key: ' ' });

      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('should call onCheckedChange with false when Enter is pressed from checked', () => {
      const onCheckedChange = jest.fn();
      render(<Toggle checked onCheckedChange={onCheckedChange} />);

      fireEvent.keyDown(screen.getByRole('switch'), { key: 'Enter' });

      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });

    it('should not call onCheckedChange when disabled and Space is pressed', () => {
      const onCheckedChange = jest.fn();
      render(
        <Toggle checked={false} disabled onCheckedChange={onCheckedChange} />,
      );

      fireEvent.keyDown(screen.getByRole('switch'), { key: ' ' });

      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });
});
