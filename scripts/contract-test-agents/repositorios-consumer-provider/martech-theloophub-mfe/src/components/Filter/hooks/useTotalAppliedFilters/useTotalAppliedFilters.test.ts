import * as reactRedux from 'react-redux';

import { renderHook } from '@testing-library/react-hooks';
import * as hooks from 'hooks';

import { useTotalAppliedFilters } from './useTotalAppliedFilters';

jest.mock('hooks', () => ({
  usePageFilterData: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('redux/slices/filters/selectors', () => ({
  selectPage: jest.fn(),
}));

describe('useTotalAppliedFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should count applied filters correctly', () => {
    const applied = {
      zone: 'LAO',
      country: 'BRA',
      brands: 'Skol',
      time_frame: '2025',
    };

    const defaults = {
      zone: 'ABI',
      country: 'ABI',
      brands: null,
      time_frame: '2025',
    };

    (reactRedux.useSelector as jest.Mock).mockImplementation((selectorFn) => {
      return { applied, form: applied };
    });

    (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults });

    const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

    expect(result.current.totalAppliedFilters).toBe(3);
    expect(result.current.totalFixedAppliedFilters).toBe(3);
  });

  it('should exclude default values', () => {
    const applied = {
      zone: 'ABI',
      country: 'ABI',
      brands: 'Skol',
    };

    const defaults = {
      zone: 'ABI',
      country: 'ABI',
      brands: null,
    };

    (reactRedux.useSelector as jest.Mock).mockImplementation(() => {
      return { applied, form: applied };
    });

    (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults });

    const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

    expect(result.current.totalAppliedFilters).toBe(1);
    expect(result.current.totalFixedAppliedFilters).toBe(1);
  });

  it('should exclude "All" values', () => {
    const applied = {
      zone: 'LAO',
      country: 'BRA',
      brands: 'All',
    };

    const defaults = {
      zone: 'ABI',
      country: 'ABI',
      brands: null,
    };

    (reactRedux.useSelector as jest.Mock).mockImplementation(() => {
      return { applied, form: applied };
    });

    (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults });

    const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

    expect(result.current.totalAppliedFilters).toBe(2);
    expect(result.current.totalFixedAppliedFilters).toBe(2);
  });

  it('should handle null/undefined/empty values', () => {
    const applied = {
      zone: 'LAO',
      country: null,
      brands: '',
      sub_brands: undefined,
    };

    const defaults = {
      zone: 'ABI',
      country: 'ABI',
      brands: null,
      sub_brands: null,
    };

    (reactRedux.useSelector as jest.Mock).mockImplementation(() => {
      return { applied, form: applied };
    });

    (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults });

    const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

    expect(result.current.totalAppliedFilters).toBe(1);
    expect(result.current.totalFixedAppliedFilters).toBe(1);
  });

  it('should return 0 when no filters are applied', () => {
    const applied = {};
    const defaults = {};

    (reactRedux.useSelector as jest.Mock).mockImplementation(() => {
      return { applied, form: applied };
    });

    (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults });

    const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

    expect(result.current.totalAppliedFilters).toBe(0);
    expect(result.current.totalFixedAppliedFilters).toBe(0);
  });

  it('should handle when pageData is null', () => {
    (reactRedux.useSelector as jest.Mock).mockImplementation(() => null);
    (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults: {} });

    const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

    expect(result.current.totalAppliedFilters).toBe(0);
    expect(result.current.totalFixedAppliedFilters).toBe(0);
  });

  it('should use form when available', () => {
    const form = {
      zone: 'LAO',
      country: 'BRA',
    };

    const defaults = {
      zone: 'ABI',
      country: 'ABI',
    };

    (reactRedux.useSelector as jest.Mock).mockImplementation(() => {
      return { form, applied: {} };
    });

    (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults });

    const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

    expect(result.current.totalAppliedFilters).toBe(2);
    expect(result.current.totalFixedAppliedFilters).toBe(0);
  });

  describe('totalAppliedFilters vs totalFixedAppliedFilters', () => {
    it('should show different counts when form differs from applied', () => {
      const applied = {
        zone: 'LAO',
        country: 'BRA',
      };

      const form = {
        zone: 'LAO',
        country: 'BRA',
        brands: 'Skol',
        sub_brands: 'Skol Beats',
      };

      const defaults = {
        zone: 'ABI',
        country: 'ABI',
        brands: null,
        sub_brands: null,
      };

      (reactRedux.useSelector as jest.Mock).mockImplementation(() => {
        return { form, applied };
      });

      (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults });

      const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

      expect(result.current.totalAppliedFilters).toBe(4);
      expect(result.current.totalFixedAppliedFilters).toBe(2);
    });

    it('should show same counts when form equals applied', () => {
      const applied = {
        zone: 'LAO',
        country: 'BRA',
        brands: 'Skol',
      };

      const defaults = {
        zone: 'ABI',
        country: 'ABI',
        brands: null,
      };

      (reactRedux.useSelector as jest.Mock).mockImplementation(() => {
        return { form: applied, applied };
      });

      (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults });

      const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

      expect(result.current.totalAppliedFilters).toBe(3);
      expect(result.current.totalFixedAppliedFilters).toBe(3);
    });

    it('totalFixedAppliedFilters should always reflect only applied state', () => {
      const applied = {
        zone: 'ABI',
        country: 'BRA',
      };

      const form = {
        zone: 'LAO',
        country: 'BRA',
        brands: 'Skol',
      };

      const defaults = {
        zone: 'ABI',
        country: 'ABI',
        brands: null,
      };

      (reactRedux.useSelector as jest.Mock).mockImplementation(() => {
        return { form, applied };
      });

      (hooks.usePageFilterData as jest.Mock).mockReturnValue({ defaults });

      const { result } = renderHook(() => useTotalAppliedFilters('test-page'));

      expect(result.current.totalAppliedFilters).toBe(3);
      expect(result.current.totalFixedAppliedFilters).toBe(1);
    });
  });
});
