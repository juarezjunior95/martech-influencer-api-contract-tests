import { renderHook } from '@testing-library/react-hooks';

import { BFF_VIEW_IDS } from '../constants';
import { useKpiRequests } from './useKpiRequests';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (config: unknown) => mockUseBffData(config),
}));

describe('useKpiRequests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });
  });

  it('should call useBffData for all 3 charts and return correct structure', () => {
    const { result } = renderHook(() => useKpiRequests());

    expect(mockUseBffData).toHaveBeenCalledTimes(3);
    expect(result.current.charts.mediaQwoa).toBeDefined();
    expect(result.current.charts.nonWorkingMoney).toBeDefined();
    expect(result.current.charts.campaignQwoa).toBeDefined();
  });

  it('should configure mediaQwoa with correct BFF params', () => {
    renderHook(() => useKpiRequests());

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BFF_VIEW_IDS.media_qwoa,
        kpiGroup: 'media',
      }),
    );
  });

  it('should extract chart-specific data from BFF response', () => {
    const chartData = { someKey: 'value' };
    mockUseBffData.mockReturnValue({
      data: { media_qwoa: chartData },
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKpiRequests());

    expect(result.current.charts.mediaQwoa.data).toEqual(chartData);
  });

  it('should handle mixed states across charts', () => {
    let callCount = 0;
    mockUseBffData.mockImplementation(() => {
      callCount++;
      if (callCount === 1)
        return {
          data: { media_qwoa: 'data1' },
          loading: false,
          error: null,
        };
      if (callCount === 2) return { data: null, loading: true, error: null };
      return { data: null, loading: false, error: new Error('Error') };
    });

    const { result } = renderHook(() => useKpiRequests());

    expect(result.current.charts.mediaQwoa.data).toBe('data1');
    expect(result.current.charts.nonWorkingMoney.loading).toBe(true);
    expect(result.current.charts.campaignQwoa.error).toBeInstanceOf(Error);
  });
});
