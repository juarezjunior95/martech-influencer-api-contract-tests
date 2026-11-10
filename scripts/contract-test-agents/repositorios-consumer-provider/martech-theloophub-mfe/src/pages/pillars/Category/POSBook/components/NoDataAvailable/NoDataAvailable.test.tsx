import { render, screen } from '@testing-library/react';

import { NoDataAvailable } from './NoDataAvailable';

describe('NoDataAvailable', () => {
  it('renders the empty state content', () => {
    render(<NoDataAvailable />);

    expect(screen.getByText('Data not available')).toBeInTheDocument();
  });

  it('applies container and content test ids when dataTestId is provided', () => {
    render(<NoDataAvailable dataTestId="pos-book-table" />);

    expect(
      screen.getByTestId('empty-state-pos-book-table'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('no-data-yet-pos-book-table'),
    ).toBeInTheDocument();
  });

  it('does not apply custom test ids when dataTestId is omitted', () => {
    const { container } = render(<NoDataAvailable />);

    expect(container.querySelector('[data-testid^="empty-state-"]')).toBeNull();
    expect(container.querySelector('[data-testid^="no-data-yet-"]')).toBeNull();
  });

  it('treats an empty dataTestId as omitted', () => {
    const { container } = render(<NoDataAvailable dataTestId="" />);

    expect(container.querySelector('[data-testid^="empty-state-"]')).toBeNull();
    expect(container.querySelector('[data-testid^="no-data-yet-"]')).toBeNull();
  });
});
