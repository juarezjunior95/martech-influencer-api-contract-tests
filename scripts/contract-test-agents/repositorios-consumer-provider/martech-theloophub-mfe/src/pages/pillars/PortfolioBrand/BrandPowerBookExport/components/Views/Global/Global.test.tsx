import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { formatDateToQuarterYear } from 'utils/format';

import { UNIFIED_GLOBAL_SLIDES } from '../../../constants';
import { GlobalView } from './Global';

const mockUsePowerBookGlobalData = jest.fn();
const mockUseLastDataRefresh = jest.fn();
const mockUsePageIndexes = jest.fn();
const mockEvolutionSlideWrapper = jest.fn();
const mockByCountrySlide = jest.fn();
const mockGenericPerformanceSlide = jest.fn();
const mockTopCountryContribution = jest.fn();

jest.mock(
  '../../../hooks/usePowerBookGlobalData/usePowerBookGlobalData',
  () => ({
    usePowerBookGlobalData: () => mockUsePowerBookGlobalData(),
  }),
);

jest.mock('contexts', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

jest.mock('hooks', () => ({
  usePageIndexes: () => mockUsePageIndexes(),
}));

jest.mock('components', () => ({
  Cover: ({ name, category }: any) => (
    <div data-testid="cover" data-name={name} data-category={category} />
  ),
  TemplateSlide: ({ children, dataTestId }: any) => (
    <div data-testid={`template-${dataTestId}`}>{children}</div>
  ),
}));

jest.mock('../../EvolutionSlideWrapper', () => ({
  EvolutionSlideWrapper: (props: any) => {
    mockEvolutionSlideWrapper(props);
    return (
      <div data-testid="evolution-slide-wrapper" data-section={props.section} />
    );
  },
}));

jest.mock('../../ByCountrySlide', () => ({
  ByCountrySlide: (props: any) => {
    mockByCountrySlide(props);
    return <div data-testid="by-country-slide" data-section={props.section} />;
  },
}));

jest.mock('../../GenericPerformanceSlide', () => ({
  GenericPerformanceSlide: (props: any) => {
    mockGenericPerformanceSlide(props);
    return (
      <div
        data-testid="generic-performance-slide"
        data-page-name={props.pageName}
        data-is-competitor={String(!!props.isCompetitor)}
      />
    );
  },
}));

jest.mock('../../TopContribuitionCountry', () => ({
  TopCountryContribution: (props: any) => {
    mockTopCountryContribution(props);
    return (
      <div
        data-testid="top-country-contribution"
        data-test-id={props.dataTestId}
      />
    );
  },
}));

jest.mock('shared/Styles/exportPages.styles', () => ({
  StyledExportPageSection: ({ children, ...rest }: any) => (
    <div {...rest}>{children}</div>
  ),
}));

jest.mock('../../../BrandPowerBookExport.styles', () => ({
  StyledContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('utils/format', () => ({
  formatDateToQuarterYear: jest.fn((date: Date) => `Q1 ${date.getFullYear()}`),
}));

const renderWithIntl = (ui: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}} onError={() => undefined}>
      {ui}
    </IntlProvider>,
  );

const buildSlot = (overrides = {}) => ({
  data: null,
  loading: false,
  error: null,
  refetch: jest.fn(),
  ...overrides,
});

const buildGlobalData = () => ({
  global: buildSlot(),
  megabrands: buildSlot(),
  mainstream: buildSlot(),
  core: buildSlot(),
  premiumization: buildSlot(),
  expansion: buildSlot(),
  sustain: buildSlot(),
  tail: buildSlot(),
  globalBrands: buildSlot(),
  corona: buildSlot(),
  budweiser: buildSlot(),
  michelobUltra: buildSlot(),
  stellaArtois: buildSlot(),
  heineken: buildSlot(),
  contribution: { global: buildSlot(), megabrands: buildSlot() },
  trendPowerEvolutionData: { global: buildSlot(), megabrands: buildSlot() },
});

const expectedCountByType = (type: string) =>
  UNIFIED_GLOBAL_SLIDES.filter((s: any) => s.type === type).length;

const renderView = (loadingCallback = jest.fn()) =>
  renderWithIntl(
    <GlobalView
      containerRef={{ current: document.createElement('div') }}
      loadingCallback={loadingCallback}
    />,
  );

beforeEach(() => {
  jest.clearAllMocks();

  mockUseLastDataRefresh.mockReturnValue({
    lastDataRefreshKpisDate: { power: new Date('2025-01-01') },
  });
  mockUsePageIndexes.mockReturnValue({
    getPageByName: jest.fn(() => ({ index: 1 })),
    updateIndexes: jest.fn(),
  });
  mockUsePowerBookGlobalData.mockReturnValue({
    globalData: buildGlobalData(),
    loading: false,
    error: null,
  });
});

describe('GlobalView', () => {
  it.each([
    ['evolution', 'evolution-slide-wrapper'],
    ['by-country', 'by-country-slide'],
    ['performance', 'generic-performance-slide'],
    ['cover', 'cover'],
  ])('renders one %s slide per matching config', (type, testId) => {
    renderView();

    expect(screen.getAllByTestId(testId)).toHaveLength(
      expectedCountByType(type),
    );
  });

  it('renders one TopCountryContribution per "contribution" config x 2 (ABI + Megabrands)', () => {
    renderView();

    expect(screen.getAllByTestId('top-country-contribution')).toHaveLength(
      expectedCountByType('contribution') * 2,
    );
  });

  it('marks the Heineken performance slide as competitor', () => {
    renderView();

    const heineken = mockGenericPerformanceSlide.mock.calls.find(
      ([p]) => p.pageName === 'heineken-performance',
    );
    expect(heineken).toBeDefined();
    expect(heineken?.[0].isCompetitor).toBe(true);
  });

  it.each([
    ['expansion-performance'],
    ['sustain-performance'],
    ['mainstream-power-by-country'],
  ])('does not mark %s as competitor', (pageName) => {
    renderView();

    const slide = mockGenericPerformanceSlide.mock.calls.find(
      ([p]) => p.pageName === pageName,
    );
    expect(Boolean(slide?.[0].isCompetitor)).toBe(false);
  });

  it.each([
    ['idle', false, { country: false, global: false }],
    ['loading', true, { country: false, global: true }],
  ])(
    'invokes loadingCallback with global=%s when global data is %s',
    (_label, loading, expected) => {
      mockUsePowerBookGlobalData.mockReturnValue({
        globalData: buildGlobalData(),
        loading,
        error: null,
      });
      const cb = jest.fn();

      renderView(cb);

      expect(cb).toHaveBeenCalledWith(expected);
    },
  );

  it('forwards data-section attribute on by-country slides matching the config sections', () => {
    renderView();

    const sections = screen
      .getAllByTestId('by-country-slide')
      .map((el) => el.dataset.section);

    UNIFIED_GLOBAL_SLIDES.filter((s: any) => s.type === 'by-country').forEach(
      (cfg: any) => {
        expect(sections).toContain(cfg.section);
      },
    );
  });

  describe('Period derivation from data refresh', () => {
    it('passes empty period strings to slides when no power refresh date is available', () => {
      mockUseLastDataRefresh.mockReturnValue({
        lastDataRefreshKpisDate: { power: null },
      });

      renderView();

      mockEvolutionSlideWrapper.mock.calls.forEach(([props]: any) => {
        expect(props.period).toBe('');
      });
    });

    it('falls back to the raw quarterYearFull when it cannot be split into quarter and year', () => {
      (formatDateToQuarterYear as jest.Mock).mockImplementation(
        (_date: Date, separator: string) =>
          separator === ' ' ? 'NoSpaceValue' : 'Q1 - 2025',
      );

      renderView();

      const cover = mockEvolutionSlideWrapper.mock.calls[0]?.[0];
      expect(cover).toBeDefined();
      expect(cover.period).toBe('Q1 - 2025');
    });
  });
});
