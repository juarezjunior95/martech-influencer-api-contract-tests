import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { useLastDataRefresh } from 'contexts';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { useFeatureToggle, usePageFilterApplied } from 'hooks';

import { PowerBook } from './PowerBook';

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      {ui}
    </IntlProvider>,
  );

let mockAiSummaryEnabled: boolean | undefined = true;
let mockIsAiSummaryLoading = false;

jest.mock('hooks', () => ({
  usePageFilterApplied: jest.fn(),
  useFeatureToggle: jest.fn(() => [
    mockAiSummaryEnabled,
    mockIsAiSummaryLoading,
  ]),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(),
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: jest.fn(),
}));

jest.mock('utils/format', () => ({
  formatDateToQuarterYear: jest.fn(
    (_date, separator) => `Q1 2024${separator}Q2 2024`,
  ),
}));

jest.mock('./hooks/usePowerBookOverviewData', () => ({
  usePowerBookOverviewData: jest.fn(),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Calendar: () => <span data-testid="calendar-icon" />,
}));

jest.mock('components', () => ({
  BasicContainer: ({ header, children, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'basic-container'}>
      {header?.title && <div data-testid="header-title">{header.title}</div>}
      {header?.tags?.map((tag: any, index: number) => {
        const TagIcon = tag.icon;
        return (
          <div key={`${tag.text}-${index}`} data-testid="header-tag">
            {TagIcon && <TagIcon />}
            {tag.text}
          </div>
        );
      })}
      {header?.rightContent && (
        <div data-testid="header-right-content">{header.rightContent}</div>
      )}
      {children}
    </div>
  ),
  CountryBrandFlag: ({ brandFlagHidden }: any) => (
    <div data-testid="country-brand-flag" data-flag-hidden={brandFlagHidden} />
  ),
}));

jest.mock('pages/components', () => ({
  PerformanceTrend: ({ loading, error, legend }: any) => (
    <div data-testid="performance-trend">
      {loading && <div data-testid="trend-loading">Loading...</div>}
      {error && <div data-testid="trend-error">Error</div>}
      <div data-testid="trend-legend">{JSON.stringify(legend)}</div>
    </div>
  ),
}));

jest.mock('./components', () => ({
  BigNumbers: ({ loading, error, powerVsLq, powerVsLy }: any) => (
    <div data-testid="big-numbers">
      {loading && <div data-testid="big-numbers-loading">Loading...</div>}
      {error && <div data-testid="big-numbers-error">Error</div>}
      <div data-testid="power-vs-lq">{JSON.stringify(powerVsLq)}</div>
      <div data-testid="power-vs-ly">{JSON.stringify(powerVsLy)}</div>
    </div>
  ),
  ZoneMaturity: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'zone-maturity'}>ZoneMaturity</div>
  ),
  SummaryForPower: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'summary-for-power'}>SummaryForPower</div>
  ),
  CountryContribution: ({ dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'country-contribution'}>
      CountryContribution
    </div>
  ),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      portfolioBrand: {
        submenus: {
          brandPowerBook: { aiSummary: 'ai_summary_brand_power_book' },
        },
      },
    },
  },
}));

jest.mock('pages/components/AISummary', () => ({
  AISummaryAlert: ({ pageName, kpiGroup, dataTestId }: any) => (
    <div
      data-testid={
        dataTestId ? `${dataTestId}-ai-summary` : `ai-summary-${pageName}`
      }
      data-page-name={pageName}
      data-kpi-group={kpiGroup}
    />
  ),
}));

const mockUsePageFilterApplied = usePageFilterApplied as jest.Mock;
const mockUseLastDataRefresh = useLastDataRefresh as jest.Mock;
const mockUseDataRefreshForTab = useDataRefreshForTab as jest.Mock;
const mockUseFeatureToggle = useFeatureToggle as jest.Mock;
const mockUsePowerBookOverviewData = jest.requireMock(
  './hooks/usePowerBookOverviewData',
).usePowerBookOverviewData as jest.Mock;

const mockPowerVsLq = { value: 100, unit: '%' };
const mockPowerVsLy = { value: 200, unit: '%' };
const mockTrendOverTime = [{ x: 'Q1', y: 50 }];
const mockYearPowerVsAc = [{ x: '2024', y: 60 }];
const mockLegend = [{ label: 'Test', color: '#000' }];

const setOverviewData = (
  overrides: Partial<{
    bigNumbers: any;
    performanceTrend: any;
  }> = {},
) =>
  mockUsePowerBookOverviewData.mockReturnValue({
    bigNumbers: {
      loading: false,
      error: null,
      data: { powerVsLq: mockPowerVsLq, powerVsLy: mockPowerVsLy },
    },
    performanceTrend: {
      loading: false,
      error: null,
      data: {
        trendOverTime: mockTrendOverTime,
        yearPowerVsAc: mockYearPowerVsAc,
        legend: mockLegend,
      },
    },
    ...overrides,
  });

const setPageFilter = (overrides: any = {}) =>
  mockUsePageFilterApplied.mockReturnValue({
    isGlobalZone: false,
    applied: { sub_scopes: 'All Global Brands', zone: null, ...overrides },
    ...overrides,
  });

describe('PowerBook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAiSummaryEnabled = true;
    mockIsAiSummaryLoading = false;
    mockUseDataRefreshForTab.mockReturnValue(undefined);
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { power: new Date('2024-01-01') },
    });
    setPageFilter({ zone: null });
    setOverviewData();
  });

  describe('Header & top-level wiring', () => {
    it('renders the page title and the formatted refresh date tag', () => {
      renderWithIntl(<PowerBook />);

      const titles = screen.getAllByTestId('header-title');
      expect(titles[0]).toHaveTextContent(
        'PortfolioBrand.BrandPowerBook.PowerBook.title',
      );
      expect(screen.getByText('Q1 2024 - Q2 2024')).toBeInTheDocument();
    });

    it('registers the data-refresh tab name on mount', () => {
      renderWithIntl(<PowerBook />);

      expect(mockUseDataRefreshForTab).toHaveBeenCalledWith(
        'Brand Power Book - Power Book',
      );
    });

    it.each([
      { sub_scopes: 'Heineken', expected: 'true' },
      { sub_scopes: 'All Global Brands', expected: 'false' },
    ])(
      'hides the country brand flag only when sub_scopes is not All Global Brands ($sub_scopes)',
      ({ sub_scopes, expected }) => {
        setPageFilter({ sub_scopes });

        renderWithIntl(<PowerBook />);

        expect(screen.getByTestId('country-brand-flag')).toHaveAttribute(
          'data-flag-hidden',
          expected,
        );
      },
    );
  });

  describe('Overview data', () => {
    it.each([
      { sub_scopes: 'Heineken', expected: 'Heineken' },
      { sub_scopes: null, expected: 'All' },
    ])(
      'invokes usePowerBookOverviewData with the resolved subScopeFilter ($sub_scopes -> $expected)',
      ({ sub_scopes, expected }) => {
        setPageFilter({ sub_scopes });

        renderWithIntl(<PowerBook />);

        expect(mockUsePowerBookOverviewData).toHaveBeenCalledWith(expected);
      },
    );

    it('renders BigNumbers with the values and the legend in PerformanceTrend', () => {
      renderWithIntl(<PowerBook />);

      expect(screen.getByTestId('power-vs-lq')).toHaveTextContent(
        JSON.stringify(mockPowerVsLq),
      );
      expect(screen.getByTestId('power-vs-ly')).toHaveTextContent(
        JSON.stringify(mockPowerVsLy),
      );
      expect(screen.getByTestId('trend-legend')).toHaveTextContent(
        JSON.stringify(mockLegend),
      );
    });

    it('falls back to empty objects/arrays when overview data is missing', () => {
      setOverviewData({
        bigNumbers: { loading: false, error: null, data: null },
        performanceTrend: { loading: false, error: null, data: {} },
      });

      renderWithIntl(<PowerBook />);

      expect(screen.getByTestId('power-vs-lq')).toHaveTextContent('{}');
      expect(screen.getByTestId('power-vs-ly')).toHaveTextContent('{}');
      expect(screen.getByTestId('trend-legend')).toHaveTextContent('[]');
    });

    it.each([
      {
        section: 'BigNumbers',
        overrides: {
          bigNumbers: {
            loading: true,
            error: new Error('e'),
            data: null,
          },
        },
        loadingTestId: 'big-numbers-loading',
      },
      {
        section: 'PerformanceTrend',
        overrides: {
          performanceTrend: {
            loading: true,
            error: new Error('e'),
            data: {},
          },
        },
        loadingTestId: 'trend-loading',
      },
    ])('forwards loading state to $section', ({ overrides, loadingTestId }) => {
      setOverviewData(overrides);

      renderWithIntl(<PowerBook />);

      expect(screen.getByTestId(loadingTestId)).toBeInTheDocument();
    });
  });

  describe('Conditional rendering of zone-dependent panels', () => {
    it.each([
      {
        label:
          'global zone with applied zone -> ZoneMaturity + CountryContribution',
        applied: { isGlobalZone: true, zone: 'EUR' },
        present: ['zone-maturity', 'country-contribution'],
        absent: ['summary-for-power'],
      },
      {
        label: 'non-global zone with applied zone -> SummaryForPower only',
        applied: { isGlobalZone: false, zone: 'EUR' },
        present: ['summary-for-power'],
        absent: ['zone-maturity', 'country-contribution'],
      },
      {
        label: 'no zone applied -> none of the zone panels',
        applied: { isGlobalZone: true, zone: null },
        present: [],
        absent: ['zone-maturity', 'summary-for-power', 'country-contribution'],
      },
    ])('$label', ({ applied, present, absent }) => {
      setPageFilter(applied);

      renderWithIntl(<PowerBook />);

      present.forEach((id) =>
        expect(screen.getByTestId(id)).toBeInTheDocument(),
      );
      absent.forEach((id) =>
        expect(screen.queryByTestId(id)).not.toBeInTheDocument(),
      );
    });
  });

  describe('AI Summary feature toggle', () => {
    it('queries the toggle by the configured key', () => {
      renderWithIntl(<PowerBook />);

      expect(mockUseFeatureToggle).toHaveBeenCalledWith(
        'ai_summary_brand_power_book',
      );
    });

    it.each([
      { enabled: true, loading: false, expectRender: true },
      { enabled: true, loading: true, expectRender: false },
      { enabled: false, loading: false, expectRender: false },
      { enabled: false, loading: true, expectRender: false },
      { enabled: undefined, loading: false, expectRender: false },
      { enabled: undefined, loading: true, expectRender: false },
    ])(
      'renders=$expectRender when toggle=[enabled=$enabled, loading=$loading]',
      ({ enabled, loading, expectRender }) => {
        mockAiSummaryEnabled = enabled;
        mockIsAiSummaryLoading = loading;

        renderWithIntl(<PowerBook dataTestId="tabpanel-power-book" />);

        const aiSummary = screen.queryByTestId(
          'tabpanel-power-book-ai-summary',
        );
        if (expectRender) {
          expect(aiSummary).toBeInTheDocument();
          expect(aiSummary).toHaveAttribute(
            'data-page-name',
            'portfolio-brand_brand-power-results',
          );
          expect(aiSummary).toHaveAttribute('data-kpi-group', 'power');
        } else {
          expect(aiSummary).not.toBeInTheDocument();
        }
      },
    );

    it('uses a fallback testId when dataTestId prop is not provided', () => {
      mockAiSummaryEnabled = true;
      mockIsAiSummaryLoading = false;

      renderWithIntl(<PowerBook />);

      expect(
        screen.getByTestId('ai-summary-portfolio-brand_brand-power-results'),
      ).toBeInTheDocument();
    });
  });

  describe('Calendar icon in header', () => {
    it('renders the Calendar icon next to the refresh date tag', () => {
      renderWithIntl(<PowerBook />);

      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    });
  });

  describe('dataTestId forwarding to zone panels', () => {
    it('appends -zone-maturity and -country-contribution suffixes when dataTestId is provided in global zone with applied zone', () => {
      setPageFilter({ isGlobalZone: true, zone: 'EUR' });

      renderWithIntl(<PowerBook dataTestId="pb" />);

      expect(screen.getByTestId('pb-zone-maturity')).toBeInTheDocument();
      expect(screen.getByTestId('pb-country-contribution')).toBeInTheDocument();
    });

    it('appends -summary-power suffix when dataTestId is provided in non-global zone with applied zone', () => {
      setPageFilter({ isGlobalZone: false, zone: 'EUR' });

      renderWithIntl(<PowerBook dataTestId="pb" />);

      expect(screen.getByTestId('pb-summary-power')).toBeInTheDocument();
    });
  });
});
