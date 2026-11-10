import '@testing-library/jest-dom';
import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { VolumePagesCountryPpr } from './VolumePagesCountryPpr';

const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterData = jest.fn();
const mockUsePageFilterStatus = jest.fn();
const mockUsePageIndexes = jest.fn();
const mockUseExportPdf = jest.fn();
const mockOnExport = jest.fn();
const mockUseLastDataRefresh = jest.fn();
const mockGetCountry = jest.fn();
const mockGetZone = jest.fn();
const mockBuildFilterQueryString = jest.fn();
const mockFormatDateToQuarterYear = jest.fn();
const mockGetViewtype = jest.fn();

const mockBrandPowerSpy = jest.fn();
const mockPortfolioPerformanceSpy = jest.fn();
const mockParticipationSpy = jest.fn();

const mockExportSectionSpies = {
  sustainableGrowthOverview: jest.fn(),
  participation: jest.fn(),
  brandPower: jest.fn(),
  volume: jest.fn(),
  countryFinancial: jest.fn(),
  portfolioPerformance: jest.fn(),
  sustainableGrowthByLever: jest.fn(),
  pnl: jest.fn(),
  resourceAllocation: jest.fn(),
};

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id ?? '',
  }),
}));

jest.mock('components', () => ({
  Cover: ({ link, period }: { link?: string; period: string }) => (
    <div data-testid="cover" data-link={link ?? ''} data-period={period} />
  ),
  StickyScrollWithFilters: ({
    filter,
  }: {
    filter: { pageName: string; dataTestId: string };
  }) => (
    <div data-testid="sticky-scroll" data-page-name={filter.pageName}>
      {filter.dataTestId}
    </div>
  ),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getCountry: (...args: unknown[]) => mockGetCountry(...args),
      getZone: (...args: unknown[]) => mockGetZone(...args),
    }),
  },
  FilterRegistry: {
    buildFilterQueryString: (...args: unknown[]) =>
      mockBuildFilterQueryString(...args),
  },
}));

jest.mock('hooks', () => ({
  useExportPdf: (...args: unknown[]) => mockUseExportPdf(...args),
  usePageFilterApplied: (...args: unknown[]) =>
    mockUsePageFilterApplied(...args),
  usePageFilterData: (...args: unknown[]) => mockUsePageFilterData(...args),
  usePageFilterStatus: (...args: unknown[]) => mockUsePageFilterStatus(...args),
  usePageIndexes: (...args: unknown[]) => mockUsePageIndexes(...args),
}));

jest.mock('pages/constants', () => ({
  PDF_DEFAULT_CONFIG: { orientation: 'landscape' },
}));

jest.mock('pages/enums', () => ({
  SharedKpis: {
    POWER_BOOK_INSIGHTS: { id: 'powerBookInsights' },
  },
}));

jest.mock('shared/Styles', () => ({
  StyledGridContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="grid-container">{children}</div>
  ),
  StyledGridItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="grid-item">{children}</div>
  ),
}));

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportButton: ({
    onClick,
    isLoading,
    children,
  }: {
    onClick: () => void;
    isLoading: boolean;
    children: React.ReactNode;
  }) => (
    <button
      data-testid="export-button"
      data-loading={String(isLoading)}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  StyledExportIcon: () => <span data-testid="export-icon" />,
  StyledExportPageContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="export-page-content">{children}</div>
  ),
  StyledExportPageHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="export-page-header">{children}</div>
  ),
  StyledExportPageSection: ({
    children,
    'data-page-name': dataPageName,
  }: {
    children: React.ReactNode;
    'data-page-name'?: string;
  }) => (
    <section data-page-name={dataPageName} data-testid="export-page-section">
      {children}
    </section>
  ),
}));

jest.mock('utils/filter', () => ({
  getViewtype: (...args: unknown[]) => mockGetViewtype(...args),
}));

jest.mock('utils/format', () => ({
  formatDateToQuarterYear: (...args: unknown[]) =>
    mockFormatDateToQuarterYear(...args),
}));

jest.mock('./components/VolumePprExportSections', () => ({
  VolumePprBrandPowerExportSections: (props: unknown) => {
    mockExportSectionSpies.brandPower(props);
    return <div data-testid="ex-brand-power" />;
  },
  VolumePprCountryFinancialExportSections: (props: unknown) => {
    mockExportSectionSpies.countryFinancial(props);
    return <div data-testid="ex-country-financial" />;
  },
  VolumePprParticipationExportSections: (props: unknown) => {
    mockExportSectionSpies.participation(props);
    return <div data-testid="ex-participation" />;
  },
  VolumePprPnlExportSections: (props: unknown) => {
    mockExportSectionSpies.pnl(props);
    return <div data-testid="ex-pnl" />;
  },
  VolumePprPortfolioPerformanceExportSection: (props: unknown) => {
    mockExportSectionSpies.portfolioPerformance(props);
    return <div data-testid="ex-portfolio-performance" />;
  },
  VolumePprResourceAllocationExportSection: (props: unknown) => {
    mockExportSectionSpies.resourceAllocation(props);
    return <div data-testid="ex-resource-allocation" />;
  },
  VolumePprSustainableGrowthByLeverExportList: (props: unknown) => {
    mockExportSectionSpies.sustainableGrowthByLever(props);
    return <div data-testid="ex-sgl-by-lever" />;
  },
  VolumePprSustainableGrowthOverviewExportSection: (props: unknown) => {
    mockExportSectionSpies.sustainableGrowthOverview(props);
    return <div data-testid="ex-sg-overview" />;
  },
  VolumePprVolumeExportSections: (props: unknown) => {
    mockExportSectionSpies.volume(props);
    return <div data-testid="ex-volume" />;
  },
}));

const mockIdleHookResult = {
  sectionLoading: false,
  loading: false,
  countryData: { data: undefined },
  breakdownSegmentsData: {},
  overviewLoading: false,
  rankingLoading: false,
};

jest.mock('./hooks', () => ({
  useSustainableGrowthOverviewSlidesByGrowthLever: jest.fn(() => ({
    slides: [],
    anyLoading: false,
  })),
  useVolumePprBrandPowerSlidesData: () => {
    const value = {
      sectionLoading: false,
      countryData: {
        data: {
          powerBookInsights: {
            insights: {
              evolution: {
                BR: {
                  insights: ['evo-1', 'evo-2'],
                  Megabrands: { insights: 'mega-insight' },
                },
              },
              brands: {
                BR: {
                  ABI: { insights: ['abi-insight'] },
                  Competitor: { insights: 'competitor-only-string' },
                },
              },
            },
          },
        },
      },
      breakdownSegmentsData: {},
    };
    mockBrandPowerSpy(value);
    return value;
  },
  useVolumePprExportPageLoading: ({
    sustainableGrowthOverview,
    participation,
  }: {
    sustainableGrowthOverview: boolean;
    participation: boolean;
  }) => Boolean(sustainableGrowthOverview || participation),
  useVolumePprMarketShareSlidesData: () => mockIdleHookResult,
  useVolumePprNetRevenueSlidesData: () => mockIdleHookResult,
  useVolumePprParticipationSlidesData: () => {
    const value = { sectionLoading: false };
    mockParticipationSpy(value);
    return value;
  },
  useVolumePprPnlBrandsSlidesData: () => mockIdleHookResult,
  useVolumePprPortfolioPerformanceSlideData: () => {
    const value = { sectionLoading: false, portfolioPerformanceSlideData: {} };
    mockPortfolioPerformanceSpy(value);
    return value;
  },
  useVolumePprResourceAllocationOverview: () => ({
    overviewLoading: false,
    rankingLoading: false,
  }),
  useVolumePprSustainableGrowthOverviewExportData: () => ({
    loading: false,
  }),
  useVolumePprVolumeSlidesData: () => mockIdleHookResult,
}));

function setupDefaultMocks(): void {
  mockUsePageFilterApplied.mockReturnValue({
    applied: {
      zone: 'NAZ',
      country: 'BR',
      periods: 'YTD',
    },
    isGlobalZone: false,
  });
  mockUsePageFilterData.mockReturnValue({
    dataFilters: { countries: [{ value: 'BR' }] },
  });
  mockUsePageFilterStatus.mockReturnValue({ isLoaded: true });
  mockUsePageIndexes.mockReturnValue({
    getPageByName: () => ({ index: 0 }),
  });
  mockUseLastDataRefresh.mockReturnValue({
    lastDataRefreshKpisDate: { power: '2024-06-30', pos: '2024-06-15' },
    lastDataRefreshKpisDateMonthYear: {
      finance: '2024-06-15',
      pos: '2024-06-15',
      market_share: '2024-05-31',
      power: '2024-04-30',
    },
  });
  mockGetCountry.mockReturnValue({ value: 'BR', label: 'Brazil' });
  mockGetZone.mockReturnValue({ value: 'NAZ', label: 'North America' });
  mockBuildFilterQueryString.mockReturnValue('zone=NAZ&country=BR');
  mockFormatDateToQuarterYear.mockReturnValue('Q2 2024');
  mockGetViewtype.mockReturnValue('country');
  mockUseExportPdf.mockReturnValue({ onExport: mockOnExport });
  mockOnExport.mockResolvedValue(undefined);
}

describe('VolumePagesCountryPpr', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDefaultMocks();
  });

  it('renders the sticky filters with the page name and the export header', () => {
    render(<VolumePagesCountryPpr />);

    expect(screen.getByTestId('sticky-scroll')).toHaveAttribute(
      'data-page-name',
      'value-creation_country-ppr',
    );
    expect(screen.getByTestId('export-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('export-button')).toHaveTextContent(
      'Export File',
    );
  });

  it('builds countryCoverLink using FilterRegistry with the applied zone and country', () => {
    render(<VolumePagesCountryPpr />);

    expect(mockBuildFilterQueryString).toHaveBeenCalledWith({
      zone: 'NAZ',
      country: 'BR',
    });
    expect(screen.getByTestId('cover')).toHaveAttribute(
      'data-link',
      '/value-creation?zone=NAZ&country=BR',
    );
  });

  it('omits the cover link when no country is applied (countryCoverLink=undefined)', () => {
    mockGetCountry.mockReturnValue(undefined);

    render(<VolumePagesCountryPpr />);

    expect(screen.getByTestId('cover')).toHaveAttribute('data-link', '');
    expect(mockBuildFilterQueryString).not.toHaveBeenCalled();
  });

  it('formats the cover period using formatDateToQuarterYear and uppercases the result', () => {
    render(<VolumePagesCountryPpr />);

    expect(mockFormatDateToQuarterYear).toHaveBeenCalledWith(
      '2024-06-30',
      ' ',
      0,
    );
    expect(screen.getByTestId('cover')).toHaveAttribute(
      'data-period',
      'Q2 2024 YTD',
    );
  });

  it('flattens evolution insights (array + Megabrands string) for the brand power export section', () => {
    render(<VolumePagesCountryPpr />);

    const props = mockExportSectionSpies.brandPower.mock.calls.at(-1)?.[0] as {
      evolutionAlerts: string[];
      abiBrandInsights: string[];
      competitorBrandInsights: string[];
    };

    expect(props.evolutionAlerts).toEqual(['evo-1', 'evo-2', 'mega-insight']);
    expect(props.abiBrandInsights).toEqual(['abi-insight']);
    expect(props.competitorBrandInsights).toEqual(['competitor-only-string']);
  });

  it('returns an empty insights array when no insights are available for the current country', () => {
    mockGetCountry.mockReturnValue({ value: 'AR', label: 'Argentina' });

    render(<VolumePagesCountryPpr />);

    const props = mockExportSectionSpies.brandPower.mock.calls.at(-1)?.[0] as {
      evolutionAlerts: string[];
      abiBrandInsights: string[];
      competitorBrandInsights: string[];
    };

    expect(props.evolutionAlerts).toEqual([]);
    expect(props.abiBrandInsights).toEqual([]);
    expect(props.competitorBrandInsights).toEqual([]);
  });

  it("formats the period tag (e.g. Q2'24) from formatDateToQuarterYear output and forwards it to export sections", () => {
    render(<VolumePagesCountryPpr />);

    const sgOverviewProps =
      mockExportSectionSpies.sustainableGrowthOverview.mock.calls.at(
        -1,
      )?.[0] as { period: string };
    const pnlProps = mockExportSectionSpies.pnl.mock.calls.at(-1)?.[0] as {
      period: string;
    };

    expect(sgOverviewProps.period).toBe("Q2'24");
    expect(pnlProps.period).toBe("Q2'24");
  });

  it('renders an empty formatted period tag when formatDateToQuarterYear returns a malformed value', () => {
    mockFormatDateToQuarterYear.mockReturnValue('');

    render(<VolumePagesCountryPpr />);

    const sgOverviewProps =
      mockExportSectionSpies.sustainableGrowthOverview.mock.calls.at(
        -1,
      )?.[0] as { period: string };

    expect(sgOverviewProps.period).toBe('');
  });

  it('marks the export button as loading while exporting and triggers onExport with the page sections', async () => {
    const sectionEl = document.createElement('section');
    sectionEl.setAttribute('data-page-name', 'cover');
    document.body.appendChild(sectionEl);

    render(<VolumePagesCountryPpr />);

    expect(screen.getByTestId('export-button')).toHaveAttribute(
      'data-loading',
      'false',
    );

    fireEvent.click(screen.getByTestId('export-button'));

    await waitFor(() => {
      expect(mockOnExport).toHaveBeenCalledTimes(1);
    });

    const calledWith = mockOnExport.mock.calls[0][0] as HTMLElement[];
    expect(Array.isArray(calledWith)).toBe(true);
    expect(calledWith.every((el) => el instanceof HTMLElement)).toBe(true);

    document.body.removeChild(sectionEl);
  });

  it('configures useExportPdf with a filename containing the uppercased quarter/year', () => {
    render(<VolumePagesCountryPpr />);

    const config = mockUseExportPdf.mock.calls.at(-1)?.[0] as {
      filename: string;
      orientation: string;
    };

    expect(config.filename).toBe('Value Creation - PPR Preread - Q2 2024 YTD');
    expect(config.orientation).toBe('landscape');
  });
});
