import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGoogleAnalytics, usePageFilterApplied } from 'hooks';

import { useBrandBreakdownData, useSummaryForPowerPerformance } from './hooks';
import { SummaryForPower } from './SummaryForPower';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>,
  );

const mockTrackGA = jest.fn();

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  useGoogleAnalytics: jest.fn(),
}));

jest.mock('./hooks', () => ({
  useSummaryForPowerPerformance: jest.fn(),
  useBrandBreakdownData: jest.fn(),
}));

jest.mock('components', () => ({
  BasicContainer: ({ header, children }: any) => (
    <div data-testid="basic-container">
      {header?.title && <div data-testid="container-title">{header.title}</div>}
      {children}
    </div>
  ),
  ExpandButtonWithImg: ({ value, onValueChange, disabled }: any) => (
    <button
      data-testid="expand-button"
      onClick={() => onValueChange(!value)}
      disabled={disabled}
    >
      {value ? 'Collapse' : 'Expand'}
    </button>
  ),
}));

jest.mock('../TableCard/TableCard', () => {
  const tableCardImpl = jest.fn(
    ({
      title,
      rightContent,
      loading,
      error,
      data,
      rowSelection,
      onChangeRows,
      setClearSelectionHandler,
      setRowSelectionHandler,
    }: any) => {
      setClearSelectionHandler?.(jest.fn());
      setRowSelectionHandler?.(jest.fn());

      return (
        <div data-testid="table-card">
          <div data-testid="table-title">{title}</div>
          {rightContent && (
            <div data-testid="table-right-content">{rightContent}</div>
          )}
          {loading && <div data-testid="table-loading">Loading...</div>}
          {error && <div data-testid="table-error">Error</div>}
          {!loading && !error && (
            <div data-testid="table-data">{JSON.stringify(data)}</div>
          )}
          {rowSelection && onChangeRows && (
            <button
              data-testid="table-select-row"
              onClick={() => onChangeRows('Test Row')}
            >
              Select Row
            </button>
          )}
        </div>
      );
    },
  );

  return {
    TableCard: (props: any) => tableCardImpl(props),
    __tableCardImpl: tableCardImpl,
  };
});

jest.mock('../ShowCompetitorToggle/ShowCompetitorToggle', () => ({
  ShowCompetitorToggle: ({
    showCompetitor,
    setShowCompetitor,
    isDisabled,
    handleGAEvent,
  }: any) => (
    <button
      data-testid="show-competitor-toggle"
      onClick={() => {
        setShowCompetitor(!showCompetitor);
        handleGAEvent?.(String(!showCompetitor));
      }}
      disabled={isDisabled}
    >
      {showCompetitor ? 'Hide Competitor' : 'Show Competitor'}
    </button>
  ),
}));

jest.mock('../BrandBreakdownTable/BrandBreakdownTable', () => ({
  BrandBreakdownTable: ({
    loading,
    selectedPerformance,
    isExpanded,
    data,
  }: any) => (
    <div data-testid="brand-breakdown-table">
      {loading && <div data-testid="breakdown-loading">Loading...</div>}
      {selectedPerformance && (
        <div data-testid="breakdown-selected">{selectedPerformance}</div>
      )}
      {isExpanded && <div data-testid="breakdown-expanded">Expanded</div>}
      <div data-testid="breakdown-data">{JSON.stringify(data)}</div>
      <div data-testid="breakdown-config">
        {selectedPerformance ? 'Normal Config' : 'Empty Config'}
      </div>
    </div>
  ),
}));

jest.mock('pages/components', () => ({
  ContentHeader: ({ title, rightContent }: any) => (
    <div data-testid="content-header">
      <div data-testid="header-title">{title}</div>
      {rightContent && (
        <div data-testid="header-right-content">{rightContent}</div>
      )}
    </div>
  ),
}));

jest.mock('pages/components/RowActionTable/utils/mergeRowsInPairs', () => ({
  filterCompetitorRows: jest.fn((data) => ({
    ...data,
    rows: data?.rows?.filter((row: any) => !row.isCompetitor) || [],
  })),
}));

const mockUsePageFilterApplied = usePageFilterApplied as jest.Mock;
const mockUseGoogleAnalytics = useGoogleAnalytics as jest.Mock;
const mockUseSummaryForPowerPerformance =
  useSummaryForPowerPerformance as jest.Mock;
const mockUseBrandBreakdownData = useBrandBreakdownData as jest.Mock;

const mockSegmentData = {
  header: [{ field: 'name', headerName: 'Name' }],
  rows: [{ id: '1', name: 'Segment 1', value: 100 }],
};
const mockPortfolioData = {
  header: [{ field: 'name', headerName: 'Name' }],
  rows: [{ id: '1', name: 'Portfolio 1', value: 200 }],
};
const mockBrandBreakdownData = {
  header: [{ field: 'brand', headerName: 'Brand' }],
  rows: [{ id: '1', brand: 'Brand 1', value: 150 }],
};

const setPerformance = (overrides: any = {}) =>
  mockUseSummaryForPowerPerformance.mockReturnValue({
    segment: {
      loading: false,
      error: null,
      data: { summaryPowerBySegmentPerformance: mockSegmentData },
      ...overrides.segment,
    },
    portfolio: {
      loading: false,
      error: null,
      data: { summaryPowerByPortfolioPerformance: mockPortfolioData },
      ...overrides.portfolio,
    },
  });

const setBreakdown = (overrides: any = {}) =>
  mockUseBrandBreakdownData.mockReturnValue({
    loading: false,
    error: null,
    data: {
      summaryPowerBreakdown: mockBrandBreakdownData,
      summaryPowerBreakdownComp: {
        ...mockBrandBreakdownData,
        rows: [
          ...mockBrandBreakdownData.rows,
          { id: '2', brand: 'Comp', value: 50 },
        ],
      },
    },
    ...overrides,
  });

const setPageFilter = (applied: any = {}) =>
  mockUsePageFilterApplied.mockReturnValue({
    applied: { sub_scopes: 'All Global Brands', scopes: 'segment', ...applied },
  });

describe('SummaryForPower', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGoogleAnalytics.mockReturnValue(mockTrackGA);
    setPageFilter();
    setPerformance();
    setBreakdown();
  });

  it('renders the section title and the two performance tables', () => {
    renderWithIntl(<SummaryForPower />);

    expect(screen.getByTestId('container-title')).toHaveTextContent(
      'PortfolioBrand.BrandPowerBook.PowerBook.SummaryForPower.title',
    );
    expect(screen.getAllByTestId('table-card')).toHaveLength(2);
    expect(screen.getByTestId('show-competitor-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('brand-breakdown-table')).toBeInTheDocument();
  });

  describe('Show competitor toggle', () => {
    it('toggles competitor mode and emits the corresponding GA event', async () => {
      const user = userEvent.setup();

      renderWithIntl(<SummaryForPower />);

      const toggle = screen.getByTestId('show-competitor-toggle');
      expect(toggle).toHaveTextContent('Show Competitor');

      await user.click(toggle);

      expect(toggle).toHaveTextContent('Hide Competitor');
      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Summary For Power Competitor Filter',
        event_action: 'Click',
        event_label: 'true',
      });
    });

    it('is disabled when scopes is "portfolio"', () => {
      setPageFilter({ scopes: 'portfolio' });

      renderWithIntl(<SummaryForPower />);

      expect(screen.getByTestId('show-competitor-toggle')).toBeDisabled();
    });
  });

  describe('Row selection drives the brand breakdown', () => {
    it('selecting a segment row populates the breakdown and enables the expand button', async () => {
      const user = userEvent.setup();

      renderWithIntl(<SummaryForPower />);

      expect(screen.getByTestId('breakdown-config')).toHaveTextContent(
        'Empty Config',
      );
      expect(screen.getByTestId('expand-button')).toBeDisabled();

      const segmentTable = screen.getAllByTestId('table-card')[0];
      await user.click(
        segmentTable.querySelector(
          '[data-testid="table-select-row"]',
        ) as HTMLButtonElement,
      );

      expect(screen.getByTestId('breakdown-selected')).toHaveTextContent(
        'Test Row',
      );
      expect(screen.getByTestId('breakdown-config')).toHaveTextContent(
        'Normal Config',
      );
      expect(screen.getByTestId('expand-button')).not.toBeDisabled();
    });

    it('selecting a portfolio row also disables the competitor toggle', async () => {
      const user = userEvent.setup();

      renderWithIntl(<SummaryForPower />);

      const portfolioTable = screen.getAllByTestId('table-card')[1];
      await user.click(
        portfolioTable.querySelector(
          '[data-testid="table-select-row"]',
        ) as HTMLButtonElement,
      );

      expect(screen.getByTestId('breakdown-selected')).toHaveTextContent(
        'Test Row',
      );
      expect(screen.getByTestId('show-competitor-toggle')).toBeDisabled();
    });

    it('translates "TT ABI" to "TT ABI Segment" when selected from the segment table', async () => {
      const TableCardModule = jest.requireMock('../TableCard/TableCard');
      const tableCardImpl = TableCardModule.__tableCardImpl as jest.Mock;
      tableCardImpl.mockImplementationOnce(({ onChangeRows }: any) => (
        <div data-testid="table-card">
          <button
            data-testid="table-select-row"
            onClick={() => onChangeRows?.('TT ABI')}
          >
            Select Row
          </button>
        </div>
      ));

      const user = userEvent.setup();
      renderWithIntl(<SummaryForPower />);

      await user.click(screen.getAllByTestId('table-select-row')[0]);

      expect(screen.getByTestId('breakdown-selected')).toHaveTextContent(
        'TT ABI Segment',
      );
    });
  });

  describe('Loading and error states', () => {
    it.each([
      {
        label: 'segment loading',
        performance: { segment: { loading: true, data: null } },
        section: () => screen.getAllByTestId('table-card')[0],
        marker: 'table-loading',
      },
      {
        label: 'segment error',
        performance: {
          segment: { error: new Error('Test error'), data: null },
        },
        section: () => screen.getAllByTestId('table-card')[0],
        marker: 'table-error',
      },
    ])(
      'forwards $label to the corresponding TableCard',
      ({ performance, section, marker }) => {
        setPerformance(performance);

        renderWithIntl(<SummaryForPower />);

        expect(
          section().querySelector(`[data-testid="${marker}"]`),
        ).toBeInTheDocument();
      },
    );

    it('forwards loading state to the brand breakdown table', () => {
      setBreakdown({ loading: true, data: null });

      renderWithIntl(<SummaryForPower />);

      expect(screen.getByTestId('breakdown-loading')).toBeInTheDocument();
    });
  });

  describe('GA tracking error handling', () => {
    it('logs an error and keeps the toggle working when trackGA throws', async () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      mockTrackGA.mockImplementationOnce(() => {
        throw new Error('GA failure');
      });

      const user = userEvent.setup();

      renderWithIntl(<SummaryForPower />);

      const toggle = screen.getByTestId('show-competitor-toggle');
      await user.click(toggle);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to track Google Analytics event:',
        expect.any(Error),
      );
      expect(toggle).toHaveTextContent('Hide Competitor');

      consoleErrorSpy.mockRestore();
    });
  });
});
