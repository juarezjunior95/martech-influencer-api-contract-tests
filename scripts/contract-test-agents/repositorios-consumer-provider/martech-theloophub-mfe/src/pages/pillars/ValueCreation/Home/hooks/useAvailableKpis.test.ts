import { act, renderHook } from '@testing-library/react-hooks';

import { useAvailableKpis } from './useAvailableKpis';

const mockGetData = jest.fn();

jest.mock('services', () => ({
  BffService: {
    getInstance: () => ({
      getData: mockGetData,
    }),
  },
}));

const KPI_ITEM = { value: '', label: '', full: '' };

function kpiValues(
  values: Array<{ value: string; label: string; full?: string }>,
) {
  return values.map((v) => ({ ...KPI_ITEM, full: '', ...v }));
}

function successResponse(
  values: Array<{ value: string; label: string; full?: string }>,
) {
  return {
    hasError: false,
    data: {
      data: {
        kpis: {
          values: kpiValues(values),
          default: { value: 'volume', label: 'Volume', full: '' },
          enabled: true,
        },
      },
    },
  };
}

const EXPECTED_GET_DATA_CALL = {
  endpoint: '/presets/sub-filters_kpis',
  params: { 'kpis[kpi_groups]': 'performance_tool' },
};

async function renderHookUntilSettled() {
  const { result, waitForNextUpdate } = renderHook(() => useAvailableKpis());
  await act(async () => {
    await waitForNextUpdate();
  });
  return result;
}

describe('useAvailableKpis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with loading true and empty set', () => {
    mockGetData.mockReturnValue(
      new Promise(() => {
        void 0;
      }),
    );

    const { result } = renderHook(() => useAvailableKpis());

    expect(result.current.loading).toBe(true);
    expect(result.current.availableKpis.size).toBe(0);
  });

  describe('when the request settles successfully', () => {
    it.each([
      {
        caseName: 'should fetch and set available kpis from API',
        arrange: () =>
          mockGetData.mockResolvedValue(
            successResponse([
              { value: 'volume', label: 'Volume' },
              { value: 'nr', label: 'Net Revenue' },
              { value: 'cores', label: 'CORES' },
              { value: 'market_share', label: 'Market Share' },
              { value: 'power', label: 'Brand Power' },
            ]),
          ),
        assert: (result: { current: ReturnType<typeof useAvailableKpis> }) => {
          expect(result.current.availableKpis).toEqual(
            new Set(['volume', 'nr', 'cores', 'market_share', 'power']),
          );
          expect(mockGetData).toHaveBeenCalledWith(EXPECTED_GET_DATA_CALL);
        },
      },
      {
        caseName: 'should return a subset of kpis when API returns fewer items',
        arrange: () =>
          mockGetData.mockResolvedValue(
            successResponse([
              { value: 'volume', label: 'Volume' },
              { value: 'market_share', label: 'Market Share' },
            ]),
          ),
        assert: (result: { current: ReturnType<typeof useAvailableKpis> }) => {
          expect(result.current.availableKpis).toEqual(
            new Set(['volume', 'market_share']),
          );
        },
      },
    ])('$caseName', async ({ arrange, assert }) => {
      arrange();
      const result = await renderHookUntilSettled();

      expect(result.current.loading).toBe(false);
      assert(result);
    });
  });

  describe('when the request yields no KPIs', () => {
    it.each([
      {
        caseName: 'should handle API error gracefully',
        arrange: () =>
          mockGetData.mockResolvedValue({
            hasError: true,
            message: 'Failed',
          }),
        assertConsole: 'failed' as const,
      },
      {
        caseName: 'should handle network error gracefully',
        arrange: () =>
          mockGetData.mockRejectedValue(new Error('Network error')),
        assertConsole: 'network' as const,
      },
      {
        caseName: 'should handle missing kpis data in response',
        arrange: () =>
          mockGetData.mockResolvedValue({
            hasError: false,
            data: { data: {} },
          }),
        assertConsole: 'none' as const,
      },
    ])('$caseName', async ({ arrange, assertConsole }) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      arrange();
      const result = await renderHookUntilSettled();

      expect(result.current.loading).toBe(false);
      expect(result.current.availableKpis.size).toBe(0);

      if (assertConsole === 'failed') {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Failed to fetch available KPIs',
        );
      } else if (assertConsole === 'network') {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Error fetching available KPIs:',
          expect.any(Error),
        );
      } else {
        expect(consoleSpy).not.toHaveBeenCalled();
      }

      consoleSpy.mockRestore();
    });
  });
});
