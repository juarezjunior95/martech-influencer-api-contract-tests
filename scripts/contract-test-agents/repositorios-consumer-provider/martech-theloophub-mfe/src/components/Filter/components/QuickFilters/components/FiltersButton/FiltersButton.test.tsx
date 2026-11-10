import { fireEvent, render, screen } from '@testing-library/react';

import { FiltersButton } from './FiltersButton';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
}));

jest.mock('../../QuickFilters.styles', () => ({
  QuickFiltersButton: ({
    children,
    onClick,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    'data-testid'?: string;
  }) => (
    <button onClick={onClick} data-testid={dataTestId || 'filters-button'}>
      {children}
    </button>
  ),
  QuickFiltersBadge: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <span data-testid={dataTestId || 'filters-badge'}>{children}</span>,
}));

jest.mock('assets/icons/filters.svg', () => 'filters-icon.svg');

describe('FiltersButton', () => {
  const mockOnOpenModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button with text', () => {
    render(
      <FiltersButton totalAppliedFilters={0} onOpenModal={mockOnOpenModal} />,
    );

    expect(screen.getByTestId('filters-button')).toBeInTheDocument();
    expect(screen.getByText(/Filters/)).toBeInTheDocument();
  });

  it('should display total applied filters in badge', () => {
    render(
      <FiltersButton totalAppliedFilters={5} onOpenModal={mockOnOpenModal} />,
    );

    const badge = screen.getByTestId('filters-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('5');
  });

  it('should not display badge when no filters applied', () => {
    render(
      <FiltersButton totalAppliedFilters={0} onOpenModal={mockOnOpenModal} />,
    );

    const badge = screen.queryByTestId('filters-badge');
    expect(badge).not.toBeInTheDocument();
  });

  it('should call onOpenModal when clicked', () => {
    render(
      <FiltersButton totalAppliedFilters={3} onOpenModal={mockOnOpenModal} />,
    );

    fireEvent.click(screen.getByTestId('filters-button'));

    expect(mockOnOpenModal).toHaveBeenCalledTimes(1);
  });

  it('should prevent default behavior on click', () => {
    render(
      <FiltersButton totalAppliedFilters={0} onOpenModal={mockOnOpenModal} />,
    );

    const button = screen.getByTestId('filters-button');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    button.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  describe('data-testid Rendering', () => {
    it('should render all elements with data-testid when dataTestId is provided', () => {
      render(
        <FiltersButton
          totalAppliedFilters={3}
          onOpenModal={mockOnOpenModal}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('filters-button-custom')).toBeInTheDocument();
      expect(
        screen.getByTestId('filters-button-icon-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('filters-button-icon-img-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('filters-button-badge-custom'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(
        <FiltersButton totalAppliedFilters={0} onOpenModal={mockOnOpenModal} />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="filters-button-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText(/Filters/)).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is explicitly undefined', () => {
      const { container } = render(
        <FiltersButton
          totalAppliedFilters={0}
          onOpenModal={mockOnOpenModal}
          dataTestId={undefined}
        />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="filters-button-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText(/Filters/)).toBeInTheDocument();
    });

    it('should render badge with data-testid when filters are applied and dataTestId is provided', () => {
      render(
        <FiltersButton
          totalAppliedFilters={5}
          onOpenModal={mockOnOpenModal}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('filters-button-badge-custom'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('filters-button-badge-custom'),
      ).toHaveTextContent('5');
    });
  });
});
