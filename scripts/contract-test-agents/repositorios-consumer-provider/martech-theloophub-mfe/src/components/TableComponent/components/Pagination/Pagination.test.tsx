import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from './Pagination';

jest.mock('@hexa-ui/icons2', () => ({
  ChevronDoubleLeft: () => null,
  ChevronDoubleRight: () => null,
  ChevronLeft: () => null,
  ChevronRight: () => null,
}));

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onFirstPage: jest.fn(),
    onPreviousPage: jest.fn(),
    onNextPage: jest.fn(),
    onLastPage: jest.fn(),
    onPageChange: jest.fn(),
    canGoToPrevious: false,
    canGoToNext: true,
    visiblePages: [1, 2, 3, 4, 5],
    dataTestId: 'pagination',
  };

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup({ delay: null });
  });

  test('should render component', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  test('should render navigation buttons', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByTestId('pagination-first')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-previous')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-next')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-last')).toBeInTheDocument();
  });

  test('should call onFirstPage when clicking first page button', async () => {
    const props = { ...defaultProps, canGoToPrevious: true, currentPage: 3 };
    render(<Pagination {...props} />);

    await user.click(screen.getByTestId('pagination-first'));

    expect(props.onFirstPage).toHaveBeenCalledTimes(1);
  });

  test('should call onPreviousPage when clicking previous page button', async () => {
    const props = { ...defaultProps, canGoToPrevious: true, currentPage: 2 };
    render(<Pagination {...props} />);

    await user.click(screen.getByTestId('pagination-previous'));

    expect(props.onPreviousPage).toHaveBeenCalledTimes(1);
  });

  test('should call onNextPage when clicking next page button', async () => {
    render(<Pagination {...defaultProps} />);

    await user.click(screen.getByTestId('pagination-next'));

    expect(defaultProps.onNextPage).toHaveBeenCalledTimes(1);
  });

  test('should call onLastPage when clicking last page button', async () => {
    render(<Pagination {...defaultProps} />);

    await user.click(screen.getByTestId('pagination-last'));

    expect(defaultProps.onLastPage).toHaveBeenCalledTimes(1);
  });

  test('should call onPageChange with correct number when clicking page', async () => {
    render(<Pagination {...defaultProps} />);

    await user.click(screen.getByTestId('pagination-page-3'));

    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  test('should disable first and previous buttons when canGoToPrevious is false', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByTestId('pagination-first')).toBeDisabled();
    expect(screen.getByTestId('pagination-previous')).toBeDisabled();
  });

  test('should disable next and last buttons when canGoToNext is false', () => {
    const props = { ...defaultProps, canGoToNext: false, currentPage: 5 };
    render(<Pagination {...props} />);

    expect(screen.getByTestId('pagination-next')).toBeDisabled();
    expect(screen.getByTestId('pagination-last')).toBeDisabled();
  });

  test('should render all visible pages', () => {
    render(<Pagination {...defaultProps} />);

    [1, 2, 3, 4, 5].forEach((page) => {
      expect(screen.getByTestId(`pagination-page-${page}`)).toBeInTheDocument();
    });
  });

  test('should render current page correctly', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const page3Button = screen.getByTestId('pagination-page-3');
    expect(page3Button).toBeInTheDocument();
    expect(page3Button).toHaveTextContent('3');
  });

  test('should render empty pages when visiblePages is not provided', () => {
    const props = { ...defaultProps, visiblePages: undefined };
    render(<Pagination {...props} />);

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  test('should accept custom dataTestId', () => {
    render(<Pagination {...defaultProps} dataTestId="custom-pagination" />);

    expect(screen.getByTestId('custom-pagination')).toBeInTheDocument();
    expect(screen.getByTestId('custom-pagination-first')).toBeInTheDocument();
    expect(
      screen.getByTestId('custom-pagination-previous'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('custom-pagination-next')).toBeInTheDocument();
    expect(screen.getByTestId('custom-pagination-last')).toBeInTheDocument();
  });

  test('should have aria-labels on navigation buttons', () => {
    render(<Pagination {...defaultProps} />);

    expect(screen.getByLabelText('First page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Last page')).toBeInTheDocument();
  });

  test('should not call callbacks when buttons are disabled', async () => {
    render(<Pagination {...defaultProps} />);

    await user.click(screen.getByTestId('pagination-first'));
    await user.click(screen.getByTestId('pagination-previous'));

    expect(defaultProps.onFirstPage).not.toHaveBeenCalled();
    expect(defaultProps.onPreviousPage).not.toHaveBeenCalled();
  });

  test('should display counter when showQuantityIndicator is true', () => {
    const props = {
      ...defaultProps,
      totalItems: 50,
      itemsPerPage: 25,
      showQuantityIndicator: true,
    };
    render(<Pagination {...props} />);

    expect(screen.getByTestId('pagination-counter')).toHaveTextContent(
      '1 - 25 of 50',
    );
  });

  test('should not display counter when showQuantityIndicator is false', () => {
    const props = {
      ...defaultProps,
      totalItems: 50,
      itemsPerPage: 25,
      showQuantityIndicator: false,
    };
    render(<Pagination {...props} />);

    expect(screen.queryByTestId('pagination-counter')).not.toBeInTheDocument();
  });

  test('should not display counter when totalItems is not provided', () => {
    render(<Pagination {...defaultProps} showQuantityIndicator={true} />);

    expect(screen.queryByTestId('pagination-counter')).not.toBeInTheDocument();
  });

  test('should not render data-testid when dataTestId prop is not provided', () => {
    const { container } = render(
      <Pagination {...defaultProps} dataTestId={undefined} />,
    );

    const elementsWithTestId = container.querySelectorAll('[data-testid]');
    expect(elementsWithTestId).toHaveLength(0);
  });

  test('should render data-testid only when dataTestId prop is provided', () => {
    render(<Pagination {...defaultProps} dataTestId="custom-pagination" />);

    expect(screen.getByTestId('custom-pagination')).toBeInTheDocument();
    expect(screen.getByTestId('custom-pagination-first')).toBeInTheDocument();
  });

  test('should render items per page selector when showItemsPerPage is true', () => {
    const onItemsPerPageChange = jest.fn();
    const { getByText, getByRole } = render(
      <Pagination
        {...defaultProps}
        showItemsPerPage={true}
        itemsPerPage={25}
        onItemsPerPageChange={onItemsPerPageChange}
        itemsPerPageOptions={[10, 25, 50, 100]}
      />,
    );

    expect(getByText('Items per page:')).toBeInTheDocument();
    expect(getByRole('combobox')).toHaveValue('25');
  });

  test('should call onItemsPerPageChange when selector value changes', async () => {
    const onItemsPerPageChange = jest.fn();
    const { getByRole } = render(
      <Pagination
        {...defaultProps}
        showItemsPerPage={true}
        itemsPerPage={25}
        onItemsPerPageChange={onItemsPerPageChange}
        itemsPerPageOptions={[10, 25, 50, 100]}
      />,
    );

    await user.selectOptions(getByRole('combobox'), '50');

    expect(onItemsPerPageChange).toHaveBeenCalledWith(50);
  });

  test('should not render items per page selector when showItemsPerPage is false', () => {
    const { queryByText } = render(
      <Pagination
        {...defaultProps}
        showItemsPerPage={false}
        itemsPerPage={25}
      />,
    );

    expect(queryByText('Items per page:')).not.toBeInTheDocument();
  });
});
