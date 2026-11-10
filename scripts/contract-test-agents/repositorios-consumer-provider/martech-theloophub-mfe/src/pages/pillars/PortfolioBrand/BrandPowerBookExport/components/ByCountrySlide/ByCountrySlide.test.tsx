import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { resolveHeightAfterAlerts } from '../../helpers';
import { ByCountrySlide } from './ByCountrySlide';
import {
  DETAILS_TABLES_TOTAL_HEIGHT_PX,
  MATURITY_BLOCK_HEIGHT_PX,
  MATURITY_TABLE_BODY_HEIGHT_PX,
  ZONES_SECTION_BASE_HEIGHT_PX,
} from './constants';

jest.mock('pages/components/AISummary', () => ({
  AISummary: ({ summaryPageIdentifier, dataTestId }: any) => (
    <div
      data-testid={dataTestId ?? 'ai-summary'}
      data-identifier={summaryPageIdentifier}
    />
  ),
}));

jest.mock('pages/components/RowActionTable/config', () => ({
  zoneMaturityConfig: jest.fn(() => []),
}));

jest.mock('pages/components/RowActionTable/utils/mergeRowsInPairs', () => ({
  filterAbiRows: (data: any) => data ?? { header: [], rows: [] },
  filterCompetitorRows: (data: any) => data ?? { header: [], rows: [] },
}));

jest.mock('../../BrandPowerBookExport', () => ({
  BRAND_POWER_BOOK_EXPORT_PAGE_NAME: 'Brand Power Book - Power Book',
}));

jest.mock('../../BrandPowerBookExport.styles', () => ({
  StyledBrandPowerBookExportContainer: ({ children }: any) => <>{children}</>,
  StyledParagraph: ({ children }: any) => <p>{children}</p>,
}));

jest.mock('../BrandPowerBigNumbers/BrandPowerBigNumbers', () => ({
  BrandPowerBigNumbers: ({ loading, error, empty }: any) => {
    if (loading) return <div data-testid="big-numbers-loading" />;
    if (error)
      return <div data-testid="big-numbers-error">{error.message}</div>;
    if (empty) return <div data-testid="big-numbers-empty" />;
    return <div data-testid="big-numbers-content" />;
  },
}));

jest.mock('../HeaderContainer/HeaderContainer', () => ({
  HeaderContainer: ({ title, children }: any) => (
    <section data-testid="header" data-title={title}>
      {children}
    </section>
  ),
}));

jest.mock('components', () => ({
  Alert: ({ message }: any) => <div data-testid="alert">{message}</div>,
  DataStateHandler: ({ children, loading, error, empty }: any) => {
    if (loading) return <div data-testid="state-loading" />;
    if (error) return <div data-testid="state-error" />;
    if (empty) return <div data-testid="state-empty" />;
    return <div data-testid="state-content">{children}</div>;
  },
}));

jest.mock('pages/components', () => ({
  RowActionTable: ({ rowHeight, columnDefsConfig }: any) => {
    columnDefsConfig?.();
    return <div data-testid="table" data-row-height={rowHeight} />;
  },
}));

jest.mock('./utils', () => ({
  leftTableProcessing: jest.fn(() => ({ header: [{}], rows: [[{}]] })),
  rightTableProcessing: jest.fn(() => ({ header: [{}], rows: [[{}]] })),
}));

const createDetailsKpi = (empty = false) => ({
  details: { header: [], rows: [], empty },
});

const baseProps: any = {
  bigNumbersKpiData: {},
  zoneKpiData: {},
  maturityKpiData: {},
  nazKpiData: createDetailsKpi(false),
  sazKpiData: createDetailsKpi(false),
  mazKpiData: createDetailsKpi(false),
  apacKpiData: createDetailsKpi(false),
  afrKpiData: createDetailsKpi(false),
  eurKpiData: createDetailsKpi(false),
  alerts: [],
  loading: false,
  error: null,
  isCompetitor: false,
};

const renderSlide = (props = {}) =>
  render(<ByCountrySlide {...baseProps} {...props} />);

const MOCK_TABLE_ROW_COUNT = 1;

const headerTitles = () =>
  screen.queryAllByTestId('header').map((h) => h.dataset.title);

describe('ByCountrySlide', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders big numbers, tables and the expected section headers', () => {
    renderSlide();

    expect(screen.getByTestId('big-numbers-content')).toBeInTheDocument();
    expect(screen.getAllByTestId('table').length).toBeGreaterThan(0);
    expect(headerTitles()).toEqual(
      expect.arrayContaining(['ABI - BUs', 'Zones', 'Maturity']),
    );
  });

  it('omits the Maturity header when maturityKpiData is undefined', () => {
    renderSlide({ maturityKpiData: undefined });

    expect(headerTitles()).not.toContain('Maturity');
  });

  describe('Alerts', () => {
    it('renders an alert containing every message when alerts are provided', () => {
      renderSlide({ alerts: ['Alert 1', 'Alert 2'] });

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.getByText('Alert 1')).toBeInTheDocument();
      expect(screen.getByText('Alert 2')).toBeInTheDocument();
    });

    it('does not render any alert when the alerts array is empty', () => {
      renderSlide({ alerts: [] });

      expect(screen.queryByTestId('alert')).not.toBeInTheDocument();
    });
  });

  it.each([
    ['loading', { loading: true }, 'state-loading'],
    ['error', { error: new Error('err') }, 'state-error'],
  ])(
    'propagates %s state to the inner DataStateHandler',
    (_label, props, testId) => {
      renderSlide(props);

      expect(screen.queryAllByTestId(testId).length).toBeGreaterThan(0);
    },
  );

  describe('Tables layout', () => {
    it('splits the available height across details/zone/maturity tables when maturity exists', () => {
      renderSlide();

      const heights = screen
        .getAllByTestId('table')
        .map((t) => t.dataset.rowHeight);

      const detailsBudget = resolveHeightAfterAlerts(
        DETAILS_TABLES_TOTAL_HEIGHT_PX,
        false,
        null,
      );
      const zoneBudget = resolveHeightAfterAlerts(
        ZONES_SECTION_BASE_HEIGHT_PX - MATURITY_BLOCK_HEIGHT_PX,
        false,
        null,
      );
      const maturityBudget = MATURITY_TABLE_BODY_HEIGHT_PX;

      expect(heights).toEqual(
        expect.arrayContaining([
          String(detailsBudget / MOCK_TABLE_ROW_COUNT),
          String(zoneBudget / MOCK_TABLE_ROW_COUNT),
          String(maturityBudget / MOCK_TABLE_ROW_COUNT),
        ]),
      );
    });

    it('reallocates the maturity height to the zones table when maturity is missing', () => {
      renderSlide({ maturityKpiData: undefined });

      const heights = screen
        .getAllByTestId('table')
        .map((t) => t.dataset.rowHeight);

      const zoneBudgetWithoutMaturity = resolveHeightAfterAlerts(
        ZONES_SECTION_BASE_HEIGHT_PX,
        false,
        null,
      );

      expect(heights).toContain(
        String(zoneBudgetWithoutMaturity / MOCK_TABLE_ROW_COUNT),
      );
    });
  });

  describe('global scale calculation', () => {
    it('safely renders when both tables have no rows', () => {
      const utils = jest.requireMock('./utils');
      utils.leftTableProcessing.mockReturnValueOnce({
        header: [],
        rows: [],
      });
      utils.rightTableProcessing.mockReturnValueOnce({
        header: [],
        rows: [],
      });

      renderSlide();

      expect(screen.getAllByTestId('table').length).toBeGreaterThan(0);
    });

    it('safely renders when rows[0] is not an array', () => {
      const utils = jest.requireMock('./utils');
      utils.leftTableProcessing.mockReturnValueOnce({
        header: [],
        rows: [{ notAnArray: true }],
      });
      utils.rightTableProcessing.mockReturnValueOnce({
        header: [],
        rows: [{ notAnArray: true }],
      });

      renderSlide();

      expect(screen.getAllByTestId('table').length).toBeGreaterThan(0);
    });

    it('iterates chart data values when rows expose numeric chartData arrays', () => {
      const utils = jest.requireMock('./utils');
      utils.leftTableProcessing.mockReturnValueOnce({
        header: [{}],
        rows: [
          [
            { ac: { chartData: { data: [10, 20, 30] } } },
            { ac: { chartData: { data: [100, 5, 50] } } },
          ],
        ],
      });
      utils.rightTableProcessing.mockReturnValueOnce({
        header: [{}],
        rows: [[{ ac: { chartData: { data: [1, 2, 3] } } }]],
      });

      renderSlide();

      expect(screen.getAllByTestId('table').length).toBeGreaterThan(0);
    });
  });

  describe('AI summary rendering', () => {
    it('renders the AISummary block when section maps to a known global identifier', () => {
      renderSlide({ section: 'total-abi-power-by-country' });

      const aiSummary = screen.getByTestId(
        'ai-summary-total-abi-power-by-country',
      );
      expect(aiSummary).toBeInTheDocument();
      expect(aiSummary).toHaveAttribute(
        'data-identifier',
        expect.stringContaining('All'),
      );
    });

    it('does not render the AISummary block when section is unknown', () => {
      renderSlide({ section: 'not-a-real-section' });

      expect(
        screen.queryByTestId('ai-summary-not-a-real-section'),
      ).not.toBeInTheDocument();
    });
  });
});
