import { renderHook } from '@testing-library/react-hooks';

import { DEFAULT_ENDPOINTS } from '../../config/api';
import { useCountrySlideData } from './useCountrySlideData';

const mockUseBffData = jest.fn();

jest.mock('hooks', () => ({
  useBffData: (args: unknown) => mockUseBffData(args),
  useFeatureToggle: jest.fn(() => [false, false]),
  usePageFilterApplied: jest.fn(() => ({ applied: {} })),
}));

describe('useCountrySlideData', () => {
  const defaultBffReturn = {
    data: { 'big-numbers': [], 'line-chart': {} },
    loading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBffData.mockReturnValue(defaultBffReturn);
  });

  it('should call useBffData with id, kpiGroup and subFilters', () => {
    const kpi = 'volume';
    const subFilters = { country: 'USA', page_type: 'country' };

    renderHook(() => useCountrySlideData(kpi, subFilters));

    expect(mockUseBffData).toHaveBeenCalledTimes(1);
    expect(mockUseBffData).toHaveBeenCalledWith({
      id: DEFAULT_ENDPOINTS.country,
      kpiGroup: 'volume',
      subFilters,
    });
  });

  it('should return the result of useBffData', () => {
    const kpi = 'volume';
    const subFilters = { country: 'BRA', page_type: 'country' };
    const { result } = renderHook(() => useCountrySlideData(kpi, subFilters));

    expect(result.current).toEqual(defaultBffReturn);
  });

  it('should call useBffData with kpiGroup finance when kpi is nr', () => {
    const subFilters = { country: 'USA', page_type: 'country' };

    renderHook(() => useCountrySlideData('nr', subFilters));

    expect(mockUseBffData).toHaveBeenCalledWith({
      id: DEFAULT_ENDPOINTS.country,
      kpiGroup: 'finance',
      subFilters,
    });
  });
});
