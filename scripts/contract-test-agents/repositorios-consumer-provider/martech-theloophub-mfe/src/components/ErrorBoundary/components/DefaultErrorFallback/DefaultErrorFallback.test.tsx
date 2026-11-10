import { render, screen } from '@testing-library/react';

const mockGetEnv = jest.fn();

jest.mock('admin-portal-shared-services', () => ({
  useEnvService: () => ({
    getEnv: mockGetEnv,
  }),
}));

jest.mock('components', () => ({
  ErrorContainer: ({
    title,
    message,
    actionOne,
    handleActionOne,
    isLoadingOne,
    actionTwo,
    handleActionTwo,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'error-container'}>
      <h1 data-testid="title">{title}</h1>
      <p data-testid="message">{message}</p>
      <button data-testid="action-one" onClick={handleActionOne}>
        {actionOne}
      </button>
      <button data-testid="action-two" onClick={handleActionTwo}>
        {actionTwo}
      </button>
      <span data-testid="loading-one">{String(isLoadingOne)}</span>
    </div>
  ),
}));

jest.mock('../ErrorDetails/ErrorDetails', () => ({
  ErrorDetails: ({ error, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'error-details'}>{error?.message}</div>
  ),
}));

jest.mock('./DefaultErrorFallback.styles', () => ({
  StyledErrorFallback: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'styled-error-fallback'}>{children}</div>
  ),
  StyledErrorId: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'styled-error-id'}>{children}</div>
  ),
}));

import { DefaultErrorFallback } from './DefaultErrorFallback';

describe('DefaultErrorFallback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetEnv.mockReturnValue('PROD');
  });

  it('should render the component', () => {
    render(<DefaultErrorFallback />);

    expect(screen.getByTestId('styled-error-fallback')).toBeInTheDocument();
  });

  it('should render ErrorContainer with default title and message', () => {
    render(<DefaultErrorFallback />);

    expect(screen.getByTestId('title')).toHaveTextContent(
      'Ooops! Something went wrong',
    );
    expect(screen.getByTestId('message')).toHaveTextContent(
      "We're sorry for the inconvenience. Please try again.",
    );
  });

  it('should render ErrorContainer with custom title and message', () => {
    render(
      <DefaultErrorFallback title="Custom Title" message="Custom Message" />,
    );

    expect(screen.getByTestId('title')).toHaveTextContent('Custom Title');
    expect(screen.getByTestId('message')).toHaveTextContent('Custom Message');
  });

  it('should render Try Again button', () => {
    render(<DefaultErrorFallback />);

    expect(screen.getByTestId('action-one')).toHaveTextContent('Try Again');
  });

  it('should render Reload Page button', () => {
    render(<DefaultErrorFallback />);

    expect(screen.getByTestId('action-two')).toHaveTextContent('Reload Page');
  });

  it('should call resetError when Try Again is clicked', () => {
    const resetError = jest.fn();
    render(<DefaultErrorFallback resetError={resetError} />);

    screen.getByTestId('action-one').click();

    expect(resetError).toHaveBeenCalled();
  });

  it('should call reloadPage when Reload Page is clicked', () => {
    const reloadPage = jest.fn();
    render(<DefaultErrorFallback reloadPage={reloadPage} />);

    screen.getByTestId('action-two').click();

    expect(reloadPage).toHaveBeenCalled();
  });

  it('should show loading state for Try Again button', () => {
    render(<DefaultErrorFallback isReseting={true} />);

    expect(screen.getByTestId('loading-one')).toHaveTextContent('true');
  });

  it('should display error ID when provided', () => {
    render(<DefaultErrorFallback errorId="error_123" />);

    expect(screen.getByTestId('styled-error-id')).toHaveTextContent(
      'Error ID: error_123',
    );
  });

  it('should not display error ID when not provided', () => {
    render(<DefaultErrorFallback />);

    expect(screen.queryByTestId('styled-error-id')).not.toBeInTheDocument();
  });

  it('should show ErrorDetails in development environment', () => {
    mockGetEnv.mockReturnValue('DEV');
    const error = new Error('Test error');

    render(<DefaultErrorFallback error={error} />);

    expect(screen.getByTestId('error-details')).toBeInTheDocument();
  });

  it('should not show ErrorDetails in production environment', () => {
    mockGetEnv.mockReturnValue('PROD');
    const error = new Error('Test error');

    render(<DefaultErrorFallback error={error} />);

    expect(screen.queryByTestId('error-details')).not.toBeInTheDocument();
  });

  it('should not show ErrorDetails when no error is provided', () => {
    mockGetEnv.mockReturnValue('DEV');

    render(<DefaultErrorFallback />);

    expect(screen.queryByTestId('error-details')).not.toBeInTheDocument();
  });

  it('should not call resetError when not provided', () => {
    render(<DefaultErrorFallback />);

    expect(() => {
      screen.getByTestId('action-one').click();
    }).not.toThrow();
  });

  describe('data-testid Rendering', () => {
    const mockError = new Error('Test error');

    it('should render with data-testid when dataTestId is provided', () => {
      render(<DefaultErrorFallback error={mockError} dataTestId="custom" />);
      expect(screen.getByTestId('error-fallback-custom')).toBeInTheDocument();
    });

    it('should render ErrorContainer with data-testid when dataTestId is provided', () => {
      render(<DefaultErrorFallback error={mockError} dataTestId="custom" />);
      expect(screen.getByTestId('custom-error-container')).toBeInTheDocument();
    });

    it('should render ErrorId with data-testid when errorId and dataTestId are provided', () => {
      render(
        <DefaultErrorFallback
          error={mockError}
          errorId="12345"
          dataTestId="custom"
        />,
      );
      expect(screen.getByTestId('custom-error-id')).toBeInTheDocument();
      expect(screen.getByText('Error ID: 12345')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<DefaultErrorFallback error={mockError} />);
      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="error-fallback"]',
      );
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
