import { render, screen, waitFor } from '@testing-library/react';

const getWindow = (): Window => globalThis as unknown as Window;

const mockSetCustomAttribute = jest.fn();
const mockNoticeError = jest.fn();
const mockAddPageAction = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  getWindow().newrelic = {
    setCustomAttribute: mockSetCustomAttribute,
    noticeError: mockNoticeError,
    addPageAction: mockAddPageAction,
    setErrorHandler: jest.fn(),
    finished: true,
  };
});

afterEach(() => {
  delete getWindow().newrelic;
});

jest.mock('./components/DefaultErrorFallback/DefaultErrorFallback', () => ({
  DefaultErrorFallback: ({
    error,
    resetError,
    isReseting,
    reloadPage,
    errorId,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'error-fallback'}>
      <span data-testid="error-message">{error?.message}</span>
      <span data-testid="error-id">{errorId}</span>
      <span data-testid="is-reseting">{String(isReseting)}</span>
      <button data-testid="reset-button" onClick={resetError}>
        Reset
      </button>
      <button data-testid="reload-button" onClick={reloadPage}>
        Reload
      </button>
    </div>
  ),
}));

import { ErrorBoundary } from './ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div data-testid="child-component">Child content</div>;
};

describe('ErrorBoundary', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('child-component')).toBeInTheDocument();
  });

  it('should render error fallback when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    expect(screen.getByTestId('error-message')).toHaveTextContent('Test error');
  });

  it('should call newrelic.setCustomAttribute when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(mockSetCustomAttribute).toHaveBeenCalledWith(
      'errorId',
      expect.any(String),
    );
  });

  it('should call newrelic.noticeError when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(mockNoticeError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        errorId: expect.any(String),
        errorMessage: 'Test error',
      }),
    );
  });

  it('should generate unique errorId', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    const errorId = screen.getByTestId('error-id').textContent;
    expect(errorId).toMatch(/^error_\d+_/);
  });

  it('should reset error state when resetError is called', async () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();

    screen.getByTestId('reset-button').click();

    await waitFor(
      () => {
        expect(screen.getByTestId('is-reseting')).toHaveTextContent('true');
      },
      { timeout: 100 },
    );

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>,
    );
  });

  it('should call newrelic.addPageAction when reset is called', async () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    screen.getByTestId('reset-button').click();

    await waitFor(() => {
      expect(mockAddPageAction).toHaveBeenCalledWith(
        'ErrorBoundaryReset',
        expect.objectContaining({
          errorId: expect.any(String),
          resetMethod: 'manual',
        }),
      );
    });
  });

  it('should work without newrelic being defined', () => {
    delete getWindow().newrelic;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
  });

  describe('data-testid Rendering', () => {
    it('should render DefaultErrorFallback with data-testid when dataTestId is provided', () => {
      render(
        <ErrorBoundary dataTestId="custom">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByTestId('custom-boundary')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('custom-boundary')).not.toBeInTheDocument();
    });

    it('should pass dataTestId to DefaultErrorFallback with correct format', () => {
      render(
        <ErrorBoundary dataTestId="test">
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>,
      );

      expect(screen.getByTestId('test-boundary')).toBeInTheDocument();
    });
  });
});
