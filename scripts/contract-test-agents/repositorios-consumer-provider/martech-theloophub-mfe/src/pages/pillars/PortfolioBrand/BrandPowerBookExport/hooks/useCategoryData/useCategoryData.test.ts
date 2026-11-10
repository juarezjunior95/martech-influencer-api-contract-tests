import { renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

import { useZonePerformanceDetails } from '../useZonePerformanceDetails/useZonePerformanceDetails';
import { useCategoryData } from './useCategoryData';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

jest.mock('../useZonePerformanceDetails/useZonePerformanceDetails', () => ({
  useZonePerformanceDetails: jest.fn(),
}));

const mockUseBffData = useBffData as jest.Mock;
const mockUseZonePerformanceDetails = useZonePerformanceDetails as jest.Mock;

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

const buildZoneDetailsResponse = (
  overrides: Partial<{
    loading: boolean;
    error: Error | null;
  }> = {},
) => ({
  NAZ: buildBffResponse(),
  SAZ: buildBffResponse(),
  MAZ: buildBffResponse(),
  APAC: buildBffResponse(),
  AFR: buildBffResponse(),
  EUR: buildBffResponse(),
  loading: false,
  error: null,
  ...overrides,
});

describe('useCategoryData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue(buildBffResponse());
    mockUseZonePerformanceDetails.mockReturnValue(buildZoneDetailsResponse());
  });

  describe('return shape', () => {
    it('exposes data, loading and error fields', () => {
      const { result } = renderHook(() => useCategoryData('All'));

      expect(result.current.loading).toEqual(expect.any(Boolean));
      expect(result.current.error).toBeNull();
      expect(result.current.data).toHaveProperty('maturityPerformance');
      expect(result.current.data).toHaveProperty('zonePerformanceDetails');
      expect(result.current.data).toHaveProperty('zonePerformance');
      expect(result.current.data).toHaveProperty('bigNumbers');
    });

    it('returns the same object reference between renders when inputs do not change', () => {
      const { result, rerender } = renderHook(() => useCategoryData('All'));

      const firstResult = result.current;
      rerender();

      expect(result.current).toBe(firstResult);
    });
  });

  describe('useBffData wiring', () => {
    it('forwards pageFilter to all useBffData calls', () => {
      renderHook(() => useCategoryData('Megabrands'));

      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: SharedKpis.GLOBAL.ZONE_PERFORMANCE,
          kpiGroup: 'power',
          subFilters: { page_filter: 'Megabrands' },
          skipRequest: false,
        }),
      );
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: SharedKpis.GLOBAL.BIG_NUMBERS,
          kpiGroup: 'power',
          subFilters: { page_filter: 'Megabrands' },
          skipRequest: false,
        }),
      );
      expect(mockUseBffData).toHaveBeenCalledWith(
        expect.objectContaining({
          id: SharedKpis.BFF.ZONE_MATURITY,
          kpiGroup: 'power',
          subFilters: { page_filter: 'Megabrands' },
          skipRequest: false,
        }),
      );
    });

    it('forwards pageFilter and enabled flag to useZonePerformanceDetails', () => {
      renderHook(() => useCategoryData('Corona', false));

      expect(mockUseZonePerformanceDetails).toHaveBeenCalledWith(
        'Corona',
        false,
      );
    });
  });

  describe('enabled flag', () => {
    it('passes skipRequest=false when enabled is true (default)', () => {
      renderHook(() => useCategoryData('All'));

      expect(mockUseBffData).toHaveBeenCalledTimes(3);
      mockUseBffData.mock.calls.forEach(([args]) => {
        expect(args.skipRequest).toBe(false);
      });
    });

    it('passes skipRequest=true to every useBffData when enabled is false', () => {
      renderHook(() => useCategoryData('All', false));

      expect(mockUseBffData).toHaveBeenCalledTimes(3);
      mockUseBffData.mock.calls.forEach(([args]) => {
        expect(args.skipRequest).toBe(true);
      });
    });
  });

  describe('loading aggregation', () => {
    it('returns loading=false when no source is loading', () => {
      const { result } = renderHook(() => useCategoryData('All'));

      expect(result.current.loading).toBe(false);
    });

    it('returns loading=true when zonePerformanceDetails is loading', () => {
      mockUseZonePerformanceDetails.mockReturnValue(
        buildZoneDetailsResponse({ loading: true }),
      );

      const { result } = renderHook(() => useCategoryData('All'));

      expect(result.current.loading).toBe(true);
    });

    it.each([
      ['zonePerformance', 0],
      ['bigNumbers', 1],
      ['maturityPerformance', 2],
    ])(
      'returns loading=true when the %s request is loading',
      (_label, loadingIndex) => {
        for (let i = 0; i < 3; i++) {
          mockUseBffData.mockReturnValueOnce(
            buildBffResponse({ loading: i === loadingIndex }),
          );
        }

        const { result } = renderHook(() => useCategoryData('All'));

        expect(result.current.loading).toBe(true);
      },
    );
  });

  describe('error aggregation', () => {
    it('returns null when no source has error', () => {
      const { result } = renderHook(() => useCategoryData('All'));

      expect(result.current.error).toBeNull();
    });

    it('returns the error from zonePerformanceDetails when present', () => {
      const error = new Error('zone-details-error');
      mockUseZonePerformanceDetails.mockReturnValue(
        buildZoneDetailsResponse({ error }),
      );

      const { result } = renderHook(() => useCategoryData('All'));

      expect(result.current.error).toBe(error);
    });

    it.each([
      ['zonePerformance', 0],
      ['bigNumbers', 1],
      ['maturityPerformance', 2],
    ])('propagates the error from the %s request', (label, errorIndex) => {
      const error = new Error(`${label}-error`);
      for (let i = 0; i < 3; i++) {
        mockUseBffData.mockReturnValueOnce(
          buildBffResponse({ error: i === errorIndex ? error : null }),
        );
      }

      const { result } = renderHook(() => useCategoryData('All'));

      expect(result.current.error).toBe(error);
    });
  });

  describe('data aggregation', () => {
    it('exposes maturityPerformance.data and zonePerformance.data, plus full bigNumbers and zonePerformanceDetails', () => {
      const zonePerformanceData = { id: 'zone-performance' };
      const bigNumbersData = { id: 'big-numbers' };
      const maturityData = { id: 'maturity' };
      const zoneDetails = buildZoneDetailsResponse();

      mockUseZonePerformanceDetails.mockReturnValue(zoneDetails);
      mockUseBffData
        .mockReturnValueOnce(buildBffResponse({ data: zonePerformanceData }))
        .mockReturnValueOnce(buildBffResponse({ data: bigNumbersData }))
        .mockReturnValueOnce(buildBffResponse({ data: maturityData }));

      const { result } = renderHook(() => useCategoryData('All'));

      expect(result.current.data.zonePerformance).toEqual(zonePerformanceData);
      expect(result.current.data.maturityPerformance).toEqual(maturityData);
      expect(result.current.data.bigNumbers.data).toEqual(bigNumbersData);
      expect(result.current.data.zonePerformanceDetails).toBe(zoneDetails);
    });
  });
});
