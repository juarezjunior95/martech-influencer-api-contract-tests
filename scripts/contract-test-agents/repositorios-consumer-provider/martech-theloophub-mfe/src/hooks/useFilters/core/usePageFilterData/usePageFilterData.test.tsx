import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { FilterRegistry } from 'domain/Filter';
import { filterSlice, loadFilters } from 'redux/slices/filters';
import { createInitialFilterPage } from 'redux/slices/filters/constants';
import { subFiltersSlice } from 'redux/slices/subFilters';

import { usePageFilterData } from './usePageFilterData';

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

describe('usePageFilterData', () => {
  const mockDataFilters = {
    zones: {
      values: [{ value: 'US', label: 'US' }],
      default: { value: 'US', label: 'US' },
      enabled: true,
    },
  };

  const mockDefaults = {
    zones: 'US',
    country: 'US-Country',
  };

  beforeEach(() => {
    jest
      .spyOn(FilterRegistry, 'calculateDefaults')
      .mockReturnValue(mockDefaults);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return empty data when pageName is null', () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePageFilterData(null), { wrapper });

    expect(result.current.pageData).toBe(null);
    expect(result.current.dataFilters).toEqual({});
    expect(result.current.defaults).toEqual({});
    expect(result.current.availableFields).toEqual([]);
    expect(result.current.appliedDataFilters).toEqual({});
  });

  it('should return empty data when page does not exist', () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePageFilterData('nonexistent'), {
      wrapper,
    });

    expect(result.current.pageData).toBeUndefined();
    expect(result.current.dataFilters).toEqual({});
    expect(result.current.defaults).toEqual({});
    expect(result.current.availableFields).toEqual([]);
    expect(result.current.appliedDataFilters).toEqual({});
  });

  it('should return page data when page exists', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      dataFilters: mockDataFilters,
      defaults: mockDefaults,
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

    const { result } = renderHook(() => usePageFilterData('page1'), {
      wrapper,
    });

    expect(result.current.pageData).toEqual(page);
    expect(result.current.dataFilters).toEqual(mockDataFilters);
    expect(result.current.defaults).toEqual(mockDefaults);
    expect(result.current.availableFields).toEqual(
      expect.arrayContaining(['zone', 'country', 'brands']),
    );
    expect(result.current.availableFields.length).toBeGreaterThan(0);
    expect(result.current.appliedDataFilters).toEqual(mockDataFilters);
  });

  it('should update when page data changes', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      dataFilters: mockDataFilters,
      defaults: mockDefaults,
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

    const { result, rerender } = renderHook(() => usePageFilterData('page1'), {
      wrapper,
    });

    expect(result.current.dataFilters).toEqual(mockDataFilters);

    const newDataFilters = {
      zones: {
        values: [{ value: 'EU', label: 'EU' }],
        default: { value: 'EU', label: 'EU' },
        enabled: true,
      },
    };

    store.dispatch(
      loadFilters.fulfilled(
        {
          pageName: 'page1',
          dataFilters: newDataFilters,
          cached: false,
        },
        'newFilters/loadFilters',
        { pageName: 'page1' },
      ),
    );
    rerender();

    expect(result.current.dataFilters).toEqual(newDataFilters);
    expect(result.current.availableFields).toEqual(
      expect.arrayContaining(['zone', 'country', 'brands']),
    );
    expect(result.current.availableFields.length).toBeGreaterThan(0);
  });

  it('should memoize the result', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      dataFilters: mockDataFilters,
      defaults: mockDefaults,
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

    const { result, rerender } = renderHook(() => usePageFilterData('page1'), {
      wrapper,
    });

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    expect(firstResult).toStrictEqual(secondResult);
  });
});
