import { renderHook } from '@testing-library/react-hooks';

import { useBrandLabel } from './useBrandLabel';

const mockGetOptions = jest.fn();

let mockApplied: Record<string, string | undefined> | null = {
  audience_targeting_brands: 'CORONA',
};

let mockDataFilters: Record<string, unknown> | null = { some: 'data' };

jest.mock('../../../constants', () => ({
  FILTER_CONFIG_PERFORMANCE: { pageName: 'performance-page' },
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: () => ({ applied: mockApplied }),
  usePageFilterData: () => ({ dataFilters: mockDataFilters }),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getOptions: (...args: string[]) => mockGetOptions(...args),
    }),
  },
}));

describe('useBrandLabel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = { audience_targeting_brands: 'CORONA' };
    mockDataFilters = { some: 'data' };
    mockGetOptions.mockReturnValue([]);
  });

  test('should return empty string when dataFilters is null', () => {
    mockDataFilters = null;

    const { result } = renderHook(() => useBrandLabel());

    expect(result.current).toBe('');
    expect(mockGetOptions).not.toHaveBeenCalled();
  });

  test('should return empty string when applied is null', () => {
    mockApplied = null;

    const { result } = renderHook(() => useBrandLabel());

    expect(result.current).toBe('');
    expect(mockGetOptions).not.toHaveBeenCalled();
  });

  test('should return the matched option label when a match is found', () => {
    mockGetOptions.mockReturnValue([
      { value: 'CORONA', label: 'Corona' },
      { value: 'OTHER', label: 'Other Brand' },
    ]);

    const { result } = renderHook(() => useBrandLabel());

    expect(result.current).toBe('Corona');
  });

  test('should fall back to raw applied value when no matching option exists', () => {
    mockGetOptions.mockReturnValue([{ value: 'OTHER', label: 'Other' }]);

    const { result } = renderHook(() => useBrandLabel());

    expect(result.current).toBe('CORONA');
  });

  test('should return empty string when applied value is undefined and no option matches', () => {
    mockApplied = { audience_targeting_brands: undefined };
    mockGetOptions.mockReturnValue([]);

    const { result } = renderHook(() => useBrandLabel());

    expect(result.current).toBe('');
  });
});
