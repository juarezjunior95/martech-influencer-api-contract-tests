import { renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

import { useZonePerformanceDetails } from './useZonePerformanceDetails';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

const mockUseBffData = useBffData as jest.Mock;

const buildBffResponse = (
  overrides: Partial<{
    data: unknown;
    loading: boolean;
    error: Error | null;
  }> = {},
) => ({
  data: null,
  loading: false,
  error: null,
  refetch: jest.fn(),
  ...overrides,
});

const ZONES = ['NAZ', 'SAZ', 'MAZ', 'APAC', 'AFR', 'EUR'] as const;

describe('useZonePerformanceDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue(buildBffResponse());
  });

  describe('return shape', () => {
    it('exposes a slot per zone plus loading and error', () => {
      const { result } = renderHook(() => useZonePerformanceDetails('All'));

      expect(result.current).toEqual(
        expect.objectContaining({
          NAZ: expect.any(Object),
          SAZ: expect.any(Object),
          MAZ: expect.any(Object),
          APAC: expect.any(Object),
          AFR: expect.any(Object),
          EUR: expect.any(Object),
          loading: false,
          error: null,
        }),
      );
    });

    it('each zone slot exposes data, loading, error and refetch', () => {
      const { result } = renderHook(() => useZonePerformanceDetails('All'));

      ZONES.forEach((zone) => {
        expect(result.current[zone]).toEqual(
          expect.objectContaining({
            data: null,
            loading: false,
            error: null,
            refetch: expect.any(Function),
          }),
        );
      });
    });

    it('keeps the returned object referentially stable between renders when nothing changes', () => {
      const { result, rerender } = renderHook(() =>
        useZonePerformanceDetails('All'),
      );

      const first = result.current;
      rerender();

      expect(result.current).toBe(first);
    });
  });

  describe('useBffData wiring', () => {
    it('makes exactly one useBffData call per zone (6 total) on each render', () => {
      renderHook(() => useZonePerformanceDetails('All'));

      expect(mockUseBffData).toHaveBeenCalledTimes(ZONES.length);
    });

    it.each(ZONES)(
      'calls useBffData for zone %s with the correct id, kpiGroup and subFilters',
      (zone) => {
        renderHook(() => useZonePerformanceDetails('Megabrands'));

        expect(mockUseBffData).toHaveBeenCalledWith({
          id: SharedKpis.GLOBAL.ZONE_PERFORMANCE_DETAILS,
          kpiGroup: 'power',
          subFilters: { page_filter: 'Megabrands', zone_maturity: zone },
          skipRequest: false,
        });
      },
    );

    it('forwards the pageFilter parameter to every useBffData call', () => {
      renderHook(() => useZonePerformanceDetails('Corona'));

      ZONES.forEach((zone) => {
        expect(mockUseBffData).toHaveBeenCalledWith(
          expect.objectContaining({
            subFilters: { page_filter: 'Corona', zone_maturity: zone },
          }),
        );
      });
    });
  });

  describe('enabled flag', () => {
    it('passes skipRequest=false to every useBffData call when enabled (default true)', () => {
      renderHook(() => useZonePerformanceDetails('All'));

      const calls = mockUseBffData.mock.calls;
      expect(calls).toHaveLength(ZONES.length);
      calls.forEach(([args]) => {
        expect(args.skipRequest).toBe(false);
      });
    });

    it('passes skipRequest=true to every useBffData call when enabled=false', () => {
      renderHook(() => useZonePerformanceDetails('All', false));

      const calls = mockUseBffData.mock.calls;
      expect(calls).toHaveLength(ZONES.length);
      calls.forEach(([args]) => {
        expect(args.skipRequest).toBe(true);
      });
    });
  });

  describe('loading aggregation', () => {
    it('returns loading=false when no zone is loading', () => {
      const { result } = renderHook(() => useZonePerformanceDetails('All'));

      expect(result.current.loading).toBe(false);
    });

    it.each(ZONES.map((zone, index) => [zone, index] as const))(
      'returns loading=true when zone %s is loading',
      (_zone, loadingIndex) => {
        ZONES.forEach((__, index) => {
          mockUseBffData.mockReturnValueOnce(
            buildBffResponse({ loading: index === loadingIndex }),
          );
        });

        const { result } = renderHook(() => useZonePerformanceDetails('All'));

        expect(result.current.loading).toBe(true);
      },
    );
  });

  describe('error aggregation', () => {
    it('returns error=null when no zone has error', () => {
      const { result } = renderHook(() => useZonePerformanceDetails('All'));

      expect(result.current.error).toBeNull();
    });

    it.each(ZONES.map((zone, index) => [zone, index] as const))(
      'returns the error from zone %s when it is the first zone with an error',
      (_zone, errorIndex) => {
        const error = new Error(`zone-${errorIndex}-error`);
        ZONES.forEach((__, index) => {
          mockUseBffData.mockReturnValueOnce(
            buildBffResponse({ error: index === errorIndex ? error : null }),
          );
        });

        const { result } = renderHook(() => useZonePerformanceDetails('All'));

        expect(result.current.error).toBe(error);
      },
    );
  });

  describe('data propagation', () => {
    it.each(ZONES.map((zone, index) => [zone, index] as const))(
      'exposes the data returned by useBffData on the %s slot',
      (zone, dataIndex) => {
        ZONES.forEach((__, index) => {
          mockUseBffData.mockReturnValueOnce(
            buildBffResponse({
              data: { zone, value: index },
            }),
          );
        });

        const { result } = renderHook(() => useZonePerformanceDetails('All'));

        expect(result.current[zone].data).toEqual({ zone, value: dataIndex });
      },
    );
  });
});
