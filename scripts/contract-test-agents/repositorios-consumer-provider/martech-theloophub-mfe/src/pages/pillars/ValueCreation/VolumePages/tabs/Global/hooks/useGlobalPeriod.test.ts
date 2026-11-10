import { renderHook } from '@testing-library/react-hooks';

import { useGlobalPeriod } from './useGlobalPeriod';

jest.mock('contexts', () => ({
  useLastDataRefresh: jest.fn(),
}));

const mockUseLastDataRefresh = jest.requireMock('contexts').useLastDataRefresh;

describe('useGlobalPeriod', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns dt_end from lastDataRefreshKpisDateMonthYear.volume', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: new Date('2025-01-15') },
      lastDataRefreshKpisDateMonthYear: { volume: '2025-01' },
    });

    const { result } = renderHook(() => useGlobalPeriod('volume'));

    expect(result.current.dt_end).toBe('2025-01');
  });

  it('formats monthYear correctly', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: new Date('2025-01-15') },
      lastDataRefreshKpisDateMonthYear: { volume: '2025-01' },
    });

    const { result } = renderHook(() => useGlobalPeriod('volume'));

    expect(result.current.monthYear).toBe('Jan 2025');
  });

  it('formats period correctly', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: new Date('2025-01-15') },
      lastDataRefreshKpisDateMonthYear: { volume: '2025-01' },
    });

    const { result } = renderHook(() => useGlobalPeriod('volume'));

    expect(result.current.period).toBe("JAN'25");
  });

  it('returns empty strings when volume date is null', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: null },
      lastDataRefreshKpisDateMonthYear: {},
    });

    const { result } = renderHook(() => useGlobalPeriod('volume'));

    expect(result.current.monthYear).toBe('');
    expect(result.current.period).toBe('');
    expect(result.current.dt_end).toBeUndefined();
  });

  it('returns undefined dt_end when lastDataRefreshKpisDateMonthYear has no volume key', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: new Date('2025-06-01') },
      lastDataRefreshKpisDateMonthYear: {},
    });

    const { result } = renderHook(() => useGlobalPeriod('volume'));

    expect(result.current.dt_end).toBeUndefined();
  });

  it('formats period with correct month abbreviation and year slice', () => {
    // Use Date constructor with local timezone to avoid UTC date parsing shifting months
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { volume: new Date(2024, 11, 15) },
      lastDataRefreshKpisDateMonthYear: { volume: '2024-12' },
    });

    const { result } = renderHook(() => useGlobalPeriod('volume'));

    expect(result.current.monthYear).toBe('Dec 2024');
    expect(result.current.period).toBe("DEC'24");
  });

  it('uses finance last-refresh keys when kpi is nr', () => {
    mockUseLastDataRefresh.mockReturnValue({
      lastDataRefreshKpisDate: { finance: new Date('2025-03-10') },
      lastDataRefreshKpisDateMonthYear: { finance: '2025-03' },
    });

    const { result } = renderHook(() => useGlobalPeriod('nr'));

    expect(result.current.dt_end).toBe('2025-03');
    expect(result.current.monthYear).toBe('Mar 2025');
    expect(result.current.period).toBe("MAR'25");
  });
});
