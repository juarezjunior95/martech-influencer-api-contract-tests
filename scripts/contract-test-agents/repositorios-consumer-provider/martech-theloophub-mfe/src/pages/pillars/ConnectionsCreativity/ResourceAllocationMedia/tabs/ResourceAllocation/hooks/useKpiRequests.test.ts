import { renderHook } from '@testing-library/react-hooks';

import { BFF_VIEW_ID } from '../constants';
import { useKpiRequests } from './useKpiRequests';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (config: unknown) => mockUseBffData(config),
}));

describe('useKpiRequests', () => {
  const defaultParams = { kpiFilter: 'some-kpi', isGlobalZone: false };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('should configure useBffData for country view', () => {
    renderHook(() => useKpiRequests(defaultParams));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BFF_VIEW_ID,
        kpiGroup: 'media',
        subFilters: { kpi_filter: 'some-kpi', view_type: 'country' },
      }),
    );
  });

  it('should use global view_type when isGlobalZone is true', () => {
    renderHook(() => useKpiRequests({ ...defaultParams, isGlobalZone: true }));

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        subFilters: expect.objectContaining({ view_type: 'global' }),
      }),
    );
  });

  it('should extract bar_charts_country from BFF data', () => {
    const chartData = { rows: [], columns: [] };
    mockUseBffData.mockReturnValue({
      data: { bar_charts_country: chartData },
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKpiRequests(defaultParams));

    expect(result.current.data).toEqual(chartData);
  });

  it('should passthrough loading and error from useBffData', () => {
    mockUseBffData.mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    const { result } = renderHook(() => useKpiRequests(defaultParams));

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
