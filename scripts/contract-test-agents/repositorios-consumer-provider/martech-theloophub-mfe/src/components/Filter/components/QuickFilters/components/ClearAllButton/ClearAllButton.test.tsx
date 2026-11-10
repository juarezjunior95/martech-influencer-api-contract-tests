import { fireEvent, render, screen } from '@testing-library/react';

import { ClearAllButton } from './ClearAllButton';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
}));

jest.mock('@hexa-ui/components', () => ({
  TextButton: ({
    children,
    onClick,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    'data-testid'?: string;
  }) => (
    <button onClick={onClick} data-testid={dataTestId || 'clear-all-button'}>
      {' '}
      {children}{' '}
    </button>
  ),
}));

jest.mock('@hexa-ui/icons', () => ({
  Plus: ({ 'data-testid': dataTestId }: { 'data-testid'?: string }) => (
    <span data-testid={dataTestId ? dataTestId : 'plus-icon'}>+</span>
  ),
}));

describe('ClearAllButton', () => {
  const mockOnClearAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button with text', () => {
    render(<ClearAllButton onClearAll={mockOnClearAll} />);

    expect(screen.getByTestId('clear-all-button')).toBeInTheDocument();
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('should render Plus icon', () => {
    render(<ClearAllButton onClearAll={mockOnClearAll} />);

    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('should call onClearAll when clicked', () => {
    render(<ClearAllButton onClearAll={mockOnClearAll} />);

    fireEvent.click(screen.getByTestId('clear-all-button'));

    expect(mockOnClearAll).toHaveBeenCalledTimes(1);
  });

  it('should prevent default behavior on click', () => {
    render(<ClearAllButton onClearAll={mockOnClearAll} />);

    const button = screen.getByTestId('clear-all-button');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    button.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  describe('data-testid Rendering', () => {
    it('should render all elements with data-testid when dataTestId is provided', () => {
      render(
        <ClearAllButton onClearAll={mockOnClearAll} dataTestId="custom" />,
      );

      expect(screen.getByTestId('clear-all-button-custom')).toBeInTheDocument();
      expect(
        screen.getByTestId('clear-all-button-icon-custom'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(
        <ClearAllButton onClearAll={mockOnClearAll} />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="clear-all-button-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is explicitly undefined', () => {
      const { container } = render(
        <ClearAllButton onClearAll={mockOnClearAll} dataTestId={undefined} />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="clear-all-button-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });
  });
});
