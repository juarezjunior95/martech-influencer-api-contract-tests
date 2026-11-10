import { renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

import { usePowerBookCountryData } from './usePowerBookCountryData';

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

const SLOTS = [
  'ttABI',
  'ttABIMegabrands',
  'ABIBrandBreakdown',
  'power',
  'CompetitorBrandBreakdown',
] as const;

const mockSlots = (
  overrides: Partial<Record<(typeof SLOTS)[number], unknown>>,
) => {
  SLOTS.forEach((slot) => {
    mockUseBffData.mockReturnValueOnce(
      buildBffResponse(overrides[slot] as object | undefined),
    );
  });
};

describe('usePowerBookCountryData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue(buildBffResponse());
  });

  describe('return shape', () => {
    it('exposes data and isLoading fields with all expected slots', () => {
      const { result } = renderHook(() => usePowerBookCountryData());

      expect(result.current.isLoadingCountryData).toEqual(expect.any(Boolean));
      SLOTS.forEach((slot) => {
        expect(result.current.data).toHaveProperty(slot);
      });
    });

    it('keeps data referentially stable between renders when inputs do not change', () => {
      const { result, rerender } = renderHook(() => usePowerBookCountryData());

      const firstData = result.current.data;
      rerender();

      expect(result.current.data).toBe(firstData);
    });
  });

  describe('useBffData wiring', () => {
    it('calls useBffData exactly 5 times with the expected configurations', () => {
      renderHook(() => usePowerBookCountryData());

      expect(mockUseBffData).toHaveBeenCalledTimes(5);

      expect(mockUseBffData).toHaveBeenNthCalledWith(1, {
        id: SharedKpis.BFF.OVERVIEW,
        kpiGroup: 'power',
        subFilters: { page_filter: 'All' },
      });

      expect(mockUseBffData).toHaveBeenNthCalledWith(2, {
        id: SharedKpis.BFF.OVERVIEW,
        kpiGroup: 'power',
        subFilters: { page_filter: 'Megabrands' },
      });

      expect(mockUseBffData).toHaveBeenNthCalledWith(3, {
        id: SharedKpis.COUNTRY.BRAND_BREAKDOWN,
        kpiGroup: 'power',
        subFilters: {
          page_filter: 'All',
          breakdown_filter: 'TT ABI Portfolio',
        },
      });

      expect(mockUseBffData).toHaveBeenNthCalledWith(4, {
        id: SharedKpis.BFF.SUMMARY_FOR_POWER,
        kpiGroup: 'power',
        subFilters: { page_filter: 'All' },
      });

      expect(mockUseBffData).toHaveBeenNthCalledWith(5, {
        id: SharedKpis.COUNTRY.BRAND_BREAKDOWN,
        kpiGroup: 'power',
        subFilters: { page_filter: 'All', breakdown_filter: 'TT ABI Segment' },
      });
    });
  });

  describe('isLoading aggregation', () => {
    it('returns isLoading=false when no source is loading', () => {
      const { result } = renderHook(() => usePowerBookCountryData());

      expect(result.current.isLoadingCountryData).toBe(false);
    });

    it.each(SLOTS)('returns isLoading=true when %s is loading', (slot) => {
      mockUseBffData.mockReset();
      mockSlots({ [slot]: { loading: true } });

      const { result } = renderHook(() => usePowerBookCountryData());

      expect(result.current.isLoadingCountryData).toBe(true);
    });
  });

  describe('data propagation', () => {
    it('exposes the full BFF response object for every slot', () => {
      mockUseBffData.mockReset();

      const slotsData: Record<(typeof SLOTS)[number], unknown> = {
        ttABI: { id: 'tt-abi' },
        ttABIMegabrands: { id: 'tt-abi-megabrands' },
        ABIBrandBreakdown: { id: 'abi-brand-breakdown' },
        power: { id: 'power' },
        CompetitorBrandBreakdown: { id: 'competitor-brand-breakdown' },
      };

      SLOTS.forEach((slot) => {
        mockUseBffData.mockReturnValueOnce(
          buildBffResponse({ data: slotsData[slot] }),
        );
      });

      const { result } = renderHook(() => usePowerBookCountryData());

      SLOTS.forEach((slot) => {
        expect(result.current.data[slot].data).toEqual(slotsData[slot]);
      });
    });

    it.each(SLOTS)(
      'propagates the error from %s to the corresponding slot',
      (slot) => {
        mockUseBffData.mockReset();
        const error = new Error(`${slot}-error`);
        mockSlots({ [slot]: { error } });

        const { result } = renderHook(() => usePowerBookCountryData());

        expect(result.current.data[slot].error).toBe(error);
      },
    );
  });
});
