import { render, screen } from '@testing-library/react';

import { BrandBreakdownTable } from './BrandBreakdownTable';

const mockFormatMessage = jest.fn(({ id }) => id);

jest.mock('components', () => ({
  Skeleton: ({ length, width, height, borderRadius }: any) => (
    <div
      data-testid="skeleton"
      data-length={length}
      data-width={width}
      data-height={height}
      data-border-radius={borderRadius}
    />
  ),
}));

jest.mock('pages/components', () => ({
  RowActionTable: ({
    data,
    columnDefsConfig,
    fixedHeight,
    noRowsMessage,
  }: any) => (
    <div
      data-testid="row-action-table"
      {...(fixedHeight && { 'data-fixed-height': fixedHeight })}
    >
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      <div data-testid="table-columns">{JSON.stringify(columnDefsConfig)}</div>
      {noRowsMessage && (
        <div data-testid="no-rows-message">
          <div data-testid="no-rows-title">{noRowsMessage.title}</div>
          <div data-testid="no-rows-description">
            {noRowsMessage.description}
          </div>
        </div>
      )}
    </div>
  ),
}));

const mockData = [
  { id: '1', brand: 'Brand 1', value: 100 },
  { id: '2', brand: 'Brand 2', value: 200 },
];
const mockEmptyTable: unknown[] = [];
const mockConfig = [
  { field: 'brand', headerName: 'Brand' },
  { field: 'value', headerName: 'Value' },
];

const defaultProps = {
  loading: false,
  selectedPerformance: 'Power vs LQ',
  isExpanded: false,
  data: mockData,
  emptyTable: mockEmptyTable,
  config: mockConfig,
  formatMessage: mockFormatMessage,
};

describe('BrandBreakdownTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a fixed-size Skeleton while loading', () => {
    render(<BrandBreakdownTable {...defaultProps} loading />);

    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('data-height', '388px');
    expect(screen.queryByTestId('row-action-table')).not.toBeInTheDocument();
  });

  it('renders an empty-state table with translated no-rows message when no performance is selected', () => {
    render(<BrandBreakdownTable {...defaultProps} selectedPerformance="" />);

    expect(screen.getByTestId('table-data')).toHaveTextContent(
      JSON.stringify(mockEmptyTable),
    );
    expect(screen.getByTestId('row-action-table')).toHaveAttribute(
      'data-fixed-height',
      '388px',
    );
    expect(screen.getByTestId('no-rows-title')).toHaveTextContent(
      'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.brandBreakdown.noRowsMessage.title',
    );
    expect(screen.getByTestId('no-rows-description')).toHaveTextContent(
      'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.brandBreakdown.noRowsMessage.description',
    );
  });

  it.each([
    {
      label: 'collapsed (isExpanded=false)',
      isExpanded: false,
      shouldHaveFixedHeight: true,
    },
    {
      label: 'expanded (isExpanded=true)',
      isExpanded: true,
      shouldHaveFixedHeight: false,
    },
  ])(
    'renders the populated table without no-rows message when $label',
    ({ isExpanded, shouldHaveFixedHeight }) => {
      render(<BrandBreakdownTable {...defaultProps} isExpanded={isExpanded} />);

      const table = screen.getByTestId('row-action-table');
      expect(screen.getByTestId('table-data')).toHaveTextContent(
        JSON.stringify(mockData),
      );
      expect(screen.queryByTestId('no-rows-message')).not.toBeInTheDocument();
      if (shouldHaveFixedHeight) {
        expect(table).toHaveAttribute('data-fixed-height', '388px');
      } else {
        expect(table).not.toHaveAttribute('data-fixed-height');
      }
    },
  );
});
