import { act, renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';
import { SharedKpis } from 'pages/enums';

import { useCategoryData } from '../useCategoryData/useCategoryData';
import { usePowerBookGlobalData } from './usePowerBookGlobalData';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

jest.mock('../useCategoryData/useCategoryData', () => ({
  useCategoryData: jest.fn(),
}));

const mockUseBffData = useBffData as jest.Mock;
const mockUseCategoryData = useCategoryData as jest.Mock;

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

const buildCategoryResponse = (
  overrides: Partial<{ loading: boolean; error: Error | null }> = {},
) => ({
  data: {
    maturityPerformance: null,
    zonePerformanceDetails: {},
    zonePerformance: null,
    bigNumbers: buildBffResponse(),
  },
  loading: false,
  error: null,
  ...overrides,
});

const WAVE1_CATEGORIES = ['All', 'Megabrands'] as const;
const WAVE2_CATEGORIES = [
  'Mainstream',
  'Core+',
  'Premiumization',
  'Expansion',
  'Sustain',
  'Tail',
] as const;
const WAVE3_CATEGORIES = [
  'All Global Brands',
  'Corona',
  'Budweiser',
  'Michelob Ultra',
  'Stella Artois',
  'Heineken',
] as const;

const ALL_CATEGORIES = [
  ...WAVE1_CATEGORIES,
  ...WAVE2_CATEGORIES,
  ...WAVE3_CATEGORIES,
] as const;

describe('usePowerBookGlobalData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue(buildBffResponse());
    mockUseCategoryData.mockImplementation(() => buildCategoryResponse());
  });

  describe('return shape', () => {
    it('exposes globalData, loading, error and loadDurationMs', () => {
      const { result } = renderHook(() => usePowerBookGlobalData());

      expect(result.current).toEqual(
        expect.objectContaining({
          globalData: expect.any(Object),
          loading: expect.any(Boolean),
          error: null,
          loadDurationMs: expect.anything(),
        }),
      );
    });

    it('exposes globalData with all expected category buckets and aggregations', () => {
      const { result } = renderHook(() => usePowerBookGlobalData());

      expect(result.current.globalData).toEqual(
        expect.objectContaining({
          global: expect.any(Object),
          megabrands: expect.any(Object),
          mainstream: expect.any(Object),
          core: expect.any(Object),
          premiumization: expect.any(Object),
          expansion: expect.any(Object),
          sustain: expect.any(Object),
          tail: expect.any(Object),
          globalBrands: expect.any(Object),
          corona: expect.any(Object),
          budweiser: expect.any(Object),
          michelobUltra: expect.any(Object),
          stellaArtois: expect.any(Object),
          heineken: expect.any(Object),
          contribution: expect.objectContaining({
            global: expect.any(Object),
            megabrands: expect.any(Object),
          }),
          trendPowerEvolutionData: expect.objectContaining({
            global: expect.any(Object),
            megabrands: expect.any(Object),
          }),
        }),
      );
    });
  });

  describe('useCategoryData wiring (wave 1)', () => {
    it('keeps only wave-1 categories enabled while wave 1 is loading', () => {
      mockUseCategoryData.mockImplementation((category: string) =>
        buildCategoryResponse({
          loading: WAVE1_CATEGORIES.includes(
            category as (typeof WAVE1_CATEGORIES)[number],
          ),
        }),
      );

      renderHook(() => usePowerBookGlobalData());

      WAVE1_CATEGORIES.forEach((category) => {
        expect(mockUseCategoryData).toHaveBeenCalledWith(category, true);
      });
      WAVE2_CATEGORIES.forEach((category) => {
        expect(mockUseCategoryData).toHaveBeenCalledWith(category, false);
      });
      WAVE3_CATEGORIES.forEach((category) => {
        expect(mockUseCategoryData).toHaveBeenCalledWith(category, false);
      });
    });

    it('calls useCategoryData once per category on every render', () => {
      mockUseCategoryData.mockImplementation((category: string) =>
        buildCategoryResponse({
          loading: WAVE1_CATEGORIES.includes(
            category as (typeof WAVE1_CATEGORIES)[number],
          ),
        }),
      );

      renderHook(() => usePowerBookGlobalData());

      ALL_CATEGORIES.forEach((category) => {
        const callsForCategory = mockUseCategoryData.mock.calls.filter(
          ([name]) => name === category,
        );
        expect(callsForCategory).toHaveLength(1);
      });
    });
  });

  describe('useBffData wiring (top country contribution / trend power evolution)', () => {
    it('calls TOP_COUNTRY_CONTRIBUTION twice with the expected subFilters and skipRequest=false on wave 1', () => {
      mockUseBffData.mockReturnValue(buildBffResponse({ loading: true }));

      renderHook(() => usePowerBookGlobalData());

      expect(mockUseBffData).toHaveBeenCalledWith({
        id: SharedKpis.GLOBAL.TOP_COUNTRY_CONTRIBUTION,
        kpiGroup: 'power',
        subFilters: { page_filter: 'All' },
        skipRequest: false,
      });
      expect(mockUseBffData).toHaveBeenCalledWith({
        id: SharedKpis.GLOBAL.TOP_COUNTRY_CONTRIBUTION,
        kpiGroup: 'power',
        subFilters: { page_filter: 'Megabrands', scope: 'Megabrands' },
        skipRequest: false,
      });
    });

    it('calls TREND_POWER_EVOLUTION twice with the expected subFilters and skipRequest=false on wave 1', () => {
      mockUseBffData.mockReturnValue(buildBffResponse({ loading: true }));

      renderHook(() => usePowerBookGlobalData());

      expect(mockUseBffData).toHaveBeenCalledWith({
        id: SharedKpis.GLOBAL.TREND_POWER_EVOLUTION,
        kpiGroup: 'power',
        subFilters: { page_filter: 'All' },
        skipRequest: false,
      });
      expect(mockUseBffData).toHaveBeenCalledWith({
        id: SharedKpis.GLOBAL.TREND_POWER_EVOLUTION,
        kpiGroup: 'power',
        subFilters: { page_filter: 'Megabrands', scope: 'Megabrands' },
        skipRequest: false,
      });
    });

    it('makes exactly 4 useBffData calls per render (TOP_COUNTRY_CONTRIBUTION + TREND_POWER_EVOLUTION, both global and megabrands)', () => {
      mockUseBffData.mockReturnValue(buildBffResponse({ loading: true }));

      renderHook(() => usePowerBookGlobalData());

      expect(mockUseBffData).toHaveBeenCalledTimes(4);
    });
  });

  describe('loading aggregation', () => {
    it('returns loading=false when nothing is loading on the active wave', () => {
      const { result } = renderHook(() => usePowerBookGlobalData());

      expect(result.current.loading).toBe(false);
    });

    it('returns loading=true when a wave-1 category is loading', () => {
      mockUseCategoryData.mockImplementation((category: string) =>
        buildCategoryResponse({ loading: category === 'All' }),
      );

      const { result } = renderHook(() => usePowerBookGlobalData());

      expect(result.current.loading).toBe(true);
    });

    it('returns loading=true when a wave-1 useBffData is loading', () => {
      mockUseBffData.mockReturnValue(buildBffResponse({ loading: true }));

      const { result } = renderHook(() => usePowerBookGlobalData());

      expect(result.current.loading).toBe(true);
    });
  });

  describe('error aggregation', () => {
    it('returns the error from a category when present', () => {
      const error = new Error('global-error');
      mockUseCategoryData.mockImplementation((category: string) =>
        buildCategoryResponse({ error: category === 'All' ? error : null }),
      );

      const { result } = renderHook(() => usePowerBookGlobalData());

      expect(result.current.error).toBe(error);
    });

    it('returns the error from any useBffData call when present', () => {
      const error = new Error('bff-error');
      mockUseBffData.mockReturnValue(buildBffResponse({ error }));

      const { result } = renderHook(() => usePowerBookGlobalData());

      expect(result.current.error).toBe(error);
    });
  });

  describe('wave transitions', () => {
    it('jumps straight to wave 3 (all categories enabled) when nothing ever loads', () => {
      renderHook(() => usePowerBookGlobalData());

      ALL_CATEGORIES.forEach((category) => {
        expect(mockUseCategoryData).toHaveBeenCalledWith(category, true);
      });
    });

    it('keeps wave-2 and wave-3 disabled while wave 1 is still loading', () => {
      mockUseCategoryData.mockImplementation((category: string) =>
        buildCategoryResponse({
          loading: WAVE1_CATEGORIES.includes(
            category as (typeof WAVE1_CATEGORIES)[number],
          ),
        }),
      );

      renderHook(() => usePowerBookGlobalData());

      WAVE2_CATEGORIES.forEach((category) => {
        expect(mockUseCategoryData).toHaveBeenCalledWith(category, false);
      });
      WAVE3_CATEGORIES.forEach((category) => {
        expect(mockUseCategoryData).toHaveBeenCalledWith(category, false);
      });
    });

    it('keeps wave-3 disabled while wave 2 is still loading', () => {
      mockUseCategoryData.mockImplementation((category: string) =>
        buildCategoryResponse({
          loading: WAVE2_CATEGORIES.includes(
            category as (typeof WAVE2_CATEGORIES)[number],
          ),
        }),
      );

      renderHook(() => usePowerBookGlobalData());

      WAVE3_CATEGORIES.forEach((category) => {
        expect(mockUseCategoryData).toHaveBeenCalledWith(category, false);
      });
    });

    it('enables wave-3 categories once wave 2 finishes', () => {
      let wave2Loading = true;
      mockUseCategoryData.mockImplementation((category: string) =>
        buildCategoryResponse({
          loading:
            wave2Loading &&
            WAVE2_CATEGORIES.includes(
              category as (typeof WAVE2_CATEGORIES)[number],
            ),
        }),
      );

      const { rerender } = renderHook(() => usePowerBookGlobalData());

      WAVE3_CATEGORIES.forEach((category) => {
        expect(mockUseCategoryData).toHaveBeenCalledWith(category, false);
      });

      mockUseCategoryData.mockClear();
      act(() => {
        wave2Loading = false;
        rerender();
      });

      WAVE3_CATEGORIES.forEach((category) => {
        expect(mockUseCategoryData).toHaveBeenCalledWith(category, true);
      });
    });
  });

  describe('loadDurationMs', () => {
    it('stays null while there is something loading and is set when loading completes', () => {
      let isLoading = true;
      mockUseCategoryData.mockImplementation((category: string) =>
        buildCategoryResponse({
          loading:
            isLoading &&
            WAVE1_CATEGORIES.includes(
              category as (typeof WAVE1_CATEGORIES)[number],
            ),
        }),
      );

      const performanceNowSpy = jest
        .spyOn(performance, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValue(1500);

      const { result, rerender } = renderHook(() => usePowerBookGlobalData());

      expect(result.current.loading).toBe(true);
      expect(result.current.loadDurationMs).toBeNull();

      act(() => {
        isLoading = false;
        rerender();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.loadDurationMs).toBe(500);

      performanceNowSpy.mockRestore();
    });
  });
});
