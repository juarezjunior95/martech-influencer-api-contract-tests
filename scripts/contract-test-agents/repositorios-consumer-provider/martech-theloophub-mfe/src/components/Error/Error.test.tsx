import { fireEvent, render, screen } from '@testing-library/react';

import { ErrorContainer, ErrorSection } from './Error';

jest.mock('@hexa-ui/components', () => ({
  Button: ({
    children,
    onClick,
    isLoading,
    'data-testid': dataTestId,
    variant,
  }: any) => (
    <button
      data-testid={dataTestId ?? 'button'}
      onClick={onClick}
      aria-busy={isLoading}
      data-variant={variant}
    >
      {children}
    </button>
  ),
  Heading: ({ children, size, 'data-testid': dataTestId }: any) => (
    <h3 data-testid={dataTestId ?? 'heading'} data-size={size}>
      {children}
    </h3>
  ),
  Paragraph: ({ children, size, 'data-testid': dataTestId }: any) => (
    <p data-testid={dataTestId ?? 'paragraph'} data-size={size}>
      {children}
    </p>
  ),
}));

jest.mock('./Error.styles', () => ({
  Container: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'error-container'}>{children}</div>
  ),
  Header: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'error-header'}>{children}</div>
  ),
  Buttons: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'error-buttons'}>{children}</div>
  ),
}));

jest.mock('../../assets/error.png', () => 'error.png');

describe('ErrorContainer', () => {
  describe('Rendering', () => {
    it('should render error container with data-testid when provided', () => {
      render(<ErrorContainer dataTestId="test" />);

      expect(screen.getByTestId('error-container-test')).toBeInTheDocument();
    });

    it('should render error image', () => {
      render(<ErrorContainer dataTestId="test" />);

      expect(screen.getByAltText('Error')).toBeInTheDocument();
    });

    it('should render title when provided', () => {
      render(<ErrorContainer title="Error Title" dataTestId="test" />);

      expect(
        screen.getByTestId('error-container-title-test'),
      ).toHaveTextContent('Error Title');
    });

    it('should render message when provided', () => {
      render(
        <ErrorContainer message="Something went wrong" dataTestId="test" />,
      );

      expect(
        screen.getByTestId('error-container-message-test'),
      ).toHaveTextContent('Something went wrong');
    });

    it('should not render message when not provided', () => {
      render(<ErrorContainer dataTestId="test" />);

      expect(
        screen.queryByTestId('error-container-message-test'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Functionality', () => {
    it('should render action buttons when actions is true', () => {
      render(
        <ErrorContainer
          actions
          actionOne="Retry"
          actionTwo="Cancel"
          dataTestId="test"
        />,
      );

      expect(
        screen.getByTestId('error-container-buttons-test'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('test-action-one')).toBeInTheDocument();
      expect(screen.getByTestId('test-action-two')).toBeInTheDocument();
    });

    it('should call handleActionOne when action one button is clicked', () => {
      const mockActionOne = jest.fn();
      render(
        <ErrorContainer
          actions
          actionOne="Retry"
          handleActionOne={mockActionOne}
          dataTestId="test"
        />,
      );

      fireEvent.click(screen.getByTestId('test-action-one'));

      expect(mockActionOne).toHaveBeenCalledTimes(1);
    });

    it('should call handleActionTwo when action two button is clicked', () => {
      const mockActionTwo = jest.fn();
      render(
        <ErrorContainer
          actions
          actionTwo="Cancel"
          handleActionTwo={mockActionTwo}
          dataTestId="test"
        />,
      );

      fireEvent.click(screen.getByTestId('test-action-two'));

      expect(mockActionTwo).toHaveBeenCalledTimes(1);
    });
  });

  describe('States', () => {
    it('should not render buttons section when actions is false', () => {
      render(<ErrorContainer dataTestId="test" />);

      expect(
        screen.queryByTestId('error-container-buttons-test'),
      ).not.toBeInTheDocument();
    });
  });
});

describe('ErrorSection', () => {
  describe('Rendering', () => {
    it('should render error section with data-testid', () => {
      render(<ErrorSection dataTestId="section" />);

      expect(screen.getByTestId('error-section-section')).toBeInTheDocument();
    });

    it('should render error image', () => {
      render(<ErrorSection dataTestId="section" />);

      expect(screen.getByAltText('No Connection Found')).toBeInTheDocument();
    });

    it('should render message when provided', () => {
      render(<ErrorSection message="Connection error" dataTestId="section" />);

      expect(
        screen.getByTestId('error-section-message-section'),
      ).toHaveTextContent('Connection error');
    });
  });
});
