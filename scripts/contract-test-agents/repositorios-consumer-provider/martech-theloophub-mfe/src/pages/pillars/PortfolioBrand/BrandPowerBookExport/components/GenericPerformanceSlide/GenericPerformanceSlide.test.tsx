import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { GenericPerformanceSlide } from './GenericPerformanceSlide';

const mockByCountrySlide = jest.fn();
const mockTemplateSlide = jest.fn();

jest.mock('../ByCountrySlide', () => ({
  ByCountrySlide: (props: any) => {
    mockByCountrySlide(props);
    return <div data-testid="by-country-slide" />;
  },
}));

jest.mock('components', () => ({
  TemplateSlide: ({ children, ...rest }: any) => {
    mockTemplateSlide(rest);
    return <div data-testid="template-slide">{children}</div>;
  },
}));

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportPageSection: ({ children, ...rest }: any) => (
    <div data-testid="export-page-section" {...rest}>
      {children}
    </div>
  ),
}));

jest.mock('../../BrandPowerBookExport.styles', () => ({
  StyledContent: ({ children }: any) => <div>{children}</div>,
}));

const buildData = (overrides = {}) =>
  ({
    bigNumbers: { id: 'bigNumbers' },
    zonePerformance: { zonePowerPerformance: { id: 'zonePower' } },
    maturityPerformance: { maturityPowerPerformance: { id: 'maturity' } },
    zonePerformanceDetails: {
      NAZ: { data: { id: 'naz' } },
      SAZ: { data: { id: 'saz' } },
      MAZ: { data: { id: 'maz' } },
      APAC: { data: { id: 'apac' } },
      AFR: { data: { id: 'afr' } },
      EUR: { data: { id: 'eur' } },
    },
    ...overrides,
  }) as any;

const defaultProps = {
  pageName: 'megabrands-performance',
  title: 'Megabrands Power by Country',
  period: "Q4'25",
  loading: false,
  error: null,
  data: buildData(),
};

const renderSlide = (
  props: Partial<typeof defaultProps> & {
    isCompetitor?: boolean;
    alerts?: string[];
  } = {},
) => render(<GenericPerformanceSlide {...defaultProps} {...props} />);

const lastByCountryProps = () =>
  mockByCountrySlide.mock.calls[mockByCountrySlide.mock.calls.length - 1][0];

const lastTemplateProps = () =>
  mockTemplateSlide.mock.calls[mockTemplateSlide.mock.calls.length - 1][0];

describe('GenericPerformanceSlide', () => {
  beforeEach(() => {
    mockByCountrySlide.mockClear();
    mockTemplateSlide.mockClear();
  });

  it('renders inside a section tagged with the page-name', () => {
    renderSlide();

    expect(screen.getByTestId('export-page-section')).toHaveAttribute(
      'data-page-name',
      defaultProps.pageName,
    );
  });

  it('forwards title, period, dataTestId and countryId to TemplateSlide', () => {
    renderSlide({ pageName: 'corona-performance' });

    expect(lastTemplateProps()).toEqual(
      expect.objectContaining({
        title: defaultProps.title,
        period: defaultProps.period,
        dataTestId: 'corona-performance',
        countryId: 'ABI',
      }),
    );
  });

  it('forwards every kpi data slot from data to ByCountrySlide', () => {
    renderSlide();

    expect(lastByCountryProps()).toEqual(
      expect.objectContaining({
        bigNumbersKpiData: { id: 'bigNumbers' },
        zoneKpiData: { id: 'zonePower' },
        maturityKpiData: { id: 'maturity' },
        nazKpiData: { id: 'naz' },
        sazKpiData: { id: 'saz' },
        mazKpiData: { id: 'maz' },
        apacKpiData: { id: 'apac' },
        afrKpiData: { id: 'afr' },
        eurKpiData: { id: 'eur' },
      }),
    );
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
  ])('passes undefined data slots when data is %s', (_label, data) => {
    renderSlide({ data });

    const props = lastByCountryProps();
    expect(props.bigNumbersKpiData).toBeUndefined();
    expect(props.zoneKpiData).toBeUndefined();
    expect(props.maturityKpiData).toBeUndefined();
    expect(props.nazKpiData).toBeUndefined();
  });

  it('forwards loading and error to ByCountrySlide', () => {
    const error = new Error('boom');
    renderSlide({ loading: true, error });

    expect(lastByCountryProps()).toEqual(
      expect.objectContaining({ loading: true, error }),
    );
  });

  it.each([
    ['default', undefined, false],
    ['explicit true', true, true],
    ['explicit false', false, false],
  ])(
    'passes isCompetitor=%s to ByCountrySlide',
    (_label, isCompetitor, expected) => {
      renderSlide({ isCompetitor });

      expect(lastByCountryProps().isCompetitor).toBe(expected);
    },
  );

  it('forwards the pageName as the section to ByCountrySlide', () => {
    renderSlide({ pageName: 'tail-performance' });

    expect(lastByCountryProps().section).toBe('tail-performance');
  });

  it('forwards alerts (defaulting to empty array)', () => {
    renderSlide({ alerts: ['a', 'b'] });
    expect(lastByCountryProps().alerts).toEqual(['a', 'b']);

    renderSlide();
    expect(lastByCountryProps().alerts).toEqual([]);
  });
});
