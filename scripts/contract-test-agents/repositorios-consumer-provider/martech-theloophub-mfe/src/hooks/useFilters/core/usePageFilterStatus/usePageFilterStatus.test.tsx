import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { filterSlice, loadFilters } from 'redux/slices/filters';
import { createInitialFilterPage } from 'redux/slices/filters/constants';
import { subFiltersSlice } from 'redux/slices/subFilters';

import { usePageFilterStatus } from './usePageFilterStatus';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      subFilters: subFiltersSlice.reducer,
      filters: filterSlice.reducer,
    },
    preloadedState: {
      filters: {
        ...initialState,
      },
    },
  });
};

describe('usePageFilterStatus', () => {
  it('should return idle status when pageName is null', () => {
    const store = createMockStore({
      currentPage: null,
      previousPage: null,
      pages: {},
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePageFilterStatus(null), { wrapper });

    expect(result.current.status).toBe('idle');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should return idle status when page does not exist', () => {
    const store = createMockStore({
      currentPage: null,
      previousPage: null,
      pages: {},
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePageFilterStatus('nonexistent'), {
      wrapper,
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should return loading status when page is loading', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loading' as const,
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

    const { result } = renderHook(() => usePageFilterStatus('page1'), {
      wrapper,
    });

    expect(result.current.status).toBe('loading');
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should return loaded status when page is loaded', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
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

    const { result } = renderHook(() => usePageFilterStatus('page1'), {
      wrapper,
    });

    expect(result.current.status).toBe('loaded');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(true);
    expect(result.current.isError).toBe(false);
  });

  it('should return error status when page has error', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'error' as const,
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

    const { result } = renderHook(() => usePageFilterStatus('page1'), {
      wrapper,
    });

    expect(result.current.status).toBe('error');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.isError).toBe(true);
  });

  it('should update when status changes', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loading' as const,
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

    const { result, rerender } = renderHook(
      () => usePageFilterStatus('page1'),
      {
        wrapper,
      },
    );

    expect(result.current.status).toBe('loading');
    expect(result.current.isLoading).toBe(true);

    store.dispatch(
      loadFilters.fulfilled(
        {
          pageName: 'page1',
          dataFilters: {},
          cached: false,
        },
        'newFilters/loadFilters',
        { pageName: 'page1' },
      ),
    );
    rerender();

    expect(result.current.status).toBe('loaded');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoaded).toBe(true);
  });

  it('should memoize the result', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
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

    const { result, rerender } = renderHook(
      () => usePageFilterStatus('page1'),
      {
        wrapper,
      },
    );

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    // Should be the same reference when status hasn't changed
    expect(firstResult).toBe(secondResult);
  });
});
