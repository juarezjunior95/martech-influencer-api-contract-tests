import { render, screen } from '@testing-library/react';

import { ErrorTrigger } from './ErrorTrigger';

describe('ErrorTrigger', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should throw error immediately when type is render', () => {
    expect(() => {
      render(<ErrorTrigger type="render" />);
    }).toThrow('Test render error from ErrorTrigger');
  });

  it('should render buttons when type is event', () => {
    render(<ErrorTrigger type="event" />);

    expect(screen.getByText('Trigger Event Error')).toBeInTheDocument();
    expect(screen.getByText('Trigger Async Error')).toBeInTheDocument();
    expect(screen.getByText('Trigger Immediate Error')).toBeInTheDocument();
  });

  it('should render buttons when type is async', () => {
    render(<ErrorTrigger type="async" />);

    expect(screen.getByText('Trigger Event Error')).toBeInTheDocument();
    expect(screen.getByText('Trigger Async Error')).toBeInTheDocument();
    expect(screen.getByText('Trigger Immediate Error')).toBeInTheDocument();
  });

  it('should render title', () => {
    render(<ErrorTrigger type="event" />);

    expect(screen.getByText('Error Boundary Test')).toBeInTheDocument();
  });

  it('should render Trigger Event Error button', () => {
    render(<ErrorTrigger type="event" />);

    const button = screen.getByText('Trigger Event Error');
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  it('should render Trigger Async Error button', () => {
    render(<ErrorTrigger type="event" />);

    const button = screen.getByText('Trigger Async Error');
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  it('should render Trigger Immediate Error button', () => {
    render(<ErrorTrigger type="event" />);

    const button = screen.getByText('Trigger Immediate Error');
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  it('should default to render type', () => {
    expect(() => {
      render(<ErrorTrigger />);
    }).toThrow('Test render error from ErrorTrigger');
  });

  it('should have correct container styles', () => {
    render(<ErrorTrigger type="event" />);

    const container = screen.getByText('Error Boundary Test').parentElement;
    expect(container).toHaveStyle({ padding: '20px' });
  });

  describe('data-testid Rendering', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(<ErrorTrigger type="event" dataTestId="custom" />);

      expect(screen.getByTestId('error-trigger-custom')).toBeInTheDocument();
    });

    it('should render title with data-testid when dataTestId is provided', () => {
      render(<ErrorTrigger type="event" dataTestId="custom" />);

      expect(
        screen.getByTestId('error-trigger-title-custom'),
      ).toBeInTheDocument();
      expect(screen.getByText('Error Boundary Test')).toBeInTheDocument();
    });

    it('should render buttons container with data-testid when dataTestId is provided', () => {
      render(<ErrorTrigger type="event" dataTestId="custom" />);

      expect(
        screen.getByTestId('error-trigger-buttons-custom'),
      ).toBeInTheDocument();
    });

    it('should render all buttons with data-testid when dataTestId is provided', () => {
      render(<ErrorTrigger type="event" dataTestId="custom" />);

      expect(
        screen.getByTestId('error-trigger-button-event-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('error-trigger-button-async-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('error-trigger-button-immediate-custom'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<ErrorTrigger type="event" />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="error-trigger"]',
      );
      expect(elementsWithTestId.length).toBe(0);
    });
  });
});
