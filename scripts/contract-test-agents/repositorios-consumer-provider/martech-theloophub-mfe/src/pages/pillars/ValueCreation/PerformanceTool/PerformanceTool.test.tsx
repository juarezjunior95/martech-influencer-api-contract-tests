import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import * as hooks from 'hooks';

import { PerformanceTool } from './PerformanceTool';

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => {
      if (id === 'ValueCreation.PerformanceTool.power.subtitle') {
        return 'Analyze and understand performance drivers';
      }
      return id ?? '';
    },
  }),
}));

jest.mock('hooks', () => ({
  useCurrentPage: jest.fn(() => ({
    currentPage: 'value-creation/performance-tool',
  })),
  usePageFilterApplied: jest.fn(() => ({
    applied: {
      country: 'BRA',
      kpis: 'power',
    },
  })),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      countries: {
        values: [
          { label: 'Brazil', value: 'BRA' },
          { label: 'Mexico', value: 'MEX' },
        ],
      },
    },
  })),
  usePageFilterStatus: jest.fn(() => ({ isLoading: false })),
  usePageFilterManagement: jest.fn(() => ({
    updateForm: jest.fn(),
    apply: jest.fn(),
  })),
}));

jest.mock('components', () => ({
  PageHeader: ({ title, subtitle }: { title: string; subtitle: string }) => (
    <div data-testid="page-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
  StickyScrollWithFilters: ({
    pageName = 'value-creation/performance-tool',
    pageList,
  }: {
    pageName: string;
    pageList?: Array<{ href: string; pageName: string }>;
    showIcon?: boolean;
  }) => (
    <div data-testid="performance-tool-navigation">
      <div data-testid="filter">Filter Component - {pageName}</div>
      <div data-testid="breadcrumbs">
        {pageList?.map((page, idx) => (
          <span key={idx}>{page.pageName}</span>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('./components/KpiSwitch/KpiSwitch', () => ({
  KpiSwitch: ({
    kpi,
    onFilterChange,
  }: {
    kpi: string;
    onFilterChange: (key: string, value: string) => void;
  }) => (
    <div data-testid="kpi-switch" data-kpi={kpi}>
      KPI Switch
    </div>
  ),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getCountry: jest.fn(() => ({ label: 'Brazil', value: 'BRA' })),
      getKpi: jest.fn(() => ({ label: 'Power', value: 'power' })),
    })),
  },
}));

jest.mock('shared/Styles', () => ({
  ...jest.requireActual('shared/Styles'),
  StyledHomeContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="performance-tool-container">{children}</div>
  ),
}));

describe('PerformanceTool', () => {
  beforeEach(() => {
    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getCountry: jest.fn(() => ({ label: 'Brazil', value: 'BRA' })),
      getKpi: jest.fn(() => ({ label: 'Power', value: 'power' })),
    });
  });

  describe('Component Rendering', () => {
    it('should render without errors', () => {
      render(<PerformanceTool />);

      expect(
        screen.getByTestId('performance-tool-container'),
      ).toBeInTheDocument();
    });

    it('should render navigation container with Filter and Breadcrumbs', () => {
      render(<PerformanceTool />);

      const navigation = screen.getByTestId('performance-tool-navigation');
      expect(navigation).toBeInTheDocument();

      expect(screen.getByTestId('filter')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    });

    it('should render PageHeader with correct title and subtitle', () => {
      render(<PerformanceTool />);

      const header = screen.getByTestId('page-header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Brazil Power');
      expect(header).toHaveTextContent(
        'Analyze and understand performance drivers',
      );
    });

    it('should render KpiSwitch component', () => {
      render(<PerformanceTool />);

      const kpiSwitch = screen.getByTestId('kpi-switch');
      expect(kpiSwitch).toBeInTheDocument();
      expect(kpiSwitch).toHaveAttribute('data-kpi', 'power');
    });

    it('should render Filter with correct page name', () => {
      render(<PerformanceTool />);

      const filter = screen.getByTestId('filter');
      expect(filter).toHaveTextContent('value-creation/performance-tool');
    });
  });

  describe('Page Title Generation', () => {
    it('should include growth lever in title when a growth lever filter is applied', () => {
      (hooks.usePageFilterApplied as jest.Mock).mockReturnValue({
        applied: {
          country: 'BRA',
          kpis: 'volume',
          growth_levers: 'Superior Core',
        },
      });
      (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
        getCountry: jest.fn(() => ({ label: 'Brazil', value: 'BRA' })),
        getKpi: jest.fn(() => ({ label: 'Volume', value: 'volume' })),
      });

      render(<PerformanceTool />);

      expect(
        screen.getByText('Brazil Superior Core Volume'),
      ).toBeInTheDocument();
    });

    it('should not include growth lever in title when growth lever is All', () => {
      (hooks.usePageFilterApplied as jest.Mock).mockReturnValue({
        applied: {
          country: 'BRA',
          kpis: 'volume',
          growth_levers: 'All',
        },
      });
      (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
        getCountry: jest.fn(() => ({ label: 'Brazil', value: 'BRA' })),
        getKpi: jest.fn(() => ({ label: 'Volume', value: 'volume' })),
      });

      render(<PerformanceTool />);

      expect(screen.getByText('Brazil Volume')).toBeInTheDocument();
    });
  });
});
