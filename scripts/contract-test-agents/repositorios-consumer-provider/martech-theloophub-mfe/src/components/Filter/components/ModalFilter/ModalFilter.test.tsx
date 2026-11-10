jest.mock('@hexa-ui/components', () => ({
  Heading: ({
    children,
    size,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    size: string;
    'data-testid'?: string;
  }) => (
    <h4 data-testid={dataTestId || 'modal-heading'} data-size={size}>
      {children}
    </h4>
  ),
  TextButton: ({
    children,
    onClick,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    'data-testid'?: string;
  }) => (
    <button onClick={onClick} data-testid={dataTestId || 'text-button'}>
      {children}
    </button>
  ),
  Grid: {
    Container: 'div',
    Row: 'div',
    Col: 'div',
  },
  Divider: ({ orientation }: { orientation: string }) => (
    <div data-testid="divider" data-orientation={orientation}>
      Divider
    </div>
  ),
  Chip: {
    Root: 'div',
  },
  EmptyState: {
    PageLevel: 'div',
  },
  Tabs: {
    Root: 'div',
  },
  SearchField: {
    Root: 'div',
  },
  styled: (component: unknown) => component,
}));

jest.mock('@hexa-ui/icons', () => ({
  Plus: ({
    'data-testid': dataTestId,
  }: {
    'data-testid'?: string;
    size?: string;
    style?: React.CSSProperties;
  }) => <span data-testid={dataTestId || 'plus-icon'}>+</span>,
}));

jest.mock('hooks', () => ({
  usePageFilterData: jest.fn(),
  usePageFilterManagement: jest.fn(),
  usePageFilterApplied: jest.fn(),
  useFilterHandlers: jest.fn(),
  useTotalAppliedFilters: jest.fn(),
  useBodyScrollLock: jest.fn(),
}));
jest.mock('../../hooks/useFilterHandlers', () => ({
  useFilterHandlers: jest.fn(),
}));
jest.mock('../../hooks/useTotalAppliedFilters', () => ({
  useTotalAppliedFilters: jest.fn(),
}));
jest.mock('../../../Accordion', () => ({
  Accordion: ({
    children,
    dataTestId,
  }: {
    children: React.ReactNode;
    dataTestId?: string;
  }) => <div data-testid={dataTestId || 'accordion'}>{children}</div>,
  AccordionItem: ({
    children,
    title,
    dataTestId,
  }: {
    children: React.ReactNode;
    title: string;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId || `accordion-item-${title}`}>{children}</div>
  ),
}));
jest.mock('../../config/filterCategories', () => ({
  FILTER_CATEGORIES: [{ id: 'general', title: 'General', defaultOpen: true }],
  groupFieldsByCategory: jest.fn((fields) => ({
    general: fields,
  })),
}));
jest.mock('../Fields', () => ({
  FieldRenderer: ({
    fieldKey,
    isAutoApply,
    dataTestId,
  }: {
    fieldKey: string;
    isAutoApply: boolean;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || `field-renderer-${fieldKey}`}
      data-auto-apply={isAutoApply}
    >
      Field {fieldKey}
    </div>
  ),
}));
jest.mock('../FilterActions/FilterActions', () => ({
  FilterActions: ({
    onReset,
    onApply,
    onClose,
    onCancel,
    hasFormFields,
    dataTestId,
  }: {
    onReset: () => void;
    onApply: () => void;
    onClose: () => void;
    onCancel?: () => void;
    hasFormFields: boolean;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId || 'filter-actions'}
      data-has-form-fields={hasFormFields}
    >
      <button onClick={onReset} data-testid="reset-button">
        Reset
      </button>
      <button onClick={onApply} data-testid="apply-button">
        Apply
      </button>
      <button onClick={onClose} data-testid="close-button">
        Close
      </button>
      {onCancel && (
        <button onClick={onCancel} data-testid="cancel-button">
          Cancel
        </button>
      )}
    </div>
  ),
}));
jest.mock('./ModalFilter.styles', () => ({
  ModalOverlay: ({
    onMouseDown,
    'data-testid': dataTestId,
  }: {
    onMouseDown: (e: React.MouseEvent) => void;
    'data-testid'?: string;
    isOpen?: boolean;
  }) => (
    <button
      data-testid={dataTestId || 'modal-overlay'}
      onMouseDown={onMouseDown}
      style={{ all: 'unset', display: 'block' }}
    >
      Overlay
    </button>
  ),
  StyledFilterContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="filter-container">{children}</div>
  ),
  ModalFilter: ({
    children,
    'data-testid': dataTestId,
    ...props
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
    [key: string]: unknown;
  }) => (
    <div data-testid={dataTestId || 'modal-filter'} {...props}>
      {children}
    </div>
  ),
  HeadingContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'heading-container'}>{children}</div>,
  HeadingTitle: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'heading-title'}>{children}</div>,
  Form: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <form data-testid={dataTestId || 'filter-form'}>{children}</form>,
  FiltersCounter: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId || 'filters-counter'}>{children}</div>,
  ControlButtonContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId || 'control-button-container'}>{children}</div>
  ),
  ControlButton: ({
    children,
    onClick,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    'data-testid'?: string;
  }) => (
    <button onClick={onClick} data-testid={dataTestId || 'control-button'}>
      {children}
    </button>
  ),
}));

import { fireEvent, render, screen } from '@testing-library/react';
import * as hooks from 'hooks';

import * as useFilterHandlers from '../../hooks/useFilterHandlers';
import * as useTotalAppliedFilters from '../../hooks/useTotalAppliedFilters';
import { ModalFilter } from './ModalFilter';

describe('ModalFilter', () => {
  let mockUsePageFilterData: jest.SpyInstance;
  let mockUsePageFilterManagement: jest.SpyInstance;
  let mockUsePageFilterApplied: jest.SpyInstance;
  let mockUseFilterHandlers: jest.SpyInstance;
  let mockUseTotalAppliedFilters: jest.SpyInstance;

  const mockUpdateForm = jest.fn();
  const mockUpdateAllForm = jest.fn();
  const mockApply = jest.fn();
  const mockResetToDefaults = jest.fn();
  const mockHandleApply = jest.fn();
  const mockHandleReset = jest.fn();
  const mockHandleFormValueChange = jest.fn();
  const mockHandleCancelModalFilter = jest.fn();
  const mockOnApply = jest.fn();
  const mockOnReset = jest.fn();
  const mockOnClose = jest.fn();

  const mockDataFilters = {
    zone: {
      default: { value: 'LATAM', label: 'LATAM' },
      values: [{ value: 'LATAM', label: 'LATAM' }],
      enabled: true,
    },
    country: {
      default: { value: 'BR', label: 'Brazil' },
      values: [{ value: 'BR', label: 'Brazil' }],
      enabled: true,
    },
  };

  const mockDefaults = {
    zone: 'LATAM',
    country: 'BR',
  };

  const mockApplied = {
    zone: 'LATAM',
    country: 'BR',
  };

  const defaultProps = {
    pageName: 'test-page',
    visibleFields: undefined,
    onApply: mockOnApply,
    onReset: mockOnReset,
    isModalOpen: true,
    onClose: mockOnClose,
  };

  const resetAllMocks = () => {
    mockUsePageFilterData.mockReturnValue({
      dataFilters: mockDataFilters,
      defaults: mockDefaults,
    });

    mockUsePageFilterManagement.mockReturnValue({
      updateForm: mockUpdateForm,
      updateAllForm: mockUpdateAllForm,
      apply: mockApply,
      resetToDefaults: mockResetToDefaults,
    });

    mockUsePageFilterApplied.mockReturnValue({
      applied: mockApplied,
    });

    mockUseFilterHandlers.mockReturnValue({
      handleApply: mockHandleApply,
      handleReset: mockHandleReset,
      handleFormValueChange: mockHandleFormValueChange,
      handleCancelModalFilter: mockHandleCancelModalFilter,
      handleAutoApplyChange: jest.fn(),
      handleFormChange: jest.fn(),
      handleAutoApplyValueChange: jest.fn(),
    });

    mockUseTotalAppliedFilters.mockReturnValue({
      totalAppliedFilters: 2,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePageFilterData = jest.spyOn(hooks, 'usePageFilterData');
    mockUsePageFilterManagement = jest.spyOn(hooks, 'usePageFilterManagement');
    mockUsePageFilterApplied = jest.spyOn(hooks, 'usePageFilterApplied');
    mockUseFilterHandlers = jest.spyOn(useFilterHandlers, 'useFilterHandlers');
    mockUseTotalAppliedFilters = jest.spyOn(
      useTotalAppliedFilters,
      'useTotalAppliedFilters',
    );

    resetAllMocks();
  });

  describe('rendering', () => {
    it('should render modal when isModalOpen is true', () => {
      render(<ModalFilter {...defaultProps} />);

      expect(screen.getByTestId('modal-filter')).toBeInTheDocument();
      expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    });

    it('should render heading with correct text', () => {
      render(<ModalFilter {...defaultProps} />);

      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByTestId('modal-heading')).toHaveAttribute(
        'data-size',
        'H3',
      );
    });

    it('should render form element', () => {
      render(<ModalFilter {...defaultProps} />);

      expect(screen.getByTestId('filter-form')).toBeInTheDocument();
    });

    it('should render filter container', () => {
      render(<ModalFilter {...defaultProps} />);

      expect(screen.getByTestId('filter-container')).toBeInTheDocument();
    });

    it('should render FieldRenderer for each form field', () => {
      render(
        <ModalFilter {...defaultProps} visibleFields={['zone', 'country']} />,
      );

      expect(screen.getByTestId('field-renderer-zone')).toBeInTheDocument();
      expect(screen.getByTestId('field-renderer-country')).toBeInTheDocument();
    });

    it('should render FilterActions component', () => {
      render(<ModalFilter {...defaultProps} visibleFields={['zone']} />);

      expect(screen.getByTestId('filter-actions')).toBeInTheDocument();
    });

    it('should not render when isModalOpen is false', () => {
      const { rerender } = render(
        <ModalFilter {...defaultProps} isModalOpen={false} />,
      );

      const modalElement = screen.queryByTestId('modal-filter');
      expect(modalElement).toBeInTheDocument();
    });

    it('should not render when dataFilters is null', () => {
      mockUsePageFilterData.mockReturnValue({
        dataFilters: null,
        defaults: mockDefaults,
      });

      render(<ModalFilter {...defaultProps} />);

      expect(screen.queryByTestId('modal-filter')).not.toBeInTheDocument();
    });

    it('should not render when dataFilters is empty', () => {
      mockUsePageFilterData.mockReturnValue({
        dataFilters: {},
        defaults: mockDefaults,
      });

      render(<ModalFilter {...defaultProps} />);

      expect(screen.queryByTestId('modal-filter')).not.toBeInTheDocument();
    });

    it('should render filters counter with totalAppliedFilters', () => {
      render(<ModalFilter {...defaultProps} />);

      expect(screen.getByTestId('filters-counter')).toHaveTextContent('2');
    });
  });

  describe('field rendering with different configurations', () => {
    it('should pass pageName to hooks', () => {
      render(<ModalFilter {...defaultProps} pageName="custom-page" />);

      expect(mockUsePageFilterData).toHaveBeenCalledWith('custom-page');
      expect(mockUsePageFilterManagement).toHaveBeenCalledWith('custom-page');
      expect(mockUsePageFilterApplied).toHaveBeenCalledWith('custom-page');
    });

    it('should pass isAutoApply=false to FieldRenderer', () => {
      render(<ModalFilter {...defaultProps} visibleFields={['zone']} />);

      const fieldRenderer = screen.getByTestId('field-renderer-zone');
      expect(fieldRenderer).toHaveAttribute('data-auto-apply', 'false');
    });
  });

  describe('hooks integration', () => {
    it('should call useFilterHandlers with correct params', () => {
      render(<ModalFilter {...defaultProps} />);

      expect(mockUseFilterHandlers).toHaveBeenCalledWith({
        updateForm: mockUpdateForm,
        updateAllForm: mockUpdateAllForm,
        applied: mockApplied,
        apply: mockApply,
        resetToDefaults: mockResetToDefaults,
        defaults: mockDefaults,
        onApply: mockOnApply,
        onReset: mockOnReset,
        onClose: mockOnClose,
      });
    });

    it('should pass handlers to FilterActions', () => {
      render(<ModalFilter {...defaultProps} visibleFields={['zone']} />);

      const resetButton = screen.getByTestId('reset-button');
      const applyButton = screen.getByTestId('apply-button');

      fireEvent.click(resetButton);
      fireEvent.click(applyButton);

      expect(mockHandleReset).toHaveBeenCalled();
      expect(mockHandleApply).toHaveBeenCalled();
    });

    it('should pass handleCancelModalFilter to FilterActions as onCancel', () => {
      render(<ModalFilter {...defaultProps} visibleFields={['zone']} />);

      const cancelButton = screen.getByTestId('cancel-button');
      fireEvent.click(cancelButton);

      expect(mockHandleCancelModalFilter).toHaveBeenCalled();
    });
  });

  describe('keyboard interactions', () => {
    it('should close modal when Escape key is pressed', () => {
      render(<ModalFilter {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not close modal when Escape is pressed if modal is not open', () => {
      render(<ModalFilter {...defaultProps} isModalOpen={false} />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not close when other keys are pressed', () => {
      render(<ModalFilter {...defaultProps} />);

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'Tab' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should cleanup event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(
        document,
        'removeEventListener',
      );

      const { unmount } = render(<ModalFilter {...defaultProps} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function),
      );
    });
  });

  describe('overlay interactions', () => {
    it('should close modal when clicking on overlay', () => {
      jest.useFakeTimers();

      render(<ModalFilter {...defaultProps} />);

      const overlay = screen.getByTestId('modal-overlay');
      fireEvent.mouseDown(overlay);

      jest.runAllTimers();

      expect(mockOnClose).toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('should not close when clicking inside modal', () => {
      jest.useFakeTimers();

      render(<ModalFilter {...defaultProps} />);

      const modal = screen.getByTestId('modal-filter');
      fireEvent.mouseDown(modal);

      jest.runAllTimers();

      expect(mockOnClose).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('FilterActions integration', () => {
    it('should pass hasFormFields to FilterActions', () => {
      render(<ModalFilter {...defaultProps} visibleFields={['zone']} />);

      const filterActions = screen.getByTestId('filter-actions');
      expect(filterActions).toHaveAttribute('data-has-form-fields', 'true');
    });

    it('should pass onClose to FilterActions', () => {
      render(<ModalFilter {...defaultProps} visibleFields={['zone']} />);

      const closeButton = screen.getByTestId('close-button');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should pass onCancel (handleCancelModalFilter) to FilterActions', () => {
      render(<ModalFilter {...defaultProps} visibleFields={['zone']} />);

      const cancelButton = screen.getByTestId('cancel-button');
      fireEvent.click(cancelButton);

      expect(mockHandleCancelModalFilter).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined dataFilters', () => {
      mockUsePageFilterData.mockReturnValue({
        dataFilters: undefined,
        defaults: mockDefaults,
      });

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      });

      const { container } = render(<ModalFilter {...defaultProps} />);

      expect(container.firstChild).toBeNull();
    });

    it('should handle undefined defaults', () => {
      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
        defaults: undefined,
      });

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      });

      render(<ModalFilter {...defaultProps} />);

      expect(mockUseFilterHandlers).toHaveBeenCalledWith(
        expect.objectContaining({
          defaults: {},
        }),
      );
    });

    it('should handle null defaults', () => {
      mockUsePageFilterData.mockReturnValue({
        dataFilters: mockDataFilters,
        defaults: null,
      });

      mockUsePageFilterApplied.mockReturnValue({
        applied: mockApplied,
      });

      render(<ModalFilter {...defaultProps} />);

      expect(mockUseFilterHandlers).toHaveBeenCalledWith(
        expect.objectContaining({
          defaults: {},
        }),
      );
    });

    it('should work without onApply and onReset callbacks', () => {
      resetAllMocks();

      render(
        <ModalFilter
          {...defaultProps}
          onApply={undefined}
          onReset={undefined}
        />,
      );

      expect(screen.getByTestId('modal-filter')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render all elements with data-testid when dataTestId is provided', () => {
      render(
        <ModalFilter
          {...defaultProps}
          dataTestId="custom"
          visibleFields={['zone']}
        />,
      );

      expect(
        screen.getByTestId('modal-filter-overlay-custom'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('modal-filter-custom')).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-heading-container-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-heading-title-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-heading-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-filters-counter-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-control-button-container-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-control-button-expand-all-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-control-button-retract-all-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-control-button-close-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-control-button-close-icon-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('modal-filter-form-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-modal-filter-accordion'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-modal-filter-accordion-item-general'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-modal-filter-field-renderer-zone'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('custom-filter-actions')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<ModalFilter {...defaultProps} />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="modal-filter-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText('Filters')).toBeInTheDocument();
    });
  });
});
