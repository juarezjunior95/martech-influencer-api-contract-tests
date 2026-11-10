import { configureStore } from '@reduxjs/toolkit';
import { FilterRegistry } from 'domain/Filter';
import type { FilterDataStructure, FiltersState } from 'models/Filters';

import { createInitialFilterPage } from './constants';
import {
  applyFilters,
  filterSlice,
  resetToDefaults,
  setCurrentPage,
  updateFormValue,
} from './filters';
import { loadFilters } from './thunk/filtersThunk';

// Mock FilterRegistry and PerformanceToolFilterDataTransformer
jest.mock('domain/Filter', () => ({
  FilterRegistry: {
    calculateDefaults: jest.fn(),
    resolveFilterCollisions: jest.fn(),
    resolveCascadingUpdates: jest.fn(),
  },
  PerformanceToolFilterDataTransformer: {
    isValidFormat: jest.fn().mockReturnValue(false),
    transform: jest.fn(),
  },
}));

type RootState = { filters: FiltersState };

describe('filters slice', () => {
  let store: ReturnType<typeof configureStore<RootState>>;

  const mockFilterData: FilterDataStructure = {
    zones: {
      default: { value: 'LATAM', label: 'LATAM' },
      values: [
        { value: 'LATAM', label: 'LATAM' },
        { value: 'NAZ', label: 'NAZ' },
      ],
      enabled: true,
    },
    country: {
      default: { value: 'BR', label: 'Brazil' },
      values: {
        LATAM: [
          { value: 'BR', label: 'Brazil' },
          { value: 'AR', label: 'Argentina' },
        ],
      },
      enabled: true,
    },
  };

  const mockDefaults = {
    zones: 'LATAM',
    country: 'BR',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (FilterRegistry.calculateDefaults as jest.Mock).mockReturnValue(
      mockDefaults,
    );
    (FilterRegistry.resolveFilterCollisions as jest.Mock).mockImplementation(
      (_currentPage, _previousPage, defaults) => ({ ...defaults }),
    );
    (FilterRegistry.resolveCascadingUpdates as jest.Mock).mockImplementation(
      (_dataFilters, _form, key, value) => {
        // Return a plain object with the updated value
        return { zones: key === 'zones' ? value : 'LATAM', country: 'BR' };
      },
    );

    store = configureStore({
      reducer: {
        filters: filterSlice.reducer,
      },
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.getState().filters;

      expect(state).toEqual({
        pages: {},
        currentPage: null,
        previousPage: null,
      });
    });
  });

  describe('setCurrentPage reducer', () => {
    it('should set current page and update previous page', () => {
      store.dispatch(setCurrentPage('page1'));
      let state = store.getState().filters;

      expect(state.currentPage).toBe('page1');
      expect(state.previousPage).toBeNull();

      store.dispatch(setCurrentPage('page2'));
      state = store.getState().filters;

      expect(state.currentPage).toBe('page2');
      expect(state.previousPage).toBe('page1');
    });

    it('should not update if setting the same page', () => {
      store.dispatch(setCurrentPage('page1'));
      const stateBefore = store.getState().filters;

      store.dispatch(setCurrentPage('page1'));
      const stateAfter = store.getState().filters;

      expect(stateAfter).toEqual(stateBefore);
    });

    it('should resolve collisions when switching to a loaded page', () => {
      const mockResolved = { zones: 'NAZ', country: 'US' };
      (FilterRegistry.resolveFilterCollisions as jest.Mock).mockReturnValue(
        mockResolved,
      );

      const initialState: FiltersState = {
        pages: {
          page1: {
            ...createInitialFilterPage(),
            status: 'loaded',
            defaults: mockDefaults,
            form: mockDefaults,
            applied: mockDefaults,
            dataFilters: mockFilterData,
          },
        },
        currentPage: null,
        previousPage: null,
      };

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: initialState,
        },
      });

      store.dispatch(setCurrentPage('page1'));

      expect(FilterRegistry.resolveFilterCollisions).toHaveBeenCalledTimes(1);

      const state = store.getState().filters;
      expect(state.pages.page1.form).toEqual(mockResolved);
      expect(state.pages.page1.applied).toEqual(mockResolved);
    });
  });

  describe('updateFormValue reducer', () => {
    it('should update form value and resolve cascading updates', () => {
      const mockUpdatedForm = { zones: 'NAZ', country: 'US' };
      (FilterRegistry.resolveCascadingUpdates as jest.Mock).mockReturnValue(
        mockUpdatedForm,
      );

      const initialState: FiltersState = {
        pages: {
          page1: {
            ...createInitialFilterPage(),
            status: 'loaded',
            defaults: { ...mockDefaults },
            form: { ...mockDefaults },
            applied: { ...mockDefaults },
            dataFilters: mockFilterData,
          },
        },
        currentPage: 'page1',
        previousPage: null,
      };

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: initialState,
        },
      });

      store.dispatch(updateFormValue({ key: 'zones', value: 'NAZ' }));

      // Just verify the function was called once
      expect(FilterRegistry.resolveCascadingUpdates).toHaveBeenCalledTimes(1);

      // Verify the result
      const state = store.getState().filters;
      expect(state.pages.page1.form).toEqual(mockUpdatedForm);
    });

    it('should warn if no current page is set', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      store.dispatch(updateFormValue({ key: 'zones', value: 'NAZ' }));

      expect(consoleSpy).toHaveBeenCalledWith('Filters: Page not found');
      consoleSpy.mockRestore();
    });
  });

  describe('applyFilters reducer', () => {
    it('should copy form to applied and update timestamp', () => {
      const dateBefore = Date.now();

      const initialState: FiltersState = {
        pages: {
          page1: {
            ...createInitialFilterPage(),
            status: 'loaded',
            defaults: mockDefaults,
            form: { zones: 'NAZ', country: 'US' },
            applied: mockDefaults,
            dataFilters: mockFilterData,
          },
        },
        currentPage: 'page1',
        previousPage: null,
      };

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: initialState,
        },
      });

      store.dispatch(applyFilters());

      const state = store.getState().filters;
      const dateAfter = Date.now();

      expect(state.pages.page1.applied).toEqual({
        zones: 'NAZ',
        country: 'US',
      });
      expect(state.pages.page1.lastUpdated).toBeGreaterThanOrEqual(dateBefore);
      expect(state.pages.page1.lastUpdated).toBeLessThanOrEqual(dateAfter);
    });
  });

  describe('resetToDefaults reducer', () => {
    it('should reset form and applied to defaults', () => {
      const initialState: FiltersState = {
        pages: {
          page1: {
            ...createInitialFilterPage(),
            status: 'loaded',
            defaults: mockDefaults,
            form: { zones: 'NAZ', country: 'US' },
            applied: { zones: 'NAZ', country: 'US' },
            dataFilters: mockFilterData,
          },
        },
        currentPage: 'page1',
        previousPage: null,
      };

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: initialState,
        },
      });

      store.dispatch(resetToDefaults());

      const state = store.getState().filters;

      expect(state.pages.page1.form).toEqual(mockDefaults);
      expect(state.pages.page1.applied).toEqual(mockDefaults);
      expect(state.pages.page1.lastUpdated).toBeDefined();
    });
  });

  describe('loadFilters async thunk', () => {
    it('should set status to loading on pending', () => {
      const action = loadFilters.pending('requestId', {
        pageName: 'page1',
      });

      const state = filterSlice.reducer(undefined, action);

      expect(state.pages.page1).toBeDefined();
      expect(state.pages.page1.status).toBe('loading');
    });

    it('should load filters successfully', () => {
      const initialState: FiltersState = {
        pages: {
          page1: {
            ...createInitialFilterPage(),
            status: 'loading',
          },
        },
        currentPage: null,
        previousPage: null,
      };

      const action = loadFilters.fulfilled(
        {
          pageName: 'page1',
          dataFilters: mockFilterData,
        },
        'requestId',
        {
          pageName: 'page1',
        },
      );

      const state = filterSlice.reducer(initialState, action);

      expect(FilterRegistry.calculateDefaults).toHaveBeenCalledWith(
        mockFilterData,
      );
      expect(state.pages.page1.status).toBe('loaded');
      expect(state.pages.page1.dataFilters).toEqual(mockFilterData);
      expect(state.pages.page1.defaults).toEqual(mockDefaults);
    });

    it('should handle rejected thunk', () => {
      const initialState: FiltersState = {
        pages: {
          page1: {
            ...createInitialFilterPage(),
            status: 'loading',
          },
        },
        currentPage: null,
        previousPage: null,
      };

      const action = loadFilters.rejected(
        new Error('Network error'),
        'requestId',
        {
          pageName: 'page1',
        },
      );

      const state = filterSlice.reducer(initialState, action);

      expect(state.pages.page1.status).toBe('error');
    });
  });

  describe('Integration with FilterRegistry', () => {
    it('should use FilterRegistry for all calculations', () => {
      const initialState: FiltersState = {
        pages: {
          page1: {
            ...createInitialFilterPage(),
            status: 'loaded',
            defaults: mockDefaults,
            form: mockDefaults,
            applied: mockDefaults,
            dataFilters: mockFilterData,
          },
          page2: {
            ...createInitialFilterPage(),
            status: 'loaded',
            defaults: mockDefaults,
            form: mockDefaults,
            applied: mockDefaults,
            dataFilters: mockFilterData,
          },
        },
        currentPage: 'page1',
        previousPage: null,
      };

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: initialState,
        },
      });

      // Test updateFormValue uses resolveCascadingUpdates
      store.dispatch(updateFormValue({ key: 'zones', value: 'NAZ' }));
      expect(FilterRegistry.resolveCascadingUpdates).toHaveBeenCalled();

      // Test setCurrentPage uses resolveFilterCollisions (mudando para página diferente)
      jest.clearAllMocks();
      store.dispatch(setCurrentPage('page2'));
      expect(FilterRegistry.resolveFilterCollisions).toHaveBeenCalled();
    });
  });
});
