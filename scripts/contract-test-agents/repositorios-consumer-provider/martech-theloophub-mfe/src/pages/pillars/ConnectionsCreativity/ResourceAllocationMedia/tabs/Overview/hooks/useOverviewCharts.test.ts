import { renderHook } from '@testing-library/react-hooks';

import { BFF_VIEW_IDS } from '../constants';
import { useOverviewCharts } from './useOverviewCharts';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (config: unknown) => mockUseBffData(config),
}));

describe('useOverviewCharts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('calls useBffData for all 4 chart KPIs and returns structure', () => {
    const { result } = renderHook(() => useOverviewCharts());

    expect(mockUseBffData).toHaveBeenCalledTimes(4);
    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BFF_VIEW_IDS.mediaSpend,
        kpiGroup: 'media',
      }),
    );
    expect(result.current.mediaSpend).toBeDefined();
    expect(result.current.megaBrands).toBeDefined();
    expect(result.current.campaigns).toBeDefined();
    expect(result.current.resourceAllocation).toBeDefined();
  });

  it('returns individual data/loading/error states per chart', () => {
    mockUseBffData
      .mockReturnValueOnce({
        data: { media_spend_index: { value: 100 } },
        loading: false,
        error: null,
      })
      .mockReturnValueOnce({ data: null, loading: true, error: null })
      .mockReturnValueOnce({
        data: null,
        loading: false,
        error: new Error('fail'),
      })
      .mockReturnValueOnce({ data: null, loading: false, error: null });

    const { result } = renderHook(() => useOverviewCharts());

    expect(result.current.mediaSpend.data).toEqual({ value: 100 });
    expect(result.current.megaBrands.loading).toBe(true);
    expect(result.current.campaigns.error).toBeInstanceOf(Error);
    expect(result.current.resourceAllocation.data).toBeUndefined();
  });
});
