import { render, screen } from '@testing-library/react';

jest.mock('@hexa-ui/components', () => ({
  Paragraph: ({ children, style, 'data-testid': dataTestId }: any) => (
    <p data-testid={dataTestId || 'paragraph'} style={style}>
      {children}
    </p>
  ),
}));

jest.mock('./ErrorDetails.styles', () => ({
  StyledErrorDetails: ({ children, 'data-testid': dataTestId }: any) => (
    <details data-testid={dataTestId || 'error-details'}>{children}</details>
  ),
  StyledErrorSummary: ({ children, 'data-testid': dataTestId }: any) => (
    <summary data-testid={dataTestId || 'error-summary'}>{children}</summary>
  ),
  StyledErrorMessageContainer: ({
    children,
    'data-testid': dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'error-message-container'}>{children}</div>
  ),
  StyledErrorMessage: ({ children, color, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'error-message'} data-color={color}>
      {children}
    </div>
  ),
  StyledPre: ({ children, 'data-testid': dataTestId }: any) => (
    <pre data-testid={dataTestId || 'styled-pre'}>{children}</pre>
  ),
}));

import { ErrorDetails } from './ErrorDetails';

describe('ErrorDetails', () => {
  const mockError = new Error('Test error message');
  mockError.stack = 'Error: Test error\n    at TestComponent';

  it('should render the component with error', () => {
    render(<ErrorDetails error={mockError} />);

    expect(screen.getByTestId('error-details')).toBeInTheDocument();
  });

  it('should render summary text', () => {
    render(<ErrorDetails error={mockError} />);

    expect(screen.getByText('Show Error Details')).toBeInTheDocument();
  });

  it('should display error message when provided', () => {
    render(<ErrorDetails error={mockError} />);

    expect(screen.getByText('Error Message:')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should display stack trace when provided', () => {
    render(<ErrorDetails error={mockError} />);

    expect(screen.getByText('Stack Trace:')).toBeInTheDocument();
  });

  it('should display component stack when provided', () => {
    const errorInfo = {
      componentStack: '\n    in TestComponent\n    in App',
    };

    render(<ErrorDetails error={mockError} errorInfo={errorInfo} />);

    expect(screen.getByText('Component Stack:')).toBeInTheDocument();
  });

  it('should render multiple sections when all data is provided', () => {
    const errorInfo = {
      componentStack: '\n    in TestComponent',
    };

    render(<ErrorDetails error={mockError} errorInfo={errorInfo} />);

    const containers = screen.getAllByTestId('error-message-container');
    expect(containers).toHaveLength(3);
  });

  it('should apply red color to stack trace section', () => {
    render(<ErrorDetails error={mockError} />);

    const messages = screen.getAllByTestId('error-message');
    const stackMessage = messages.find(
      (el) => el.getAttribute('data-color') === 'red',
    );
    expect(stackMessage).toBeInTheDocument();
  });

  it('should apply blue color to component stack section', () => {
    const errorInfo = {
      componentStack: 'Component stack',
    };

    render(<ErrorDetails error={mockError} errorInfo={errorInfo} />);

    const messages = screen.getAllByTestId('error-message');
    const componentStackMessage = messages.find(
      (el) => el.getAttribute('data-color') === 'blue',
    );
    expect(componentStackMessage).toBeInTheDocument();
  });

  it('should not display component stack when not provided', () => {
    render(<ErrorDetails error={mockError} />);

    expect(screen.queryByText('Component Stack:')).not.toBeInTheDocument();
  });

  describe('with data-testid', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(<ErrorDetails error={mockError} dataTestId="custom" />);

      expect(screen.getByTestId('error-details-custom')).toBeInTheDocument();
    });

    it('should render summary with data-testid when dataTestId is provided', () => {
      render(<ErrorDetails error={mockError} dataTestId="custom" />);

      expect(
        screen.getByTestId('error-details-summary-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('error-details-summary-text-custom'),
      ).toBeInTheDocument();
    });

    it('should render error message container with data-testid when error message exists', () => {
      render(<ErrorDetails error={mockError} dataTestId="custom" />);

      const containers = screen.getAllByTestId(
        'error-details-message-container-custom',
      );
      expect(containers.length).toBeGreaterThan(0);

      const messages = screen.getAllByTestId('error-details-message-custom');
      expect(messages.length).toBeGreaterThan(0);
    });

    it('should render stack trace with data-testid when error stack exists', () => {
      render(<ErrorDetails error={mockError} dataTestId="custom" />);

      const containers = screen.getAllByTestId(
        'error-details-message-container-custom',
      );
      expect(containers.length).toBeGreaterThan(0);
    });

    it('should render component stack with data-testid when errorInfo exists', () => {
      const errorInfo = {
        componentStack: '\n    in TestComponent\n    in App',
      };

      render(
        <ErrorDetails
          error={mockError}
          errorInfo={errorInfo}
          dataTestId="custom"
        />,
      );

      const containers = screen.getAllByTestId(
        'error-details-message-container-custom',
      );
      expect(containers.length).toBeGreaterThan(0);
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<ErrorDetails error={mockError} />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="error-details-"]',
      );
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
