import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { CountryView } from './Country';

const mockUsePageFilterData = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUsePageIndexes = jest.fn();
const mockUseLastDataRefresh = jest.fn();
const mockGetCountry = jest.fn();
const mockUsePowerBookCountryData = jest.fn();

const mockEvolutionSlide = jest.fn();
const mockCountrySlide = jest.fn();
const mockTemplateSlide = jest.fn();

jest.mock('hooks', () => ({
  usePageFilterData: () => mockUsePageFilterData(),
  usePageFilterApplied: () => mockUsePageFilterApplied(),
  usePageIndexes: () => mockUsePageIndexes(),
}));

jest.mock('contexts', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: () => ({ getCountry: mockGetCountry }),
  },
}));

jest.mock(
  '../../../hooks/usePowerBookCountryData/usePowerBookCountryData',
  () => ({
    usePowerBookCountryData: () => mockUsePowerBookCountryData(),
  }),
);

jest.mock('components', () => ({
  TemplateSlide: ({ children, ...props }: any) => {
    mockTemplateSlide(props);
    return (
      <div
        data-testid={`template-${props.dataTestId}`}
        data-title={props.title}
      >
        {props.footnotes !== undefined && (
          <div data-testid={`footnotes-${props.dataTestId}`}>
            {props.footnotes}
          </div>
        )}
        {children}
      </div>
    );
  },
}));

jest.mock('pages/components/PortfolioBrand/Slides', () => ({
  CountrySlide: (props: any) => {
    mockCountrySlide(props);
    return <div data-testid={props.dataTestId} />;
  },
  EvolutionSlide: (props: any) => {
    mockEvolutionSlide(props);
    return <div data-testid={props.dataTestId} />;
  },
}));

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportPageSection: ({ children, ...rest }: any) => (
    <div {...rest}>{children}</div>
  ),
}));

jest.mock('../../../BrandPowerBookExport', () => ({
  BRAND_POWER_BOOK_EXPORT_PAGE_NAME:
    'portfolio-brand_brand-power-results-export',
}));

jest.mock('../../../BrandPowerBookExport.styles', () => ({
  StyledContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('utils/format', () => ({
  formatDateToQuarterYear: (date: Date) => `Q1 ${date.getFullYear()}`,
}));

const defaultCountry = { value: 'USA', label: 'United States' };

const buildData = () => ({
  ttABI: {
    data: {
      yearPowerVsAc: { empty: false, variationCaptions: [{ a: 1 }] },
      trendOverTime: { empty: false, variationCaptions: [{ b: 2 }] },
    },
    loading: false,
    error: null,
    refetch: jest.fn(),
  },
  ttABIMegabrands: {
    data: {
      yearPowerVsAc: { empty: false, variationCaptions: [{ x: 1 }] },
      trendOverTime: { empty: false, variationCaptions: [{ y: 2 }] },
    },
    loading: false,
    error: null,
    refetch: jest.fn(),
  },
  ABIBrandBreakdown: {
    data: { brandBreakdown: { table: 'abi' } },
    loading: false,
    error: null,
    refetch: jest.fn(),
  },
  power: {
    data: {
      summaryPowerByPortfolioPerformance: { id: 'portfolio' },
      summaryPowerBySegmentPerformance: { id: 'segment' },
    },
    loading: false,
    error: null,
    refetch: jest.fn(),
  },
  CompetitorBrandBreakdown: {
    data: { brandBreakdown: { table: 'competitor' } },
    loading: false,
    error: null,
    refetch: jest.fn(),
  },
});

const renderView = (loadingCallback = jest.fn()) =>
  render(
    <CountryView
      containerRef={{ current: document.createElement('div') }}
      loadingCallback={loadingCallback}
    />,
  );

beforeEach(() => {
  jest.clearAllMocks();

  mockUsePageFilterData.mockReturnValue({
    dataFilters: { countries: { default: defaultCountry } },
  });
  mockUsePageFilterApplied.mockReturnValue({ applied: { country: 'USA' } });
  mockUsePageIndexes.mockReturnValue({
    getPageByName: jest.fn(() => ({ index: 1 })),
    updateIndexes: jest.fn(),
  });
  mockUseLastDataRefresh.mockReturnValue({
    lastDataRefreshKpisDate: { power: new Date('2024-01-01') },
  });
  mockGetCountry.mockReturnValue(defaultCountry);
  mockUsePowerBookCountryData.mockReturnValue({
    data: buildData(),
    isLoadingCountryData: false,
  });
});

describe('CountryView', () => {
  it('renders one EvolutionSlide and two CountrySlides (ABI + Competitor)', () => {
    renderView();

    expect(screen.getByTestId('slide-evolution-country')).toBeInTheDocument();
    expect(screen.getByTestId('slide-country-abi')).toBeInTheDocument();
    expect(screen.getByTestId('slide-country-competitor')).toBeInTheDocument();
  });

  it('passes two evolution slide infos (TT ABI + Megabrands) with correct titles', () => {
    renderView();

    const props = mockEvolutionSlide.mock.calls[0][0];
    expect(props.evolutionSlideInfos).toHaveLength(2);
    expect(props.evolutionSlideInfos[0].firstChartTitle).toBe('TT ABI Power');
    expect(props.evolutionSlideInfos[1].firstChartTitle).toBe(
      'TT ABI Megabrands Power',
    );
    expect(props.evolutionSlideInfos[1].portfolioType).toBe('megabrands');
  });

  it('rewrites Megabrands variation captions to use "MB Relevance" as title', () => {
    renderView();

    const props = mockEvolutionSlide.mock.calls[0][0];
    const variationCaptions =
      props.evolutionSlideInfos[1].firstChartData.variationCaptions;

    expect(variationCaptions).toEqual([
      expect.objectContaining({ title: 'MB Relevance' }),
    ]);
  });

  it.each([
    ['ABI', 'slide-country-abi', false, 'ABI Power'],
    ['Competitor', 'slide-country-competitor', true, 'Competitor Power'],
  ])(
    'forwards %s breakdown data to the matching CountrySlide',
    (_label, dataTestId, expectedCompetitor, titlePower) => {
      renderView();

      const call = mockCountrySlide.mock.calls.find(
        ([p]) => p.dataTestId === dataTestId,
      );
      expect(call).toBeDefined();
      const props = call?.[0];
      expect(props.titlePower).toBe(titlePower);
      expect(Boolean(props.competitorView)).toBe(expectedCompetitor);
    },
  );

  it('uses the country label in the slide titles', () => {
    mockGetCountry.mockReturnValue({ value: 'BRA', label: 'Brazil' });

    renderView();

    expect(
      mockTemplateSlide.mock.calls.some(([p]) =>
        (p.title as string).includes('Brazil'),
      ),
    ).toBe(true);
  });

  it('renders a DOM-specific footnote only for Dominican Republic', () => {
    mockUsePageFilterApplied.mockReturnValue({ applied: { country: 'DOM' } });

    renderView();

    const call = mockTemplateSlide.mock.calls.find(
      ([p]) => p.dataTestId === 'country-trends',
    );
    expect(call).toBeDefined();
    expect(call?.[0].footnotes).not.toBeUndefined();
  });

  it('omits the DOM-specific footnote for any other country', () => {
    renderView();

    const call = mockTemplateSlide.mock.calls.find(
      ([p]) => p.dataTestId === 'country-trends',
    );
    expect(call?.[0].footnotes).toBeUndefined();
  });

  it.each([
    ['loading', true, { country: true, global: false }],
    ['idle', false, { country: false, global: true }],
  ])(
    'invokes loadingCallback correctly when country data is %s',
    (_label, isLoadingCountryData, expected) => {
      mockUsePowerBookCountryData.mockReturnValue({
        data: buildData(),
        isLoadingCountryData,
      });
      const cb = jest.fn();

      renderView(cb);

      expect(cb).toHaveBeenCalledWith(expected);
    },
  );
});
