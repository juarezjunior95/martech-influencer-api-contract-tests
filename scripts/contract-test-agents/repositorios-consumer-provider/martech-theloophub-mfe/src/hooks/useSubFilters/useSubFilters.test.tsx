import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { subFiltersSlice } from 'redux/slices/subFilters';

import { useSubFilters } from './useSubFilters';

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      subFilters: subFiltersSlice.reducer as any,
    },
    preloadedState: {
      subFilters: {
        activeSubFilters: {
          region: ['region1', 'region2'],
        },
        disabledFields: ['field1'],
        subFiltersInUse: ['region'],
        subFilterValues: {
          region: ['region1', 'region2'],
        },
        ...initialState,
      },
    },
  });
};

describe('useSubFilters Hook', () => {
  let mockStore: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = createMockStore();
  });

  const createWrapper = (store = mockStore) => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    return Wrapper;
  };

  it('should return initial state', () => {
    const { result } = renderHook(() => useSubFilters(), {
      wrapper: createWrapper(),
    });

    expect(result.current.activeSubFilters).toEqual({
      region: ['region1', 'region2'],
    });
    expect(result.current.disabledFields).toEqual(['field1']);
    expect(result.current.subFiltersInUse).toEqual(['region']);
  });

  it('should update sub filter values', () => {
    const { result } = renderHook(() => useSubFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSubFilterValue('region', 'region3');
    });

    expect(result.current.activeSubFilters.region).toEqual('region3');
  });

  it('should toggle disabled fields', () => {
    const { result } = renderHook(() => useSubFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.toggleDisabledField('field2');
    });

    expect(result.current.disabledFields).toContain('field2');

    act(() => {
      result.current.toggleDisabledField('field2');
    });

    expect(result.current.disabledFields).not.toContain('field2');
  });

  it('should handle special sub filters', () => {
    const { result } = renderHook(() => useSubFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSubFilterValue('region', 'All');
    });

    expect(result.current.activeSubFilters.region).toBe('All');
  });

  it('should handle empty sub filter values', () => {
    const { result } = renderHook(() => useSubFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSubFilterValue('region', '');
    });

    expect(result.current.activeSubFilters.region).toEqual('');
  });

  it('should handle multiple sub filters', () => {
    const { result } = renderHook(() => useSubFilters(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.setSubFilterValue('region', 'region2');
      result.current.setSubFilterValue('category', 'category1');
    });

    expect(result.current.activeSubFilters).toEqual({
      region: 'region2',
      category: 'category1',
    });
  });

  // ✅ Teste adicional para verificar estado vazio
  it('should handle empty initial state', () => {
    const emptyStore = createMockStore({
      activeSubFilters: {},
      disabledFields: [],
      subFiltersInUse: [],
      subFilterValues: {},
    });

    const { result } = renderHook(() => useSubFilters(), {
      wrapper: createWrapper(emptyStore),
    });

    expect(result.current.activeSubFilters).toEqual({});
    expect(result.current.disabledFields).toEqual([]);
    expect(result.current.subFiltersInUse).toEqual([]);
  });
});
