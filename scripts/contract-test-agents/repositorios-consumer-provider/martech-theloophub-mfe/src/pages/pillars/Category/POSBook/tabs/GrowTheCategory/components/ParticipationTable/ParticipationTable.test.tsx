import { render, screen } from '@testing-library/react';
import { useLastDataRefresh } from 'contexts';
import { usePageFilterApplied, useSubFilters } from 'hooks';

import { useGrowTheCategoryData } from '../../hooks/useGrowTheCategoryData';
import { getPOSBookTableConfig } from '../../utils';
import { ParticipationTable } from './ParticipationTable';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockTableConfig = {
  country: { minWidth: 150 },
};
const mockParticipationData = {
  header: [{ id: 'country', title: 'Country' }],
  rows: [[{ country: { value: 'Brazil' } }]],
};

const defaultLastDataRefreshKpisDate = {
  pos: {
    'Last 4 Weeks': '2025-01-15',
  },
};
const defaultAppliedFilters = {
  pos_periods: 'Last 4 Weeks',
};
const defaultActiveSubFilters = {
  pos_kpi: 'participation',
  'cohorts-grow': '',
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: mockFormatMessage,
  }),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  useSubFilters: jest.fn(),
}));

jest.mock('../../hooks/useGrowTheCategoryData', () => ({
  useGrowTheCategoryData: jest.fn(),
}));

jest.mock('pages/pillars/Category/POSBook/POSBook', () => ({
  POS_BOOK_PAGE_NAME: 'POS_BOOK',
}));

jest.mock('utils/format', () => ({
  normalizeString: jest.fn((str, format) => {
    if (format === 'Pascal') return str.charAt(0).toUpperCase() + str.slice(1);
    return str;
  }),
}));

jest.mock('utils/timePeriod', () => ({
  vsLastYearByTimePeriod: jest.fn((data, period) => {
    if (!data || !period) return null;
    return data[period] ? `vs LY: ${data[period]}` : null;
  }),
}));

jest.mock('components', () => ({
  SubFilter: {
    Select: jest.fn(
      ({
        apiKey,
        stateKey,
        valueLabel,
        chips,
        clearChips,
        value,
        placeholder,
      }: any) => (
        <div
          data-testid={`subfilter-${stateKey}`}
          data-api-key={apiKey}
          data-state-key={stateKey}
          data-value-label={valueLabel}
          data-chips={String(chips)}
          data-clear-chips={String(clearChips)}
          data-value={value}
          data-placeholder={placeholder}
        />
      ),
    ),
  },
}));

jest.mock('pages/components', () => ({
  POSBookTable: jest.fn(
    ({ loading, data, config, posKpi, dataTestId }: any) => (
      <div
        data-testid={dataTestId || 'pos-book-table'}
        data-loading={String(loading)}
        data-has-data={String(Boolean(data))}
        data-has-config={String(Boolean(config))}
        data-pos-kpi={posKpi}
      />
    ),
  ),
}));

jest.mock('../../../../components', () => ({
  TableHeader: jest.fn(
    ({ title, lastDataRefresh, filters, dataTestId }: any) => (
      <header
        data-testid={dataTestId || 'table-header'}
        data-title={title}
        data-last-data-refresh={lastDataRefresh}
      >
        <h2>{title}</h2>
        <div data-testid="table-header-filters">{filters}</div>
      </header>
    ),
  ),
}));

jest.mock('./ParticipationTable.styles', () => ({
  StyledParticipationTableContainer: ({
    children,
    'data-testid': dataTestId,
  }) => (
    <section data-testid={dataTestId || 'styled-participation-table-container'}>
      {children}
    </section>
  ),
  StyledParticipationTableHeaderContainer: ({
    children,
    'data-testid': dataTestId,
  }) => (
    <div
      data-testid={dataTestId || 'styled-participation-table-header-container'}
    >
      {children}
    </div>
  ),
}));

jest.mock('../../constants', () => ({
  COHORTS_KEY: 'cohorts-grow',
  DEFAULT_POS_KPI: 'participation',
  POS_KPI_KEY: 'pos_kpi',
  TRANSLATION_KEY_PREFIX: 'Category.POSBook.GrowTheCategory',
  VIEW_TYPES: {
    COUNTRY: 'country',
    COHORT: 'cohort',
    MATURITY_ZONE: 'maturity-zone',
  },
}));

jest.mock('../../utils', () => ({
  getPOSBookTableConfig: jest.fn(() => mockTableConfig),
}));

const renderParticipationTable = (
  props: Partial<React.ComponentProps<typeof ParticipationTable>> = {},
) => render(<ParticipationTable selectedView="country" {...props} />);

describe('ParticipationTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLastDataRefresh as jest.Mock).mockReturnValue({
      lastDataRefreshKpisDate: defaultLastDataRefreshKpisDate,
    });
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      applied: defaultAppliedFilters,
    });
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: defaultActiveSubFilters,
    });
    (useGrowTheCategoryData as jest.Mock).mockReturnValue({
      participationData: mockParticipationData,
      loading: false,
      error: null,
    });
  });

  it('renders the country participation table with title, refresh date, filters, data, and table config', () => {
    renderParticipationTable();

    expect(usePageFilterApplied).toHaveBeenCalledWith('POS_BOOK');
    expect(useGrowTheCategoryData).toHaveBeenCalledWith('country');
    expect(getPOSBookTableConfig).toHaveBeenCalledWith('country');

    expect(
      screen.getByRole('heading', {
        name: 'Participation Category.POSBook.GrowTheCategory.country.title',
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('table-header')).toHaveAttribute(
      'data-last-data-refresh',
      'vs LY: 2025-01-15',
    );

    expect(screen.getByTestId('subfilter-pos_kpi')).toHaveAttribute(
      'data-api-key',
      'pos-kpi',
    );
    expect(screen.getByTestId('subfilter-pos_kpi')).toHaveAttribute(
      'data-clear-chips',
      'false',
    );
    expect(screen.getByTestId('subfilter-cohorts-grow')).toHaveAttribute(
      'data-value-label',
      'Cohort',
    );
    expect(screen.getByTestId('pos-book-table')).toHaveAttribute(
      'data-has-data',
      'true',
    );
    expect(screen.getByTestId('pos-book-table')).toHaveAttribute(
      'data-has-config',
      'true',
    );
  });

  it('updates the title and table contract when POS KPI changes', () => {
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: {
        ...defaultActiveSubFilters,
        pos_kpi: 'volume',
      },
    });

    renderParticipationTable();

    expect(
      screen.getByRole('heading', {
        name: 'Volume Category.POSBook.GrowTheCategory.country.title',
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pos-book-table')).toHaveAttribute(
      'data-pos-kpi',
      'volume',
    );
  });

  it('uses the default POS KPI when subfilters are missing', () => {
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: undefined,
    });

    renderParticipationTable();

    expect(screen.getByTestId('pos-book-table')).toHaveAttribute(
      'data-pos-kpi',
      'participation',
    );
  });

  it('omits the cohort filter in the cohort view', () => {
    renderParticipationTable({ selectedView: 'cohort' });

    expect(useGrowTheCategoryData).toHaveBeenCalledWith('cohort');
    expect(getPOSBookTableConfig).toHaveBeenCalledWith('cohort');
    expect(
      screen.getByRole('heading', {
        name: 'Participation Category.POSBook.GrowTheCategory.cohort.title',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('subfilter-cohorts-grow'),
    ).not.toBeInTheDocument();
  });

  it('keeps the cohort filter in the maturity-zone view', () => {
    renderParticipationTable({ selectedView: 'maturity-zone' });

    expect(useGrowTheCategoryData).toHaveBeenCalledWith('maturity-zone');
    expect(getPOSBookTableConfig).toHaveBeenCalledWith('maturity-zone');
    expect(screen.getByTestId('subfilter-cohorts-grow')).toHaveAttribute(
      'data-api-key',
      'cohorts',
    );
  });

  it('maps the All cohort filter to an empty selection prompt', () => {
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: {
        ...defaultActiveSubFilters,
        'cohorts-grow': 'All',
      },
    });

    renderParticipationTable();

    expect(screen.getByTestId('subfilter-cohorts-grow')).toHaveAttribute(
      'data-value',
      '',
    );
    expect(screen.getByTestId('subfilter-cohorts-grow')).toHaveAttribute(
      'data-value-label',
      'Select a Cohort',
    );
  });

  it('passes the selected cohort value to the cohort filter', () => {
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: {
        ...defaultActiveSubFilters,
        'cohorts-grow': 'cohort1',
      },
    });

    renderParticipationTable();

    expect(screen.getByTestId('subfilter-cohorts-grow')).toHaveAttribute(
      'data-value',
      'cohort1',
    );
    expect(screen.getByTestId('subfilter-cohorts-grow')).toHaveAttribute(
      'data-value-label',
      'Cohort',
    );
  });

  it('forwards loading and empty data states to POSBookTable', () => {
    (useGrowTheCategoryData as jest.Mock).mockReturnValue({
      participationData: null,
      loading: true,
      error: null,
    });

    renderParticipationTable();

    expect(screen.getByTestId('pos-book-table')).toHaveAttribute(
      'data-loading',
      'true',
    );
    expect(screen.getByTestId('pos-book-table')).toHaveAttribute(
      'data-has-data',
      'false',
    );
  });

  it('omits last refresh when the selected period has no refresh data', () => {
    (useLastDataRefresh as jest.Mock).mockReturnValue({
      lastDataRefreshKpisDate: { pos: null },
    });
    (usePageFilterApplied as jest.Mock).mockReturnValue({
      applied: undefined,
    });

    renderParticipationTable();

    expect(screen.getByTestId('table-header')).not.toHaveAttribute(
      'data-last-data-refresh',
    );
  });

  it('propagates dataTestId to the table structure and child components', () => {
    renderParticipationTable({ dataTestId: 'participation' });

    expect(screen.getByTestId('table-participation')).toBeInTheDocument();
    expect(
      screen.getByTestId('table-header-container-participation'),
    ).toBeInTheDocument();
    const propagatedElements = screen.getAllByTestId('participation');
    const tableHeader = propagatedElements.find((element) =>
      element.hasAttribute('data-title'),
    );

    expect(propagatedElements).toHaveLength(2);
    expect(tableHeader).toHaveAttribute(
      'data-title',
      'Participation Category.POSBook.GrowTheCategory.country.title',
    );
  });

  it('falls back to default test ids when dataTestId is empty', () => {
    renderParticipationTable({ dataTestId: '' });

    expect(screen.queryByTestId('table-')).not.toBeInTheDocument();
    expect(
      screen.getByTestId('styled-participation-table-container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pos-book-table')).toBeInTheDocument();
  });
});
