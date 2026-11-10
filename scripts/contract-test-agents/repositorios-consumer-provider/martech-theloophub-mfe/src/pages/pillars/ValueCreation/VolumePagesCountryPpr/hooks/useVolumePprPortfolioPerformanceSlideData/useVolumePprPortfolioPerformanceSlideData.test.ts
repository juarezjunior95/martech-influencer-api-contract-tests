import { renderHook } from '@testing-library/react-hooks';

import { useVolumePprPortfolioPerformanceSlideData } from './useVolumePprPortfolioPerformanceSlideData';

const mockUseBffData = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterData = jest.fn();
const mockUseLastDataRefresh = jest.fn();
const mockGetTimeFrame = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (...args: unknown[]) => mockUseBffData(...args),
  usePageFilterApplied: (...args: unknown[]) =>
    mockUsePageFilterApplied(...args),
  usePageFilterData: (...args: unknown[]) => mockUsePageFilterData(...args),
}));

jest.mock('contexts/LastDataRefresh/LastDataRefresh', () => ({
  useLastDataRefresh: () => mockUseLastDataRefresh(),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getTimeFrame: (...args: unknown[]) => mockGetTimeFrame(...args),
    }),
  },
}));

jest.mock('../../VolumePagesCountryPpr', () => ({
  VOLUME_PAGES_COUNTRY_PPR_PAGE_NAME: 'value-creation_country-ppr',
}));

jest.mock('utils', () => ({
  getJanuaryFirstYmdFromDtEnd: (dt?: string) =>
    dt ? `${dt.slice(0, 4)}-01-01` : '',
  getViewtype: (country: unknown) => (country === 'ABI' ? 'global' : 'country'),
  normalizeFilters: (applied: Record<string, unknown>) => applied ?? {},
}));

const idle = {
  data: undefined,
  loading: false,
  error: null,
};

const defaultApplied = {
  zone: 'NAZ',
  country: 'BR',
};

const defaultDataFilters = {
  time_frame: { values: [{ label: '2024', value: '2024' }] },
};

const defaultLastDataRefresh = {
  lastDataRefreshKpisDateMonthYear: {
    volume: '2024-06-15',
    finance: '2024-06-15',
    market_share: '2024-05-31',
    power: '2024-04-30',
    pos: '2024-06-10',
  },
};

describe('useVolumePprPortfolioPerformanceSlideData', () => {
  beforeEach(() => {
    mockUseBffData.mockReturnValue(idle);
    mockUsePageFilterApplied.mockReturnValue({ applied: defaultApplied });
    mockUsePageFilterData.mockReturnValue({ dataFilters: defaultDataFilters });
    mockUseLastDataRefresh.mockReturnValue(defaultLastDataRefresh);
    mockGetTimeFrame.mockReturnValue('2024-01-01');
  });

  it('reflects sectionLoading=true while the portfolio performance request is loading', () => {
    mockUseBffData.mockReturnValue({ ...idle, loading: true });

    const { result } = renderHook(() =>
      useVolumePprPortfolioPerformanceSlideData('NAZ'),
    );

    expect(result.current.sectionLoading).toBe(true);
  });

  it('exposes the raw BFF response through portfolioPerformanceSlideData', () => {
    const bffResponse = { ...idle, data: { foo: 'bar' } };
    mockUseBffData.mockReturnValue(bffResponse);

    const { result } = renderHook(() =>
      useVolumePprPortfolioPerformanceSlideData('NAZ'),
    );

    expect(result.current.portfolioPerformanceSlideData).toBe(bffResponse);
  });

  it('passes empty subFilters to useBffData when dt_ini (time frame) is missing', () => {
    mockGetTimeFrame.mockReturnValue(undefined);

    renderHook(() => useVolumePprPortfolioPerformanceSlideData('NAZ'));

    const callArg = mockUseBffData.mock.calls[0][0];
    expect(callArg.id).toBe(
      'value-creation_portfolio-performance_overview_overview',
    );
    expect(callArg.kpiGroup).toBe('volume');
    expect(callArg.subFilters).toEqual({});
  });

  it('passes empty subFilters when volume_dt_end is missing', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDateMonthYear: {
        ...defaultLastDataRefresh.lastDataRefreshKpisDateMonthYear,
        volume: undefined,
      },
    });

    renderHook(() => useVolumePprPortfolioPerformanceSlideData('NAZ'));

    expect(mockUseBffData.mock.calls[0][0].subFilters).toEqual({});
  });

  it('passes empty subFilters when applied.zone is missing', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: { ...defaultApplied, zone: undefined },
    });

    renderHook(() => useVolumePprPortfolioPerformanceSlideData('NAZ'));

    expect(mockUseBffData.mock.calls[0][0].subFilters).toEqual({});
  });

  it('passes empty subFilters when applied.country is missing', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: { ...defaultApplied, country: undefined },
    });

    renderHook(() => useVolumePprPortfolioPerformanceSlideData('NAZ'));

    expect(mockUseBffData.mock.calls[0][0].subFilters).toEqual({});
  });

  it('builds the 4 KPI sub-filters (finance, market_share, power, pos) using each KPI dt_end and January 1st of its year', () => {
    renderHook(() => useVolumePprPortfolioPerformanceSlideData('NAZ'));

    const subFilters = mockUseBffData.mock.calls[0][0].subFilters;

    expect(subFilters.dt_ini).toBe('2024-01-01');

    expect(subFilters.finance).toEqual({
      viewtype: 'country',
      dt_ini: '2024-01-01',
      dt_end: '2024-06-15',
      zone: 'NAZ',
      country: 'BR',
      period: 'YTD',
    });

    expect(subFilters.market_share).toEqual({
      viewtype: 'country',
      dt_ini: '2024-01-01',
      dt_end: '2024-05-31',
      zone: 'NAZ',
      country: 'BR',
      period: 'YTD',
    });

    expect(subFilters.power).toEqual({
      viewtype: 'country',
      dt_ini: '2024-01-01',
      dt_end: '2024-04-30',
      zone: 'NAZ',
      country: 'BR',
      period: 'YTD',
    });

    expect(subFilters.pos).toEqual({
      viewtype: 'country',
      dt_ini: '2024-01-01',
      dt_end: '2024-06-10',
      zone: 'NAZ',
      country: 'BR',
      period: 'YTD',
    });
  });

  it('uses viewtype="global" when the applied country is "ABI"', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: { zone: 'GLOBAL', country: 'ABI' },
    });

    renderHook(() => useVolumePprPortfolioPerformanceSlideData('GLOBAL'));

    const subFilters = mockUseBffData.mock.calls[0][0].subFilters;
    expect(subFilters.finance.viewtype).toBe('global');
    expect(subFilters.market_share.viewtype).toBe('global');
    expect(subFilters.power.viewtype).toBe('global');
    expect(subFilters.pos.viewtype).toBe('global');
  });
});
