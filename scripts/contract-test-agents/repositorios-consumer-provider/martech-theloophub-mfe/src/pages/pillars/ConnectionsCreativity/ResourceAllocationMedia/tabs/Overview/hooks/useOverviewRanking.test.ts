import { renderHook } from '@testing-library/react-hooks';

import { BFF_RANKING } from '../constants';
import { useOverviewRanking } from './useOverviewRanking';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (config: unknown) => mockUseBffData(config),
}));

describe('useOverviewRanking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('configures useBffData with correct params', () => {
    renderHook(() => useOverviewRanking('media_spend'));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BFF_RANKING.media_spend.viewId,
        kpiGroup: 'media',
        subFilters: { kpi_name: 'media_spend' },
      }),
    );
  });

  it('updates config when subfilter changes', () => {
    const { rerender } = renderHook(
      ({ subfilter }) => useOverviewRanking(subfilter),
      { initialProps: { subfilter: 'media_spend' } },
    );

    mockUseBffData.mockClear();
    rerender({ subfilter: 'megabrands' });

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BFF_RANKING.megabrands.viewId,
        subFilters: { kpi_name: 'megabrands' },
      }),
    );
  });

  it('returns data, loading, and error from useBffData', () => {
    const mockError = new Error('API Error');
    const componentId = BFF_RANKING.media_spend.componentId;
    mockUseBffData.mockReturnValue({
      data: { [componentId]: { ranking: 'data' } },
      loading: true,
      error: mockError,
    });

    const { result } = renderHook(() => useOverviewRanking('media_spend'));

    expect(result.current.data).toEqual({ ranking: 'data' });
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(mockError);
  });

  it('handles undefined viewId by using empty string fallback', () => {
    renderHook(() => useOverviewRanking('unknown_subfilter'));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '',
        subFilters: { kpi_name: 'unknown_subfilter' },
      }),
    );
  });
});
