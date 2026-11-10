import { renderHook } from '@testing-library/react-hooks';

import { BFF_VIEW_ID } from '../constants';
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

  it('should configure useBffData with correct BFF params', () => {
    renderHook(() => useKpiRequests());

    expect(mockUseBffData).toHaveBeenCalledWith(
      expect.objectContaining({
        id: BFF_VIEW_ID,
        kpiGroup: 'media',
      }),
    );
  });

  it('should extract investment_breakdown from BFF data', () => {
    const tableData = { rows: [], columns: [] };
    mockUseBffData.mockReturnValue({
      data: {
        investment_breakdown: { investment_breakdown: tableData },
      },
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKpiRequests());

    expect(result.current.data).toEqual({ investment_breakdown: tableData });
  });

  it('should handle undefined BFF data', () => {
    mockUseBffData.mockReturnValue({
      data: null,
      loading: false,
      error: null,
    });

    const { result } = renderHook(() => useKpiRequests());

    expect(result.current.data).toEqual({
      investment_breakdown: undefined,
    });
  });

  it('should passthrough loading and error from useBffData', () => {
    const mockError = new Error('API Error');
    mockUseBffData.mockReturnValue({
      data: null,
      loading: true,
      error: mockError,
    });

    const { result } = renderHook(() => useKpiRequests());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(mockError);
  });
});
