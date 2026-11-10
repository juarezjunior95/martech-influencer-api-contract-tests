import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { renderHook } from '@testing-library/react-hooks';
import { FilterForm } from 'models/Filters';
import { filterSlice } from 'redux/slices/filters';
import { createInitialFilterPage } from 'redux/slices/filters/constants';
import { subFiltersSlice } from 'redux/slices/subFilters';

import { usePageFilterForm } from './usePageFilterForm';

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

describe('usePageFilterForm', () => {
  const mockForm = {
    zone: 'US',
    country: 'US-Country',
    brands: 'Brand1',
  };

  it('should return empty form when pageName is null', () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePageFilterForm(null), { wrapper });

    expect(result.current.form).toEqual({});
  });

  it('should return empty form when page does not exist', () => {
    const store = createMockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(() => usePageFilterForm('nonexistent'), {
      wrapper,
    });

    expect(result.current.form).toEqual({});
  });

  it('should return form when page exists', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      form: mockForm,
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

    const { result } = renderHook(() => usePageFilterForm('page1'), {
      wrapper,
    });

    expect(result.current.form).toEqual(mockForm);
  });

  it('should update when form changes', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      form: mockForm,
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

    const { result, rerender } = renderHook(() => usePageFilterForm('page1'), {
      wrapper,
    });

    expect(result.current.form).toEqual(mockForm);

    store.dispatch(
      filterSlice.actions.updateFormValue({
        key: 'zone',
        value: 'EU',
      }),
    );
    rerender();

    // When zones changes, dependent filters (like country) are reset to null
    expect((result.current.form as FilterForm).zone).toBe('EU');
    expect((result.current.form as FilterForm).country).toBe(null);
  });

  it('should memoize the result', () => {
    const page = {
      ...createInitialFilterPage(),
      status: 'loaded' as const,
      form: mockForm,
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

    const { result, rerender } = renderHook(() => usePageFilterForm('page1'), {
      wrapper,
    });

    const firstResult = result.current;
    rerender();
    const secondResult = result.current;

    // Should be the same reference when form hasn't changed
    expect(firstResult).toBe(secondResult);
  });
});
