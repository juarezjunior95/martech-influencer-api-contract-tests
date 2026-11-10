import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { usePageFilterApplied, useSubFilters } from 'hooks';

import { useManufactureData } from '../../hooks/useManufactureData/useManufactureData';
import { getParticipationTableConfig } from '../../utils';
import { Manufacture } from './Manufacture';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockActiveSubFilters = {
  'price-segments-manufacture': 'all',
};
const mockKpiData = {
  table: {
    header: [{ id: 'manufacture', title: 'Manufacture' }],
    rows: [[{ manufacture: { value: 'Manufacture A' } }]],
  },
};
const mockTableConfig = {
  manufacture: { minWidth: 150 },
};

type MockPOSBookTableProps = {
  loading: boolean;
  data: unknown;
  config: unknown;
  dataTestId?: string;
};

const mockPOSBookTable = jest.fn(
  ({ loading, data, config, dataTestId }: MockPOSBookTableProps) => (
    <div
      data-testid={dataTestId || 'pos-book-table'}
      data-loading={String(loading)}
      data-has-data={!!data}
      data-has-config={!!config}
    >
      POSBookTable Component
    </div>
  ),
);

type MockTableHeaderProps = {
  title: string;
  lastDataRefresh: string;
  filters: ReactNode;
  dataTestId?: string;
};

const mockTableHeader = jest.fn(
  ({ title, lastDataRefresh, filters, dataTestId }: MockTableHeaderProps) => (
    <div
      data-testid={dataTestId || 'table-header'}
      data-title={title}
      data-last-data-refresh={lastDataRefresh}
    >
      <div data-testid="table-header-title">{title}</div>
      <div data-testid="table-header-filters">{filters}</div>
    </div>
  ),
);

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(() => ({
    isGlobalZone: false,
  })),
  useSubFilters: jest.fn(() => ({
    activeSubFilters: mockActiveSubFilters,
  })),
}));

jest.mock('../../hooks/useManufactureData/useManufactureData', () => ({
  useManufactureData: jest.fn(() => ({
    tableData: mockKpiData.table,
    loading: false,
    error: null,
  })),
}));

jest.mock('components', () => ({
  SubFilter: {
    Select: ({
      apiKey,
      stateKey,
      value,
      valueLabel,
      placeholder,
      allKey,
      chips,
    }: any) => (
      <div
        data-testid={`subfilter-${stateKey}`}
        data-api-key={apiKey}
        data-state-key={stateKey}
        data-value={value}
        data-value-label={valueLabel}
        data-placeholder={placeholder}
        data-all-key={allKey}
        data-chips={String(chips)}
      >
        SubFilter: {apiKey}
      </div>
    ),
  },
}));

jest.mock('pages/components', () => ({
  POSBookTable: (props: MockPOSBookTableProps) => mockPOSBookTable(props),
}));

jest.mock('pages/pillars/Category/POSBook/components', () => ({
  TableHeader: (props: MockTableHeaderProps) => mockTableHeader(props),
}));

jest.mock('pages/pillars/Category/POSBook/POSBook', () => ({
  POS_BOOK_PAGE_NAME: 'POS_BOOK',
}));

jest.mock('../../../../POSBook.styles', () => ({
  StyledPOSContentSection: ({
    children,
    marginBottom,
    'data-testid': dataTestId,
  }: {
    children: React.ReactNode;
    marginBottom?: boolean;
    'data-testid'?: string;
  }) => (
    <div
      data-testid={dataTestId || 'styled-pos-content-section'}
      data-margin-bottom={String(marginBottom)}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../constants', () => ({
  PRICE_SEGMENTS_KEY_MANUFACTURE: 'price-segments-manufacture',
  PRICE_SEGMENTS_ALL_MANUFACTURE: 'all',
}));

jest.mock('../../utils', () => ({
  getParticipationTableConfig: jest.fn(() => mockTableConfig),
}));

describe('Manufacture', () => {
  const defaultProps = {
    formatMessage: mockFormatMessage,
    lastDataRefresh: '2025-01-15',
  };

  const renderManufacture = (
    props: Partial<React.ComponentProps<typeof Manufacture>> = {},
  ) => render(<Manufacture {...defaultProps} {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      isGlobalZone: false,
    });
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: mockActiveSubFilters,
    });
    (useManufactureData as jest.Mock).mockReturnValue({
      tableData: mockKpiData.table,
      loading: false,
      error: null,
    });
  });

  it('renders the manufacture section with header, price segment filter, and table', () => {
    renderManufacture();

    const section = screen.getByTestId('styled-pos-content-section');
    const header = screen.getByTestId('table-header');
    const table = screen.getByTestId('pos-book-table');
    const priceSegmentFilter = screen.getByTestId(
      'subfilter-price-segments-manufacture',
    );

    expect(section).toHaveAttribute('data-margin-bottom', 'true');
    expect(section).toContainElement(header);
    expect(section).toContainElement(table);
    expect(screen.getByTestId('table-header-filters')).toContainElement(
      priceSegmentFilter,
    );
  });

  it('uses the manufacture translation and last refresh date in the table header', () => {
    renderManufacture();

    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: 'Category.POSBook.LeadTheCategory.manufacture.title',
    });
    expect(screen.getByTestId('table-header-title')).toHaveTextContent(
      'Category.POSBook.LeadTheCategory.manufacture.title',
    );
    expect(mockTableHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Category.POSBook.LeadTheCategory.manufacture.title',
        lastDataRefresh: '2025-01-15',
      }),
    );
  });

  it('configures the price segment subfilter for manufacture', () => {
    renderManufacture();

    expect(
      screen.getByTestId('subfilter-price-segments-manufacture'),
    ).toHaveAttribute('data-api-key', 'price-segments');
    expect(
      screen.getByTestId('subfilter-price-segments-manufacture'),
    ).toHaveAttribute('data-state-key', 'price-segments-manufacture');
    expect(
      screen.getByTestId('subfilter-price-segments-manufacture'),
    ).toHaveAttribute('data-all-key', 'all');
    expect(
      screen.getByTestId('subfilter-price-segments-manufacture'),
    ).toHaveAttribute('data-chips', 'true');
  });

  it.each([
    ['all selected', { 'price-segments-manufacture': 'all' }],
    ['missing price segment key', { otherKey: 'otherValue' }],
    ['undefined active subfilters', undefined],
  ])('shows the price segment placeholder when %s', (_, activeSubFilters) => {
    (useSubFilters as jest.Mock).mockReturnValue({ activeSubFilters });

    renderManufacture();

    const priceSegmentFilter = screen.getByTestId(
      'subfilter-price-segments-manufacture',
    );

    expect(priceSegmentFilter).toHaveAttribute('data-value', '');
    expect(priceSegmentFilter).toHaveAttribute(
      'data-value-label',
      'Select a Price Segment',
    );
  });

  it('shows the selected price segment value and label when a segment is active', () => {
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: { 'price-segments-manufacture': 'premium' },
    });

    renderManufacture();

    const priceSegmentFilter = screen.getByTestId(
      'subfilter-price-segments-manufacture',
    );

    expect(priceSegmentFilter).toHaveAttribute('data-value', 'premium');
    expect(priceSegmentFilter).toHaveAttribute(
      'data-value-label',
      'Price Segment',
    );
  });

  it('passes data, loading, and generated table config to POSBookTable', () => {
    (useManufactureData as jest.Mock).mockReturnValue({
      tableData: mockKpiData.table,
      loading: true,
      error: null,
    });

    renderManufacture();

    expect(useManufactureData).toHaveBeenCalled();
    expect(mockPOSBookTable).toHaveBeenCalledWith(
      expect.objectContaining({
        loading: true,
        data: mockKpiData.table,
        config: mockTableConfig,
      }),
    );
    expect(screen.getByTestId('pos-book-table')).toHaveAttribute(
      'data-loading',
      'true',
    );
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
  ])('forwards %s tableData to POSBookTable', (_, tableData) => {
    (useManufactureData as jest.Mock).mockReturnValue({
      tableData,
      loading: false,
      error: null,
    });

    renderManufacture();

    expect(mockPOSBookTable).toHaveBeenCalledWith(
      expect.objectContaining({ data: tableData }),
    );
  });

  it('uses the POSBook page zone when generating the participation table config', () => {
    renderManufacture();

    expect(usePageFilterApplied).toHaveBeenCalledWith('POS_BOOK');
    expect(getParticipationTableConfig).toHaveBeenCalledWith(false);
    expect(mockPOSBookTable).toHaveBeenCalledWith(
      expect.objectContaining({ config: mockTableConfig }),
    );
  });

  it('regenerates the table config when the global zone changes', () => {
    const { rerender } = renderManufacture();

    expect(getParticipationTableConfig).toHaveBeenCalledWith(false);

    jest.clearAllMocks();
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      isGlobalZone: true,
    });

    rerender(<Manufacture {...defaultProps} />);

    expect(getParticipationTableConfig).toHaveBeenCalledWith(true);
  });

  it('forwards dataTestId to section, table header and POSBookTable', () => {
    renderManufacture({ dataTestId: 'manufacture' });

    expect(screen.getByTestId('section-manufacture')).toBeInTheDocument();
    expect(mockTableHeader).toHaveBeenCalledWith(
      expect.objectContaining({ dataTestId: 'manufacture' }),
    );
    expect(mockPOSBookTable).toHaveBeenCalledWith(
      expect.objectContaining({ dataTestId: 'manufacture' }),
    );
  });
});
