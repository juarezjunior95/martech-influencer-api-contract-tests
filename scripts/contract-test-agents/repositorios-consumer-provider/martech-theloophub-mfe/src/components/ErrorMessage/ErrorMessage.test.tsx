import { render, screen } from '@testing-library/react';

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({
      id,
      defaultMessage,
    }: {
      id: string;
      defaultMessage: string;
    }) => {
      const messages: Record<string, string> = {
        'Error.noRecords': 'No records found for',
        'Error.filteredParameters': 'the selected filters',
      };
      return messages[id] || defaultMessage;
    },
  }),
}));

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children, 'data-testid': dataTestId, ...props }: any) => (
    <p data-testid={dataTestId || 'paragraph'} {...props}>
      {children}
    </p>
  ),
}));

import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('should display error message text', () => {
    render(<ErrorMessage />);

    expect(screen.getByText('No records found for')).toBeInTheDocument();
  });

  it('should display filtered parameters in bold', () => {
    render(<ErrorMessage />);

    const strongElement = screen.getByText('the selected filters');
    expect(strongElement.tagName).toBe('STRONG');
  });

  it('should render as a paragraph element', () => {
    render(<ErrorMessage />);
    const textElement = screen.getByText('No records found for');
    expect(textElement.closest('p')).toBeInTheDocument();
    expect(textElement.closest('p')?.tagName).toBe('P');
  });
});

describe('data-testid Rendering', () => {
  it('should render with data-testid when dataTestId is provided', () => {
    render(<ErrorMessage dataTestId="custom" />);

    expect(screen.getByTestId('error-message-custom')).toBeInTheDocument();
  });

  it('should render strong element with data-testid when dataTestId is provided', () => {
    render(<ErrorMessage dataTestId="custom" />);

    expect(
      screen.getByTestId('error-message-strong-custom'),
    ).toBeInTheDocument();
    expect(screen.getByText('the selected filters')).toBeInTheDocument();
  });

  it('should not render data-testid when dataTestId is not provided', () => {
    const { container } = render(<ErrorMessage />);

    const elementsWithTestId = container.querySelectorAll(
      '[data-testid^="error-message"]',
    );
    expect(elementsWithTestId.length).toBe(0);
  });

  it('should not render data-testid when ErrorMessage dataTestId prop is undefined', () => {
    const { container } = render(<ErrorMessage dataTestId={undefined} />);

    const elementsWithTestId = container.querySelectorAll(
      '[data-testid^="error-message"]',
    );
    expect(elementsWithTestId.length).toBe(0);
  });
});
