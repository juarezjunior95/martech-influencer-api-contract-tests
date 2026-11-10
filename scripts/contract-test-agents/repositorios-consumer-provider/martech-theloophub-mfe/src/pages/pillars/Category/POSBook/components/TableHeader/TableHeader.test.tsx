import { render, screen } from '@testing-library/react';

import { TableHeader } from './TableHeader';

jest.mock('shared/Styles', () => ({
  StyledSectionTitle: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <h2 data-testid={dataTestId}>{children}</h2>,
}));

jest.mock('../../POSBook.styles', () => ({
  StyledPOSHeaderContainer: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId}>{children}</div>,
}));

jest.mock('./TableHeader.styles', () => ({
  StyledTableHeaderContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),

  StyledTableLastRefresh: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <span data-testid={dataTestId}>{children}</span>,
  StyledSubfiltersGroup: ({
    children,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={dataTestId}>{children}</div>,
}));

describe('TableHeader', () => {
  it('renders the title as an accessible heading', () => {
    render(<TableHeader title="Volume Analysis" />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Volume Analysis' }),
    ).toBeInTheDocument();
  });

  it('renders the comparison refresh text when lastDataRefresh is provided without a custom test id', () => {
    render(<TableHeader title="Volume Analysis" lastDataRefresh="Jan 2025" />);

    expect(screen.getByText('[ vs Jan 2025 ]')).toBeInTheDocument();
  });

  it('does not render the refresh label when lastDataRefresh is not provided', () => {
    render(<TableHeader title="Volume Analysis" dataTestId="volume" />);

    expect(
      screen.queryByTestId('table-refresh-volume'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/\[ vs /)).not.toBeInTheDocument();
  });

  it('renders filters in the public filters area', () => {
    render(
      <TableHeader
        title="Volume Analysis"
        dataTestId="volume"
        filters={<button type="button">Price Segment</button>}
      />,
    );

    const filtersArea = screen.getByTestId('table-filters-volume');

    expect(
      screen.getByRole('button', { name: 'Price Segment' }),
    ).toBeInTheDocument();
    expect(filtersArea).toContainElement(
      screen.getByRole('button', { name: 'Price Segment' }),
    );
  });

  it('renders right content with the table title', () => {
    render(
      <TableHeader
        title="Volume Analysis"
        rightContent={<button type="button">Download</button>}
      />,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Volume Analysis' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Download' }),
    ).toBeInTheDocument();
  });

  it('applies public test ids when dataTestId is provided', () => {
    render(
      <TableHeader
        title="Complete Title"
        lastDataRefresh="2025-01-15"
        dataTestId="complete"
        filters={<span>Custom Filters</span>}
      />,
    );

    expect(screen.getByTestId('table-header-complete')).toBeInTheDocument();
    expect(screen.getByTestId('table-title-complete')).toHaveTextContent(
      'Complete Title',
    );
    expect(screen.getByTestId('table-refresh-complete')).toHaveTextContent(
      '[ vs 2025-01-15 ]',
    );
    expect(screen.getByTestId('table-filters-complete')).toHaveTextContent(
      'Custom Filters',
    );
  });
});
