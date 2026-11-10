import { configureStore } from '@reduxjs/toolkit';
import { FilterRegistry } from 'domain/Filter';
import { FilterForm, FilterPage } from 'models/Filters';
import { subFiltersSlice } from 'redux/slices/subFilters';
import { RootState } from 'redux/types';

import { createInitialFilterPage } from '../constants';
import { filterSlice } from '../filters';
import {
  selectAllPages,
  selectCurrentPage,
  selectCurrentPageApplied,
  selectCurrentPageData,
  selectCurrentPageDataFilters,
  selectCurrentPageDefaults,
  selectCurrentPageForm,
  selectCurrentPageStatus,
  selectFiltersState,
  selectIsCurrentPageError,
  selectIsCurrentPageLoaded,
  selectIsCurrentPageLoading,
  selectIsPageError,
  selectIsPageLoaded,
  selectIsPageLoading,
  selectPage,
  selectPageApplied,
  selectPageDataFilters,
  selectPageDataFiltersFromApplied,
  selectPageDefaults,
  selectPageForm,
  selectPageStatus,
} from './selectors';

describe('newFilters selectors', () => {
  let store: ReturnType<typeof configureStore>;

  const mockDataFilters = {
    zones: {
      values: [{ value: 'US', label: 'US' }],
      default: { value: 'US', label: 'US' },
      enabled: true,
    },
  };

  const mockDefaults: FilterForm = {
    zones: 'US',
    country: 'US-Country',
  };

  const mockForm: FilterForm = {
    zones: 'EU',
    country: 'EU-Country',
  };

  const mockApplied: FilterForm = {
    zones: 'EU',
    country: 'EU-Country',
  };

  const createMockPage = (overrides?: Partial<FilterPage>): FilterPage => ({
    ...createInitialFilterPage(),
    status: 'loaded',
    dataFilters: mockDataFilters,
    defaults: mockDefaults,
    form: mockForm,
    applied: mockApplied,
    lastUpdated: Date.now(),
    ...overrides,
  });

  beforeEach(() => {
    jest
      .spyOn(FilterRegistry, 'calculateDefaults')
      .mockReturnValue(mockDefaults);

    store = configureStore({
      reducer: {
        subFilters: subFiltersSlice.reducer,
        filters: filterSlice.reducer,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('basic selectors', () => {
    it('should select newFilters state', () => {
      const state = store.getState() as RootState;
      const result = selectFiltersState(state);
      expect(result).toEqual({
        pages: {},
        currentPage: null,
        previousPage: null,
      });
    });

    it('should select current page', () => {
      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {},
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectCurrentPage(state)).toBe('page1');
    });

    it('should return null when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectCurrentPage(state)).toBe(null);
    });

    it('should select all pages', () => {
      const page1 = createMockPage();
      const page2 = createMockPage({ status: 'loading' });

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
              page2,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const pages = selectAllPages(state);
      expect(pages).toHaveProperty('page1');
      expect(pages).toHaveProperty('page2');
      expect(pages.page1).toEqual(page1);
      expect(pages.page2).toEqual(page2);
    });

    it('should select specific page', () => {
      const page1 = createMockPage();
      const page2 = createMockPage({ status: 'loading' });

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
              page2,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectPage('page1')(state)).toEqual(page1);
      expect(selectPage('page2')(state)).toEqual(page2);
      expect(selectPage('nonexistent')(state)).toBeUndefined();
    });
  });

  describe('selectCurrentPageData', () => {
    it('should return null when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectCurrentPageData(state)).toBe(null);
    });

    it('should return current page data', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectCurrentPageData(state)).toEqual(page1);
    });

    it('should return null when current page does not exist', () => {
      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {},
            currentPage: 'nonexistent',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectCurrentPageData(state)).toBe(null);
    });
  });

  describe('selectCurrentPageStatus', () => {
    it('should return idle when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectCurrentPageStatus(state)).toBe('idle');
    });

    it('should return current page status', () => {
      const page1 = createMockPage({ status: 'loading' });

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectCurrentPageStatus(state)).toBe('loading');
    });
  });

  describe('selectCurrentPageDataFilters', () => {
    it('should return empty object when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectCurrentPageDataFilters(state)).toEqual({});
    });

    it('should return current page dataFilters', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectCurrentPageDataFilters(state)).toEqual(mockDataFilters);
    });
  });

  describe('selectCurrentPageDefaults', () => {
    it('should return empty object when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectCurrentPageDefaults(state)).toEqual({});
    });

    it('should return current page defaults', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectCurrentPageDefaults(state)).toEqual(mockDefaults);
    });
  });

  describe('selectCurrentPageApplied', () => {
    it('should return empty object when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectCurrentPageApplied(state)).toEqual({});
    });

    it('should return current page applied', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectCurrentPageApplied(state)).toEqual(mockApplied);
    });
  });

  describe('selectCurrentPageForm', () => {
    it('should return empty object when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectCurrentPageForm(state)).toEqual({});
    });

    it('should return current page form', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectCurrentPageForm(state)).toEqual(mockForm);
    });
  });

  describe('selectIsCurrentPageLoading', () => {
    it('should return false when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectIsCurrentPageLoading(state)).toBe(false);
    });

    it('should return true when current page is loading', () => {
      const page1 = createMockPage({ status: 'loading' });

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectIsCurrentPageLoading(state)).toBe(true);
    });

    it('should return false when current page is not loading', () => {
      const page1 = createMockPage({ status: 'loaded' });

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectIsCurrentPageLoading(state)).toBe(false);
    });
  });

  describe('selectIsCurrentPageLoaded', () => {
    it('should return false when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectIsCurrentPageLoaded(state)).toBe(false);
    });

    it('should return true when current page is loaded', () => {
      const page1 = createMockPage({ status: 'loaded' });

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectIsCurrentPageLoaded(state)).toBe(true);
    });

    it('should return false when current page is not loaded', () => {
      const page1 = createMockPage({ status: 'loading' });

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectIsCurrentPageLoaded(state)).toBe(false);
    });
  });

  describe('selectIsCurrentPageError', () => {
    it('should return false when no current page', () => {
      const state = store.getState() as RootState;
      expect(selectIsCurrentPageError(state)).toBe(false);
    });

    it('should return true when current page has error', () => {
      const page1 = createMockPage({ status: 'error' });

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectIsCurrentPageError(state)).toBe(true);
    });

    it('should return false when current page does not have error', () => {
      const page1 = createMockPage({ status: 'loaded' });

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: 'page1',
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      expect(selectIsCurrentPageError(state)).toBe(false);
    });
  });

  describe('selectPageStatus', () => {
    it('should return idle when page does not exist', () => {
      const state = store.getState() as RootState;
      const selector = selectPageStatus('nonexistent');
      expect(selector(state)).toBe('idle');
    });

    it('should return page status', () => {
      const page1 = createMockPage({ status: 'loading' });

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectPageStatus('page1');
      expect(selector(state)).toBe('loading');
    });

    it('should memoize selector for same page', () => {
      const page1 = createMockPage({ status: 'loaded' });

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const selector1 = selectPageStatus('page1');
      const selector2 = selectPageStatus('page1');
      expect(selector1).toBe(selector2);
    });
  });

  describe('selectPageDataFilters', () => {
    it('should return empty object when page does not exist', () => {
      const state = store.getState() as RootState;
      const selector = selectPageDataFilters('nonexistent');
      expect(selector(state)).toEqual({});
    });

    it('should return page dataFilters', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectPageDataFilters('page1');
      expect(selector(state)).toEqual(mockDataFilters);
    });
  });

  describe('selectPageDefaults', () => {
    it('should return empty object when page does not exist', () => {
      const state = store.getState() as RootState;
      const selector = selectPageDefaults('nonexistent');
      expect(selector(state)).toEqual({});
    });

    it('should return page defaults', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectPageDefaults('page1');
      expect(selector(state)).toEqual(mockDefaults);
    });
  });

  describe('selectPageApplied', () => {
    it('should return empty object when page does not exist', () => {
      const state = store.getState() as RootState;
      const selector = selectPageApplied('nonexistent');
      expect(selector(state)).toEqual({});
    });

    it('should return page applied', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectPageApplied('page1');
      expect(selector(state)).toEqual(mockApplied);
    });
  });

  describe('selectPageForm', () => {
    it('should return empty object when page does not exist', () => {
      const state = store.getState() as RootState;
      const selector = selectPageForm('nonexistent');
      expect(selector(state)).toEqual({});
    });

    it('should return page form', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectPageForm('page1');
      expect(selector(state)).toEqual(mockForm);
    });
  });

  describe('selectIsPageLoading', () => {
    it('should return false when page does not exist', () => {
      const state = store.getState() as RootState;
      const selector = selectIsPageLoading('nonexistent');
      expect(selector(state)).toBe(false);
    });

    it('should return true when page is loading', () => {
      const page1 = createMockPage({ status: 'loading' });

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectIsPageLoading('page1');
      expect(selector(state)).toBe(true);
    });

    it('should return false when page is not loading', () => {
      const page1 = createMockPage({ status: 'loaded' });

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectIsPageLoading('page1');
      expect(selector(state)).toBe(false);
    });
  });

  describe('selectIsPageLoaded', () => {
    it('should return false when page does not exist', () => {
      const state = store.getState() as RootState;
      const selector = selectIsPageLoaded('nonexistent');
      expect(selector(state)).toBe(false);
    });

    it('should return true when page is loaded', () => {
      const page1 = createMockPage({ status: 'loaded' });

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectIsPageLoaded('page1');
      expect(selector(state)).toBe(true);
    });

    it('should return false when page is not loaded', () => {
      const page1 = createMockPage({ status: 'loading' });

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectIsPageLoaded('page1');
      expect(selector(state)).toBe(false);
    });
  });

  describe('selectIsPageError', () => {
    it('should return false when page does not exist', () => {
      const state = store.getState() as RootState;
      const selector = selectIsPageError('nonexistent');
      expect(selector(state)).toBe(false);
    });

    it('should return true when page has error', () => {
      const page1 = createMockPage({ status: 'error' });

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectIsPageError('page1');
      expect(selector(state)).toBe(true);
    });

    it('should return false when page does not have error', () => {
      const page1 = createMockPage({ status: 'loaded' });

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectIsPageError('page1');
      expect(selector(state)).toBe(false);
    });
  });

  describe('selectPageDataFiltersFromApplied', () => {
    it('should return empty object when page does not exist', () => {
      const state = store.getState() as RootState;
      const selector = selectPageDataFiltersFromApplied('nonexistent');
      expect(selector(state)).toEqual({});
    });

    it('should return page dataFilters based on applied filters', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const state = store.getState() as RootState;
      const selector = selectPageDataFiltersFromApplied('page1');
      expect(selector(state)).toEqual(mockDataFilters);
    });

    it('should memoize selector for same page', () => {
      const page1 = createMockPage();

      store = configureStore({
        reducer: {
          subFilters: subFiltersSlice.reducer,
          filters: filterSlice.reducer,
        },
        preloadedState: {
          filters: {
            pages: {
              page1,
            },
            currentPage: null,
            previousPage: null,
          },
        },
      });

      const selector1 = selectPageDataFiltersFromApplied('page1');
      const selector2 = selectPageDataFiltersFromApplied('page1');
      expect(selector1).toBe(selector2);
    });
  });
});
