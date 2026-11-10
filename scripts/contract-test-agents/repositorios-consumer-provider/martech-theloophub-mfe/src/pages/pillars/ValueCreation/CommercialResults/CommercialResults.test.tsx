import React from 'react';

import { render, screen } from '@testing-library/react';

import { CommercialResults } from './CommercialResults';
import { COMMERCIAL_RESULTS_PAGE_NAME } from './constants';

const messages: Record<string, string> = {
  'ValueCreation.CommercialResults.title': 'Commercial Results',
  'ValueCreation.CommercialResults.subtitle':
    'Analyze commercial results across markets',
};

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => messages[id] ?? id,
  }),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: () => ({
    applied: { kpis: 'volume', periods: 'YTD' },
  }),
  useSubFilters: () => ({
    activeSubFilters: {
      kpis: 'volume',
      periods: 'YTD',
    },
  }),
  usePageFilterManagement: () => ({
    updateForm: jest.fn(),
    apply: jest.fn(),
  }),
  usePageFilterStatus: () => ({
    isLoading: false,
  }),
  usePageFilterData: () => ({
    dataFilters: {
      kpis: 'volume',
      periods: 'YTD',
    },
  }),
  useCurrentPage: () => ({
    currentPage: 'value-creation/commercial-results',
  }),
  useMediaQuery: () => false,
}));
jest.mock('components', () => ({
  StickyScrollWithFilters: ({
    filter,
    breadcrumbs,
    dataTestId,
  }: {
    filter: { pageName: string; visibleFields: string[]; hidden: boolean };
    breadcrumbs: { pageList: { href: string; pageName: string }[] };
    dataTestId: string;
  }) => (
    <div data-testid={dataTestId}>
      <nav data-testid="breadcrumbs">
        {breadcrumbs.pageList.map((p) => (
          <a key={p.href} href={p.href}>
            {p.pageName}
          </a>
        ))}
      </nav>
      <div
        data-testid="filter"
        data-page-name={filter.pageName}
        data-hidden={String(filter.hidden)}
        data-fields={filter.visibleFields.join(',')}
      />
    </div>
  ),
  PageHeader: ({
    title,
    subtitle,
    loading,
  }: {
    title: string;
    subtitle: string;
    loading: boolean;
  }) => (
    <header
      data-testid="page-header"
      data-loading={String(loading)}
      data-subtitle={subtitle}
    >
      {title}
    </header>
  ),
}));

jest.mock('./components/KpiDrillDown/KpiDrillDown', () => ({
  KpiDrillDown: ({ onFilterChange }: { onFilterChange: () => void }) => (
    <div data-testid="kpi-drill-down">
      <button data-testid="kpi-drill-down-button" onClick={onFilterChange}>
        Kpi Drill Down
      </button>
    </div>
  ),
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="grid-container">{children}</div>
  ),
  StyledHomeContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="commercial-results-container">{children}</div>
  ),
}));

function renderCommercialResults() {
  return render(<CommercialResults />);
}

describe('CommercialResults', () => {
  it('should render without errors', () => {
    renderCommercialResults();

    expect(
      screen.getByTestId('commercial-results-container'),
    ).toBeInTheDocument();
  });

  it('passes the correct pageName to the filter', () => {
    renderCommercialResults();

    expect(screen.getByTestId('filter')).toHaveAttribute(
      'data-page-name',
      COMMERCIAL_RESULTS_PAGE_NAME,
    );
  });

  it('passes the expected visible fields to the filter', () => {
    renderCommercialResults();

    expect(screen.getByTestId('filter')).toHaveAttribute(
      'data-fields',
      'zone,country,brands,sub_brands,periods',
    );
  });

  it('renders breadcrumbs with Value Creation and Commercial Results links', () => {
    renderCommercialResults();

    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    const names = links.map((l) => l.textContent);

    expect(hrefs).toContain('/value-creation');
    expect(hrefs).toContain('/value-creation/commercial-results');
    expect(names).toContain('Value Creation');
    expect(names).toContain('Commercial Results');
  });

  it('renders the page header with the i18n title and subtitle', () => {
    renderCommercialResults();

    const header = screen.getByTestId('page-header');

    expect(header).toHaveTextContent('Commercial Results');
    expect(header).toHaveAttribute(
      'data-subtitle',
      'Analyze commercial results across markets',
    );
  });
  it('renders the KpiDrillDown component', () => {
    renderCommercialResults();

    const kpiDrillDown = screen.getByTestId('kpi-drill-down');
    expect(kpiDrillDown).toBeInTheDocument();
  });
});
