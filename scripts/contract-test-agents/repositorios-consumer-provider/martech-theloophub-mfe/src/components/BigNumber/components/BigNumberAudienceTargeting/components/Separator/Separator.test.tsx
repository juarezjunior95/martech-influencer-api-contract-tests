import { render, screen } from '@testing-library/react';

import { Separator } from './Separator';

jest.mock('../../utils/constants', () => ({
  SEPARATOR_COLOR: '#1414145C',
}));

describe('Separator', () => {
  describe('Basic rendering', () => {
    it('should render separator with correct content', () => {
      render(<Separator dataTestId="test" />);

      const separator = screen.getByTestId('test-separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveTextContent('/');
    });

    it('should render as span element', () => {
      render(<Separator dataTestId="test" />);

      const separator = screen.getByTestId('test-separator');
      expect(separator).toBeInTheDocument();
      expect(separator.tagName).toBe('SPAN');
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<Separator />);

      const separator = container.querySelector('span');
      expect(separator).toBeInTheDocument();
      expect(separator).not.toHaveAttribute('data-testid');
    });
  });

  describe('Styling', () => {
    it('should apply correct color from constants', () => {
      render(<Separator dataTestId="test" />);

      const separator = screen.getByTestId('test-separator');
      expect(separator).toHaveStyle({ color: '#1414145C' });
    });

    it('should have inline style attribute', () => {
      render(<Separator dataTestId="test" />);

      const separator = screen.getByTestId('test-separator');
      expect(separator).toHaveAttribute('style');
    });
  });

  describe('Content structure', () => {
    it('should contain exactly " / " with spaces', () => {
      render(<Separator dataTestId="test" />);

      const separator = screen.getByTestId('test-separator');
      expect(separator.textContent).toBe(' / ');
    });

    it('should not contain additional whitespace or characters', () => {
      render(<Separator dataTestId="test" />);

      const separator = screen.getByTestId('test-separator');
      expect(separator.textContent).toBe(' / ');
      expect(separator.textContent).not.toBe('/');
      expect(separator.textContent).not.toBe('  /  ');
    });
  });

  describe('Accessibility', () => {
    it('should be accessible as text', () => {
      render(<Separator dataTestId="test" />);

      const separator = screen.getByTestId('test-separator');
      expect(separator).toBeVisible();
    });
  });

  describe('Multiple Instances', () => {
    it('should render multiple separators with unique data-testid', () => {
      render(
        <>
          <Separator dataTestId="item-0" />
          <Separator dataTestId="item-1" />
          <Separator dataTestId="item-2" />
        </>,
      );

      expect(screen.getByTestId('item-0-separator')).toBeInTheDocument();
      expect(screen.getByTestId('item-1-separator')).toBeInTheDocument();
      expect(screen.getByTestId('item-2-separator')).toBeInTheDocument();
    });
  });
});
