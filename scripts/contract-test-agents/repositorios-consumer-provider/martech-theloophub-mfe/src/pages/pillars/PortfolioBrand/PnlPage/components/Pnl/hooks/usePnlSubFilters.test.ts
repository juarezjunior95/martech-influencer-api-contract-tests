import { renderHook } from '@testing-library/react-hooks';

import { usePnlSubFilters } from './usePnlSubFilters';

let mockApplied: Record<string, unknown>;
let mockDataFilters: Record<string, unknown>;
const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterData = jest.fn();

jest.mock('hooks', () => ({
  usePageFilterApplied: (pageName: string) =>
    mockUsePageFilterApplied(pageName),
  usePageFilterData: (pageName: string) => mockUsePageFilterData(pageName),
}));

const createLastDataRefresh = (
  overrides: Partial<Record<string, string | undefined>> = {},
) => ({
  volume: '2025-03-31',
  finance: '2025-03-31',
  market_share: '2025-02-28',
  power: '2025-01-31',
  pos: '2025-03-15',
  ...overrides,
});

const renderWithCurrentMocks = (
  refreshOverrides: Partial<Record<string, string | undefined>> = {},
  pageName?: string,
) =>
  renderHook(() =>
    usePnlSubFilters({
      lastDataRefreshKpisDateMonthYear: createLastDataRefresh(refreshOverrides),
      ...(pageName !== undefined ? { pageName } : {}),
    }),
  );

describe('usePnlSubFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = {
      zone: 'LAS',
      country: 'BRA',
      'ytd-month': 'MONTH',
    };
    mockDataFilters = {
      time_frame: {
        default: { ini: '2024-01-01', end: '2025-03-31' },
      },
    };
    mockUsePageFilterApplied.mockImplementation(() => ({
      applied: mockApplied,
    }));
    mockUsePageFilterData.mockImplementation(() => ({
      dataFilters: mockDataFilters,
    }));
  });

  describe('returns null', () => {
    it('when dt_ini is missing from dataFilters', () => {
      mockDataFilters = {
        time_frame: { default: { end: '2025-03-31' } },
      };

      const { result } = renderWithCurrentMocks();

      expect(result.current).toBeNull();
    });

    it('when volume_dt_end is missing from lastDataRefresh', () => {
      const { result } = renderWithCurrentMocks({ volume: undefined });

      expect(result.current).toBeNull();
    });

    it.each<[string, Partial<Record<string, unknown>>]>([
      ['zone is null', { zone: null }],
      ['country is null', { country: null }],
      ['country is ABI', { country: 'ABI' }],
    ])('when %s', (_label, override) => {
      mockApplied = { ...mockApplied, ...override };

      const { result } = renderWithCurrentMocks();

      expect(result.current).toBeNull();
    });
  });

  it('returns the per-kpi sub filters using each kpi own dt_end when period is MONTH', () => {
    const { result } = renderWithCurrentMocks();

    expect(result.current.dt_ini).toBe('2025-03-31');
    expect(result.current.output).toEqual({
      viewtype_finance: 'country',
      dt_ini_finance: '2025-03-31',
      dt_end_finance: '2025-03-31',
      zone_finance: 'LAS',
      country_finance: 'BRA',
      period_finance: 'MONTH',
      viewtype_market_share: 'country',
      dt_ini_market_share: '2025-02-28',
      dt_end_market_share: '2025-02-28',
      zone_market_share: 'LAS',
      country_market_share: 'BRA',
      period_market_share: 'MONTH',
      viewtype_power: 'country',
      dt_ini_power: '2025-01-31',
      dt_end_power: '2025-01-31',
      zone_power: 'LAS',
      country_power: 'BRA',
      period_power: 'MONTH',
      viewtype_pos: 'country',
      dt_ini_pos: '2025-03-15',
      dt_end_pos: '2025-03-15',
      zone_pos: 'LAS',
      country_pos: 'BRA',
      period_pos: 'MONTH',
    });
  });

  it('returns YTD ranges using january 1st as dt_ini for each kpi when period is YTD', () => {
    mockApplied = { ...mockApplied, 'ytd-month': 'YTD' };

    const { result } = renderWithCurrentMocks();

    expect(result.current.dt_ini).toBe('2024-01-01');
    expect(result.current.output).toEqual({
      viewtype_finance: 'country',
      dt_ini_finance: '2025-01-01',
      dt_end_finance: '2025-03-31',
      zone_finance: 'LAS',
      country_finance: 'BRA',
      period_finance: 'YTD',
      viewtype_market_share: 'country',
      dt_ini_market_share: '2025-01-01',
      dt_end_market_share: '2025-02-28',
      zone_market_share: 'LAS',
      country_market_share: 'BRA',
      period_market_share: 'YTD',
      viewtype_power: 'country',
      dt_ini_power: '2025-01-01',
      dt_end_power: '2025-01-31',
      zone_power: 'LAS',
      country_power: 'BRA',
      period_power: 'YTD',
      viewtype_pos: 'country',
      dt_ini_pos: '2025-01-01',
      dt_end_pos: '2025-03-15',
      zone_pos: 'LAS',
      country_pos: 'BRA',
      period_pos: 'YTD',
    });
  });

  it('calls filter hooks with PERFORMANCE_PAGE_NAME by default', () => {
    renderWithCurrentMocks();

    expect(mockUsePageFilterApplied).toHaveBeenCalledWith(
      'portfolio-brand_portfolio-performance',
    );
    expect(mockUsePageFilterData).toHaveBeenCalledWith(
      'portfolio-brand_portfolio-performance',
    );
  });

  it('calls filter hooks with a custom pageName when provided', () => {
    renderWithCurrentMocks({}, 'custom-page-name');

    expect(mockUsePageFilterApplied).toHaveBeenCalledWith('custom-page-name');
    expect(mockUsePageFilterData).toHaveBeenCalledWith('custom-page-name');
  });
});
