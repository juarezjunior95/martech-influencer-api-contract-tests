import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { VolumePagesKpiProvider } from 'pages/pillars/ValueCreation/VolumePages/contexts';

import { COUNTRIES } from '../../../tabs/Global/constants';
import { CountrySlide } from './CountrySlide';
import type { CountrySlideProps } from './types';

const usaConfig = COUNTRIES.USA;

const intlMessages = {
  'ValueCreation.PRPages.volume': 'Volume',
  'ValueCreation.VolumePages.countryMarketTitle': '{countryName} {kpiLabel}',
  'ValueCreation.VolumePages.countryMarketBrandsBreakdownTitle':
    '{countryName} {kpiLabel} Brands Breakdown',
};

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="en" messages={intlMessages}>
    <VolumePagesKpiProvider kpi="volume">{children}</VolumePagesKpiProvider>
  </IntlProvider>
);

const customRender = (ui: React.ReactElement) =>
  render(ui, { wrapper: AllProviders });

jest.mock('components', () => ({
  Cover: ({
    category,
    name,
    countries,
    centerLogo,
    showLogo,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId ?? 'cover'}>
      <span data-testid="cover-category">{category}</span>
      <span data-testid="cover-name">{name}</span>
      <span data-testid="cover-countries">{JSON.stringify(countries)}</span>
      <span data-testid="cover-center-logo">{String(centerLogo)}</span>
      <span data-testid="cover-show-logo">{String(showLogo)}</span>
    </div>
  ),
  TemplateSlide: ({
    title,
    measure,
    period,
    footnotes,
    page,
    countryId,
    headerDivider,
    dataTestId,
    children,
  }: any) => (
    <div data-testid={dataTestId ?? 'template-slide'}>
      <span data-testid="template-title">{title}</span>
      <span data-testid="template-measure">{measure}</span>
      <span data-testid="template-period">{period}</span>
      <span data-testid="template-footnotes">{footnotes}</span>
      <span data-testid="template-page">{String(page)}</span>
      <span data-testid="template-country-id">{countryId}</span>
      <span data-testid="template-header-divider">{String(headerDivider)}</span>
      {children}
    </div>
  ),
}));

jest.mock('pages/components/ValueCreation/Slides/SlideContent', () => ({
  SlideContent: ({ data, dataTestId }: any) => (
    <div data-testid={dataTestId ?? 'slide-content'}>
      <span data-testid="slide-content-data">{JSON.stringify(data)}</span>
    </div>
  ),
}));

jest.mock(
  'pages/components/ValueCreation/Slides/TopBottomWaterfallSlideContent',
  () => ({
    TopBottomWaterfallSlideContent: ({
      loading,
      error,
      data,
      dataTestId,
    }: any) => (
      <div data-testid={dataTestId ?? 'bar-chart-slide-content'}>
        <span data-testid="bar-loading">{String(loading)}</span>
        <span data-testid="bar-error">{String(!!error)}</span>
        <span data-testid="bar-data">{JSON.stringify(data)}</span>
      </div>
    ),
  }),
);

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportPageSection: ({
    children,
    'data-page-name': dataPageName,
    'data-testid': dataTestId,
  }: any) => (
    <section
      data-page-name={dataPageName}
      data-testid={dataTestId ?? 'export-section'}
    >
      {children}
    </section>
  ),
}));

describe('CountrySlide', () => {
  const mockGetPageByName = jest.fn((name: string) =>
    name.includes('volume') ? { index: 1 } : { index: 2 },
  );

  const defaultCountryData = {
    data: {
      'big-numbers': [],
      'line-chart': { labels: [], datasets: [], period: 'YTD', legend: [] },
      portfolio: { header: [], rows: [] },
      'growth-levers': { header: [], rows: [] },
      'brands-volume-MTD': { labels: [], datasets: [] },
      'brands-volume-YTD': { labels: [], datasets: [] },
    },
    loading: false,
    error: null,
    refetch: jest.fn().mockResolvedValue(undefined),
  };

  const defaultProps: CountrySlideProps = {
    countryCode: 'USA',
    config: usaConfig,
    countryData: defaultCountryData,
    period: "JAN'25",
    getPageByName: mockGetPageByName,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render two export sections (slide and bar chart)', () => {
      customRender(<CountrySlide {...defaultProps} />);

      const sections = document.querySelectorAll('[data-page-name]');
      expect(sections).toHaveLength(2);
      expect(sections[0]).toHaveAttribute('data-page-name', usaConfig.section);
      expect(sections[1]).toHaveAttribute(
        'data-page-name',
        usaConfig.barChartSection,
      );
    });

    it('should render two TemplateSlides with correct title and measure', () => {
      customRender(<CountrySlide {...defaultProps} />);

      const titles = screen.getAllByTestId('template-title');
      expect(titles).toHaveLength(2);
      expect(titles[0]).toHaveTextContent(`${usaConfig.countryName} Volume`);
      expect(titles[1]).toHaveTextContent(
        `${usaConfig.countryName} Volume Brands Breakdown`,
      );
      expect(screen.getAllByTestId('template-measure')[0]).toHaveTextContent(
        '[k hl]',
      );
    });

    it('should render SlideContent and TopBottomWaterfallSlideContent', () => {
      customRender(<CountrySlide {...defaultProps} />);

      expect(screen.getByTestId('slide-content')).toBeInTheDocument();
      expect(screen.getByTestId(usaConfig.barChartSection)).toBeInTheDocument();
    });
  });

  describe('Data and Props', () => {
    it('should pass countryData to SlideContent (bigNumbersKpiData, lineChartKpiData, portfolioTableKpiData, prioritiesTableKpiData)', () => {
      customRender(<CountrySlide {...defaultProps} />);

      const slideDataEl = screen.getByTestId('slide-content-data');
      expect(slideDataEl.textContent).toContain('bigNumbersKpiData');
      expect(slideDataEl.textContent).toContain('lineChartKpiData');
      expect(slideDataEl.textContent).toContain('portfolioTableKpiData');
      expect(slideDataEl.textContent).toContain('prioritiesTableKpiData');
    });

    it('should pass countryData to TopBottomWaterfallSlideContent (topKpiData, bottomKpiData)', () => {
      customRender(<CountrySlide {...defaultProps} />);

      const barDataEl = screen.getByTestId('bar-data');
      expect(barDataEl.textContent).toContain('topKpiData');
      expect(barDataEl.textContent).toContain('bottomKpiData');
    });

    it('should pass loading and error to TopBottomWaterfallSlideContent', () => {
      customRender(
        <CountrySlide
          {...defaultProps}
          countryData={{
            ...defaultCountryData,
            loading: true,
            error: new Error('Test error'),
            refetch: jest.fn().mockResolvedValue(undefined),
          }}
        />,
      );

      expect(screen.getByTestId('bar-loading')).toHaveTextContent('true');
      expect(screen.getByTestId('bar-error')).toHaveTextContent('true');
    });

    it('should call getPageByName with section and barChartSection names', () => {
      customRender(<CountrySlide {...defaultProps} />);

      expect(mockGetPageByName).toHaveBeenCalledWith(usaConfig.section);
      expect(mockGetPageByName).toHaveBeenCalledWith(usaConfig.barChartSection);
    });

    it('should pass period to both TemplateSlides', () => {
      customRender(<CountrySlide {...defaultProps} period="MAR'25" />);

      const periods = screen.getAllByTestId('template-period');
      expect(periods[0]).toHaveTextContent("MAR'25");
      expect(periods[1]).toHaveTextContent("MAR'25");
    });
  });

  describe('dataTestId', () => {
    it('should apply dataTestId to section and template when provided', () => {
      customRender(<CountrySlide {...defaultProps} dataTestId="key-markets" />);

      // section id is used on StyledExportPageSection and TemplateSlide
      expect(
        screen.getAllByTestId(`key-markets-${usaConfig.section}`).length,
      ).toBeGreaterThan(0);
      // barChartSection id is used on section, TemplateSlide and TopBottomWaterfallSlideContent
      const barChartTestId = `key-markets-${usaConfig.barChartSection}`;
      expect(screen.getAllByTestId(barChartTestId).length).toBeGreaterThan(0);
    });

    it('should pass dataTestId to SlideContent and TopBottomWaterfallSlideContent', () => {
      customRender(<CountrySlide {...defaultProps} dataTestId="key-markets" />);

      expect(
        screen.getByTestId('key-markets-country-slide'),
      ).toBeInTheDocument();
      // barChartSection dataTestId is used on section, TemplateSlide and TopBottomWaterfallSlideContent
      const barChartElements = screen.getAllByTestId(
        `key-markets-${usaConfig.barChartSection}`,
      );
      expect(barChartElements.length).toBeGreaterThan(0);
    });
  });

  describe('Config variations', () => {
    it('should render with different country config (BRA)', () => {
      const braConfig = COUNTRIES.BRA;
      customRender(
        <CountrySlide {...defaultProps} countryCode="BRA" config={braConfig} />,
      );

      const sections = document.querySelectorAll('[data-page-name]');
      expect(sections[0]).toHaveAttribute('data-page-name', braConfig.section);
      expect(sections[1]).toHaveAttribute(
        'data-page-name',
        braConfig.barChartSection,
      );
    });

    it('should render section and barChartSection', () => {
      customRender(<CountrySlide {...defaultProps} />);

      const firstSection = document.querySelector('[data-page-name]');
      expect(firstSection).toHaveAttribute('data-page-name', usaConfig.section);
    });
  });

  describe('Edge cases', () => {
    it('should handle countryData with undefined data', () => {
      customRender(
        <CountrySlide
          {...defaultProps}
          countryData={{
            data: undefined,
            loading: false,
            error: null,
            refetch: jest.fn().mockResolvedValue(undefined),
          }}
        />,
      );

      expect(screen.getByTestId('slide-content')).toBeInTheDocument();
      expect(screen.getByTestId(usaConfig.barChartSection)).toBeInTheDocument();
    });

    it('should pass headerDivider false to TemplateSlide', () => {
      customRender(<CountrySlide {...defaultProps} />);

      const headerDividers = screen.getAllByTestId('template-header-divider');
      expect(headerDividers[0]).toHaveTextContent('false');
      expect(headerDividers[1]).toHaveTextContent('false');
    });

    it('should pass correct footnotes to bar chart TemplateSlide', () => {
      customRender(<CountrySlide {...defaultProps} />);
      const footnotes = screen.getAllByTestId('template-footnotes');
      expect(footnotes[1]).toHaveTextContent(
        'Brands are ordered by Portfolio Classification, then ranked by vol. size. Product Type filtered by Beer + ADJ.',
      );
    });
  });
});
