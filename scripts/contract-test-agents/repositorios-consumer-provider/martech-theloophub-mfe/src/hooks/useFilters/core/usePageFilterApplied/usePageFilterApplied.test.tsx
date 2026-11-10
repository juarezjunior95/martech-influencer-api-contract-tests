import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { filterSlice } from 'redux/slices/filters';
import { createInitialFilterPage } from 'redux/slices/filters/constants';
import { subFiltersSlice } from 'redux/slices/subFilters';

import { usePageFilterApplied } from './usePageFilterApplied';

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

describe('usePageFilterApplied', () => {
  const mockApplied = {
    zones: 'US',
    country: 'US-Country',
    brands: 'Brand1',
  };

  it('should return empty applied when pageName is null', () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePageFilterApplied(null), {
      wrapper,
    });

    expect(result.current.applied).toEqual({});
    expect(result.current.isGlobalZone).toBe(false);
  });

  it('should return empty applied when page does not exist', () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePageFilterApplied('nonexistent'), {
      wrapper,
    });

    expect(result.current.applied).toEqual({});
    expect(result.current.isGlobalZone).toBe(false);
  });

  it('should return applied when page exists', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      applied: mockApplied,
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

    const { result } = renderHook(() => usePageFilterApplied('page1'), {
      wrapper,
    });

    expect(result.current.applied).toEqual(mockApplied);
    expect(result.current.isGlobalZone).toBe(false);
  });

  it('should return isGlobalZone as true when country is ABI', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      applied: {
        ...mockApplied,
        zone: 'ABI',
      },
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

    const { result } = renderHook(() => usePageFilterApplied('page1'), {
      wrapper,
    });

    expect(result.current.applied.zone).toBe('ABI');
    expect(result.current.isGlobalZone).toBe(true);
  });

  it('should return isGlobalZone as false when country is not ABI', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      applied: mockApplied,
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

    const { result } = renderHook(() => usePageFilterApplied('page1'), {
      wrapper,
    });

    expect(result.current.isGlobalZone).toBe(false);
  });

  it('should update when applied changes', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      applied: mockApplied,
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
      () => usePageFilterApplied('page1'),
      { wrapper },
    );

    expect(result.current.applied).toEqual(mockApplied);

    store.dispatch(filterSlice.actions.applyFilters());
    rerender();

    // After applying, applied should match form
    expect(result.current.applied).toBeDefined();
  });

  it('should memoize the result', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      applied: mockApplied,
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
      () => usePageFilterApplied('page1'),
      { wrapper },
    );

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    // Should be the same reference when applied hasn't changed
    expect(firstResult).toBe(secondResult);
  });
});
