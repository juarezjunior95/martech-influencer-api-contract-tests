import { fireEvent, render, screen } from '@testing-library/react';
import * as hooks from 'hooks';

import * as filterHooks from '../../hooks';
import { QuickFilters } from './QuickFilters';

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(),
  usePageFilterApplied: jest.fn(),
  usePageFilterData: jest.fn(),
  usePageFilterManagement: jest.fn(),
  useDebouncedMap: jest.fn(),
}));
jest.mock('../../hooks', () => ({
  useFilterHandlers: jest.fn(),
  useTotalAppliedFilters: jest.fn(),
}));

jest.mock('./components', () => ({
  FiltersButton: ({ totalAppliedFilters, onOpenModal, dataTestId }: any) => (
    <button onClick={onOpenModal} data-testid={dataTestId || 'filters-button'}>
      {' '}
      Filters ({totalAppliedFilters}){' '}
    </button>
  ),
  QuickFilterItem: ({ fieldKey, dataTestId }: any) => (
    <div data-testid={dataTestId || `quick-filter-${fieldKey}`}>{fieldKey}</div>
  ),
  ExpandFiltersButton: ({
    isExpanded,
    onToggle,
    hiddenFiltersCount,
    dataTestId,
  }: any) => (
    <button onClick={onToggle} data-testid={dataTestId || 'expand-button'}>
      {' '}
      {isExpanded ? 'Collapse' : `Expand (${hiddenFiltersCount})`}{' '}
    </button>
  ),
  ClearAllButton: ({ onClearAll, dataTestId }: any) => (
    <button onClick={onClearAll} data-testid={dataTestId || 'clear-all-button'}>
      {' '}
      Clear All{' '}
    </button>
  ),
}));
jest.mock('./rules', () => ({
  applyFilterRules: jest.fn((fields) => fields || []),
}));
jest.mock('./QuickFilters.styles', () => ({
  QuickFiltersContainer: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'quick-filters'}>{children}</div>
  ),
}));

describe('QuickFilters', () => {
  const mockOnApply = jest.fn();
  const mockOnReset = jest.fn();
  const mockOnOpenModal = jest.fn();
  const mockHandleAutoApplyChange = jest.fn();
  const mockHandleReset = jest.fn();
  const mockHandleResetAndApply = jest.fn();
  const mockUpdateForm = jest.fn();
  const mockUpdateAllForm = jest.fn();
  const mockApply = jest.fn();
  const mockResetToDefaults = jest.fn();

  const defaultProps = {
    visibleFields: ['zone', 'country', 'brands'],
    onApply: mockOnApply,
    onReset: mockOnReset,
    onOpenModal: mockOnOpenModal,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (hooks.useCurrentPage as jest.Mock).mockReturnValue({
      currentPage: 'test-page',
    });

    (hooks.usePageFilterApplied as jest.Mock).mockReturnValue({
      applied: { zone: 'LATAM', country: 'BR' },
    });

    (hooks.usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {},
      appliedDataFilters: {},
      defaults: { zone: 'LATAM' },
    });

    (hooks.usePageFilterManagement as jest.Mock).mockReturnValue({
      updateForm: mockUpdateForm,
      updateAllForm: mockUpdateAllForm,
      apply: mockApply,
      resetToDefaults: mockResetToDefaults,
    });

    (hooks.useDebouncedMap as jest.Mock).mockImplementation((fn) => fn);

    (filterHooks.useFilterHandlers as jest.Mock).mockReturnValue({
      handleAutoApplyChange: mockHandleAutoApplyChange,
      handleReset: mockHandleReset,
      handleResetAndApply: mockHandleResetAndApply,
    });

    (filterHooks.useTotalAppliedFilters as jest.Mock).mockReturnValue({
      totalAppliedFilters: 2,
      totalFixedAppliedFilters: 2,
    });
  });

  describe('rendering', () => {
    it('should not render when visibleFields is empty', () => {
      render(<QuickFilters {...defaultProps} visibleFields={[]} />);

      expect(screen.queryByTestId('quick-filters')).not.toBeInTheDocument();
    });

    it('should not render when visibleFields is undefined', () => {
      render(<QuickFilters {...defaultProps} visibleFields={undefined} />);

      expect(screen.queryByTestId('quick-filters')).not.toBeInTheDocument();
    });

    it('should render all main components', () => {
      render(<QuickFilters {...defaultProps} />);

      expect(screen.getByTestId('quick-filters')).toBeInTheDocument();
      expect(screen.getByTestId('filters-button')).toBeInTheDocument();
      expect(screen.getByTestId('clear-all-button')).toBeInTheDocument();
    });

    it('should render QuickFilterItem for each visible field', () => {
      render(<QuickFilters {...defaultProps} />);

      expect(screen.getByTestId('quick-filter-zone')).toBeInTheDocument();
      expect(screen.getByTestId('quick-filter-country')).toBeInTheDocument();
      expect(screen.getByTestId('quick-filter-brands')).toBeInTheDocument();
    });
  });

  describe('filters expansion', () => {
    it('should show expand button when more than MAX_VISIBLE_FILTERS', () => {
      const manyFields = Array.from({ length: 10 }, (_, i) => `field${i}`);
      render(<QuickFilters {...defaultProps} visibleFields={manyFields} />);

      expect(screen.getByTestId('expand-button')).toBeInTheDocument();
    });

    it('should not show expand button when less than or equal MAX_VISIBLE_FILTERS', () => {
      render(<QuickFilters {...defaultProps} visibleFields={['zone']} />);

      expect(screen.queryByTestId('expand-button')).not.toBeInTheDocument();
    });

    it('should expand filters when expand button is clicked', () => {
      const manyFields = Array.from({ length: 10 }, (_, i) => `field${i}`);
      render(<QuickFilters {...defaultProps} visibleFields={manyFields} />);

      const expandButton = screen.getByTestId('expand-button');
      expect(expandButton).toHaveTextContent('Expand');

      fireEvent.click(expandButton);

      expect(expandButton).toHaveTextContent('Collapse');
    });
  });

  describe('integration with hooks', () => {
    it('should call useFilterHandlers with correct params', () => {
      render(<QuickFilters {...defaultProps} />);

      expect(filterHooks.useFilterHandlers).toHaveBeenCalledWith({
        updateForm: mockUpdateForm,
        updateAllForm: mockUpdateAllForm,
        applied: { zone: 'LATAM', country: 'BR' },
        apply: mockApply,
        resetToDefaults: mockResetToDefaults,
        defaults: { zone: 'LATAM' },
        onApply: mockOnApply,
        onReset: mockOnReset,
      });
    });

    it('should pass totalAppliedFilters to FiltersButton', () => {
      render(<QuickFilters {...defaultProps} />);

      expect(screen.getByTestId('filters-button')).toHaveTextContent(
        'Filters (2)',
      );
    });

    it('should call onOpenModal when FiltersButton is clicked', () => {
      render(<QuickFilters {...defaultProps} />);

      fireEvent.click(screen.getByTestId('filters-button'));

      expect(mockOnOpenModal).toHaveBeenCalled();
    });

    it('should call handleResetAndApply when ClearAllButton is clicked', () => {
      render(<QuickFilters {...defaultProps} />);

      fireEvent.click(screen.getByTestId('clear-all-button'));

      expect(mockHandleResetAndApply).toHaveBeenCalled();
    });
  });

  describe('getCurrentValue callback', () => {
    it('should return applied value for existing key', () => {
      (hooks.usePageFilterApplied as jest.Mock).mockReturnValue({
        applied: { zone: 'LATAM', country: 'BR' },
      });

      const { rerender } = render(<QuickFilters {...defaultProps} />);

      (hooks.usePageFilterApplied as jest.Mock).mockReturnValue({
        applied: { zone: 'APAC', country: 'US' },
      });

      rerender(<QuickFilters {...defaultProps} />);

      expect(hooks.usePageFilterApplied).toHaveBeenCalled();
    });
  });

  describe('data-testid Rendering', () => {
    it('should render all elements with data-testid when dataTestId is provided', () => {
      render(<QuickFilters {...defaultProps} dataTestId="custom" />);

      expect(screen.getByTestId('quick-filters-custom')).toBeInTheDocument();
      expect(screen.getByTestId('custom-filters-button')).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-quick-filter-item-zone'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-quick-filter-item-country'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('custom-quick-filter-item-brands'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('custom-clear-all-button')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<QuickFilters {...defaultProps} />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="quick-filters-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByTestId('quick-filters')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is explicitly undefined', () => {
      const { container } = render(
        <QuickFilters {...defaultProps} dataTestId={undefined} />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="quick-filters-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByTestId('quick-filters')).toBeInTheDocument();
    });

    it('should pass dataTestId to ExpandFiltersButton when expanded', () => {
      const manyFields = Array.from({ length: 10 }, (_, i) => `field${i}`);
      render(
        <QuickFilters
          {...defaultProps}
          visibleFields={manyFields}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('custom-expand-filters-button'),
      ).toBeInTheDocument();
    });
  });
});
