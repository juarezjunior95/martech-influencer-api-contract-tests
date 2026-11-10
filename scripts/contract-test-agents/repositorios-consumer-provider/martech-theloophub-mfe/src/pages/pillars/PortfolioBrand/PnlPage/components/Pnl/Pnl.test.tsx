import React from 'react';
import { IntlProvider } from 'react-intl';

import { fireEvent, render, screen } from '@testing-library/react';
import { TableDataType } from 'components/Table/types';

import { Pnl } from './Pnl';

const mockUseBffData = jest.fn();
const mockUseDataRefreshForTab = jest.fn();
const mockUseLastDataRefresh = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (params: unknown) => mockUseBffData(params),
  usePageFilterApplied: (pageName: string) =>
    mockUsePageFilterApplied(pageName),
  usePageFilterData: (pageName: string) => mockUsePageFilterData(pageName),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: (tabName: string) => mockUseDataRefreshForTab(tabName),
}));

jest.mock('contexts/LastDataRefresh/LastDataRefresh', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

jest.mock('components', () => ({
  BasicContainer: ({
    children,
    header,
    dataTestId,
  }: {
    children: React.ReactNode;
    header: {
      title: string;
      subtitle?: string;
      rightContent?: React.ReactNode;
      bottomTag?: React.ReactNode;
    };
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'basic-container'}
      data-title={header.title}
    >
      <div data-testid="header-right-content">{header.rightContent}</div>
      {header.bottomTag && (
        <div data-testid="header-bottom-tag">{header.bottomTag}</div>
      )}
      {children}
    </div>
  ),
  Select: ({
    id,
    options,
    value,
    onValueChange,
    dataTestId,
  }: {
    id: string;
    options: unknown[];
    value: string[];
    onValueChange: (options: { value: string }[]) => void;
    dataTestId?: string;
  }) => (
    <select
      data-testid={dataTestId ?? id}
      data-options-count={options.length}
      value={value}
      onChange={(e) => onValueChange([{ value: e.target.value }])}
      multiple
    >
      <option value="test">Test</option>
    </select>
  ),
  Tag: ({ text, dataTestId }: { text: string; dataTestId?: string }) => (
    <span data-testid={dataTestId ?? 'tag'}>{text}</span>
  ),
}));

jest.mock('@hexa-ui/components', () => ({
  SegmentedControl: ({
    options,
    onValueChange,
    'data-testid': dataTestIdProp,
  }: {
    options: { value: string; label: string }[];
    onValueChange: (value: string) => void;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestIdProp ?? 'segmented-control'}>
      {options.map((opt) => (
        <button
          key={opt.value}
          data-testid={`segment-${opt.value}`}
          onClick={() => onValueChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  CalendarClock: () => <span data-testid="calendar-icon" />,
}));

jest.mock('components/Filter/components', () => ({
  CountryFlag: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'country-flag'} />
  ),
}));

jest.mock('pages/components/PnlTable', () => ({
  PnlTable: ({
    loading,
    data,
    tableView,
    dataTestId,
  }: {
    loading: boolean;
    data: TableDataType;
    tableView: string;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'pnl-table'}
      data-loading={loading}
      data-view={tableView}
      data-has-data={!!data}
    />
  ),
  PnlBrands: ({
    loading,
    data,
    dataTestId,
  }: {
    loading: boolean;
    data: TableDataType;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'pnl-brands'}
      data-loading={loading}
      data-has-data={!!data}
    />
  ),
  PnlSkeleton: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'pnl-skeleton'} />
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledTooltip: ({
    children,
    'data-testid': dataTestIdProp,
    ...props
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestIdProp ?? 'styled-tooltip'} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('./constants', () => ({
  PNL_TAB_NAME: 'Portfolio Performance - P&L',
  portfolioTableFilterOptions: [
    { group: 'Portfolio', values: [{ value: 'test', label: 'Test' }] },
  ],
  deepDiveTableFilterOptions: [
    { group: 'Organic Growth', values: [{ value: 'og', label: 'OG' }] },
  ],
}));

jest.mock('pages/pillars/PortfolioBrand/Performance/Performance', () => ({
  PERFORMANCE_PAGE_NAME: 'portfolio-performance',
}));

const createMockTableData = (
  overrides: Partial<TableDataType> = {},
): TableDataType => ({
  header: [],
  rows: [],
  ...overrides,
});

const createDefaultPnlBffData = () => ({
  plPortfolio: createMockTableData(),
  plDeepDive: createMockTableData(),
  plBrand: createMockTableData({
    filtersOptions: [
      { group: 'Brands', values: [{ value: 'brand1', label: 'Brand 1' }] },
    ],
  }),
});

interface MockBffReturn {
  data: ReturnType<typeof createDefaultPnlBffData> | null;
  loading: boolean;
  error: Error | null;
}

const createMockBffReturn = (
  overrides: Partial<MockBffReturn> = {},
): MockBffReturn => ({
  data: createDefaultPnlBffData(),
  loading: false,
  error: null,
  ...overrides,
});

const renderWithIntl = (component: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}} onError={() => undefined}>
      {component}
    </IntlProvider>,
  );

describe('Pnl', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisFormated: { finance: '2024-01-15' },
      lastDataRefreshKpisDateMonthYear: { finance: '2024-01' },
    });

    mockUsePageFilterApplied.mockReturnValue({ applied: {} });
    mockUsePageFilterData.mockReturnValue({ dataFilters: {} });

    mockUseBffData.mockReturnValue(createMockBffReturn());
  });

  it('renders the page shell with segmented control, country flag, customization select and the data-refresh tag, and signals the data-refresh tab name', () => {
    renderWithIntl(<Pnl />);

    expect(screen.getByTestId('basic-container')).toBeInTheDocument();
    expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    expect(screen.getByTestId('country-flag')).toBeInTheDocument();
    expect(screen.getByTestId('pnl-table-customization')).toBeInTheDocument();
    expect(screen.getByTestId('tag')).toHaveTextContent(': 2024-01-15');
    expect(mockUseDataRefreshForTab).toHaveBeenCalledWith(
      'Portfolio Performance - P&L',
    );
  });

  describe('default portfolio view', () => {
    it('renders PnlTable with the portfolio view by default and queries useBffData with the portfolio P&L id and finance group', () => {
      renderWithIntl(<Pnl />);

      expect(screen.getByTestId('pnl-table')).toHaveAttribute(
        'data-view',
        'portfolio',
      );
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'value-creation_portfolio-performance_pl',
          kpiGroup: 'finance',
        }),
      );
    });

    it('forwards the bff loading flag to PnlTable', () => {
      mockUseBffData.mockReturnValue(createMockBffReturn({ loading: true }));

      renderWithIntl(<Pnl />);

      expect(screen.getByTestId('pnl-table')).toHaveAttribute(
        'data-loading',
        'true',
      );
    });
  });

  it('switches PnlTable to the deep_dive view when the deep_dive segment is selected', () => {
    renderWithIntl(<Pnl />);

    fireEvent.click(screen.getByTestId('segment-deep_dive'));

    expect(screen.getByTestId('pnl-table')).toHaveAttribute(
      'data-view',
      'deep_dive',
    );
  });

  describe('brands view', () => {
    it('renders PnlBrands instead of PnlTable and hides the bottom data-refresh tag', () => {
      renderWithIntl(<Pnl />);
      fireEvent.click(screen.getByTestId('segment-brands'));

      expect(screen.getByTestId('pnl-brands')).toBeInTheDocument();
      expect(screen.queryByTestId('pnl-table')).not.toBeInTheDocument();
      expect(screen.queryByTestId('header-bottom-tag')).not.toBeInTheDocument();
    });

    it('replaces PnlBrands with PnlSkeleton while bff data is loading', () => {
      mockUseBffData.mockReturnValue(createMockBffReturn({ loading: true }));

      renderWithIntl(<Pnl />);
      fireEvent.click(screen.getByTestId('segment-brands'));

      expect(screen.getByTestId('pnl-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('pnl-brands')).not.toBeInTheDocument();
    });
  });

  it('does not render the data-refresh tag when lastDataRefresh is undefined', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisFormated: {},
    });

    renderWithIntl(<Pnl />);

    expect(screen.queryByTestId('tag')).not.toBeInTheDocument();
  });

  it('namespaces the tabpanel testid when a custom dataTestId is provided', () => {
    renderWithIntl(<Pnl dataTestId="custom" />);

    expect(screen.getByTestId('custom-tabpanel-pnl')).toBeInTheDocument();
  });
});
