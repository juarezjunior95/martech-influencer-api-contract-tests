import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGoogleAnalytics, usePageFilterApplied } from 'hooks';

import { useZoneMaturityData, useZoneMaturityDetails } from './hooks';
import { ZoneMaturity } from './ZoneMaturity';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>,
  );

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  useGoogleAnalytics: jest.fn(),
}));

jest.mock('./hooks', () => ({
  useZoneMaturityData: jest.fn(),
  useZoneMaturityDetails: jest.fn(),
}));

jest.mock('components', () => ({
  BasicContainer: ({ header, children }: any) => (
    <div data-testid="basic-container">
      {header?.title && <div data-testid="container-title">{header.title}</div>}
      {children}
    </div>
  ),
  DataStateHandler: ({ loading, error, empty, children }: any) => (
    <div data-testid="data-state-handler">
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div data-testid="error">Error</div>}
      {empty && <div data-testid="empty">Empty</div>}
      {!loading && !error && !empty && children}
    </div>
  ),
}));

jest.mock('@hexa-ui/components', () => ({
  SegmentedControl: ({ options, value, onValueChange }: any) => (
    <div data-testid="segmented-control">
      {options.map((option: any) => (
        <button
          key={option.value}
          data-testid={`segmented-option-${option.value}`}
          data-selected={value === option.value}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

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

jest.mock('pages/components', () => ({
  ContentHeader: ({ title, subtitle }: any) => (
    <div data-testid="content-header">
      <div data-testid="header-title">{title}</div>
      {subtitle && <div data-testid="header-subtitle">{subtitle}</div>}
    </div>
  ),
  RowActionTable: ({
    data,
    onChangeRows,
    noRowsMessage,
    setRowSelectionHandler,
  }: any) => (
    <div data-testid="row-action-table">
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      {onChangeRows && (
        <button
          data-testid="table-select-row"
          onClick={() => onChangeRows('Test Row')}
        >
          Select Row
        </button>
      )}
      {noRowsMessage && (
        <div data-testid="no-rows-message">
          <div data-testid="no-rows-title">{noRowsMessage.title}</div>
          <div data-testid="no-rows-description">
            {noRowsMessage.description}
          </div>
        </div>
      )}
      {setRowSelectionHandler && setRowSelectionHandler(() => undefined)}
    </div>
  ),
  PowerLegend: ({ loading, data }: any) => (
    <div data-testid="power-legend">
      {loading && <div data-testid="legend-loading">Loading...</div>}
      {!loading && <div data-testid="legend-data">{JSON.stringify(data)}</div>}
    </div>
  ),
}));

jest.mock('pages/components/RowActionTable/utils/mergeRowsInPairs', () => ({
  filterCompetitorRows: jest.fn((data) => ({
    ...data,
    rows: data?.rows?.filter((row: any) => !row.isCompetitor) || [],
  })),
}));

jest.mock('shared/Styles', () => {
  const Pass = ({ children }: any) => <>{children}</>;
  return {
    StyledCardContainer: Pass,
    StyledLeftContainer: Pass,
    StyledRightContainer: Pass,
    StyledTooltip: Pass,
    StyledToggle: ({ checked, onCheckedChange, name, disabled }: any) => (
      <button
        data-testid="toggle"
        data-checked={checked}
        data-name={name}
        onClick={() => onCheckedChange(!checked)}
        disabled={disabled}
      />
    ),
  };
});

const mockUsePageFilterApplied = usePageFilterApplied as jest.Mock;
const mockUseGoogleAnalytics = useGoogleAnalytics as jest.Mock;
const mockUseZoneMaturityData = useZoneMaturityData as jest.Mock;
const mockUseZoneMaturityDetails = useZoneMaturityDetails as jest.Mock;
const mockTrackGA = jest.fn();

const mockZoneData = {
  header: [{ field: 'name', headerName: 'Name' }],
  rows: [
    { id: '1', name: 'Zone 1', value: 100 },
    { id: '2', name: 'Competitor', isCompetitor: true, value: 50 },
  ],
};

const mockMaturityData = {
  header: [{ field: 'name', headerName: 'Name' }],
  rows: [
    { id: '1', name: 'Maturity 1', value: 200 },
    { id: '2', name: 'Competitor', isCompetitor: true, value: 100 },
  ],
};

const mockDetailsData = {
  header: [{ field: 'detail', headerName: 'Detail' }],
  rows: [{ id: '1', detail: 'Detail 1', value: 150 }],
};

const mockLegendData = [
  { label: 'High', color: '#00FF00' },
  { label: 'Low', color: '#FF0000' },
];

const setMaturityData = (
  zoneOverrides: any = {},
  maturityOverrides: any = {},
) =>
  mockUseZoneMaturityData.mockReturnValue({
    zone: {
      loading: false,
      error: null,
      data: { table: mockZoneData, legend: mockLegendData },
      ...zoneOverrides,
    },
    maturity: {
      loading: false,
      error: null,
      data: { table: mockMaturityData, legend: [] },
      ...maturityOverrides,
    },
  });

const setDetails = (overrides: any = {}) =>
  mockUseZoneMaturityDetails.mockReturnValue({
    loading: false,
    error: null,
    data: { performanceDetails: mockDetailsData },
    ...overrides,
  });

const setPageFilter = (applied: any = {}) =>
  mockUsePageFilterApplied.mockReturnValue({
    applied: { sub_scopes: 'All Global Brands', scopes: 'segment', ...applied },
  });

describe('ZoneMaturity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGoogleAnalytics.mockReturnValue(mockTrackGA);
    setPageFilter();
    setMaturityData();
    setDetails();
  });

  it('renders the section title and the two main tables', () => {
    renderWithIntl(<ZoneMaturity />);

    expect(screen.getByTestId('container-title')).toHaveTextContent(
      'PortfolioBrand.BrandPowerBook.PowerBook.PerformanceBreakdown.title',
    );
    expect(screen.getAllByTestId('row-action-table')).toHaveLength(2);
  });

  describe('View toggle', () => {
    it('switches between zone and maturity datasets and emits a GA event', async () => {
      const user = userEvent.setup();

      renderWithIntl(<ZoneMaturity />);

      const zoneButton = screen.getByTestId('segmented-option-zone');
      const maturityButton = screen.getByTestId('segmented-option-maturity');

      expect(zoneButton).toHaveAttribute('data-selected', 'true');

      const expectedZone = {
        ...mockZoneData,
        rows: mockZoneData.rows.filter((row) => !row.isCompetitor),
      };
      expect(screen.getAllByTestId('table-data')[0]).toHaveTextContent(
        JSON.stringify(expectedZone),
      );

      await user.click(maturityButton);

      expect(maturityButton).toHaveAttribute('data-selected', 'true');
      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Performance Breakdown View Type Filter',
        event_action: 'Click',
        event_label: 'maturity',
      });

      const expectedMaturity = {
        ...mockMaturityData,
        rows: mockMaturityData.rows.filter((row) => !row.isCompetitor),
      };
      expect(screen.getAllByTestId('table-data')[0]).toHaveTextContent(
        JSON.stringify(expectedMaturity),
      );
    });
  });

  describe('Row selection', () => {
    it('shows the details table and updates the right header when a row is selected', async () => {
      const user = userEvent.setup();
      renderWithIntl(<ZoneMaturity />);

      expect(
        screen
          .getAllByTestId('row-action-table')[1]
          .querySelector('[data-testid="no-rows-message"]'),
      ).toBeInTheDocument();

      const leftSelectButton = screen
        .getAllByTestId('row-action-table')[0]
        .querySelector('[data-testid="table-select-row"]');
      await user.click(leftSelectButton!);

      const tables = screen.getAllByTestId('row-action-table');
      expect(
        tables[1].querySelector('[data-testid="table-data"]'),
      ).toHaveTextContent(JSON.stringify(mockDetailsData));
      expect(
        tables[1].querySelector('[data-testid="no-rows-message"]'),
      ).not.toBeInTheDocument();
      expect(screen.getAllByTestId('header-title')[1]).toHaveTextContent(
        'Test Row Details',
      );
    });
  });

  describe('Show competitor toggle', () => {
    it('toggles its label and emits a GA event on click', async () => {
      const user = userEvent.setup();

      renderWithIntl(<ZoneMaturity />);

      const toggle = screen.getByTestId('show-competitor-toggle');
      expect(toggle).toHaveTextContent('Show Competitor');

      await user.click(toggle);

      expect(toggle).toHaveTextContent('Hide Competitor');
      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Performance Breakdown Competitor Filter',
        event_action: 'Click',
        event_label: 'true',
      });
    });

    it.each([{ scopes: 'global_brands' }, { scopes: 'portfolio' }])(
      'is disabled when scopes is $scopes',
      ({ scopes }) => {
        setPageFilter({ scopes });

        renderWithIntl(<ZoneMaturity />);

        expect(screen.getByTestId('show-competitor-toggle')).toBeDisabled();
      },
    );
  });

  describe('byCompetitor override (Heineken)', () => {
    it('forces byCompetitor=true when sub_scopes is "Heineken" (no filtering)', () => {
      setPageFilter({ sub_scopes: 'Heineken' });

      renderWithIntl(<ZoneMaturity />);

      expect(screen.getAllByTestId('table-data')[0]).toHaveTextContent(
        JSON.stringify(mockZoneData),
      );
    });
  });

  describe('Loading and error states', () => {
    it.each([
      {
        case: 'main table while zone data is loading',
        setup: () => setMaturityData({ loading: true, data: null }),
        expectedTestId: 'loading',
      },
      {
        case: 'main table when zone data has error',
        setup: () =>
          setMaturityData({ error: new Error('Test error'), data: null }),
        expectedTestId: 'error',
      },
    ])('shows $case', ({ setup, expectedTestId }) => {
      setup();

      renderWithIntl(<ZoneMaturity />);

      expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
    });

    it.each([
      {
        case: 'loading',
        details: { loading: true, data: null },
        expectedTestId: 'loading',
      },
      {
        case: 'error',
        details: { error: new Error('Test error'), data: null },
        expectedTestId: 'error',
      },
    ])(
      'shows $case in details panel after a row is selected',
      async ({ details, expectedTestId }) => {
        setDetails(details);
        const user = userEvent.setup();

        renderWithIntl(<ZoneMaturity />);

        await user.click(
          screen
            .getAllByTestId('row-action-table')[0]
            .querySelector(
              '[data-testid="table-select-row"]',
            ) as HTMLButtonElement,
        );

        expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
      },
    );
  });

  describe('PowerLegend', () => {
    it('renders the legend data and switches to loading when zone is loading', () => {
      const { rerender } = renderWithIntl(<ZoneMaturity />);

      expect(screen.getByTestId('legend-data')).toHaveTextContent(
        JSON.stringify(mockLegendData),
      );

      setMaturityData({ loading: true, data: null });
      rerender(
        <IntlProvider locale="en" messages={{}}>
          <ZoneMaturity />
        </IntlProvider>,
      );

      expect(screen.getByTestId('legend-loading')).toBeInTheDocument();
    });
  });
});
