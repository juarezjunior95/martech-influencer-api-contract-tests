import { renderHook } from '@testing-library/react-hooks';

import { BFF_TABLE_VIEWS_IDS } from '../constants';
import { useOverviewTable } from './useOverviewTable';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (config: unknown) => mockUseBffData(config),
}));

describe('useOverviewTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('configures useBffData with correct params', () => {
    renderHook(() => useOverviewTable('media_spend'));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BFF_TABLE_VIEWS_IDS.media_spend,
        kpiGroup: 'media',
        subFilters: { kpi: 'media_spend' },
      }),
    );
  });

  it('updates config when subfilter changes', () => {
    const { rerender } = renderHook(
      ({ subfilter }) => useOverviewTable(subfilter),
      { initialProps: { subfilter: 'media_spend' } },
    );

    mockUseBffData.mockClear();
    rerender({ subfilter: 'megabrands' });

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BFF_TABLE_VIEWS_IDS.megabrands,
        subFilters: { kpi: 'megabrands' },
      }),
    );
  });

  it('returns data, loading, and error from useBffData', () => {
    const mockError = new Error('API Error');
    mockUseBffData.mockReturnValue({
      data: { media_spend: { rowData: [], columnDefs: [] } },
      loading: true,
      error: mockError,
    });

    const { result } = renderHook(() => useOverviewTable('media_spend'));

    expect(result.current.data).toEqual({ rowData: [], columnDefs: [] });
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(mockError);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
  ])('handles %s subfilter by using empty string fallback', (_, subfilter) => {
    renderHook(() => useOverviewTable(subfilter));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '',
        subFilters: { kpi: subfilter },
      }),
    );
  });
});
