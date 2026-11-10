import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { filterSlice } from 'redux/slices/filters';
import { subFiltersSlice } from 'redux/slices/subFilters';

import { useCurrentPage } from './useCurrentPage';

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

describe('useCurrentPage', () => {
  it('should return null when no current page is set', () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useCurrentPage(), { wrapper });

    expect(result.current).toEqual({ currentPage: null });
  });

  it('should return current page name when set', () => {
    const store = createMockStore({
      currentPage: 'page1',
      previousPage: null,
      pages: {},
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => useCurrentPage(), { wrapper });

    expect(result.current).toEqual({ currentPage: 'page1' });
  });

  it('should update when current page changes', () => {
    const store = createMockStore({
      currentPage: 'page1',
      previousPage: null,
      pages: {},
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result, rerender } = renderHook(() => useCurrentPage(), {
      wrapper,
    });

    expect(result.current).toEqual({ currentPage: 'page1' });

    store.dispatch(filterSlice.actions.setCurrentPage('page2'));
    rerender();

    expect(result.current).toEqual({ currentPage: 'page2' });
  });

  it('should memoize the result', () => {
    const store = createMockStore({
      currentPage: 'page1',
      previousPage: null,
      pages: {},
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result, rerender } = renderHook(() => useCurrentPage(), {
      wrapper,
    });

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    // Should be the same reference when value hasn't changed
    expect(firstResult).toBe(secondResult);
  });
});
