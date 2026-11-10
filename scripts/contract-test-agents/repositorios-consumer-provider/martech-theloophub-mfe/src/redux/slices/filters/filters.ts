import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FilterRegistry,
  PerformanceToolFilterDataTransformer,
} from 'domain/Filter';
import type {
  FilterForm,
  FilterPage,
  FiltersState,
  UpdateFormPayload,
  UpdateFormValuePayload,
} from 'models/Filters';

import { createInitialFilterPage } from './constants';
import { loadFilters } from './thunk/filtersThunk';

const noPageFoundError = 'Filters: Page not found';

const isPerformanceToolData = (rawData: any): boolean =>
  !!rawData && PerformanceToolFilterDataTransformer.isValidFormat(rawData);

const resolveNavigatedKpi = (previousKpi: any, fallback: any): string =>
  String(previousKpi || fallback || '').toLowerCase();

const resolvePageFilters = (
  currentPage: FilterPage | undefined,
  previousPage: FilterPage | undefined,
  page: FilterPage,
  isPerformanceTool: boolean,
) => {
  const resolved = FilterRegistry.resolveFilterCollisions(
    currentPage,
    previousPage,
    page.defaults,
  );

  if (!isPerformanceTool) {
    page.defaults = { ...resolved };
  }
  page.form = { ...resolved };
  page.applied = { ...resolved };
};

const computeDynamicDataFilters = (
  page: FilterPage,
  kpi: string,
  currentForm?: FilterForm,
) => {
  if (!isPerformanceToolData(page.rawData)) {
    return page.dataFilters || {};
  }
  return PerformanceToolFilterDataTransformer.transform(
    page.rawData,
    kpi,
    currentForm,
  );
};

const initialState: FiltersState = {
  pages: {},
  currentPage: null,
  previousPage: null,
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      if (state.currentPage === action.payload) {
        return;
      }

      state.previousPage = state.currentPage;
      state.currentPage = action.payload;

      const newPage = state.pages[action.payload];
      const hasDefaults =
        newPage?.status === 'loaded' &&
        Object.keys(newPage.defaults).length > 0;

      if (!hasDefaults) return;

      const isPerformanceTool = isPerformanceToolData(newPage.rawData);

      if (isPerformanceTool) {
        const previousKpi = state.pages[state.previousPage]?.applied?.kpis;
        const navigatedKpi = resolveNavigatedKpi(
          previousKpi,
          newPage.defaultKpi,
        );

        newPage.dataFilters = PerformanceToolFilterDataTransformer.transform(
          newPage.rawData,
          navigatedKpi,
        );
        newPage.defaultKpi = navigatedKpi;
        newPage.defaults = {
          ...FilterRegistry.calculateDefaults(newPage.dataFilters),
          kpis: navigatedKpi,
        };
      }

      resolvePageFilters(
        state.pages[action.payload],
        state.pages[state.previousPage],
        newPage,
        isPerformanceTool,
      );
    },

    updateFormValue: (state, action: PayloadAction<UpdateFormValuePayload>) => {
      const { key, value } = action.payload;
      const currentPage = state.currentPage;

      if (!currentPage || !state.pages[currentPage]) {
        console.warn(noPageFoundError);
        return;
      }

      const page = state.pages[currentPage];
      const form = page.form;
      const kpi = key === 'kpis' ? String(value) : String(form?.kpis);
      const dataFilters = computeDynamicDataFilters(page, kpi, {
        ...form,
        [key]: value,
      });

      page.form = FilterRegistry.resolveCascadingUpdates(
        dataFilters,
        form,
        key,
        value,
      );

      if (key === 'kpis') {
        page.dataFilters = dataFilters;
      }
    },

    resetAndApplyDefaults: (
      state,
      action: PayloadAction<UpdateFormPayload>,
    ) => {
      const { form } = action.payload;
      const currentPage = state.currentPage;

      if (!currentPage) {
        return;
      }

      const page = state.pages[currentPage];

      if (!page) {
        return;
      }

      page.form = { ...form };
    },

    applyFilters: (state) => {
      const currentPage = state.currentPage;

      if (!currentPage) {
        console.warn(noPageFoundError);
        return;
      }

      const page = state.pages[currentPage];

      if (!page) {
        console.warn(noPageFoundError);
        return;
      }

      page.applied = { ...page.form };
      page.lastUpdated = Date.now();
    },

    resetToDefaults: (state) => {
      const currentPage = state.currentPage;

      if (!currentPage) {
        console.warn(noPageFoundError);
        return;
      }

      const page = state.pages[currentPage];

      if (!page) {
        console.warn(noPageFoundError);
        return;
      }

      page.form = { ...page.defaults };
      page.applied = { ...page.defaults };
      page.lastUpdated = Date.now();
    },

    setFilterVisibility: (
      state,
      action: PayloadAction<{ page: string; isHidden: boolean }>,
    ) => {
      const { page, isHidden } = action.payload;
      if (state.pages[page]) {
        state.pages[page].isHidden = isHidden;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadFilters.pending, (state, action) => {
        const { pageName } = action.meta.arg;

        if (!state.pages[pageName]) {
          state.pages[pageName] = createInitialFilterPage();
        }

        const page = state.pages[pageName];

        if (page.status === 'idle' || page.status === undefined) {
          page.status = 'loading';
        }
      })

      .addCase(loadFilters.fulfilled, (state, action) => {
        const { pageName, dataFilters, cached, rawData, defaultKpi } =
          action.payload;
        const page = state.pages[pageName];

        if (!page) return;

        if (!cached && !dataFilters) {
          page.status = 'error';
          return;
        }

        const isPerformanceTool = isPerformanceToolData(rawData);
        const isRefresh = isPerformanceTool && !!page.defaultKpi;

        if (!cached && dataFilters) {
          page.rawData = rawData;

          if (isPerformanceTool && !page.defaultKpi) {
            const initialKpi = resolveNavigatedKpi(
              defaultKpi || rawData?.kpis?.values?.[0]?.value,
              '',
            );
            page.dataFilters = PerformanceToolFilterDataTransformer.transform(
              rawData,
              initialKpi,
            );
          } else if (!isPerformanceTool) {
            page.dataFilters = dataFilters;
          }

          if (!isRefresh) {
            page.defaults = FilterRegistry.calculateDefaults(page.dataFilters);
          }
        }

        if (!isRefresh) {
          if (isPerformanceTool) {
            const previousKpi = state.pages[state.previousPage]?.applied?.kpis;
            const navigatedKpi = resolveNavigatedKpi(
              defaultKpi || previousKpi,
              page.defaults?.kpis,
            );
            page.defaultKpi = navigatedKpi;
            page.defaults = { ...page.defaults, kpis: navigatedKpi };
          }

          resolvePageFilters(
            state.pages[pageName],
            state.pages[state.previousPage],
            page,
            isPerformanceTool,
          );
        }

        page.status = 'loaded';
      })

      .addCase(loadFilters.rejected, (state, action) => {
        const { pageName } = action.meta.arg;
        const page = state.pages[pageName];

        if (page) {
          page.status = 'error';
        }
      });
  },
});

export const {
  setCurrentPage,
  updateFormValue,
  resetAndApplyDefaults,
  applyFilters,
  resetToDefaults,
  setFilterVisibility,
} = filterSlice.actions;
