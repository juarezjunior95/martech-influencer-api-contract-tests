jest.mock('@hexa-ui/components', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    disabled,
    type,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant: string;
    size: string;
    disabled?: boolean;
    type?: string;
    'data-testid'?: string;
  }) => (
    <button
      onClick={onClick}
      data-testid={dataTestId}
      data-variant={variant}
      data-size={size}
      disabled={disabled}
      type={type as 'button' | 'submit' | 'reset'}
    >
      {children}
    </button>
  ),
  TextButton: ({
    children,
    onClick,
    size,
    type,
    style,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    size: string;
    type?: string;
    style?: React.CSSProperties;
    'data-testid'?: string;
  }) => (
    <button
      onClick={onClick}
      data-testid={dataTestId}
      data-size={size}
      type={type as 'button' | 'submit' | 'reset'}
      style={style}
    >
      {children}
    </button>
  ),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
}));

jest.mock('./FilterActions.styles', () => ({
  StyledFilterActions: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'filter-actions'}>{children}</div>,
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { useGoogleAnalytics } from 'hooks';

import { FilterActions } from './FilterActions';

describe('FilterActions', () => {
  let mockOnReset: jest.Mock;
  let mockOnApply: jest.Mock;
  let mockOnClose: jest.Mock;
  let mockOnCancel: jest.Mock;
  let mockTrackGA: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockOnReset = jest.fn();
    mockOnApply = jest.fn();
    mockOnClose = jest.fn();
    mockOnCancel = jest.fn();
    mockTrackGA = jest.fn();

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
  });

  const defaultProps = {
    onReset: mockOnReset,
    onApply: mockOnApply,
    onClose: mockOnClose,
    onCancel: mockOnCancel,
    hasFormFields: true,
  };

  describe('rendering', () => {
    it('should render filter actions container', () => {
      render(<FilterActions {...defaultProps} />);

      expect(screen.getByTestId('filter-actions')).toBeInTheDocument();
    });

    it('should render Clear Filters button', () => {
      render(<FilterActions {...defaultProps} />);

      const clearButton = screen.getByText('Clear Filters');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveTextContent('Clear Filters');
    });

    it('should render Cancel button', () => {
      render(<FilterActions {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toBeInTheDocument();
      expect(cancelButton).toHaveTextContent('Cancel');
    });

    it('should render Apply button', () => {
      render(<FilterActions {...defaultProps} />);

      const applyButton = screen.getByText('Apply');
      expect(applyButton).toBeInTheDocument();
      expect(applyButton).toHaveTextContent('Apply');
    });
  });

  describe('Clear Filters button', () => {
    it('should track Google Analytics event when clicked', () => {
      render(<FilterActions {...defaultProps} />);

      const clearFiltersButton = screen.getByText('Clear Filters');
      fireEvent.click(clearFiltersButton);

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Filter',
        event_action: 'Click',
        event_label: 'Clear All',
      });
    });

    it('should have type button', () => {
      render(<FilterActions {...defaultProps} />);

      const clearFiltersButton = screen.getByText('Clear Filters');
      expect(clearFiltersButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Cancel button', () => {
    it('should render as secondary button', () => {
      render(<FilterActions {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toHaveAttribute('data-variant', 'secondary');
    });

    it('should track Google Analytics event when clicked', () => {
      render(<FilterActions {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Filter',
        event_action: 'Click',
        event_label: 'Close',
      });
    });

    it('should not call onClose when Cancel is clicked', () => {
      render(<FilterActions {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should have type button', () => {
      render(<FilterActions {...defaultProps} />);

      const cancelButton = screen.getByText('Cancel');
      expect(cancelButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Apply button', () => {
    it('should track Google Analytics event when clicked', () => {
      render(<FilterActions {...defaultProps} />);

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Filter',
        event_action: 'Click',
        event_label: 'Set Filter',
      });
    });

    it('should be disabled when hasFormFields is false', () => {
      render(<FilterActions {...defaultProps} hasFormFields={false} />);

      const applyButton = screen.getByText('Apply');
      expect(applyButton).toBeDisabled();
    });

    it('should be enabled when hasFormFields is true', () => {
      render(<FilterActions {...defaultProps} hasFormFields={true} />);

      const applyButton = screen.getByText('Apply');
      expect(applyButton).not.toBeDisabled();
    });

    it('should render as primary button', () => {
      render(<FilterActions {...defaultProps} />);

      const applyButton = screen.getByText('Apply');
      expect(applyButton).toHaveAttribute('data-variant', 'primary');
    });

    it('should have submit type', () => {
      render(<FilterActions {...defaultProps} />);

      const applyButton = screen.getByText('Apply');
      expect(applyButton).toHaveAttribute('type', 'submit');
    });
  });

  describe('onCancel prop', () => {
    it('should work without onCancel prop (optional)', () => {
      const propsWithoutCancel = {
        onReset: mockOnReset,
        onApply: mockOnApply,
        onClose: mockOnClose,
        hasFormFields: true,
      };

      render(<FilterActions {...propsWithoutCancel} />);

      const cancelButton = screen.getByText('Cancel');

      // Should not crash when onCancel is undefined
      expect(() => fireEvent.click(cancelButton)).not.toThrow();

      // trackGA should still be called
      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Filter',
        event_action: 'Click',
        event_label: 'Close',
      });
    });
  });

  describe('button interactions', () => {
    it('should only track GA once per button click', () => {
      render(<FilterActions {...defaultProps} />);

      const clearButton = screen.getByText('Clear Filters');
      const cancelButton = screen.getByText('Cancel');
      const applyButton = screen.getByText('Apply');

      fireEvent.click(clearButton);
      fireEvent.click(cancelButton);
      fireEvent.click(applyButton);

      expect(mockTrackGA).toHaveBeenCalledTimes(3);
    });

    it('should not call onApply when Apply button is disabled', () => {
      render(<FilterActions {...defaultProps} hasFormFields={false} />);

      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      expect(mockOnApply).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('layout', () => {
    it('should render buttons in correct order', () => {
      const { container } = render(<FilterActions {...defaultProps} />);

      const buttons = container.querySelectorAll('button');

      expect(buttons[0]).toHaveTextContent('Clear Filters');
      expect(buttons[1]).toHaveTextContent('Cancel');
      expect(buttons[2]).toHaveTextContent('Apply');
    });
  });

  describe('data-testid Rendering', () => {
    it('should render all elements with data-testid when dataTestId is provided', () => {
      render(<FilterActions {...defaultProps} dataTestId="custom" />);

      expect(screen.getByTestId('filter-actions-custom')).toBeInTheDocument();
      expect(
        screen.getByTestId('filter-actions-clear-filters-button-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('filter-actions-cancel-button-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('filter-actions-apply-button-custom'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<FilterActions {...defaultProps} />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="filter-actions-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is explicitly undefined', () => {
      const { container } = render(
        <FilterActions {...defaultProps} dataTestId={undefined} />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="filter-actions-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });
  });
});
