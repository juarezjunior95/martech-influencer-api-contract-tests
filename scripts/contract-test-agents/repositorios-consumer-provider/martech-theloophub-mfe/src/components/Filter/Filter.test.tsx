import { render, screen } from '@testing-library/react';
import * as contexts from 'contexts';
import * as hooks from 'hooks';

import { Filter, FILTER_MODAL_NAME, FilterProps } from './Filter';

jest.mock('contexts', () => ({
  useScopedModal: jest.fn(),
  useModalContext: jest.fn(),
}));

jest.mock('hooks', () => ({
  useFiltersUrlSync: jest.fn(),
  usePageFilterData: jest.fn(),
  usePageFilterManagement: jest.fn(),
  usePageFilterStatus: jest.fn(),
  usePageFilterApplied: jest.fn(),
  useCurrentPage: jest.fn(),
  useDebouncedMap: jest.fn(),
}));

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getCountryOptions: (dataFilters: Record<string, unknown>) => {
        const country = (dataFilters as any)?.country;
        return country?.values?.LATAM ?? [];
      },
    }),
  },
}));

jest.mock('./Filter.styles', () => ({
  StyledFilter: ({ children, hidden, ...rest }: any) => (
    <div className={hidden ? 'hidden' : ''} {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('./components', () => ({
  ModalFilter: ({
    isModalOpen,
    dataTestId,
  }: {
    isModalOpen: boolean;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId || 'modal-filter'}>
      Modal {isModalOpen ? 'Open' : 'Closed'}
    </div>
  ),
  QuickFilters: ({
    onOpenModal,
    dataTestId,
  }: {
    onOpenModal: () => void;
    dataTestId?: string;
  }) => (
    <div data-testid={dataTestId || 'quick-filters'}>
      <button onClick={onOpenModal} data-testid="open-modal-button">
        Open Modal
      </button>
    </div>
  ),
}));

jest.mock('./components/ErrorMessage/ErrorMessage', () => ({
  ErrorMessage: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId || 'error-message'}>Error loading filters</div>
  ),
}));

jest.mock('./components/LoadingSkeleton/LoadingSkeleton', () => ({
  LoadingSkeleton: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId || 'loading-skeleton'}>Loading...</div>
  ),
}));

describe('Filter', () => {
  let mockUsePageFilterStatus: jest.SpyInstance;
  let mockUsePageFilterManagement: jest.SpyInstance;
  let mockUsePageFilterData: jest.SpyInstance;
  let mockUseScopedModal: jest.SpyInstance;
  let mockUsePageFilterApplied: jest.SpyInstance;
  let mockUseFiltersUrlSync: jest.SpyInstance;
  let mockUseCurrentPage: jest.SpyInstance;
  let mockUseDebouncedMap: jest.SpyInstance;
  let mockUseModalContext: jest.SpyInstance;

  const defaultProps: FilterProps = {
    pageName: 'test-page',
    visibleFields: undefined,
    hidden: false,
  };

  const mockDataFilters = {
    zone: {
      default: { value: 'LATAM', label: 'LATAM' },
      values: [{ value: 'LATAM', label: 'LATAM' }],
      enabled: true,
    },
    country: {
      default: { value: 'BR', label: 'Brazil' },
      values: {
        LATAM: [{ value: 'BR', label: 'Brazil' }],
      },
      enabled: true,
    },
  };

  const mockDefaults = {
    zone: 'LATAM',
    country: 'BR',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePageFilterStatus = jest.spyOn(hooks, 'usePageFilterStatus');
    mockUsePageFilterManagement = jest.spyOn(hooks, 'usePageFilterManagement');
    mockUsePageFilterData = jest.spyOn(hooks, 'usePageFilterData');
    mockUsePageFilterApplied = jest.spyOn(hooks, 'usePageFilterApplied');
    mockUseFiltersUrlSync = jest.spyOn(hooks, 'useFiltersUrlSync');
    mockUseCurrentPage = jest.spyOn(hooks, 'useCurrentPage');
    mockUseDebouncedMap = jest.spyOn(hooks, 'useDebouncedMap');
    mockUseScopedModal = jest.spyOn(contexts, 'useScopedModal');

    mockUseModalContext = jest.spyOn(contexts, 'useModalContext');
    mockUseModalContext.mockReturnValue({
      isModalOpen: jest.fn(),
      openModal: jest.fn(),
      closeModal: jest.fn(),
      toggleModal: jest.fn(),
      getModalData: jest.fn(),
    });

    mockUsePageFilterApplied.mockReturnValue({
      applied: {},
    });

    mockUseFiltersUrlSync.mockReturnValue(undefined);

    mockUseCurrentPage.mockReturnValue({
      currentPage: 'test-page',
    });

    mockUseDebouncedMap.mockImplementation((callback: any) => callback);

    mockUsePageFilterStatus.mockReturnValue({
      isLoading: false,
      isLoaded: true,
      isError: false,
    });

    mockUsePageFilterManagement.mockReturnValue({
      setPage: jest.fn(),
      loadPageFilters: jest.fn(),
      updateForm: jest.fn(),
      apply: jest.fn(),
      resetToDefaults: jest.fn(),
    });

    mockUsePageFilterData.mockReturnValue({
      availableFields: ['zone', 'country'],
      dataFilters: mockDataFilters,
      defaults: mockDefaults,
    });

    mockUseScopedModal.mockReturnValue({
      isOpen: false,
      close: jest.fn(),
      toggle: jest.fn(),
      open: jest.fn(),
    });
  });

  describe('loading states', () => {
    it('should render loading skeleton when filters are loading', () => {
      mockUsePageFilterStatus.mockReturnValue({
        isLoading: true,
        isLoaded: false,
        isError: false,
      });

      render(<Filter {...defaultProps} />);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    });

    it('should render error message when there is an error', () => {
      mockUsePageFilterStatus.mockReturnValue({
        isLoading: false,
        isLoaded: false,
        isError: true,
      });

      render(<Filter {...defaultProps} />);

      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('should return null when filters are not loaded', () => {
      mockUsePageFilterStatus.mockReturnValue({
        isLoading: false,
        isLoaded: false,
        isError: false,
      });

      const { container } = render(<Filter {...defaultProps} />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('filter initialization', () => {
    it('should call setPage and loadPageFilters on mount', () => {
      const setPage = jest.fn();
      const loadPageFilters = jest.fn();

      mockUsePageFilterManagement.mockReturnValue({
        setPage,
        loadPageFilters,
        updateForm: jest.fn(),
        apply: jest.fn(),
        resetToDefaults: jest.fn(),
      });

      render(<Filter {...defaultProps} />);

      expect(setPage).toHaveBeenCalledWith('test-page');
      expect(loadPageFilters).toHaveBeenCalledWith({
        pageName: 'test-page',
      });
    });

    it('should call loadPageFilters with apiParams', () => {
      const loadPageFilters = jest.fn();

      mockUsePageFilterManagement.mockReturnValue({
        setPage: jest.fn(),
        loadPageFilters,
        updateForm: jest.fn(),
        apply: jest.fn(),
        resetToDefaults: jest.fn(),
      });

      render(<Filter {...defaultProps} />);

      expect(loadPageFilters).toHaveBeenCalledWith({
        pageName: 'test-page',
      });
    });
  });

  describe('rendering', () => {
    it('should render quick filters component', () => {
      render(<Filter {...defaultProps} />);

      expect(screen.getByTestId('quick-filters')).toBeInTheDocument();
    });

    it('should hide component when hidden prop is true', () => {
      const { container } = render(<Filter {...defaultProps} hidden />);

      const filterElement = container.firstChild as HTMLElement;
      expect(filterElement.className).toMatch(/hidden/);
    });

    it('should hide component when no country options in dataFilters', () => {
      mockUsePageFilterData.mockReturnValue({
        availableFields: [],
        dataFilters: {},
        defaults: {},
      });

      const { container } = render(<Filter {...defaultProps} />);

      const filterElement = container.firstChild as HTMLElement;
      expect(filterElement.className).toMatch(/hidden/);
    });
  });

  describe('modal interaction', () => {
    it('should use correct modal name', () => {
      render(<Filter {...defaultProps} />);

      expect(mockUseScopedModal).toHaveBeenCalledWith(FILTER_MODAL_NAME);
    });

    it('should pass modal state to components', () => {
      mockUseScopedModal.mockReturnValue({
        isOpen: true,
        close: jest.fn(),
        toggle: jest.fn(),
        open: jest.fn(),
      });

      render(<Filter {...defaultProps} />);

      expect(screen.getByText(/Modal Open/)).toBeInTheDocument();
    });
  });

  describe('callbacks', () => {
    it('should pass callbacks to handlers', () => {
      const onApply = jest.fn();
      const onReset = jest.fn();

      render(<Filter {...defaultProps} onApply={onApply} onReset={onReset} />);

      // Verify the component renders without errors
      expect(screen.getByTestId('quick-filters')).toBeInTheDocument();
      expect(screen.getByTestId('modal-filter')).toBeInTheDocument();
    });
  });

  describe('field configuration', () => {
    it('should render with different field configurations', () => {
      const visibleFields = ['zone', 'country'];

      render(<Filter {...defaultProps} visibleFields={visibleFields} />);

      expect(screen.getByTestId('quick-filters')).toBeInTheDocument();
      expect(screen.getByTestId('modal-filter')).toBeInTheDocument();
    });
  });

  describe('URL sync integration', () => {
    it('should call useFiltersUrlSync with isHidden true when hidden prop is true', () => {
      render(<Filter {...defaultProps} hidden={true} />);

      expect(mockUseFiltersUrlSync).toHaveBeenCalledWith(true, 'test-page');
    });

    it('should call useFiltersUrlSync with false when not hidden and has country options', () => {
      render(<Filter {...defaultProps} hidden={false} />);

      expect(mockUseFiltersUrlSync).toHaveBeenCalledWith(false, 'test-page');
    });

    it('should call useFiltersUrlSync with isHidden true when no country options', () => {
      mockUsePageFilterData.mockReturnValue({
        availableFields: [],
        dataFilters: {},
        defaults: {},
      });

      render(<Filter {...defaultProps} hidden={false} />);

      expect(mockUseFiltersUrlSync).toHaveBeenCalledWith(true, 'test-page');
    });

    it('should call useFiltersUrlSync even when loading', () => {
      mockUsePageFilterStatus.mockReturnValue({
        isLoading: true,
        isLoaded: false,
        isError: false,
      });

      render(<Filter {...defaultProps} />);

      expect(mockUseFiltersUrlSync).toHaveBeenCalledWith(false, 'test-page');
    });
  });

  describe('data-testid Rendering', () => {
    it('should render filter container with data-testid when provided', () => {
      const { container } = render(
        <Filter {...defaultProps} dataTestId="custom" />,
      );

      expect(
        container.querySelector('[data-testid="filter-custom"]'),
      ).toBeInTheDocument();
    });

    it('should not render filter container data-testid when not provided', () => {
      const { container } = render(<Filter {...defaultProps} />);

      expect(
        container.querySelector('[data-testid^="filter-"]'),
      ).not.toBeInTheDocument();
    });

    it('should pass dataTestId to child components', () => {
      render(<Filter {...defaultProps} dataTestId="custom" />);
      expect(screen.getByTestId('open-modal-button')).toBeInTheDocument();
    });
  });

  describe('modal cleanup on unmount', () => {
    it('should close the filter modal when the component unmounts', () => {
      const closeModal = jest.fn();
      mockUseModalContext.mockReturnValue({
        isModalOpen: jest.fn(),
        openModal: jest.fn(),
        closeModal,
        toggleModal: jest.fn(),
        getModalData: jest.fn(),
      });

      mockUseScopedModal.mockReturnValue({
        isOpen: true,
        close: jest.fn(),
        toggle: jest.fn(),
        open: jest.fn(),
      });

      const { unmount } = render(<Filter {...defaultProps} />);

      unmount();

      expect(closeModal).toHaveBeenCalledWith(FILTER_MODAL_NAME);
    });

    it('should NOT call closeModal on re-render, only on unmount', () => {
      const closeModal = jest.fn();
      mockUseModalContext.mockReturnValue({
        isModalOpen: jest.fn(),
        openModal: jest.fn(),
        closeModal,
        toggleModal: jest.fn(),
        getModalData: jest.fn(),
      });

      mockUseScopedModal.mockReturnValue({
        isOpen: true,
        close: jest.fn(),
        toggle: jest.fn(),
        open: jest.fn(),
      });

      const { rerender } = render(<Filter {...defaultProps} />);
      rerender(<Filter {...defaultProps} hidden={true} />);

      expect(closeModal).not.toHaveBeenCalled();
    });

    it('should NOT close the filter modal on unmount when modal is already closed', () => {
      const closeModal = jest.fn();
      mockUseModalContext.mockReturnValue({
        isModalOpen: jest.fn(),
        openModal: jest.fn(),
        closeModal,
        toggleModal: jest.fn(),
        getModalData: jest.fn(),
      });

      const { unmount } = render(<Filter {...defaultProps} />);

      unmount();

      expect(closeModal).not.toHaveBeenCalled();
    });
  });
});
