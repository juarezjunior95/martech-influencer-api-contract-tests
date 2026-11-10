import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';

import { Overview } from './Overview';

const mockUseBffData = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterData = jest.fn();
const mockUseLastDataRefresh = jest.fn();
const mockUseDataRefreshForTab = jest.fn();

jest.mock('components/Table/utils', () => ({
  splitGenericTable: jest.fn(() => ({})),
}));

jest.mock('hooks', () => ({
  useBffData: (params: unknown) => mockUseBffData(params),
  usePageFilterApplied: (pageName: string) =>
    mockUsePageFilterApplied(pageName),
  usePageFilterData: () => mockUsePageFilterData(),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: (tabName: string) => mockUseDataRefreshForTab(tabName),
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
    };
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'basic-container'}
      data-title={header.title}
      data-subtitle={header.subtitle}
    >
      {header.rightContent}
      {children}
    </div>
  ),
}));

jest.mock('components/Filter/components', () => ({
  CountryFlag: () => <div data-testid="country-flag" />,
}));

jest.mock('pages/components', () => ({
  PortfolioPerformance: ({
    loading,
    error,
  }: {
    loading: boolean;
    error: Error | null;
  }) => (
    <div
      data-testid="portfolio-performance"
      data-loading={loading}
      data-has-error={!!error}
    />
  ),
}));

interface MockBffDataReturn {
  data: Record<string, unknown> | null;
  loading: boolean;
  error: Error | null;
}

const createMockBffDataReturn = (
  data: Record<string, unknown> | null,
  overrides: Partial<MockBffDataReturn> = {},
): MockBffDataReturn => ({
  data,
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

describe('Overview', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUsePageFilterApplied.mockReturnValue({
      applied: { zone: 'SAZ', country: 'BR' },
    });

    mockUsePageFilterData.mockReturnValue({
      dataFilters: {
        time_frame: { default: { ini: '2026-01-01', end: '2026-03-01' } },
      },
    });

    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDateMonthYear: {
        volume: '2026-03-01',
        finance: '2026-03-01',
        market_share: '2026-03-01',
        power: '2025-12-01',
        pos: '2026-03-01',
      },
    });

    mockUseBffData.mockReturnValue(
      createMockBffDataReturn({ portfolioPerformance: null }),
    );
  });

  it('renders the overview shell with PortfolioPerformance and signals the data-refresh tab name', () => {
    const { container } = renderWithIntl(<Overview />);

    expect(container.querySelector('.overview')).toBeInTheDocument();
    expect(screen.getByTestId('portfolio-performance')).toBeInTheDocument();
    expect(screen.getByTestId('country-flag')).toBeInTheDocument();
    expect(mockUseDataRefreshForTab).toHaveBeenCalledWith(
      'Portfolio Performance - Overview',
    );
  });

  it.each<[string, keyof MockBffDataReturn, string, string]>([
    ['loading', 'loading', 'data-loading', 'true'],
    ['error', 'error', 'data-has-error', 'true'],
  ])(
    'forwards bff %s to PortfolioPerformance',
    (_label, key, attr, expected) => {
      mockUseBffData.mockReturnValue(
        createMockBffDataReturn(
          { portfolioPerformance: null },
          {
            [key]: key === 'error' ? new Error('Test') : true,
          },
        ),
      );

      renderWithIntl(<Overview />);

      expect(screen.getByTestId('portfolio-performance')).toHaveAttribute(
        attr,
        expected,
      );
    },
  );

  it('shows the Beer + Adj subtitle on the portfolio performance container', () => {
    renderWithIntl(<Overview />);

    expect(screen.getByTestId('basic-container')).toHaveAttribute(
      'data-subtitle',
      '[Beer + Adj]',
    );
  });

  it('queries portfolio performance data from the bff', () => {
    renderWithIntl(<Overview />);

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'value-creation_portfolio-performance_overview_overview',
        kpiGroup: 'volume',
      }),
    );
  });

  it('namespaces the tabpanel testid when a custom dataTestId is provided', () => {
    renderWithIntl(<Overview dataTestId="custom" />);

    expect(screen.getByTestId('tabpanel-overview-custom')).toBeInTheDocument();
    expect(
      screen.getByTestId('custom-tabpanel-overview-portfolio-performance'),
    ).toBeInTheDocument();
  });
});
