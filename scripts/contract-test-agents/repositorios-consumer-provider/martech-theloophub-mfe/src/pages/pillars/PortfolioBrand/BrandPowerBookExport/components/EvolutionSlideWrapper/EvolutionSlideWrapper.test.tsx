import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { EvolutionSlideWrapper } from './EvolutionSlideWrapper';

const mockEvolutionSlide = jest.fn();
const mockTemplateSlide = jest.fn();

jest.mock('pages/components/PortfolioBrand/Slides', () => ({
  EvolutionSlide: (props: any) => {
    mockEvolutionSlide(props);
    return <div data-testid="evolution-slide" />;
  },
}));

jest.mock('components', () => ({
  TemplateSlide: ({ children, ...rest }: any) => {
    mockTemplateSlide(rest);
    return (
      <div data-testid="template-slide" data-test-id={rest.dataTestId}>
        {children}
      </div>
    );
  },
}));

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportPageSection: ({ children, ...props }: any) => (
    <div data-testid="export-page-section" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('../../BrandPowerBookExport.styles', () => ({
  StyledContent: ({ children }: any) => <div>{children}</div>,
}));

const baseData = {
  'year-power-vs-ac': { id: 'first-chart' },
  'trend-over-time': { id: 'second-chart' },
  empty: false,
} as any;

const defaultProps = {
  section: 'total-abi-power-evolution',
  title: 'Total ABI Power Evolution',
  period: "Q4'25",
  pageIndex: 1,
  data: baseData,
  loading: false,
  error: null,
};

const renderWrapper = (
  props: Partial<typeof defaultProps> & { portfolioType?: any } = {},
) => render(<EvolutionSlideWrapper {...defaultProps} {...props} />);

const lastEvolutionSlideProps = () =>
  mockEvolutionSlide.mock.calls[mockEvolutionSlide.mock.calls.length - 1][0];

const lastTemplateSlideProps = () =>
  mockTemplateSlide.mock.calls[mockTemplateSlide.mock.calls.length - 1][0];

describe('EvolutionSlideWrapper', () => {
  beforeEach(() => {
    mockEvolutionSlide.mockClear();
    mockTemplateSlide.mockClear();
  });

  it('renders inside a section tagged with the page-name', () => {
    renderWrapper();

    expect(screen.getByTestId('export-page-section')).toHaveAttribute(
      'data-page-name',
      defaultProps.section,
    );
  });

  it('forwards the section as dataTestId and page index to TemplateSlide', () => {
    renderWrapper();

    expect(lastTemplateSlideProps()).toEqual(
      expect.objectContaining({
        dataTestId: defaultProps.section,
        page: defaultProps.pageIndex,
        title: defaultProps.title,
        period: defaultProps.period,
        countryId: 'ABI',
      }),
    );
  });

  it.each([
    ['Total ABI Power Evolution', 'TT Total Power'],
    ['Megabrands Power Evolution', 'TT Megabrands Power'],
    ['Heineken Trend', 'TT Heineken Power'],
  ])(
    'derives the first chart title from the first word of "%s"',
    (title, expected) => {
      renderWrapper({ title });

      const slideInfo = lastEvolutionSlideProps().evolutionSlideInfos[0];
      expect(slideInfo.firstChartTitle).toBe(expected);
    },
  );

  it('builds the second chart title from the full title', () => {
    renderWrapper({ title: 'Megabrands Power Evolution' });

    const slideInfo = lastEvolutionSlideProps().evolutionSlideInfos[0];
    expect(slideInfo.secondChartTitle).toBe(
      'Megabrands Power Evolution Trend - 30 Countries, 96% NR',
    );
  });

  it('forwards data slots, loading and error to EvolutionSlide', () => {
    const error = new Error('boom');
    renderWrapper({ data: baseData, loading: true, error });

    const slideInfo = lastEvolutionSlideProps().evolutionSlideInfos[0];
    expect(slideInfo).toEqual(
      expect.objectContaining({
        firstChartData: baseData['year-power-vs-ac'],
        secondChartData: baseData['trend-over-time'],
        evolutionSlideLoading: true,
        evolutionSlideError: error,
        evolutionSlideEmpty: false,
      }),
    );
  });

  it('passes undefined chart data when data is null', () => {
    renderWrapper({ data: null });

    const slideInfo = lastEvolutionSlideProps().evolutionSlideInfos[0];
    expect(slideInfo.firstChartData).toBeUndefined();
    expect(slideInfo.secondChartData).toBeUndefined();
  });

  it.each([
    ['MEGABRANDS', 'megabrands'],
    ['EXPANSION', 'expansion'],
    ['SUSTAIN', 'sustain'],
    ['TAIL', 'tail'],
  ] as const)(
    'maps portfolioType="%s" to its lowercase value',
    (portfolioType, expected) => {
      renderWrapper({ portfolioType });

      const slideInfo = lastEvolutionSlideProps().evolutionSlideInfos[0];
      expect(slideInfo.portfolioType).toBe(expected);
    },
  );

  it('omits portfolioType from the slide info when none is provided', () => {
    renderWrapper();

    const slideInfo = lastEvolutionSlideProps().evolutionSlideInfos[0];
    expect(slideInfo).not.toHaveProperty('portfolioType');
  });

  it('looks up the AI summary identifier for the current section', () => {
    renderWrapper({ section: 'total-abi-power-evolution' });

    const slideInfo = lastEvolutionSlideProps().evolutionSlideInfos[0];
    expect(slideInfo.aiSummary).toEqual(
      expect.objectContaining({
        id: expect.stringContaining('Evolution Trend'),
        subFilters: expect.any(Object),
      }),
    );
  });

  it('returns undefined aiSummary for unknown sections', () => {
    renderWrapper({ section: 'made-up-section' });

    const slideInfo = lastEvolutionSlideProps().evolutionSlideInfos[0];
    expect(slideInfo.aiSummary).toBeUndefined();
  });

  it('uses section to build the slide dataTestId', () => {
    renderWrapper({ section: 'megabrands-power-evolution' });

    expect(lastEvolutionSlideProps().dataTestId).toBe(
      'slide-evolution-megabrands-power-evolution',
    );
  });
});
