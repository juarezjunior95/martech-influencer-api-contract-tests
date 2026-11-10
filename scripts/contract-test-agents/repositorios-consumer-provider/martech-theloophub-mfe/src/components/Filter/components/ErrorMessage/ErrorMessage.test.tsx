jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({
    children,
    size,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    size: string;
    'data-testid'?: string;
  }) => (
    <p data-testid={dataTestId || 'error-paragraph'} data-size={size}>
      {children}
    </p>
  ),
}));

import { render, screen } from '@testing-library/react';

import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage />);

    expect(screen.getByTestId('error-paragraph')).toBeInTheDocument();
  });

  it('should display correct error text', () => {
    render(<ErrorMessage />);

    expect(
      screen.getByText('Failed to load filters. Please try again later.'),
    ).toBeInTheDocument();
  });

  it('should use small size for paragraph', () => {
    render(<ErrorMessage />);

    const paragraph = screen.getByTestId('error-paragraph');
    expect(paragraph).toHaveAttribute('data-size', 'small');
  });

  it('should render as Paragraph component', () => {
    const { container } = render(<ErrorMessage />);

    expect(container.querySelector('p')).toBeInTheDocument();
  });

  describe('data-testid Rendering', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(<ErrorMessage dataTestId="custom" />);

      expect(screen.getByTestId('error-message-custom')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<ErrorMessage />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="error-message-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(
        screen.getByText('Failed to load filters. Please try again later.'),
      ).toBeInTheDocument();
    });
  });
});
