import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TableFooter } from './TableFooter';

describe('TableFooter', () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    onFirstPage: jest.fn(),
    onPreviousPage: jest.fn(),
    onNextPage: jest.fn(),
    onLastPage: jest.fn(),
    onPageChange: jest.fn(),
    canGoToPrevious: false,
    canGoToNext: true,
    visiblePages: [1, 2, 3, 4, 5],
    dataTestId: 'table-footer',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render component', () => {
    render(<TableFooter {...defaultProps} />);
    expect(screen.getByTestId('table-footer')).toBeInTheDocument();
  });

  test('should display item counter correctly', () => {
    render(<TableFooter {...defaultProps} />);
    expect(
      screen.getByTestId('table-footer-pagination-counter'),
    ).toHaveTextContent('1 - 10 of 50');
  });

  test('should calculate item range correctly on page 2', () => {
    render(
      <TableFooter {...defaultProps} currentPage={2} canGoToPrevious={true} />,
    );
    expect(
      screen.getByTestId('table-footer-pagination-counter'),
    ).toHaveTextContent('11 - 20 of 50');
  });

  test('should calculate endItem correctly on partial last page', () => {
    render(
      <TableFooter
        {...defaultProps}
        currentPage={5}
        totalPages={5}
        totalItems={47}
        canGoToPrevious={true}
        canGoToNext={false}
      />,
    );
    expect(
      screen.getByTestId('table-footer-pagination-counter'),
    ).toHaveTextContent('41 - 47 of 47');
  });

  test('should not display counter when showQuantityIndicator is false', () => {
    render(<TableFooter {...defaultProps} showQuantityIndicator={false} />);
    expect(
      screen.queryByTestId('table-footer-pagination-counter'),
    ).not.toBeInTheDocument();
  });

  test('should render pagination component', () => {
    render(<TableFooter {...defaultProps} />);
    expect(screen.getByTestId('table-footer-pagination')).toBeInTheDocument();
  });

  test('should call onNextPage when clicking next button', async () => {
    const user = userEvent.setup();
    render(<TableFooter {...defaultProps} />);
    const nextButton = screen.getByTestId('table-footer-pagination-next');
    await user.click(nextButton);
    expect(defaultProps.onNextPage).toHaveBeenCalledTimes(1);
  });

  test('should call onPreviousPage when clicking previous button', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps,
      currentPage: 2,
      canGoToPrevious: true,
    };
    render(<TableFooter {...props} />);
    const prevButton = screen.getByTestId('table-footer-pagination-previous');
    await user.click(prevButton);
    expect(props.onPreviousPage).toHaveBeenCalledTimes(1);
  });

  test('should call onFirstPage when clicking first button', async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps,
      currentPage: 3,
      canGoToPrevious: true,
    };
    render(<TableFooter {...props} />);
    const firstButton = screen.getByTestId('table-footer-pagination-first');
    await user.click(firstButton);
    expect(props.onFirstPage).toHaveBeenCalledTimes(1);
  });

  test('should call onLastPage when clicking last button', async () => {
    const user = userEvent.setup();
    render(<TableFooter {...defaultProps} />);
    const lastButton = screen.getByTestId('table-footer-pagination-last');
    await user.click(lastButton);
    expect(defaultProps.onLastPage).toHaveBeenCalledTimes(1);
  });

  test('should call onPageChange when clicking page number', async () => {
    const user = userEvent.setup();
    render(<TableFooter {...defaultProps} />);
    const page3Button = screen.getByTestId('table-footer-pagination-page-3');
    await user.click(page3Button);
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  test('should disable first and previous buttons on first page', () => {
    render(<TableFooter {...defaultProps} />);
    const firstButton = screen.getByTestId('table-footer-pagination-first');
    const prevButton = screen.getByTestId('table-footer-pagination-previous');

    expect(firstButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
  });

  test('should disable last and next buttons on last page', () => {
    const props = {
      ...defaultProps,
      currentPage: 5,
      canGoToPrevious: true,
      canGoToNext: false,
    };
    render(<TableFooter {...props} />);
    const nextButton = screen.getByTestId('table-footer-pagination-next');
    const lastButton = screen.getByTestId('table-footer-pagination-last');

    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
  });

  test('should accept custom dataTestId', () => {
    render(<TableFooter {...defaultProps} dataTestId="custom-footer" />);
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(
      screen.getByTestId('custom-footer-pagination-counter'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('custom-footer-pagination')).toBeInTheDocument();
  });

  test('should render all visible pages', () => {
    render(<TableFooter {...defaultProps} />);

    [1, 2, 3, 4, 5].forEach((page) => {
      expect(
        screen.getByTestId(`table-footer-pagination-page-${page}`),
      ).toBeInTheDocument();
    });
  });

  test('should render current page correctly', () => {
    render(<TableFooter {...defaultProps} currentPage={3} />);
    const page3Button = screen.getByTestId('table-footer-pagination-page-3');

    expect(page3Button).toBeInTheDocument();
    expect(page3Button).toHaveTextContent('3');
  });

  test('should not render data-testid when dataTestId prop is not provided', () => {
    const { container } = render(
      <TableFooter {...defaultProps} dataTestId={undefined} />,
    );

    const elementsWithTestId = container.querySelectorAll('[data-testid]');
    expect(elementsWithTestId).toHaveLength(0);
  });

  test('should render data-testid only when dataTestId prop is provided', () => {
    render(<TableFooter {...defaultProps} dataTestId="custom-footer" />);

    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
    expect(screen.getByTestId('custom-footer-pagination')).toBeInTheDocument();
  });
});
