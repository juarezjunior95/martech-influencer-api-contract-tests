import { renderHook } from '@testing-library/react-hooks';

import { OVERVIEW_BASE_URL } from '../../../constants';
import { useDrillDownBreadcrumbs } from './useDrillDownBreadcrumbs';

const mockGetOptions = jest.fn();

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getOptions: mockGetOptions,
    }),
  },
}));

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) => id,
  }),
}));

describe('useDrillDownBreadcrumbs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetOptions.mockReturnValue([]);
  });

  const defaultApplied = {
    zone: 'LATAM',
    country: 'BRA',
    years: '2025',
    segments: 'Beer',
  };

  function renderHookWith(
    overrides?: Partial<Parameters<typeof useDrillDownBreadcrumbs>[0]>,
  ) {
    const { result } = renderHook(() =>
      useDrillDownBreadcrumbs({
        applied: defaultApplied,
        dataFilters: {},
        ...overrides,
      }),
    );
    return result.current;
  }

  describe('when user has no global zone access', () => {
    beforeEach(() => {
      mockGetOptions.mockReturnValue([{ value: 'LATAM', label: 'LATAM' }]);
    });

    it('should return Category and Category Health without Drill Down link', () => {
      const result = renderHookWith();

      expect(result).toEqual([
        { pageName: 'Category', href: '/category' },
        { pageName: 'Category.CategoryHealth.title', href: '' },
      ]);
    });
  });

  describe('when user has global zone access', () => {
    beforeEach(() => {
      mockGetOptions.mockReturnValue([
        { value: 'ABI', label: 'Global' },
        { value: 'LATAM', label: 'LATAM' },
      ]);
    });

    it('should return full breadcrumb with overview href scoped to global filters', () => {
      const result = renderHookWith();
      const overviewHref = result[1].href;
      const overviewParams = new URLSearchParams(overviewHref.split('?')[1]);

      expect(result).toEqual([
        { pageName: 'Category', href: '/category' },
        {
          pageName: 'Category.CategoryHealth.title',
          href: overviewHref,
        },
        { pageName: 'Drill Down', href: '' },
      ]);
      expect(overviewHref).toContain(`${OVERVIEW_BASE_URL}?`);
      expect(overviewParams.get('filter_zone')).toBe('ABI');
      expect(overviewParams.get('filter_country')).toBe('ABI');
      expect(overviewParams.get('filter_years')).toBe('2025');
      expect(overviewParams.get('filter_segments')).toBe('Beer');
      expect(overviewParams.has('overtime_performance')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle undefined applied', () => {
      mockGetOptions.mockReturnValue([]);
      const dataFilters = { zones: [{ value: 'LATAM' }] };

      const result = renderHookWith({ applied: undefined, dataFilters });

      expect(result).toHaveLength(2);
      expect(result[1].href).toBe('');
      expect(mockGetOptions).toHaveBeenCalledWith('zone', dataFilters, {});
    });

    it('should call FilterDataAccessor.getOptions with correct args', () => {
      const dataFilters = { zones: [{ value: 'LATAM' }] };

      renderHookWith({ dataFilters });

      expect(mockGetOptions).toHaveBeenCalledWith(
        'zone',
        dataFilters,
        defaultApplied,
      );
    });
  });
});
