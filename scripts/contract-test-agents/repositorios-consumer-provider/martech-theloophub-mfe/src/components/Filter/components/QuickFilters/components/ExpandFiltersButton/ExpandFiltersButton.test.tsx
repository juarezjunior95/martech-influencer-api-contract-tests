import { fireEvent, render, screen } from '@testing-library/react';

import { ExpandFiltersButton } from './ExpandFiltersButton';

jest.mock('../../QuickFilters.styles', () => ({
  ExpandButton: ({
    children,
    onClick,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    'data-testid'?: string;
  }) => (
    <button onClick={onClick} data-testid={dataTestId || 'expand-button'}>
      {children}
    </button>
  ),
}));

describe('ExpandFiltersButton', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button', () => {
    render(
      <ExpandFiltersButton
        isExpanded={false}
        hiddenFiltersCount={5}
        onToggle={mockOnToggle}
      />,
    );

    expect(screen.getByTestId('expand-button')).toBeInTheDocument();
  });

  it('should show hidden filters count when collapsed', () => {
    render(
      <ExpandFiltersButton
        isExpanded={false}
        hiddenFiltersCount={3}
        onToggle={mockOnToggle}
      />,
    );

    expect(screen.getByText('+3 Filters')).toBeInTheDocument();
  });

  it('should show "Collapse" text when expanded', () => {
    render(
      <ExpandFiltersButton
        isExpanded={true}
        hiddenFiltersCount={3}
        onToggle={mockOnToggle}
      />,
    );

    expect(screen.getByText('Collapse')).toBeInTheDocument();
  });

  it('should call onToggle when clicked', () => {
    render(
      <ExpandFiltersButton
        isExpanded={false}
        hiddenFiltersCount={5}
        onToggle={mockOnToggle}
      />,
    );

    fireEvent.click(screen.getByTestId('expand-button'));

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  describe('data-testid Rendering', () => {
    it('should render with data-testid when dataTestId is provided', () => {
      render(
        <ExpandFiltersButton
          isExpanded={false}
          hiddenFiltersCount={5}
          onToggle={mockOnToggle}
          dataTestId="custom"
        />,
      );

      expect(
        screen.getByTestId('expand-filters-button-custom'),
      ).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(
        <ExpandFiltersButton
          isExpanded={false}
          hiddenFiltersCount={5}
          onToggle={mockOnToggle}
        />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="expand-filters-button-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText('+5 Filters')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is explicitly undefined', () => {
      const { container } = render(
        <ExpandFiltersButton
          isExpanded={false}
          hiddenFiltersCount={5}
          onToggle={mockOnToggle}
          dataTestId={undefined}
        />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="expand-filters-button-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByText('+5 Filters')).toBeInTheDocument();
    });
  });
});
