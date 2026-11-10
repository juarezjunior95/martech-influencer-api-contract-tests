import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { resolveHeightAfterAlerts } from 'pages/components/PortfolioBrand/helpers';

import {
  TABLE_ABI_BODY_AVAILABLE_HEIGHT_PX,
  TABLE_BREAKDOWN_BODY_AVAILABLE_HEIGHT_PX,
} from './constants';
import { CountrySlide } from './CountrySlide';

jest.mock(
  'pages/pillars/PortfolioBrand/BrandPowerBookExport/components/HeaderContainer/HeaderContainer',
  () => ({
    HeaderContainer: ({ title, children }: any) => (
      <section data-testid="header" data-title={title}>
        {children}
      </section>
    ),
  }),
);

jest.mock('components', () => ({
  Alert: ({ message }: any) => <div data-testid="alert">{message}</div>,
  DataStateHandler: ({ children, loading, error, empty }: any) => {
    if (loading) return <div data-testid="state-loading" />;
    if (error) return <div data-testid="state-error" />;
    if (empty) return <div data-testid="state-empty" />;
    return <div data-testid="state-content">{children}</div>;
  },
}));

const mockRowActionTable = jest.fn();

jest.mock('pages/components', () => ({
  RowActionTable: (props: any) => {
    mockRowActionTable(props);
    return <div data-testid="table" />;
  },
}));

jest.mock('pages/components/RowActionTable/config', () => ({
  brandBreakdownExportConfig: jest.fn(),
  performanceConfig: jest.fn(),
}));

jest.mock('pages/components/RowActionTable/utils/mergeRowsInPairs', () => ({
  filterAbiRows: jest.fn((data) => data),
  filterCompetitorRows: jest.fn((data) => data),
}));

const breakdownKpi = {
  table: {
    header: [],
    rows: [[{ brand: { value: 'A' } }]],
    empty: false,
  },
  tableComp: {
    header: [],
    rows: [[{ brand: { value: 'B' } }]],
    empty: false,
  },
};

const segmentKpi = {
  table: {
    header: [],
    rows: [[{ id: { value: 'TT ABI' } }]],
    empty: false,
  },
};

const portfolioKpi = {
  table: {
    header: [],
    rows: [[{ id: { value: 'TT ABI' } }]],
    empty: false,
  },
};

const baseProps: any = {
  titlePower: 'Power',
  titleBrandBreakdown: 'Breakdown',
  brandBreakdownKpiData: breakdownKpi,
  segmentPerformanceKpiData: segmentKpi,
  portfolioPerformanceKpiData: portfolioKpi,
  alerts: [],
  loading: false,
  error: null,
};

const renderSlide = (props = {}) =>
  render(<CountrySlide {...baseProps} {...props} />);

describe('CountrySlide', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders headers and tables', () => {
      renderSlide();

      const headers = screen.getAllByTestId('header');

      expect(
        headers.some((h) => h.getAttribute('data-title') === 'Breakdown'),
      ).toBe(true);

      expect(
        headers.some((h) => h.getAttribute('data-title') === 'Power'),
      ).toBe(true);

      expect(screen.getAllByTestId('table')).toHaveLength(2);
    });
  });

  describe('Alerts', () => {
    it('renders alert with multiple messages', () => {
      renderSlide({ alerts: ['A1', 'A2'] });

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByText('A1')).toBeInTheDocument();
      expect(screen.getByText('A2')).toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('renders loading state', () => {
      renderSlide({ loading: true });

      expect(screen.queryAllByTestId('state-loading')).not.toHaveLength(0);
    });

    it('renders error state', () => {
      renderSlide({ error: new Error('err') });

      expect(screen.queryAllByTestId('state-error')).not.toHaveLength(0);
    });

    it('renders empty state when breakdown is empty', () => {
      renderSlide({
        brandBreakdownKpiData: {
          ...breakdownKpi,
          table: { header: [], rows: [], empty: true },
        },
      });

      expect(screen.queryAllByTestId('state-empty')).not.toHaveLength(0);
    });
  });

  describe('Row height', () => {
    it('uses fixed breakdown body height per row; total table uses resolveHeightAfterAlerts', () => {
      renderSlide();

      const breakdownCall = mockRowActionTable.mock.calls[0][0];
      const totalCall = mockRowActionTable.mock.calls[1][0];
      const breakdownRowCount = breakdownCall.data.rows[0]?.length || 1;
      const totalRowCount = totalCall.data.rows[0]?.length || 1;

      expect(breakdownCall.rowHeight).toBe(
        TABLE_BREAKDOWN_BODY_AVAILABLE_HEIGHT_PX / breakdownRowCount,
      );
      expect(totalCall.rowHeight).toBe(
        resolveHeightAfterAlerts(
          TABLE_ABI_BODY_AVAILABLE_HEIGHT_PX,
          false,
          null,
        ) / totalRowCount,
      );
    });

    it('keeps breakdown row height unchanged when alerts are shown', () => {
      const { rerender } = renderSlide({ alerts: [] });
      const heightWithoutAlerts = mockRowActionTable.mock.calls[0][0].rowHeight;

      rerender(<CountrySlide {...baseProps} alerts={['Alert 1']} />);

      expect(mockRowActionTable.mock.calls[2][0].rowHeight).toBe(
        heightWithoutAlerts,
      );
    });
  });

  describe('Competitor logic', () => {
    it('uses tableComp and limits breakdown rows to 23 when competitorView is true', () => {
      const largeTable = {
        ...breakdownKpi,
        tableComp: {
          header: [],
          rows: [Array.from({ length: 30 }, () => ({ brand: {} }))],
          empty: false,
        },
      };

      renderSlide({
        brandBreakdownKpiData: largeTable,
        competitorView: true,
      });

      const breakdownCall = mockRowActionTable.mock.calls[0][0];
      expect(breakdownCall.data.rows[0]).toHaveLength(23);
    });

    it('changes TT ABI to TT Comp when competitorView is true', () => {
      renderSlide({ competitorView: true });

      const totalCall = mockRowActionTable.mock.calls[1][0];
      expect(
        totalCall.data.rows[0].some((r: any) => r.id?.value === 'TT Comp'),
      ).toBe(true);
    });

    it('filters out TT ABI from portfolio when competitorView is false', () => {
      renderSlide({ competitorView: false });

      const totalCall = mockRowActionTable.mock.calls[1][0];
      const rows = totalCall.data.rows[0];

      const ttAbiCount = rows.filter(
        (r: any) => r.id?.value === 'TT ABI',
      ).length;

      expect(ttAbiCount).toBe(1);
    });
  });
});
