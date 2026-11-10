import { IntlProvider } from 'react-intl';

import { fireEvent, render, screen, within } from '@testing-library/react';
import { useLastDataRefresh } from 'contexts';

import enUS from '../../../../../../i18n/languages/en-US';
import { flattenObject } from '../../../../../../i18n/provider';
import { ResourceAllocation } from './ResourceAllocation';
import { ResourceAllocationData } from './types';

const messages = flattenObject(enUS);

const mockTrackGA = jest.fn();
const mockUseBffData = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUseDataRefreshForTab = jest.fn();
const mockNavigate = jest.fn();
const mockUpdateForm = jest.fn();
const mockApply = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('contexts/DataRefreshModal/useDataRefreshForTab', () => ({
  useDataRefreshForTab: (...args: unknown[]) =>
    mockUseDataRefreshForTab(...args),
}));

const mockGetZoneByCountry = jest.fn();

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getZoneByCountry: mockGetZoneByCountry,
    }),
  },
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: () => mockTrackGA,
  usePageFilterApplied: (...args: unknown[]) =>
    mockUsePageFilterApplied(...args),
  useBffData: (config: unknown) => mockUseBffData(config),
  usePageFilterManagement: () => ({
    updateForm: mockUpdateForm,
    apply: mockApply,
    setPage: jest.fn(),
    loadPageFilters: jest.fn(),
    updateAllForm: jest.fn(),
    resetToDefaults: jest.fn(),
    resetToApplied: jest.fn(),
  }),
  usePageFilterData: () => ({
    dataFilters: {
      country: { values: { APAC: [{ value: 'CHN', label: 'China' }] } },
    },
    pageData: null,
    defaults: {},
    availableFields: [],
    appliedDataFilters: {},
    rawData: {},
  }),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pagesBffSource: { resourceAllocationMedia: true },
    developmentViewer: 'development_viewer',
    pillar: {
      connectionsAndCreativity: {
        submenus: {
          resourceAllocationMedia: {
            id: 'submenu_resource_allocation_media',
            tab: {
              overview: {
                id: 'tab_resource_allocation_media_overview',
                sections: {
                  breakdownTable:
                    'section_resource_allocation_media_overview_breakdown_table',
                  breakdownCharts:
                    'section_resource_allocation_media_overview_breakdown_charts',
                  ranking: 'section_resource_allocation_media_overview_ranking',
                },
              },
              resourceAllocation: {
                id: 'tab_resource_allocation_media_resource_allocation',
              },
              investmentBreakdown: {
                id: 'tab_resource_allocation_media_investment_breakdown',
              },
              mediaDrilldoown: {
                id: 'tab_resource_allocation_media_media_drilldoown',
              },
              campaignDeepDive: {
                id: 'tab_resource_allocation_media_campaign_deep_dive',
              },
            },
          },
        },
      },
      portfolioBrand: {
        submenus: {
          portfolioPerformance: { id: 'submenu_portfolio_performance' },
          brandAnalysis: { id: 'submenu_brand_analysis' },
          brandPowerBook: { id: 'submenu_brand_power_book' },
          brandPowerBookExport: { id: 'submenu_brand_power_book_export' },
          pnl: { id: 'submenu_country_brand_and_portfolio_pl' },
        },
      },
      category: {
        submenus: {
          posBook: { id: 'submenu_pos_book' },
          categoryHealth: { id: 'submenu_category_health' },
        },
      },
      consumer: {
        submenus: {
          audienceTargeting: { id: 'submenu_audience_targeting' },
        },
      },
      innovation: {
        submenus: {
          innovation: { id: 'submenu_innovation' },
        },
      },
      tradeExecution: {
        submenus: {
          beesDistribution: { id: 'submenu_bees_distribution' },
        },
      },
      valueCreation: {
        submenus: {
          commercialResults: { id: 'submenu_commercial_results' },
          growthLeague: { id: 'submenu_growth_league' },
          volumePages: { id: 'submenu_volume_pages' },
        },
      },
    },
  },
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(() => ({
    lastDataRefreshKpisFormated: { media: '2025-01-15' },
    data: null,
    lastDataRefreshKpis: null,
    lastDataRefreshKpisDateMonthYear: null,
    lastDataRefreshKpisDate: null,
    setData: jest.fn(),
  })),
}));

jest.mock('react-chartjs-2', () => ({
  Bar: ({ 'data-testid': dataTestId }: { 'data-testid'?: string }) => (
    <div data-testid={dataTestId ?? 'mocked-chart'} />
  ),
}));

jest.mock('components/Filter/components/CountryFlag/CountryFlag', () => ({
  CountryFlag: ({ dataTestId }: { dataTestId?: string }) => (
    <div
      data-testid={dataTestId ? `country-flag-${dataTestId}` : 'country-flag'}
    />
  ),
}));

jest.mock('components/Form', () => ({
  Select: ({
    value,
    onValueChange,
    dataTestId,
  }: {
    value: string[];
    onValueChange: (next: string[]) => void;
    dataTestId?: string;
  }) => (
    <div
      data-testid={dataTestId ?? 'select'}
      data-value={JSON.stringify(value)}
    >
      <button
        type="button"
        data-testid={
          dataTestId ? `${dataTestId}-set-value` : 'select-set-value'
        }
        onClick={(e) => {
          const raw = e.currentTarget.getAttribute('data-next') ?? '[]';
          onValueChange(JSON.parse(raw));
        }}
      />
    </div>
  ),
}));

const buildKpiContent = (labels: string[]) => ({
  labels,
  datasets: labels.map(() => ({
    label: 'BP',
    data: labels.map(() => 0),
    directions: labels.map(() => ''),
    formattedData: labels.map(() => '0%'),
  })),
  total_allocation: {
    unit: '%',
    value: labels.map(() => [0]),
  },
  caption_country_flag: labels.reduce<
    Record<string, { flag: string; label: string }>
  >((acc, label) => {
    acc[label] = { flag: 'BR', label };
    return acc;
  }, {}),
});

const buildResourceAllocationData = (
  labels: string[],
  filter: Array<{ label: string; value: string }>,
): ResourceAllocationData =>
  ({
    media: { media: buildKpiContent(labels) },
    sponsorship_activation: {
      sponsorship_activation: buildKpiContent(labels),
    },
    non_working_money: { non_working_money: buildKpiContent(labels) },
    filter,
  }) as unknown as ResourceAllocationData;

const renderPage = (props?: { dataTestId?: string }) =>
  render(
    <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
      <ResourceAllocation {...props} />
    </IntlProvider>,
  );

const mockUseLastDataRefresh = jest.mocked(useLastDataRefresh);

beforeEach(() => {
  jest.clearAllMocks();
  mockUseLastDataRefresh.mockReturnValue({
    lastDataRefreshKpisFormated: { media: '2025-01-15' },
    data: null,
    lastDataRefreshKpis: null,
    lastDataRefreshKpisDateMonthYear: null,
    lastDataRefreshKpisDate: null,
    setData: jest.fn(),
  });
  mockUsePageFilterApplied.mockReturnValue({
    isGlobalZone: false,
    applied: { country: 'ARG' },
  });
  mockUseBffData.mockReturnValue({
    data: undefined,
    loading: false,
    error: null,
  });
  mockGetZoneByCountry.mockReturnValue({
    value: 'APAC',
    label: 'Asia Pacific',
  });
});

describe('ResourceAllocation', () => {
  describe('page identity (real i18n)', () => {
    it('renders the section title and description from the real catalog', () => {
      renderPage();

      expect(screen.getByText('Resource Allocation')).toBeInTheDocument();
      expect(
        screen.getByText('Marketing Package Comparison'),
      ).toBeInTheDocument();
    });
  });

  describe('data-refresh integration', () => {
    it('registers the tab name with the data-refresh context', () => {
      renderPage();

      expect(mockUseDataRefreshForTab).toHaveBeenCalledWith(
        'Resource Allocation - Resource Allocation',
      );
    });
  });

  describe('BFF query routing (isGlobalZone)', () => {
    it('queries with view_type "country" when isGlobalZone is false', () => {
      renderPage();

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'connections-and-creativity_resource-allocation-media_resource-allocation_bar-charts-country',
          kpiGroup: 'media',
          subFilters: { kpi_filter: 'BU', view_type: 'country' },
        }),
      );
    });

    it('queries with view_type "global" when isGlobalZone is true', () => {
      mockUsePageFilterApplied.mockReturnValue({
        isGlobalZone: true,
        applied: {},
      });

      renderPage();

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'connections-and-creativity_resource-allocation-media_resource-allocation_bar-charts-country',
          kpiGroup: 'media',
          subFilters: { kpi_filter: 'BU', view_type: 'global' },
        }),
      );
    });
  });

  describe('kpiFilter user interaction', () => {
    it('initializes the radio with the default kpiFilter ("BU")', () => {
      renderPage();

      const buRadio = screen.getByRole('radio', { name: /vs BU/i });
      expect(buRadio).toBeChecked();
    });

    it('refetches with the new subFilter and sends a GA event when the user picks "vs LY"', () => {
      renderPage();

      mockUseBffData.mockClear();

      const lyRadio = screen.getByRole('radio', { name: /vs LY/i });
      fireEvent.click(lyRadio);

      expect(mockUseBffData).toHaveBeenLastCalledWith(
        expect.objectContaining({
          subFilters: expect.objectContaining({ kpi_filter: 'LY' }),
        }),
      );
      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Content',
        event_action: 'Content',
        event_label: 'LY',
      });
    });

    it('does not crash if the GA tracker throws', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockTrackGA.mockImplementation(() => {
        throw new Error('GA Error');
      });

      renderPage();
      fireEvent.click(screen.getByRole('radio', { name: /vs LY/i }));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to track Google Analytics event:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('loading state', () => {
    it('renders the skeleton loader (not the chart) while loading', () => {
      mockUseBffData.mockReturnValue({
        data: undefined,
        loading: true,
        error: null,
      });

      renderPage({ dataTestId: 'ra' });

      expect(
        screen.getByTestId('ra-resource-panel-skeleton'),
      ).toBeInTheDocument();
      expect(screen.queryByTestId('mocked-chart')).not.toBeInTheDocument();
    });
  });

  describe('charts area integration (real ResourcePanel + ChartsArea)', () => {
    it('renders one chart per label that has data', () => {
      mockUseBffData.mockReturnValue({
        data: {
          bar_charts_country: buildResourceAllocationData(
            ['ARG', 'Corona'],
            [{ label: 'Corona', value: 'Corona' }],
          ),
        },
        loading: false,
        error: null,
      });

      renderPage({ dataTestId: 'ra' });

      const chartsArea = screen.getByTestId('ra-resource-panel-charts-area');
      expect(within(chartsArea).getAllByText('ARG')).not.toHaveLength(0);
      expect(within(chartsArea).getAllByText('Corona')).not.toHaveLength(0);
    });
  });

  describe('data-testid propagation through the real tree', () => {
    it('exposes BasicContainer, page-title tooltip and ResourcePanel anchors', () => {
      renderPage({ dataTestId: 'ra' });

      expect(screen.getByTestId('ra')).toBeInTheDocument();
      expect(
        screen.getByTestId('page-title-tooltip-page-title'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('ra-resource-panel')).toBeInTheDocument();
    });
  });

  describe('pinnedLabel orchestration (country view)', () => {
    const countryData = buildResourceAllocationData(
      ['ARG', 'Corona', 'Quilmes', 'Brahma'],
      [
        { label: 'Corona', value: 'Corona' },
        { label: 'Quilmes', value: 'Quilmes' },
        { label: 'Brahma', value: 'Brahma' },
      ],
    );

    beforeEach(() => {
      mockUseBffData.mockReturnValue({
        data: { bar_charts_country: countryData },
        loading: false,
        error: null,
      });
    });

    const triggerComparisonChange = (next: string[]) => {
      const trigger = screen.getByTestId(
        'ra-resource-panel-header-comparison-filter-set-value',
      );
      trigger.setAttribute('data-next', JSON.stringify(next));
      fireEvent.click(trigger);
    };

    it('starts in auto mode — every label coming from the BFF renders a chart', () => {
      renderPage({ dataTestId: 'ra' });

      const chartsArea = screen.getByTestId('ra-resource-panel-charts-area');
      ['ARG', 'Corona', 'Quilmes', 'Brahma'].forEach((label) => {
        expect(within(chartsArea).getAllByText(label)).not.toHaveLength(0);
      });
    });

    it('prepends the country label when the user picks a subset of brands', () => {
      renderPage({ dataTestId: 'ra' });

      triggerComparisonChange(['Corona']);

      const chartsArea = screen.getByTestId('ra-resource-panel-charts-area');
      expect(within(chartsArea).getAllByText('ARG')).not.toHaveLength(0);
      expect(within(chartsArea).getAllByText('Corona')).not.toHaveLength(0);
      expect(within(chartsArea).queryByText('Quilmes')).not.toBeInTheDocument();
      expect(within(chartsArea).queryByText('Brahma')).not.toBeInTheDocument();
    });

    it('keeps the country label visible even when the user clears every brand', () => {
      renderPage({ dataTestId: 'ra' });

      triggerComparisonChange([]);

      const chartsArea = screen.getByTestId('ra-resource-panel-charts-area');
      expect(within(chartsArea).getAllByText('ARG')).not.toHaveLength(0);
      ['Corona', 'Quilmes', 'Brahma'].forEach((brand) => {
        expect(within(chartsArea).queryByText(brand)).not.toBeInTheDocument();
      });
    });

    it('does not duplicate the country label if the user explicitly selects it', () => {
      renderPage({ dataTestId: 'ra' });

      triggerComparisonChange(['ARG', 'Corona']);

      const chartsArea = screen.getByTestId('ra-resource-panel-charts-area');
      expect(within(chartsArea).getAllByText('ARG')).toHaveLength(1);
      expect(within(chartsArea).getAllByText('Corona')).not.toHaveLength(0);
    });
  });

  describe('country click (global zone drill-down)', () => {
    const globalData = buildResourceAllocationData(
      ['Global', 'ARG', 'KOR'],
      [
        { label: 'ARG', value: 'ARG' },
        { label: 'KOR', value: 'KOR' },
      ],
    );

    beforeEach(() => {
      mockUsePageFilterApplied.mockReturnValue({
        isGlobalZone: true,
        applied: { country: 'ABI' },
      });
      mockUseBffData.mockReturnValue({
        data: { bar_charts_country: globalData },
        loading: false,
        error: null,
      });
    });

    it('updates zone first, then country, then applies when a country chart is clicked', () => {
      mockGetZoneByCountry.mockReturnValue({ value: 'LATAM', label: 'LATAM' });
      renderPage({ dataTestId: 'ra' });

      const chartsArea = screen.getByTestId('ra-resource-panel-charts-area');

      const argWrapper = within(chartsArea).getByTestId(
        'ra-resource-panel-charts-area-chart-content-1-interactive-wrapper',
      );
      fireEvent.click(argWrapper);

      expect(mockUpdateForm).toHaveBeenNthCalledWith(1, 'zone', 'LATAM');
      expect(mockUpdateForm).toHaveBeenNthCalledWith(2, 'country', 'ARG');
      expect(mockApply).toHaveBeenCalled();
    });

    it('skips zone update when getZoneByCountry returns null', () => {
      mockGetZoneByCountry.mockReturnValue(null);
      renderPage({ dataTestId: 'ra' });

      const chartsArea = screen.getByTestId('ra-resource-panel-charts-area');
      const argWrapper = within(chartsArea).getByTestId(
        'ra-resource-panel-charts-area-chart-content-1-interactive-wrapper',
      );
      fireEvent.click(argWrapper);

      expect(mockUpdateForm).toHaveBeenCalledTimes(1);
      expect(mockUpdateForm).toHaveBeenCalledWith('country', 'ARG');
      expect(mockApply).toHaveBeenCalled();
    });
  });

  describe('pinnedLabel orchestration (global zone view)', () => {
    const globalData = buildResourceAllocationData(
      ['Global', 'Corona', 'Quilmes'],
      [
        { label: 'Corona', value: 'Corona' },
        { label: 'Quilmes', value: 'Quilmes' },
      ],
    );

    beforeEach(() => {
      mockUsePageFilterApplied.mockReturnValue({
        isGlobalZone: true,
        applied: {},
      });
      mockUseBffData.mockReturnValue({
        data: { bar_charts_country: globalData },
        loading: false,
        error: null,
      });
    });

    const triggerComparisonChange = (next: string[]) => {
      const trigger = screen.getByTestId(
        'ra-resource-panel-header-comparison-filter-set-value',
      );
      trigger.setAttribute('data-next', JSON.stringify(next));
      fireEvent.click(trigger);
    };

    it('prepends the global aggregate label when the user picks a subset of brands', () => {
      renderPage({ dataTestId: 'ra' });

      triggerComparisonChange(['Corona']);

      const chartsArea = screen.getByTestId('ra-resource-panel-charts-area');
      expect(within(chartsArea).getAllByText('Global')).not.toHaveLength(0);
      expect(within(chartsArea).getAllByText('Corona')).not.toHaveLength(0);
      expect(within(chartsArea).queryByText('Quilmes')).not.toBeInTheDocument();
    });
  });
});
