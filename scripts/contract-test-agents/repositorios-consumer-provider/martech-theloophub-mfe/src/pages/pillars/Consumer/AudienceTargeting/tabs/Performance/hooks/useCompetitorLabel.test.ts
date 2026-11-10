import { renderHook } from '@testing-library/react-hooks';

import { useCompetitorLabel } from './useCompetitorLabel';

const mockGetOptions = jest.fn();

let mockApplied: Record<string, string | undefined> | null = {
  audience_targeting_brands_comp: 'HEINEKEN',
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

describe('useCompetitorLabel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApplied = { audience_targeting_brands_comp: 'HEINEKEN' };
    mockDataFilters = { some: 'data' };
    mockGetOptions.mockReturnValue([]);
  });

  test('should return empty string when dataFilters is null', () => {
    mockDataFilters = null;

    const { result } = renderHook(() => useCompetitorLabel());

    expect(result.current).toBe('');
    expect(mockGetOptions).not.toHaveBeenCalled();
  });

  test('should return empty string when applied is null', () => {
    mockApplied = null;

    const { result } = renderHook(() => useCompetitorLabel());

    expect(result.current).toBe('');
    expect(mockGetOptions).not.toHaveBeenCalled();
  });

  test('should return the matched option label when a match is found', () => {
    mockGetOptions.mockReturnValue([
      { value: 'HEINEKEN', label: 'Heineken' },
      { value: 'OTHER', label: 'Other Brand' },
    ]);

    const { result } = renderHook(() => useCompetitorLabel());

    expect(result.current).toBe('Heineken');
  });

  test('should fall back to raw applied value when no matching option exists', () => {
    mockGetOptions.mockReturnValue([{ value: 'OTHER', label: 'Other' }]);

    const { result } = renderHook(() => useCompetitorLabel());

    expect(result.current).toBe('HEINEKEN');
  });

  test('should return empty string when applied value is undefined and no option matches', () => {
    mockApplied = { audience_targeting_brands_comp: undefined };
    mockGetOptions.mockReturnValue([]);

    const { result } = renderHook(() => useCompetitorLabel());

    expect(result.current).toBe('');
  });
});
