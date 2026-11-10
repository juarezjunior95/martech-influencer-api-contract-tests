import { renderHook } from '@testing-library/react-hooks';

import { DEFAULT_ENDPOINTS } from '../../../config/api';
import { useCountryPageData } from './useCountryPageData';

const mockGetCountry = jest.fn();

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(),
}));

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
  useFeatureToggle: jest.fn(() => [false, false]),
  usePageFilterApplied: jest.fn(),
  usePageFilterData: jest.fn(),
}));

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: () => ({ getCountry: mockGetCountry }),
  },
  FilterRegistry: {
    buildFilterQueryString: jest.fn((filters: Record<string, string>) =>
      Object.entries(filters)
        .map(([k, v]) => `${k}=${v}`)
        .join('&'),
    ),
  },
}));

jest.mock('pages', () => ({
  VOLUME_PAGES_PAGE_NAME: 'volume-pages',
}));

const mockUseLastDataRefresh = jest.requireMock('contexts').useLastDataRefresh;
const mockUseBffData = jest.requireMock('hooks').useBffData;
const mockUsePageFilterApplied = jest.requireMock('hooks').usePageFilterApplied;
const mockUsePageFilterData = jest.requireMock('hooks').usePageFilterData;

describe('useCountryPageData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCountry.mockReturnValue({ value: 'USA', label: 'United States' });
    mockUsePageFilterApplied.mockReturnValue({ applied: { zone: 'AMER' } });
    mockUsePageFilterData.mockReturnValue({ dataFilters: {} });
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: new Date('2025-01-15') },
    });
    mockUseBffData.mockReturnValue({
      data: { 'big-numbers': [], 'line-chart': null },
      loading: false,
      error: null,
    });
  });

  it('calls useBffData with the correct country subFilter', () => {
    renderHook(() => useCountryPageData('volume'));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: DEFAULT_ENDPOINTS.country,
        kpiGroup: 'volume',
        subFilters: { country: 'USA', kpi: 'volume' },
      }),
    );
  });

  it('calls useBffData with kpiGroup finance when kpi is nr', () => {
    renderHook(() => useCountryPageData('nr'));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: DEFAULT_ENDPOINTS.country,
        kpiGroup: 'finance',
        subFilters: { country: 'USA', kpi: 'nr' },
      }),
    );
  });

  it('returns the data from useBffData', () => {
    const mockData = { 'big-numbers': [{ value: 100 }] };
    mockUseBffData.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useCountryPageData('volume'));

    expect(result.current.data.data).toEqual(mockData);
  });

  it('formats monthYear correctly', () => {
    const { result } = renderHook(() => useCountryPageData('volume'));

    expect(result.current.monthYear).toBe('Jan 2025');
  });

  it('formats monthYear from finance refresh when kpi is nr', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { finance: new Date('2025-06-20') },
    });

    const { result } = renderHook(() => useCountryPageData('nr'));

    expect(result.current.monthYear).toBe('Jun 2025');
  });

  it("formats period correctly as MON'YY", () => {
    const { result } = renderHook(() => useCountryPageData('volume'));

    expect(result.current.period).toBe("JAN'25");
  });

  it('returns empty monthYear and period when volume date is null', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: null },
    });

    const { result } = renderHook(() => useCountryPageData('volume'));

    expect(result.current.monthYear).toBe('');
    expect(result.current.period).toBe('');
  });

  it('constructs countryCoverLink with country and zone', () => {
    const { result } = renderHook(() => useCountryPageData('volume'));

    expect(result.current.countryCoverLink).toContain('country=USA');
    expect(result.current.countryCoverLink).toContain('zone=AMER');
  });

  it('returns undefined for countryCoverLink when country value is empty', () => {
    mockGetCountry.mockReturnValue({ value: '', label: '' });

    const { result } = renderHook(() => useCountryPageData('volume'));

    expect(result.current.countryCoverLink).toBeUndefined();
  });

  it('returns undefined for countryCoverLink when country is null', () => {
    mockGetCountry.mockReturnValue(null);

    const { result } = renderHook(() => useCountryPageData('volume'));

    expect(result.current.countryCoverLink).toBeUndefined();
  });

  it('returns the country from filter accessor', () => {
    const { result } = renderHook(() => useCountryPageData('volume'));

    expect(result.current.country).toEqual({
      value: 'USA',
      label: 'United States',
    });
  });
});
