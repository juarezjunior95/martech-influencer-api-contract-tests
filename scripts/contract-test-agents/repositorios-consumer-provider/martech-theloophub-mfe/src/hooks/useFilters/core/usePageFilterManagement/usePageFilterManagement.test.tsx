import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react-hooks';
import { filterSlice } from 'redux/slices/filters';
import { createInitialFilterPage } from 'redux/slices/filters/constants';
import { subFiltersSlice } from 'redux/slices/subFilters';

import { usePageFilterManagement } from './usePageFilterManagement';

const mockGetData = jest.fn();

jest.mock('services', () => ({
  BffService: {
    getInstance: jest.fn(() => ({
      getData: mockGetData,
    })),
  },
}));

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      subFilters: subFiltersSlice.reducer,
      filters: filterSlice.reducer,
    },
    preloadedState: {
      filters: {
        currentPage: null,
        previousPage: null,
        pages: {},
        ...initialState,
      },
    },
  });
};

describe('usePageFilterManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all management functions', () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePageFilterManagement('page1'), {
      wrapper,
    });

    expect(result.current.setPage).toBeDefined();
    expect(result.current.loadPageFilters).toBeDefined();
    expect(result.current.updateForm).toBeDefined();
    expect(result.current.apply).toBeDefined();
    expect(result.current.resetToDefaults).toBeDefined();
    expect(result.current.resetToApplied).toBeDefined();
  });

  describe('setPage', () => {
    it('should dispatch setCurrentPage action', () => {
      const store = createMockStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement('page1'), {
        wrapper,
      });

      act(() => {
        result.current.setPage('page2');
      });

      const state = store.getState();
      expect(state.filters.currentPage).toBe('page2');
    });
  });

  describe('loadPageFilters', () => {
    beforeEach(() => {
      mockGetData.mockClear();
    });

    it('should dispatch loadFilters via the BFF preset endpoint when pageName is provided', async () => {
      mockGetData.mockResolvedValue({
        hasError: false,
        data: {
          data: {
            zones: {
              values: [{ value: 'US', label: 'US' }],
              default: { value: 'US', label: 'US' },
              enabled: true,
            },
          },
        },
      });

      const store = createMockStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement('page1'), {
        wrapper,
      });

      await act(async () => {
        await result.current.loadPageFilters({
          pageName: 'page1',
        });
      });

      expect(mockGetData).toHaveBeenCalledWith({
        endpoint: '/presets/page1',
        params: {},
      });
    });

    it('should not dispatch when pageName is null', async () => {
      const store = createMockStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement(null), {
        wrapper,
      });

      await act(async () => {
        await result.current.loadPageFilters({
          pageName: 'page1',
        });
      });

      expect(mockGetData).not.toHaveBeenCalled();
    });
  });

  describe('updateForm', () => {
    it('should dispatch updateFormValue when pageName is provided', () => {
      const page = {
        ...createInitialFilterPage(),
        status: 'loaded' as const,
        form: {},
      };

      const store = createMockStore({
        currentPage: 'page1',
        previousPage: null,
        pages: {
          page1: page,
        },
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement('page1'), {
        wrapper,
      });

      act(() => {
        result.current.updateForm('zones', 'US');
      });

      const state = store.getState();
      expect(state.filters.pages.page1?.form.zones).toBe('US');
    });

    it('should not dispatch when pageName is null', () => {
      const store = createMockStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement(null), {
        wrapper,
      });

      act(() => {
        result.current.updateForm('zones', 'US');
      });

      const state = store.getState();
      expect(state.filters.pages).toEqual({});
    });
  });

  describe('apply', () => {
    it('should dispatch applyFilters when pageName is provided', () => {
      const page = {
        ...createInitialFilterPage(),
        status: 'loaded' as const,
        form: { zones: 'US' },
        applied: {},
      };

      const store = createMockStore({
        currentPage: 'page1',
        previousPage: null,
        pages: {
          page1: page,
        },
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement('page1'), {
        wrapper,
      });

      act(() => {
        result.current.apply();
      });

      const state = store.getState();
      expect(state.filters.pages.page1?.applied.zones).toBe('US');
    });

    it('should not dispatch when pageName is null', () => {
      const store = createMockStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement(null), {
        wrapper,
      });

      act(() => {
        result.current.apply();
      });

      const state = store.getState();
      expect(state.filters.pages).toEqual({});
    });
  });

  describe('resetToDefaults', () => {
    it('should update form with default values when pageName is provided', () => {
      const page = {
        ...createInitialFilterPage(),
        status: 'loaded' as const,
        form: { zones: 'EU' },
        defaults: { zones: 'US', country: 'US-Country' },
      };

      const store = createMockStore({
        currentPage: 'page1',
        previousPage: null,
        pages: {
          page1: page,
        },
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement('page1'), {
        wrapper,
      });

      act(() => {
        result.current.resetToDefaults({ zones: 'US', country: 'US-Country' });
      });

      const state = store.getState();
      expect(state.filters.pages.page1?.form.zones).toBe('US');
      expect(state.filters.pages.page1?.form.country).toBe('US-Country');
    });

    it('should not dispatch when pageName is null', () => {
      const store = createMockStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement(null), {
        wrapper,
      });

      act(() => {
        result.current.resetToDefaults({ zones: 'US' });
      });

      const state = store.getState();
      expect(state.filters.pages).toEqual({});
    });
  });

  describe('resetToApplied', () => {
    it('should update form with applied values when pageName is provided', () => {
      const page = {
        ...createInitialFilterPage(),
        status: 'loaded' as const,
        form: { zones: 'EU' },
        applied: { zones: 'US', country: 'US-Country' },
      };

      const store = createMockStore({
        currentPage: 'page1',
        previousPage: null,
        pages: {
          page1: page,
        },
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement('page1'), {
        wrapper,
      });

      act(() => {
        result.current.resetToApplied({ zones: 'US', country: 'US-Country' });
      });

      const state = store.getState();
      expect(state.filters.pages.page1?.form.zones).toBe('US');
      expect(state.filters.pages.page1?.form.country).toBe('US-Country');
    });

    it('should not dispatch when pageName is null', () => {
      const store = createMockStore();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
      );

      const { result } = renderHook(() => usePageFilterManagement(null), {
        wrapper,
      });

      act(() => {
        result.current.resetToApplied({ zones: 'US' });
      });

      const state = store.getState();
      expect(state.filters.pages).toEqual({});
    });
  });

  it('should memoize the result', () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result, rerender } = renderHook(
      () => usePageFilterManagement('page1'),
      { wrapper },
    );

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    // Should be the same reference when dependencies haven't changed
    expect(firstResult).toBe(secondResult);
  });
});
